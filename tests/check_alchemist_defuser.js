const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const WebSocket = globalThis.WebSocket;

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

async function run() {
  console.log('--- STARTING ALCHEMIST DEFUSER INSPECTION ---');

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.join(__dirname, '.chrome-test-alchemist-defuser');

  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9230',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    `--user-data-dir=${userDataDir}`,
    'http://localhost:8000'
  ]);

  await sleep(1500);

  const list = await (await fetch('http://localhost:9230/json/list')).json();
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

  // 1. Check window.ESCAPE_MAPS and environments
  const mapCheck = await evalJs(`({
    maps: Object.keys(window.ESCAPE_MAPS || {}),
    alchemistConfig: !!window.ESCAPE_MAPS?.alchemist,
    envClass: !!window.ESCAPE_MAPS?.alchemist?.getEnvClass(),
    windowAlchemistEnv: typeof window.AlchemistStudyEnvironment,
    windowSilo44Env: typeof window.Silo44Environment
  })`);
  console.log('Environment Class Check:', mapCheck);

  // 2. Select Alchemist scenario in lobby
  await evalJs(`game.selectScenario('alchemist')`);
  await evalJs(`document.getElementById('room-input').value = 'TESTALCH'`);
  await evalJs(`document.getElementById('btn-create-room').click()`);
  await sleep(400);
  await evalJs(`game.toggleRole('defuser')`);
  await sleep(300);
  
  const lobbyState = await evalJs(`({
    scenario: game.scenario,
    role: game.role,
    isHost: network.isHost
  })`);
  console.log('Lobby State:', lobbyState);

  // 3. Start game
  await evalJs(`document.getElementById('btn-start-game').click()`);
  await sleep(1200);

  // 4. Capture overview
  await capture('screen_alchemist_defuser_overview.png');

  const defuserState = await evalJs(`({
    activeScreen: document.querySelector('.game-screen.active')?.id,
    currentMap: bomb3D.currentMap,
    currentView: bomb3D.currentView,
    activeEnv: !!bomb3D.envManager?.activeEnv,
    hotspotsCount: bomb3D.envManager?.activeEnv?.hotspots?.length,
    timerText: document.getElementById('defuser-timer')?.innerText,
    levelTitle: document.getElementById('defuser-level-title')?.innerText,
    quadrantBarHidden: document.getElementById('bomb-quadrant-bar')?.classList.contains('hidden'),
    stepBackBtnHidden: document.getElementById('btn-step-back')?.classList.contains('hidden')
  })`);
  console.log('Defuser State in Game:', defuserState);

  // 5. Test clicking each inspection view
  const views = ['INSPECT_PUZZLE_BOX', 'INSPECT_ASTROLABE', 'INSPECT_FIREPLACE', 'INSPECT_CLOCK'];
  for (const v of views) {
    await evalJs(`bomb3D.setView('${v}')`);
    await sleep(500);
    const hudState = await evalJs(`({
      view: bomb3D.currentView,
      zodiacHidden: document.getElementById('zodiac-inspect-hud')?.classList.contains('hidden'),
      mercuryHidden: document.getElementById('mercury-inspect-hud')?.classList.contains('hidden'),
      prismHidden: document.getElementById('prism-inspect-hud')?.classList.contains('hidden'),
      escapementHidden: document.getElementById('escapement-inspect-hud')?.classList.contains('hidden'),
      stepBackHidden: document.getElementById('btn-step-back')?.classList.contains('hidden')
    })`);
    console.log(`HUD state for ${v}:`, hudState);
    await capture(`screen_alchemist_defuser_${v.toLowerCase()}.png`);
  }

  // 5b. Test Grimoire Lore Modal
  await evalJs(`bomb3D.setView('INSPECT_GRIMOIRE')`);
  await sleep(500);
  const grimoireState = await evalJs(`({
    modalHidden: document.getElementById('lore-inspect-modal')?.classList.contains('hidden'),
    title: document.getElementById('lore-modal-title')?.innerText
  })`);
  console.log('Grimoire Modal State:', grimoireState);
  await capture('screen_alchemist_defuser_inspect_grimoire.png');
  await evalJs(`game.closeLoreModal()`);
  await sleep(400);

  // 6. Test mobile viewport
  await send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 667,
    deviceScaleFactor: 2,
    mobile: true
  });
  await sleep(500);
  await capture('screen_alchemist_mobile_overview.png');

  for (const v of views) {
    await evalJs(`bomb3D.setView('${v}')`);
    await sleep(500);
    await capture(`screen_alchemist_mobile_${v.toLowerCase()}.png`);
  }

  console.log('Total Console Errors:', consoleErrors.length);

  ws.close();
  chromeProc.kill();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
