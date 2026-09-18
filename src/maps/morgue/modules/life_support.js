/**
 * OPERATION: ZERO HOUR - MAP 3: THE LOCKED MORGUE
 * MODULE 4: LIFE SUPPORT, CRYO-REFRIGERATION & VENT FLUSH
 * Standalone deterministic puzzle logic.
 */

class LifeSupportModule {
  constructor() {
    this.id = 'life_support';
    this.disarmed = false;
    this.solved = false;

    this.gasPpm = 45;
    this.targetPsi = 36.5;
    this.currentPsi = 48.0;
    this.cryoTemp = 2.8;
    this.isVentFlushed = false;
    this.isDamperLocked = false;
    this.powerActive = true;
  }

  generate(seed = 12345, params = {}) {
    this.disarmed = false;
    this.isVentFlushed = false;
    this.isDamperLocked = false;
    this.powerActive = true;

    // Target Pressure between 32.0 and 42.0 PSI
    this.targetPsi = 32.0 + ((Math.abs(seed + 11) % 21) * 0.5);
    this.currentPsi = this.targetPsi + 8.5;
    this.gasPpm = 40 + (Math.abs(seed) % 25);
    this.cryoTemp = 2.2 + ((Math.abs(seed) % 15) * 0.1);

    console.log(`[Life Support Module] Target Pressure: ${this.targetPsi.toFixed(1)} PSI | Baseline: ${this.currentPsi.toFixed(1)} PSI`);
    this.updateHUD();
  }

  remoteTriggerVentFlush() {
    this.isVentFlushed = true;
    this.currentPsi = this.targetPsi;
    this.gasPpm = Math.max(8, this.gasPpm - 30);

    if (window.audio && window.audio.playRadioTune) window.audio.playRadioTune();
    if (window.game) {
      window.game.showToast('[REMOTE DISPATCH] AIR DUCT VENT FLUSH EXECUTED!', 'info');
    }
    this.updateHUD();
    return { status: 'FLUSHED', psi: this.currentPsi, ppm: this.gasPpm };
  }

  remoteTriggerPowerReset() {
    this.powerActive = true;
    if (window.audio && window.audio.playClick) window.audio.playClick();
    if (window.game) {
      window.game.showToast('[REMOTE DISPATCH] EMERGENCY POWER GRID RESTORED!', 'info');
    }
    this.updateHUD();
    return { status: 'RESTORED' };
  }

  adjustDamperPsi(delta) {
    if (this.disarmed) return;
    this.currentPsi = Math.max(20.0, Math.min(60.0, parseFloat((this.currentPsi + delta).toFixed(1))));
    if (window.audio && window.audio.playClick) window.audio.playClick();
    this.updateHUD();
  }

  adjustPsi(delta) {
    this.adjustDamperPsi(delta);
  }

  pullDamperLever() {
    if (this.disarmed) return { status: 'ALREADY_DISARMED' };

    const psiDiff = Math.abs(this.currentPsi - this.targetPsi);
    const inTolerance = psiDiff <= 0.8;

    if (inTolerance) {
      this.isDamperLocked = true;
      this.disarmed = true;
      this.solved = true;
      if (window.audio && window.audio.playDisarmed) window.audio.playDisarmed();
      if (window.game) {
        window.game.showToast('LIFE SUPPORT & AIR DAMPER EQUALIZED ✓', 'success');
        window.game.checkVictory();
      }
      this.updateHUD();
      return { status: 'DISARMED' };
    } else {
      if (window.audio && window.audio.playStrike) window.audio.playStrike();
      if (window.game) {
        window.game.addStrike();
        window.game.showToast(`STRIKE: PRESSURE MISMATCH! (${this.currentPsi.toFixed(1)} PSI vs ${this.targetPsi.toFixed(1)} PSI)`, 'error');
      }
      this.updateHUD();
      return { status: 'STRIKE' };
    }
  }

  updateHUD() {
    const hud = document.getElementById('life-support-inspect-hud') || document.getElementById('lifesupport-inspect-hud');
    if (!hud) return;

    const psiReadout = document.getElementById('ls-current-psi');
    const targetReadout = document.getElementById('ls-target-psi');
    const ppmReadout = document.getElementById('ls-gas-ppm');
    const tempReadout = document.getElementById('ls-cryo-temp');

    if (psiReadout) {
      const match = Math.abs(this.currentPsi - this.targetPsi) <= 0.8;
      psiReadout.innerText = `${this.currentPsi.toFixed(1)} PSI`;
      psiReadout.className = match ? 'glow-green' : 'glow-yellow';
    }
    if (targetReadout) targetReadout.innerText = `${this.targetPsi.toFixed(1)} PSI`;
    if (ppmReadout) {
      ppmReadout.innerText = `${this.gasPpm} PPM`;
      ppmReadout.className = this.gasPpm > 30 ? 'glow-red' : 'glow-green';
    }
    if (tempReadout) tempReadout.innerText = `${this.cryoTemp.toFixed(1)}°C`;

    const badge = document.getElementById('ls-status-badge');
    if (badge) {
      if (this.disarmed) {
        badge.className = 'badge badge-success';
        badge.innerText = 'VENTILATION SECURED ✓';
      } else {
        badge.className = 'badge badge-warning';
        badge.innerText = 'AIR EXTRACTION ACTIVE';
      }
    }
  }

  updateDOM() {
    this.updateHUD();
  }
}

window.LifeSupportModule = LifeSupportModule;
window.lifeSupportModule = new LifeSupportModule();
