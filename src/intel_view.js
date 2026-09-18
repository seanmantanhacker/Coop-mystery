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
    const types = ['mul_add', 'mul_sub', 'compound'];
    const selected = types[Math.floor(Math.random() * types.length)];
    let text = '';
    let answer = 0;

    if (selected === 'mul_add') {
      const a = Math.floor(Math.random() * 12) + 6;
      const b = Math.floor(Math.random() * 8) + 4;
      const c = Math.floor(Math.random() * 35) + 10;
      answer = (a * b) + c;
      text = `${a} × ${b} + ${c} = ?`;
    } else if (selected === 'mul_sub') {
      const a = Math.floor(Math.random() * 14) + 7;
      const b = Math.floor(Math.random() * 8) + 5;
      const c = Math.floor(Math.random() * 25) + 10;
      answer = (a * b) - c;
      text = `${a} × ${b} - ${c} = ?`;
    } else {
      const a = Math.floor(Math.random() * 30) + 15;
      const b = Math.floor(Math.random() * 30) + 15;
      const c = Math.floor(Math.random() * 4) + 2;
      answer = (a + b) * c;
      text = `(${a} + ${b}) × ${c} = ?`;
    }

    this.mathProblem = { text, answer };
    this.updateMathUI();
  }

  updateMathUI() {
    const eqEl = document.getElementById('math-equation-text');
    const badgeEl = document.getElementById('math-status-badge');
    const feedEl = document.getElementById('math-feedback-msg');
    const lever = document.getElementById('missile-toggle-lever');
    const lockCaption = document.getElementById('switch-lock-status-text');
    const input = document.getElementById('math-answer-input');
    const submitBtn = document.getElementById('btn-submit-math');

    if (!this.mathProblem) return;

    if (eqEl) {
      eqEl.innerText = this.mathSolved 
        ? `${this.mathProblem.text.replace(' = ?', '')} = ${this.mathProblem.answer} [SOLVED]` 
        : this.mathProblem.text;
    }

    if (window.game && window.game.overrideUsed) {
      if (badgeEl) {
        badgeEl.className = 'badge badge-success';
        badgeEl.innerText = 'OVERRIDE DISPATCHED: +02:00 APPLIED';
      }
      if (feedEl) {
        feedEl.innerHTML = '<span class="glow-green">✓ +2:00 Detonation Clock extension used. (Single use limit reached).</span>';
      }
      if (lever) {
        lever.classList.remove('locked');
        lever.classList.add('activated');
      }
      if (lockCaption) {
        lockCaption.innerText = '✓ OVERRIDE DISCHARGED (+2 MINUTES ADDED)';
        lockCaption.style.color = '#00ff88';
      }
      if (input) input.disabled = true;
      if (submitBtn) submitBtn.disabled = true;
      return;
    }

    if (this.mathSolved) {
      if (badgeEl) {
        badgeEl.className = 'badge badge-success';
        badgeEl.innerText = 'CALCULATION ACCEPTED: LEVER UNLOCKED';
      }
      if (feedEl) {
        feedEl.innerHTML = '<span class="glow-green">✓ Checksum validated! Flip guard and throw lever to add +2 Minutes.</span>';
      }
      if (lever) lever.classList.remove('locked');
      if (lockCaption) {
        lockCaption.innerText = '🔓 LEVER UNLOCKED — FLIP GUARD AND THROW LEVER';
        lockCaption.style.color = '#00ffcc';
      }
      if (input) input.disabled = true;
      if (submitBtn) submitBtn.disabled = true;
    } else {
      if (badgeEl) {
        badgeEl.className = 'badge badge-warning';
        badgeEl.innerText = 'LOCK: COMPUTATION REQUIRED';
      }
      if (feedEl) {
        feedEl.innerHTML = 'Solve correctly to unlock the emergency injection lever (+2 min).';
      }
      if (lever) {
        lever.classList.add('locked');
        lever.classList.remove('activated');
      }
      if (lockCaption) {
        lockCaption.innerText = '🔒 LEVER LOCKED — SOLVE MATH EQUATION ABOVE';
        lockCaption.style.color = '#ff99aa';
      }
      if (input) input.disabled = false;
      if (submitBtn) submitBtn.disabled = false;
    }
  }

  submitMathAnswer() {
    if (this.mathSolved || (window.game && window.game.overrideUsed)) return;

    const input = document.getElementById('math-answer-input');
    const feedEl = document.getElementById('math-feedback-msg');
    if (!input || !this.mathProblem) return;

    const userVal = parseInt(input.value.trim(), 10);
    if (isNaN(userVal)) {
      if (feedEl) feedEl.innerHTML = '<span class="glow-red">⚠️ Please input a numeric answer.</span>';
      return;
    }

    if (userVal === this.mathProblem.answer) {
      this.mathSolved = true;
      if (window.audio) window.audio.playDisarmed();
      this.updateMathUI();
    } else {
      if (window.audio) window.audio.playStrike();
      if (feedEl) feedEl.innerHTML = `<span class="glow-red">✖ CHECKSUM MISMATCH. ${userVal} is incorrect! Recalculate.</span>`;
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
