/**
 * OPERATION: ZERO HOUR - MAP 3: THE LOCKED MORGUE
 * MODULE 4: LIFE SUPPORT, CRYO-REFRIGERATION & VENT FLUSH
 * Standalone deterministic puzzle logic with active 3-way co-op coordination.
 */

const MORGUE_CLASSIFICATIONS = [
  { code: 'CLASS_A', name: 'CLASS A: NEUROTOXIN GAS (TABUN-VX)', deltaPsi: 2.0, desc: 'High-density organophosphate vapor layer (+2.0 PSI)' },
  { code: 'CLASS_B', name: 'CLASS B: RADIOLOGICAL PATHOGEN', deltaPsi: 5.0, desc: 'Positive-pressure bio-isolation containment (+5.0 PSI)' },
  { code: 'CLASS_C', name: 'CLASS C: HEMOTOXIC VOLATILE AGENT', deltaPsi: -3.0, desc: 'Negative-pressure rapid evacuation draft (-3.0 PSI)' },
  { code: 'CLASS_D', name: 'CLASS D: CRYOGENIC COOLANT RUPTURE', deltaPsi: -5.0, desc: 'Supercooled liquid nitrogen phase-displacement (-5.0 PSI)' }
];

class LifeSupportModule {
  constructor() {
    this.id = 'life_support';
    this.disarmed = false;
    this.solved = false;

    this.gasPpm = 45;
    this.basePsi = 35.0;
    this.classification = MORGUE_CLASSIFICATIONS[1];
    this.targetPsi = 40.0;
    this.currentPsi = 48.0;
    this.cryoTemp = 2.8;

    this.isVentFlushed = false;
    this.flushTimeRemaining = 0;
    this.flushTimer = null;
    this.isDamperLocked = false;
    this.powerActive = false; // Auxiliary grid starts tripped, requiring Intel remote reset
  }

  generate(seed = 12345, params = {}) {
    this.disarmed = false;
    this.solved = false;
    this.isDamperLocked = false;
    this.isVentFlushed = false;
    this.flushTimeRemaining = 0;
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }

    // Auxiliary power breaker starts tripped at mission start
    this.powerActive = false;

    // Pick deterministic classification from seed
    const classIdx = Math.abs(seed + 19) % MORGUE_CLASSIFICATIONS.length;
    this.classification = MORGUE_CLASSIFICATIONS[classIdx];

    // Base Pressure between 32.0 and 42.0 PSI (in 1.0 increments)
    this.basePsi = 32.0 + ((Math.abs(seed + 11) % 11) * 1.0);
    this.targetPsi = parseFloat((this.basePsi + this.classification.deltaPsi).toFixed(1));
    this.currentPsi = parseFloat((this.basePsi + 8.0).toFixed(1));
    this.gasPpm = 420 + ((Math.abs(seed) % 25) * 10);
    this.cryoTemp = 2.2 + ((Math.abs(seed) % 15) * 0.1);

