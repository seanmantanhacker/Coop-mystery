/**
 * OPERATION: ZERO HOUR - MAP 3: THE LOCKED MORGUE
 * MODULE 3: BIOMETRIC KEYPAD BYPASS
 * Standalone deterministic puzzle logic.
 */

class MorgueKeypadModule {
  constructor() {
    this.id = 'morgue_keypad';
    this.disarmed = false;
    this.solved = false;

    this.victimYearOfBirth = 1968;
    this.vitalWounds = 4;
    this.killerTier = 4;
    this.targetCode = '1988';
    this.enteredCode = '';
  }

  get victimBirthYear() {
    return this.victimYearOfBirth;
  }

  generate(seed = 12345, vitalCount, killerTier) {
    this.disarmed = false;
    this.solved = false;
    this.enteredCode = '';

    // Victim Year of Birth between 1952 and 1985
    this.victimYearOfBirth = 1955 + (Math.abs(seed) % 28);
    if (typeof vitalCount === 'object' && vitalCount !== null) {
      killerTier = vitalCount.killerTier;
      vitalCount = vitalCount.vitalWounds;
    }
    this.vitalWounds = vitalCount !== undefined ? vitalCount : (window.autopsyModule ? window.autopsyModule.vitalWoundCount : 4);
    this.killerTier = killerTier !== undefined ? killerTier : (window.autopsyModule && window.autopsyModule.suspects[window.autopsyModule.activeSuspectKey] ? window.autopsyModule.suspects[window.autopsyModule.activeSuspectKey].tier : 4);

    // Formula: [Victim's Year of Birth] - [Fatal Vital Wounds] * 5 + [Killer Access Tier] * 12
    const rawVal = this.victimYearOfBirth - (this.vitalWounds * 5) + (this.killerTier * 12);
    this.targetCode = String(rawVal).padStart(4, '0');
    console.log(`[Morgue Keypad] BirthYear: ${this.victimYearOfBirth}, VitalWounds: ${this.vitalWounds}, KillerTier: ${this.killerTier} => Target PIN: ${this.targetCode}`);
    this.updateHUD();
  }

  pressDigit(digit) {
    this.pressKey(digit);
  }

  pressKey(digit) {
    if (this.disarmed) return;
    if (this.enteredCode.length >= 4) return;

    this.enteredCode += String(digit);
    if (window.audio && window.audio.playKeyClick) window.audio.playKeyClick();
    this.updateHUD();
  }

  clear() {
    if (this.disarmed) return;
    this.enteredCode = '';
    if (window.audio && window.audio.playClick) window.audio.playClick();
    this.updateHUD();
  }

  submit() {
    if (this.disarmed) return { status: 'ALREADY_DISARMED' };
    if (this.enteredCode.length < 4) return { status: 'INCOMPLETE' };

    if (this.enteredCode === this.targetCode) {
      this.disarmed = true;
      this.solved = true;
      if (window.audio && window.audio.playDisarmed) window.audio.playDisarmed();
      if (window.game) {
        window.game.showToast('BIO-CONTAINMENT AIRLOCK UNLOCKED ✓', 'success');
        window.game.checkVictory();
      }
      this.updateHUD();
      return { status: 'DISARMED' };
    } else {
      if (window.audio && window.audio.playStrike) window.audio.playStrike();
      if (window.game) {
        window.game.addStrike();
        window.game.showToast('STRIKE: INVALID SECURITY PIN ACCESS DENIED!', 'error');
      }
      this.enteredCode = '';
      this.updateHUD();
      return { status: 'STRIKE' };
    }
  }

  updateHUD() {
    const hud = document.getElementById('morgue-keypad-inspect-hud') || document.getElementById('keypad-inspect-hud');
    if (!hud) return;

    const display = document.getElementById('morgue-keypad-readout');
    if (display) {
      if (this.disarmed) {
        display.innerText = `${this.targetCode} [GRANTED]`;
        display.className = 'keypad-screen glow-green';
      } else {
        const padded = this.enteredCode.padEnd(4, '_');
        display.innerText = padded.split('').join(' ');
        display.className = 'keypad-screen glow-yellow';
      }
    }

    const badge = document.getElementById('morgue-keypad-badge');
    if (badge) {
      if (this.disarmed) {
        badge.className = 'badge badge-success';
        badge.innerText = 'DOOR BOLT DISARMED ✓';
      } else {
        badge.className = 'badge badge-warning';
        badge.innerText = 'DOOR SECURED: PIN REQUIRED';
      }
    }
  }

  updateDOM() {
    this.updateHUD();
  }
}

window.MorgueKeypadModule = MorgueKeypadModule;
window.morgueKeypadModule = new MorgueKeypadModule();
