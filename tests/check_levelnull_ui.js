/* ==========================================================================
   LEVEL NULL: TEST SUITE FOR DOOR-TO-DOOR CHAMBER TRAVERSAL & MODULES
   ========================================================================== */

const assert = require('assert');

// Mock browser DOM & audio
global.window = global;
global.document = {
  getElementById: (id) => ({
    classList: {
      add: () => {},
      remove: () => {},
      toggle: () => {},
      contains: () => false
    },
    querySelector: () => null,
    querySelectorAll: () => [],
    style: {},
    innerText: '',
    innerHTML: '',
    value: ''
  })
};
global.alert = () => {};
global.audio = {
  playSwitch: () => {},
  playDisarmed: () => {},
  playStrike: () => {},
  playKeypadBeep: () => {}
};
global.game = {
  scenario: 'levelnull',
  strikes: 0,
  addStrike: function() { this.strikes++; },
  checkVictory: function() {},
  network: {
    broadcast: () => {}
  }
};

// Load modules
require('../src/maps/levelnull/modules/room1_breaker.js');
require('../src/maps/levelnull/modules/room2_hydro.js');
require('../src/maps/levelnull/modules/room3_core.js');
require('../src/maps/levelnull/levelnull_config.js');
require('../src/maps/levelnull/levelnull_manual.js');
require('../src/maps/levelnull/levelnull_intel.js');

console.log('=== RUNNING LEVEL NULL TEST SUITE ===');

// Mock LevelNullEnvironment for door animations
window.levelNullEnv = {
  door1Open: false,
  door2Open: false,
  portalOpen: false,
  currentRoom: 1,
  openDoor1() { this.door1Open = true; },
  openDoor2() { this.door2Open = true; },
  openPortal() { this.portalOpen = true; },
  transitionToRoom(n) { this.currentRoom = n; },
  updatePrismMesh() {}
};

// 1. TEST ROOM 1: BREAKER & FIRE DOOR
console.log('\n[1] Testing Room 1: Breaker & Fire Door Lock...');
const m1 = window.room1BreakerModule;
m1.generate(1989);

assert.strictEqual(m1.disarmed, false, 'Module 1 should start locked');
// Attempt fire bar with initial state -> Strike
const initialStrikes = game.strikes;
m1.triggerFireBar();
assert.strictEqual(game.strikes, initialStrikes + 1, 'Premature fire bar should cause strike');
assert.strictEqual(m1.disarmed, false, 'Should remain locked');

// Configure correct breakers
m1.targetBreakers.forEach((targetState, idx) => {
  if (m1.breakerStates[idx] !== targetState) {
    m1.toggleBreaker(idx);
  }
});
// Set target frequency
m1.setFrequency(m1.targetFreq);
window.LevelNullIntelView.triggerStabilizerPulse();
m1.triggerFireBar();

assert.strictEqual(m1.disarmed, true, 'Module 1 should be disarmed');
assert.strictEqual(window.levelNullEnv.door1Open, true, 'Door 1 3D animation should be opened');
console.log('✓ Room 1 Breakers and Fire Door Disarm PASSED');

// Transition to Room 2
window.levelNullEnv.transitionToRoom(2);
assert.strictEqual(window.levelNullEnv.currentRoom, 2, 'Should be in Room 2');
console.log('✓ Traversal into Sector 2 PASSED');

// 2. TEST ROOM 2: HYDROSTATIC SUBMARINE HATCH
console.log('\n[2] Testing Room 2: Hydrostatic Valves & Submarine Vault Hatch...');
const m2 = window.room2HydroModule;
m2.generate(1989);

assert.strictEqual(m2.disarmed, false, 'Module 2 should start locked');
m2.turnSubmarineWheel();
assert.strictEqual(m2.disarmed, false, 'Wheel should not turn without equilibrium & pump');

// Set valves to targets
m2.valves = [...m2.targetValves];
// Turn on remote pump and purge seal pressure
m2.setDrainPump(true);
m2.hydraulicLockPsi = 10;
m2.turnSubmarineWheel();

assert.strictEqual(m2.disarmed, true, 'Module 2 should be disarmed');
assert.strictEqual(window.levelNullEnv.door2Open, true, 'Door 2 3D animation should be opened');
console.log('✓ Room 2 Hydro Valves and Sub Hatch Disarm PASSED');

// Transition to Room 3
window.levelNullEnv.transitionToRoom(3);
assert.strictEqual(window.levelNullEnv.currentRoom, 3, 'Should be in Room 3');
console.log('✓ Traversal into Sector 3 PASSED');

// 3. TEST ROOM 3: QUANTUM PRISMS & REALITY ANCHOR
console.log('\n[3] Testing Room 3: Quantum Prisms & Reality Anchor Portal...');
const m3 = window.room3CoreModule;
m3.generate(1989);

