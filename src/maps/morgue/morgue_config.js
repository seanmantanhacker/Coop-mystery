/* ==========================================================================
   OPERATION: ZERO HOUR - MAP 3: THE LOCKED MORGUE CONFIGURATION & REGISTRY
   Subterranean Clinical Autopsy Theater & Crime Scene Investigation (1994)
   ========================================================================== */

window.ESCAPE_MAPS = window.ESCAPE_MAPS || {};

window.ESCAPE_MAPS['morgue'] = {
  id: 'morgue',
  name: 'THE LOCKED MORGUE',
  era: 'MAP 3 // CLINICAL FORENSICS 1994',
  baseTimer: 900, // 15:00 minutes countdown
  danger: 'Expert Difficulty',
  modulesCount: '4 Forensic Puzzles',
  desc: 'Ward 9 sub-basement autopsy theater. Deceased pathologist, pressurized neurotoxin release, and sealed magnetic airlock.',

  getEnvClass() {
    return window.MorgueEnvironment;
  },

  getManualRenderer() {
    return window.MorgueManualView;
  },

  getIntelRenderer() {
    return window.MorgueIntelView;
  },

  generateSpecs(seed, game) {
    game.timerSeconds = 900; // Strictly 15 minutes

    // 1. Module 1: Toxicology Assay
    if (window.toxicologyModule) {
      window.toxicologyModule.generate(seed);
    }

    // 2. Module 2: Forensic Autopsy & Calipers
    let vitalCount = 2;
    let killerTier = 2;
    if (window.autopsyModule) {
      window.autopsyModule.generate(seed + 15);
      vitalCount = window.autopsyModule.wounds.filter(w => w.vital).length;
      killerTier = window.autopsyModule.correctKiller?.tier || 2;
    }

    // 3. Module 3: Security Keypad (uses victim birth year, vital wounds count, killer tier)
    if (window.morgueKeypadModule) {
      window.morgueKeypadModule.generate(seed + 30, vitalCount, killerTier);
    }

    // 4. Module 4: Life Support & Ventilation
    if (window.lifeSupportModule) {
      window.lifeSupportModule.generate(seed + 45);
    }
  },

  checkVictory() {
    const tSolved = window.toxicologyModule ? (window.toxicologyModule.solved || window.toxicologyModule.disarmed) : false;
    const aSolved = window.autopsyModule ? (window.autopsyModule.solved || window.autopsyModule.disarmed) : false;
    const kSolved = window.morgueKeypadModule ? (window.morgueKeypadModule.solved || window.morgueKeypadModule.disarmed) : false;
    const lSolved = window.lifeSupportModule ? (window.lifeSupportModule.solved || window.lifeSupportModule.disarmed) : false;

    return (tSolved && aSolved && kSolved && lSolved);
  }
};
