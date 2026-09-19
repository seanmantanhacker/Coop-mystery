/* ==========================================================================
   OPERATION: ZERO HOUR - MODULE 1: COLOR WIRES
   ========================================================================== */

class WiresModule {
  constructor() {
    this.id = 'wires';
    this.disarmed = false;
    this.wires = [];
    this.correctWireIndex = -1;
  }

  generate(seed, serialNumber, defconLevel = 3) {
    this.defconLevel = defconLevel;
    const colors = ['red', 'blue', 'yellow', 'black', 'white'];
    const wireCount = (seed % 2 === 0) ? 4 : 5;
    
    this.wires = [];
    let tempSeed = seed;
    for (let i = 0; i < wireCount; i++) {
      const colIdx = tempSeed % colors.length;
      this.wires.push(colors[colIdx]);
      tempSeed = Math.floor(tempSeed / 3) + i + 1;
    }

    // Determine correct wire index based on serial number, DEFCON status & manual rules
    const lastDigitChar = serialNumber ? serialNumber.match(/\d/g) : null;
    const lastDigit = lastDigitChar ? parseInt(lastDigitChar[lastDigitChar.length - 1]) : 0;
    const isOdd = lastDigit % 2 !== 0;

    const redCount = this.wires.filter(w => w === 'red').length;
    const blueCount = this.wires.filter(w => w === 'blue').length;
    const yellowCount = this.wires.filter(w => w === 'yellow').length;
    const blackCount = this.wires.filter(w => w === 'black').length;

    if (this.defconLevel === 2) {
      // DEFCON 2: Emergency Protocol
      if (wireCount === 4) {
        this.correctWireIndex = (redCount > 1) ? 0 : 3;
      } else {
        this.correctWireIndex = (this.wires[4] === 'black') ? 1 : 2;
      }
    } else {
      // DEFCON 3: Standard Protocol
      if (wireCount === 4) {
        if (redCount > 1 && isOdd) {
          this.correctWireIndex = this.wires.lastIndexOf('red');
        } else if (this.wires[3] === 'yellow' && redCount === 0) {
          this.correctWireIndex = 0;
        } else if (blueCount === 1) {
          this.correctWireIndex = 0;
        } else if (yellowCount > 1) {
          this.correctWireIndex = 3;
        } else {
          this.correctWireIndex = 1;
        }
      } else { // 5 wires
        if (this.wires[4] === 'black' && !isOdd) {
          this.correctWireIndex = 3;
        } else if (redCount === 1 && yellowCount > 1) {
          this.correctWireIndex = 0;
        } else if (blackCount === 0) {
          this.correctWireIndex = 1;
        } else {
          this.correctWireIndex = 0;
        }
      }
    }

    console.log(`[Wires Module] DEFCON: ${this.defconLevel} | Colors:`, this.wires, 'Correct Wire Index:', this.correctWireIndex);
  }

  cutWire(index) {
    if (this.disarmed) return { status: 'ALREADY_DISARMED' };
    
    if (index === this.correctWireIndex) {
      this.disarmed = true;
      if (typeof audio !== 'undefined' && audio.playWireCut) audio.playWireCut();
      if (typeof audio !== 'undefined' && audio.playDisarmed) audio.playDisarmed();
      if (window.game && window.game.notifyModuleSolved) {
        window.game.notifyModuleSolved('wires');
      }
      return { status: 'DISARMED' };
    } else {
      audio.playWireCut();
      audio.playStrike();
      return { status: 'STRIKE' };
    }
  }
}

window.wiresModule = new WiresModule();
