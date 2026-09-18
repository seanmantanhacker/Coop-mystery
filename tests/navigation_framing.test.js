const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const WebSocket = globalThis.WebSocket;

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

async function runNavigationTests() {
  console.log('=== STARTING NAVIGATION & SILO 44 RADIO INSPECTION SUITE ===');

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.join(__dirname, '.chrome-test-nav-profile');

  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9225',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    `--user-data-dir=${userDataDir}`,
    'http://localhost:8000'
  ]);

  await sleep(1800);

  const list = await (await fetch('http://localhost:9225/json/list')).json();
  const pageTarget = list.find(t => t.type === 'page');
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  let msgId = 1;
  const callbacks = new Map();
  const jsErrors = [];

  await new Promise(res => { ws.onopen = res; });

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && callbacks.has(msg.id)) {
      const cb = callbacks.get(msg.id);
      callbacks.delete(msg.id);
      cb(msg.result);
    }
    if (msg.method === 'Runtime.consoleAPICalled') {
      const text = msg.params.args.map(a => a.value || JSON.stringify(a)).join(' ');
      console.log('[BROWSER CONSOLE]:', text);
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      console.error('[BROWSER JS ERROR]:', msg.params.exceptionDetails);
      jsErrors.push(msg.params.exceptionDetails);
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
    console.log(`Saved screenshot to ${filename} (${buffer.length} bytes)`);
  }

  await send('Runtime.enable');
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 720,
    deviceScaleFactor: 1,
    mobile: false
  });

  try {
    console.log('\n--- PART 1: SILO 44 DEFUSER FAR-RIGHT (RADIO & KEYPAD) INSPECTION FRAMING ---');
    // Start Defuser in Silo 44
    await evalJs(`
      document.getElementById('room-input').value = 'NAVTEST';
      document.getElementById('btn-create-room').click();
    `);
    await sleep(300);
    await evalJs(`game.toggleRole('defuser');`);
    await sleep(200);
    await evalJs(`document.getElementById('btn-start-game').click();`);
    await sleep(1000);

    // Switch to Silo 44 and inspect Radio
    await evalJs(`bomb3D.switchMap('silo44');`);
    await sleep(500);
    await evalJs(`bomb3D.setView('INSPECT_RADIO');`);
    await sleep(900);

    const radioCam = await evalJs(`({
      pos: { x: bomb3D.camera.position.x, y: bomb3D.camera.position.y, z: bomb3D.camera.position.z },
      fov: bomb3D.camera.fov,
      view: bomb3D.currentView
    })`);
    console.log('Camera in INSPECT_RADIO:', radioCam);

    // Save screenshot of radio inspect
    const artDir = process.env.ARTIFACT_DIR || 'C:\\Users\\LENOVO\\.gemini\\antigravity-ide\\brain\\59195771-93a1-4c45-a53d-5895ada2a187';
    await captureScreenshot(path.join(artDir, 'screen_verify_silo44_radio_framing.png'));

    // Verify step back to room
    console.log('Testing Defuser step back from radio...');
    await evalJs(`document.getElementById('btn-step-back').click();`);
    await sleep(800);
    const viewAfterRadio = await evalJs(`bomb3D.currentView`);
    console.log('View after step back:', viewAfterRadio);
    if (viewAfterRadio !== 'OVERVIEW') throw new Error('Failed to return to OVERVIEW from INSPECT_RADIO!');

    // Test Keypad (far right blast door)
    console.log('Testing INSPECT_KEYPAD framing...');
    await evalJs(`bomb3D.setView('INSPECT_KEYPAD');`);
    await sleep(900);
    const keypadCam = await evalJs(`({
      pos: { x: bomb3D.camera.position.x, y: bomb3D.camera.position.y, z: bomb3D.camera.position.z },
      fov: bomb3D.camera.fov,
      view: bomb3D.currentView
    })`);
    console.log('Camera in INSPECT_KEYPAD:', keypadCam);
    await captureScreenshot(path.join(artDir, 'screen_verify_silo44_keypad_framing.png'));

    await evalJs(`document.getElementById('btn-step-back').click();`);
    await sleep(800);
    if (await evalJs(`bomb3D.currentView`) !== 'OVERVIEW') throw new Error('Failed to return to OVERVIEW from INSPECT_KEYPAD!');
    console.log('✓ Silo 44 Defuser radio and keypad inspection verified.');


    console.log('\n--- PART 2: OPERATIVE 2 (MANUAL SPECIALIST) NAVIGATION ---');
    // Switch to manual screen
    await evalJs(`
      document.querySelectorAll('section').forEach(s => s.classList.remove('active-screen'));
      document.getElementById('screen-manual').classList.add('active-screen');
      manualView.init('silo44');
    `);
    await sleep(400);

    let manView = await evalJs(`manualView.currentView`);
    console.log('Initial manual view:', manView);
    if (manView !== 'DESK_OVERVIEW') throw new Error('Expected initial manual view DESK_OVERVIEW');

    // Test 2A: Open Binder and return via #manual-back-btn
    console.log('Testing Binder -> #manual-back-btn...');
    await evalJs(`manualView.setView('INSPECT_BINDER');`);
    await sleep(300);

    const backBtnProps = await evalJs(`(() => {
      const b = document.getElementById('manual-back-btn');
      const cs = window.getComputedStyle(b);
      const rect = b.getBoundingClientRect();
      return {
        hidden: b.classList.contains('hidden'),
        display: cs.display,
        zIndex: cs.zIndex,
        top: cs.top,
        right: cs.right,
        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
      };
    })()`);
    console.log('#manual-back-btn computed properties during Binder inspect:', backBtnProps);
    if (backBtnProps.hidden) throw new Error('#manual-back-btn is hidden during Binder inspect!');
    if (parseInt(backBtnProps.zIndex) < 1000) throw new Error('#manual-back-btn zIndex should be >= 1000!');

    await captureScreenshot(path.join(artDir, 'screen_verify_manual_binder_with_back_btn.png'));

    // Click #manual-back-btn
    await evalJs(`document.getElementById('manual-back-btn').click();`);
    await sleep(300);
    manView = await evalJs(`manualView.currentView`);
    console.log('View after clicking #manual-back-btn:', manView);
    if (manView !== 'DESK_OVERVIEW') throw new Error('Failed to return to DESK_OVERVIEW via #manual-back-btn!');

    // Test 2B: Open Corkboard and return via internal .btn-close-modal
    console.log('Testing Corkboard -> internal .btn-close-modal...');
    await evalJs(`manualView.setView('INSPECT_BOARD');`);
    await sleep(300);
    await captureScreenshot(path.join(artDir, 'screen_verify_manual_corkboard_with_close_btn.png'));

    await evalJs(`document.querySelector('#manual-board-inspect .btn-close-modal').click();`);
    await sleep(300);
    manView = await evalJs(`manualView.currentView`);
    console.log('View after corkboard close button:', manView);
    if (manView !== 'DESK_OVERVIEW') throw new Error('Failed to return to DESK_OVERVIEW via corkboard close button!');

    // Test 2C: Open Binder and return via tab .binder-close-btn
    console.log('Testing Binder -> tab .binder-close-btn...');
    await evalJs(`manualView.setView('INSPECT_BINDER');`);
    await sleep(300);
    await evalJs(`document.querySelector('.binder-close-btn').click();`);
    await sleep(300);
    manView = await evalJs(`manualView.currentView`);
    console.log('View after tab close button:', manView);
    if (manView !== 'DESK_OVERVIEW') throw new Error('Failed to return to DESK_OVERVIEW via tab close button!');

    // Test 2D: Open Binder and return via page footer .btn-close-modal
    console.log('Testing Binder -> page footer close button...');
    await evalJs(`manualView.setView('INSPECT_BINDER');`);
    await sleep(300);
    await evalJs(`document.querySelector('.page-footer .btn-close-modal').click();`);
    await sleep(300);
    manView = await evalJs(`manualView.currentView`);
    console.log('View after footer close button:', manView);
    if (manView !== 'DESK_OVERVIEW') throw new Error('Failed to return to DESK_OVERVIEW via footer close button!');

    // Test 2E: Open Corkboard and return via backdrop click
    console.log('Testing Corkboard -> backdrop click...');
    await evalJs(`manualView.setView('INSPECT_BOARD');`);
    await sleep(300);
    await evalJs(`
      const modal = document.getElementById('manual-board-inspect');
      modal.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    `);
    await sleep(300);
    manView = await evalJs(`manualView.currentView`);
    console.log('View after corkboard backdrop click:', manView);
    if (manView !== 'DESK_OVERVIEW') throw new Error('Failed to return to DESK_OVERVIEW via backdrop click!');

    // Test 2F: Open Binder and return via Escape key
    console.log('Testing Binder -> Escape key...');
    await evalJs(`manualView.setView('INSPECT_BINDER');`);
    await sleep(300);
    await evalJs(`
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    `);
    await sleep(300);
    manView = await evalJs(`manualView.currentView`);
    console.log('View after Escape key:', manView);
    if (manView !== 'DESK_OVERVIEW') throw new Error('Failed to return to DESK_OVERVIEW via Escape key!');

    console.log('✓ Operative 2 (Manual Specialist) all navigation methods verified successfully.');


    console.log('\n--- PART 3: OPERATIVE 3 (INTEL ANALYST) NAVIGATION ---');
    // Switch to intel screen
    await evalJs(`
      document.querySelectorAll('section').forEach(s => s.classList.remove('active-screen'));
      document.getElementById('screen-intel').classList.add('active-screen');
      intelView.init('silo44');
    `);
    await sleep(400);

    let intView = await evalJs(`intelView.currentView`);
    console.log('Initial intel view:', intView);
    if (intView !== 'CONSOLE_OVERVIEW') throw new Error('Expected initial intel view CONSOLE_OVERVIEW');

    // Test 3A: Open Oscilloscope and return via #intel-back-btn
    console.log('Testing Oscilloscope -> #intel-back-btn...');
    await evalJs(`intelView.setView('INSPECT_CENTER');`);
    await sleep(300);

    const intelBackBtnProps = await evalJs(`(() => {
      const b = document.getElementById('intel-back-btn');
      const cs = window.getComputedStyle(b);
      return {
        hidden: b.classList.contains('hidden'),
        display: cs.display,
        zIndex: cs.zIndex,
        top: cs.top,
        right: cs.right
      };
    })()`);
    console.log('#intel-back-btn computed properties during Oscilloscope inspect:', intelBackBtnProps);
    if (intelBackBtnProps.hidden) throw new Error('#intel-back-btn is hidden during Oscilloscope inspect!');
    if (parseInt(intelBackBtnProps.zIndex) < 1000) throw new Error('#intel-back-btn zIndex should be >= 1000!');

    await captureScreenshot(path.join(artDir, 'screen_verify_intel_oscilloscope_with_back_btn.png'));

    await evalJs(`document.getElementById('intel-back-btn').click();`);
    await sleep(300);
    intView = await evalJs(`intelView.currentView`);
    console.log('View after clicking #intel-back-btn:', intView);
    if (intView !== 'CONSOLE_OVERVIEW') throw new Error('Failed to return to CONSOLE_OVERVIEW via #intel-back-btn!');

    // Test 3B: Open Dossier and return via internal .btn-close-modal
    console.log('Testing Dossier -> internal .btn-close-modal...');
    await evalJs(`intelView.setView('INSPECT_DOSSIER');`);
    await sleep(300);
    await captureScreenshot(path.join(artDir, 'screen_verify_intel_dossier_with_close_btn.png'));

    await evalJs(`document.querySelector('#intel-inspect-dossier .btn-close-modal').click();`);
    await sleep(300);
    intView = await evalJs(`intelView.currentView`);
    console.log('View after dossier close button:', intView);
    if (intView !== 'CONSOLE_OVERVIEW') throw new Error('Failed to return to CONSOLE_OVERVIEW via dossier close button!');

    // Test 3C: Open Emergency Coolant and return via internal .btn-close-modal
    console.log('Testing Emergency Coolant -> internal .btn-close-modal...');
    await evalJs(`intelView.setView('INSPECT_EMERGENCY');`);
    await sleep(300);
    await captureScreenshot(path.join(artDir, 'screen_verify_intel_emergency_with_close_btn.png'));

    await evalJs(`document.querySelector('#intel-inspect-emergency .btn-close-modal').click();`);
    await sleep(300);
    intView = await evalJs(`intelView.currentView`);
    console.log('View after emergency close button:', intView);
    if (intView !== 'CONSOLE_OVERVIEW') throw new Error('Failed to return to CONSOLE_OVERVIEW via emergency close button!');

    // Test 3D: Open Dossier and return via backdrop click
    console.log('Testing Dossier -> backdrop click...');
    await evalJs(`intelView.setView('INSPECT_DOSSIER');`);
    await sleep(300);
    const clickLog = await evalJs(`(() => {
      const modal = document.getElementById('intel-inspect-dossier');
      const before = intelView.currentView;
      const oc = modal.getAttribute('onclick');
      modal.click();
      const after = intelView.currentView;
      return { before, oc, after };
    })()`);
    console.log('Test 3D Click details:', clickLog);
    await sleep(300);
    intView = await evalJs(`intelView.currentView`);
    console.log('View after dossier backdrop click:', intView);
    if (intView !== 'CONSOLE_OVERVIEW') throw new Error('Failed to return to CONSOLE_OVERVIEW via backdrop click!');

    // Test 3E: Open Emergency Switch and return via Escape key
    console.log('Testing Emergency Switch -> Escape key...');
    await evalJs(`intelView.setView('INSPECT_EMERGENCY');`);
    await sleep(300);
    await evalJs(`
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    `);
    await sleep(300);
    intView = await evalJs(`intelView.currentView`);
    console.log('View after Escape key:', intView);
    if (intView !== 'CONSOLE_OVERVIEW') throw new Error('Failed to return to CONSOLE_OVERVIEW via Escape key!');

    console.log('✓ Operative 3 (Intel Analyst) all navigation methods verified successfully.');

    console.log('\n========================================');
    console.log('ALL VERIFICATION TESTS PASSED PERFECTLY!');
    console.log('========================================\n');

  } catch (err) {
    console.error('TEST SUITE ERROR:', err);
    process.exitCode = 1;
  } finally {
    try { ws.close(); } catch (_) {}
    try { chromeProc.kill(); } catch (_) {}
  }
}

runNavigationTests();
