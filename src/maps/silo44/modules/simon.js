/* ==========================================================================
   OPERATION: ZERO HOUR - MODULE 4: SIMON SAYS LIGHTS
   ========================================================================== */

class SimonModule {
  constructor() {
    this.id = 'simon';
    this.disarmed = false;
    this.sequence = [];
    this.playerInput = [];
  }

  generate(seed, pulsePolarity = 'DIRECT') {
    this.pulsePolarity = pulsePolarity;
    const colors = ['red', 'blue', 'green', 'yellow'];
    this.sequence = [];
    let tempSeed = seed;
    for (let i = 0; i < 3; i++) {
      const idx = tempSeed % colors.length;
      this.sequence.push(colors[idx]);
      tempSeed = Math.floor(tempSeed / 2) + i + 1;
    }
    this.playerInput = [];
    console.log(`[Simon Module] Polarity: ${this.pulsePolarity} | Flashing Sequence:`, this.sequence);
  }

  getMappedColor(flashColor, serialNumber, strikeCount) {
    let hasVowel = /[AEIOU]/i.test(serialNumber);
    if (this.pulsePolarity === 'INVERTED') {
      hasVowel = !hasVowel;
    }
    const map = {
      vowel_0: { red: 'blue', blue: 'red', green: 'yellow', yellow: 'green' },
      vowel_1: { red: 'yellow', blue: 'green', green: 'blue', yellow: 'red' },
      no_vowel_0: { red: 'blue', blue: 'yellow', green: 'green', yellow: 'red' },
      no_vowel_1: { red: 'red', blue: 'blue', green: 'yellow', yellow: 'green' }
    };

    const key = (hasVowel ? 'vowel_' : 'no_vowel_') + (strikeCount > 0 ? '1' : '0');
    return map[key][flashColor] || flashColor;
  }

  pressColor(color, serialNumber, strikeCount) {
    if (this.disarmed) return { status: 'ALREADY_DISARMED' };

    audio.playClick();
    const expectedFlash = this.sequence[this.playerInput.length];
    const targetColor = this.getMappedColor(expectedFlash, serialNumber, strikeCount);

    if (color === targetColor) {
      this.playerInput.push(color);
      if (this.playerInput.length === this.sequence.length) {
        this.disarmed = true;
        audio.playDisarmed();
        return { status: 'DISARMED' };
      }
      return { status: 'PROGRESS' };
    } else {
      this.playerInput = [];
      audio.playStrike();
      return { status: 'STRIKE' };
    }
  }
}

window.simonModule = new SimonModule();
