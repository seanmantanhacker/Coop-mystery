/* ==========================================================================
   OPERATION: ZERO HOUR - MAP 3: THE LOCKED MORGUE INTEL ANALYST VIEW
   Central Police Records, Forensic Spectrometry & Facility Dispatcher Station
   ========================================================================== */

class MorgueIntelView {
  static updateDossierData() {
    const serialEl = document.getElementById('intel-dossier-serial');
    const battEl = document.getElementById('intel-dossier-batt');
    const indEl = document.getElementById('intel-dossier-ind');
    const tempItem = document.getElementById('intel-dossier-temp-item');
    const tempEl = document.getElementById('intel-dossier-temp');
    const serialLbl = document.getElementById('intel-dossier-serial-lbl');
    const battLbl = document.getElementById('intel-dossier-batt-lbl');
    const indLbl = document.getElementById('intel-dossier-ind-lbl');
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

    if (centerTitle) centerTitle.innerText = 'BIOCHEMICAL MASS SPECTROMETER & REMOTE DISPATCH';
    if (targetLbl) targetLbl.innerText = 'CHAMBER GAS SATURATION:';
    if (currentLbl) currentLbl.innerText = 'VENTILATION STATUS:';
    if (captionEl) {
      captionEl.innerHTML = `
        <div class="morgue-dispatch-actions">
          <span>Use remote facility controls below to purge gas and unlock ceiling damper:</span>
          <div class="dispatch-buttons-row" style="margin-top: 8px; display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="btn btn-ctrl btn-morgue-action" onclick="MorgueIntelView.executeVentFlush()">💨 [TRIGGER: VENT_FLUSH]</button>
            <button class="btn btn-ctrl btn-morgue-action" onclick="MorgueIntelView.executePowerReset()">⚡ [TRIGGER: POWER_RESET]</button>
          </div>
        </div>
      `;
    }
    if (emergTitle) emergTitle.innerText = 'EMERGENCY ATROPINE INJECTION LEVER';
    if (emergWarning) emergWarning.innerText = '⚠️ CRITICAL OVERRIDE: Solve the cryptographic mathematical checksum to unlock the pneumatic antidote injector (+2:00 to Survival Clock, single use).';
    if (guardLabel) guardLabel.innerText = 'PULL INJECTOR';

    // Retrieve Victim Data from Modules
    const tox = window.toxicologyModule;
    const keypad = window.morgueKeypadModule;
    const life = window.lifeSupportModule;
    const autopsy = window.autopsyModule;

    const culprit = autopsy ? (autopsy.correctKiller || autopsy.suspects[autopsy.activeSuspectKey]) : null;
    const killerTier = culprit ? culprit.tier : (keypad ? keypad.killerTier : 4);
    const killerName = culprit ? culprit.name : 'DR. ARTHUR ALLEN';

    const birthYear = keypad ? keypad.victimBirthYear : 1958;
    const bodyMass = (tox && typeof tox.victimMass === 'number') ? `${tox.victimMass.toFixed(1)} kg` : '74.5 kg';
    const gasPpm = life ? `${life.gasPpm} PPM` : '320 PPM';
    const classification = life && life.classification ? life.classification.name : 'CLASS B: RADIOLOGICAL PATHOGEN';

    let ventStatus = 'NORMAL INTAKE';
    if (life) {
      if (life.isVentFlushed) {
        ventStatus = `EXHAUST FLUSH ACTIVE (${life.flushTimeRemaining}s) (DAMPER UNLOCKED)`;
      } else if (!life.powerActive) {
        ventStatus = 'GRID OFFLINE (VENT BLOWER STOPPED)';
      } else if (life.isDamperLocked) {
        ventStatus = 'DAMPER SEALED';
      }
    }

    const powerBadge = life ? (life.powerActive ? '<span class="badge badge-success">⚡ ONLINE (120V)</span>' : '<span class="badge badge-error" style="animation: pulse 1s infinite;">⚡ BREAKER TRIPPED</span>') : '<span class="badge badge-error">⚡ OFFLINE</span>';
    const damperBadge = life ? (life.isVentFlushed ? `<span class="badge badge-success">💨 PURGE OPEN (${life.flushTimeRemaining}s)</span>` : '<span class="badge badge-warning">💨 DAMPER LOCKED</span>') : '';

    if (captionEl) {
      captionEl.innerHTML = `
        <div class="morgue-dispatch-actions">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 0.85rem; border-bottom: 1px solid rgba(92, 225, 230, 0.2); padding-bottom: 4px;">
            <span>GRID: ${powerBadge}</span>
            <span>EXHAUST: ${damperBadge}</span>
          </div>
          <span>Use remote facility controls below to manage emergency systems:</span>
          <div class="dispatch-buttons-row" style="margin-top: 8px; display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="btn btn-ctrl btn-morgue-action ${life && life.isVentFlushed ? 'active glow-green' : ''}" onclick="MorgueIntelView.executeVentFlush()">💨 [TRIGGER: VENT_FLUSH]</button>
            <button class="btn btn-ctrl btn-morgue-action ${life && !life.powerActive ? 'btn-danger-pulse glow-red' : ''}" onclick="MorgueIntelView.executePowerReset()">⚡ [TRIGGER: POWER_RESET]</button>
          </div>
        </div>
      `;
    }

    if (serialLbl) serialLbl.innerText = 'VICTIM BIRTH YEAR:';
    if (battLbl) battLbl.innerText = 'VICTIM BODY MASS:';
    if (indLbl) indLbl.innerText = 'CRIME SCENE CLASSIFICATION:';
    if (tempItem) tempItem.style.display = 'block';

    if (serialEl) serialEl.innerText = `${birthYear} (DR. H. VANCE)`;
    if (battEl) battEl.innerText = `${bodyMass} (ANTHROPOMETRIC)`;
    if (indEl) {
      indEl.innerText = classification;
      indEl.className = 'glow-yellow';
    }
    if (tempEl) tempEl.innerText = `${gasPpm} (NEUROTOXIN SATURATION)`;

    if (targetFreqEl) targetFreqEl.innerText = gasPpm;
    if (inspectTargetEl) inspectTargetEl.innerText = gasPpm;
    if (currentFreqEl) currentFreqEl.innerText = ventStatus;
  }

