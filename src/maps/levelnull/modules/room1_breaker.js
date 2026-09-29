/* ==========================================================================
   OPERATION: ZERO HOUR - MAP 4: LEVEL NULL
   CHAMBER 1: LIMINAL BREAKER & MAGNETIC FIRE DOOR
   ========================================================================== */

class Room1BreakerModule {
  constructor() {
    this.id = 'room1_breaker';
    this.name = 'MAGNETIC FIRE DOOR BREAKER';
    this.solved = false;
    this.disarmed = false;

    // 4 Phase breakers: Alpha, Beta, Gamma, Delta
    this.breakerStates = [false, false, false, false];
    this.currentFreq = 20.0; // 0 to 100 kHz

    // Solution targets generated per seed
    this.targetBreakers = [true, false, true, false]; // e.g. Alpha & Gamma
    this.targetFreq = 42.0;
    this.phaseLabels = ['PHASE α', 'PHASE β', 'PHASE γ', 'PHASE δ'];
    this.phaseColors = ['#f5d76e', '#00f0ff', '#c084fc', '#ff3344'];
  }

  generate(seed) {
    this.solved = false;
    this.disarmed = false;
    this.breakerStates = [false, false, false, false];
    this.currentFreq = 20.0;
    this.stabilizerActive = false;
    this.stabilizerTimeRemaining = 0;
    if (this.stabilizerInterval) clearInterval(this.stabilizerInterval);
    this.polarityFlipped = false;

    const s = Math.abs(seed);
    // Generate deterministic target breakers (pick 2 active)
    const patterns = [
      [true, false, true, false], // Alpha + Gamma
      [false, true, false, true], // Beta + Delta
      [true, true, false, false], // Alpha + Beta
      [false, false, true, true], // Gamma + Delta
      [true, false, false, true], // Alpha + Delta
      [false, true, true, false]  // Beta + Gamma
    ];
    this.targetBreakers = patterns[s % patterns.length];

    // Generate target frequency between 32.0 kHz and 88.0 kHz
    this.targetFreq = 32.0 + (s % 56);

    this.renderInspectUI();
  }

  triggerStabilizerPulse(duration = 20) {
    this.stabilizerActive = true;
    this.stabilizerTimeRemaining = duration;
    if (this.stabilizerInterval) clearInterval(this.stabilizerInterval);

    if (typeof audio !== 'undefined' && audio.playSwitch) audio.playSwitch();

    this.stabilizerInterval = setInterval(() => {
      this.stabilizerTimeRemaining--;
      if (this.stabilizerTimeRemaining <= 0) {
        this.stabilizerActive = false;
        clearInterval(this.stabilizerInterval);
      }
      this.renderInspectUI();
      if (window.levelNullIntelView && window.levelNullIntelView.updateDossierData) {
        window.levelNullIntelView.updateDossierData();
      }
    }, 1000);

    this.renderInspectUI();
  }

  setPolarity(flipped) {
    this.polarityFlipped = flipped;
    this.renderInspectUI();
  }

  toggleBreaker(index) {
    if (this.disarmed) return;
    this.breakerStates[index] = !this.breakerStates[index];
    if (typeof audio !== 'undefined' && audio.playSwitch) audio.playSwitch();

    // Broadcast state to peers
    if (window.game && window.game.network) {
      window.game.network.broadcast({
        type: 'LEVELNULL_ROOM1_SYNC',
        breakers: this.breakerStates,
        freq: this.currentFreq
      });
    }
    this.renderInspectUI();
  }

  setFrequency(val) {
    if (this.disarmed) return;
    this.currentFreq = parseFloat(val);

    if (window.game && window.game.network) {
      window.game.network.broadcast({
        type: 'LEVELNULL_ROOM1_SYNC',
        breakers: this.breakerStates,
        freq: this.currentFreq
      });
    }
    this.renderInspectUI();
  }

