/* ==========================================================================
   OPERATION: ZERO HOUR - MAP 4: LEVEL NULL
   CHAMBER 3: QUANTUM RESONANCE PRISMS & REALITY ANCHOR PORTAL
   ========================================================================== */

class Room3CoreModule {
  constructor() {
    this.id = 'room3_core';
    this.name = 'QUANTUM RESONANCE REALITY ANCHOR';
    this.solved = false;
    this.disarmed = false;

    // 3 Prisms: 0, 90, 180, 270 degrees
    this.prismAngles = [0, 0, 0];
    this.targetPrismAngles = [90, 180, 270];

    // 4-Digit Reality Anchor Stabilization Key
    this.currentCode = '';
    this.targetCode = '8942';
  }

  generate(seed) {
    this.solved = false;
    this.disarmed = false;
    this.prismAngles = [0, 0, 0];
    this.currentCode = '';

    const s = Math.abs(seed + 27);
    const angles = [0, 90, 180, 270];
    this.targetPrismAngles = [
      angles[(s) % 4],
      angles[(s + 1) % 4],
      angles[(s + 2) % 4]
    ];

    // 4-digit code generated deterministically
    const d1 = 4 + (s % 5);
    const d2 = 1 + ((s * 3) % 9);
    const d3 = 2 + ((s * 7) % 7);
    const d4 = 1 + ((s * 11) % 9);
    this.targetCode = `${d1}${d2}${d3}${d4}`;

    this.renderInspectUI();
  }

  rotatePrism(index) {
    if (this.disarmed) return;
    this.prismAngles[index] = (this.prismAngles[index] + 90) % 360;
    if (typeof audio !== 'undefined' && audio.playSwitch) audio.playSwitch();

    // Update 3D prism orientation if environment exists
    if (window.levelNullEnv && window.levelNullEnv.updatePrismMesh) {
      window.levelNullEnv.updatePrismMesh(index, this.prismAngles[index]);
    }

    if (window.game && window.game.network) {
      window.game.network.broadcast({
        type: 'LEVELNULL_ROOM3_PRISM_SYNC',
        angles: this.prismAngles
      });
    }

    if (window.levelNullIntelView && window.levelNullIntelView.updateDossierData) {
      window.levelNullIntelView.updateDossierData();
    }

    this.renderInspectUI();
  }

  getRealityDistortionIndex() {
    let diff = 0;
    for (let i = 0; i < 3; i++) {
      if (this.prismAngles[i] !== this.targetPrismAngles[i]) {
        diff += 33.3;
      }
    }
    return Math.min(100, Math.round(diff));
  }

  appendKeypad(digit) {
    if (this.disarmed) return;
    if (this.currentCode.length < 4) {
      this.currentCode += digit;
      if (typeof audio !== 'undefined' && audio.playKeypadBeep) audio.playKeypadBeep();
      this.renderInspectUI();
    }
  }

  clearKeypad() {
    if (this.disarmed) return;
    this.currentCode = '';
    if (typeof audio !== 'undefined' && audio.playSwitch) audio.playSwitch();
    this.renderInspectUI();
  }

  triggerRealityTether(duration = 45) {
    this.tetherActive = true;
    this.tetherTimeRemaining = duration;
    if (this.tetherInterval) clearInterval(this.tetherInterval);

    if (typeof audio !== 'undefined' && audio.playSwitch) audio.playSwitch();

    this.tetherInterval = setInterval(() => {
      this.tetherTimeRemaining--;
      if (this.tetherTimeRemaining <= 0) {
        this.tetherActive = false;
        clearInterval(this.tetherInterval);
      }
      this.renderInspectUI();
      if (window.levelNullIntelView && window.levelNullIntelView.updateDossierData) {
        window.levelNullIntelView.updateDossierData();
      }
    }, 1000);

    this.renderInspectUI();
  }

