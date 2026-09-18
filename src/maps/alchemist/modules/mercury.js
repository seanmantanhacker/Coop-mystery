/* ==========================================================================
   MODULE: MERCURY VIAL LEVELER ('THE ALCHEMIST'S STUDY')
   Three Glass Manometer Tubes with Quicksilver Meniscus & Thumb Valves
   ========================================================================== */

class MercuryModule {
  constructor() {
    this.vials = {
      alpha: 60, // Sulfur (target ~90)
      beta: 40,  // Mercury (target ~60)
      gamma: 80  // Salt (target ~30)
    };

    this.temperature = 21.4; // Celsius (read by Analyst)
    this.vaporPressure = 0.85; // bar
    this.target = { alpha: 90, beta: 60, gamma: 30 };
    this.tolerance = 5;
    this.solved = false;
    this.settleTimer = null;
  }

  generate(seed = 1888) {
    const s = Math.abs(seed);
    this.temperature = 20.0 + (s % 30) * 0.1; // 20.0 - 23.0 C
    const thermalOffset = Math.round((this.temperature - 20.0) * 0.5);

    // Base Tria Prima: 90, 60, 30 with thermal correction (conserving total 180 drams)
    const targetAlpha = 90 + thermalOffset;
    const targetBeta = 60 + Math.floor(thermalOffset / 2);
    const targetGamma = 180 - targetAlpha - targetBeta;

    this.target = {
      alpha: targetAlpha,
      beta: targetBeta,
      gamma: targetGamma
    };

    // Scramble starting levels (sum is always 180 drams)
    const initA = 55 + (s % 15);
    const initB = 35 + ((s >> 2) % 15);
    const initG = 180 - initA - initB;

    this.vials = {
      alpha: initA,
      beta: initB,
      gamma: initG
    };

    this.solved = false;
    if (this.settleTimer) {
      clearTimeout(this.settleTimer);
      this.settleTimer = null;
    }
    this.updateDOM();
  }

  // Safe fluid transfer helper that guarantees total volume conservation (180 drams)
  transferFluid(fromKey, toKey, amount, maxToCap) {
    const fromVal = this.vials[fromKey];
    const toVal = this.vials[toKey];
    const maxTransfer = Math.min(amount, fromVal, Math.max(0, maxToCap - toVal));
    if (maxTransfer > 0) {
      this.vials[fromKey] -= maxTransfer;
      this.vials[toKey] += maxTransfer;
      return true;
    }
    return false;
  }

  // Turn Valve: transfers fluid amount (drams) between tubes
  turnValve(valveId, delta = 5) {
    if (this.solved) return;

    const absAmt = Math.abs(delta);
    let moved = false;

    if (valveId === 1) {
      // Valve 1: Alpha <-> Beta (Alpha max 120, Beta max 100)
      if (delta > 0) {
        // Alpha <- Beta
        moved = this.transferFluid('beta', 'alpha', absAmt, 120);
      } else {
        // Alpha -> Beta
        moved = this.transferFluid('alpha', 'beta', absAmt, 100);
      }
    } else if (valveId === 2) {
      // Valve 2: Beta <-> Gamma (Beta max 100, Gamma max 100)
      if (delta > 0) {
        // Beta <- Gamma
        moved = this.transferFluid('gamma', 'beta', absAmt, 100);
      } else {
        // Beta -> Gamma
        moved = this.transferFluid('beta', 'gamma', absAmt, 100);
      }
    } else if (valveId === 3) {
      // Valve 3: Alpha <-> Gamma Bypass (Alpha max 120, Gamma max 100)
      if (delta > 0) {
        // Alpha <- Gamma
        moved = this.transferFluid('gamma', 'alpha', absAmt, 120);
      } else {
        // Alpha -> Gamma
        moved = this.transferFluid('alpha', 'gamma', absAmt, 100);
      }
    }

    if (moved && window.audio && window.audio.playBeep) {
      window.audio.playBeep(440, 0.05);
    }
    this.updateDOM();
    this.checkEquilibrium();
  }

  updateDOM() {
    const vA = document.getElementById('mercury-val-alpha');
    const bA = document.getElementById('mercury-bar-alpha');
    const vB = document.getElementById('mercury-val-beta');
    const bB = document.getElementById('mercury-bar-beta');
    const vG = document.getElementById('mercury-val-gamma');
    const bG = document.getElementById('mercury-bar-gamma');
    const statusEl = document.getElementById('mercury-status');

    if (vA) vA.innerText = `${this.vials.alpha} drams`;
    if (bA) bA.style.height = `${Math.min(100, (this.vials.alpha / 120) * 100)}%`;
    if (vB) vB.innerText = `${this.vials.beta} drams`;
    if (bB) bB.style.height = `${Math.min(100, (this.vials.beta / 100) * 100)}%`;
    if (vG) vG.innerText = `${this.vials.gamma} drams`;
    if (bG) bG.style.height = `${Math.min(100, (this.vials.gamma / 120) * 100)}%`;

    if (statusEl) {
      if (this.solved) {
        statusEl.classList.remove('hidden');
        statusEl.innerText = 'HYDROSTATIC EQUILIBRIUM ACHIEVED ✓';
      } else {
        statusEl.classList.add('hidden');
      }
    }
  }

  checkEquilibrium() {
    const dAlpha = Math.abs(this.vials.alpha - this.target.alpha);
    const dBeta = Math.abs(this.vials.beta - this.target.beta);
    const dGamma = Math.abs(this.vials.gamma - this.target.gamma);

    if (dAlpha <= this.tolerance && dBeta <= this.tolerance && dGamma <= this.tolerance) {
      if (!this.settleTimer) {
        this.settleTimer = setTimeout(() => {
          this.solved = true;
          this.updateDOM();
          if (window.audio) window.audio.playSuccess();
          if (window.network && window.network.broadcast) {
            window.network.broadcast({ type: 'MODULE_SOLVED', module: 'mercury' });
          }
          if (window.game) {
            window.game.showToast('☿ QUICKSILVER MANOMETER: EQUILIBRIUM ACHIEVED!');
            window.game.checkVictory();
          }
        }, 1200);
      }
    } else {
      if (this.settleTimer) {
        clearTimeout(this.settleTimer);
        this.settleTimer = null;
      }
    }
  }

  getCurrentState() {
    return {
      vials: { ...this.vials },
      target: { ...this.target },
      temperature: this.temperature,
      vaporPressure: this.vaporPressure,
      solved: this.solved
    };
  }
}

window.mercuryModule = new MercuryModule();
