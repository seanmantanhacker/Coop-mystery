/* ==========================================================================
   OPERATION: ZERO HOUR - INTEL ANALYST: SURVEILLANCE & TELEMETRY STATION
   Supports Scenario 1: SIGINT Electronic Warfare Command Center
   Supports Scenario 2: Victorian Carriage-House Steam Works & Telegraph
   ========================================================================== */

class IntelViewEngine {
  constructor() {
    this.scenario = 'silo44';
    this.currentView = 'CONSOLE_OVERVIEW';
    this.flipGuardOpen = false;
    this.toggleActivated = false;
    this.oscilloscopeAnimId = null;

    // Keyboard shortcut: Escape returns to Console Overview
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (this.currentView !== 'CONSOLE_OVERVIEW') {
          this.setView('CONSOLE_OVERVIEW');
        }
      }
    });
  }

  init(scenario = 'silo44') {
    this.scenario = scenario;
    this.setView('CONSOLE_OVERVIEW');
    this.updateDossierData();
    this.startOscilloscope();
    this.startWireframeSchematic();
  }

  setScenario(scenario) {
    this.scenario = scenario;
    this.updateDossierData();
  }

  setView(viewMode) {
    this.currentView = viewMode;
    if (window.audio) window.audio.playZoom();

    const overview = document.getElementById('intel-console-overview');
    const inspectCenter = document.getElementById('intel-inspect-center');
    const inspectDossier = document.getElementById('intel-inspect-dossier');
    const inspectEmergency = document.getElementById('intel-inspect-emergency');
    const backBtn = document.getElementById('intel-back-btn');

    [overview, inspectCenter, inspectDossier, inspectEmergency].forEach(el => {
      if (el) el.classList.add('hidden');
    });

    if (viewMode === 'CONSOLE_OVERVIEW') {
      if (overview) overview.classList.remove('hidden');
      if (backBtn) backBtn.classList.add('hidden');
    } else if (viewMode === 'INSPECT_CENTER') {
      if (inspectCenter) {
        inspectCenter.classList.remove('hidden');
        const osc = document.getElementById('intel-large-oscilloscope');
        if (osc && osc.parentElement) {
          const availWidth = Math.max(280, Math.min(700, osc.parentElement.clientWidth - 32));
          osc.width = availWidth;
        }
      }
      if (backBtn) backBtn.classList.remove('hidden');
    } else if (viewMode === 'INSPECT_DOSSIER') {
      if (inspectDossier) inspectDossier.classList.remove('hidden');
      if (backBtn) backBtn.classList.remove('hidden');
    } else if (viewMode === 'INSPECT_EMERGENCY') {
      if (inspectEmergency) inspectEmergency.classList.remove('hidden');
      if (backBtn) backBtn.classList.remove('hidden');
    }
  }

  toggleFlipGuard() {
    this.flipGuardOpen = !this.flipGuardOpen;
    if (window.audio) window.audio.playFlipGuard();

    const guard = document.getElementById('missile-flip-guard');
    if (guard) {
      guard.classList.toggle('flipped-open', this.flipGuardOpen);
    }
  }

  activateEmergencyToggle() {
    if (!this.flipGuardOpen && this.scenario === 'silo44') {
      alert('SAFETY LOCK ENGAGED: Flip open the red safety cover first!');
      return;
    }
    if (this.toggleActivated || (window.game && window.game.overrideUsed)) return;

    this.toggleActivated = true;
    if (window.audio) window.audio.playToggleSwitch();

    const toggle = document.getElementById('missile-toggle-lever');
    if (toggle) toggle.classList.add('activated');

    if (window.game) window.game.triggerEmergencyOverride();
  }

  updateDossierData() {
    const serialEl = document.getElementById('intel-dossier-serial');
    const battEl = document.getElementById('intel-dossier-batt');
    const indEl = document.getElementById('intel-dossier-ind');
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

    if (this.scenario === 'silo44') {
      if (centerTitle) centerTitle.innerText = 'TACTICAL CARRIER FREQUENCY OSCILLOSCOPE';
      if (targetLbl) targetLbl.innerText = 'TARGET CARRIER:';
      if (currentLbl) currentLbl.innerText = 'DEFUSER CURRENT:';
      if (captionEl) captionEl.innerText = 'Guide Operative 1 (Defuser) to rotate their radio dial until the sine wave locks onto the carrier grid!';
      if (emergTitle) emergTitle.innerText = 'EMERGENCY COOLANT STABILIZER CONSOLE';
      if (emergWarning) emergWarning.innerText = '⚠️ PROTOCOL: Flip open the safety guard cover, then throw the heavy toggle switch to inject coolant (+30s to Detonation Clock).';
      if (guardLabel) guardLabel.innerText = 'LIFT GUARD';

      if (serialEl) serialEl.innerText = window.game ? window.game.serialNumber : 'A7-93K';
      if (battEl) battEl.innerText = window.game ? `${window.game.batteries} CELLS` : '2 CELLS';
      if (indEl && window.game) {
        indEl.innerText = `FRK: ${window.game.indicators.FRK ? 'ACTIVE' : 'INACTIVE'} | CAR: ${window.game.indicators.CAR ? 'ACTIVE' : 'INACTIVE'}`;
      }
      const freq = window.frequencyModule ? `${window.frequencyModule.targetFreq} MHz` : '142.5 MHz';
      if (targetFreqEl) targetFreqEl.innerText = freq;
      if (inspectTargetEl) inspectTargetEl.innerText = freq;
      if (currentFreqEl && window.frequencyModule) currentFreqEl.innerText = `${window.frequencyModule.currentFreq} MHz`;
    } else {
      if (centerTitle) centerTitle.innerText = 'CELESTIAL EPHEMERIS & SPECTROPHOTOMETER';
      if (targetLbl) targetLbl.innerText = 'TARGET SPECTRAL ABSORPTION:';
      if (currentLbl) currentLbl.innerText = 'REFRACTED BEAM WAVELENGTH:';
      if (captionEl) captionEl.innerText = 'Guide Operative 1 (Defuser) to rotate optical crystal prisms and select color filters to match the target celestial spectrum!';
      if (emergTitle) emergTitle.innerText = 'VALVE OF HERMES: PHOSGENE NEUTRALIZER';
      if (emergWarning) emergWarning.innerText = '⚠️ HERMETIC PROTOCOL: Break open the brass wax seal, then release the counterweight lever to inject quicksilver neutralizer (+30s to Countdown).';
      if (guardLabel) guardLabel.innerText = 'BREAK SEAL';

      if (serialEl) serialEl.innerText = 'OPUS III: SCORPIO ♏';
      if (battEl) battEl.innerText = 'RETROGRADE (WEST BUBBLE)';
      if (indEl) indEl.innerText = 'LUNAR STATE: PERIGEE ☽';
      const wave = window.prismModule ? `${window.prismModule.targetWavelength} nm (SOLAR D-LINE)` : '589 nm (SODIUM D-LINE)';
      if (targetFreqEl) targetFreqEl.innerText = wave;
      if (inspectTargetEl) inspectTargetEl.innerText = wave;
      if (currentFreqEl && window.prismModule) currentFreqEl.innerText = `${window.prismModule.currentWavelength} nm`;
    }
  }

  startOscilloscope() {
    const canvas = document.getElementById('intel-large-oscilloscope');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let phase = 0;

    const render = () => {
      ctx.fillStyle = '#03080c';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // CRT phosphor grid lines
      ctx.strokeStyle = 'rgba(0, 255, 128, 0.12)';
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

      const isSilo = (this.scenario === 'silo44');
      const targetVal = isSilo 
        ? (window.frequencyModule ? window.frequencyModule.targetFreq : 142.5) 
        : (window.prismModule ? window.prismModule.targetWavelength / 4 : 147.25);
      const currentVal = isSilo
        ? (window.frequencyModule ? window.frequencyModule.currentFreq : 100.0)
        : (window.prismModule ? window.prismModule.currentWavelength / 4 : 102.5);

      const isLocked = Math.abs(currentVal - targetVal) < 2.0;

      // 1. Target Carrier Wave (Yellow Reference)
      ctx.strokeStyle = isLocked ? '#00ff88' : '#ffcc00';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + Math.sin(x * 0.04 + phase * 0.5) * 45;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 2. Defuser Input Wave (Cyan/Green Signal)
      ctx.strokeStyle = isLocked ? '#00ffcc' : '#00aaff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      const freqFactor = (currentVal / targetVal) * 0.04;
      for (let x = 0; x < canvas.width; x++) {
        const jitter = isLocked ? 0 : (Math.random() - 0.5) * 6;
        const y = canvas.height / 2 + Math.sin(x * freqFactor + phase) * (isLocked ? 45 : 35) + jitter;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Status text on CRT
      ctx.fillStyle = isLocked ? '#00ff88' : '#ffaa00';
      ctx.font = '14px Courier New';
      ctx.fillText(isLocked ? '● PHASE LOCK ACQUIRED' : '○ SEEKING CARRIER...', 20, 30);

      phase += 0.08;
      this.oscilloscopeAnimId = requestAnimationFrame(render);
    };

    if (this.oscilloscopeAnimId) cancelAnimationFrame(this.oscilloscopeAnimId);
    render();
  }

  startWireframeSchematic() {
    const canvas = document.getElementById('intel-wireframe-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let angle = 0;

    const render = () => {
      ctx.fillStyle = '#060c12';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(angle);

      // Rotating wireframe isometric cube / octagonal study
      ctx.strokeStyle = (this.scenario === 'silo44') ? '#00e5ff' : '#d4af37';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-45, -35, 90, 70);

      ctx.beginPath();
      ctx.arc(0, 0, 25, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
      angle += 0.015;
      requestAnimationFrame(render);
    };
    render();
  }
}

const intelView = new IntelViewEngine();
window.intelView = intelView;
