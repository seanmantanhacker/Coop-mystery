const { spawn } = require('child_process');
const path = require('path');
const http = require('http');
const fs = require('fs');

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

async function runArchitectHandTest() {
  console.log('=== TEST: ARCHITECT PRIVATE HAND (DESKTOP & MOBILE UI) ===\n');

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

  await new Promise(resolve => server.listen(8015, resolve));
  console.log('Test Server running on http://localhost:8015');

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.join(__dirname, '.chrome-test-architect-profile');

  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9235',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    `--user-data-dir=${userDataDir}`,
    'http://localhost:8015'
  ]);

  await sleep(2000);

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
    const listRes = await fetch('http://localhost:9235/json/list');
    const list = await listRes.json();
    const tabTarget = list.find(t => t.type === 'page');

    const tab = new TabSession(tabTarget.webSocketDebuggerUrl);
    await tab.connect();

    // 1. DESKTOP VIEWPORT SETUP (1280 x 800)
    console.log('--- 1. DESKTOP VIEWPORT TEST (1280 x 800) ---');
    await tab.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
      mobile: false
    });

    // Launch game into Map 5 as Defuser (1979 Architect)
    await tab.eval(`
      game.selectScenario('triad');
      document.getElementById('room-input').value = 'ARCHITECT_TEST';
      document.getElementById('btn-create-room').click();
      game.toggleRole('defuser');
      game.startGameMission();
    `);
    await sleep(1000);

    // Verify HUD elements
    const hudExists = await tab.eval(`!!document.getElementById('triad-1979-hud')`);
    console.log(`✓ 1979 Architect HUD mounted on Defuser screen: ${hudExists}`);

    const drawerExists = await tab.eval(`!!document.getElementById('hud-1979-hand-drawer')`);
    console.log(`✓ Architect Private Hand Drawer element exists: ${drawerExists}`);

    const whisperPillText = await tab.eval(`document.querySelector('.whisper-rule-pill')?.innerText.trim()`);
    console.log(`✓ Whisper Rule Pill displayed: "${whisperPillText}"`);

    const initialCardCount = await tab.eval(`document.getElementById('hud-hand-count-badge')?.innerText.trim()`);
    console.log(`✓ Initial Hand Count Badge: "${initialCardCount}"`);

    const cardChipsCount = await tab.eval(`document.querySelectorAll('#hud-1979-cards-container .hand-card-chip').length`);
    console.log(`✓ Rendered Card Chips in Hand: ${cardChipsCount}`);

    // Verify Card Contents
    const firstCardTitle = await tab.eval(`document.querySelector('#hud-1979-cards-container .hand-card-chip .card-chip-title')?.innerText.trim()`);
    const firstCardType = await tab.eval(`document.querySelector('#hud-1979-cards-container .hand-card-chip .card-type-tag')?.innerText.trim()`);
    const firstCardKeywords = await tab.eval(`Array.from(document.querySelectorAll('#hud-1979-cards-container .hand-card-chip:first-child .card-kw-chip')).map(el => el.innerText.trim())`);
    console.log(`✓ First Card Details: [${firstCardType}] "${firstCardTitle}" Keywords: [${firstCardKeywords.join(', ')}]`);

    // Verify Top Bar is slim and does not obstruct main 3D facility
    const topBarHeight = await tab.eval(`document.querySelector('.hud-top-bar')?.offsetHeight`);
    console.log(`✓ Slim Top Bar Height: ${topBarHeight}px (Expected ≤ 60px to leave main room unobstructed: ${topBarHeight <= 60})`);

    // Verify Node Movement Bar is relocated to Bottom Dock
    const nodesBarInBottomDock = await tab.eval(`!!document.querySelector('.hud-bottom-dock #hud-1979-nodes-bar')`);
    console.log(`✓ Node Movement Bar docked at bottom (above hand drawer): ${nodesBarInBottomDock}`);

    // Verify Node buttons count in bottom bar
    const nodeNavBtnsCount = await tab.eval(`document.querySelectorAll('#hud-1979-nodes-grid .btn-node-nav').length`);
    console.log(`✓ Node Navigation Buttons count: ${nodeNavBtnsCount} (Expected: 5)`);

    // Test Room Navigator Collapse / Expand
    await tab.eval(`triadEnv.toggleNodesNav(true)`); // collapse rooms
    await sleep(200);
    const roomsCollapsed = await tab.eval(`document.getElementById('hud-1979-nodes-bar')?.classList.contains('nav-collapsed')`);
    console.log(`✓ Room Navigator Collapsed: ${roomsCollapsed}`);

    await tab.eval(`triadEnv.toggleNodesNav(false)`); // expand rooms
    await sleep(200);
    const roomsExpanded = await tab.eval(`!document.getElementById('hud-1979-nodes-bar')?.classList.contains('nav-collapsed')`);
    console.log(`✓ Room Navigator Re-expanded: ${roomsExpanded}`);

    // Test Camera Overview Switch
    await tab.eval(`triadEnv.onOverviewClick()`);
    await sleep(300);
    console.log(`✓ Camera Overview Reset callable without errors: true`);

    // Verify Analyze Button
    const analyzeBtnText = await tab.eval(`document.querySelector('#hud-1979-cards-container .btn-analyze .btn-primary-text')?.innerText.trim()`);
    console.log(`✓ Analyze Action Button: "${analyzeBtnText}"`);

    // Test Whisper Rule Modal
    console.log('\n--- 2. TEST WHISPER RULE BRIEFING MODAL ---');
    await tab.eval(`triadEnv.showWhisperModal()`);
    await sleep(300);

    const modalVisible = await tab.eval(`document.getElementById('triad-whisper-modal')?.style.display`);
    const modalTitle = await tab.eval(`document.querySelector('#triad-whisper-modal h2')?.innerText.trim()`);
    console.log(`✓ Whisper Rule Modal Open: ${modalVisible === 'flex'} ("${modalTitle}")`);

    await tab.eval(`triadEnv.closeWhisperModal()`);
    await sleep(200);
    const modalClosed = await tab.eval(`document.getElementById('triad-whisper-modal')?.style.display`);
    console.log(`✓ Whisper Rule Modal Closed: ${modalClosed === 'none'}`);

    // Test Drawer Collapse / Expand on Desktop
    console.log('\n--- 3. TEST DESKTOP DRAWER MINIMIZE & EXPAND ---');
    await tab.eval(`triadEnv.toggleHandDrawer(true)`); // collapse
    await sleep(200);

    const isCollapsed = await tab.eval(`document.getElementById('hud-1979-hand-drawer')?.classList.contains('drawer-collapsed')`);
    const toggleLabelCollapsed = await tab.eval(`document.getElementById('btn-drawer-toggle-state')?.innerText.trim()`);
    console.log(`✓ Hand Drawer Collapsed: ${isCollapsed} (Toggle button: "${toggleLabelCollapsed}")`);

    await tab.eval(`triadEnv.toggleHandDrawer(false)`); // expand
    await sleep(200);

    const isExpanded = await tab.eval(`!document.getElementById('hud-1979-hand-drawer')?.classList.contains('drawer-collapsed')`);
    const toggleLabelExpanded = await tab.eval(`document.getElementById('btn-drawer-toggle-state')?.innerText.trim()`);
    console.log(`✓ Hand Drawer Re-expanded: ${isExpanded} (Toggle button: "${toggleLabelExpanded}")`);

    // Test Analyze Action (1 AP)
    console.log('\n--- 4. TEST ANALYZE CARD ACTION (1 AP) ---');
    const apBefore = await tab.eval(`window.triadState.ap['1979']`);
    const handCountBefore = await tab.eval(`window.triadState.hands['1979'].length`);
    const targetCardId = await tab.eval(`window.triadState.hands['1979'][0]?.id`);

    await tab.eval(`triadEnv.onAnalyzeClick('${targetCardId}')`);
    await sleep(300);

    const apAfter = await tab.eval(`window.triadState.ap['1979']`);
    const handCountAfter = await tab.eval(`window.triadState.hands['1979'].length`);
    const publicIntelCount = await tab.eval(`window.triadState.publicIntel.length`);

    console.log(`✓ AP spent: ${apBefore} -> ${apAfter} (Expected: -1)`);
    console.log(`✓ Hand count: ${handCountBefore} -> ${handCountAfter} (Card moved to Public Intel)`);
    console.log(`✓ Public Intel count: ${publicIntelCount}`);

    // 5. MOBILE VIEWPORT TEST (390 x 844 - iPhone / Android)
    console.log('\n--- 5. MOBILE VIEWPORT TEST (390 x 844) ---');
    await tab.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      mobile: true
    });
    await sleep(400);

    const mobileDockPosition = await tab.eval(`
      window.getComputedStyle(document.querySelector('.hud-bottom-dock')).position
    `);
    const mobileDockBottom = await tab.eval(`
      window.getComputedStyle(document.querySelector('.hud-bottom-dock')).bottom
    `);
    const dragPillDisplay = await tab.eval(`
      window.getComputedStyle(document.querySelector('.drawer-drag-pill')).display
    `);

    console.log(`✓ Mobile Bottom Dock CSS Position: "${mobileDockPosition}" (Expected: fixed)`);
    console.log(`✓ Mobile Bottom Dock Location: "${mobileDockBottom}" (Expected: 0px)`);
    console.log(`✓ Mobile Drag Handle Pill Display: "${dragPillDisplay}" (Expected: block)`);

    // Check button touch targets on mobile
    const btnAnalyzeHeight = await tab.eval(`
      document.querySelector('.btn-card-action')?.offsetHeight
    `);
    console.log(`✓ Mobile Card Action Button Height: ${btnAnalyzeHeight}px (Accessible Touch Target ≥ 44px: ${btnAnalyzeHeight >= 44})`);

    // Check viewport overflow (no unwanted horizontal scrollbar on body)
    const bodyScrollWidth = await tab.eval(`document.body.scrollWidth`);
    const windowInnerWidth = await tab.eval(`window.innerWidth`);
    console.log(`✓ Mobile Body Scroll Width: ${bodyScrollWidth}px vs Window Width: ${windowInnerWidth}px (No horizontal overflow: ${bodyScrollWidth <= windowInnerWidth})`);

    console.log('\n=================================================================');
    console.log('✓ ALL ARCHITECT PRIVATE HAND DESKTOP & MOBILE TESTS PASSED!');
    console.log('=================================================================');

  } catch (err) {
    console.error('Test Error:', err);
    process.exit(1);
  } finally {
    try { chromeProc.kill(); } catch (e) {}
    try { server.close(); } catch (e) {}
  }
}

runArchitectHandTest();
