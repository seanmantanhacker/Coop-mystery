/* ==========================================================================
   OPERATION: ZERO HOUR - MODULE 3: FREQUENCY JAMMER
   ========================================================================== */

class FrequencyModule {
  constructor() {
    this.id = 'frequency';
    this.disarmed = false;
    this.targetFreq = 142.5; // MHz
    this.currentFreq = 100.0;
  }

  generate(seed, carLit = false) {
    // Generate Target Frequency between 110.0 MHz and 190.0 MHz in 0.5 increments
    const steps = (seed % 160);
    this.targetFreq = parseFloat((110.0 + (steps * 0.5)).toFixed(1));
    this.currentFreq = carLit ? 142.5 : 100.0;

    // Ensure target frequency is not immediately unlocked if CAR baseline happens to match target
    if (Math.abs(this.currentFreq - this.targetFreq) <= 0.5) {
      this.targetFreq = parseFloat((this.targetFreq >= 180.0 ? this.targetFreq - 15.0 : this.targetFreq + 15.0).toFixed(1));
    }

    this.disarmed = false;
    console.log(`[Frequency Module] Target: ${this.targetFreq} MHz | Initial Baseline: ${this.currentFreq} MHz (CAR Lit: ${carLit})`);
  }

  tune(val) {
    this.currentFreq = parseFloat(val.toFixed(1));
    return this.isSignalLocked();
  }

  isSignalLocked() {
    return Math.abs(this.currentFreq - this.targetFreq) <= 0.5;
  }

  confirmTune() {
    if (this.disarmed) return { status: 'ALREADY_DISARMED' };

    if (this.isSignalLocked()) {
      this.disarmed = true;
      audio.playDisarmed();
      return { status: 'DISARMED' };
    } else {
      audio.playStrike();
      return { status: 'STRIKE' };
    }
  }
}

window.frequencyModule = new FrequencyModule();
