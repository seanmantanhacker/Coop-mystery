/* ==========================================================================
   THE TRIAD PARADOX: CASE 005 - TEST SUITE
   Validates: AP economy, Causality Ripple Matrix, Paradox Detection,
              Forensic Sweeps, Keyword Synthesis & Final Accusation Victory
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
    querySelector: () => ({ innerText: '' }),
    querySelectorAll: () => [],
    style: {},
    innerText: '',
    innerHTML: '',
    value: '',
    disabled: false
  }),
  body: {
    appendChild: () => {}
  }
};

global.audio = {
  playSwitch: () => {},
  playDisarmed: () => {},
  playStrike: () => {},
  playClick: () => {},
  playStep: () => {},
  playPageTurn: () => {},
  playTemporalRipple: () => {},
  playParadoxAlarm: () => {},
  playSynthesisSuccess: () => {},
  playSuccess: () => {},
  playBuzz: () => {}
};

global.game = {
  scenario: 'triad',
  role: 'defuser',
  strikes: 0,
  timerSeconds: 1080,
  showToast: (msg) => console.log(`  [Toast] ${msg.replace(/<[^>]+>/g, '')}`),
  triggerVictory: () => console.log('  [Game] VICTORY TRIGGERED!'),
  triggerExplosion: (r) => console.log(`  [Game] TIMELINE COLLAPSE: ${r}`)
};

global.network = {
  broadcast: () => {},
  onMessage: () => {}
};

// Load Triad Map modules
require('../src/maps/triad/modules/triad_cards_db.js');
require('../src/maps/triad/modules/triad_state.js');
require('../src/maps/triad/modules/triad_ripple_matrix.js');
require('../src/maps/triad/triad_config.js');

console.log('=== RUNNING THE TRIAD PARADOX (CASE 005) TEST SUITE ===\n');

// TEST 1: Database Integrity
console.log('1. Testing Card Database Integrity...');
const db = window.TRIAD_CARDS_DB;
assert(db, 'TRIAD_CARDS_DB must exist');
assert(db.deck1979.length > 10, '1979 deck must have cards');
assert(db.deck1999.length > 10, '1999 deck must have cards');
assert(db.deck2019.length > 5, '2019 deck must have cards');
assert.strictEqual(db.forensic1999.length, 5, 'Forensic deck must have 5 cards');
assert.strictEqual(db.revelations2019.length, 5, 'Revelation deck must have 5 cards');
console.log('  ✓ Card decks verified with correct counts and keywords.');

// TEST 2: ESCAPE_MAPS registration
console.log('\n2. Testing Map Registration...');
const map = window.ESCAPE_MAPS['triad'];
assert(map, "window.ESCAPE_MAPS['triad'] must be registered");
assert.strictEqual(map.id, 'triad');
assert.strictEqual(map.baseTimer, 1080);
console.log('  ✓ Map 5 registered in ESCAPE_MAPS successfully.');

// TEST 3: State Initialization & Action Point Economy
console.log('\n3. Testing State Manager & AP Economy...');
const state = new window.TriadStateManager();
window.triadState = state;
assert.strictEqual(state.chronalStability, 18, 'Initial Chronal Stability must be 18');
assert.strictEqual(state.ap['1979'], 3, '1979 must start with 3 AP');
assert.strictEqual(state.ap['1999'], 3, '1999 must start with 3 AP');
assert.strictEqual(state.ap['2019'], 3, '2019 must start with 3 AP');
assert.strictEqual(state.meepleNodes['1979'], 5, '1979 starts in Security Hub (Node 5)');

// Spend 1 AP
state.spendAP('1979', 1);
assert.strictEqual(state.ap['1979'], 2);
console.log('  ✓ AP tracking and stability initialization verified.');

// TEST 4: Meeple Movement across Nodes
console.log('\n4. Testing Meeple Movement...');
state.ap['1979'] = 3;
const moveRes = state.moveMeeple('1979', 1); // Move to Node 1 (Laboratory)
assert(moveRes, 'Move to Node 1 must succeed');
assert.strictEqual(state.meepleNodes['1979'], 1);
assert.strictEqual(state.ap['1979'], 2);
console.log('  ✓ Meeple movement consumes 1 AP and updates node location.');

// TEST 5: 1979 Plant Item & 1999 Secure Evidence
console.log('\n5. Testing 1979 Plant Item & 1999 Secure Evidence...');
// Give 1979 the Cryo-Canister
const canister = { id: '79-item-01', title: 'Lead-Lined Cryo-Canister', canPlant: true, type: 'ITEM' };
state.hands['1979'] = [canister];
state.ap['1979'] = 2;
const plantRes = state.plantItem('79-item-01', 4); // Plant in Node 4 (Courtyard)
assert(plantRes, 'Planting item must succeed');
assert(state.plantedItems[4], 'Item must be planted in Node 4');

// Cistern is initially FLOODED: 1999 cannot retrieve yet!
state.meepleNodes['1999'] = 4;
state.ap['1999'] = 2;
const secureFail = state.securePlantedEvidence(4);
assert.strictEqual(secureFail, false, 'Cannot retrieve while cistern is flooded');

// 1979 drains the cistern via Temporal Ripple!
state.ap['1979'] = 2;
state.temporalRipple('courtyardCistern', 'DRAINED');
assert.strictEqual(state.rippleTracks.courtyardCistern.state, 'DRAINED');

// Now 1999 can secure evidence!
const secureOk = state.securePlantedEvidence(4);
assert(secureOk, 'Evidence can be retrieved once cistern is drained');
assert(state.hands['1999'].some(c => c.id === '79-item-01'));
console.log('  ✓ Causality chain verified: Plant Item -> Flooded Block -> Drain Cistern -> Secure Evidence.');

// TEST 6: Forensic Sweep in 1999 Vault
console.log('\n6. Testing 1999 Forensic Sweep...');
state.ap['1999'] = 3;
state.meepleNodes['1999'] = 3; // Vault
const sweepOk = state.forensicSweep();
assert(sweepOk, 'Forensic Sweep must succeed in Vault');
assert.strictEqual(state.ap['1999'], 1); // 2 AP spent
assert(state.hands['1999'].some(c => c.type === 'FORENSIC'));
console.log('  ✓ Forensic Sweep in crime scene chamber successful.');

// TEST 7: Paradox Detection System
console.log('\n7. Testing Paradox Detection...');
const initialStab = state.chronalStability;
// 1999 analyzes Clue #99-01 (Security log: tapes burned by EMP)
const empClue = { id: '99-clue-01', title: 'Security Log: 23:40 Blackout', keywords: ['EMP-BLAST'] };
state.hands['1999'] = [empClue];
state.ap['1999'] = 1;
state.analyzeCard('1999', '99-clue-01');
assert(state.publicIntel.some(c => c.id === '99-clue-01'));

// 1979 attempts to Faraday-Shield the tapes, contradicting established public fact!
state.ap['1979'] = 3;
const rippleRes = state.temporalRipple('securityArchive', 'FARADAY_SHIELDED');
assert.strictEqual(rippleRes, false, 'Action must be blocked due to paradox');
assert.strictEqual(state.chronalStability, initialStab - 3, 'Stability must drop by 3 on paradox');
console.log(`  ✓ Paradox detected! Action canceled and Chronal Stability reduced by 3 (from ${initialStab} to ${state.chronalStability}).`);

// TEST 8: 2019 Quantum Keyword Synthesis
console.log('\n8. Testing 2019 Quantum Keyword Synthesis...');
// Add 1979 patent and 1999 clue sharing RESONANCE-432HZ to public intel
state.publicIntel.push({
  id: '79-clue-01',
  title: 'Confidential Patent: Project Ouroboros',
  keywords: ['RESONANCE-432HZ', 'DISPLACEMENT-CORE']
});
state.publicIntel.push({
  id: '99-clue-01-synth',
  title: 'EMP Residue Frequency',
  keywords: ['RESONANCE-432HZ']
});

state.ap['2019'] = 3;
const synthOk = state.synthesizeIntel('79-clue-01', '99-clue-01-synth');
assert(synthOk, 'Synthesis must succeed when keywords match');
assert.strictEqual(state.ap['2019'], 1); // 2 AP spent
assert.strictEqual(state.revelations.length, 1);
assert.strictEqual(state.revelations[0].id, 'REV-01');
console.log(`  ✓ Synthesis unlocked: "${state.revelations[0].title}"`);

// TEST 9: Consensus Step & Final Accusation Victory
console.log('\n9. Testing Consensus Step & Final Accusation...');
state.setVerdict('culprit', 'Valerie Cross');
state.setVerdict('weapon', 'Dual-Harmonic Tachyon Emitter');
state.setVerdict('motive', 'Patent Theft & Temporal Assassination');

const victory = state.submitFinalAccusation();
assert.strictEqual(victory, true, 'Correct accusation must result in VICTORY');
assert.strictEqual(state.isVictory, true);
assert.strictEqual(map.checkVictory(), true);
console.log('  ✓ Case 005 solved! All tests passed successfully.');

console.log('\n=== ALL TRIAD PARADOX SYSTEM TESTS PASSED ===');
