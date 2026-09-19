/* ==========================================================================
   MODULE: MERCURY VIAL LEVELER ('THE ALCHEMIST'S STUDY')
   Three Glass Manometer Tubes with Quicksilver Meniscus & Precision Valves
   ========================================================================== */

class MercuryModule {
  constructor() {
    this.vials = {
      alpha: 60, // Sulfur
      beta: 40,  // Mercury
      gamma: 80  // Salt
    };

    this.temperature = 26.0; // Celsius (communicated by Intel Analyst)
    this.vaporPressure = 0.85; // bar
    this.opusName = 'OPUS AQUAE';
    this.baseRatio = { alpha: 45, beta: 95, gamma: 40 };
    this.target = { alpha: 51, beta: 95, gamma: 34 };
    this.tolerance = 2; // Strict tolerance: prevents accidental 90:60:30 solves
    this.pulseRate = 10; // Default Coarse: 10 drams, Fine: 1 dram
    this.solved = false;
    this.settleTimer = null;
    this.purityGrade = 'GRADE_A';
  }

  generate(seed = 1888, purityGrade = 'GRADE_A') {
    const s = Math.abs(seed);
    this.purityGrade = purityGrade;

    // 1. Dynamic Ruling Opus based on Zodiac House Index
    const zod = window.zodiacModule;
    const houseIdx = zod ? zod.targetHouseIdx : (s % 12);
    
    // Fire / Air: Aries(0), Gemini(2), Leo(4), Libra(6), Sag(8), Aqu(10)
    // Water: Cancer(3), Scorpio(7), Pisces(11)
    // Earth: Taurus(1), Virgo(5), Cap(9)
    let opusName = 'OPUS IGNIS';
    let baseRatio = { alpha: 85, beta: 55, gamma: 40 };

    if ([3, 7, 11].includes(houseIdx)) {
      opusName = 'OPUS AQUAE';
      baseRatio = { alpha: 45, beta: 95, gamma: 40 };
    } else if ([1, 5, 9].includes(houseIdx)) {
      opusName = 'OPUS TERRAE';
      baseRatio = { alpha: 45, beta: 55, gamma: 80 };
    }

    this.opusName = opusName;
    this.baseRatio = baseRatio;

    // 2. Ambient Laboratory Temperature: 14.0°C - 34.0°C (Baseline: 20.0°C)
    this.temperature = 14.0 + (s % 21) * 1.0; 
    const thermalOffset = Math.round(this.temperature - 20.0); // e.g. -6 to +14 drams

    // 3. Quintessence Purity Grade (Intel Ephemeris Requirement):
    // GRADE_A: Mercurial Focus (+5 to Beta, -5 to Gamma)
    // GRADE_B: Sulfuric Bias (+5 to Alpha, -5 to Beta)
    let purityAlpha = 0;
    let purityBeta = 0;
    if (this.purityGrade === 'GRADE_A') {
      purityBeta = 5;
    } else if (this.purityGrade === 'GRADE_B') {
      purityAlpha = 5;
      purityBeta = -5;
    }

    // 4. Thermal & Purity Equilibrium (Total strictly conserved at 180 drams)
    const targetAlpha = baseRatio.alpha + thermalOffset + purityAlpha;
    const targetBeta = baseRatio.beta + purityBeta;
    const targetGamma = 180 - targetAlpha - targetBeta;

    this.target = {
      alpha: targetAlpha,
      beta: targetBeta,
      gamma: targetGamma
    };

    // Scramble starting levels (sum is always 180 drams)
    const initA = 50 + (s % 25);
    const initB = 30 + ((s >> 2) % 25);
    const initG = 180 - initA - initB;

    this.vials = {
      alpha: initA,
      beta: initB,
      gamma: initG
    };

    this.tolerance = 2; // Strict ±2 drams
    this.pulseRate = 10;
    this.solved = false;
    if (this.settleTimer) {
      clearTimeout(this.settleTimer);
      this.settleTimer = null;
    }
    this.updateDOM();
  }

  setPrecision(rate) {
    this.pulseRate = rate;
    const btnCoarse = document.getElementById('btn-mercury-coarse');
    const btnFine = document.getElementById('btn-mercury-fine');
    if (btnCoarse && btnFine) {
      if (rate >= 5) {
        btnCoarse.classList.add('active');
        btnFine.classList.remove('active');
      } else {
        btnCoarse.classList.remove('active');
        btnFine.classList.add('active');
      }
    }
    if (window.audio && window.audio.playClick) {
      window.audio.playClick();
    }
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

  // Turn Valve: transfers fluid based on current pulse rate (Coarse 10 / Fine 1)
  turnValve(valveId, direction = 1) {
    if (this.solved) return;

    const absAmt = Math.abs(direction) > 1 ? Math.abs(direction) : this.pulseRate;
    const dir = direction >= 0 ? 1 : -1;
    let moved = false;

    if (valveId === 1) {
      // Valve 1: Alpha <-> Beta (Alpha max 140, Beta max 120)
      if (dir > 0) {
        // Alpha <- Beta
        moved = this.transferFluid('beta', 'alpha', absAmt, 140);
      } else {
        // Alpha -> Beta
        moved = this.transferFluid('alpha', 'beta', absAmt, 120);
      }
    } else if (valveId === 2) {
      // Valve 2: Beta <-> Gamma (Beta max 120, Gamma max 120)
      if (dir > 0) {
        // Beta <- Gamma
        moved = this.transferFluid('gamma', 'beta', absAmt, 120);
      } else {
        // Beta -> Gamma
        moved = this.transferFluid('beta', 'gamma', absAmt, 120);
      }
    } else if (valveId === 3) {
      // Valve 3: Alpha <-> Gamma Bypass (Alpha max 140, Gamma max 120)
      if (dir > 0) {
        // Alpha <- Gamma
        moved = this.transferFluid('gamma', 'alpha', absAmt, 140);
      } else {
        // Alpha -> Gamma
        moved = this.transferFluid('alpha', 'gamma', absAmt, 120);
      }
    }

    if (moved && window.audio && window.audio.playBeep) {
      window.audio.playBeep(this.pulseRate === 1 ? 520 : 440, 0.04);
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
    if (bA) bA.style.height = `${Math.min(100, (this.vials.alpha / 140) * 100)}%`;
    if (vB) vB.innerText = `${this.vials.beta} drams`;
    if (bB) bB.style.height = `${Math.min(100, (this.vials.beta / 120) * 100)}%`;
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
      baseRatio: { ...this.baseRatio },
      opusName: this.opusName,
      temperature: this.temperature,
      vaporPressure: this.vaporPressure,
      solved: this.solved
    };
  }
}

window.mercuryModule = new MercuryModule();
