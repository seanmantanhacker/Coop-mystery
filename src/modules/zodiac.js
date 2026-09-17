/* ==========================================================================
   MODULE: ASTROLOGICAL ZODIAC RING ('THE ALCHEMIST'S STUDY')
   Three Concentric Rotating Brass Rings:
   - Outer: 12 Zodiac Houses
   - Middle: 7 Classical Planets
   - Inner: 4 Alchemical Elements
   ========================================================================== */

class ZodiacModule {
  constructor() {
    this.houses = [
      { name: 'Aries', symbol: '♈', ruler: 'Mars', invert: 'Venus', element: 'Fire' },
      { name: 'Taurus', symbol: '♉', ruler: 'Venus', invert: 'Mars', element: 'Earth' },
      { name: 'Gemini', symbol: '♊', ruler: 'Mercury', invert: 'Jupiter', element: 'Air' },
      { name: 'Cancer', symbol: '♋', ruler: 'Moon', invert: 'Saturn', element: 'Water' },
      { name: 'Leo', symbol: '♌', ruler: 'Sun', invert: 'Saturn', element: 'Fire' },
      { name: 'Virgo', symbol: '♍', ruler: 'Mercury', invert: 'Jupiter', element: 'Earth' },
      { name: 'Libra', symbol: '♎', ruler: 'Venus', invert: 'Mars', element: 'Air' },
      { name: 'Scorpio', symbol: '♏', ruler: 'Mars', invert: 'Sun', element: 'Water' },
      { name: 'Sagittarius', symbol: '♐', ruler: 'Jupiter', invert: 'Mercury', element: 'Fire' },
      { name: 'Capricorn', symbol: '♑', ruler: 'Saturn', invert: 'Moon', element: 'Earth' },
      { name: 'Aquarius', symbol: '♒', ruler: 'Saturn', invert: 'Sun', element: 'Air' },
      { name: 'Pisces', symbol: '♓', ruler: 'Jupiter', invert: 'Mercury', element: 'Water' }
    ];

    this.planets = [
      { name: 'Sun', symbol: '☉' },
      { name: 'Moon', symbol: '☽' },
      { name: 'Mercury', symbol: '☿' },
      { name: 'Venus', symbol: '♀' },
      { name: 'Mars', symbol: '♂' },
      { name: 'Jupiter', symbol: '♃' },
      { name: 'Saturn', symbol: '♄' }
    ];

    this.elements = [
      { name: 'Fire', symbol: '🜂' },
      { name: 'Water', symbol: '🜄' },
      { name: 'Air', symbol: '🜁' },
      { name: 'Earth', symbol: '🜃' }
    ];

    this.outerIndex = 0;
    this.middleIndex = 0;
    this.innerIndex = 0;

    this.targetHouseIdx = 7; // Scorpio
    this.targetPlanet = 'Sun';
    this.targetElement = 'Fire';
    this.isRetrograde = true;
    this.isPerigee = true;

    this.solved = false;
  }

  generate(seed = 1888) {
    const s = Math.abs(seed);
    this.targetHouseIdx = (s + 7) % 12;
    const targetHouse = this.houses[this.targetHouseIdx];

    this.isRetrograde = (s % 2 === 0);
    this.isPerigee = ((s >> 1) % 2 === 0);

    // Planet target
    this.targetPlanet = this.isRetrograde ? targetHouse.invert : targetHouse.ruler;

    // Element target (Perigee shifts Water -> Fire, Earth -> Air, etc.)
    let elem = targetHouse.element;
    if (this.isPerigee) {
      if (elem === 'Water') elem = 'Fire';
      else if (elem === 'Fire') elem = 'Air';
      else if (elem === 'Earth') elem = 'Water';
      else elem = 'Earth';
    }
    this.targetElement = elem;

    // Scramble starting positions
    this.outerIndex = (this.targetHouseIdx + 4) % 12;
    this.middleIndex = 2;
    this.innerIndex = 1;
    this.solved = false;
    this.updateDOM();
  }

  rotateOuter(dir = 1) {
    if (this.solved) return;
    this.outerIndex = (this.outerIndex + dir + 12) % 12;
    if (window.audio) window.audio.playClick();
    this.updateDOM();
    this.checkSolved();
  }

  rotateMiddle(dir = 1) {
    if (this.solved) return;
    this.middleIndex = (this.middleIndex + dir + 7) % 7;
    if (window.audio) window.audio.playClick();
    this.updateDOM();
    this.checkSolved();
  }

  rotateInner(dir = 1) {
    if (this.solved) return;
    this.innerIndex = (this.innerIndex + dir + 4) % 4;
    if (window.audio) window.audio.playClick();
    this.updateDOM();
    this.checkSolved();
  }

  updateDOM() {
    const oEl = document.getElementById('zodiac-outer-readout');
    const mEl = document.getElementById('zodiac-middle-readout');
    const iEl = document.getElementById('zodiac-inner-readout');

    if (oEl) oEl.innerText = `${this.houses[this.outerIndex].symbol} ${this.houses[this.outerIndex].name}`;
    if (mEl) mEl.innerText = `${this.planets[this.middleIndex].symbol} ${this.planets[this.middleIndex].name}`;
    if (iEl) iEl.innerText = `${this.elements[this.innerIndex].symbol} ${this.elements[this.innerIndex].name}`;
  }

  checkSolved() {
    const curHouse = this.houses[this.outerIndex];
    const curPlanet = this.planets[this.middleIndex];
    const curElement = this.elements[this.innerIndex];

    const matchOuter = (this.outerIndex === this.targetHouseIdx);
    const matchMiddle = (curPlanet.name === this.targetPlanet);
    const matchInner = (curElement.name === this.targetElement);

    if (matchOuter && matchMiddle && matchInner) {
      this.solved = true;
      if (window.audio) window.audio.playSuccess();
      if (window.game) window.game.checkVictory();
      return true;
    }
    return false;
  }

  getCurrentState() {
    return {
      outer: this.houses[this.outerIndex],
      middle: this.planets[this.middleIndex],
      inner: this.elements[this.innerIndex],
      targetHouse: this.houses[this.targetHouseIdx],
      targetPlanet: this.targetPlanet,
      targetElement: this.targetElement,
      isRetrograde: this.isRetrograde,
      isPerigee: this.isPerigee,
      solved: this.solved
    };
  }
}

window.zodiacModule = new ZodiacModule();
