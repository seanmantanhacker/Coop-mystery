/* ==========================================================================
   OPERATION: ZERO HOUR - MAP 1: SILO 44 MANUAL SPECIALIST VIEW
   Cold War Soviet Missile Bunker Technical Dossier
   ========================================================================== */

class Silo44ManualView {
  static get totalPages() {
    return 5;
  }

  static renderTabs(tabContainer) {
    if (!tabContainer) return;
    tabContainer.innerHTML = `
      <button class="binder-tab-btn active" onclick="manualView.goToSection(0)">01. WIRES</button>
      <button class="binder-tab-btn" onclick="manualView.goToSection(1)">02. KEYPAD</button>
      <button class="binder-tab-btn" onclick="manualView.goToSection(2)">03. FREQ</button>
      <button class="binder-tab-btn" onclick="manualView.goToSection(3)">04. SIMON</button>
      <button class="binder-tab-btn" onclick="manualView.goToSection(4)">05. SERIAL</button>
      <button class="binder-tab-btn binder-close-btn" onclick="manualView.setView('DESK_OVERVIEW')" title="Return to Desk">✕ CLOSE</button>
    `;
  }

  static renderPage(pageIdx, pageContent) {
    if (!pageContent) return;
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

  static renderBoard(boardContent) {
    if (!boardContent) return;
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
  }
}

window.Silo44ManualView = Silo44ManualView;
