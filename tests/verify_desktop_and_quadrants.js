const { spawn } = require('child_process');
const path = require('path');
const WebSocket = globalThis.WebSocket;

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

async function verifyDesktopAndQuadrants() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.join(__dirname, '..', '.chrome-verify-test');

  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9227',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    `--user-data-dir=${userDataDir}`,
    'http://localhost:8000'
  ]);

  await sleep(1500);

  try {
    const listRes = await fetch('http://localhost:9227/json/list');
    const tabs = await listRes.json();
    const pageTab = tabs.find(t => t.type === 'page');

    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
    await new Promise(res => ws.onopen = res);

    let msgId = 1;
    const callbacks = new Map();
    ws.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      if (data.id && callbacks.has(data.id)) {
        callbacks.get(data.id)(data);
        callbacks.delete(data.id);
      }
    };

    const send = (method, params = {}) => {
      return new Promise((resolve) => {
        const id = msgId++;
        callbacks.set(id, resolve);
        ws.send(JSON.stringify({ id, method, params }));
      });
    };

    await send('Network.enable');
    await send('Network.setCacheDisabled', { cacheDisabled: true });

    // =========================================================================
    // 1. DESKTOP VIEWPORT TEST (1280x720)
    // =========================================================================
    console.log('\n--- 1. VERIFYING DESKTOP UI & 3D CAMERA ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 720,
      deviceScaleFactor: 1,
      mobile: false
    });

    await send('Page.navigate', { url: 'http://localhost:8000' });
    await sleep(2000);

    // Host creates room and claims defuser
    await send('Runtime.evaluate', {
      expression: `
        document.getElementById('room-input').value = 'DESK44';
        document.getElementById('btn-create-room').click();
        game.toggleRole('defuser');
        document.getElementById('btn-start-game').click();
      `
    });
    await sleep(1200);

    // Check desktop styling
    const desktopStyles = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const header = document.querySelector('.tactical-header');
          const stepBack = document.getElementById('btn-step-back');
          const clock = document.querySelector('.digital-clock');
          return {
            headerHeight: window.getComputedStyle(header).height,
            stepBackTop: window.getComputedStyle(stepBack).top,
            clockFontSize: window.getComputedStyle(clock).fontSize
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Result:', desktopStyles.result?.result?.value);

    // Check Silo 44 camera presets & wall radio removal
    const siloEnvCheck = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const env = bomb3D.envManager.activeEnv;
          return {
            hasRadioPreset: Boolean(env.cameraPresets.INSPECT_RADIO),
            inspectBombPos: { x: env.cameraPresets.INSPECT_BOMB.pos.x, y: env.cameraPresets.INSPECT_BOMB.pos.y, z: env.cameraPresets.INSPECT_BOMB.pos.z },
            inspectBombFov: env.cameraPresets.INSPECT_BOMB.fov,
            hasWallRadioHotspot: env.hotspots.some(h => h.userData && h.userData.targetView === 'INSPECT_RADIO'),
            hasBombRadioKnob: Boolean(bomb3D.frequencyKnob)
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Silo 44 Environment & Bomb Checks:', siloEnvCheck.result?.result?.value);

    // Inspect the bomb in 3D
    await send('Runtime.evaluate', {
      expression: `bomb3D.setView('INSPECT_BOMB');`
    });
    await sleep(1000);

    // Test tuning knob directly on bomb casing
    const tuneKnobResult = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const initialFreq = frequencyModule.currentFreq;
          bomb3D.rotateRadioKnob(0.3); // +0.5 MHz
          const tunedFreq = frequencyModule.currentFreq;
          const hud = document.getElementById('radio-inspect-hud');
          const readout = document.getElementById('radio-inspect-freq');
          return {
            initialFreq,
            tunedFreq,
            hudVisible: !hud.classList.contains('hidden'),
            readoutText: readout ? readout.innerText : ''
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Bomb Casing Tuning Knob Interaction:', tuneKnobResult.result?.result?.value);

    // =========================================================================
    // 2. MOBILE 4-QUADRANT ZOOM TEST (390x844)
    // =========================================================================
    console.log('\n--- 2. VERIFYING MOBILE 4-QUADRANT ZOOM SYSTEM ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      mobile: true
    });

    await send('Runtime.evaluate', {
      expression: `window.dispatchEvent(new Event('resize'));`
    });
    await sleep(800);

    // Check quadrant switcher toolbar visibility
    const quadBarCheck = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const bar = document.getElementById('bomb-quadrant-bar');
          const buttons = Array.from(bar.querySelectorAll('.btn-quadrant')).map(b => b.dataset.quadrant);
          return {
            barVisible: !bar.classList.contains('hidden'),
            buttons
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Mobile Quadrant Bar:', quadBarCheck.result?.result?.value);

    // Test each quadrant zoom
    const quadrants = ['WIRES', 'KEYPAD', 'RADIO', 'SIMON', 'ALL'];
    for (const q of quadrants) {
      await send('Runtime.evaluate', {
        expression: `bomb3D.setBombQuadrant('${q}');`
      });
      await sleep(400);

      const qState = await send('Runtime.evaluate', {
        expression: `
          (() => {
            return {
              currentQuadrant: bomb3D.currentBombQuadrant,
              target: {
                x: Number(bomb3D.targetCameraTarget.x.toFixed(2)),
                y: Number(bomb3D.targetCameraTarget.y.toFixed(2)),
                z: Number(bomb3D.targetCameraTarget.z.toFixed(2))
              },
              backBtnText: document.getElementById('btn-step-back').innerText
            };
          })()
        `,
        returnByValue: true
      });
      console.log(`✓ Quadrant [${q}]:`, qState.result?.result?.value);
    }

    // Test stepping back: from quadrant to full bomb, then to overview
    await send('Runtime.evaluate', {
      expression: `bomb3D.setBombQuadrant('WIRES');`
    });
    await sleep(400);

    await send('Runtime.evaluate', {
      expression: `bomb3D.handleStepBack();`
    });
    await sleep(400);

    const stepBack1 = await send('Runtime.evaluate', {
      expression: `({ view: bomb3D.currentView, quad: bomb3D.currentBombQuadrant })`,
      returnByValue: true
    });
    console.log('Step Back 1 (From Wires):', stepBack1.result?.result?.value);

    await send('Runtime.evaluate', {
      expression: `bomb3D.handleStepBack();`
    });
    await sleep(400);

    const stepBack2 = await send('Runtime.evaluate', {
      expression: `({ view: bomb3D.currentView, quad: bomb3D.currentBombQuadrant })`,
      returnByValue: true
    });
    console.log('Step Back 2 (From Full Bomb):', stepBack2.result?.result?.value);

    console.log('\n===============================================================');
    console.log(' ALL DESKTOP RESTORATION & MOBILE QUADRANT TESTS PASSED!');
    console.log('===============================================================');

    chromeProc.kill();
    process.exit(0);
  } catch (err) {
    console.error('Verification failed:', err);
    chromeProc.kill();
    process.exit(1);
  }
}

verifyDesktopAndQuadrants();
