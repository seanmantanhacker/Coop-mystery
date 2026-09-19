/* ==========================================================================
   OPERATION: ZERO HOUR - MAP 2: THE ALCHEMIST'S STUDY INTEL ANALYST VIEW
   Victorian Astrological Ephemeris & Spectrophotometer Station
   ========================================================================== */

class AlchemistIntelView {
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

    if (centerTitle) centerTitle.innerText = 'CELESTIAL EPHEMERIS & SPECTROPHOTOMETER';
    if (targetLbl) targetLbl.innerText = 'TARGET SPECTRAL ABSORPTION:';
    if (currentLbl) currentLbl.innerText = 'REFRACTED BEAM WAVELENGTH:';
    if (captionEl) captionEl.innerText = 'Guide Operative 1 (Defuser) to rotate optical crystal prisms and select color filters to match the target celestial spectrum!';
    if (emergTitle) emergTitle.innerText = 'VALVE OF HERMES: PHOSGENE NEUTRALIZER';
    if (emergWarning) emergWarning.innerText = '⚠️ HERMETIC PROTOCOL: Solve the cryptographic mathematical equation below to unlock the quicksilver neutralizer valve (+2:00 to Detonation Clock, single use).';
    if (guardLabel) guardLabel.innerText = 'BREAK SEAL';

    const zod = window.zodiacModule;
    const merc = window.mercuryModule;
    const escapement = window.escapementModule;
    const prism = window.prismModule;

    const houseText = zod ? `${zod.houses[zod.targetHouseIdx].name.toUpperCase()} ${zod.houses[zod.targetHouseIdx].symbol}` : 'SCORPIO ♏';
    const opusText = merc ? merc.opusName : 'OPUS AQUAE';
    const retroText = zod ? (zod.isRetrograde ? 'RETROGRADE (WEST)' : 'DIRECT (EAST)') : 'RETROGRADE';
    const lunarText = zod ? (zod.isPerigee ? 'PERIGEE ☽' : 'APOGEE ☾') : 'PERIGEE ☽';
    const tempVal = merc ? `${merc.temperature.toFixed(1)}°C` : '26.0°C';

    const purityGrade = merc ? merc.purityGrade : (window.game?.alchemistIntelData?.purityGrade || 'GRADE_A');
    const purityText = (purityGrade === 'GRADE_A') ? 'GRADE A (MERCURIAL FOCUS)' : 'GRADE B (SULFURIC BIAS)';

    const cam = escapement ? escapement.governorCam : (window.game?.alchemistIntelData?.governorCam || 1);
    const camNames = ['WHITTINGTON', 'WESTMINSTER', 'ST. MICHAEL'];
    const camText = `CAM #${cam} (${camNames[cam - 1] || 'WHITTINGTON'})`;

    const prismElem = prism ? prism.targetElement : 'Fire';
    const fraunhoferMap = {
      'Fire': 'LINE D: SOLAR SODIUM (589 nm)',
      'Water': 'LINE F: HYDROGEN BETA (450 nm)',
      'Air': 'LINE b: MAGNESIUM EMERALD (530 nm)',
      'Earth': 'LINE C: HYDROGEN ALPHA (650 nm)'
    };
    const fraunhoferLine = fraunhoferMap[prismElem] || 'LINE D: SOLAR SODIUM (589 nm)';

    if (serialLbl) serialLbl.innerText = 'RULING OPUS & HOUSE:';
    if (battLbl) battLbl.innerText = 'CELESTIAL MOTION & PURITY:';
    if (indLbl) indLbl.innerText = 'LUNAR SYZYGY & CHIME CAM:';
    if (tempItem) tempItem.style.display = 'block';

    if (serialEl) serialEl.innerText = `${opusText} // ${houseText}`;
    if (battEl) battEl.innerText = `${retroText} | ${purityText}`;
    if (indEl) indEl.innerText = `${lunarText} | ${camText}`;
    if (tempEl) {
      tempEl.innerText = `${tempVal} AMBIENT | ${fraunhoferLine}`;
      tempEl.className = 'glow-yellow';
    }

    const wave = prism ? `${prism.targetWavelength} nm (${fraunhoferLine.split(':')[0]})` : '589 nm (SOLAR D-LINE)';
    if (targetFreqEl) targetFreqEl.innerText = wave;
    if (inspectTargetEl) inspectTargetEl.innerText = wave;
    if (currentFreqEl && prism) currentFreqEl.innerText = `${prism.currentWavelength} nm`;
  }

  static getTelemetryText() {
    const zod = window.zodiacModule;
    const merc = window.mercuryModule;
    const escapement = window.escapementModule;
    const prism = window.prismModule;

    const target = prism ? `${prism.targetWavelength} nm` : '589 nm';
    const houseName = zod ? `${zod.houses[zod.targetHouseIdx].name.toUpperCase()} ${zod.houses[zod.targetHouseIdx].symbol}` : 'SCORPIO ♏';
    const opusName = merc ? merc.opusName : 'OPUS AQUAE';
    const retro = zod ? (zod.isRetrograde ? 'RETROGRADE' : 'DIRECT') : 'RETROGRADE';
    const lunar = zod ? (zod.isPerigee ? 'PERIGEE ☽' : 'APOGEE ☾') : 'PERIGEE ☽';
    const temp = merc ? `${merc.temperature.toFixed(1)}°C` : '26.0°C';
    const purity = merc ? merc.purityGrade : 'GRADE_A';
    const cam = escapement ? escapement.governorCam : 1;
    return `[ALCHEMIST INTEL] ${opusName} (${houseName}) | Temp: ${temp} | Purity: ${purity} | Cam #${cam} | Motion: ${retro} | Lunar: ${lunar} | Target Spectral: ${target}`;
  }

  static renderOscilloscope(ctx, canvas, phase) {
    ctx.fillStyle = '#0b0806';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Victorian Brass / Gold Spectrophotometer Grid
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.15)';
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

    const targetVal = window.prismModule ? window.prismModule.targetWavelength / 4 : 147.25;
    const currentVal = window.prismModule ? window.prismModule.currentWavelength / 4 : 102.5;
    const isLocked = Math.abs(currentVal - targetVal) < 2.0;

    // 1. Target Spectral Absorption Wave (Warm Gold Reference)
    ctx.strokeStyle = isLocked ? '#00ff88' : '#d4af37';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x++) {
      const f = targetVal / 18.0;
      const y = (canvas.height / 2) + Math.sin((x * f * 0.05) + phase) * 38;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 2. Incoming Refracted Optical Beam (Violet-Amber Spectral Beam)
    ctx.strokeStyle = isLocked ? '#00ff88' : '#e59866';
    ctx.lineWidth = isLocked ? 3 : 2;
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x++) {
      const f = currentVal / 18.0;
      const y = (canvas.height / 2) + Math.sin((x * f * 0.05) + (phase * 1.3)) * 38;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Target Spectral Lock Banner
    if (isLocked) {
      ctx.fillStyle = 'rgba(0, 255, 136, 0.18)';
      ctx.fillRect(10, 10, 270, 26);
      ctx.strokeStyle = '#00ff88';
      ctx.strokeRect(10, 10, 270, 26);
      ctx.font = '12px "Cinzel", serif';
      ctx.fillStyle = '#00ff88';
      ctx.fillText('✨ SPECTRAL HARMONY ATTAINED (±5 nm)', 18, 27);
    }
  }
}

window.AlchemistIntelView = AlchemistIntelView;
