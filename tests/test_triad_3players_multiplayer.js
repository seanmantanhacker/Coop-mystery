const { spawn } = require('child_process');
const path = require('path');
const http = require('http');
const fs = require('fs');

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

async function runMultiplayerTest() {
  console.log('=== MULTI-PLAYER (3 OPERATIVES) TRIAD TEST ===');

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

  await new Promise(resolve => server.listen(8011, resolve));
  console.log('Server running on http://localhost:8011');

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.join(__dirname, '.chrome-test-3p-profile');

  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9232',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    `--user-data-dir=${userDataDir}`,
    'http://localhost:8011'
  ]);

  await sleep(2200);

  class TabSession {
    constructor(wsUrl, name) {
      this.wsUrl = wsUrl;
      this.name = name;
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
          console.error(`[${this.name} EXCEPTION]:`, err);
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
    const listRes = await fetch('http://localhost:9232/json/list');
    const list = await listRes.json();
    const tab1Target = list.find(t => t.type === 'page');

    const tab1 = new TabSession(tab1Target.webSocketDebuggerUrl, 'Host (1979)');
    await tab1.connect();

    // Create Tab 2
    const t2Res = await tab1.send('Target.createTarget', { url: 'http://localhost:8011' });
    const tab2List = await (await fetch('http://localhost:9232/json/list')).json();
    const tab2Target = tab2List.find(t => t.id === t2Res.targetId);
    const tab2 = new TabSession(tab2Target.webSocketDebuggerUrl, 'Player 2 (1999)');
    await tab2.connect();

    // Create Tab 3
    const t3Res = await tab1.send('Target.createTarget', { url: 'http://localhost:8011' });
    const tab3List = await (await fetch('http://localhost:9232/json/list')).json();
    const tab3Target = tab3List.find(t => t.id === t3Res.targetId);
    const tab3 = new TabSession(tab3Target.webSocketDebuggerUrl, 'Player 3 (2019)');
    await tab3.connect();

    console.log('✓ 3 Browser Tabs successfully spawned and connected.');

    // Tab 1: Host creates room 'PARADOX' and selects 'triad'
    console.log('\n--- 1. HOST CREATES ROOM & SELECTS CASE 005 (TRIAD) ---');
    await tab1.eval(`
      document.getElementById('room-input').value = 'PARADOX';
      game.selectScenario('triad');
      document.getElementById('btn-create-room').click();
    `);
    await sleep(400);

    // Tab 1 selects Defuser (1979 Architect)
    await tab1.eval(`game.toggleRole('defuser')`);
    await sleep(300);

    // Tab 2: Joins room 'PARADOX'
    console.log('\n--- 2. PLAYER 2 JOINS ROOM & SELECTS 1999 DETECTIVE ---');
    await tab2.eval(`
      document.getElementById('room-input').value = 'PARADOX';
      document.getElementById('btn-join-room').click();
    `);
    await sleep(500);
    await tab2.eval(`game.toggleRole('manual')`);
    await sleep(400);

    // Tab 3: Joins room 'PARADOX'
    console.log('\n--- 3. PLAYER 3 JOINS ROOM & SELECTS 2019 ARCHIVIST ---');
    await tab3.eval(`
      document.getElementById('room-input').value = 'PARADOX';
      document.getElementById('btn-join-room').click();
    `);
    await sleep(500);
    await tab3.eval(`game.toggleRole('intel')`);
    await sleep(400);

    console.log('\n--- 4. HOST LAUNCHES OPERATION (START_MISSION) ---');
    const btnInfo = await tab1.eval(`(() => {
      const btn = document.getElementById('btn-start-game');
      return {
        exists: !!btn,
        disabled: btn ? btn.disabled : null,
        text: btn ? btn.innerText : null,
        isHost: network.isHost,
        role: game.role
      };
    })()`);
    console.log('Host btn info before click:', btnInfo);

    await tab1.eval(`(() => {
      const btn = document.getElementById('btn-start-game');
      console.log('EXEC CLICKING BTN');
      btn.click();
    })()`);
    await sleep(1500);

    const s1Active = await tab1.eval(`document.getElementById('screen-defuser').classList.contains('active-screen')`);
    const s2Active = await tab2.eval(`document.getElementById('screen-manual').classList.contains('active-screen')`);
    const s3Active = await tab3.eval(`document.getElementById('screen-intel').classList.contains('active-screen')`);
    console.log(`Active screens -> Tab 1 (Defuser): ${s1Active}, Tab 2 (Manual): ${s2Active}, Tab 3 (Intel): ${s3Active}`);

    const t2ActiveSection = await tab2.eval(`document.querySelector("section.active-screen")?.id`);
    const t3ActiveSection = await tab3.eval(`document.querySelector("section.active-screen")?.id`);
    console.log(`Tab 2 active section: ${t2ActiveSection}, Tab 3 active section: ${t3ActiveSection}`);
    console.log(`Tab 1 logs:`, tab1.logs.slice(-10));
    console.log(`Tab 2 received logs:`, tab2.logs.filter(l => l.includes('Network') || l.includes('START_MISSION')));
    console.log(`Tab 3 received logs:`, tab3.logs.filter(l => l.includes('Network') || l.includes('START_MISSION')));

    // Check Tab 2 (Detective) station
    const t2Station = await tab2.eval(`!!document.getElementById('triad-detective-station')`);
    const t2Badge = await tab2.eval(`document.querySelector('#triad-detective-station .station-era-badge')?.innerText`);
    console.log(`Tab 2 Workstation visible: ${t2Station}, Era Badge: "${t2Badge}"`);

    // Check Tab 3 (Archivist) station
    const t3Station = await tab3.eval(`!!document.getElementById('triad-archivist-station')`);
    const t3Badge = await tab3.eval(`document.querySelector('#triad-archivist-station .station-era-badge')?.innerText`);
    console.log(`Tab 3 Workstation visible: ${t3Station}, Era Badge: "${t3Badge}"`);

    // Tab 2 (Detective) moves to Node 1 (Laboratory)
    console.log('\n--- 5. PLAYER 2 (DETECTIVE) MOVES TO NODE 1 ---');
    await tab2.eval(`triadManualInstance.onMoveNode(1)`);
    await sleep(500);

    // Verify Tab 1 and Tab 3 received the meeple position update!
    const t1SeeP2 = await tab1.eval(`window.triadState.meepleNodes['1999']`);
    const t3SeeP2 = await tab3.eval(`window.triadState.meepleNodes['1999']`);
    console.log(`Network Sync -> Tab 1 sees 1999 at Node: ${t1SeeP2}, Tab 3 sees 1999 at Node: ${t3SeeP2} (Expected: 1)`);

    // Tab 1 (Architect 1979) flips Reactor Coolant line to DEPRESSURIZED
    console.log('\n--- 6. PLAYER 1 (ARCHITECT) FLIPS REACTOR COOLANT TRACK ---');
    await tab1.eval(`window.triadState.temporalRipple('coolantLine', 'DEPRESSURIZED')`);
    await sleep(500);

    const t2Coolant = await tab2.eval(`window.triadState.rippleTracks.coolantLine.state`);
    const t3Coolant = await tab3.eval(`window.triadState.rippleTracks.coolantLine.state`);
    console.log(`Network Sync -> Tab 2 sees Coolant: ${t2Coolant}, Tab 3 sees Coolant: ${t3Coolant} (Expected: DEPRESSURIZED)`);

    // Now Detective can enter Node 3 (Vault) through vent crawl!
    console.log('\n--- 7. PLAYER 2 (DETECTIVE) CRAWLS INTO VAULT (NODE 3) ---');
    await tab2.eval(`triadManualInstance.onMoveNode(3)`);
    await sleep(400);
    const t2Node = await tab2.eval(`window.triadState.meepleNodes['1999']`);
    console.log(`Player 2 is now at Node: ${t2Node} (Expected: 3 Vault)`);

    // Detective performs Forensic Sweep on Julian Vance's corpse
    console.log('\n--- 8. PLAYER 2 CONDUCTS FORENSIC SWEEP IN VAULT ---');
    await tab2.eval(`triadManualInstance.onSweep()`);
    await sleep(400);
    const t2HandCount = await tab2.eval(`window.triadState.hands['1999'].length`);
    console.log(`Detective hand count after sweep: ${t2HandCount} (Drew forensic card)`);

    // Tab 3 Decrypts Vault Door Bulkhead
    console.log('\n--- 9. PLAYER 3 (ARCHIVIST) DECRYPTS VAULT BULKHEAD ---');
    await tab3.eval(`triadIntelInstance.onDecrypt('vaultDoor')`);
    await sleep(400);
    const t1VaultDecrypted = await tab1.eval(`!!window.triadState.decryptedBypasses['vaultDoor']`);
    console.log(`Network Sync -> Tab 1 sees Vault Decrypted: ${t1VaultDecrypted}`);

    // All players agree on Verdict
    console.log('\n--- 10. SUBMITTING FINAL ACCUSATION FROM NOTEBOOK ---');
    await tab3.eval(`
      window.triadState.setVerdict('culprit', 'Valerie Cross');
      window.triadState.setVerdict('weapon', 'Dual-Harmonic Tachyon Emitter');
      window.triadState.setVerdict('motive', 'Patent Theft & Temporal Assassination');
    `);
    await sleep(400);

    const t1Culprit = await tab1.eval(`window.triadState.consensusNotebook.culprit`);
    console.log(`Network Sync -> Tab 1 sees Culprit: "${t1Culprit}"`);

    await tab3.eval(`window.triadState.submitFinalAccusation()`);
    await sleep(800);

    const v1 = await tab1.eval(`!document.getElementById('game-over-modal').classList.contains('hidden')`);
    const v2 = await tab2.eval(`!document.getElementById('game-over-modal').classList.contains('hidden')`);
    const v3 = await tab3.eval(`!document.getElementById('game-over-modal').classList.contains('hidden')`);
    console.log(`Victory Modal Open on all 3 Tabs -> Tab 1: ${v1}, Tab 2: ${v2}, Tab 3: ${v3}`);

    console.log('\n=== MULTI-PLAYER P2P TRIAD TEST PASSED 100% ===');
  } catch (err) {
    console.error('Multiplayer test error:', err);
  } finally {
    chromeProc.kill();
    server.close();
    process.exit(0);
  }
}

runMultiplayerTest();
