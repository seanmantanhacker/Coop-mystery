/* ==========================================================================
   OPERATION: ZERO HOUR - MANUAL SPECIALIST: DETECTIVE DESK & VISUAL BINDER
   Supports Scenario 1: Silo 44 Technical Dossier
   Supports Scenario 2: Lord Blackwood's Hermetic Grimoire
   ========================================================================== */

class ManualViewEngine {
  constructor() {
    this.scenario = 'silo44'; // 'silo44' or 'alchemist'
    this.currentView = 'DESK_OVERVIEW'; // 'DESK_OVERVIEW', 'INSPECT_BINDER', 'INSPECT_BOARD'
    this.currentPage = 0;
    this.totalPages = 5;

    // Keyboard shortcut: Escape returns to Desk Overview
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (this.currentView !== 'DESK_OVERVIEW') {
          this.setView('DESK_OVERVIEW');
        }
      }
    });
  }

  init(scenario = 'silo44') {
    this.scenario = scenario;
    this.totalPages = (scenario === 'silo44') ? 5 : 4;
    this.currentPage = 0;
    this.renderTabs();
    this.renderPage(0);
    this.setView('DESK_OVERVIEW');
  }

  setScenario(scenario) {
    this.scenario = scenario;
    this.totalPages = (scenario === 'silo44') ? 5 : 4;
    this.currentPage = 0;
    this.renderTabs();
    this.renderPage(0);
  }

  setView(viewMode) {
    this.currentView = viewMode;
    if (window.audio) window.audio.playZoom();

    const deskRoom = document.getElementById('manual-desk-room');
    const binderInspect = document.getElementById('manual-binder-inspect');
    const boardInspect = document.getElementById('manual-board-inspect');
    const backBtn = document.getElementById('manual-back-btn');

    if (viewMode === 'DESK_OVERVIEW') {
      if (deskRoom) deskRoom.classList.remove('hidden');
      if (binderInspect) binderInspect.classList.add('hidden');
      if (boardInspect) boardInspect.classList.add('hidden');
      if (backBtn) backBtn.classList.add('hidden');
    } else if (viewMode === 'INSPECT_BINDER') {
      if (deskRoom) deskRoom.classList.add('hidden');
      if (binderInspect) binderInspect.classList.remove('hidden');
      if (boardInspect) boardInspect.classList.add('hidden');
      if (backBtn) backBtn.classList.remove('hidden');
    } else if (viewMode === 'INSPECT_BOARD') {
      if (deskRoom) deskRoom.classList.add('hidden');
      if (binderInspect) binderInspect.classList.add('hidden');
      if (boardInspect) boardInspect.classList.remove('hidden');
      if (backBtn) backBtn.classList.remove('hidden');
      this.renderBoard();
    }
  }

  flipPage(direction) {
    const next = this.currentPage + direction;
    if (next >= 0 && next < this.totalPages) {
      this.currentPage = next;
      if (window.audio) window.audio.playPageTurn();
      this.renderPage(this.currentPage);
    }
  }

  goToSection(pageIdx) {
    if (pageIdx >= 0 && pageIdx < this.totalPages) {
      this.currentPage = pageIdx;
      if (window.audio) window.audio.playPageTurn();
      this.renderPage(this.currentPage);
    }
  }

  renderTabs() {
    const tabContainer = document.querySelector('.binder-tabs');
    if (!tabContainer) return;

    if (this.scenario === 'silo44') {
      tabContainer.innerHTML = `
        <button class="binder-tab-btn active" onclick="manualView.goToSection(0)">01. WIRES</button>
        <button class="binder-tab-btn" onclick="manualView.goToSection(1)">02. KEYPAD</button>
        <button class="binder-tab-btn" onclick="manualView.goToSection(2)">03. FREQ</button>
        <button class="binder-tab-btn" onclick="manualView.goToSection(3)">04. SIMON</button>
        <button class="binder-tab-btn" onclick="manualView.goToSection(4)">05. SERIAL</button>
        <button class="binder-tab-btn binder-close-btn" onclick="manualView.setView('DESK_OVERVIEW')" title="Return to Desk">✕ CLOSE</button>
      `;
    } else {
      tabContainer.innerHTML = `
        <button class="binder-tab-btn active" onclick="manualView.goToSection(0)">I. ZODIAC</button>
        <button class="binder-tab-btn" onclick="manualView.goToSection(1)">II. MERCURY</button>
        <button class="binder-tab-btn" onclick="manualView.goToSection(2)">III. PRISM</button>
        <button class="binder-tab-btn" onclick="manualView.goToSection(3)">IV. CHIME</button>
        <button class="binder-tab-btn binder-close-btn" onclick="manualView.setView('DESK_OVERVIEW')" title="Return to Desk">✕ CLOSE</button>
      `;
    }
  }

  renderPage(pageIdx) {
    const pageContent = document.getElementById('binder-page-body');
    const pageNumber = document.getElementById('binder-page-num');
    if (!pageContent) return;

    pageNumber.innerText = `PAGE ${pageIdx + 1} OF ${this.totalPages}`;

    // Highlight Active Tab (excluding close button)
    document.querySelectorAll('.binder-tab-btn:not(.binder-close-btn)').forEach((btn, idx) => {
      btn.classList.toggle('active', idx === pageIdx);
    });

    if (this.scenario === 'silo44') {
      this.renderSiloPage(pageIdx, pageContent);
    } else {
      this.renderAlchemistPage(pageIdx, pageContent);
    }
  }

  renderSiloPage(pageIdx, pageContent) {
    const pages = [
      // Page 0: Wires
      `
        <div class="parchment-header">
          <span class="stamp-box">ORDNANCE SPEC 4.2</span>
          <h2>SECTION 01: COLOR WIRE DISARMAMENT</h2>
        </div>
        <p class="classified-caption">DO NOT SEVER ARBITRARY WIRES. CONFIRM SERIAL SPECIFICATIONS WITH INTEL ANALYST.</p>
        
        <div class="parchment-rule-box">
          <h3>4-Wire Assemblies:</h3>
          <p>• If >1 <strong>Red</strong> wire & serial end digit is <strong>ODD</strong>, cut the <strong>LAST Red wire</strong>.</p>
          <p>• Otherwise, if last wire is <strong>Yellow</strong> & 0 <strong>Red</strong> wires, cut the <strong>FIRST wire</strong>.</p>
          <p>• Otherwise, if exactly 1 <strong>Blue</strong> wire, cut the <strong>FIRST wire</strong>.</p>
          <p>• Otherwise, if >1 <strong>Yellow</strong> wires, cut the <strong>LAST wire</strong>.</p>
          <p>• Otherwise, cut the <strong>SECOND wire</strong>.</p>
        </div>

        <div class="parchment-rule-box">
          <h3>5-Wire Assemblies:</h3>
          <p>• If last wire is <strong>Black</strong> & serial end digit is <strong>EVEN</strong>, cut the <strong>4th wire</strong>.</p>
          <p>• Otherwise, if exactly 1 <strong>Red</strong> wire & >1 <strong>Yellow</strong> wire, cut the <strong>1st wire</strong>.</p>
          <p>• Otherwise, if 0 <strong>Black</strong> wires, cut the <strong>2nd wire</strong>.</p>
          <p>• Otherwise, cut the <strong>1st wire</strong>.</p>
        </div>
      `,

      // Page 1: Keypad
      `
        <div class="parchment-header">
          <span class="stamp-box">DECRYPT MATRIX 9</span>
          <h2>SECTION 02: CYRILLIC KEYPAD MATRIX</h2>
        </div>
        <p class="classified-caption">THE FOUR SYMBOLS MUST BE PRESSED IN THE EXACT TOP-TO-BOTTOM COLUMN ORDER FOUND IN THE PRESCRIBED MATRIX.</p>

        <div class="keypad-matrix-preview">
          <div class="matrix-column">
            <h4>COLUMN A</h4>
            <div class="sym-list">Ψ • Ϙ • Ж • Ω • Ѭ • ϗ</div>
          </div>
          <div class="matrix-column">
            <h4>COLUMN B</h4>
            <div class="sym-list">ϗ • Ψ • Ѭ • Ҩ • ☆ • Ϙ</div>
          </div>
          <div class="matrix-column">
            <h4>COLUMN C</h4>
            <div class="sym-list">© • Ж • Ҩ • Ѭ • Ϙ • ★</div>
          </div>
          <div class="matrix-column">
            <h4>COLUMN D</h4>
            <div class="sym-list">Ω • © • ★ • ϗ • Ψ • ☆</div>
          </div>
        </div>
        <p class="matrix-footnote">If symbols span multiple columns, select the column that contains ALL 4 symbols. A mistake causes a strike and resets key progress.</p>
      `,

      // Page 2: Radio Carrier
      `
        <div class="parchment-header">
          <span class="stamp-box">RADIO SIGINT</span>
          <h2>SECTION 03: TACTICAL CARRIER SWEEP</h2>
        </div>
        <p class="classified-caption">BOMB USES AN RF JAMMER RELAY. OPERATIVE 1 MUST TUNE THE ANALOG DIAL UNTIL THE CARRIER LOCKS.</p>

        <div class="parchment-rule-box">
          <h3>Carrier Alignment Rules:</h3>
          <p>1. Consult <strong>Intel Analyst</strong>: They will read the active target frequency in MHz from their CRT oscilloscope.</p>
          <p>2. Direct Operative 1 (Defuser) to rotate the Bakelite knob on the radio shelf to match the target frequency within <strong>±1.5 MHz</strong>.</p>
          <p>3. When correctly aligned, both analog VU meters will peak into the amber zone and lock the module.</p>
        </div>
      `,

      // Page 3: Simon Says
      `
        <div class="parchment-header">
          <span class="stamp-box">LIGHT LOGIC</span>
          <h2>SECTION 04: SIMON SAYS LIGHT ARRAY</h2>
        </div>
        <p class="classified-caption">Check the bomb serial number. Table 1: contains vowel. Table 2: no vowel.</p>

        <h4 style="margin: 8px 0 4px 0; color: #00f0ff; font-family: var(--font-tactical);">TABLE 1</h4>
        <div class="simon-table-container">
          <table class="simon-table">
            <thead>
              <tr><th>FLASH COLOR</th><th>0 STRIKES</th><th>1+ STRIKES</th></tr>
            </thead>
            <tbody>
              <tr><td class="col-red">RED</td><td>BLUE</td><td>YELLOW</td></tr>
              <tr><td class="col-blue">BLUE</td><td>RED</td><td>GREEN</td></tr>
              <tr><td class="col-green">GREEN</td><td>YELLOW</td><td>BLUE</td></tr>
              <tr><td class="col-yellow">YELLOW</td><td>GREEN</td><td>RED</td></tr>
            </tbody>
          </table>
        </div>

        <h4 style="margin: 12px 0 4px 0; color: #ffb700; font-family: var(--font-tactical);">TABLE 2</h4>
        <div class="simon-table-container">
          <table class="simon-table">
            <thead>
              <tr><th>FLASH COLOR</th><th>0 STRIKES</th><th>1+ STRIKES</th></tr>
            </thead>
            <tbody>
              <tr><td class="col-red">RED</td><td>BLUE</td><td>RED</td></tr>
              <tr><td class="col-blue">BLUE</td><td>YELLOW</td><td>BLUE</td></tr>
              <tr><td class="col-green">GREEN</td><td>GREEN</td><td>YELLOW</td></tr>
              <tr><td class="col-yellow">YELLOW</td><td>RED</td><td>GREEN</td></tr>
            </tbody>
          </table>
        </div>
        <p class="matrix-footnote">Repeat sequence from beginning after each step.</p>
      `,

      // Page 4: Serial Codes
      `
        <div class="parchment-header">
          <span class="stamp-box">CLASSIFIED ARCHIVE</span>
          <h2>SECTION 05: ORDNANCE SPECIFICATION</h2>
        </div>
        <p class="classified-caption">CRITICAL COMPONENT TELEMETRY DECODER</p>

        <div class="parchment-rule-box">
          <h3>Battery Cells:</h3>
          <p>• <strong>Battery Compartment</strong>: The bomb chassis holds between 1 and 3 copper battery cells (confirmed by Intel Analyst dossier or Defuser side chassis view). Telemetry baseline rating: 2 Cells.</p>
        </div>

        <div class="parchment-rule-box">
          <h3>Lit Relays:</h3>
          <p>• <strong>FRK Lit</strong>: Keypad column order priority inverts (bottom-to-top).</p>
          <p>• <strong>CAR Lit</strong>: Radio frequency baseline offset is 142.5 MHz.</p>
        </div>
      `
    ];
    pageContent.innerHTML = pages[pageIdx];
  }

  renderAlchemistPage(pageIdx, pageContent) {
    const pages = [
      // Page 0: Zodiac
      `
        <div class="parchment-header">
          <span class="stamp-box">LIBER HERMETICUS</span>
          <h2>LIBER I: THE CELESTIAL ZODIAC RINGS</h2>
        </div>
        <p class="classified-caption">TABULA HERMETICA OF LORD ALISTAIR BLACKWOOD (1888)</p>

        <div class="parchment-rule-box">
          <h3>Zodiac Alignment Protocol:</h3>
          <p>1. <strong>Outer Ring (Zodiac House)</strong>: Find the target House confirmed by Intel Analyst ephemeris (e.g. <strong>Scorpio ♏</strong>).</p>
          <p>2. <strong>Middle Ring (Planetary Ruler)</strong>:
             <br>• If Analyst confirms <strong>RETROGRADE (West Bubble)</strong>: Invert ruler to opposite exaltation (Mars inverts to <strong>Sun ☉</strong>).
             <br>• If DIRECT (East Bubble): Keep natural house ruler (Mars ♂).</p>
          <p>3. <strong>Inner Ring (Triplicity Element)</strong>:
             <br>• If Lunar state is <strong>PERIGEE</strong>: Align to complementary element (Water shifts to <strong>Fire 🜂</strong>; Earth 🜃 shifts to <strong>Air 🜁</strong>).
             <br>• If APOGEE: Align to natural base element (Water 🜄; Earth 🜃; Fire 🜂; Air 🜁).</p>
        </div>

        <div class="simon-table-container">
          <table class="simon-table">
            <thead>
              <tr><th>HOUSE</th><th>NATURAL RULER</th><th>RETROGRADE INVERT</th><th>BASE ELEMENT</th></tr>
            </thead>
            <tbody>
              <tr><td>♈ Aries</td><td>Mars ♂</td><td>Venus ♀</td><td>Fire 🜂</td></tr>
              <tr><td>♉ Taurus</td><td>Venus ♀</td><td>Mars ♂</td><td>Earth 🜃</td></tr>
              <tr><td>♊ Gemini</td><td>Mercury ☿</td><td>Jupiter ♃</td><td>Air 🜁</td></tr>
              <tr><td>♋ Cancer</td><td>Moon ☽</td><td>Saturn ♄</td><td>Water 🜄</td></tr>
              <tr><td>♌ Leo</td><td>Sun ☉</td><td>Saturn ♄</td><td>Fire 🜂</td></tr>
              <tr><td>♍ Virgo</td><td>Mercury ☿</td><td>Jupiter ♃</td><td>Earth 🜃</td></tr>
              <tr><td>♎ Libra</td><td>Venus ♀</td><td>Mars ♂</td><td>Air 🜁</td></tr>
              <tr><td>♏ Scorpio</td><td>Mars ♂</td><td>Sun ☉</td><td>Water 🜄</td></tr>
              <tr><td>♐ Sagittarius</td><td>Jupiter ♃</td><td>Mercury ☿</td><td>Fire 🜂</td></tr>
              <tr><td>♑ Capricorn</td><td>Saturn ♄</td><td>Moon ☽</td><td>Earth 🜃</td></tr>
              <tr><td>♒ Aquarius</td><td>Saturn ♄</td><td>Sun ☉</td><td>Air 🜁</td></tr>
              <tr><td>♓ Pisces</td><td>Jupiter ♃</td><td>Mercury ☿</td><td>Water 🜄</td></tr>
            </tbody>
          </table>
        </div>
      `,

      // Page 1: Mercury Manometer
      `
        <div class="parchment-header">
          <span class="stamp-box">HYDROSTATICA</span>
          <h2>LIBER II: HYDROSTATIC RATIOS OF QUICKSILVER</h2>
        </div>
        <p class="classified-caption">THE LAW OF THE ADEPT: EQUILIBRIUM OF THE TRIA PRIMA</p>

        <div class="parchment-rule-box">
          <h3>The Tria Prima Target Ratio (3 : 2 : 1):</h3>
          <p>• <strong>Vial α (Sulfur / Spirit)</strong>: Base target = <strong>90 drams</strong></p>
          <p>• <strong>Vial β (Mercury / Soul)</strong>: Base target = <strong>60 drams</strong></p>
          <p>• <strong>Vial γ (Salt / Body)</strong>: Base target = <strong>30 drams</strong></p>
        </div>

        <div class="parchment-rule-box">
          <h3>Thermal Correction Law:</h3>
          <p>Query <strong>Intel Analyst</strong> for the ambient temperature reading in °C:
             <br>$$\\text{Correction} = (\\text{Temp} - 20.0^\\circ\\text{C}) \\times 0.5\\text{ drams}$$
             <br>Add correction to Vial α, add half to Vial β, subtract from Vial γ.
             <br>Turn valves in short pulses until quicksilver settles into equilibrium!</p>
        </div>
      `,

      // Page 2: Prisms
      `
        <div class="parchment-header">
          <span class="stamp-box">OPTICA OCCULTA</span>
          <h2>LIBER III: SNELL'S ALCHEMICAL DISPERSION</h2>
        </div>
        <p class="classified-caption">REFRACTION OF THE CELESTIAL ARC BEAM THROUGH CRYSTAL PRISMS</p>

        <div class="parchment-rule-box">
          <h3>Elemental Target Wavelengths:</h3>
          <p>• If Inner Ring is <strong>Fire 🜂</strong> $\\implies$ Target is <strong>Solar Amber (589 nm)</strong> with Amber Filter.</p>
          <p>• If Inner Ring is <strong>Water 🜄</strong> $\\implies$ Target is <strong>Deep Azure (450 nm)</strong> with Blue Filter.</p>
          <p>• If Inner Ring is <strong>Air 🜁</strong> $\\implies$ Target is <strong>Pale Emerald (530 nm)</strong> with Green Filter.</p>
          <p>• If Inner Ring is <strong>Earth 🜃</strong> $\\implies$ Target is <strong>Cinnabar Red (650 nm)</strong> with Red Filter.</p>
        </div>
        <p class="matrix-footnote">Instruct Defuser to rotate Prism 1 & Prism 2 until Analyst confirms wavelength locks onto target!</p>
      `,

      // Page 3: Escapement Chime
      `
        <div class="parchment-header">
          <span class="stamp-box">HOROLOGIUM</span>
          <h2>LIBER IV: GRANDFATHER CHIME ESCAPEMENT</h2>
        </div>
        <p class="classified-caption">SYNCHRONIZED TRIP-WIRE DISENGAGEMENT PROTOCOL</p>

        <div class="parchment-rule-box">
          <h3>Chime Identification & Release Windows:</h3>
          <p>• <strong>Whittington Quarters</strong> (F#4 -> A4 -> D4 -> C#5):
             <br>Release lever <strong>PRECISELY ON STRIKE 3 (D4 attack)</strong>!</p>
          <p>• <strong>Westminster Quarters</strong> (D4 -> F#4 -> A4 -> C#5):
             <br>Release lever <strong>DURING 4th NOTE LINGERING DECAY</strong>!</p>
          <p>• <strong>St. Michael Chimes</strong> (C#5 -> A4 -> F#4 -> D4):
             <br>Release lever <strong>1.5 SECONDS AFTER NOTE 4 IN SILENCE</strong>!</p>
        </div>
        <p class="matrix-footnote">⚠️ Releasing lever during the wrong note will trip the spring brake and cause a critical strike!</p>
      `
    ];
    pageContent.innerHTML = pages[pageIdx];
  }

  renderBoard() {
    const boardContent = document.getElementById('manual-board-content');
    if (!boardContent) return;

    if (this.scenario === 'silo44') {
      boardContent.innerHTML = `
        <div class="polaroid-photo">
          <div class="photo-img">💣 BOMB CASING</div>
          <span>SUSPECT PACK: ORDNANCE-9</span>
        </div>
        <div class="sticky-memo">
          <h4>URGENT TACTICAL MEMO:</h4>
          <p>Intel Analyst can solve the math telemetry equation to trigger a +2 Minute (+120s) Detonation Clock extension ONCE!</p>
        </div>
        <div class="sticky-memo yellow">
          <h4>FREQUENCY ADVISORY:</h4>
          <p>Defuser must rotate dial to match Analyst's target carrier frequency within ±0.5 MHz.</p>
        </div>
      `;
    } else {
      boardContent.innerHTML = `
        <div class="polaroid-photo" style="transform: rotate(2deg);">
          <div class="photo-img" style="background: #2a1b10; color: #d4af37;">🕰️ ATHANOR HOROLOGIUM</div>
          <span>BLACKWOOD CRYPT (1888)</span>
        </div>
        <div class="sticky-memo">
          <h4>HERMETIC ADVISORY:</h4>
          <p>Consult Intel Analyst for ambient room temperature (°C) to calculate quicksilver thermal correction!</p>
        </div>
        <div class="sticky-memo yellow">
          <h4>CHIME WARNING:</h4>
          <p>Defuser must pull the trip lever only during the exact allowed chime note window!</p>
        </div>
      `;
    }
  }
}

const manualView = new ManualViewEngine();
window.manualView = manualView;
