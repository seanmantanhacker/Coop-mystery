/* ==========================================================================
   OPERATION: ZERO HOUR - MAP 4: LEVEL NULL (INCIDENT 1989)
   INTEL ANALYST: MAINFRAME SURVEILLANCE & "MURDER IDENTITY" TELEMETRY
   Real-Time Biometrics, Keycard Access Logs & SIGINT Wiretaps
   ========================================================================== */

class LevelNullIntelView {
  static currentRoom = 1;
  static drainPumpActive = false;

  static setCurrentRoom(roomNum) {
    LevelNullIntelView.currentRoom = roomNum;
    LevelNullIntelView.updateDossierData();
  }

  // --- Real-time Synchronization Actions ---

  static triggerStabilizerPulse() {
    if (typeof audio !== 'undefined' && audio.playSwitch) audio.playSwitch();

    if (window.room1BreakerModule) {
      window.room1BreakerModule.triggerStabilizerPulse(20);
    }

    if (window.game && window.game.network && window.game.network.broadcast) {
      window.game.network.broadcast({
        type: 'LEVELNULL_EM_STABILIZER_PULSE',
        duration: 20
      });
    }

    LevelNullIntelView.updateDossierData();
  }

  static toggleDrainPump() {
    LevelNullIntelView.drainPumpActive = !LevelNullIntelView.drainPumpActive;
    if (typeof audio !== 'undefined' && audio.playSwitch) {
      audio.playSwitch();
    }

    if (window.room2HydroModule) {
      window.room2HydroModule.setDrainPump(LevelNullIntelView.drainPumpActive);
    }

    if (window.game && window.game.network && window.game.network.broadcast) {
      window.game.network.broadcast({
        type: 'LEVELNULL_ROOM2_PUMP_SYNC',
        drainPumpActive: LevelNullIntelView.drainPumpActive
      });
    }

    LevelNullIntelView.updateDossierData();
  }

  static triggerPurgeBackpressure() {
    if (typeof audio !== 'undefined' && audio.playSwitch) audio.playSwitch();

    if (window.room2HydroModule) {
      window.room2HydroModule.purgeBackpressure();
    }

    if (window.game && window.game.network && window.game.network.broadcast) {
      window.game.network.broadcast({
        type: 'LEVELNULL_ROOM2_PURGE'
      });
    }

    LevelNullIntelView.updateDossierData();
  }

  static triggerRealityTetherPulse() {
    if (typeof audio !== 'undefined' && audio.playSwitch) audio.playSwitch();

    if (window.room3CoreModule) {
      window.room3CoreModule.triggerRealityTether(45);
    }

    if (window.game && window.game.network && window.game.network.broadcast) {
      window.game.network.broadcast({
        type: 'LEVELNULL_REALITY_TETHER_PULSE',
        duration: 45
      });
    }

    LevelNullIntelView.updateDossierData();
  }

  static updateDossierData() {
    const serialEl = document.getElementById('intel-dossier-serial');
    const battEl = document.getElementById('intel-dossier-batt');
    const indEl = document.getElementById('intel-dossier-ind');
    const tempItem = document.getElementById('intel-dossier-temp-item');
    const tempEl = document.getElementById('intel-dossier-temp');
    const serialLbl = document.getElementById('intel-dossier-serial-lbl');
    const battLbl = document.getElementById('intel-dossier-batt-lbl');
    const indLbl = document.getElementById('intel-dossier-ind-lbl');
    const tempLbl = document.getElementById('intel-dossier-temp-lbl');
    const targetFreqEl = document.getElementById('intel-dossier-target-freq');
    const currentFreqEl = document.getElementById('intel-dossier-current-freq');
    const centerTitle = document.getElementById('intel-center-title');
    const targetLbl = document.getElementById('intel-center-target-lbl');
    const currentLbl = document.getElementById('intel-center-current-lbl');
    const emergTitle = document.getElementById('intel-emergency-title');
    const emergWarning = document.getElementById('intel-emergency-warning');
    const guardLabel = document.getElementById('intel-guard-label');
    const previewStatus = document.getElementById('intel-switch-preview-status');

    // Titles and Headers
    if (centerTitle) centerTitle.innerText = 'MAINFRAME SURVEILLANCE & CASE TELEMETRY';
    if (targetLbl) targetLbl.innerText = 'VICTIM CARDIAC ARREST:';
    if (currentLbl) currentLbl.innerText = 'WIRETAP SURVEILLANCE:';
    if (emergTitle) emergTitle.innerText = 'TEMPORAL REALITY ANCHOR STABILIZER LEVER';
    if (emergWarning) emergWarning.innerText = '⚠️ ANOMALOUS OVERRIDE: Solve the cryptographic mathematical checksum to discharge the temporal reality anchor (+2:00 to Survival Clock, single use).';
    if (guardLabel) guardLabel.innerText = 'ENGAGE ANCHOR';
    if (previewStatus) previewStatus.innerText = '🚨 ANCHOR OVERRIDE';

    // Telemetry from Modules
    const forensics = window.levelNullForensicsModule;
    const timeline = window.levelNullTimelineModule;
    const interrogation = window.levelNullInterrogationModule;

    const victimReagent = forensics ? forensics.targetReagent : 'CYANIDE';
    const crimeSector = timeline && timeline.targetSector ? timeline.targetSector.name : 'SECTOR 1';
    const crimeTime = timeline ? timeline.targetTimestamp : '14:22';
    const wiretapFreq = interrogation && interrogation.targetChannel ? interrogation.targetChannel.freq : 122.4;

    if (serialLbl) serialLbl.innerText = 'CRIME CASE:';
    if (serialEl) serialEl.innerText = 'INCIDENT-89-Ω';

    if (battLbl) battLbl.innerText = 'SPECTRAL REAGENT:';
    if (battEl) battEl.innerText = victimReagent;

    if (indLbl) indLbl.innerText = 'FATAL BREACH:';
    if (indEl) indEl.innerText = `${crimeTime} HRS`;

    if (tempItem) tempItem.style.display = 'block';
    if (tempLbl) tempLbl.innerText = 'WIRETAP CARRIER:';
    if (tempEl) tempEl.innerText = `${wiretapFreq.toFixed(1)} MHz`;

    if (targetFreqEl) targetFreqEl.innerText = `${crimeTime} [${crimeSector}]`;
    if (currentFreqEl) currentFreqEl.innerText = `${wiretapFreq.toFixed(1)} MHz (COVERT SIGINT)`;

    // Render Live Keycard Mainframe Feed in the dynamic intel log section
    const dynamicContainer = document.getElementById('intel-dynamic-content');
    if (dynamicContainer) {
      const logs = timeline ? timeline.mainframeLogs : [];
      let logsHtml = '';
      logs.forEach(log => {
        const isAnomalous = log.auth.includes('OVERRIDE') || log.auth.includes('TAMPER');
        logsHtml += `
          <div style="font-family:'Share Tech Mono', monospace; font-size:0.75rem; color:${isAnomalous ? '#ff3344' : '#aaa'}; display:flex; justify-content:space-between; margin-bottom:3px; padding:2px 4px; background:${isAnomalous ? 'rgba(255,51,68,0.1)' : 'transparent'}; border-radius:3px;">
            <span>[${log.time}] ${log.card} ➔ ${log.sector}</span>
            <span>${log.suspect} (${log.auth})</span>
          </div>
        `;
      });

      dynamicContainer.innerHTML = `
        <div style="background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(0, 240, 255, 0.25); border-radius: 6px; padding: 10px; margin-top: 10px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid rgba(0,240,255,0.2); padding-bottom:4px;">
            <span style="font-family:'Share Tech Mono', monospace; font-size:0.8rem; color:#00f0ff; font-weight:bold;">📟 FACILITY KEYCARD MAINFRAME SWIPE LOGS:</span>
            <span style="font-size:0.7rem; color:#ffaa00;">CONFIDENTIAL // 1989</span>
          </div>
          <div style="max-height: 120px; overflow-y: auto;">
            ${logsHtml || '<span style="color:#666;">No telemetry logs currently loaded.</span>'}
          </div>
        </div>
      `;
    }
  }

