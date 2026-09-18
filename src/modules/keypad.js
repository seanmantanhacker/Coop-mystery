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
    this.columnLetter = 'A';
    this.frkLit = false;
  }

  generate(seed, frkLit = false) {
    this.frkLit = !!frkLit;
    // 4 Columns directly matching Section 02 of Field Manual
    const columns = [
      ['Ψ', 'Ϙ', 'Ж', 'Ω', 'Ѭ', 'ϗ'], // Column A
      ['ϗ', 'Ψ', 'Ѭ', 'Ҩ', '☆', 'Ϙ'], // Column B
      ['©', 'Ж', 'Ҩ', 'Ѭ', 'Ϙ', '★'], // Column C
      ['Ω', '©', '★', 'ϗ', 'Ψ', '☆']  // Column D
    ];
    const columnLetters = ['A', 'B', 'C', 'D'];

    const colIdx = Math.abs(seed) % columns.length;
    this.columnLetter = columnLetters[colIdx];
    this.selectedColumn = columns[colIdx];

    // Find all 4-subsets of this column that appear ONLY in this column
    const all4Subsets = [];
    const col = this.selectedColumn;
    for (let i = 0; i < col.length; i++) {
      for (let j = i + 1; j < col.length; j++) {
        for (let k = j + 1; k < col.length; k++) {
          for (let l = k + 1; l < col.length; l++) {
            const subset = [col[i], col[j], col[k], col[l]];
            const matchCount = columns.filter(c => subset.every(s => c.includes(s))).length;
            if (matchCount === 1) {
              all4Subsets.push(subset);
            }
          }
        }
      }
    }

    // Pick one valid 4-symbol subset
    const chosenSubset = all4Subsets.length > 0
      ? all4Subsets[Math.abs(seed + 3) % all4Subsets.length]
      : col.slice(0, 4);

    // Correct order:
    // Normal: top-to-bottom as found in manual column (which chosenSubset already is)
    // If FRK Lit (Sheet 05): bottom-to-top (inverted!)
    let order = [...chosenSubset];
    if (this.frkLit) {
      order.reverse();
    }
    this.correctOrder = order;

    // Shuffle buttons for physical 2x2 keypad arrangement
    const shuffled = [...chosenSubset];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = (Math.abs(seed * 19 + i * 7)) % (i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    this.buttons = shuffled;
    this.pressSequence = [];
    this.disarmed = false;

    console.log(`[Keypad Module] Generated from Column ${this.columnLetter} (FRK lit: ${this.frkLit})`);
    console.log('[Keypad Module] Physical Buttons:', this.buttons);
    console.log('[Keypad Module] Solution Order:', this.correctOrder);
  }

  pressButton(symbol) {
    if (this.disarmed) return { status: 'ALREADY_DISARMED' };

    if (window.audio) window.audio.playClick();
    const expectedSymbol = this.correctOrder[this.pressSequence.length];

    if (symbol === expectedSymbol) {
      this.pressSequence.push(symbol);
      if (this.pressSequence.length === 4) {
        this.disarmed = true;
        if (window.audio) window.audio.playDisarmed();
        return { status: 'DISARMED' };
      }
      return { status: 'PROGRESS', count: this.pressSequence.length };
    } else {
      this.pressSequence = []; // Reset sequence on mistake
      if (window.audio) window.audio.playStrike();
      return { status: 'STRIKE' };
    }
  }
}

window.keypadModule = new KeypadModule();