assert.strictEqual(m3.disarmed, false, 'Module 3 should start locked');
// Align all 3 prisms to target angles
for (let i = 0; i < 3; i++) {
  while (m3.prismAngles[i] !== m3.targetPrismAngles[i]) {
    m3.rotatePrism(i);
  }
}
assert.strictEqual(m3.getRealityDistortionIndex(), 0, 'RDI must be 0% when prisms match targets');

// Key in target stabilization code
m3.clearKeypad();
for (const char of m3.targetCode) {
  m3.appendKeypad(char);
}
assert.strictEqual(m3.currentCode, m3.targetCode, 'Keypad code must match target');

// Trigger reality tether pulse
window.LevelNullIntelView.triggerRealityTetherPulse();
m3.commitAnchorStabilization();
assert.strictEqual(m3.disarmed, true, 'Module 3 should be disarmed');
assert.strictEqual(window.levelNullEnv.portalOpen, true, 'Reality Portal should be open for escape');
console.log('✓ Room 3 Quantum Prisms & Portal Anchor PASSED');

// 4. TEST ESCAPE MAPS REGISTRY & VICTORY CONDITION
console.log('\n[4] Testing Map Registry & Victory Check...');
const mapConfig = window.ESCAPE_MAPS['levelnull'];
assert.ok(mapConfig, 'Level Null should be registered in ESCAPE_MAPS');
assert.strictEqual(mapConfig.id, 'levelnull');
assert.strictEqual(mapConfig.checkVictory(), true, 'Victory check should pass when all 3 rooms are cleared');
console.log('✓ Map 4 Level Null Victory Condition PASSED');

// 5. TEST REVISED MANUAL VIEW RENDER
console.log('\n[5] Testing Revised Manual View Clearance Gates & Binder...');
assert.strictEqual(window.LevelNullManualView.totalPages, 4);

const tabMock = { innerHTML: '' };
window.LevelNullManualView.renderTabs(tabMock);
assert.ok(tabMock.innerHTML.includes('I. FIRE DOOR (GATE α)'), 'Tabs must include Gate Alpha');
assert.ok(tabMock.innerHTML.includes('II. SUB HATCH (GATE β)'), 'Tabs must include Gate Beta');
assert.ok(tabMock.innerHTML.includes('III. REALITY RIFT (GATE Ω)'), 'Tabs must include Gate Omega');
assert.ok(tabMock.innerHTML.includes('IV. ANOMALY LOGS'), 'Tabs must include Anomaly Logs');

const pageMock = { innerHTML: '' };
window.LevelNullManualView.renderPage(0, pageMock);
assert.ok(pageMock.innerHTML.includes('CLEARANCE GATE α'), 'Page 0 should render Gate Alpha');
window.LevelNullManualView.renderPage(1, pageMock);
assert.ok(pageMock.innerHTML.includes('CLEARANCE GATE β'), 'Page 1 should render Gate Beta');
window.LevelNullManualView.renderPage(2, pageMock);
assert.ok(pageMock.innerHTML.includes('CLEARANCE GATE Ω'), 'Page 2 should render Gate Omega');
window.LevelNullManualView.renderPage(3, pageMock);
assert.ok(pageMock.innerHTML.includes('INCIDENT 1989-Ω'), 'Page 3 should render Incident Logs');

const boardMock = { innerHTML: '' };
window.LevelNullManualView.renderBoard(boardMock);
assert.ok(boardMock.innerHTML.includes('SECTOR 1 FIRE DOOR'), 'Board must show Sector 1 photo');
assert.ok(boardMock.innerHTML.includes('SUB VAULT HATCH'), 'Board must show Sector 2 photo');
assert.ok(boardMock.innerHTML.includes('QUANTUM CORE RIFT'), 'Board must show Sector 3 photo');
console.log('✓ Manual View Dossier & Corkboard PASSED');

// 6. TEST INTEL VIEW DOSSIER & REMOTE DISPATCH
console.log('\n[6] Testing Intel View Dossier & Remote Dispatch...');
window.LevelNullIntelView.updateDossierData();
const telText = window.LevelNullIntelView.getTelemetryText();
assert.ok(telText.includes('[LEVEL NULL INTEL]'), 'Telemetry text must identify Level Null');
assert.ok(telText.includes('Gate α Resonance'), 'Telemetry must have Gate Alpha frequency');
assert.ok(telText.includes('Gate β Valves'), 'Telemetry must have Gate Beta valves');
assert.ok(telText.includes('Aux Pump'), 'Telemetry must have Aux Pump state');

assert.strictEqual(window.LevelNullIntelView.drainPumpActive, false);
window.LevelNullIntelView.toggleDrainPump();
assert.strictEqual(window.LevelNullIntelView.drainPumpActive, true);
assert.strictEqual(window.room2HydroModule.drainPumpActive, true);
console.log('✓ Intel View Dossier & Remote Pump PASSED');

console.log('\n==========================================');
console.log('ALL LEVEL NULL TESTS COMPLETED SUCCESSFULLY!');
console.log('==========================================\n');
