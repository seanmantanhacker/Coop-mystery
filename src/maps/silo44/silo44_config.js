/* ==========================================================================
   OPERATION: ZERO HOUR - MAP 1: SILO 44 CONFIGURATION & REGISTRY
   Cold War Soviet Nuclear Bunker (1983)
   ========================================================================== */

window.ESCAPE_MAPS = window.ESCAPE_MAPS || {};

window.ESCAPE_MAPS['silo44'] = {
  id: 'silo44',
  name: 'SILO 44: THERMOBARIC INCIDENT',
  era: 'MAP 1 // COLD WAR 1983',
  baseTimer: 480, // 8 minutes base
  danger: 'High Danger',
  modulesCount: '4 Tech Puzzles',
  desc: 'Subterranean Soviet nuclear bunker. Iskra-7 warhead failsafe sequencer. Concrete blast vault reeking of motor oil and ozone.',
  
  getEnvClass() {
    return window.Silo44Environment;
  },

  getManualRenderer() {
    return window.Silo44ManualView;
  },

  getIntelRenderer() {
    return window.Silo44IntelView;
  },

  generateSpecs(seed, game) {
    game.timerSeconds = 480;
    if (window.wiresModule) window.wiresModule.generate(seed, game.serialNumber);
    if (window.keypadModule) window.keypadModule.generate(seed + 10, game.indicators.FRK);
    if (window.frequencyModule) {
      window.frequencyModule.generate(seed + 25, game.indicators.CAR);
      const radioReadout = document.getElementById('radio-inspect-freq');
      if (radioReadout) radioReadout.innerText = `${window.frequencyModule.currentFreq.toFixed(1)} MHz`;
      const intelReadout = document.getElementById('intel-dossier-current-freq');
      if (intelReadout) intelReadout.innerText = `${window.frequencyModule.currentFreq.toFixed(1)} MHz`;
    }
    if (window.simonModule) window.simonModule.generate(seed + 40);
  },

  checkVictory() {
    const wSolved = window.wiresModule ? window.wiresModule.disarmed : false;
    const kSolved = window.keypadModule ? window.keypadModule.disarmed : false;
    const fSolved = window.frequencyModule ? window.frequencyModule.disarmed : false;
    const sSolved = window.simonModule ? window.simonModule.disarmed : false;
    return (wSolved && kSolved && fSolved && sSolved);
  }
};
