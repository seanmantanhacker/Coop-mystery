const { spawn } = require('child_process');
const path = require('path');
const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, '..', req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  if (!fs.existsSync(filePath)) { res.writeHead(404); res.end('Not found'); return; }
  const ext = path.extname(filePath);
  const mimeTypes = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png' };
  res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(8009, async () => {
  console.log('Server started on 8009');
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.join(__dirname, '.chrome-test-roles-profile');
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9230',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--user-data-dir=' + userDataDir,
    'http://localhost:8009'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  try {
    const listRes = await fetch('http://localhost:9230/json/list');
    const list = await listRes.json();
    const pageTarget = list.find(t => t.type === 'page');
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise(res => { ws.onopen = res; });
    let msgId = 1;
    const callbacks = new Map();
    const consoleLogs = [];
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        const text = msg.params.args.map(a => a.value || a.description).join(' ');
        consoleLogs.push('[Console] ' + text);
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
      const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
      return res?.result?.value;
    }
    await send('Runtime.enable');
    await send('Page.enable');

    console.log('Selecting scenario triad...');
    await evalJs("game.selectScenario('triad')");
    await evalJs("document.getElementById('btn-create-room').click()");
    await new Promise(r => setTimeout(r, 400));

    console.log('\n--- TESTING OPERATIVE 2 (MANUAL / 1999 DETECTIVE) ---');
    await evalJs("game.toggleRole('manual')");
    await evalJs("game.startGameMission()");

    const manualScreenActive = await evalJs("document.getElementById('screen-manual').classList.contains('active-screen')");
    console.log('Manual screen active:', manualScreenActive);

    const detectiveStationExists = await evalJs("!!document.getElementById('triad-detective-station')");
    console.log('Detective station element exists in DOM:', detectiveStationExists);

    const stationRect = await evalJs(`(() => {
      const el = document.getElementById('triad-detective-station');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: r.top, left: r.left, width: r.width, height: r.height };
    })()`);
    console.log('Detective station bounding rect:', stationRect);

    const viewportRect = await evalJs(`(() => {
      const el = document.querySelector('#screen-manual .room-viewport');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return { top: r.top, left: r.left, width: r.width, height: r.height, display: style.display };
    })()`);
    console.log('Manual room-viewport rect and display:', viewportRect);

    const manualInnerVisible = await evalJs(`(() => {
      const el = document.getElementById('triad-detective-station');
      if (!el) return false;
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    })()`);
    console.log('Detective station computed style visible:', manualInnerVisible);

    console.log('\n--- TESTING OPERATIVE 3 (INTEL / 2019 ARCHIVIST) ---');
    await evalJs("game.role = 'intel'; game.startGameMission()");
    const intelScreenActive = await evalJs("document.getElementById('screen-intel').classList.contains('active-screen')");
    console.log('Intel screen active:', intelScreenActive);

    const archivistStationExists = await evalJs("!!document.getElementById('triad-archivist-station')");
    console.log('Archivist station element exists in DOM:', archivistStationExists);

    const archivistRect = await evalJs(`(() => {
      const el = document.getElementById('triad-archivist-station');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: r.top, left: r.left, width: r.width, height: r.height };
    })()`);
    console.log('Archivist station bounding rect:', archivistRect);

    const intelViewportRect = await evalJs(`(() => {
      const el = document.querySelector('#screen-intel .room-viewport');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return { top: r.top, left: r.left, width: r.width, height: r.height, display: style.display };
    })()`);
    console.log('Intel room-viewport rect and display:', intelViewportRect);

    console.log('\nConsole logs:', consoleLogs);
  } catch(e) {
    console.error('Error during test:', e);
  } finally {
    chromeProc.kill();
    server.close();
    process.exit(0);
  }
});