  commitAnchorStabilization() {
    if (this.disarmed) return;

    const rdi = this.getRealityDistortionIndex();
    const codeMatch = (this.currentCode === this.targetCode);

    // Synchronization check 1: Prisms must be aligned (RDI = 0)
    if (rdi > 0) {
      if (typeof audio !== 'undefined' && audio.playStrike) audio.playStrike();
      if (window.game && window.game.showToast) {
        window.game.showToast(`⚠️ PRISMS UNALIGNED: RDI at ${rdi}%. Rotate all 3 prisms until RDI = 0%!`);
      } else {
        alert(`SPATIAL FLUX: Reality Distortion at ${rdi}%. Rotate prisms until 0%!`);
      }
      return;
    }

    // Synchronization check 2: Intel must have engaged Reality Tether
    if (!this.tetherActive) {
      if (typeof audio !== 'undefined' && audio.playStrike) audio.playStrike();
      if (window.game && window.game.showToast) {
        window.game.showToast('⚠️ TETHER DISENGAGED: Have Intel Analyst discharge [REALITY TETHER PULSE]!');
      } else {
        alert('TETHER OFFLINE: Intel Analyst must initiate Reality Tether Pulse to lock portal coordinates!');
      }
      return;
    }

    if (codeMatch) {
      this.disarmed = true;
      this.solved = true;
      if (this.tetherInterval) clearInterval(this.tetherInterval);
      if (typeof audio !== 'undefined' && audio.playDisarmed) audio.playDisarmed();

      // Open physical 3D reality portal
      if (window.levelNullEnv && window.levelNullEnv.openPortal) {
        window.levelNullEnv.openPortal();
      }

      // Update Apparatus Bar
      const step3 = document.getElementById('step-room-3');
      if (step3) {
        step3.classList.remove('active');
        step3.classList.add('cleared');
      }

      this.renderInspectUI();

      if (window.game && window.game.checkVictory) {
        window.game.checkVictory();
      }
    } else {
      if (typeof audio !== 'undefined' && audio.playStrike) audio.playStrike();
      if (window.game && window.game.addStrike) window.game.addStrike();
      this.currentCode = '';
      this.renderInspectUI();
    }
  }

  renderInspectUI() {
    const panel = document.getElementById('levelnull-inspect-room3');
    if (!panel) return;

    const statusBadge = panel.querySelector('.levelnull-status-badge');
    const rdi = this.getRealityDistortionIndex();

    if (statusBadge) {
      if (this.disarmed) {
        statusBadge.innerText = 'REALITY ANCHOR STABILIZED (PORTAL OPEN)';
        statusBadge.className = 'levelnull-status-badge disarmed';
      } else if (this.tetherActive) {
        statusBadge.innerText = `⚡ REALITY TETHER ENGAGED (${this.tetherTimeRemaining}s) - COMMIT CODE!`;
        statusBadge.className = 'levelnull-status-badge glow-green';
      } else if (rdi === 0) {
        statusBadge.innerText = 'RDI NULL (0%) - READY FOR INTEL REALITY TETHER';
        statusBadge.className = 'levelnull-status-badge glow-yellow';
      } else {
        statusBadge.innerText = `RDI FLUX: ${rdi}% DISTORTION`;
        statusBadge.className = 'levelnull-status-badge';
      }
    }

    const prismGrid = panel.querySelector('#quantum-prism-grid');
    if (prismGrid) {
      prismGrid.innerHTML = [0, 1, 2].map(idx => `
        <div class="prism-card">
          <span style="font-size:0.75rem; color:#c084fc; font-weight:bold;">PRISM ${idx + 1}</span>
          <div style="font-size:1.1rem; color:#fff; font-weight:bold;">${this.prismAngles[idx]}°</div>
          <button class="prism-rot-btn" onclick="window.room3CoreModule.rotatePrism(${idx})">ROTATE 90°</button>
        </div>
      `).join('');
    }

    const codeDisplay = panel.querySelector('#quantum-code-display');
    if (codeDisplay) {
      codeDisplay.innerText = this.currentCode.padEnd(4, '_');
    }

    const commitBtn = panel.querySelector('#btn-commit-anchor');
    if (commitBtn) {
      if (this.disarmed) {
        commitBtn.innerText = 'DIMENSIONAL PORTAL OPEN (WIN)';
        commitBtn.classList.add('ready');
        commitBtn.disabled = true;
      } else {
        commitBtn.innerText = 'COMMIT ANCHOR STABILIZATION KEY';
        commitBtn.classList.remove('ready');
        commitBtn.disabled = false;
      }
    }
  }
}

window.Room3CoreModule = Room3CoreModule;
window.room3CoreModule = new Room3CoreModule();
