/* ==========================================================================
   OPERATION: ZERO HOUR - INTEL ANALYST: SHELL & VIEW CONTROLLER
   Delegates map-specific sensor telemetry, ephemeris, and canvas rendering.
   ========================================================================== */

class IntelViewEngine {
  constructor() {
    this.scenario = 'silo44';
    this.currentView = 'CONSOLE_OVERVIEW';
    this.flipGuardOpen = false;
    this.toggleActivated = false;
    this.oscilloscopeAnimId = null;

    // Mathematical Equation Time Bonus Helper
    this.mathSolved = false;
    this.mathProblem = null;
    this.mathHintShown = false;

    // Keyboard shortcut: Escape returns to Console Overview
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (this.currentView !== 'CONSOLE_OVERVIEW') {
          this.setView('CONSOLE_OVERVIEW');
        }
      }
    });
  }

  getRenderer() {
    if (window.ESCAPE_MAPS && window.ESCAPE_MAPS[this.scenario]) {
      return window.ESCAPE_MAPS[this.scenario].getIntelRenderer();
    }
    return (this.scenario === 'silo44') ? window.Silo44IntelView : window.AlchemistIntelView;
  }

  init(scenario = 'silo44') {
    this.scenario = scenario;
    this.toggleActivated = false;
    this.mathSolved = false;
    this.generateMathProblem();
    this.setView('CONSOLE_OVERVIEW');
    this.updateDossierData();
    this.startOscilloscope();
    this.startWireframeSchematic();
  }

  setScenario(scenario) {
    this.scenario = scenario;
    this.generateMathProblem();
    this.updateDossierData();
  }

  generateMathProblem() {
    // Pull from pre-defined hard question bank
    const q = (typeof pickRandomQuestion === 'function')
      ? pickRandomQuestion()
      : null;

    if (q) {
      this.mathProblem = {
        text: q.question,
        answer: q.answer,
        category: q.category,
        hint: q.hint,
        id: q.id
      };
    } else {
      // Fallback if question bank not loaded
      const a = Math.floor(Math.random() * 20) + 10;
      const b = Math.floor(Math.random() * 15) + 5;
      const c = Math.floor(Math.random() * 40) + 10;
      this.mathProblem = {
        text: `(${a} + ${b}) × ${c} = ?`,
        answer: (a + b) * c,
        category: 'ALGEBRA',
        hint: 'Evaluate brackets first, then multiply.',
        id: 'FB01'
      };
    }
    this.mathHintShown = false;
    this.updateMathUI();
  }

  toggleMathHint() {
    this.mathHintShown = !this.mathHintShown;
    const hintEl = document.getElementById('math-hint-text');
    const hintBtn = document.getElementById('btn-toggle-hint');
    if (hintEl && this.mathProblem) {
      hintEl.style.display = this.mathHintShown ? 'block' : 'none';
      hintEl.innerText = '💡 HINT: ' + (this.mathProblem.hint || 'No hint available.');
    }
    if (hintBtn) {
      hintBtn.innerText = this.mathHintShown ? '🔒 HIDE HINT' : '💡 REVEAL HINT (-10s PENALTY)';
    }
    // Apply a small time penalty for using hint
    if (this.mathHintShown && window.game && !this._hintPenaltyApplied) {
      this._hintPenaltyApplied = true;
      if (window.game.timerSeconds > 10) {
        window.game.timerSeconds -= 10;
      }
      if (window.game.showToast) {
        window.game.showToast('⚠️ HINT ACCESSED: −10s deducted from mission clock.');
      }
    }
  }

  updateMathUI() {
    const eqEl = document.getElementById('math-equation-text');
    const catEl = document.getElementById('math-category-tag');
    const badgeEl = document.getElementById('math-status-badge');
    const feedEl = document.getElementById('math-feedback-msg');
    const lever = document.getElementById('missile-toggle-lever');
    const lockCaption = document.getElementById('switch-lock-status-text');
    const input = document.getElementById('math-answer-input');
    const submitBtn = document.getElementById('btn-submit-math');
    const hintBtn = document.getElementById('btn-toggle-hint');
    const hintEl = document.getElementById('math-hint-text');

    if (!this.mathProblem) return;

    if (catEl) {
      catEl.innerText = '📐 ' + (this.mathProblem.category || 'MATHEMATICS') + ' [' + (this.mathProblem.id || '') + ']';
    }
    if (eqEl) {
      eqEl.innerText = this.mathSolved
        ? this.mathProblem.text.split('\n').join(' ').replace(/ = \?$/, '') + ' = ' + this.mathProblem.answer + ' [SOLVED ✓]'
        : this.mathProblem.text;
    }

    if (window.game && window.game.overrideUsed) {
      if (badgeEl) {
        badgeEl.className = 'badge badge-success';
        badgeEl.innerText = 'OVERRIDE DISPATCHED: +02:00 APPLIED';
      }
      if (feedEl) {
        feedEl.innerHTML = '<span class="glow-green">✓ +2:00 Clock extension used. (Single use limit reached).</span>';
      }
      if (lever) { lever.classList.remove('locked'); lever.classList.add('activated'); }
      if (lockCaption) { lockCaption.innerText = '✓ OVERRIDE DISCHARGED (+2 MINUTES ADDED)'; lockCaption.style.color = '#00ff88'; }
      if (input) input.disabled = true;
      if (submitBtn) submitBtn.disabled = true;
      if (hintBtn) hintBtn.disabled = true;
      return;
    }

    if (this.mathSolved) {
      if (badgeEl) { badgeEl.className = 'badge badge-success'; badgeEl.innerText = 'CHECKSUM ACCEPTED: LEVER UNLOCKED'; }
      if (feedEl) {
        feedEl.innerHTML = '<span class="glow-green">✓ Solution verified! Flip guard and throw lever to add +2 Minutes.</span>';
      }
      if (lever) lever.classList.remove('locked');
      if (lockCaption) { lockCaption.innerText = '🔓 LEVER UNLOCKED — FLIP GUARD AND THROW LEVER'; lockCaption.style.color = '#00ffcc'; }
      if (input) input.disabled = true;
      if (submitBtn) submitBtn.disabled = true;
      if (hintBtn) hintBtn.disabled = true;
      if (hintEl) hintEl.style.display = 'none';
    } else {
      if (badgeEl) { badgeEl.className = 'badge badge-warning'; badgeEl.innerText = 'LOCK: CRYPTOGRAPHIC COMPUTATION REQUIRED'; }
      if (feedEl) {
        feedEl.innerHTML = 'Solve the equation above to unlock the emergency lever. Each answer must be an integer.';
      }
      if (lever) { lever.classList.add('locked'); lever.classList.remove('activated'); }
      if (lockCaption) { lockCaption.innerText = '🔒 LEVER LOCKED — SOLVE EQUATION ABOVE'; lockCaption.style.color = '#ff99aa'; }
      if (input) input.disabled = false;
      if (submitBtn) submitBtn.disabled = false;
      if (hintBtn) hintBtn.disabled = false;
    }
  }

  submitMathAnswer() {
    if (this.mathSolved || (window.game && window.game.overrideUsed)) return;

    const input = document.getElementById('math-answer-input');
    const feedEl = document.getElementById('math-feedback-msg');
    if (!input || !this.mathProblem) return;

    const rawVal = input.value.trim();
    const userVal = parseInt(rawVal, 10);
    if (isNaN(userVal) || String(userVal) !== rawVal) {
      if (feedEl) feedEl.innerHTML = '<span class="glow-red">⚠️ Enter a whole integer (no decimals or text).</span>';
      return;
    }

    if (userVal === this.mathProblem.answer) {
      this.mathSolved = true;
      this._hintPenaltyApplied = false;
      if (window.audio) window.audio.playDisarmed();
      this.updateMathUI();
    } else {
      if (window.audio) window.audio.playStrike();
      if (feedEl) feedEl.innerHTML = `<span class="glow-red">✖ INCORRECT. ${userVal} ≠ expected. Recalculate and retry.</span>`;
      input.value = '';
      input.focus();
    }
  }

  handleMathInputKey(event) {
    if (event.key === 'Enter') {
      this.submitMathAnswer();
    }
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
      this.updateMathUI();
    }
    this.updateMissionObjectives();
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
    if (!this.mathSolved) {
      alert('ACCESS DENIED: Solve the mathematical equation above first to unlock the emergency lever!');
      if (window.audio) window.audio.playBuzz();
      return;
    }
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
    this.updateMathUI();
  }

  copyTelemetry() {
    const renderer = this.getRenderer();
    const text = renderer && renderer.getTelemetryText ? renderer.getTelemetryText() : '';

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        if (window.game && window.game.showToast) {
          window.game.showToast('📋 Telemetry data copied to clipboard!');
        }
      }).catch(() => {
        prompt('Copy telemetry data:', text);
      });
    } else {
      prompt('Copy telemetry data:', text);
    }
  }

  updateDossierData() {
    const renderer = this.getRenderer();
    if (renderer && renderer.updateDossierData) {
      renderer.updateDossierData();
    }
    this.updateMissionObjectives();
  }

  updateMissionObjectives() {
    const scenario = this.scenario || (window.game ? window.game.scenario : 'silo44');
    let mods = [];
    let defaultDirective = '';

    if (scenario === 'silo44') {
      const w = window.wiresModule ? window.wiresModule.disarmed : false;
      const k = window.keypadModule ? window.keypadModule.disarmed : false;
      const f = window.frequencyModule ? window.frequencyModule.disarmed : false;
      const s = window.simonModule ? window.simonModule.disarmed : false;

      mods = [
        { 
          name: 'COLOR WIRES', 
          disarmed: w, 
          detail: w ? 'Wires Severed ✓' : 'DEFCON Alert Data Req',
          hint: 'Relay Serial No & DEFCON status for Wires'
        },
        { 
          name: 'CYRILLIC KEYPAD', 
          disarmed: k, 
          detail: k ? 'Glyphs Unlocked ✓' : 'SIGINT Cipher Key Req',
          hint: 'Transmit SIGINT Cipher Key and FRK status for Keypad'
        },
        { 
          name: 'FREQUENCY SWEEP', 
          disarmed: f, 
          detail: f ? 'Carrier Locked ✓' : 'Target MHz Relay Req',
          hint: 'Monitor RF Oscilloscope and guide Defuser to match Target MHz'
        },
        { 
          name: 'SIMON SAYS', 
          disarmed: s, 
          detail: s ? 'Lights Secured ✓' : 'Pulse Polarity Req',
          hint: 'Check Radar Pulse Polarity on dossier for Simon light mapping'
        }
      ];

      defaultDirective = 'Puzzles can be defused in any order. Coordinate DEFCON, Cipher Key, Carrier MHz, or Radar Polarity with team.';
    } else if (scenario === 'alchemist') {
      const z = window.zodiacModule ? window.zodiacModule.solved : false;
      const m = window.mercuryModule ? window.mercuryModule.solved : false;
      const p = window.prismModule ? window.prismModule.solved : false;
      const e = window.escapementModule ? window.escapementModule.solved : false;

      mods = [
        { 
          name: 'ZODIAC RINGS', 
          disarmed: z, 
          detail: z ? 'Constellation Fixed ✓' : 'Ruling House & Retrograde',
          hint: 'Transmit Ruling House, Retrograde motion, and Syzygy to Manual'
        },
        { 
          name: 'MERCURY MANOMETER', 
          disarmed: m, 
          detail: m ? 'Equilibrium Reached ✓' : 'Ambient Temp & Purity Grade',
          hint: 'Transmit Ambient Temp & Quintessence Purity for Quicksilver flasks'
        },
        { 
          name: 'REFRACTION PRISM', 
          disarmed: p, 
          detail: p ? 'Spectral Line Locked ✓' : 'Fraunhofer Line Req',
          hint: 'Monitor Spectrophotometer; report Fraunhofer Line wavelength'
        },
        { 
          name: 'CHIME ESCAPEMENT', 
          disarmed: e, 
          detail: e ? 'Escapement Disengaged ✓' : 'Planetary Governor Cam',
          hint: 'Verify Planetary Chime Governor Cam for strike release window'
        }
      ];

      defaultDirective = 'Alchemical seals can be broken in any order. Transmit Astrological, Flask Purity, or Spectral data.';
    } else if (scenario === 'morgue') {
      const t = window.toxicologyModule ? (window.toxicologyModule.solved || window.toxicologyModule.disarmed) : false;
      const a = window.autopsyModule ? (window.autopsyModule.solved || window.autopsyModule.disarmed) : false;
      const k = window.morgueKeypadModule ? (window.morgueKeypadModule.solved || window.morgueKeypadModule.disarmed) : false;
      const l = window.lifeSupportModule ? (window.lifeSupportModule.solved || window.lifeSupportModule.disarmed) : false;
      const power = window.lifeSupportModule ? window.lifeSupportModule.powerActive : true;

      mods = [
        { 
          name: 'TOXICOLOGY ASSAY', 
          disarmed: t, 
          detail: t ? 'Reagent Neutralized ✓' : 'Victim Mass & Clearance',
          hint: 'Transmit Victim Mass & Clearance to Manual for Titration Target'
        },
        { 
          name: 'AUTOPSY CALIPERS', 
          disarmed: a, 
          detail: a ? 'Wounds Differentiated ✓' : 'Ante-Mortem Calipers',
          hint: 'Cross-reference alibis while Defuser differentiates vital wounds'
        },
        { 
          name: 'AIRLOCK DOOR PIN', 
          disarmed: k, 
          detail: k ? 'Airlock Unlocked ✓' : 'Birth Year & Access Tier',
          hint: 'Transmit Victim Birth Year & Ward 9 Access Log Tier for PIN'
        },
        { 
          name: 'LIFE SUPPORT EXHAUST', 
          disarmed: l, 
          detail: l ? 'Damper Secured ✓' : 'Classification & Vent Flush',
          hint: 'Transmit Crime Scene Classification; standby for Vent Flush purge'
        }
      ];

      defaultDirective = 'Investigate cadaver wounds, titrate poison antidote, and coordinate Life Support ventilation.';
    }

    // Determine solved count and unsolved modules (non-sequential)
    const unsolved = mods.filter(m => !m.disarmed);
    const solvedCount = mods.length - unsolved.length;

    // Dynamic Directive calculation based on remaining tasks
    let directive = '';
    if (scenario === 'morgue' && window.lifeSupportModule && !window.lifeSupportModule.powerActive) {
      directive = 'DIRECTIVE: ⚡ FACILITY BREAKER TRIPPED! Trigger [POWER_RESET] to restore laboratory power.';
    } else if (unsolved.length === 0) {
      directive = `DIRECTIVE: ALL OBJECTIVES COMPLETED. ${scenario.toUpperCase()} CONTAINMENT SECURED ✓`;
    } else if (unsolved.length === 1) {
      directive = `DIRECTIVE [FINAL MODULE]: Only ${unsolved[0].name} remaining! ${unsolved[0].hint}.`;
    } else if (solvedCount > 0) {
      const names = unsolved.map(m => m.name).join(' or ');
      directive = `DIRECTIVE (${unsolved.length} REMAINING): Disarm in any order: ${names}. Focus: ${unsolved[0].hint}.`;
    } else {
      directive = `DIRECTIVE: ${defaultDirective}`;
    }

    // Update DOM elements
    const progressEl = document.getElementById('intel-matrix-progress');
    const directiveEl = document.getElementById('intel-mission-directive-banner');

    if (progressEl) {
      progressEl.innerText = `${solvedCount} / ${mods.length} MODULES SECURED`;
      progressEl.style.color = (solvedCount === mods.length) ? '#00ff88' : '#ffcc00';
    }
    if (directiveEl) {
      directiveEl.innerText = directive;
    }

    mods.forEach((mod, idx) => {
      const card = document.getElementById(`intel-card-mod-${idx + 1}`);
      const nameEl = document.getElementById(`intel-mod-name-${idx + 1}`);
      const statusEl = document.getElementById(`intel-mod-status-${idx + 1}`);
      const detailEl = document.getElementById(`intel-mod-detail-${idx + 1}`);

      if (nameEl) nameEl.innerText = mod.name;
      if (detailEl) detailEl.innerText = mod.detail;

      if (mod.disarmed) {
        if (card) { card.className = 'intel-module-card secured'; }
        if (statusEl) {
          statusEl.className = 'status-pill secured';
          statusEl.innerText = '✓ SECURED';
        }
      } else {
        // NON-SEQUENTIAL: All unsolved modules are ARMED and immediately accessible!
        if (card) { card.className = 'intel-module-card active'; }
        if (statusEl) {
          statusEl.className = 'status-pill active';
          statusEl.innerText = '⚡ ARMED';
        }
      }
    });
  }

  startOscilloscope() {
    const canvas = document.getElementById('intel-large-oscilloscope');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let phase = 0;

    const render = () => {
      const renderer = this.getRenderer();
      if (renderer && renderer.renderOscilloscope) {
        renderer.renderOscilloscope(ctx, canvas, phase);
      }
      phase += 0.08;
      this.oscilloscopeAnimId = requestAnimationFrame(render);
    };

    if (this.oscilloscopeAnimId) cancelAnimationFrame(this.oscilloscopeAnimId);
    this.oscilloscopeAnimId = requestAnimationFrame(render);
  }

  startWireframeSchematic() {
    const canvas = document.getElementById('intel-casing-wireframe');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let angle = 0;

    const render = () => {
      ctx.fillStyle = '#050a10';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const r = 40;

      for (let i = 0; i < 4; i++) {
        const a = angle + (i * Math.PI / 2);
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * (r * 0.45);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();

      angle += 0.02;
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }
}

const intelView = new IntelViewEngine();
window.intelView = intelView;
