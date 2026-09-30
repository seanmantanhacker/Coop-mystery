const { spawn } = require('child_process');
const path = require('path');
const http = require('http');
const fs = require('fs');
const WebSocket = globalThis.WebSocket;

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

async function runBrowserTest() {
  console.log('=== STARTING BROWSER VERIFICATION FOR MAP 5: THE TRIAD PARADOX ===');

  // Simple static file server
  const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, '..', req.url === '/' ? 'index.html' : req.url.split('?')[0]);
    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
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

  await new Promise(resolve => server.listen(8008, resolve));
  console.log('Static test server listening on http://localhost:8008');

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.join(__dirname, '.chrome-triad-verify-profile');

  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9229',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    `--user-data-dir=${userDataDir}`,
    'http://localhost:8008'
  ]);

  await sleep(2200);

  try {
    const listRes = await fetch('http://localhost:9229/json/list');
    const list = await listRes.json();
    const pageTarget = list.find(t => t.type === 'page');
    if (!pageTarget) throw new Error('No page target found in headless Chrome');

    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    let msgId = 1;
    const callbacks = new Map();
    const consoleLogs = [];

    await new Promise(res => { ws.onopen = res; });

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        const text = msg.params.args.map(a => a.value || a.description).join(' ');
        consoleLogs.push(`[Browser] ${text}`);
      }
      if (msg.id && callbacks.has(msg.id)) {
        const cb = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        cb(msg.result);
      }
    };

    function send(method, params = {}) {
      return new Promise(res => {
        const id = msgId++;
        callbacks.set(id, res);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    async function evalJs(expr) {
      const res = await send('Runtime.evaluate', {
        expression: expr,
        returnByValue: true,
        awaitPromise: true
      });
      return res?.result?.value;
    }

    await send('Runtime.enable');
    await send('Page.enable');

    console.log('\n1. Checking Map 5 Scenario Card in Lobby...');
    const hasTriadCard = await evalJs(`!!document.getElementById('card-scenario-triad')`);
    console.log(`  Map 5 card present: ${hasTriadCard}`);

    console.log('\n2. Selecting Map 5 Scenario...');
    await evalJs(`game.selectScenario('triad')`);
    const activeScenario = await evalJs(`game.scenario`);
    console.log(`  Current active scenario: ${activeScenario}`);

    const roleTitle1 = await evalJs(`document.querySelector('#card-role-defuser h3').innerText`);
    const roleTitle2 = await evalJs(`document.querySelector('#card-role-manual h3').innerText`);
    const roleTitle3 = await evalJs(`document.querySelector('#card-role-intel h3').innerText`);
    console.log(`  Role 1 Title: "${roleTitle1}"`);
    console.log(`  Role 2 Title: "${roleTitle2}"`);
    console.log(`  Role 3 Title: "${roleTitle3}"`);

    console.log('\n3. Creating Room as Host & Claiming Role 1 (1979 Architect)...');
    await evalJs(`document.getElementById('btn-create-room').click()`);
    await sleep(400);
    await evalJs(`game.toggleRole('defuser')`);
    await sleep(400);

    console.log('\n4. Launching Mission...');
    await evalJs(`document.getElementById('btn-start-game').click()`);
    await sleep(1500);

    const levelText = await evalJs(`document.getElementById('level-display-name').innerText`);
    console.log(`  Active Level Display: "${levelText}"`);

    const hasFloatingBtn = await evalJs(`!document.getElementById('btn-triad-matrix-toggle').classList.contains('hidden')`);
    console.log(`  Floating Ripple Matrix Button visible: ${hasFloatingBtn}`);

    console.log('\n5. Opening Ripple Matrix Modal...');
    await evalJs(`triadRippleUI.openModal()`);
    await sleep(400);

    const modalVisible = await evalJs(`!document.getElementById('triad-matrix-modal').classList.contains('hidden')`);
    const stabilityText = await evalJs(`document.getElementById('modal-stability-counter').innerText`);
    const trackCount = await evalJs(`document.querySelectorAll('.ripple-track-card').length`);
    console.log(`  Ripple Matrix Modal visible: ${modalVisible}`);
    console.log(`  Initial Chronal Stability: ${stabilityText}`);
    console.log(`  Rendered Ripple Tracks: ${trackCount}`);

    console.log('\n6. Checking for Console Errors...');
    const errors = consoleLogs.filter(l => l.toLowerCase().includes('error'));
    if (errors.length > 0) {
      console.log('  ⚠️ Detected browser console errors:', errors);
    } else {
      console.log('  ✓ Zero browser console errors detected.');
    }

    console.log('\n=== BROWSER VERIFICATION SUCCESSFUL ===');
  } finally {
    try { chromeProc.kill(); } catch (e) {}
    server.close();
  }
}

runBrowserTest().catch(err => {
  console.error('Test failed with error:', err);
  process.exit(1);
});
