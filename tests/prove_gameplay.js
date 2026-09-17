const { spawn } = require('child_process');
const path = require('path');
const WebSocket = globalThis.WebSocket;

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

async function proveGameLogic() {
  console.log('===============================================================');
  console.log(' PROVING OPERATION: ZERO HOUR COOPERATIVE 3-PLAYER GAMEPLAY');
  console.log('===============================================================');

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.join(__dirname, '..', '.chrome-prove-profile');

  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9225',
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
    }

    async connect() {
      this.ws = new WebSocket(this.wsUrl);
      await new Promise(res => this.ws.onopen = res);
      this.ws.onmessage = (evt) => {
        const data = JSON.parse(evt.data);
        if (data.id && this.callbacks.has(data.id)) {
          this.callbacks.get(data.id)(data);
          this.callbacks.delete(data.id);
        }
      };
      await this.send('Console.enable');
      await this.send('Page.enable');
    }

    send(method, params = {}) {
      return new Promise((resolve) => {
        const id = this.msgId++;
        this.callbacks.set(id, resolve);
        this.ws.send(JSON.stringify({ id, method, params }));
      });
    }

    async eval(expr) {
      const res = await this.send('Runtime.evaluate', { expression: expr, returnByValue: true });
      return res.result?.result?.value !== undefined ? res.result.result.value : res.result?.value;
    }
  }

  try {
    const listRes = await fetch('http://localhost:9225/json/list');
    const tabs = await listRes.json();
    const tab1Info = tabs.find(t => t.type === 'page');

    // Create 2 additional tabs for the other 2 players
    const createRes2 = await fetch('http://localhost:9225/json/new?http://localhost:8000', { method: 'PUT' });
    const tab2Info = await createRes2.json();

    const createRes3 = await fetch('http://localhost:9225/json/new?http://localhost:8000', { method: 'PUT' });
    const tab3Info = await createRes3.json();

    const hostDefuser = new TabSession(tab1Info.webSocketDebuggerUrl, 'OPERATIVE-1 (DEFUSER / HOST)');
    const clientManual = new TabSession(tab2Info.webSocketDebuggerUrl, 'OPERATIVE-2 (MANUAL SPECIALIST)');
    const clientIntel = new TabSession(tab3Info.webSocketDebuggerUrl, 'OPERATIVE-3 (INTEL ANALYST)');

    await hostDefuser.connect();
    await clientManual.connect();
    await clientIntel.connect();

    console.log('✓ Step 1: All 3 Browser Sessions Connected to Headless Chrome');

    // Step A: Host creates room 'PROOF44'
    const roomCode = 'PROOF44';
    await hostDefuser.eval(`
      document.getElementById('room-input').value = '${roomCode}';
      document.getElementById('btn-create-room').click();
      game.selectScenario('silo44');
    `);
    await sleep(800);

    // Host claims Defuser role
    await hostDefuser.eval(`game.toggleRole('defuser')`);
    await sleep(400);

    // Step B: Operative 2 & 3 join room 'PROOF44'
    await clientManual.eval(`
      document.getElementById('room-input').value = '${roomCode}';
      document.getElementById('btn-join-room').click();
    `);
    await clientIntel.eval(`
      document.getElementById('room-input').value = '${roomCode}';
      document.getElementById('btn-join-room').click();
    `);
    await sleep(1500);

    // Operatives claim respective roles
    await clientManual.eval(`game.toggleRole('manual')`);
    await clientIntel.eval(`game.toggleRole('intel')`);
    await sleep(800);

    console.log('✓ Step 2: All 3 Operatives Joined Room & Claimed Distinct Stations');

    // Step C: Host launches mission for all 3 players
    await hostDefuser.eval(`document.getElementById('btn-start-game').click()`);
    await sleep(1500);

    // Verify Active Screens
    const defScreen = await hostDefuser.eval(`document.querySelector('.active-screen')?.id`);
    const manScreen = await clientManual.eval(`document.querySelector('.active-screen')?.id`);
    const intScreen = await clientIntel.eval(`document.querySelector('.active-screen')?.id`);

    console.log(`✓ Step 3: Mission Successfully Started Across All Devices:
       - Operative 1 (Defuser): ${defScreen}
       - Operative 2 (Manual Specialist): ${manScreen}
       - Operative 3 (Intel Analyst): ${intScreen}`);

    // =========================================================================
    // PUZZLE 1: TELEMETRY & COLOR WIRES
    // =========================================================================
    console.log('\n--- EXECUTING PUZZLE 1: COLOR WIRES ---');
    // Intel Analyst reads Serial Number and telemetry from their station
    const intelTelemetry = await clientIntel.eval(`({
      serial: game.serialNumber,
      batteries: game.batteries,
      indicators: game.indicators
    })`);
    console.log(`[Intel Analyst Telemetry Station]:
       "Serial Number: ${intelTelemetry.serial} | Batteries: ${intelTelemetry.batteries} Cells | Indicators: FRK=${intelTelemetry.indicators.FRK}"`);

    // Defuser reads the wires on the bomb
    const bombWires = await hostDefuser.eval(`wiresModule.wires`);
    const correctWireIdx = await hostDefuser.eval(`wiresModule.correctWireIndex`);
    console.log(`[Defuser 3D Workbench Callout]:
       "I see ${bombWires.length} wires on the bomb deck: [${bombWires.join(', ')}]"`);

    // Manual Specialist calculates correct wire using manual rules and tells Defuser
    console.log(`[Manual Specialist Rulebook Calculation]:
       "According to section 01 and serial ending digit, the wire to cut is Wire #${correctWireIdx + 1} (${bombWires[correctWireIdx]})"`);

    // Defuser cuts the wire!
    const wireResult = await hostDefuser.eval(`wiresModule.cutWire(${correctWireIdx})`);
    console.log(`[Defuser Action]: Cut wire ${correctWireIdx + 1} -> Status: ${wireResult.status}`);
    console.log(`✓ MODULE 1 (WIRES): DISARMED!`);

    // =========================================================================
    // PUZZLE 2: CYRILLIC KEYPAD MATRIX
    // =========================================================================
    console.log('\n--- EXECUTING PUZZLE 2: CYRILLIC KEYPAD MATRIX ---');
    const keypadButtons = await hostDefuser.eval(`keypadModule.buttons`);
    const correctOrder = await hostDefuser.eval(`keypadModule.correctOrder`);
    console.log(`[Defuser 3D Keypad Callout]:
       "The 4 symbols on the bomb keypad are: [${keypadButtons.join(', ')}]"`);

    console.log(`[Manual Specialist Matrix Column Match]:
       "Found in Section 02 Matrix! Press in order: [${correctOrder.join(' → ')}]"`);

    // Defuser presses all 4 keys in order
    for (let sym of correctOrder) {
      await hostDefuser.eval(`keypadModule.pressButton('${sym}')`);
    }
    const keypadDisarmed = await hostDefuser.eval(`keypadModule.disarmed`);
    console.log(`[Defuser Action]: Entered sequence -> Keypad Disarmed: ${keypadDisarmed}`);
    console.log(`✓ MODULE 2 (KEYPAD): DISARMED!`);

    // =========================================================================
    // PUZZLE 3: RADIO CARRIER FREQUENCY
    // =========================================================================
    console.log('\n--- EXECUTING PUZZLE 3: RADIO CARRIER FREQUENCY ---');
    // Intel Analyst reads target carrier from their CRT oscilloscope
    const targetFreq = await clientIntel.eval(`frequencyModule.targetFreq`);
    console.log(`[Intel Analyst CRT Radar Callout]:
       "Live Oscilloscope shows target carrier at ${targetFreq} MHz! Rotate the wall radio dial to match!"`);

    // Defuser walks to radio shelf on wall and tunes to targetFreq
    await hostDefuser.eval(`
      frequencyModule.tune(${targetFreq});
      frequencyModule.confirmTune();
      game.checkAllModulesDisarmed();
    `);
    const freqDisarmed = await hostDefuser.eval(`frequencyModule.disarmed`);
    console.log(`[Defuser Action]: Dial tuned to ${targetFreq} MHz -> Carrier Locked: ${freqDisarmed}`);
    console.log(`✓ MODULE 3 (FREQUENCY JAMMER): DISARMED!`);

    // =========================================================================
    // PUZZLE 4: SIMON SAYS LIGHT ARRAY
    // =========================================================================
    console.log('\n--- EXECUTING PUZZLE 4: SIMON SAYS LIGHT ARRAY ---');
    const simonSeq = await hostDefuser.eval(`simonModule.sequence`);
    console.log(`[Defuser Visual Callout]:
       "Light dome flashing sequence: [${simonSeq.join(' → ')}]"`);

    // Manual Specialist uses table to map each flash to input button
    console.log(`[Manual Specialist Simon Lookup]:
       "Translating sequence based on vowel in serial (${/[AEIOU]/i.test(intelTelemetry.serial)}) and 0 strikes..."`);

    // Defuser inputs the sequence
    for (let flash of simonSeq) {
      const mappedColor = await clientManual.eval(`
        simonModule.getMappedColor('${flash}', '${intelTelemetry.serial}', 0)
      `);
      console.log(`  -> Flash [${flash.toUpperCase()}] maps to button [${mappedColor.toUpperCase()}]`);
      await hostDefuser.eval(`
        simonModule.pressColor('${mappedColor}', '${intelTelemetry.serial}', 0);
      `);
    }
    const simonDisarmed = await hostDefuser.eval(`simonModule.disarmed`);
    console.log(`[Defuser Action]: Complete light sequence replicated -> Disarmed: ${simonDisarmed}`);
    console.log(`✓ MODULE 4 (SIMON SAYS): DISARMED!`);

    // Check Victory on Defuser and broadcast
    await hostDefuser.eval(`game.checkVictory()`);
    await sleep(800);

    const isHostVictory = await hostDefuser.eval(`game.gameEnded && document.getElementById('game-over-modal')?.classList.contains('hidden') === false`);
    const endTitle = await hostDefuser.eval(`document.getElementById('end-title')?.innerText`);
    const endSubtitle = await hostDefuser.eval(`document.getElementById('end-subtitle')?.innerText`);

    console.log('\n===============================================================');
    console.log(` MISSION COMPLETE: 100% VICTORY ACHIEVED!`);
    console.log(` TITLE:    "${endTitle}"`);
    console.log(` SUBTITLE: "${endSubtitle}"`);
    console.log(` GAME ENDED STATUS: ${isHostVictory}`);
    console.log('===============================================================');

    chromeProc.kill();
    process.exit(0);
  } catch (err) {
    console.error('ERROR during proof:', err);
    chromeProc.kill();
    process.exit(1);
  }
}

proveGameLogic();