  static getTelemetryText() {
    const forensics = window.levelNullForensicsModule;
    const timeline = window.levelNullTimelineModule;
    const interrogation = window.levelNullInterrogationModule;

    const r1 = window.room1BreakerModule;
    const r2 = window.room2HydroModule;
    const r3 = window.room3CoreModule;

    const reagent = forensics ? forensics.targetReagent : 'CYANIDE';
    const sector = timeline && timeline.targetSector ? timeline.targetSector.name : 'SECTOR 1';
    const time = timeline ? timeline.targetTimestamp : '14:22';
    const freq = interrogation && interrogation.targetChannel ? `${interrogation.targetChannel.freq.toFixed(1)} MHz` : '122.4 MHz';

    // Legacy fallback parameters for existing tests
    const legacyFreq = r1 ? `${r1.targetFreq.toFixed(1)} kHz` : '42.0 kHz';
    const va = r2 ? r2.targetValves[0] : 40;
    const vb = r2 ? r2.targetValves[1] : 60;
    const vc = r2 ? r2.targetValves[2] : 20;
    const lockPsi = r2 ? r2.hydraulicLockPsi : 80;
    const pump = LevelNullIntelView.drainPumpActive ? 'ONLINE' : 'OFFLINE';

    return `[LEVEL NULL INTEL] Crime Time: ${time} | Crime Sector: ${sector} | Reagent: ${reagent} | Wiretap Freq: ${freq} | Gate α Resonance: ${legacyFreq} | Gate β Valves: A:${va} PSI, B:${vb} PSI, C:${vc} PSI | Aux Pump: ${pump} | Hatch Seal: ${lockPsi} PSI`;
  }

  static renderOscilloscope(ctx, canvas, phase) {
    ctx.fillStyle = '#060f0c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Phosphor Grid
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 35) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 35) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    const interrogation = window.levelNullInterrogationModule;
    const targetFreq = interrogation && interrogation.targetChannel ? interrogation.targetChannel.freq : 108.0;

    // Carrier Wave
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    const midY = canvas.height / 2;

    for (let x = 0; x < canvas.width; x++) {
      const waveFreq = 0.03 + (targetFreq / 4000);
      const carrier = Math.sin(x * waveFreq + phase) * 35;
      const noise = (Math.random() - 0.5) * 4;
      const y = midY + carrier + noise;

      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Secondary Telemetry Sweep
    ctx.strokeStyle = 'rgba(255, 170, 0, 0.35)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x += 2) {
      const y = midY + Math.sin(x * 0.06 - phase * 1.5) * 20;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Top HUD
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.fillRect(8, 8, canvas.width - 16, 26);
    ctx.strokeStyle = '#00ff88';
    ctx.strokeRect(8, 8, canvas.width - 16, 26);

    ctx.font = '11px "Share Tech Mono", monospace';
    ctx.fillStyle = '#00ff88';
    ctx.fillText(`SIGINT WIRE-TAP MONITOR // TARGET CARRIER: ${targetFreq.toFixed(1)} MHz [SIGNAL ENCRYPTED]`, 16, 25);
  }
}

window.LevelNullIntelView = LevelNullIntelView;
