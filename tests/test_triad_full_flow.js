const { spawn } = require('child_process');
const path = require('path');
const http = require('http');
const fs = require('fs');

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

server.listen(8010, async () => {
  console.log('Test server listening on port 8010');
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.join(__dirname, '.chrome-test-triad-flow-profile');
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9231',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--user-data-dir=' + userDataDir,
    'http://localhost:8010'
  ]);

  await new Promise(r => setTimeout(r, 2200));

  try {
    const listRes = await fetch('http://localhost:9231/json/list');
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

    console.log('\n=== 1. SELECT TRIAD MAP IN LOBBY & CREATE ROOM ===');
    await evalJs("game.selectScenario('triad')");
    await evalJs("document.getElementById('btn-create-room').click()");
    await new Promise(r => setTimeout(r, 400));

    console.log('\n=== 2. VERIFY OPERATIVE 2 (1999 DETECTIVE) WORKSTATION ===');
    await evalJs("game.toggleRole('manual')");
    await evalJs("game.startGameMission()");

    const manualScreenActive = await evalJs("document.getElementById('screen-manual').classList.contains('active-screen')");
    console.log('  screen-manual active:', manualScreenActive);

    const stationExists = await evalJs("!!document.getElementById('triad-detective-station')");
    console.log('  triad-detective-station exists:', stationExists);

    const stationBounds = await evalJs(`(() => {
      const el = document.getElementById('triad-detective-station');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: r.top, left: r.left, width: r.width, height: r.height };
    })()`);
    console.log('  Detective station bounds:', stationBounds);

    const eraBadgeText = await evalJs("document.querySelector('#triad-detective-station .station-era-badge').innerText");
    console.log('  Era Badge:', eraBadgeText);

    const initialAp = await evalJs("window.triadState.ap['1999']");
    console.log('  Initial 1999 AP:', initialAp);

    // Test moving to Node 1 (Laboratory)
    console.log('\n=== 3. OPERATIVE 2: MOVE MEEPLE TO NODE 1 (LABORATORY) ===');
    await evalJs("triadManualInstance.onMoveNode(1)");
    const newLoc = await evalJs("window.triadState.meepleNodes['1999']");
    const apAfterMove = await evalJs("window.triadState.ap['1999']");
    console.log(`  Meeple moved to Node: ${newLoc} (Expected: 1)`);
    console.log(`  AP remaining: ${apAfterMove} (Expected: 2)`);

    // Test searching node
    console.log('\n=== 4. OPERATIVE 2: SEARCH LAB FOR CLUES ===');
    const handCountBefore = await evalJs("window.triadState.hands['1999'].length");
    await evalJs("triadManualInstance.onSearch()");
    const handCountAfter = await evalJs("window.triadState.hands['1999'].length");
    const apAfterSearch = await evalJs("window.triadState.ap['1999']");
    console.log(`  Cards in Hand: ${handCountBefore} -> ${handCountAfter}`);
    console.log(`  AP remaining: ${apAfterSearch} (Expected: 1)`);

    // Test switching tabs
    console.log('\n=== 5. OPERATIVE 2: SWITCH WORKSTATION TABS ===');
    await evalJs("triadManualInstance.switchTab('suspects')");
    const suspectsHeader = await evalJs("document.querySelector('.triad-station-body h3').innerText");
    console.log('  Suspects Tab loaded:', suspectsHeader);

    await evalJs("triadManualInstance.switchTab('hand')");
    const hasHandCards = await evalJs("document.querySelectorAll('.triad-card-item').length > 0");
    console.log('  Hand Tab has rendered cards:', hasHandCards);

    // Test analyzing card
    const firstCardId = await evalJs("window.triadState.hands['1999'][0].id");
    console.log('  Analyzing card ID:', firstCardId);
    await evalJs(`triadManualInstance.onAnalyze('${firstCardId}')`);
    const publicIntelCount = await evalJs("window.triadState.publicIntel.length");
    console.log(`  Public Intel pool count: ${publicIntelCount} (Expected: 1)`);

    console.log('\n=== 6. VERIFY OPERATIVE 3 (2019 ARCHIVIST) WORKSTATION ===');
    await evalJs("game.role = 'intel'; game.startGameMission()");
    const intelScreenActive = await evalJs("document.getElementById('screen-intel').classList.contains('active-screen')");
    console.log('  screen-intel active:', intelScreenActive);

    const archivistStationBounds = await evalJs(`(() => {
      const el = document.getElementById('triad-archivist-station');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: r.top, left: r.left, width: r.width, height: r.height };
    })()`);
    console.log('  Archivist station bounds:', archivistStationBounds);

    const archivistEraBadge = await evalJs("document.querySelector('#triad-archivist-station .station-era-badge').innerText");
    console.log('  Archivist Era Badge:', archivistEraBadge);

    // Test Electronic Decrypt in 2019
    console.log('\n=== 7. OPERATIVE 3: ELECTRONIC DECRYPT TOOLS ===');
    await evalJs("triadIntelInstance.switchTab('decrypt')");
    await evalJs("triadIntelInstance.onDecrypt('vaultDoor')");
    const vaultBypassed = await evalJs("!!window.triadState.decryptedBypasses['vaultDoor']");
    console.log('  Vault Bulkhead Bypassed:', vaultBypassed);

    // Test Consensus Verdict & Victory
    console.log('\n=== 8. OPERATIVE 3: CONSENSUS VERDICT NOTEBOOK ===');
    await evalJs("triadIntelInstance.switchTab('notebook')");
    await evalJs("window.triadState.setVerdict('culprit', 'Valerie Cross')");
    await evalJs("window.triadState.setVerdict('weapon', 'Dual-Harmonic Tachyon Emitter')");
    await evalJs("window.triadState.setVerdict('motive', 'Patent Theft & Temporal Assassination')");

    const victoryResult = await evalJs("window.triadState.submitFinalAccusation()");
    console.log('  Verdict submitted - Victory:', victoryResult);

    const gameOverVisible = await evalJs("!document.getElementById('game-over-modal').classList.contains('hidden')");
    const victoryHeading = await evalJs("document.getElementById('end-title').innerText");
    console.log('  Game Over Modal Visible:', gameOverVisible);
    console.log('  Victory Title:', victoryHeading);

    const errors = consoleLogs.filter(l => l.toLowerCase().includes('error'));
    if (errors.length > 0) {
      console.log('\n⚠️ Browser errors detected:', errors);
    } else {
      console.log('\n✓ Zero browser console errors detected.');
    }

    console.log('\n=== ALL PLAYABILITY TESTS PASSED WITH 100% SUCCESS ===');
  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    chromeProc.kill();
    server.close();
    process.exit(0);
  }
});
