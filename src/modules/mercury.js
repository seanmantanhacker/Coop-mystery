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
    this.target = { alpha: 91, beta: 61, gamma: 28 };
    this.tolerance = 4;
    this.solved = false;
    this.settleTimer = null;
  }

  generate(seed = 1888) {
    const s = Math.abs(seed);
    this.temperature = 20.0 + (s % 30) * 0.1; // 20.0 - 23.0 C
    const thermalOffset = Math.round((this.temperature - 20.0) * 0.5);

    // Base Tria Prima: 90, 60, 30
    this.target = {
      alpha: 90 + thermalOffset,
      beta: 60 + Math.floor(thermalOffset / 2),
      gamma: 30 - Math.ceil(thermalOffset * 1.5)
    };

    // Scramble starting levels
    this.vials = {
      alpha: 55 + (s % 15),
      beta: 35 + ((s >> 2) % 15),
      gamma: 180 - (55 + (s % 15)) - (35 + ((s >> 2) % 15))
    };

    this.solved = false;
    this.updateDOM();
  }

  // Turn Valve: transfers fluid amount (drams) between tubes
  turnValve(valveId, delta = 5) {
    if (this.solved) return;

    if (valveId === 1) {
      // Transfer Alpha <-> Beta
      const amt = Math.min(delta, this.vials.beta);
      if (amt > 0 && this.vials.alpha + amt <= 120) {
        this.vials.alpha += amt;
        this.vials.beta -= amt;
      } else if (delta < 0 && this.vials.alpha >= Math.abs(delta)) {
        this.vials.alpha -= Math.abs(delta);
        this.vials.beta += Math.abs(delta);
      }
    } else if (valveId === 2) {
      // Transfer Beta <-> Gamma
      const amt = Math.min(delta, this.vials.gamma);
      if (amt > 0 && this.vials.beta + amt <= 100) {
        this.vials.beta += amt;
        this.vials.gamma -= amt;
      } else if (delta < 0 && this.vials.beta >= Math.abs(delta)) {
        this.vials.beta -= Math.abs(delta);
        this.vials.gamma += Math.abs(delta);
      }
    } else if (valveId === 3) {
      // Bypass Alpha <-> Gamma
      const amt = Math.min(delta, this.vials.gamma);
      if (amt > 0 && this.vials.alpha + amt <= 120) {
        this.vials.alpha += amt;
        this.vials.gamma -= amt;
      } else if (delta < 0 && this.vials.alpha >= Math.abs(delta)) {
        this.vials.alpha -= Math.abs(delta);
        this.vials.gamma += Math.abs(delta);
      }
    }

    if (window.audio) window.audio.playBeep(440, 0.05);
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

    if (vA) vA.innerText = `${this.vials.alpha} drams`;
    if (bA) bA.style.height = `${Math.min(100, (this.vials.alpha / 120) * 100)}%`;
    if (vB) vB.innerText = `${this.vials.beta} drams`;
    if (bB) bB.style.height = `${Math.min(100, (this.vials.beta / 100) * 100)}%`;
    if (vG) vG.innerText = `${this.vials.gamma} drams`;
    if (bG) bG.style.height = `${Math.min(100, (this.vials.gamma / 120) * 100)}%`;
  }

  checkEquilibrium() {
    const dAlpha = Math.abs(this.vials.alpha - this.target.alpha);
    const dBeta = Math.abs(this.vials.beta - this.target.beta);
    const dGamma = Math.abs(this.vials.gamma - this.target.gamma);

    if (dAlpha <= this.tolerance && dBeta <= this.tolerance && dGamma <= this.tolerance) {
      if (!this.settleTimer) {
        this.settleTimer = setTimeout(() => {
          this.solved = true;
          if (window.audio) window.audio.playSuccess();
          if (window.game) window.game.checkVictory();
        }, 1500);
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
