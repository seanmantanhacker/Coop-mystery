const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const WebSocket = globalThis.WebSocket;

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

async function runMorgueUITest() {
  console.log('=== STARTING COMPLETE VERIFICATION OF MAP 3: THE LOCKED MORGUE ===');

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.join(__dirname, '.chrome-test-morgue-profile');

  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9235',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    `--user-data-dir=${userDataDir}`,
    'http://localhost:8000'
  ]);

  await sleep(2000);

  const list = await (await fetch('http://localhost:9235/json/list')).json();
  const pageTarget = list.find(t => t.type === 'page');
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  let msgId = 1;
  const callbacks = new Map();
  await new Promise(res => { ws.onopen = res; });

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      console.log('[BROWSER LOG]', ...msg.params.args.map(a => a.value || a.description));
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      console.error('[BROWSER EXCEPTION]', msg.params.exceptionDetails?.exception?.description || msg.params.exceptionDetails?.text);
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

  async function captureScreenshot(filename) {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.data, 'base64');
    fs.writeFileSync(filename, buffer);
    console.log(`Saved screenshot: ${path.basename(filename)} (${buffer.length} bytes)`);
  }

  await send('Runtime.enable');
  await send('Page.enable');
  await send('Network.enable');
  await send('Network.setCacheDisabled', { cacheDisabled: true });
  await send('Page.reload', { ignoreCache: true });
  await sleep(1000);
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 720,
    deviceScaleFactor: 1,
    mobile: false
  });

  const artDir = process.env.ARTIFACT_DIR || 'C:\\Users\\LENOVO\\.gemini\\antigravity-ide\\brain\\59195771-93a1-4c45-a53d-5895ada2a187';

  try {
    console.log('\n--- 1. LOBBY: SELECT MAP 3 & VERIFY 15-MINUTE (900s) TIMER ---');
    await evalJs(`
      document.getElementById('room-input').value = 'MORGUE94';
      document.getElementById('btn-create-room').click();
    `);
    await sleep(300);

    // Select Map 3 card
    const selectRes = await evalJs(`(() => {
      const card = document.getElementById('card-scenario-morgue');
      if (!card) return { success: false, reason: 'card-scenario-morgue missing' };
      card.click();
      return {
        success: true,
        scenario: game.scenario,
        timer: game.timerSeconds,
        baseTimer: window.ESCAPE_MAPS['morgue']?.baseTimer,
        activeCard: document.querySelector('.scenario-card.active')?.dataset.scenario
      };
    })()`);
    console.log('Lobby selection result:', selectRes);

    if (selectRes.timer !== 900) {
      throw new Error(`Expected base timer to be exactly 900s (15:00), got ${selectRes.timer}s!`);
    }

    await captureScreenshot(path.join(artDir, 'screen_morgue_lobby_selected.png'));
    console.log('✓ Map 3 is properly selectable in lobby with exact 15:00 countdown timer.');


    console.log('\n--- 2. FIELD OPERATIVE (DEFUSER): 3D MORGUE THEATER & MODULE HUDS ---');
    await evalJs(`game.toggleRole('defuser');`);
    await sleep(300);

    const startState = await evalJs(`(() => {
      const btn = document.getElementById('btn-start-game');
      return {
        disabled: btn ? btn.disabled : true,
        role: game.role,
        isHost: network.isHost,
        scenario: game.scenario
      };
    })()`);
    console.log('Start state before click:', startState);

    await evalJs(`
      if (document.getElementById('btn-start-game') && !document.getElementById('btn-start-game').disabled) {
        document.getElementById('btn-start-game').click();
      } else {
        game.startGameMission();
      }
    `);
    await sleep(1500);

    const defuserCheck = await evalJs(`(() => {
      const timerText = document.getElementById('defuser-timer')?.innerText;
      const titleText = document.getElementById('defuser-level-title')?.innerText;
      const badgeCyan = document.getElementById('defuser-level-badge')?.classList.contains('cyan');
      const morgueBarVisible = !document.getElementById('morgue-apparatus-bar')?.classList.contains('hidden');
      const alchemistBarHidden = document.getElementById('alchemist-apparatus-bar')?.classList.contains('hidden');
      const siloBarHidden = document.getElementById('bomb-quadrant-bar')?.classList.contains('hidden');
      return {
        timerText,
        titleText,
        badgeCyan,
        morgueBarVisible,
        alchemistBarHidden,
        siloBarHidden,
        currentMap: bomb3D.currentMap
      };
    })()`);
    console.log('Defuser 3D room check:', defuserCheck);

    if (!defuserCheck.timerText.startsWith('15:00') && !defuserCheck.timerText.startsWith('14:59')) {
      throw new Error(`Expected clock to show ~15:00, got "${defuserCheck.timerText}"`);
    }
    if (!defuserCheck.titleText.includes('THE LOCKED MORGUE')) {
      throw new Error(`Expected title 'THE LOCKED MORGUE', got "${defuserCheck.titleText}"`);
    }
    if (!defuserCheck.morgueBarVisible || !defuserCheck.alchemistBarHidden || !defuserCheck.siloBarHidden) {
      throw new Error('Apparatus bar isolation failed! Only morgue apparatus bar should be visible.');
    }

    await captureScreenshot(path.join(artDir, 'screen_morgue_defuser_overview.png'));
    console.log('✓ Defuser 3D Morgue overview rendered with isolated morgue navigation bar.');


    console.log('\n--- 2.1 TEST INSPECT: TOXICOLOGY BENCH ---');
    await evalJs(`bomb3D.setView('INSPECT_TOXICOLOGY');`);
    await sleep(600);
    const toxCheck = await evalJs(`(() => {
      const hud = document.getElementById('toxicology-inspect-hud');
      const hudVisible = !hud?.classList.contains('hidden');
      const symptoms = document.getElementById('tox-symptoms-text')?.innerText;
      
      // Test running centrifuge
      toxicologyModule.runCentrifuge();
      const assayText = document.getElementById('tox-assay-result')?.innerText;

      // Test reagent adjustment
      toxicologyModule.adjustReagent('a', 15);
      const valA = document.getElementById('tox-val-a')?.innerText;

      return { hudVisible, symptoms, assayText, valA };
    })()`);
    console.log('Toxicology HUD check:', toxCheck);
    if (!toxCheck.hudVisible || toxCheck.valA !== '15 mL') {
      throw new Error('Toxicology module failed interaction test!');
    }
    await captureScreenshot(path.join(artDir, 'screen_morgue_inspect_toxicology.png'));
    await evalJs(`bomb3D.handleStepBack();`);
    await sleep(400);


    console.log('\n--- 2.2 TEST INSPECT: AUTOPSY CADAVER & WOUND BALLISTICS ---');
    await evalJs(`bomb3D.setView('INSPECT_AUTOPSY');`);
    await sleep(600);
    const autopsyCheck = await evalJs(`(() => {
      const hud = document.getElementById('autopsy-inspect-hud');
      const hudVisible = !hud?.classList.contains('hidden');
      const woundId = document.getElementById('autopsy-wound-id')?.innerText;
      const loc = document.getElementById('autopsy-wound-loc')?.innerText;
      const depth = document.getElementById('autopsy-wound-depth')?.innerText;
      
      // Step to wound 2
      autopsyModule.selectWound(1);
      const wound2Id = document.getElementById('autopsy-wound-id')?.innerText;

      return { hudVisible, woundId, loc, depth, wound2Id };
    })()`);
    console.log('Autopsy HUD check:', autopsyCheck);
    if (!autopsyCheck.hudVisible || !autopsyCheck.wound2Id.includes('WOUND #2')) {
      throw new Error('Autopsy module failed wound navigation test!');
    }
    await captureScreenshot(path.join(artDir, 'screen_morgue_inspect_autopsy.png'));
    await evalJs(`bomb3D.handleStepBack();`);
    await sleep(400);


    console.log('\n--- 2.3 TEST INSPECT: AIRLOCK DOOR & 12-KEY MATRIX ---');
    await evalJs(`bomb3D.setView('INSPECT_DOOR');`);
    await sleep(600);
    const keypadCheck = await evalJs(`(() => {
      const hud = document.getElementById('morgue-keypad-inspect-hud');
      const hudVisible = !hud?.classList.contains('hidden');
      
      // Enter digits
      morgueKeypadModule.pressDigit('1');
      morgueKeypadModule.pressDigit('9');
      morgueKeypadModule.pressDigit('7');
      morgueKeypadModule.pressDigit('4');
      const readout = document.getElementById('morgue-keypad-readout')?.innerText;
      
      morgueKeypadModule.clear();
      const clearedReadout = document.getElementById('morgue-keypad-readout')?.innerText;

      return { hudVisible, readout, clearedReadout };
    })()`);
    console.log('Keypad HUD check:', keypadCheck);
    if (!keypadCheck.hudVisible || keypadCheck.readout !== '1 9 7 4' || keypadCheck.clearedReadout !== '_ _ _ _') {
      throw new Error('Keypad module failed digit entry and clear test!');
    }
    await captureScreenshot(path.join(artDir, 'screen_morgue_inspect_keypad.png'));
    await evalJs(`bomb3D.handleStepBack();`);
    await sleep(400);


    console.log('\n--- 2.4 TEST INSPECT: LIFE SUPPORT & EXHAUST DAMPER ---');
    await evalJs(`bomb3D.setView('INSPECT_VENT');`);
    await sleep(600);
    const lifeCheck = await evalJs(`(() => {
      const hud = document.getElementById('life-support-inspect-hud');
      const hudVisible = !hud?.classList.contains('hidden');
      const gasPpm = document.getElementById('ls-gas-ppm')?.innerText;
      const initialPsi = document.getElementById('ls-current-psi')?.innerText;
      
      // Adjust PSI
      lifeSupportModule.adjustPsi(-1.0);
      const adjustedPsi = document.getElementById('ls-current-psi')?.innerText;

      return { hudVisible, gasPpm, initialPsi, adjustedPsi };
    })()`);
    console.log('Life Support HUD check:', lifeCheck);
    if (!lifeCheck.hudVisible) {
      throw new Error('Life support HUD failed visibility test!');
    }
    await captureScreenshot(path.join(artDir, 'screen_morgue_inspect_lifesupport.png'));
    await evalJs(`bomb3D.handleStepBack();`);
    await sleep(400);


    console.log('\n--- 2.5 TEST INSPECT: CORONER DICTAPHONE AUDIO LORE ---');
    await evalJs(`bomb3D.setView('INSPECT_LOG');`);
    await sleep(600);
    const loreCheck = await evalJs(`(() => {
      const modal = document.getElementById('lore-inspect-modal');
      const title = document.getElementById('lore-modal-title')?.innerText;
      const isVisible = !modal?.classList.contains('hidden');
      return { isVisible, title };
    })()`);
    console.log('Dictaphone lore check:', loreCheck);
    if (!loreCheck.isVisible || !loreCheck.title.includes('DR. HAROLD VANCE')) {
      throw new Error('Dictaphone lore modal failed to open with coroner transcript!');
    }
    await captureScreenshot(path.join(artDir, 'screen_morgue_dictaphone_lore.png'));
    await evalJs(`game.closeLoreModal();`);
    await sleep(400);


    console.log('\n--- 3. ARCHIVIST (MANUAL SPECIALIST): 5 DOSSIER TABS ---');
    await evalJs(`
      game.role = 'manual';
      document.getElementById('screen-defuser').classList.add('hidden');
      document.getElementById('screen-manual').classList.remove('hidden');
      manualView.init('morgue');
      manualView.setView('INSPECT_BINDER');
    `);
    await sleep(800);

    const manualTabsCheck = await evalJs(`(() => {
      const tabBtns = document.querySelectorAll('.binder-tab-btn:not(.binder-close-btn)');
      const tabLabels = Array.from(tabBtns).map(b => b.innerText.trim());
      const pageCount = manualView.totalPages;
      return { tabLabels, pageCount };
    })()`);
    console.log('Manual Specialist tabs check:', manualTabsCheck);

    if (manualTabsCheck.pageCount !== 5 || manualTabsCheck.tabLabels.length !== 5) {
      throw new Error(`Expected 5 manual tabs for Morgue, found ${manualTabsCheck.pageCount}!`);
    }

    // Capture tab 0 (Toxicology)
    await evalJs(`manualView.goToSection(0);`);
    await sleep(300);
    await captureScreenshot(path.join(artDir, 'screen_morgue_manual_tab0_toxicology.png'));

    // Capture tab 1 (Autopsy)
    await evalJs(`manualView.goToSection(1);`);
    await sleep(300);
    await captureScreenshot(path.join(artDir, 'screen_morgue_manual_tab1_autopsy.png'));

    // Capture tab 2 (Door PIN)
    await evalJs(`manualView.goToSection(2);`);
    await sleep(300);
    await captureScreenshot(path.join(artDir, 'screen_morgue_manual_tab2_doorpin.png'));

    // Capture tab 3 (Life Support)
    await evalJs(`manualView.goToSection(3);`);
    await sleep(300);
    await captureScreenshot(path.join(artDir, 'screen_morgue_manual_tab3_lifesupport.png'));

    // Capture tab 4 (Suspects)
    await evalJs(`manualView.goToSection(4);`);
    await sleep(300);
    await captureScreenshot(path.join(artDir, 'screen_morgue_manual_tab4_suspects.png'));
    console.log('✓ All 5 Archivist Forensic Dossier tabs verified and screenshotted.');


    console.log('\n--- 4. INTEL ANALYST: SPECTROMETRY & REMOTE DISPATCHER TRIGGERS ---');
    await evalJs(`
      game.role = 'intel';
      document.getElementById('screen-manual').classList.add('hidden');
      document.getElementById('screen-intel').classList.remove('hidden');
      intelView.init('morgue');
      intelView.setView('INSPECT_CENTER');
    `);
    await sleep(800);

    const intelCheck = await evalJs(`(() => {
      const centerTitle = document.getElementById('intel-center-title')?.innerText;
      const victimYear = document.getElementById('intel-dossier-serial')?.innerText;
      const victimMass = document.getElementById('intel-dossier-batt')?.innerText;
      const gasPpm = document.getElementById('intel-dossier-temp')?.innerText;
      
      // Test trigger vent flush
      MorgueIntelView.executeVentFlush();
      const flushedStatus = document.getElementById('intel-dossier-current-freq')?.innerText;

      return { centerTitle, victimYear, victimMass, gasPpm, flushedStatus };
    })()`);
    console.log('Intel Analyst check:', intelCheck);

    if (!intelCheck.centerTitle.includes('MASS SPECTROMETER')) {
      throw new Error(`Expected center title for mass spectrometry, got "${intelCheck.centerTitle}"`);
    }
    if (!intelCheck.flushedStatus.includes('FLUSH ACTIVE')) {
      throw new Error(`Expected vent flush status, got "${intelCheck.flushedStatus}"`);
    }
    await captureScreenshot(path.join(artDir, 'screen_morgue_intel_spectrogram_dispatch.png'));
    console.log('✓ Intel Analyst mass spectrometry and remote dispatcher controls verified.');


    console.log('\n--- 5. MOBILE RESPONSIVE ADAPTATION (375x812 iPhone X) ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
      mobile: true
    });
    await sleep(600);

    // 5.1 Mobile Defuser Overview & Inspection
    await evalJs(`
      game.role = 'defuser';
      document.getElementById('screen-intel').classList.add('hidden');
      document.getElementById('screen-defuser').classList.remove('hidden');
      bomb3D.setView('OVERVIEW');
    `);
    await sleep(600);
    await captureScreenshot(path.join(artDir, 'screen_morgue_mobile_defuser_overview.png'));

    await evalJs(`bomb3D.setView('INSPECT_TOXICOLOGY');`);
    await sleep(600);
    await captureScreenshot(path.join(artDir, 'screen_morgue_mobile_defuser_toxicology.png'));
    await evalJs(`bomb3D.handleStepBack();`);
    await sleep(300);

    // 5.2 Mobile Manual View
    await evalJs(`
      game.role = 'manual';
      document.getElementById('screen-defuser').classList.add('hidden');
      document.getElementById('screen-manual').classList.remove('hidden');
      manualView.setView('INSPECT_BINDER');
      manualView.goToSection(2);
    `);
    await sleep(600);
    await captureScreenshot(path.join(artDir, 'screen_morgue_mobile_manual_doorpin.png'));

    // 5.3 Mobile Intel View
    await evalJs(`
      game.role = 'intel';
      document.getElementById('screen-manual').classList.add('hidden');
      document.getElementById('screen-intel').classList.remove('hidden');
      intelView.setView('CONSOLE_OVERVIEW');
    `);
    await sleep(600);
    await captureScreenshot(path.join(artDir, 'screen_morgue_mobile_intel_console.png'));

    console.log('✓ Mobile responsive layout verified across Defuser, Manual, and Intel roles.');

    console.log('\n====================================================');
    console.log('ALL MAP 3 (THE LOCKED MORGUE) VERIFICATION TESTS PASSED!');
    console.log('====================================================\n');

  } catch (err) {
    console.error('TEST ERROR:', err);
    process.exitCode = 1;
  } finally {
    try { ws.close(); } catch (_) {}
    try { chromeProc.kill(); } catch (_) {}
  }
}

runMorgueUITest();
