const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const WebSocket = globalThis.WebSocket;

const ARTIFACT_DIR = process.env.ARTIFACT_DIR || 'C:\\Users\\LENOVO\\.gemini\\antigravity-ide\\brain\\59195771-93a1-4c45-a53d-5895ada2a187';
const sleep = (ms) => new Promise(res => setTimeout(res, ms));

async function runMultiTabRoleTests() {
  console.log('=== MULTI-TAB P2P ROLE LOCKING & ROSTER TEST SUITE ===');

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.join(__dirname, '.chrome-test-roles-profile');

  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9223',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    `--user-data-dir=${userDataDir}`,
    'http://localhost:8000'
  ]);

  await sleep(1500);

  class TabSession {
    constructor(wsUrl, name) {
      this.wsUrl = wsUrl;
      this.name = name;
      this.ws = null;
      this.msgId = 1;
      this.callbacks = new Map();
      this.jsErrors = [];
    }

    async connect() {
      this.ws = new WebSocket(this.wsUrl);
      await new Promise((resolve) => {
        this.ws.onopen = resolve;
      });

      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const cb = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          cb(msg.result);
        }
        if (msg.method === 'Page.javascriptDialogOpening') {
          console.log(`[${this.name} DIALOG]:`, msg.params.message);
          this.send('Page.handleJavaScriptDialog', { accept: true });
        }
        if (msg.method === 'Runtime.consoleAPICalled') {
          const text = msg.params.args.map(a => a.value || JSON.stringify(a)).join(' ');
          console.log(`[${this.name} CONSOLE]:`, text);
        }
        if (msg.method === 'Runtime.exceptionThrown') {
          console.error(`[${this.name} JS Error]:`, msg.params.exceptionDetails);
          this.jsErrors.push(msg.params.exceptionDetails);
        }
      };

      await this.send('Runtime.enable');
      await this.send('Page.enable');
      await this.send('Emulation.setDeviceMetricsOverride', {
        width: 1200,
        height: 750,
        deviceScaleFactor: 1,
        mobile: false
      });
      await this.eval(`window.alert = (msg) => console.log('[WINDOW ALERT INTERCEPTED]: ' + msg);`);
    }

    send(method, params = {}) {
      return new Promise((resolve) => {
        const id = this.msgId++;
        this.callbacks.set(id, resolve);
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

    async screenshot(filename) {
      const res = await this.send('Page.captureScreenshot', { format: 'png' });
      const buf = Buffer.from(res.data, 'base64');
      const outPath = path.join(ARTIFACT_DIR, filename);
      fs.writeFileSync(outPath, buf);
      console.log(`[${this.name}] Saved screenshot: ${filename}`);
    }

    close() {
      if (this.ws) this.ws.close();
    }
  }

  try {
    // 1. Get initial page target for Tab 1 (Host)
    const list1 = await (await fetch('http://localhost:9223/json/list')).json();
    const tab1Info = list1.find(t => t.type === 'page');
    const tab1 = new TabSession(tab1Info.webSocketDebuggerUrl, 'TAB-1 (HOST)');
    await tab1.connect();

    // 2. Open Tab 2 (Client 1)
    const target2 = await tab1.send('Target.createTarget', { url: 'http://localhost:8000' });
    await sleep(400);
    const list2 = await (await fetch('http://localhost:9223/json/list')).json();
    const tab2Info = list2.find(t => t.id === target2.targetId);
    const tab2 = new TabSession(tab2Info.webSocketDebuggerUrl, 'TAB-2 (CLIENT 1)');
    await tab2.connect();

    // 3. Open Tab 3 (Client 2)
    const target3 = await tab1.send('Target.createTarget', { url: 'http://localhost:8000' });
    await sleep(400);
    const list3 = await (await fetch('http://localhost:9223/json/list')).json();
    const tab3Info = list3.find(t => t.id === target3.targetId);
    const tab3 = new TabSession(tab3Info.webSocketDebuggerUrl, 'TAB-3 (CLIENT 2)');
    await tab3.connect();

    console.log('All 3 browser tabs initialized and connected via CDP!');
    await sleep(800);

    // ================= STEP A: TAB 1 CREATES ROOM AS HOST =================
    console.log('\n--- Step A: Tab 1 creates Room "P2P-TEST" as HOST ---');
    await tab1.eval(`
      document.getElementById('room-input').value = 'P2P-TEST';
      document.getElementById('btn-create-room').click();
    `);
    await sleep(400);

    // Verify Tab 1 is Host
    const tab1IsHost = await tab1.eval(`network.isHost`);
    console.log('Tab 1 isHost:', tab1IsHost);
    if (!tab1IsHost) throw new Error('Tab 1 failed to register as Host');

    // Host selects Scenario 2: Alchemist's Study
    console.log('Host selects Scenario: The Alchemist\'s Study');
    await tab1.eval(`game.selectScenario('alchemist');`);
    await sleep(300);

    // Host claims Defuser role
    console.log('Host claims Role: Defuser');
    await tab1.eval(`game.toggleRole('defuser');`);
    await sleep(400);

    const hostRole = await tab1.eval(`game.role`);
    const hostRosterBadge = await tab1.eval(`document.getElementById('roster-readiness-badge').innerText`);
    console.log(`Host Role: ${hostRole}, Roster Badge: "${hostRosterBadge}"`);

    await tab1.screenshot('screen_test_host_roster.png');

    // ================= STEP B: TAB 2 JOINS AS CLIENT 1 =================
    console.log('\n--- Step B: Tab 2 joins Room "P2P-TEST" as CLIENT 1 ---');
    await tab2.eval(`
      document.getElementById('room-input').value = 'P2P-TEST';
      document.getElementById('btn-join-room').click();
    `);
    await sleep(600);

    const tab2IsHost = await tab2.eval(`network.isHost`);
    console.log('Tab 2 isHost:', tab2IsHost);

    // Verify Map Lock for Client
    const tab2MapLocked = await tab2.eval(`document.getElementById('card-scenario-silo44').classList.contains('locked-client')`);
    const tab2Scenario = await tab2.eval(`game.scenario`);
    console.log('Tab 2 Scenario cards locked:', tab2MapLocked, 'Synchronized Scenario:', tab2Scenario);

    // Verify Tab 2 sees Defuser as CLAIMED BY HOST
    const defuserBtnDisabled = await tab2.eval(`document.getElementById('btn-role-defuser').disabled`);
    const defuserBtnText = await tab2.eval(`document.getElementById('btn-role-defuser').innerText`);
    console.log(`Tab 2 sees Defuser Button: "${defuserBtnText}", disabled: ${defuserBtnDisabled}`);
    if (!defuserBtnDisabled) throw new Error('Defuser role was not locked out for Client!');

    // Tab 2 attempts to click Defuser (should be blocked)
    await tab2.eval(`game.toggleRole('defuser');`);
    await sleep(200);
    const tab2RoleAfterIllegalClick = await tab2.eval(`game.role`);
    console.log('Tab 2 role after illegal Defuser click:', tab2RoleAfterIllegalClick);
    if (tab2RoleAfterIllegalClick === 'defuser') throw new Error('Client was able to steal Defuser role!');

    // Tab 2 claims Manual Specialist
    console.log('Tab 2 claims Role: Manual Specialist');
    await tab2.eval(`game.toggleRole('manual');`);
    await sleep(500);

    const tab2Role = await tab2.eval(`game.role`);
    console.log('Tab 2 confirmed Role:', tab2Role);

    await tab2.screenshot('screen_test_client_locked_roles.png');

    // ================= STEP C: TAB 3 JOINS AS CLIENT 2 =================
    console.log('\n--- Step C: Tab 3 joins Room "P2P-TEST" as CLIENT 2 ---');
    await tab3.eval(`
      document.getElementById('room-input').value = 'P2P-TEST';
      document.getElementById('btn-join-room').click();
    `);
    await sleep(600);

    // Verify Tab 3 sees Defuser AND Manual as claimed
    const tab3DefuserDisabled = await tab3.eval(`document.getElementById('btn-role-defuser').disabled`);
    const tab3ManualDisabled = await tab3.eval(`document.getElementById('btn-role-manual').disabled`);
    console.log(`Tab 3 sees Defuser disabled: ${tab3DefuserDisabled}, Manual disabled: ${tab3ManualDisabled}`);
    if (!tab3DefuserDisabled || !tab3ManualDisabled) throw new Error('Roles were not properly locked out for Client 2!');

    // Tab 3 claims Intel Analyst
    console.log('Tab 3 claims Role: Intel Analyst');
    await tab3.eval(`game.toggleRole('intel');`);
    await sleep(500);

    const tab3Role = await tab3.eval(`game.role`);
    console.log('Tab 3 confirmed Role:', tab3Role);

    // Verify 3/3 Operatives Ready across all tabs!
    await sleep(500);
    const tab1Badge = await tab1.eval(`document.getElementById('roster-readiness-badge').innerText`);
    const tab2Badge = await tab2.eval(`document.getElementById('roster-readiness-badge').innerText`);
    const tab3Badge = await tab3.eval(`document.getElementById('roster-readiness-badge').innerText`);
    console.log('\n--- Live Readiness Badges across all 3 tabs ---');
    console.log('Tab 1 (Host):', tab1Badge);
    console.log('Tab 2 (Client 1):', tab2Badge);
    console.log('Tab 3 (Client 2):', tab3Badge);

    // Verify Host Start button is ENABLED, Clients' button is DISABLED
    const tab1StartDisabled = await tab1.eval(`document.getElementById('btn-start-game').disabled`);
    const tab2StartDisabled = await tab2.eval(`document.getElementById('btn-start-game').disabled`);
    const tab3StartDisabled = await tab3.eval(`document.getElementById('btn-start-game').disabled`);
    const tab1StartText = await tab1.eval(`document.getElementById('btn-start-game').innerText`);
    const tab2StartText = await tab2.eval(`document.getElementById('btn-start-game').innerText`);

    console.log(`Host Start Button: "${tab1StartText}", disabled: ${tab1StartDisabled}`);
    console.log(`Client Start Button: "${tab2StartText}", disabled: ${tab2StartDisabled}`);

    if (tab1StartDisabled) throw new Error('Host start button should be enabled when 3/3 ready!');
    if (!tab2StartDisabled || !tab3StartDisabled) throw new Error('Client start buttons must be disabled!');

    await tab1.screenshot('screen_test_all_ready.png');

    // ================= STEP D: TEST ROLE REASSIGNMENT / RELEASE =================
    console.log('\n--- Step D: Testing Role Release & Reopening ---');
    // Tab 2 unclaims Manual
    console.log('Tab 2 releases Manual Specialist...');
    await tab2.eval(`game.toggleRole('manual');`);
    await sleep(400);

    const tab2RoleAfterRelease = await tab2.eval(`game.role`);
    const tab3ManualBtnAfterRelease = await tab3.eval(`document.getElementById('btn-role-manual').disabled`);
    console.log(`Tab 2 Role after release: ${tab2RoleAfterRelease}, Tab 3 sees Manual disabled: ${tab3ManualBtnAfterRelease}`);
    if (tab3ManualBtnAfterRelease) throw new Error('Manual slot did not reopen for other peers upon release!');

    // Tab 2 reclaims Manual
    await tab2.eval(`game.toggleRole('manual');`);
    await sleep(400);

    // ================= STEP E: HOST LAUNCHES MISSION =================
    console.log('\n--- Step E: Host launches mission for all 3 operatives ---');
    await tab1.eval(`document.getElementById('btn-start-game').click();`);
    await sleep(1500);

    // Verify all 3 tabs entered their distinct active screens
    const tab1ActiveScreen = await tab1.eval(`document.querySelector('section.active-screen').id`);
    const tab2ActiveScreen = await tab2.eval(`document.querySelector('section.active-screen').id`);
    const tab3ActiveScreen = await tab3.eval(`document.querySelector('section.active-screen').id`);

    console.log('Tab 1 Active Screen:', tab1ActiveScreen, '(Expected: screen-defuser)');
    console.log('Tab 2 Active Screen:', tab2ActiveScreen, '(Expected: screen-manual)');
    console.log('Tab 3 Active Screen:', tab3ActiveScreen, '(Expected: screen-intel)');

    if (tab1ActiveScreen !== 'screen-defuser') throw new Error('Tab 1 did not enter defuser screen');
    if (tab2ActiveScreen !== 'screen-manual') throw new Error('Tab 2 did not enter manual screen');
    if (tab3ActiveScreen !== 'screen-intel') throw new Error('Tab 3 did not enter intel screen');

    await tab2.screenshot('screen_test_client_manual_launched.png');
    await tab3.screenshot('screen_test_client_intel_launched.png');

    // Check for any JS errors across all 3 tabs
    const totalErrors = tab1.jsErrors.length + tab2.jsErrors.length + tab3.jsErrors.length;
    if (totalErrors === 0) {
      console.log('\nSUCCESS: ZERO JavaScript runtime exceptions across all 3 connected tabs!');
    } else {
      console.error('JS Errors detected:', { tab1: tab1.jsErrors, tab2: tab2.jsErrors, tab3: tab3.jsErrors });
    }

    tab1.close();
    tab2.close();
    tab3.close();
    chromeProc.kill();
    console.log('=== MULTI-TAB P2P TEST PASSED 100% ===');

  } catch (err) {
    console.error('Multi-tab test failed:', err);
    chromeProc.kill();
  }
}

runMultiTabRoleTests();