  static executeVentFlush() {
    if (window.lifeSupportModule) {
      window.lifeSupportModule.remoteTriggerVentFlush();
    }
    if (window.network && window.network.broadcast) {
      window.network.broadcast({ type: 'MORGUE_REMOTE_TRIGGER', action: 'VENT_FLUSH' });
    }
    MorgueIntelView.updateDossierData();
  }

  static executePowerReset() {
    if (window.lifeSupportModule) {
      window.lifeSupportModule.remoteTriggerPowerReset();
    }
    if (window.network && window.network.broadcast) {
      window.network.broadcast({ type: 'MORGUE_REMOTE_TRIGGER', action: 'POWER_RESET' });
    }
    MorgueIntelView.updateDossierData();
  }

  static getTelemetryText() {
    const tox = window.toxicologyModule;
    const keypad = window.morgueKeypadModule;
    const life = window.lifeSupportModule;
    const autopsy = window.autopsyModule;
    const culprit = autopsy ? (autopsy.correctKiller || autopsy.suspects[autopsy.activeSuspectKey]) : null;
    const killerTier = culprit ? culprit.tier : (keypad ? keypad.killerTier : 4);
    const killerName = culprit ? culprit.name : 'Dr. Arthur Allen';

    const mass = tox ? `${tox.victimMass.toFixed(1)} kg` : '74.5 kg';
    const year = keypad ? keypad.victimBirthYear : 1958;
    const gas = life ? `${life.gasPpm} PPM` : '320 PPM';
    const classification = life && life.classification ? life.classification.name : 'CLASS B: RADIOLOGICAL PATHOGEN';
    return `[MORGUE INTEL] Victim: Dr. H. Vance | Birth Year: ${year} | Mass: ${mass} | Classification: ${classification} | Ward 9 Access Log 23:44: Tier ${killerTier} (${killerName}) | Chamber Gas: ${gas}`;
  }

  static renderOscilloscope(ctx, canvas, phase) {
    ctx.fillStyle = '#060f14';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clinical Cyan Spectrometry Grid
    ctx.strokeStyle = 'rgba(92, 225, 230, 0.12)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    const life = window.lifeSupportModule;
    const ppm = life ? life.gasPpm : 320;
    const isCritical = ppm >= 800;

    // 1. Base Mass Spectrometry Noise Baseline
    ctx.strokeStyle = isCritical ? '#ff1744' : '#5ce1e6';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x++) {
      const noise = (Math.sin(x * 0.08 + phase) * 6) + (Math.cos(x * 0.22 - phase) * 4);
      let y = canvas.height - 35 + noise;

      // Draw spectral mass peaks for active toxins
      if (Math.abs(x - 90) < 14) {
        y -= Math.cos((x - 90) / 14 * (Math.PI / 2)) * 65; // HCN Peak (m/z 27)
      } else if (Math.abs(x - 210) < 18) {
        y -= Math.cos((x - 210) / 18 * (Math.PI / 2)) * 95; // Organophosphate Peak (m/z 140)
      } else if (Math.abs(x - 340) < 15) {
        y -= Math.cos((x - 340) / 15 * (Math.PI / 2)) * 75; // Arsenic / Cyanide complex
      }

      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 2. Gas Concentration Warning Threshold Line
    const threshY = canvas.height - 35 - ((ppm / 1200) * (canvas.height - 60));
    ctx.strokeStyle = isCritical ? 'rgba(255, 23, 68, 0.7)' : 'rgba(255, 214, 0, 0.4)';
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(0, threshY);
    ctx.lineTo(canvas.width, threshY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Real-Time Concentration Banner
    ctx.fillStyle = isCritical ? 'rgba(255, 23, 68, 0.2)' : 'rgba(92, 225, 230, 0.15)';
    ctx.fillRect(10, 10, 310, 26);
    ctx.strokeStyle = isCritical ? '#ff1744' : '#5ce1e6';
    ctx.strokeRect(10, 10, 310, 26);
    ctx.font = '12px "Courier New", monospace';
    ctx.fillStyle = isCritical ? '#ff1744' : '#5ce1e6';
    ctx.fillText(`☣ TOXIN: ${ppm} PPM | STATUS: ${isCritical ? 'LETHAL BREACH' : 'CONTAINED'}`, 18, 27);
  }
}

window.MorgueIntelView = MorgueIntelView;
