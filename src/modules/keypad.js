/* ==========================================================================
   OPERATION: ZERO HOUR - MODULE 2: KEYPAD GLYPHS
   ========================================================================== */

class KeypadModule {
  constructor() {
    this.id = 'keypad';
    this.disarmed = false;
    this.selectedColumn = [];
    this.buttons = [];
    this.pressSequence = [];
    this.correctOrder = [];
  }

  generate(seed) {
    // 3 Columns from Manual
    const columns = [
      ['Ϙ', 'Ψ', 'Ϡ', 'ϰ'],
      ['ϰ', 'Ϙ', 'Ϟ', 'ϣ'],
      ['ϣ', 'Ψ', 'Ϡ', 'Ϟ']
    ];

    const colIdx = seed % columns.length;
    this.selectedColumn = columns[colIdx];
    
    // Copy column & shuffle for button display
    this.buttons = [...this.selectedColumn];
    if (seed % 2 === 0) {
      this.buttons.reverse();
    } else {
      const temp = this.buttons[1];
      this.buttons[1] = this.buttons[2];
      this.buttons[2] = temp;
    }

    // Correct order is top-to-bottom of selectedColumn
    this.correctOrder = [...this.selectedColumn];
    this.pressSequence = [];

    console.log('[Keypad Module] Buttons:', this.buttons, 'Correct Order:', this.correctOrder);
  }

  pressButton(symbol) {
    if (this.disarmed) return { status: 'ALREADY_DISARMED' };

    audio.playClick();
    const expectedSymbol = this.correctOrder[this.pressSequence.length];

    if (symbol === expectedSymbol) {
      this.pressSequence.push(symbol);
      if (this.pressSequence.length === 4) {
        this.disarmed = true;
        audio.playDisarmed();
        return { status: 'DISARMED' };
      }
      return { status: 'PROGRESS', count: this.pressSequence.length };
    } else {
      this.pressSequence = []; // Reset on mistake
      audio.playStrike();
      return { status: 'STRIKE' };
    }
  }
}

window.keypadModule = new KeypadModule();
