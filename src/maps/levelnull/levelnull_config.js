/* ==========================================================================
   OPERATION: ZERO HOUR - MAP 4: LEVEL NULL CONFIGURATION & REGISTRY
   Incident 1989: The 8 Suspects & University War "Murder Identity"
   Liminal Traversal, Forensic Pathology, Spatiotemporal Logs & Grand Indictment
   ========================================================================== */

window.ESCAPE_MAPS = window.ESCAPE_MAPS || {};

window.ESCAPE_MAPS['levelnull'] = {
  id: 'levelnull',
  name: 'LEVEL NULL: INCIDENT 1989 (MURDER IDENTITY)',
  era: 'MAP 4 // ANOMALOUS SECTOR 1989',
  baseTimer: 1200, // 20:00 minutes expert survival countdown
  danger: 'Class-5 Liminal Sabotage (UNIVERSITY WAR DEDUCTION)',
  modulesCount: '4 Investigation Modules & 8-Photo Indictment',
  desc: 'Subterranean non-Euclidean test site (1989). Dr. Aris was murdered during facility lockdown. Cross-reference forensic autopsy, spatiotemporal keycard telemetry, and alibi wiretaps to indict the 1 true killer among 8 suspects before dimensional collapse.',

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

    // 1. Module 1: Forensic Pathology & Weapon Analyzer
    if (window.levelNullForensicsModule) {
      window.levelNullForensicsModule.generate(seed);
    }

    // 2. Module 2: Keycard Telemetry & Timeline Mainframe
    if (window.levelNullTimelineModule) {
      window.levelNullTimelineModule.generate(seed + 15);
    }

    // 3. Module 3: Interrogation & Wiretap Decryption
    if (window.levelNullInterrogationModule) {
      window.levelNullInterrogationModule.generate(seed + 30);
    }

    // 4. Module 4: 8-Photo Investigation Board & Grand Indictment Terminal
    if (window.levelNullIndictmentModule) {
      window.levelNullIndictmentModule.generate(seed);
    }

    // Backward compatibility for physical room modules if loaded
    if (window.room1BreakerModule) {
      window.room1BreakerModule.generate(seed);
    }
    if (window.room2HydroModule) {
      window.room2HydroModule.generate(seed + 15);
    }
    if (window.room3CoreModule) {
      window.room3CoreModule.generate(seed + 30);
    }
  },

  checkVictory() {
    if (window.levelNullIndictmentModule) {
      const fDisarmed = window.levelNullForensicsModule ? window.levelNullForensicsModule.disarmed : true;
      const tDisarmed = window.levelNullTimelineModule ? window.levelNullTimelineModule.disarmed : true;
      const iDisarmed = window.levelNullInterrogationModule ? window.levelNullInterrogationModule.disarmed : true;
      const indDisarmed = window.levelNullIndictmentModule.disarmed;

      if (fDisarmed && tDisarmed && iDisarmed && indDisarmed) {
        return true;
      }
    }

    // Legacy fallback check
    const r1 = window.room1BreakerModule ? (window.room1BreakerModule.solved || window.room1BreakerModule.disarmed) : false;
    const r2 = window.room2HydroModule ? (window.room2HydroModule.solved || window.room2HydroModule.disarmed) : false;
    const r3 = window.room3CoreModule ? (window.room3CoreModule.solved || window.room3CoreModule.disarmed) : false;
    return r1 && r2 && r3;
  }
};
