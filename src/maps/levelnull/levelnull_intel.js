/* ==========================================================================
   OPERATION: ZERO HOUR - MAP 4: LEVEL NULL (THE SHIFTING BACKROOMS)
   INTEL ANALYST: FACILITY BLUEPRINT RADAR & SENSOR ANOMALY CONSOLE
   Real-Time Cooperative Synchronization Dispatcher
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

    // Broadcast pump state to Defuser via network
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
    const inspectTargetEl = document.getElementById('inspect-target-readout');
    const targetLbl = document.getElementById('intel-center-target-lbl');
    const currentLbl = document.getElementById('intel-center-current-lbl');
    const captionEl = document.getElementById('intel-center-caption');
    const emergTitle = document.getElementById('intel-emergency-title');
    const emergWarning = document.getElementById('intel-emergency-warning');
    const guardLabel = document.getElementById('intel-guard-label');
    const previewStatus = document.getElementById('intel-switch-preview-status');
    const lockBadge = document.getElementById('intel-large-lock-badge');

    // Titles and Headers
    if (centerTitle) centerTitle.innerText = 'FACILITY BLUEPRINT RADAR & SENSOR TELEMETRY';
    if (targetLbl) targetLbl.innerText = 'GATE α PEAK HARMONIC:';
    if (currentLbl) currentLbl.innerText = 'GATE β AUX DRAIN PUMP:';
    if (emergTitle) emergTitle.innerText = 'TEMPORAL REALITY ANCHOR STABILIZER LEVER';
    if (emergWarning) emergWarning.innerText = '⚠️ ANOMALOUS OVERRIDE: Solve the cryptographic mathematical checksum to discharge the temporal reality anchor (+2:00 to Survival Clock, single use).';
    if (guardLabel) guardLabel.innerText = 'ENGAGE ANCHOR';
    if (previewStatus) previewStatus.innerText = '🚨 ANCHOR OVERRIDE';

    // Module telemetry references
    const r1 = window.room1BreakerModule;
    const r2 = window.room2HydroModule;
    const r3 = window.room3CoreModule;

    const targetFreq = r1 ? r1.targetFreq : 42.0;
    const va = r2 ? r2.targetValves[0] : 40;
    const vb = r2 ? r2.targetValves[1] : 60;
    const vc = r2 ? r2.targetValves[2] : 20;
    const lockPsi = r2 ? r2.hydraulicLockPsi : 80;
    const targetCode = r3 ? r3.targetCode : '7492';
    const rdi = r3 ? r3.getRealityDistortionIndex() : 100;
    const pumpActive = LevelNullIntelView.drainPumpActive;

    const roomNames = {
      1: 'CHAMBER 1 (LIMINAL OFFICE)',
      2: 'CHAMBER 2 (HYDRO-SUBSTATION)',
      3: 'CHAMBER 3 (QUANTUM CORE)'
    };
    const currentRoomName = roomNames[LevelNullIntelView.currentRoom] || 'CHAMBER 1 (LIMINAL OFFICE)';

    // Update Dossier Left Cards
    if (serialLbl) serialLbl.innerText = 'FACILITY SECTOR ARCHIVE:';
    if (serialEl) serialEl.innerText = 'LEVEL-NULL // SECTOR 1989';

    if (battLbl) battLbl.innerText = 'DEFUSER CHAMBER RADAR:';
    if (battEl) battEl.innerText = currentRoomName;

    if (indLbl) indLbl.innerText = 'REALITY DISTORTION INDEX (RDI):';
    if (indEl) {
      indEl.innerText = `${rdi}% (${rdi === 0 ? 'HARMONIC STABLE ✓' : 'CRITICAL FLUX'})`;
      indEl.className = (rdi === 0) ? 'glow-green' : 'glow-yellow';
    }

    if (tempItem) tempItem.style.display = 'block';
    if (tempLbl) tempLbl.innerText = 'GATE β TARGET PRESSURES:';
    if (tempEl) {
      tempEl.innerText = `VALVE A: ${va} PSI | B: ${vb} PSI | C: ${vc} PSI (SEAL: ${lockPsi} PSI)`;
      tempEl.className = (lockPsi <= 15) ? 'glow-green' : 'glow-cyan';
    }

    // Target Frequency & Readouts
    const freqDisplay = `${targetFreq.toFixed(1)} kHz`;
    if (targetFreqEl) targetFreqEl.innerText = `${freqDisplay} (GATE α)`;
    if (inspectTargetEl) inspectTargetEl.innerText = freqDisplay;

    const pumpStatusText = pumpActive ? `ONLINE (${lockPsi} PSI PURGE)` : 'OFFLINE (CLOSED)';
    if (currentFreqEl) {
      currentFreqEl.innerText = pumpStatusText;
      currentFreqEl.className = (pumpActive && lockPsi <= 15) ? 'glow-green' : (pumpActive ? 'glow-yellow' : 'glow-red');
    }

    if (lockBadge) {
      const g1Solved = r1 ? r1.disarmed : false;
      lockBadge.className = g1Solved ? 'badge badge-success' : 'badge badge-warning';
      lockBadge.innerText = g1Solved ? 'GATE α UNLATCHED ✓' : (r1 && r1.stabilizerActive ? `LOCK BEAM: ${r1.stabilizerTimeRemaining}s` : 'GATE α LOCKED');
    }

    // Interactive Real-Time Synchronization Control Matrix
    if (captionEl) {
      const emActive = r1 && r1.stabilizerActive;
      const emTime = r1 ? r1.stabilizerTimeRemaining : 0;
      const tetherActive = r3 && r3.tetherActive;
      const tetherTime = r3 ? r3.tetherTimeRemaining : 0;
      const isRdiZero = (rdi === 0);

      captionEl.innerHTML = `
        <div class="levelnull-intel-panel" style="background: rgba(0,0,0,0.45); border: 1px solid rgba(0, 240, 255, 0.25); border-radius: 6px; padding: 10px; margin-top: 6px; font-family: 'Share Tech Mono', monospace;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 0.85rem; border-bottom: 1px solid rgba(0, 240, 255, 0.2); padding-bottom: 4px;">
            <span style="color:#00f0ff;">📍 TRACKER: <strong>${currentRoomName}</strong></span>
            <span style="color:#c084fc;">GATE Ω ANCHOR: <strong style="letter-spacing: 2px; color:${isRdiZero ? '#00ff88' : '#888'};">[ ${isRdiZero ? targetCode : 'LOCKED (RDI>0%)'} ]</strong></span>
          </div>

          <!-- Section 1: Gate α EM Stabilizer Sync -->
          <div style="margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px dashed rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px;">
            <div>
              <span style="color:#f5d76e; font-size:0.8rem; font-weight:bold;">GATE α HARMONIC SYNC:</span>
              <span style="font-size:0.75rem; color:#aaa; margin-left:6px;">Target: <strong>${freqDisplay}</strong> (±3 kHz)</span>
            </div>
            <button class="btn btn-ctrl ${emActive ? 'active glow-green' : ''}" style="padding: 4px 12px; font-size: 0.8rem;" onclick="LevelNullIntelView.triggerStabilizerPulse()">
              ⚡ [EM RESONANCE LOCK BEAM: ${emActive ? `${emTime}s ACTIVE ✓` : 'ENGAGE PULSE (20s)'}]
            </button>
          </div>

          <!-- Section 2: Gate β Hydrostatic Drainage Sync -->
          <div style="margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px dashed rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px;">
            <div>
              <span style="color:#00f0ff; font-size:0.8rem; font-weight:bold;">GATE β HYDRAULIC PURGE:</span>
              <span style="font-size:0.75rem; color:#aaa; margin-left:6px;">Hatch Seal: <strong style="color:${lockPsi <= 15 ? '#00ff88' : '#ff99aa'}">${lockPsi} PSI</strong> (Safe: ≤15)</span>
            </div>
            <div style="display:flex; gap:6px;">
              <button class="btn btn-ctrl ${pumpActive ? 'active glow-green' : ''}" style="padding: 4px 10px; font-size: 0.8rem;" onclick="LevelNullIntelView.toggleDrainPump()">
                ⚓ [DRAIN PUMP: ${pumpActive ? 'ONLINE' : 'OFFLINE'}]
              </button>
              <button class="btn btn-ctrl" style="padding: 4px 10px; font-size: 0.8rem;" onclick="LevelNullIntelView.triggerPurgeBackpressure()">
                🌊 [PURGE -25 PSI]
              </button>
            </div>
          </div>

          <!-- Section 3: Gate Ω Reality Tether Sync -->
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px;">
            <div>
              <span style="color:#c084fc; font-size:0.8rem; font-weight:bold;">GATE Ω QUANTUM TETHER:</span>
              <span style="font-size:0.75rem; color:#aaa; margin-left:6px;">RDI: <strong style="color:${isRdiZero ? '#00ff88' : '#ff3344'}">${rdi}%</strong></span>
            </div>
            <button class="btn btn-ctrl ${tetherActive ? 'active glow-green' : (isRdiZero ? 'glow-yellow' : '')}" ${!isRdiZero && !tetherActive ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''} style="padding: 4px 12px; font-size: 0.8rem;" onclick="LevelNullIntelView.triggerRealityTetherPulse()">
              🌀 [REALITY TETHER: ${tetherActive ? `${tetherTime}s ENGAGED ✓` : (isRdiZero ? 'DISCHARGE TETHER (45s)' : 'PRISMS UNALIGNED')}]
            </button>
          </div>
        </div>
      `;
    }
  }

  static getTelemetryText() {
    const r1 = window.room1BreakerModule;
    const r2 = window.room2HydroModule;
    const r3 = window.room3CoreModule;

    const freq = r1 ? `${r1.targetFreq.toFixed(1)} kHz` : '42.0 kHz';
    const va = r2 ? r2.targetValves[0] : 40;
    const vb = r2 ? r2.targetValves[1] : 60;
    const vc = r2 ? r2.targetValves[2] : 20;
    const lockPsi = r2 ? r2.hydraulicLockPsi : 80;
    const code = r3 ? r3.targetCode : '7492';
    const rdi = r3 ? r3.getRealityDistortionIndex() : 100;
    const pump = LevelNullIntelView.drainPumpActive ? 'ONLINE' : 'OFFLINE';

    return `[LEVEL NULL EXPERT INTEL] Gate α Harmonic: ${freq} | Gate β Valves: A:${va} PSI, B:${vb} PSI, C:${vc} PSI | Hatch Seal: ${lockPsi} PSI (Pump: ${pump}) | Gate Ω Anchor Code: ${code} | Live RDI: ${rdi}%`;
  }

  static renderOscilloscope(ctx, canvas, phase) {
    ctx.fillStyle = '#060f0c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid: Liminal Green Phosphor CRT
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

    const r1 = window.room1BreakerModule;
    const r3 = window.room3CoreModule;
    const freq = r1 ? r1.targetFreq : 42.0;
    const rdi = r3 ? r3.getRealityDistortionIndex() : 100;
    const isStable = (rdi === 0);

    // 1. Dual Harmonic Carrier Wave
    ctx.strokeStyle = isStable ? '#00ff88' : '#f5d76e';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    const midY = canvas.height / 2;

    for (let x = 0; x < canvas.width; x++) {
      const waveFreq = 0.02 + (freq / 3000);
      const carrier = Math.sin(x * waveFreq + phase) * 40;
      const distortion = (rdi / 100) * (Math.sin(x * 0.12 - phase * 2) * 20 + Math.cos(x * 0.04 + phase) * 15);
      const y = midY + carrier + distortion;

      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 2. Secondary High-Frequency Echo (Quantum leakage)
    ctx.strokeStyle = 'rgba(192, 132, 252, 0.35)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x += 2) {
      const y = midY + Math.sin(x * 0.08 - phase * 1.5) * 25 * (rdi / 100);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 3. Top HUD Banner
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.fillRect(8, 8, canvas.width - 16, 26);
    ctx.strokeStyle = isStable ? '#00ff88' : '#00f0ff';
    ctx.strokeRect(8, 8, canvas.width - 16, 26);

    ctx.font = '11px "Share Tech Mono", monospace';
    ctx.fillStyle = isStable ? '#00ff88' : '#00f0ff';
    const roomName = (LevelNullIntelView.currentRoom === 1) ? 'SEC 1: OFFICE' : (LevelNullIntelView.currentRoom === 2 ? 'SEC 2: HYDRO' : 'SEC 3: CORE');
    ctx.fillText(`ANOMALY SCAN // ${roomName} | PEAK: ${freq.toFixed(1)} kHz | RDI: ${rdi}% [${isStable ? 'STABLE' : 'DISTORTION'}]`, 16, 25);
  }
}

window.LevelNullIntelView = LevelNullIntelView;
