/* ==========================================================================
   MODULE: PRISMATIC CRYSTAL LENS ('THE ALCHEMIST'S STUDY')
   Refraction of Arc-Lamp Light Beam through Rotating Crystal Prisms & Filters
   ========================================================================== */

class PrismModule {
  constructor() {
    this.targetElement = 'Fire'; // Linked to Zodiac module
    this.targetWavelength = 589;  // nm (Solar Amber for Fire)
    this.targetFilter = 'amber';

    this.prism1Angle = 20; // degrees
    this.prism2Angle = 35; // degrees
    this.activeFilter = 'none'; // 'none', 'amber', 'blue', 'green', 'red'

    this.currentWavelength = 410;
    this.lux = 280;
    this.tolerance = 8; // nm
    this.solved = false;
  }

  generate(seed = 1888) {
    const s = Math.abs(seed);
    const elements = ['Fire', 'Water', 'Air', 'Earth'];
    this.targetElement = elements[s % 4];

    if (this.targetElement === 'Fire') {
      this.targetWavelength = 589; // Amber
      this.targetFilter = 'amber';
    } else if (this.targetElement === 'Water') {
      this.targetWavelength = 450; // Blue
      this.targetFilter = 'blue';
    } else if (this.targetElement === 'Air') {
      this.targetWavelength = 530; // Emerald
      this.targetFilter = 'green';
    } else {
      this.targetWavelength = 650; // Red
      this.targetFilter = 'red';
    }

    // Scramble starting gimbals
    this.prism1Angle = 15 + (s % 25);
    this.prism2Angle = 25 + ((s >> 2) % 30);
    this.activeFilter = 'none';
    this.solved = false;
    this.recompute();
  }

  adjustPrism1(delta) {
    if (this.solved) return;
    this.prism1Angle = Math.max(0, Math.min(90, this.prism1Angle + delta));
    if (window.audio) window.audio.playBeep(520, 0.04);
    this.recompute();
  }

  adjustPrism2(delta) {
    if (this.solved) return;
    this.prism2Angle = Math.max(0, Math.min(90, this.prism2Angle + delta));
    if (window.audio) window.audio.playBeep(620, 0.04);
    this.recompute();
  }

  setFilter(filterName) {
    if (this.solved) return;
    this.activeFilter = filterName;
    if (window.audio) window.audio.playClick();
    this.recompute();
  }

  recompute() {
    // Dispersion physics calculation
    let base = 400 + (this.prism1Angle * 2.8) + (this.prism2Angle * 1.5);

    // Filter chromatic bandpass modifier
    if (this.activeFilter === 'amber') base = Math.min(610, Math.max(570, base + 20));
    else if (this.activeFilter === 'blue') base = Math.min(480, Math.max(430, base - 60));
    else if (this.activeFilter === 'green') base = Math.min(550, Math.max(510, base - 10));
    else if (this.activeFilter === 'red') base = Math.min(700, Math.max(630, base + 80));

    this.currentWavelength = Math.round(base);
    this.lux = Math.round(200 + Math.sin(this.prism1Angle * 0.05) * 80 + Math.cos(this.prism2Angle * 0.05) * 50);

    this.updateDOM();

    const diff = Math.abs(this.currentWavelength - this.targetWavelength);
    if (diff <= this.tolerance && this.activeFilter === this.targetFilter) {
      this.solved = true;
      if (window.audio) window.audio.playSuccess();
      if (window.game) window.game.checkVictory();
    }
  }

  updateDOM() {
    const p1El = document.getElementById('prism1-angle-val');
    const p2El = document.getElementById('prism2-angle-val');
    const waveEl = document.getElementById('prism-wavelength-val');

    if (p1El) p1El.innerText = `${this.prism1Angle}°`;
    if (p2El) p2El.innerText = `${this.prism2Angle}°`;
    if (waveEl) waveEl.innerText = `${this.currentWavelength} nm (${this.activeFilter.toUpperCase()})`;
  }

  getCurrentState() {
    return {
      prism1Angle: this.prism1Angle,
      prism2Angle: this.prism2Angle,
      activeFilter: this.activeFilter,
      currentWavelength: this.currentWavelength,
      targetWavelength: this.targetWavelength,
      targetElement: this.targetElement,
      lux: this.lux,
      solved: this.solved
    };
  }
}

window.prismModule = new PrismModule();
