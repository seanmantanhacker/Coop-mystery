/* ==========================================================================
   OPERATION: ZERO HOUR - MAP 5: THE TRIAD PARADOX CONFIGURATION & REGISTRY
   Case 005: "The Ouroboros Convergence" (1979 - 1999 - 2019)
   Asymmetric 3-Era Investigation, Ripple Matrix & Temporal Causality
   ========================================================================== */

window.ESCAPE_MAPS = window.ESCAPE_MAPS || {};

window.ESCAPE_MAPS['triad'] = {
  id: 'triad',
  name: 'THE TRIAD PARADOX: THE OUROBOROS CONVERGENCE',
  era: 'MAP 5 // TEMPORAL ANOMALY 1979-2019',
  baseTimer: 1080, // 18:00 minutes (18 Chronal Units)
  danger: 'Class-Omega Paradox (LEVEL 5 MASTER)',
  modulesCount: '6 Ripple Tracks & 3-Era Investigation',
  desc: "Cross-era temporal murder mystery across 1979, 1999, and 2019. Manipulate the 6-track Ripple Matrix, investigate the sealed vault crime scene, and synthesize quantum archives before stability collapses.",

  getEnvClass() {
    return window.TriadEnvironment;
  },

  getManualRenderer() {
    return window.TriadManualView;
  },

  getIntelRenderer() {
    return window.TriadIntelView;
  },

  generateSpecs(seed, game) {
    game.timerSeconds = 1080; // 18 minutes base

    // Initialize or reset TriadStateManager
    if (window.TriadStateManager) {
      window.triadState = new window.TriadStateManager();
    }

    // Enable floating Ripple Matrix button across all 3 stations
    if (window.triadRippleUI) {
      window.triadRippleUI.showHUDButton(true);
      window.triadRippleUI.renderAll();
    }

    // Hook network listener for Triad events
    if (typeof network !== 'undefined' && network.onMessage) {
      network.onMessage((data) => {
        if (window.triadState) {
          window.triadState.handleNetworkEvent(data);
        }
      });
    }
  },

  checkVictory() {
    return window.triadState ? window.triadState.isVictory : false;
  }
};
