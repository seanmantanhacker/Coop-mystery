/* ==========================================================================
   LEVEL NULL: TEST SUITE FOR "MURDER IDENTITY" (UNIVERSITY WAR ADAPTATION)
   Tests mathematical determinism, logic elimination, and victory condition
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
    value: '',
    disabled: false
  })
};

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
require('../src/maps/levelnull/modules/forensics.js');
require('../src/maps/levelnull/modules/timeline.js');
require('../src/maps/levelnull/modules/interrogation.js');
require('../src/maps/levelnull/modules/indictment.js');
require('../src/maps/levelnull/levelnull_config.js');

console.log('=== RUNNING LEVEL NULL "MURDER IDENTITY" TEST SUITE ===');

const testSeeds = [1989, 2026, 42, 777, 9001];

testSeeds.forEach((seed, sIdx) => {
  console.log(`\n--- [SEED TEST ${sIdx + 1}/${testSeeds.length}: SEED ${seed}] ---`);
  game.strikes = 0;

  const m1 = window.levelNullForensicsModule;
  const m2 = window.levelNullTimelineModule;
  const m3 = window.levelNullInterrogationModule;
  const m4 = window.levelNullIndictmentModule;

  // 1. Generate Mission
  window.ESCAPE_MAPS['levelnull'].generateSpecs(seed, game);

  assert.strictEqual(m1.disarmed, false, 'Module 1 should start armed');
  assert.strictEqual(m2.disarmed, false, 'Module 2 should start armed');
  assert.strictEqual(m3.disarmed, false, 'Module 3 should start armed');
  assert.strictEqual(m4.disarmed, false, 'Module 4 should start armed');

  // Check initial premature disarm strikes
  const initStrikes = game.strikes;
  m1.selectedWeaponIndex = (m1.WEAPONS.findIndex(w => w.id === m1.targetWeapon.id) + 1) % m1.WEAPONS.length;
  m1.confirmForensicAnalysis();
  assert.strictEqual(game.strikes, initStrikes + 1, 'Wrong forensic confirmation should strike');

  // 2. Solve Module 1 (Forensics)
  m1.selectedWeaponIndex = m1.WEAPONS.findIndex(w => w.id === m1.targetWeapon.id);
  m1.selectedReagentIndex = m1.reagents.indexOf(m1.targetReagent);
  const m1Res = m1.confirmForensicAnalysis();
  assert.strictEqual(m1Res.status, 'DISARMED');
  assert.strictEqual(m1.disarmed, true, 'Module 1 must be disarmed');
  console.log(`✓ Module 1 (Forensics) Solved: Weapon = ${m1.targetWeapon.name}`);

  // 3. Solve Module 2 (Timeline)
  m2.selectedSectorIdx = m2.SECTORS.findIndex(s => s.id === m2.targetSector.id);
  const [targetH, targetM] = m2.targetTimestamp.split(':').map(Number);
  m2.selectedHour = targetH;
  m2.selectedMinute = targetM;
  const m2Res = m2.confirmTimeline();
  assert.strictEqual(m2Res.status, 'DISARMED');
  assert.strictEqual(m2.disarmed, true, 'Module 2 must be disarmed');
  console.log(`✓ Module 2 (Timeline) Solved: Sector = ${m2.targetSector.name} @ ${m2.targetTimestamp}`);

  // 4. Solve Module 3 (Interrogation / Wiretap)
  m3.currentFreq = m3.targetChannel.freq;
  const m3Res = m3.confirmWiretapLock();
  assert.strictEqual(m3Res.status, 'DISARMED');
  assert.strictEqual(m3.disarmed, true, 'Module 3 must be disarmed');
  console.log(`✓ Module 3 (Interrogation) Solved: Freq = ${m3.targetChannel.freq} MHz, Cipher = ${m3.cipherKey}`);

  // 5. Test Module 4 (Indictment) False Accusation Strike
  const strikeBeforeIndict = game.strikes;
  m4.selectedCulpritIdx = (m4.SUSPECTS.findIndex(s => s.id === m4.targetCulprit.id) + 1) % m4.SUSPECTS.length;
  m4.selectedWeaponIdx = m1.selectedWeaponIndex;
  m4.selectedSectorIdx = m2.selectedSectorIdx;
  m4.enteredCipher = m3.cipherKey;
  const falseRes = m4.submitGrandIndictment();
  assert.strictEqual(falseRes.status, 'STRIKE', 'False culprit accusation must trigger strike');
  assert.strictEqual(game.strikes, strikeBeforeIndict + 1);

  // 6. Solve Module 4 (Grand Indictment)
  m4.selectedCulpritIdx = m4.SUSPECTS.findIndex(s => s.id === m4.targetCulprit.id);
  m4.selectedWeaponIdx = m1.WEAPONS.findIndex(w => w.id === m1.targetWeapon.id);
  m4.selectedSectorIdx = m2.SECTORS.findIndex(s => s.id === m2.targetSector.id);
  m4.enteredCipher = m3.cipherKey;
  const m4Res = m4.submitGrandIndictment();
  assert.strictEqual(m4Res.status, 'DISARMED');
  assert.strictEqual(m4.disarmed, true, 'Module 4 must be disarmed');
  console.log(`✓ Module 4 (Grand Indictment) Solved: Culprit = ${m4.targetCulprit.name} (${m4.targetCulprit.photoId})`);

  // 7. Verify Overall Victory
  const victory = window.ESCAPE_MAPS['levelnull'].checkVictory();
  assert.strictEqual(victory, true, 'All 4 modules disarmed must trigger Level Null victory');
  console.log(`✓ Seed ${seed} End-to-End Victory Confirmed!`);
});

console.log('\n======================================================');
console.log('AGENT A VERIFICATION COMPLETE: ALL 5 SEEDS SOLVED 100%');
console.log('======================================================\n');
