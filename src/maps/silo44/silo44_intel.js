/* ==========================================================================
   OPERATION: ZERO HOUR - MAP 1: SILO 44 INTEL ANALYST VIEW
   Cold War SIGINT Electronic Warfare Command Center
   ========================================================================== */

class Silo44IntelView {
  static updateDossierData() {
    const serialEl = document.getElementById('intel-dossier-serial');
    const battEl = document.getElementById('intel-dossier-batt');
    const indEl = document.getElementById('intel-dossier-ind');
    const tempItem = document.getElementById('intel-dossier-temp-item');
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

    if (centerTitle) centerTitle.innerText = 'TACTICAL CARRIER FREQUENCY OSCILLOSCOPE';
    if (targetLbl) targetLbl.innerText = 'TARGET CARRIER:';
    if (currentLbl) currentLbl.innerText = 'DEFUSER CURRENT:';
    if (captionEl) captionEl.innerText = 'Guide Operative 1 (Defuser) to rotate their radio dial until the sine wave locks onto the carrier grid!';
    if (emergTitle) emergTitle.innerText = 'EMERGENCY COOLANT STABILIZER CONSOLE';
    if (emergWarning) emergWarning.innerText = '⚠️ PROTOCOL: Solve the cryptographic mathematical equation below to unlock the coolant valve (+2:00 to Detonation Clock, single use).';
    if (guardLabel) guardLabel.innerText = 'LIFT GUARD';

    if (serialLbl) serialLbl.innerText = 'SERIAL NUMBER:';
    if (battLbl) battLbl.innerText = 'BATTERY COMPARTMENTS:';
    if (indLbl) indLbl.innerText = 'INDICATOR RELAYS:';
    if (tempItem) tempItem.style.display = 'none';

    if (serialEl) serialEl.innerText = window.game ? window.game.serialNumber : 'A7-93K';
    if (battEl) battEl.innerText = window.game ? `${window.game.batteries} CELLS` : '2 CELLS';
    if (indEl && window.game) {
      indEl.innerText = `FRK: ${window.game.indicators.FRK ? 'ACTIVE' : 'INACTIVE'} | CAR: ${window.game.indicators.CAR ? 'ACTIVE' : 'INACTIVE'}`;
    }
    const freq = window.frequencyModule ? `${window.frequencyModule.targetFreq} MHz` : '142.5 MHz';
    if (targetFreqEl) targetFreqEl.innerText = freq;
    if (inspectTargetEl) inspectTargetEl.innerText = freq;
    if (currentFreqEl && window.frequencyModule) currentFreqEl.innerText = `${window.frequencyModule.currentFreq} MHz`;
  }

  static getTelemetryText() {
    const serial = window.game ? window.game.serialNumber : 'A7-93K';
    const batt = window.game ? `${window.game.batteries} CELLS` : '2 CELLS';
    const frk = window.game?.indicators?.FRK ? 'ON' : 'OFF';
    const car = window.game?.indicators?.CAR ? 'ON' : 'OFF';
    const target = window.frequencyModule ? `${window.frequencyModule.targetFreq} MHz` : '142.5 MHz';
    return `[INTEL TELEMETRY] Serial: ${serial} | Batteries: ${batt} | Indicators: FRK=${frk}, CAR=${car} | Target Freq: ${target}`;
  }

  static renderOscilloscope(ctx, canvas, phase) {
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

    const targetVal = window.frequencyModule ? window.frequencyModule.targetFreq : 142.5;
    const currentVal = window.frequencyModule ? window.frequencyModule.currentFreq : 100.0;
    const isLocked = Math.abs(currentVal - targetVal) < 2.0;

    // 1. Target Carrier Wave (Yellow Reference)
    ctx.strokeStyle = isLocked ? '#00ff88' : '#ffcc00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x++) {
      const f = targetVal / 18.0;
      const y = (canvas.height / 2) + Math.sin((x * f * 0.05) + phase) * 38;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 2. Incoming Defuser Tuning Signal (Cyan Active Beam)
    ctx.strokeStyle = isLocked ? '#00ffcc' : 'rgba(0, 240, 255, 0.8)';
    ctx.lineWidth = isLocked ? 3 : 2;
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x++) {
      const f = currentVal / 18.0;
      const y = (canvas.height / 2) + Math.sin((x * f * 0.05) + (phase * 1.3)) * 38;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Target Lock HUD Banner
    if (isLocked) {
      ctx.fillStyle = 'rgba(0, 255, 136, 0.18)';
      ctx.fillRect(10, 10, 230, 26);
      ctx.strokeStyle = '#00ff88';
      ctx.strokeRect(10, 10, 230, 26);
      ctx.font = '12px "Rajdhani", sans-serif';
      ctx.fillStyle = '#00ff88';
      ctx.fillText('⚡ CARRIER LOCK ESTABLISHED (±1.5 MHz)', 18, 27);
    }
  }
}

window.Silo44IntelView = Silo44IntelView;
