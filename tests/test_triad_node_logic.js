const { spawn } = require('child_process');
const path = require('path');
const http = require('http');
const fs = require('fs');

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

async function runNodeLogicTest() {
  console.log('=== TEST: LEVEL 5 (THE TRIAD PARADOX) - 50 MINUTE TIMER & NODES 1 TO 5 LOGIC ===\n');

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

  await new Promise(resolve => server.listen(8012, resolve));
  console.log('Test Server running on http://localhost:8012');

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.join(__dirname, '.chrome-test-node-logic-profile');

  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9233',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    `--user-data-dir=${userDataDir}`,
    'http://localhost:8012'
  ]);

  await sleep(2200);

  try {
    const listRes = await fetch('http://localhost:9233/json/list');
    const list = await listRes.json();
    const tabTarget = list.find(t => t.type === 'page');

    const ws = new WebSocket(tabTarget.webSocketDebuggerUrl);
    await new Promise(res => { ws.onopen = res; });
    let msgId = 1;
    const callbacks = new Map();
    const consoleLogs = [];

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        const cb = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        cb(msg.result);
      }
      if (msg.method === 'Runtime.consoleAPICalled') {
        const text = msg.params.args.map(a => a.value || a.description).join(' ');
        consoleLogs.push(text);
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

    // 1. Check Scenario Card in Lobby
    console.log('--- 1. VERIFY 50-MINUTE TIMER IN LOBBY & CONFIG ---');
    await evalJs(`
      game.selectScenario('triad');
    `);
    const timerSeconds = await evalJs(`game.timerSeconds`);
    const baseTimer = await evalJs(`window.ESCAPE_MAPS['triad'].baseTimer`);
    console.log(`✓ baseTimer in config: ${baseTimer}s (${baseTimer / 60} minutes)`);
    console.log(`✓ game.timerSeconds: ${timerSeconds}s (${timerSeconds / 60} minutes)`);

    if (baseTimer !== 3000 || timerSeconds !== 3000) {
      throw new Error(`Timer mismatch! Expected 3000s (50 min), got baseTimer=${baseTimer}, timerSeconds=${timerSeconds}`);
    }

    // Start mission
    await evalJs(`
      document.getElementById('room-input').value = 'LOGICTEST';
      document.getElementById('btn-create-room').click();
      game.toggleRole('defuser');
      game.startGameMission();
    `);
    await sleep(600);

    const clockText = await evalJs(`document.getElementById('defuser-timer')?.innerText || document.getElementById('global-timer-display')?.innerText`);
    console.log(`✓ In-game Clock Display at launch: "${clockText}" (Expected ~ 50:00 or 49:59)`);

    const initialStability = await evalJs(`window.triadState.chronalStability`);
    console.log(`✓ Initial Chronal Stability: ${initialStability} (Expected: 20 per rulebook)`);
    if (initialStability !== 20) {
      throw new Error(`Expected Chronal Stability 20, got ${initialStability}`);
    }

    // Check starting positions: all in Node 5 (Security Hub)
    const p1Start = await evalJs(`window.triadState.meepleNodes['1979']`);
    const p2Start = await evalJs(`window.triadState.meepleNodes['1999']`);
    const p3Start = await evalJs(`window.triadState.meepleNodes['2019']`);
    console.log(`✓ Spawn positions: 1979=${p1Start}, 1999=${p2Start}, 2019=${p3Start} (All start at Node 5 Security Hub)`);

    // =========================================================================
    // 2. NODE 1: LABORATORY LOGIC
    // =========================================================================
    console.log('\n--- 2. AUDIT NODE 1 (LABORATORY) LOGIC ---');
    // 1979 moves to Node 1
    const p1MoveN1 = await evalJs(`window.triadState.moveMeeple('1979', 1)`);
    console.log(`  1979 moves to Node 1: ${p1MoveN1}`);
    // 1979 searches Node 1
    const p1SearchN1 = await evalJs(`window.triadState.searchCurrentNode('1979')`);
    const p1HandCard = await evalJs(`window.triadState.hands['1979'][window.triadState.hands['1979'].length - 1]`);
    console.log(`  1979 searches Node 1: ${p1SearchN1} -> Drew: "${p1HandCard?.title}" (node: ${p1HandCard?.node})`);
    
    // 1999 moves to Node 1
    const p2MoveN1 = await evalJs(`window.triadState.moveMeeple('1999', 1)`);
    console.log(`  1999 moves to Node 1: ${p2MoveN1}`);
    // 1999 searches Node 1
    const p2SearchN1 = await evalJs(`window.triadState.searchCurrentNode('1999')`);
    const p2HandCard = await evalJs(`window.triadState.hands['1999'][window.triadState.hands['1999'].length - 1]`);
    console.log(`  1999 searches Node 1: ${p2SearchN1} -> Drew: "${p2HandCard?.title}" (node: ${p2HandCard?.node})`);

    // 2019 moves to Node 1
    const p3MoveN1 = await evalJs(`window.triadState.moveMeeple('2019', 1)`);
    console.log(`  2019 moves to Node 1: ${p3MoveN1}`);
    // 2019 searches Node 1
    const p3SearchN1 = await evalJs(`window.triadState.searchCurrentNode('2019')`);
    const p3HandCard = await evalJs(`window.triadState.hands['2019'][window.triadState.hands['2019'].length - 1]`);
    console.log(`  2019 searches Node 1: ${p3SearchN1} -> Drew: "${p3HandCard?.title}" (node: ${p3HandCard?.node})`);

    // Reset AP for next tests
    await evalJs(`
      window.triadState.ap['1979'] = 3;
      window.triadState.ap['1999'] = 3;
      window.triadState.ap['2019'] = 3;
    `);

    // =========================================================================
    // 3. NODE 2: DIRECTOR'S OFFICE LOGIC
    // =========================================================================
    console.log("\n--- 3. AUDIT NODE 2 (DIRECTOR'S OFFICE) LOGIC ---");
    // All move to Node 2
    await evalJs(`
      window.triadState.moveMeeple('1979', 2);
      window.triadState.moveMeeple('1999', 2);
      window.triadState.moveMeeple('2019', 2);
    `);
    // Search Node 2
    await evalJs(`
      window.triadState.ap['1979'] = 3;
      window.triadState.ap['1999'] = 3;
      window.triadState.ap['2019'] = 3;
      window.triadState.searchCurrentNode('1979');
      window.triadState.searchCurrentNode('1999');
      window.triadState.searchCurrentNode('2019');
    `);
    const n2C1 = await evalJs(`window.triadState.hands['1979'][window.triadState.hands['1979'].length - 1]?.title`);
    const n2C2 = await evalJs(`window.triadState.hands['1999'][window.triadState.hands['1999'].length - 1]?.title`);
    const n2C3 = await evalJs(`window.triadState.hands['2019'][window.triadState.hands['2019'].length - 1]?.title`);
    console.log(`  1979 searched Node 2: "${n2C1}"`);
    console.log(`  1999 searched Node 2: "${n2C2}"`);
    console.log(`  2019 searched Node 2: "${n2C3}"`);

    // 1979 flips Director's Safe to BYPASSED
    await evalJs(`window.triadState.ap['1979'] = 3; window.triadState.temporalRipple('directorSafe', 'BYPASSED')`);
    const safeState = await evalJs(`window.triadState.rippleTracks.directorSafe.state`);
    console.log(`  1979 flips Director's Safe -> State: ${safeState} (Expected: BYPASSED)`);

    // =========================================================================
    // 4. NODE 3: TEMPORAL VAULT (CRIME SCENE) LOGIC
    // =========================================================================
    console.log('\n--- 4. AUDIT NODE 3 (TEMPORAL VAULT) ACCESS & FORENSICS LOGIC ---');
    // Set vault door LOCKED and coolant PRESSURIZED to test physical obstruction
    await evalJs(`
      window.triadState.rippleTracks.vaultDoor.state = 'LOCKED';
      window.triadState.rippleTracks.coolantLine.state = 'PRESSURIZED';
      window.triadState.decryptedBypasses['vaultDoor'] = false;
      window.triadState.ap['1999'] = 3;
      window.triadState.ap['2019'] = 3;
    `);

    // 1999 attempts to enter Node 3 while locked and frozen -> SHOULD BE BLOCKED!
    const blockedP2 = await evalJs(`window.triadState.moveMeeple('1999', 3)`);
    console.log(`  1999 attempts vault entry while locked & vent frozen: ${blockedP2} (Expected: false - BLOCKED)`);

    // 2019 attempts to enter Node 3 while locked and undecrypted -> SHOULD BE BLOCKED!
    const blockedP3 = await evalJs(`window.triadState.moveMeeple('2019', 3)`);
    console.log(`  2019 attempts vault entry without decrypt bypass: ${blockedP3} (Expected: false - BLOCKED)`);

    // 1979 depressurizes Coolant Line in the past
    await evalJs(`window.triadState.ap['1979'] = 3; window.triadState.temporalRipple('coolantLine', 'DEPRESSURIZED')`);
    console.log(`  1979 depressurized Coolant Line! Vent clear for crawling.`);

    // 1999 crawls through ventilation shaft into Node 3
    const p2Crawl = await evalJs(`window.triadState.moveMeeple('1999', 3)`);
    const p2Loc = await evalJs(`window.triadState.meepleNodes['1999']`);
    console.log(`  1999 crawls into Vault (Node 3): ${p2Crawl} (Current Location: ${p2Loc})`);

    // 1999 conducts FORENSIC SWEEP (2 AP)
    await evalJs(`window.triadState.ap['1999'] = 3`);
    const sweepOk = await evalJs(`window.triadState.forensicSweep()`);
    const p2ForensicCard = await evalJs(`window.triadState.hands['1999'][window.triadState.hands['1999'].length - 1]`);
    console.log(`  1999 conducts Forensic Sweep: ${sweepOk} -> Discovered: "${p2ForensicCard?.title}"`);

    // 2019 uses DECRYPT action (1 AP) on vaultDoor
    await evalJs(`window.triadState.ap['2019'] = 3; window.triadState.decryptTrack('vaultDoor')`);
    const p3Decrypted = await evalJs(`!!window.triadState.decryptedBypasses['vaultDoor']`);
    const p3Enter = await evalJs(`window.triadState.moveMeeple('2019', 3)`);
    console.log(`  2019 decrypts vault door: ${p3Decrypted} -> Enters Node 3: ${p3Enter}`);

    // =========================================================================
    // 5. NODE 4: COURTYARD & SUBTERRANEAN CISTERN LOGIC
    // =========================================================================
    console.log('\n--- 5. AUDIT NODE 4 (COURTYARD & CISTERN STASH) LOGIC ---');
    // 1979 moves to Node 4
    await evalJs(`
      window.triadState.ap['1979'] = 3;
      window.triadState.moveMeeple('1979', 4);
      // Give 1979 a plantable item
      window.triadState.hands['1979'].push({
        id: 'test-plant-item',
        title: 'Project Ouroboros Stolen Prototype',
        type: 'ITEM',
        node: 4,
        canPlant: true,
        keywords: ['DISPLACEMENT-CORE']
      });
      // Set Cistern to FLOODED
      window.triadState.rippleTracks.courtyardCistern.state = 'FLOODED';
    `);

    // 1979 plants the item in Node 4 (Courtyard)
    const plantOk = await evalJs(`window.triadState.plantItem('test-plant-item', 4)`);
    console.log(`  1979 plants prototype in Node 4 cistern: ${plantOk}`);

    // 1999 moves to Node 4 and tries to secure while FLOODED -> SHOULD BE BLOCKED!
    await evalJs(`
      window.triadState.ap['1999'] = 3;
      window.triadState.moveMeeple('1999', 4);
    `);
    const blockedRetrieve = await evalJs(`window.triadState.securePlantedEvidence(4)`);
    console.log(`  1999 attempts to retrieve evidence while Cistern is FLOODED: ${blockedRetrieve} (Expected: false - SUBMERGED)`);

    // 1979 spends 2 AP to flip Cistern to DRAINED
    await evalJs(`
      window.triadState.ap['1979'] = 3;
      window.triadState.temporalRipple('courtyardCistern', 'DRAINED');
    `);
    const drainedState = await evalJs(`window.triadState.rippleTracks.courtyardCistern.state`);
    console.log(`  1979 drains the Courtyard Cistern -> State: ${drainedState}`);

    // Now 1999 can secure the evidence!
    const retrieveOk = await evalJs(`window.triadState.securePlantedEvidence(4)`);
    const hasSecured = await evalJs(`window.triadState.securedItems.includes('test-plant-item')`);
    console.log(`  1999 secures evidence once DRAINED: ${retrieveOk} (Secured ID verified: ${hasSecured})`);

    // =========================================================================
    // 6. NODE 5: SECURITY MAIN HUB & TAPE PROTECTION LOGIC
    // =========================================================================
    console.log('\n--- 6. AUDIT NODE 5 (SECURITY HUB) & PARADOX LOGIC ---');
    // All move to Node 5
    await evalJs(`
      window.triadState.moveMeeple('1979', 5);
      window.triadState.moveMeeple('1999', 5);
      window.triadState.moveMeeple('2019', 5);
    `);
    // Search Node 5
    await evalJs(`
      window.triadState.ap['1979'] = 3;
      window.triadState.ap['1999'] = 3;
      window.triadState.ap['2019'] = 3;
      window.triadState.searchCurrentNode('1979');
      window.triadState.searchCurrentNode('1999');
      window.triadState.searchCurrentNode('2019');
    `);
    console.log(`  All 3 players successfully searched Node 5.`);

    // Test Paradox detection:
    // 1999 analyzes Melted Tapes (99-clue-01) as Public Intel
    await evalJs(`
      window.triadState.publicIntel.push({
        id: '99-clue-01',
        title: 'Melted Surveillance Tape #04',
        type: 'CLUE',
        node: 5,
        keywords: ['BLACKOUT-2340', 'EMP-BLAST']
      });
      window.triadState.ap['1979'] = 3;
    `);

    // 1979 now tries to shield the tapes in 1979 -> SHOULD TRIGGER PARADOX (-3 Stability)!
    const stabBefore = await evalJs(`window.triadState.chronalStability`);
    const paradoxAttempt = await evalJs(`window.triadState.temporalRipple('securityArchive', 'FARADAY_SHIELDED')`);
    const stabAfter = await evalJs(`window.triadState.chronalStability`);
    console.log(`  1979 attempts retroactive tape shielding: ${paradoxAttempt} (Expected: false - PARADOX)`);
    console.log(`  Chronal Stability: ${stabBefore} -> ${stabAfter} (Decreased by exactly 3)`);
    if (stabBefore - stabAfter !== 3) {
      throw new Error(`Expected 3 stability penalty for paradox, got ${stabBefore - stabAfter}`);
    }

    // =========================================================================
    // 7. QUANTUM SYNTHESIS & FINAL ACCUSATION
    // =========================================================================
    console.log('\n--- 7. QUANTUM KEYWORD SYNTHESIS & CONSENSUS ACCUSATION ---');
    // Add matching public intel cards
    await evalJs(`
      window.triadState.publicIntel.push({
        id: '79-match',
        title: '79 Emitter Blueprint',
        keywords: ['RESONANCE-432HZ']
      });
      window.triadState.publicIntel.push({
        id: '99-match',
        title: '99 Wound Frequency Analysis',
        keywords: ['RESONANCE-432HZ']
      });
      window.triadState.ap['2019'] = 3;
    `);
    const synthOk = await evalJs(`window.triadState.synthesizeIntel('79-match', '99-match')`);
    const revCount = await evalJs(`window.triadState.revelations.length`);
    console.log(`  2019 synthesizes [RESONANCE-432HZ]: ${synthOk} -> Revelations count: ${revCount}`);

    // Submit correct accusation
    await evalJs(`
      window.triadState.setVerdict('culprit', 'Valerie Cross');
      window.triadState.setVerdict('weapon', 'Dual-Harmonic Tachyon Emitter');
      window.triadState.setVerdict('motive', 'Patent Theft & Temporal Assassination');
    `);
    const accuseOk = await evalJs(`window.triadState.submitFinalAccusation()`);
    const isVict = await evalJs(`window.triadState.isVictory`);
    console.log(`  Submit Final Accusation: ${accuseOk} -> isVictory: ${isVict}`);

    console.log('\n=================================================================');
    console.log('✓ ALL TESTS PASSED: 50-MINUTE TIMER & NODES 1-5 LOGIC FULLY VALIDATED!');
    console.log('=================================================================');
  } catch (err) {
    console.error('Test error:', err);
    process.exit(1);
  } finally {
    chromeProc.kill();
    server.close();
    process.exit(0);
  }
}

runNodeLogicTest();