    console.log(`[Life Support Module] Classification: ${this.classification.name} | Base PSI: ${this.basePsi.toFixed(1)} | Target PSI: ${this.targetPsi.toFixed(1)}`);
    this.updateHUD();
  }

  tripPower(reason = 'SECURITY SYSTEM BREAKER TRIPPED') {
    this.powerActive = false;
    if (window.audio && window.audio.playStrike) window.audio.playStrike();
    if (window.game) {
      window.game.showToast(`⚡ [POWER GRID TRIPPED] ${reason}! REQUEST INTEL POWER RESET!`, 'error');
    }
    this.updateHUD();
    if (window.morgueKeypadModule) window.morgueKeypadModule.updateHUD();
    if (window.MorgueIntelView) window.MorgueIntelView.updateDossierData();
  }

  remoteTriggerPowerReset() {
    this.powerActive = true;
    if (window.audio && window.audio.playClick) window.audio.playClick();
    if (window.game) {
      window.game.showToast('⚡ [REMOTE DISPATCH] EMERGENCY AUXILIARY POWER RESTORED!', 'success');
    }
    this.updateHUD();
    if (window.morgueKeypadModule) window.morgueKeypadModule.updateHUD();
    if (window.MorgueIntelView) window.MorgueIntelView.updateDossierData();
    return { status: 'RESTORED' };
  }

  remoteTriggerVentFlush() {
    this.isVentFlushed = true;
    this.flushTimeRemaining = 15;
    this.gasPpm = Math.max(50, this.gasPpm - 150);

    if (this.flushTimer) clearInterval(this.flushTimer);
    this.flushTimer = setInterval(() => {
      this.flushTimeRemaining--;
      if (this.flushTimeRemaining <= 0) {
        clearInterval(this.flushTimer);
        this.flushTimer = null;
        this.isVentFlushed = false;
        this.flushTimeRemaining = 0;
        if (window.game && !this.disarmed) {
          window.game.showToast('💨 VENT FLUSH WINDOW EXPIRED! AIR DAMPER RE-SEALED.', 'warning');
        }
      }
      this.updateHUD();
      if (window.MorgueIntelView) window.MorgueIntelView.updateDossierData();
    }, 1000);

    if (window.audio && window.audio.playRadioTune) window.audio.playRadioTune();
    if (window.game) {
      window.game.showToast('💨 [REMOTE DISPATCH] VENT FLUSH ACTIVATED (15s INTERLOCK WINDOW)!', 'info');
    }
    this.updateHUD();
    if (window.MorgueIntelView) window.MorgueIntelView.updateDossierData();
    return { status: 'FLUSHED', psi: this.currentPsi, ppm: this.gasPpm, windowSeconds: 15 };
  }

  adjustDamperPsi(delta) {
    if (this.disarmed) return;
    if (!this.powerActive) {
      if (window.audio && window.audio.playStrike) window.audio.playStrike();
      if (window.game) {
        window.game.showToast('⚡ AUXILIARY POWER OFFLINE! Request Intel remote Power Reset to operate pneumatic pumps.', 'error');
      }
      return;
    }
    this.currentPsi = Math.max(20.0, Math.min(60.0, parseFloat((this.currentPsi + delta).toFixed(1))));
    if (window.audio && window.audio.playClick) window.audio.playClick();
    this.updateHUD();
  }

  adjustPsi(delta) {
    this.adjustDamperPsi(delta);
  }

  pullDamperLever() {
    if (this.disarmed) return { status: 'ALREADY_DISARMED' };

    if (!this.powerActive) {
      if (window.audio && window.audio.playStrike) window.audio.playStrike();
      if (window.game) {
        window.game.showToast('⚡ AUXILIARY POWER OFFLINE! Damper solenoids unpowered. Request Intel Power Reset!', 'error');
      }
      return { status: 'POWER_OFFLINE' };
    }

    if (!this.isVentFlushed) {
      if (window.audio && window.audio.playStrike) window.audio.playStrike();
      if (window.game) {
        window.game.showToast('⚠️ DAMPER INTERLOCK SEALED! Request Intel [VENT_FLUSH] to open exhaust window!', 'warning');
      }
      return { status: 'VENT_NOT_FLUSHED' };
    }

    const psiDiff = Math.abs(this.currentPsi - this.targetPsi);
    const inTolerance = psiDiff <= 0.8;

    if (inTolerance) {
      this.isDamperLocked = true;
      this.disarmed = true;
      this.solved = true;
      if (this.flushTimer) {
        clearInterval(this.flushTimer);
        this.flushTimer = null;
      }
      if (window.audio && window.audio.playDisarmed) window.audio.playDisarmed();
      if (window.game) {
        window.game.showToast('LIFE SUPPORT & AIR DAMPER EQUALIZED ✓', 'success');
        if (window.game.notifyModuleSolved) window.game.notifyModuleSolved('lifeSupport');
        else window.game.checkVictory();
      }
      this.updateHUD();
      if (window.MorgueIntelView) window.MorgueIntelView.updateDossierData();
      return { status: 'DISARMED' };
    } else {
      if (window.audio && window.audio.playStrike) window.audio.playStrike();
      if (window.game) {
        window.game.addStrike();
        window.game.showToast(`STRIKE: PRESSURE MISMATCH! (${this.currentPsi.toFixed(1)} PSI vs Target ${this.targetPsi.toFixed(1)} PSI). POWER GRID TRIPPED!`, 'error');
      }
      // Overpressure trips the breaker!
      this.powerActive = false;
      this.updateHUD();
      if (window.MorgueIntelView) window.MorgueIntelView.updateDossierData();
      return { status: 'STRIKE' };
    }
  }

  updateHUD() {
    const hud = document.getElementById('life-support-inspect-hud') || document.getElementById('lifesupport-inspect-hud');
    if (!hud) return;

    const psiReadout = document.getElementById('ls-current-psi');
    const baseReadout = document.getElementById('ls-base-psi');
    const targetReadout = document.getElementById('ls-target-psi');
    const ppmReadout = document.getElementById('ls-gas-ppm');
    const tempReadout = document.getElementById('ls-cryo-temp');

    if (psiReadout) {
      const match = Math.abs(this.currentPsi - this.targetPsi) <= 0.8;
      psiReadout.innerText = `${this.currentPsi.toFixed(1)} PSI`;
      psiReadout.className = match ? 'glow-green' : 'glow-yellow';
    }

    if (baseReadout) {
      baseReadout.innerText = `${this.basePsi.toFixed(1)} PSI`;
    }

    if (targetReadout) {
      if (this.disarmed) {
        targetReadout.innerText = `${this.targetPsi.toFixed(1)} PSI (LOCKED)`;
        targetReadout.className = 'glow-green';
      } else {
        targetReadout.innerText = `[INTEL CLASS REQ]`;
        targetReadout.className = 'glow-yellow';
      }
    }

    if (ppmReadout) {
      ppmReadout.innerText = `${this.gasPpm} PPM`;
      ppmReadout.className = this.gasPpm > 200 ? 'glow-red' : 'glow-green';
    }
    if (tempReadout) tempReadout.innerText = `${this.cryoTemp.toFixed(1)}°C`;

    // Power Alert Banner
    const powerAlert = document.getElementById('ls-power-alert');
    if (powerAlert) {
      if (!this.powerActive) {
        powerAlert.classList.remove('hidden');
        powerAlert.style.display = 'block';
      } else {
        powerAlert.classList.add('hidden');
        powerAlert.style.display = 'none';
      }
    }

    // Vent Flush Timer Banner
    const flushBanner = document.getElementById('ls-flush-timer-banner');
    const flushSeconds = document.getElementById('ls-flush-seconds');
    if (flushBanner && flushSeconds) {
      if (this.isVentFlushed && this.flushTimeRemaining > 0) {
        flushBanner.style.display = 'block';
        flushSeconds.innerText = String(this.flushTimeRemaining);
      } else {
        flushBanner.style.display = 'none';
      }
    }

    // Status Badge
    const badge = document.getElementById('ls-status-badge');
    if (badge) {
      if (this.disarmed) {
        badge.className = 'badge badge-success';
        badge.innerText = 'VENTILATION SECURED ✓';
      } else if (!this.powerActive) {
        badge.className = 'badge badge-error';
        badge.innerText = '⚡ AUXILIARY POWER OFFLINE (BREAKER TRIPPED)';
      } else if (this.isVentFlushed) {
        badge.className = 'badge badge-success';
        badge.innerText = `💨 EXHAUST FLUSH ACTIVE (${this.flushTimeRemaining}s)`;
      } else {
        badge.className = 'badge badge-warning';
        badge.innerText = 'AIR EXTRACTION ACTIVE (DAMPER SEALED)';
      }
    }

    // Control buttons state
    const decBtn = document.getElementById('ls-btn-psi-dec');
    const incBtn = document.getElementById('ls-btn-psi-inc');
    if (decBtn) decBtn.disabled = !this.powerActive || this.disarmed;
    if (incBtn) incBtn.disabled = !this.powerActive || this.disarmed;

    const leverBtn = document.getElementById('btn-pull-damper-lever');
    if (leverBtn) {
      leverBtn.disabled = this.disarmed;
      if (this.disarmed) {
        leverBtn.innerText = '✓ MECHANICAL DAMPER SECURED & LOCKED';
        leverBtn.className = 'btn btn-secondary';
      } else if (!this.powerActive) {
        leverBtn.innerText = '⚡ [POWER OFFLINE] SOLENOIDS UNPOWERED';
        leverBtn.className = 'btn btn-ctrl';
      } else if (this.isVentFlushed) {
        leverBtn.innerText = `⚠️ PULL DAMPER NOW! (${this.flushTimeRemaining}s REMAINING)`;
        leverBtn.className = 'btn btn-vent-damper btn-flush-active-pulse';
      } else {
        leverBtn.innerText = '⚠️ PULL EMERGENCY MECHANICAL AIR DAMPER (FLUSH REQUIRED)';
        leverBtn.className = 'btn btn-vent-damper';
      }
    }
  }

  updateDOM() {
    this.updateHUD();
  }
}

window.MORGUE_CLASSIFICATIONS = MORGUE_CLASSIFICATIONS;
window.LifeSupportModule = LifeSupportModule;
window.lifeSupportModule = new LifeSupportModule();
