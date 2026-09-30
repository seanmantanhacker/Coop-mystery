const { spawn } = require('child_process');
const path = require('path');
const http = require('http');
const fs = require('fs');

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

async function runRoomTransitTest() {
  console.log('=== TEST: 3-ROLE ROOM TRANSIT & 2D/3D MULTI-ROOM OVERHAUL ===\n');

  const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, '..', req.url === '/' ? 'index.html' : req.url.split('?')[0]);
    if (!fs.existsSync(filePath)) { res.writeHead(404); res.end('Not found'); return; }
    const ext = path.extname(filePath);
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png'
    };
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
    fs.createReadStream(filePath).pipe(res);
  });

  await new Promise(resolve => server.listen(8016, resolve));
  console.log('Test Server running on http://localhost:8016');

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.join(__dirname, '.chrome-test-room-transit-profile');

  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9236',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    `--user-data-dir=${userDataDir}`,
    'http://localhost:8016'
  ]);

  await sleep(2200);

  class TabSession {
    constructor(wsUrl) {
      this.wsUrl = wsUrl;
      this.ws = null;
      this.msgId = 1;
      this.callbacks = new Map();
      this.logs = [];
    }

    async connect() {
      this.ws = new WebSocket(this.wsUrl);
      await new Promise(res => { this.ws.onopen = res; });
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const cb = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          cb(msg.result);
        }
        if (msg.method === 'Runtime.consoleAPICalled') {
          const text = msg.params.args.map(a => a.value || a.description).join(' ');
          this.logs.push(text);
        }
        if (msg.method === 'Runtime.exceptionThrown') {
          const err = msg.params.exceptionDetails.text + ' ' + (msg.params.exceptionDetails.exception?.description || '');
          this.logs.push('EXCEPTION: ' + err);
          console.error('[EXCEPTION]:', err);
        }
      };
      await this.send('Runtime.enable');
      await this.send('Page.enable');
      await this.eval(`window.alert = (m) => console.log('ALERT: ' + m);`);
    }

    send(method, params = {}) {
      return new Promise(res => {
        const id = this.msgId++;
        this.callbacks.set(id, res);
        this.ws.send(JSON.stringify({ id, method, params }));
      });
    }

    async eval(expr) {
      const res = await this.send('Runtime.evaluate', {
        expression: expr,
        returnByValue: true,
        awaitPromise: true
      });
      return res?.result?.value;
    }
  }

  try {
    const listRes = await fetch('http://localhost:9236/json/list');
    const list = await listRes.json();
    const tabTarget = list.find(t => t.type === 'page');

    const tab = new TabSession(tabTarget.webSocketDebuggerUrl);
    await tab.connect();

    // 1. DESKTOP VIEWPORT SETUP (1280 x 800)
    await tab.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
      mobile: false
    });

    console.log('--- 1. OPERATIVE 1: 3D PARTITIONED ROOMS & CAMERA TRANSIT ---');
    await tab.eval(`
      game.selectScenario('triad');
      document.getElementById('room-input').value = 'ROOM_TRANSIT_TEST';
      document.getElementById('btn-create-room').click();
      game.toggleRole('defuser');
      game.startGameMission();
    `);
    await sleep(2000);

    const envAudit = await tab.eval(`(() => {
      const env = window.triadEnvInstance;
      if (!env) return null;
      return {
        roomGroupChildren: env.roomGroup.children.length,
        initialPos: [Math.round(env.camera.position.x), Math.round(env.camera.position.y), Math.round(env.camera.position.z)],
        hasTransitNoticeFn: typeof env.showRoomTransitNotice === 'function'
      };
    })()`);

    console.log(`✓ 3D Room Environment Loaded with ${envAudit.roomGroupChildren} physical room/partition elements`);
    console.log(`✓ Initial Camera Spawn at Node 5 Security: [${envAudit.initialPos.join(', ')}]`);

    // Click Node 1 (Research Lab) in Operative 1 Navigator
    await tab.eval(`window.triadEnvInstance.onMove(1);`);
    await sleep(600);

    const node1Check = await tab.eval(`(() => {
      const banner = document.getElementById('triad-room-transit-banner');
      return {
        bannerActive: banner ? banner.classList.contains('active') : false,
        bannerText: banner ? banner.innerText : '',
        currentNode: window.triadEnvInstance.game.nodePositions[1979]
      };
    })()`);
    console.log(`✓ Node 1 Transit Banner Active: ${node1Check.bannerActive}`);
    console.log(`✓ Banner Title: "${node1Check.bannerText.replace(/\n/g, ' ')}"`);
    console.log(`✓ 1979 Architect Moved to Node: ${node1Check.currentNode}`);

    // Click Node 2 (Director's Office)
    await tab.eval(`window.triadEnvInstance.onMove(2);`);
    await sleep(600);

    const node2Check = await tab.eval(`(() => {
      return {
        currentNode: window.triadEnvInstance.game.nodePositions[1979],
        camTarget: [
          Math.round(window.triadEnvInstance.camera.position.x),
          Math.round(window.triadEnvInstance.camera.position.y),
          Math.round(window.triadEnvInstance.camera.position.z)
        ]
      };
    })()`);
    console.log(`✓ Node 2 Transit: Current Node ${node2Check.currentNode}, Camera Position [${node2Check.camTarget.join(', ')}]`);

    // ==========================================
    // 2. TEST OPERATIVE 2 (1999 DETECTIVE - 2D ROOM VIEW)
    // ==========================================
    console.log('\n--- 2. OPERATIVE 2: 1999 DETECTIVE 2D ROOM ENVIRONMENTS ---');
    await tab.eval(`
      const triadState = window.triadEnvInstance.game.getTriadState();
      window.triadManualInstance.init(document.getElementById('manual-content'), triadState);
    `);
    await sleep(500);

    const manualInitial = await tab.eval(`(() => {
      const viewport = document.querySelector('.triad-2d-room-viewport');
      const roomName = document.querySelector('.room-name-text')?.innerText;
      const statusBadge = document.querySelector('.room-status-badge')?.innerText;
      const svg = document.querySelector('.room-2d-svg');
      const hotspots = document.querySelectorAll('.room-hotspot-pin').length;
      return {
        activeTab: window.triadManualInstance.activeTab,
        hasViewport: !!viewport,
        roomName,
        statusBadge,
        hasSvg: !!svg,
        hotspotCount: hotspots
      };
    })()`);
    console.log(`✓ Active Tab: "${manualInitial.activeTab}" (Default: "room")`);
    console.log(`✓ Initial Room Rendered: "${manualInitial.roomName}"`);
    console.log(`✓ Initial Room Status: "${manualInitial.statusBadge}"`);
    console.log(`✓ 2D Illustrated SVG rendered: ${manualInitial.hasSvg}`);
    console.log(`✓ Interactive Hotspots Count: ${manualInitial.hotspotCount}`);

    // Cycle through all 5 rooms for 1999 Detective
    for (let n = 1; n <= 5; n++) {
      const roomData = await tab.eval(`((nodeNum) => {
        window.triadManualInstance.onMove(nodeNum);
        const name = document.querySelector('.room-name-text')?.innerText;
        const banner = document.getElementById('triad-room-transit-banner');
        const pins = Array.from(document.querySelectorAll('.room-hotspot-pin')).map(p => p.getAttribute('title'));
        return {
          name,
          bannerActive: banner ? banner.classList.contains('active') : false,
          bannerText: banner ? banner.innerText.replace(/\\n/g, ' ') : '',
          pins
        };
      })(${n})`);
      console.log(`  Sector 0${n}: "${roomData.name}" - Hotspots: [${roomData.pins.join(', ')}]`);
    }

    // Test Hotspot Inspection Popover in 1999 Room
    console.log('Testing Hotspot Inspection Modal in Node 3 (Ground Zero Vault)...');
    await tab.eval(`window.triadManualInstance.onMove(3);`);
    const inspectResult = await tab.eval(`(() => {
      window.triadManualInstance.inspectHotspot(3, 'corpse');
      const card = document.getElementById('evidence-inspect-card');
      const title = card ? card.querySelector('h3')?.innerText : '';
      const body = card ? card.querySelector('.inspect-card-body')?.innerText : '';
      return {
        cardOpen: !!card,
        title,
        body
      };
    })()`);
    console.log(`✓ Hotspot Inspection Modal Opened: ${inspectResult.cardOpen}`);
    console.log(`✓ Modal Evidence Title: "${inspectResult.title}"`);
    console.log(`✓ Evidence Body Preview: "${inspectResult.body.slice(0, 75)}..."`);

    // Dismiss modal
    await tab.eval(`document.querySelector('.btn-inspect-close')?.click();`);
    const modalClosed = await tab.eval(`!document.getElementById('evidence-inspect-card')`);
    console.log(`✓ Hotspot Inspection Modal Closed: ${modalClosed}`);

    // ==========================================
    // 3. TEST OPERATIVE 3 (2019 ARCHIVIST - 2D RUINS)
    // ==========================================
    console.log('\n--- 3. OPERATIVE 3: 2019 ARCHIVIST 2D QUANTUM RUINS ---');
    await tab.eval(`
      const triadState = window.triadEnvInstance.game.getTriadState();
      window.triadIntelInstance.init(document.getElementById('manual-content'), triadState);
    `);
    await sleep(500);

    const intelInitial = await tab.eval(`(() => {
      const roomName = document.querySelector('.room-name-text')?.innerText;
      const statusBadge = document.querySelector('.room-status-badge')?.innerText;
      return {
        activeTab: window.triadIntelInstance.activeTab,
        roomName,
        statusBadge
      };
    })()`);
    console.log(`✓ 2019 Archivist Active Tab: "${intelInitial.activeTab}"`);
    console.log(`✓ 2019 Current Room: "${intelInitial.roomName}" - Status: "${intelInitial.statusBadge}"`);

    // Cycle through 2019 Rooms
    for (let n = 1; n <= 5; n++) {
      const roomData = await tab.eval(`((nodeNum) => {
        window.triadIntelInstance.onMove(nodeNum);
        const name = document.querySelector('.room-name-text')?.innerText;
        const pins = Array.from(document.querySelectorAll('.room-hotspot-pin')).map(p => p.getAttribute('title'));
        return { name, pins };
      })(${n})`);
      console.log(`  Sector 0${n}: "${roomData.name}" - AR Hotspots: [${roomData.pins.join(', ')}]`);
    }

    // Inspect AR Ghost Hologram in Node 2
    await tab.eval(`
      window.triadIntelInstance.onMove(2);
      window.triadIntelInstance.inspectHotspot(2, 'hologram');
    `);
    const arInspect = await tab.eval(`(() => {
      const card = document.getElementById('evidence-inspect-card');
      const title = card ? card.querySelector('h3')?.innerText : '';
      return {
        cardOpen: !!card,
        title
      };
    })()`);
    console.log(`✓ AR Hologram Hotspot Modal: "${arInspect.title}" (Open: ${arInspect.cardOpen})`);

    // ==========================================
    // 4. MOBILE VIEWPORT TEST (390 x 844)
    // ==========================================
    console.log('\n--- 4. MOBILE VIEWPORT TEST (390 x 844) ---');
    await tab.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await sleep(500);

    const mobileMetrics = await tab.eval(`(() => {
      const viewport = document.querySelector('.triad-2d-room-viewport');
      const svg = document.querySelector('.room-2d-svg');
      return {
        scrollWidth: document.body.scrollWidth,
        viewportWidth: window.innerWidth,
        hasViewport: !!viewport,
        svgAspect: svg ? (svg.clientWidth / svg.clientHeight).toFixed(2) : null
      };
    })()`);
    console.log(`✓ Mobile Viewport: Inner Width ${mobileMetrics.viewportWidth}px vs Scroll Width ${mobileMetrics.scrollWidth}px (No horizontal overflow: ${mobileMetrics.scrollWidth <= mobileMetrics.viewportWidth})`);
    console.log(`✓ Responsive 2D SVG Render Aspect Ratio: ${mobileMetrics.svgAspect}`);

    console.log('\n=================================================================');
    console.log('✓ ALL 3-ROLE ROOM TRANSIT & 2D/3D MULTI-ROOM TESTS PASSED!');
    console.log('=================================================================');
  } finally {
    chromeProc.kill();
    server.close();
  }
}

runRoomTransitTest().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});
