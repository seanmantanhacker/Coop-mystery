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

  generate(seed) {
    // Generate Target Frequency between 110.0 MHz and 190.0 MHz in 0.5 increments
    const steps = (seed % 160);
    this.targetFreq = parseFloat((110.0 + (steps * 0.5)).toFixed(1));
    this.currentFreq = 100.0;

    console.log('[Frequency Module] Target Freq:', this.targetFreq, 'MHz');
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