  triggerFireBar() {
    if (this.disarmed) return;

    // Check if breakers match target
    const breakersCorrect = this.breakerStates.every((val, idx) => val === this.targetBreakers[idx]);
    // Check frequency tolerance within ±3.0 kHz
    const freqCorrect = Math.abs(this.currentFreq - this.targetFreq) <= 3.0;

    // Synchronization check: Intel's EM Resonance Lock Beam must be active!
    if (!this.stabilizerActive) {
      if (typeof audio !== 'undefined' && audio.playStrike) audio.playStrike();
      if (window.game && window.game.addStrike) window.game.addStrike();
      if (window.game && window.game.showToast) {
        window.game.showToast('⚠️ EM LOCK INACTIVE: Have Intel Analyst engage [EM RESONANCE LOCK BEAM]!');
      } else if (typeof alert !== 'undefined') {
        alert('ACCESS DENIED: EM Resonance Lock Beam must be engaged by the Intel Analyst to demagnetize fire bar!');
      }
      return;
    }

    if (breakersCorrect && freqCorrect) {
      this.disarmed = true;
      this.solved = true;
      if (this.stabilizerInterval) clearInterval(this.stabilizerInterval);
      if (typeof audio !== 'undefined' && audio.playDisarmed) audio.playDisarmed();

      // Open physical 3D door
      if (window.levelNullEnv && window.levelNullEnv.openDoor1) {
        window.levelNullEnv.openDoor1();
      }

      // Show advance button in UI
      const advanceOverlay = document.getElementById('levelnull-advance-room1');
      if (advanceOverlay) advanceOverlay.classList.remove('hidden');

      // Update Apparatus Bar
      const step1 = document.getElementById('step-room-1');
      if (step1) {
        step1.classList.remove('active');
        step1.classList.add('cleared');
      }

      // Broadcast door open to peers
      if (window.game && window.game.network) {
        window.game.network.broadcast({
          type: 'LEVELNULL_DOOR_UNLOCKED',
          door: 1
        });
      }

      this.renderInspectUI();
    } else {
      if (typeof audio !== 'undefined' && audio.playStrike) audio.playStrike();
      if (window.game && window.game.addStrike) window.game.addStrike();
      this.renderInspectUI();
    }
  }

  renderInspectUI() {
    const panel = document.getElementById('levelnull-inspect-room1');
    if (!panel) return;

    const statusBadge = panel.querySelector('.levelnull-status-badge');
    if (statusBadge) {
      if (this.disarmed) {
        statusBadge.innerText = 'DOOR 1 UNLATCHED (BREACHED)';
        statusBadge.className = 'levelnull-status-badge disarmed';
      } else if (this.stabilizerActive) {
        statusBadge.innerText = `⚡ EM LOCK BEAM ACTIVE (${this.stabilizerTimeRemaining}s) - DE-ENERGIZED`;
        statusBadge.className = 'levelnull-status-badge glow-green';
      } else {
        statusBadge.innerText = 'MAG-LOCK ARMED (NEEDS INTEL EM LOCK BEAM)';
        statusBadge.className = 'levelnull-status-badge';
      }
    }

    // Render breakers
    const grid = panel.querySelector('#breaker-switches-grid');
    if (grid) {
      grid.innerHTML = this.phaseLabels.map((lbl, idx) => `
        <div class="breaker-switch ${this.breakerStates[idx] ? 'engaged' : ''}" onclick="window.room1BreakerModule.toggleBreaker(${idx})">
          <div class="breaker-led"></div>
          <span style="font-size:0.75rem; color:${this.phaseColors[idx]}; font-weight:bold;">${lbl}</span>
          <span style="font-size:0.65rem; color:#aaa;">${this.breakerStates[idx] ? 'ENGAGED' : 'OPEN'}</span>
        </div>
      `).join('');
    }

    // Render frequency slider
    const slider = panel.querySelector('#breaker-freq-slider');
    const readout = panel.querySelector('#breaker-freq-readout');
    if (slider) slider.value = this.currentFreq;
    if (readout) readout.innerText = `${this.currentFreq.toFixed(1)} kHz`;

    const fireBarBtn = panel.querySelector('#btn-fire-bar-latch');
    if (fireBarBtn) {
      if (this.disarmed) {
        fireBarBtn.innerText = 'FIRE BAR RELEASED (UNLOCKED)';
        fireBarBtn.classList.add('ready');
        fireBarBtn.disabled = true;
      } else if (this.stabilizerActive) {
        fireBarBtn.innerText = '⚡ PUSH EMERGENCY FIRE BAR (DEMAGNETIZED ✓)';
        fireBarBtn.classList.add('ready');
        fireBarBtn.disabled = false;
      } else {
        fireBarBtn.innerText = '🔒 FIRE BAR LOCKED (REQUEST INTEL EM BEAM)';
        fireBarBtn.classList.remove('ready');
        fireBarBtn.disabled = false;
      }
    }
  }
}

window.Room1BreakerModule = Room1BreakerModule;
window.room1BreakerModule = new Room1BreakerModule();
