const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const WebSocket = globalThis.WebSocket;

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

async function runMapLevelTest() {
  console.log('=== VERIFYING MAP SELECTION AS INDEPENDENT OPERATION LEVELS ===');

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.join(__dirname, '.chrome-test-level-profile');

  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9228',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    `--user-data-dir=${userDataDir}`,
    'http://localhost:8000'
  ]);

  await sleep(1800);

  const list = await (await fetch('http://localhost:9228/json/list')).json();
  const pageTarget = list.find(t => t.type === 'page');
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  let msgId = 1;
  const callbacks = new Map();
  await new Promise(res => { ws.onopen = res; });

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
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

  const artDir = process.env.ARTIFACT_DIR || 'C:\\Users\\LENOVO\\.gemini\\antigravity-ide\\brain\\59195771-93a1-4c45-a53d-5895ada2a187';

  try {
    console.log('\n--- TEST 1: CHOOSE MAP 1 (SILO 44) IN LOBBY & LAUNCH ---');
    await evalJs(`
      document.getElementById('room-input').value = 'LEVEL1';
      document.getElementById('btn-create-room').click();
    `);
    await sleep(300);
    // Select Map 1 explicitly
    await evalJs(`game.selectScenario('silo44');`);
    await sleep(200);
    await evalJs(`game.toggleRole('defuser');`);
    await sleep(200);
    await evalJs(`document.getElementById('btn-start-game').click();`);
    await sleep(1000);

    const level1Check = await evalJs(`(() => {
      const mapButtons = document.querySelectorAll('.map-btn-group, .btn-map');
      const levelTitle = document.getElementById('defuser-level-title')?.innerText;
      const topLevelName = document.getElementById('level-display-name')?.innerText;
      const currentMap = bomb3D.currentMap;
      return {
        mapButtonCount: mapButtons.length,
        levelTitle,
        topLevelName,
        currentMap
      };
    })()`);
    console.log('Map 1 in-game verification:', level1Check);

    if (level1Check.mapButtonCount > 0) {
      throw new Error(`Expected 0 in-game map switching buttons, found ${level1Check.mapButtonCount}!`);
    }
    if (!level1Check.levelTitle.includes('SILO 44')) {
      throw new Error(`Expected HUD title to indicate SILO 44, got "${level1Check.levelTitle}"`);
    }
    if (level1Check.currentMap !== 'silo44') {
      throw new Error(`Expected currentMap 'silo44', got "${level1Check.currentMap}"`);
    }

    await captureScreenshot(path.join(artDir, 'screen_verify_map1_silo44_hud.png'));
    console.log('✓ Map 1 launches exclusively in Silo 44 with static level badge and no mid-game switcher.');


    console.log('\n--- TEST 2: CHOOSE MAP 2 (THE ALCHEMIST\'S STUDY) IN LOBBY & LAUNCH ---');
    // Navigate back to lobby (reload page)
    await send('Page.navigate', { url: 'http://localhost:8000' });
    await sleep(1200);

    await evalJs(`
      document.getElementById('room-input').value = 'LEVEL2';
      document.getElementById('btn-create-room').click();
    `);
    await sleep(300);
    // Select Map 2 explicitly in lobby
    await evalJs(`game.selectScenario('alchemist');`);
    await sleep(200);
    await evalJs(`game.toggleRole('defuser');`);
    await sleep(200);
    await evalJs(`document.getElementById('btn-start-game').click();`);
    await sleep(1200);

    const level2Check = await evalJs(`(() => {
      const mapButtons = document.querySelectorAll('.map-btn-group, .btn-map');
      const levelTitle = document.getElementById('defuser-level-title')?.innerText;
      const topLevelName = document.getElementById('level-display-name')?.innerText;
      const currentMap = bomb3D.currentMap;
      const isGold = document.getElementById('defuser-level-badge')?.classList.contains('gold');
      return {
        mapButtonCount: mapButtons.length,
        levelTitle,
        topLevelName,
        currentMap,
        isGold
      };
    })()`);
    console.log('Map 2 in-game verification:', level2Check);

    if (level2Check.mapButtonCount > 0) {
      throw new Error(`Expected 0 in-game map switching buttons, found ${level2Check.mapButtonCount}!`);
    }
    if (!level2Check.levelTitle.includes("ALCHEMIST'S STUDY")) {
      throw new Error(`Expected HUD title to indicate ALCHEMIST'S STUDY, got "${level2Check.levelTitle}"`);
    }
    if (level2Check.currentMap !== 'alchemist') {
      throw new Error(`Expected currentMap 'alchemist', got "${level2Check.currentMap}"`);
    }
    if (!level2Check.isGold) {
      throw new Error('Expected gold badge for Victorian Alchemist level!');
    }

    await captureScreenshot(path.join(artDir, 'screen_verify_map2_alchemist_hud.png'));
    console.log('✓ Map 2 launches exclusively in The Alchemist\'s Study with static level badge and no mid-game switcher.');

    console.log('\n=============================================');
    console.log('ALL MAP LEVEL VERIFICATION TESTS PASSED!');
    console.log('=============================================\n');

  } catch (err) {
    console.error('TEST ERROR:', err);
    process.exitCode = 1;
  } finally {
    try { ws.close(); } catch (_) {}
    try { chromeProc.kill(); } catch (_) {}
  }
}

runMapLevelTest();
