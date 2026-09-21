/* ==========================================================================
   OPERATION: ZERO HOUR - MAP 4: LEVEL NULL
   CHAMBER 2: HYDROSTATIC SUBSTATION & SUBMARINE VAULT HATCH
   ========================================================================== */

class Room2HydroModule {
  constructor() {
    this.id = 'room2_hydro';
    this.name = 'HYDROSTATIC SUBMARINE VAULT HATCH';
    this.solved = false;
    this.disarmed = false;

    // 3 Valves: A, B, C (0 to 100 PSI)
    this.valves = [10, 10, 10];
    this.targetValves = [40, 60, 20];
    this.valveLabels = ['VALVE A (INTAKE)', 'VALVE B (RETURN)', 'VALVE C (EQUALIZER)'];
    this.valveColors = ['#00f0ff', '#f5d76e', '#00ff88'];

    // Remote pump status controlled by Intel Analyst
    this.drainPumpActive = false;
    this.hydraulicLockPsi = 80; // Starts pressurized at 80 PSI
    this.drainInterval = null;
  }

  generate(seed) {
    this.solved = false;
    this.disarmed = false;
    this.valves = [10, 10, 10];
    this.drainPumpActive = false;
    this.hydraulicLockPsi = 80;
    if (this.drainInterval) clearInterval(this.drainInterval);

    const s = Math.abs(seed + 11);
    // Deterministic valve targets in steps of 10 PSI
    this.targetValves = [
      20 + ((s % 5) * 10),      // 20, 30, 40, 50, 60
      30 + (((s * 3) % 4) * 10), // 30, 40, 50, 60
      20 + (((s * 7) % 5) * 10)  // 20, 30, 40, 50, 60
    ];

    this.renderInspectUI();
  }

  adjustValve(index, delta) {
    if (this.disarmed) return;
    this.valves[index] = Math.max(0, Math.min(100, this.valves[index] + delta));
    if (typeof audio !== 'undefined' && audio.playSwitch) audio.playSwitch();

    if (window.game && window.game.network) {
      window.game.network.broadcast({
        type: 'LEVELNULL_ROOM2_HYDRO_SYNC',
        valves: this.valves,
        drainPumpActive: this.drainPumpActive,
        hydraulicLockPsi: this.hydraulicLockPsi
      });
    }
    this.renderInspectUI();
  }

  setDrainPump(active) {
    this.drainPumpActive = active;

    if (this.drainInterval) clearInterval(this.drainInterval);

    if (active && !this.disarmed) {
      this.drainInterval = setInterval(() => {
        if (this.hydraulicLockPsi > 0) {
          this.hydraulicLockPsi = Math.max(0, this.hydraulicLockPsi - 3);
          
          // Visually lower water level in 3D scene
          if (window.levelNullEnv && window.levelNullEnv.waterMesh) {
            const ratio = this.hydraulicLockPsi / 80;
            window.levelNullEnv.waterMesh.position.y = -0.3 + (ratio * 0.34);
          }

          this.renderInspectUI();
          if (window.levelNullIntelView && window.levelNullIntelView.updateDossierData) {
            window.levelNullIntelView.updateDossierData();
          }
        }
      }, 600);
    }

    this.renderInspectUI();
  }

  purgeBackpressure() {
    this.hydraulicLockPsi = Math.max(0, this.hydraulicLockPsi - 25);
    if (window.levelNullEnv && window.levelNullEnv.waterMesh) {
      const ratio = this.hydraulicLockPsi / 80;
      window.levelNullEnv.waterMesh.position.y = -0.3 + (ratio * 0.34);
    }
    this.renderInspectUI();
    if (window.levelNullIntelView && window.levelNullIntelView.updateDossierData) {
      window.levelNullIntelView.updateDossierData();
    }
  }

