/* ==========================================================================
   OPERATION: ZERO HOUR - MAP 2: THE ALCHEMIST'S STUDY CONFIGURATION & REGISTRY
   Victorian Gothic Occult Clockwork Manor (1888)
   ========================================================================== */

window.ESCAPE_MAPS = window.ESCAPE_MAPS || {};

window.ESCAPE_MAPS['alchemist'] = {
  id: 'alchemist',
  name: "THE ALCHEMIST'S STUDY",
  era: 'MAP 2 // VICTORIAN GOTHIC 1888',
  baseTimer: 360, // 6 minutes base
  danger: 'Master Difficulty',
  modulesCount: '4 Occult Puzzles',
  desc: "Lord Blackwood's locked manor library. Ticking Athanor Horologium, quicksilver vials, and flesh-dissolving phosgene gas.",
  
  getEnvClass() {
    return window.AlchemistStudyEnvironment;
  },

  getManualRenderer() {
    return window.AlchemistManualView;
  },

  getIntelRenderer() {
    return window.AlchemistIntelView;
  },

  generateSpecs(seed, game) {
    game.timerSeconds = 360;

    const purityGrade = (Math.abs(seed + 7) % 2 === 0) ? 'GRADE_A' : 'GRADE_B';

    if (window.zodiacModule) window.zodiacModule.generate(seed);
    if (window.mercuryModule) window.mercuryModule.generate(seed + 15, purityGrade);
    const zodiacTargetElem = window.zodiacModule ? window.zodiacModule.targetElement : null;
    if (window.prismModule) window.prismModule.generate(seed + 30, zodiacTargetElem);
    if (window.escapementModule) window.escapementModule.generate(seed + 45);

    game.alchemistIntelData = {
      purityGrade,
      governorCam: window.escapementModule ? window.escapementModule.governorCam : 1
    };
  },

  checkVictory() {
    const zSolved = window.zodiacModule ? window.zodiacModule.solved : false;
    const mSolved = window.mercuryModule ? window.mercuryModule.solved : false;
    const pSolved = window.prismModule ? window.prismModule.solved : false;
    const eSolved = window.escapementModule ? window.escapementModule.solved : false;
    return (zSolved && mSolved && pSolved && eSolved);
  }
};
