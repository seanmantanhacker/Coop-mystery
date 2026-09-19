/* ==========================================================================
   OPERATION: ZERO HOUR - MAP 2: THE ALCHEMIST'S STUDY MANUAL SPECIALIST VIEW
   Victorian Gothic Hermetic Grimoire (Liber I - Liber IV)
   ========================================================================== */

class AlchemistManualView {
  static get totalPages() {
    return 4;
  }

  static renderTabs(tabContainer) {
    if (!tabContainer) return;
    tabContainer.innerHTML = `
      <button class="binder-tab-btn active" onclick="manualView.goToSection(0)">I. ZODIAC</button>
      <button class="binder-tab-btn" onclick="manualView.goToSection(1)">II. MERCURY</button>
      <button class="binder-tab-btn" onclick="manualView.goToSection(2)">III. PRISM</button>
      <button class="binder-tab-btn" onclick="manualView.goToSection(3)">IV. CHIME</button>
      <button class="binder-tab-btn binder-close-btn" onclick="manualView.setView('DESK_OVERVIEW')" title="Return to Desk">✕ CLOSE</button>
    `;
  }

  static renderPage(pageIdx, pageContent) {
    if (!pageContent) return;
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
          <h3>1. Determine Ruling Opus Base Ratio:</h3>
          <p>Query <strong>Intel Analyst</strong> for the Ruling Opus / Celestial House:</p>
          <table class="alchemist-table" style="width: 100%; margin: 8px 0; font-size: 0.82rem;">
            <thead>
              <tr>
                <th>Ruling Element</th>
                <th>Opus Regime</th>
                <th>Vial α (Sulfur)</th>
                <th>Vial β (Mercury)</th>
                <th>Vial γ (Salt)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Fire 🜂 / Air 🜁</strong><br><small>Aries, Leo, Sag, Gem, Lib, Aqu</small></td>
                <td><strong>OPUS IGNIS</strong><br><small>(Sulfur Exaltation)</small></td>
                <td><strong>85</strong> drams</td>
                <td><strong>55</strong> drams</td>
                <td><strong>40</strong> drams</td>
              </tr>
              <tr>
                <td><strong>Water 🜄</strong><br><small>Cancer, Scorpio, Pisces</small></td>
                <td><strong>OPUS AQUAE</strong><br><small>(Quicksilver Flow)</small></td>
                <td><strong>45</strong> drams</td>
                <td><strong>95</strong> drams</td>
                <td><strong>40</strong> drams</td>
              </tr>
              <tr>
                <td><strong>Earth 🜃</strong><br><small>Taurus, Virgo, Capricorn</small></td>
                <td><strong>OPUS TERRAE</strong><br><small>(Salt Matrix)</small></td>
                <td><strong>45</strong> drams</td>
                <td><strong>55</strong> drams</td>
                <td><strong>80</strong> drams</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="parchment-rule-box">
          <h3>2. Quintessence Purity &amp; Thermal Dilatation Laws:</h3>
          <p>Query <strong>Intel Analyst</strong> for <strong>Ambient Temperature</strong> and <strong>Purity Grade</strong>:</p>
          <div style="background: rgba(0,0,0,0.08); border: 1px dashed #5a3c22; border-radius: 4px; padding: 6px 10px; margin: 6px 0; text-align: center; font-weight: bold; font-size: 0.88rem;">
            Thermal Δ = (Ambient Temp - 20.0°C) × 1.0 dram (Add Δ to α, subtract Δ from γ)
          </div>
          <ul class="dossier-list" style="margin: 4px 0 6px 16px; font-size: 0.85rem;">
            <li><strong>GRADE A (Mercurial Focus):</strong> Add <strong>+5 drams</strong> to β (Mercury), subtract <strong>-5 drams</strong> from γ (Salt).</li>
            <li><strong>GRADE B (Sulfuric Bias):</strong> Add <strong>+5 drams</strong> to α (Sulfur), subtract <strong>-5 drams</strong> from β (Mercury).</li>
          </ul>
          <p style="margin-top: 6px; font-size: 0.8rem; color: #5a3c22;"><strong>Tip for Defuser:</strong> Use <strong>COARSE (±10)</strong> valves for rapid leveling, then switch to <strong>FINE (±1)</strong> needle valves to lock equilibrium.</p>
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
          <h3>Fraunhofer Spectral Absorption Alignment:</h3>
          <p>Query <strong>Intel Analyst</strong> for the active <strong>Fraunhofer Spectral Absorption Line</strong> peaking on the spectrophotometer:</p>
          <ul class="dossier-list" style="margin: 4px 0 8px 16px; font-size: 0.85rem;">
            <li><strong>LINE D (Solar Sodium, 589 nm):</strong> Install <strong>Amber Filter</strong>. Adjust Prisms to 589 nm.</li>
            <li><strong>LINE F (Hydrogen Beta, 450 nm):</strong> Install <strong>Blue Filter</strong>. Adjust Prisms to 450 nm.</li>
            <li><strong>LINE b (Magnesium Emerald, 530 nm):</strong> Install <strong>Green Filter</strong>. Adjust Prisms to 530 nm.</li>
            <li><strong>LINE C (Hydrogen Alpha, 650 nm):</strong> Install <strong>Red Filter</strong>. Adjust Prisms to 650 nm.</li>
          </ul>
        </div>
        <p class="matrix-footnote">Instruct Defuser to rotate Prism 1 &amp; Prism 2 until Analyst confirms wavelength locks onto target!</p>
      `,

      // Page 3: Escapement Chime
      `
        <div class="parchment-header">
          <span class="stamp-box">HOROLOGIUM</span>
          <h2>LIBER IV: GRANDFATHER CHIME ESCAPEMENT</h2>
        </div>
        <p class="classified-caption">SYNCHRONIZED TRIP-WIRE DISENGAGEMENT PROTOCOL</p>

        <div class="parchment-rule-box">
          <h3>Authorized Planetary Governor Cam &amp; Release Window:</h3>
          <p>Query <strong>Intel Analyst</strong> for the authorized <strong>Planetary Chime Governor Cam</strong> from the ephemeris:</p>
          <ul class="dossier-list" style="margin: 4px 0 8px 16px; font-size: 0.85rem;">
            <li><strong>CAM #1 (Whittington Quarters):</strong> Release lever <strong>PRECISELY ON STRIKE 3 (D4 attack)</strong>!</li>
            <li><strong>CAM #2 (Westminster Quarters):</strong> Release lever <strong>DURING 4th NOTE LINGERING DECAY</strong>!</li>
            <li><strong>CAM #3 (St. Michael Chimes):</strong> Release lever <strong>1.5 SECONDS AFTER NOTE 4 IN SILENCE</strong>!</li>
          </ul>
        </div>
        <p class="matrix-footnote">⚠️ Releasing lever during the wrong note will trip the spring brake and cause a critical strike!</p>
      `
    ];
    pageContent.innerHTML = pages[pageIdx];
  }

  static renderBoard(boardContent) {
    if (!boardContent) return;
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

window.AlchemistManualView = AlchemistManualView;