  turnSubmarineWheel() {
    if (this.disarmed) return;

    // Check if valves match targets (within ±5 PSI)
    const valvesBalanced = this.valves.every((val, idx) => Math.abs(val - this.targetValves[idx]) <= 5);

    // Synchronization check 1: Pump active
    if (!this.drainPumpActive) {
      if (typeof audio !== 'undefined' && audio.playStrike) audio.playStrike();
      if (window.game && window.game.showToast) {
        window.game.showToast('⚠️ PUMP OFFLINE: Sub hatch pinned by brine! Have Intel engage [AUX HYDRO DRAIN PUMP]!');
      } else {
        alert('SUB HATCH PINNED: Aux Hydro Drain Pump must be active on Intel console!');
      }
      return;
    }

    // Synchronization check 2: Hydraulic lock pressure must be purged (≤ 15 PSI)
    if (this.hydraulicLockPsi > 15) {
      if (typeof audio !== 'undefined' && audio.playStrike) audio.playStrike();
      if (window.game && window.game.showToast) {
        window.game.showToast(`⚠️ RESIDUAL PRESSURE (${this.hydraulicLockPsi} PSI): Allow pump to drain pressure below 15 PSI!`);
      } else {
        alert(`HYDRAULIC HAZARD: Chamber pressure at ${this.hydraulicLockPsi} PSI. Must drain to ≤15 PSI!`);
      }
      return;
    }

    if (valvesBalanced) {
      this.disarmed = true;
      this.solved = true;
      if (this.drainInterval) clearInterval(this.drainInterval);
      if (typeof audio !== 'undefined' && audio.playDisarmed) audio.playDisarmed();

      // Open physical 3D submarine hatch
      if (window.levelNullEnv && window.levelNullEnv.openDoor2) {
        window.levelNullEnv.openDoor2();
      }

      // Show advance button in UI
      const advanceOverlay = document.getElementById('levelnull-advance-room2');
      if (advanceOverlay) advanceOverlay.classList.remove('hidden');

      // Update Apparatus Bar
      const step2 = document.getElementById('step-room-2');
      if (step2) {
        step2.classList.remove('active');
        step2.classList.add('cleared');
      }

      if (window.game && window.game.network) {
        window.game.network.broadcast({
          type: 'LEVELNULL_DOOR_UNLOCKED',
          door: 2
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
    const panel = document.getElementById('levelnull-inspect-room2');
    if (!panel) return;

    const statusBadge = panel.querySelector('.levelnull-status-badge');
    if (statusBadge) {
      if (this.disarmed) {
        statusBadge.innerText = 'SUB HATCH EQUALIZED (BREACHED)';
        statusBadge.className = 'levelnull-status-badge disarmed';
      } else if (this.hydraulicLockPsi <= 15 && this.drainPumpActive) {
        statusBadge.innerText = `HYDROSTATIC BALANCE READY (${this.hydraulicLockPsi} PSI) - TURN WHEEL`;
        statusBadge.className = 'levelnull-status-badge glow-green';
      } else {
        statusBadge.innerText = `SEAL PRESSURE: ${this.hydraulicLockPsi} PSI (DRAIN TO ≤15 PSI)`;
        statusBadge.className = 'levelnull-status-badge';
      }
    }

    const valvesGrid = panel.querySelector('#hydro-valves-grid');
    if (valvesGrid) {
      valvesGrid.innerHTML = this.valveLabels.map((lbl, idx) => `
        <div class="hydro-valve-card">
          <span style="font-size:0.75rem; color:${this.valveColors[idx]}; font-weight:bold;">${lbl}</span>
          <div style="font-size:1.1rem; color:#fff; font-weight:bold; margin:4px 0;">${this.valves[idx]} PSI</div>
          <div style="display:flex; gap:8px;">
            <button class="valve-knob-btn" onclick="window.room2HydroModule.adjustValve(${idx}, -10)">-</button>
            <button class="valve-knob-btn" onclick="window.room2HydroModule.adjustValve(${idx}, 10)">+</button>
          </div>
        </div>
      `).join('');
    }

    const pumpIndicator = panel.querySelector('#hydro-pump-status');
    if (pumpIndicator) {
      const isReady = this.drainPumpActive && this.hydraulicLockPsi <= 15;
      pumpIndicator.innerText = this.drainPumpActive
        ? `DRAIN PUMP: ACTIVE [SEAL: ${this.hydraulicLockPsi} PSI - ${isReady ? 'EQUALIZED ✓' : 'PURGING...'}]`
        : `DRAIN PUMP: OFFLINE [SEAL: ${this.hydraulicLockPsi} PSI - AWAITING INTEL]`;
      pumpIndicator.style.color = isReady ? '#00ff88' : (this.drainPumpActive ? '#f5d76e' : '#ff3344');
    }

    const wheelBtn = panel.querySelector('#btn-sub-wheel-action');
    if (wheelBtn) {
      if (this.disarmed) {
        wheelBtn.innerText = 'VAULT HATCH FULLY OPEN (UNLOCKED)';
        wheelBtn.classList.add('ready');
        wheelBtn.disabled = true;
      } else if (this.drainPumpActive && this.hydraulicLockPsi <= 15) {
        wheelBtn.innerText = '⚓ ROTATE SUBMARINE VAULT WHEEL (SEAL PURGED ✓)';
        wheelBtn.classList.add('ready');
        wheelBtn.disabled = false;
      } else {
        wheelBtn.innerText = `ROTATE SUBMARINE VAULT WHEEL (LOCKED: ${this.hydraulicLockPsi} PSI)`;
        wheelBtn.classList.remove('ready');
        wheelBtn.disabled = false;
      }
    }
  }
}

window.Room2HydroModule = Room2HydroModule;
window.room2HydroModule = new Room2HydroModule();
