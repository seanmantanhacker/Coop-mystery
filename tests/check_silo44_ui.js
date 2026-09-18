const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const WebSocket = globalThis.WebSocket;

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

async function run() {
  console.log('--- STARTING COMPREHENSIVE SILO 44 UI INSPECTION ---');

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.join(__dirname, '.chrome-test-silo44-ui');

  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9232',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    `--user-data-dir=${userDataDir}`,
    'http://localhost:8000'
  ]);

  await sleep(1500);

  const list = await (await fetch('http://localhost:9232/json/list')).json();
  const pageTarget = list.find(t => t.type === 'page');
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  let msgId = 1;
  const callbacks = new Map();
  await new Promise(res => { ws.onopen = res; });

  const consoleErrors = [];

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      if (msg.params.type === 'error') {
        console.error('[BROWSER ERROR]', JSON.stringify(msg.params.args));
        consoleErrors.push(msg.params);
      } else {
        console.log('[BROWSER LOG]', msg.params.args.map(a => a.value || a.description).join(' '));
      }
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      console.error('[BROWSER EXCEPTION]', JSON.stringify(msg.params.exceptionDetails));
      consoleErrors.push(msg.params.exceptionDetails);
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

  await send('Runtime.enable');
  await send('Page.enable');
  await send('Network.enable');
  await send('Network.setCacheDisabled', { cacheDisabled: true });
  await send('Page.reload', { ignoreCache: true });
  await sleep(1000);

  async function evalJs(expr) {
    const res = await send('Runtime.evaluate', {
      expression: expr,
      returnByValue: true,
      awaitPromise: true
    });
    return res?.result?.value;
  }

  async function capture(name) {
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const buf = Buffer.from(shot.data, 'base64');
    const outPath = path.join(__dirname, '..', name);
    fs.writeFileSync(outPath, buf);
    console.log('Saved screenshot:', outPath);
  }

  // ==========================================
  // 1. Check Silo 44 Defuser
  // ==========================================
  console.log('=== TEST 1: SILO 44 DEFUSER ===');
  await evalJs(`game.selectScenario('silo44')`);
  await evalJs(`document.getElementById('room-input').value = 'TESTSILO'`);
  await evalJs(`document.getElementById('btn-create-room').click()`);
  await sleep(300);
  await evalJs(`game.toggleRole('defuser')`);
  await sleep(300);
  await evalJs(`document.getElementById('btn-start-game').click()`);
  await sleep(1200);

  // 1a. Overview
  const defuserOverview = await evalJs(`({
    activeScreen: document.querySelector('.game-screen.active')?.id,
    currentMap: bomb3D.currentMap,
    currentView: bomb3D.currentView,
    activeEnv: !!bomb3D.envManager?.activeEnv,
    hasBombGroup: !!bomb3D.bombGroup,
    clickableWires: bomb3D.clickableWires?.length,
    clickableKeypad: bomb3D.clickableKeypad?.length,
    simonPads: bomb3D.simonPads?.length,
    quadrantBarHidden: document.getElementById('bomb-quadrant-bar')?.classList.contains('hidden'),
    alchemistBarHidden: document.getElementById('alchemist-apparatus-bar')?.classList.contains('hidden'),
    stepBackBtnHidden: document.getElementById('btn-step-back')?.classList.contains('hidden')
  })`);
  console.log('Silo 44 Defuser Overview State:', defuserOverview);
  await capture('screen_silo44_defuser_overview.png');

  // 1b. Inspect Full Bomb
  await evalJs(`bomb3D.setView('INSPECT_BOMB')`);
  await sleep(500);
  const inspectBombState = await evalJs(`({
    view: bomb3D.currentView,
    quadrant: bomb3D.currentBombQuadrant,
    quadrantBarHidden: document.getElementById('bomb-quadrant-bar')?.classList.contains('hidden'),
    quadrantBarRect: (() => {
      const r = document.getElementById('bomb-quadrant-bar').getBoundingClientRect();
      return { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) };
    })(),
    stepBackBtnHidden: document.getElementById('btn-step-back')?.classList.contains('hidden'),
    stepBackBtnText: document.getElementById('btn-step-back')?.innerText,
    radioHudHidden: document.getElementById('radio-inspect-hud')?.classList.contains('hidden')
  })`);
  console.log('Silo 44 Inspect Bomb State:', inspectBombState);
  await capture('screen_silo44_defuser_inspect_bomb.png');

  // 1c. Inspect Quadrants via Toolbar
  const quads = ['WIRES', 'KEYPAD', 'SIMON', 'RADIO'];
  for (const q of quads) {
    await evalJs(`bomb3D.setBombQuadrant('${q}')`);
    await sleep(400);
    const qState = await evalJs(`({
      quadrant: bomb3D.currentBombQuadrant,
      quadrantBarHidden: document.getElementById('bomb-quadrant-bar')?.classList.contains('hidden'),
      activeBtn: document.querySelector('.btn-quadrant.active')?.dataset?.quadrant,
      stepBackText: document.getElementById('btn-step-back')?.innerText,
      radioHudHidden: document.getElementById('radio-inspect-hud')?.classList.contains('hidden')
    })`);
    console.log(`State for quadrant ${q}:`, qState);
    await capture(`screen_silo44_defuser_quad_${q.toLowerCase()}.png`);
  }

  // 1d. Inspect Radio directly
  await evalJs(`bomb3D.setView('INSPECT_RADIO')`);
  await sleep(500);
  const directRadioState = await evalJs(`({
    view: bomb3D.currentView,
    radioHudHidden: document.getElementById('radio-inspect-hud')?.classList.contains('hidden'),
    stepBackBtnText: document.getElementById('btn-step-back')?.innerText,
    freqText: document.getElementById('radio-inspect-freq')?.innerText
  })`);
  console.log('Direct Inspect Radio State:', directRadioState);
  await capture('screen_silo44_defuser_inspect_radio.png');

  // 1e. Mobile Defuser checks
  await send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 667,
    deviceScaleFactor: 2,
    mobile: true
  });
  await sleep(500);

  // Mobile Overview
  await evalJs(`bomb3D.setView('OVERVIEW')`);
  await sleep(500);
  await capture('screen_silo44_mobile_defuser_overview.png');

  // Mobile Inspect Bomb
  await evalJs(`bomb3D.setView('INSPECT_BOMB')`);
  await sleep(500);
  const mobileBombBarRect = await evalJs(`(() => {
    const r = document.getElementById('bomb-quadrant-bar').getBoundingClientRect();
    return { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) };
  })()`);
  console.log('Mobile Quadrant Bar Rect:', mobileBombBarRect);
  await capture('screen_silo44_mobile_defuser_inspect_bomb.png');

  // Mobile Radio Quadrant
  await evalJs(`bomb3D.setBombQuadrant('RADIO')`);
  await sleep(500);
  await capture('screen_silo44_mobile_defuser_radio.png');

  // Reset viewport
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 720,
    deviceScaleFactor: 1,
    mobile: false
  });

  // ==========================================
  // 2. Check Silo 44 Manual Specialist
  // ==========================================
  console.log('=== TEST 2: SILO 44 MANUAL SPECIALIST ===');
  await send('Page.reload', { ignoreCache: true });
  await sleep(1000);
  await evalJs(`game.selectScenario('silo44')`);
  await evalJs(`document.getElementById('room-input').value = 'TESTSILOMAN'`);
  await evalJs(`document.getElementById('btn-create-room').click()`);
  await sleep(300);
  await evalJs(`game.toggleRole('manual')`);
  await sleep(300);
  await evalJs(`document.getElementById('btn-start-game').click()`);
  await sleep(1000);

  const manualState = await evalJs(`({
    activeScreen: document.querySelector('.game-screen.active')?.id,
    currentView: manualView.currentView,
    backBtnHidden: document.getElementById('manual-back-btn')?.classList.contains('hidden'),
    binderHidden: document.getElementById('manual-binder-modal')?.classList.contains('hidden'),
    corkboardHidden: document.getElementById('manual-corkboard-modal')?.classList.contains('hidden')
  })`);
  console.log('Silo 44 Manual Desk State:', manualState);
  await capture('screen_silo44_manual_overview.png');

  // Test Binder
  await evalJs(`manualView.setView('INSPECT_BINDER')`);
  await sleep(400);
  const binderState = await evalJs(`({
    currentView: manualView.currentView,
    tabCount: document.querySelectorAll('.tab-btn').length,
    tabs: Array.from(document.querySelectorAll('.tab-btn')).map(t => t.innerText.trim()),
    activeTab: document.querySelector('.tab-btn.active')?.innerText?.trim(),
    backBtnHidden: document.getElementById('manual-back-btn')?.classList.contains('hidden')
  })`);
  console.log('Silo 44 Manual Binder State:', binderState);
  await capture('screen_silo44_manual_binder.png');

  // Test Corkboard
  await evalJs(`manualView.setView('INSPECT_CORKBOARD')`);
  await sleep(400);
  await capture('screen_silo44_manual_corkboard.png');

  // Test mobile Manual
  await send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 667,
    deviceScaleFactor: 2,
    mobile: true
  });
  await sleep(500);
  await evalJs(`manualView.setView('INSPECT_BINDER')`);
  await sleep(400);
  await capture('screen_silo44_mobile_manual_binder.png');

  // Reset viewport
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 720,
    deviceScaleFactor: 1,
    mobile: false
  });

  // ==========================================
  // 3. Check Silo 44 Intel Analyst
  // ==========================================
  console.log('=== TEST 3: SILO 44 INTEL ANALYST ===');
  await send('Page.reload', { ignoreCache: true });
  await sleep(1000);
  await evalJs(`game.selectScenario('silo44')`);
  await evalJs(`document.getElementById('room-input').value = 'TESTSILOINT'`);
  await evalJs(`document.getElementById('btn-create-room').click()`);
  await sleep(300);
  await evalJs(`game.toggleRole('intel')`);
  await sleep(300);
  await evalJs(`document.getElementById('btn-start-game').click()`);
  await sleep(1000);

  const intelState = await evalJs(`({
    activeScreen: document.querySelector('.game-screen.active')?.id,
    currentView: intelView.currentView,
    backBtnHidden: document.getElementById('intel-back-btn')?.classList.contains('hidden'),
    centerModalHidden: document.getElementById('intel-inspect-center')?.classList.contains('hidden'),
    dossierModalHidden: document.getElementById('intel-inspect-dossier')?.classList.contains('hidden'),
    emergencyModalHidden: document.getElementById('intel-inspect-emergency')?.classList.contains('hidden')
  })`);
  console.log('Silo 44 Intel Console State:', intelState);
  await capture('screen_silo44_intel_overview.png');

  // 3a. Test Inspect Center (Oscilloscope)
  await evalJs(`intelView.setView('INSPECT_CENTER')`);
  await sleep(500);
  const oscState = await evalJs(`({
    centerModalHidden: document.getElementById('intel-inspect-center')?.classList.contains('hidden'),
    targetReadout: document.getElementById('inspect-target-readout')?.innerText,
    defuserFreq: document.getElementById('intel-dossier-current-freq')?.innerText,
    canvasDimensions: {
      w: document.getElementById('intel-large-oscilloscope')?.clientWidth,
      h: document.getElementById('intel-large-oscilloscope')?.clientHeight
    }
  })`);
  console.log('Silo 44 Oscilloscope State:', oscState);
  await capture('screen_silo44_intel_oscilloscope.png');

  // 3b. Test Inspect Dossier
  await evalJs(`intelView.setView('INSPECT_DOSSIER')`);
  await sleep(500);
  const dossierState = await evalJs(`({
    dossierModalHidden: document.getElementById('intel-inspect-dossier')?.classList.contains('hidden'),
    serial: document.getElementById('intel-dossier-serial')?.innerText,
    batt: document.getElementById('intel-dossier-batt')?.innerText,
    ind: document.getElementById('intel-dossier-ind')?.innerText,
    copyBtnParent: document.getElementById('btn-copy-telemetry')?.parentElement?.parentElement?.className
  })`);
  console.log('Silo 44 Dossier State:', dossierState);
  await capture('screen_silo44_intel_dossier.png');

  // 3c. Test Inspect Emergency Override
  await evalJs(`intelView.setView('INSPECT_EMERGENCY')`);
  await sleep(500);
  const emergencyState = await evalJs(`({
    emergencyModalHidden: document.getElementById('intel-inspect-emergency')?.classList.contains('hidden'),
    mathProblem: document.getElementById('math-equation-text')?.innerText,
    isLeverLocked: document.getElementById('missile-toggle-lever')?.classList.contains('locked')
  })`);
  console.log('Silo 44 Emergency State:', emergencyState);
  await capture('screen_silo44_intel_emergency.png');

  // 3d. Mobile Intel checks
  await send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 667,
    deviceScaleFactor: 2,
    mobile: true
  });
  await sleep(500);

  await evalJs(`intelView.setView('INSPECT_CENTER')`);
  await sleep(500);
  await capture('screen_silo44_mobile_intel_oscilloscope.png');

  await evalJs(`intelView.setView('INSPECT_DOSSIER')`);
  await sleep(500);
  await capture('screen_silo44_mobile_intel_dossier.png');

  console.log('Total Console Errors across Silo 44:', consoleErrors.length);

  ws.close();
  chromeProc.kill();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
