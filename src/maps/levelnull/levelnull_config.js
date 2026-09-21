/* ==========================================================================
   OPERATION: ZERO HOUR - MAP 4: LEVEL NULL CONFIGURATION & REGISTRY
   Liminal Non-Euclidean Traversal, Submerged Hydrostation & Quantum Core
   ========================================================================== */

window.ESCAPE_MAPS = window.ESCAPE_MAPS || {};

window.ESCAPE_MAPS['levelnull'] = {
  id: 'levelnull',
  name: 'LEVEL NULL: THE SHIFTING BACKROOMS',
  era: 'MAP 4 // ANOMALOUS SECTOR 1989',
  baseTimer: 1200, // 20:00 minutes expert survival countdown
  danger: 'Class-5 Liminal Anomaly (EXPERT MODE)',
  modulesCount: '3 Sequential Chambers & Blast Doors',
  desc: 'Subterranean non-Euclidean test site (1989). 20-minute expert countdown. Fluorescent liminal office, flooded hydro-substation, and dimensional quantum resonance core.',

  getEnvClass() {
    return window.LevelNullEnvironment;
  },

  getManualRenderer() {
    return window.LevelNullManualView;
  },

  getIntelRenderer() {
    return window.LevelNullIntelView;
  },

  generateSpecs(seed, game) {
    game.timerSeconds = 1200; // 20 minutes expert timer

    // 1. Chamber 1: Liminal Breaker & Magnetic Fire Door
    if (window.room1BreakerModule) {
      window.room1BreakerModule.generate(seed);
    }

    // 2. Chamber 2: Hydrostatic Substation & Submarine Vault Hatch
    if (window.room2HydroModule) {
      window.room2HydroModule.generate(seed + 15);
    }

    // 3. Chamber 3: Quantum Resonance Prisms & Reality Anchor Portal
    if (window.room3CoreModule) {
      window.room3CoreModule.generate(seed + 30);
    }
  },

  checkVictory() {
    const r1 = window.room1BreakerModule ? (window.room1BreakerModule.solved || window.room1BreakerModule.disarmed) : false;
    const r2 = window.room2HydroModule ? (window.room2HydroModule.solved || window.room2HydroModule.disarmed) : false;
    const r3 = window.room3CoreModule ? (window.room3CoreModule.solved || window.room3CoreModule.disarmed) : false;
    return r1 && r2 && r3;
  }
};
