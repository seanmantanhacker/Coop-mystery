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
          <h3>The Tria Prima Target Ratio (3 : 2 : 1):</h3>
          <p>• <strong>Vial α (Sulfur / Spirit)</strong>: Base target = <strong>90 drams</strong></p>
          <p>• <strong>Vial β (Mercury / Soul)</strong>: Base target = <strong>60 drams</strong></p>
          <p>• <strong>Vial γ (Salt / Body)</strong>: Base target = <strong>30 drams</strong></p>
        </div>

        <div class="parchment-rule-box">
          <h3>Thermal Correction Law:</h3>
          <p>Query <strong>Intel Analyst</strong> for ambient temperature in °C:</p>
          <div style="background: rgba(0,0,0,0.08); border: 1px dashed #5a3c22; border-radius: 4px; padding: 8px 10px; margin: 8px 0; text-align: center; font-weight: bold; font-size: 0.92rem;">
            Correction = (Ambient Temp - 20.0°C) × 0.5 drams
          </div>
          <p>• Add correction to <strong>Vial α</strong>
             <br>• Add half correction to <strong>Vial β</strong>
             <br>• Subtract from <strong>Vial γ</strong>
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
          <p>• If Inner Ring is <strong>Fire 🜂</strong> → Target is <strong>Solar Amber (589 nm)</strong> with Amber Filter.</p>
          <p>• If Inner Ring is <strong>Water 🜄</strong> → Target is <strong>Deep Azure (450 nm)</strong> with Blue Filter.</p>
          <p>• If Inner Ring is <strong>Air 🜁</strong> → Target is <strong>Pale Emerald (530 nm)</strong> with Green Filter.</p>
          <p>• If Inner Ring is <strong>Earth 🜃</strong> → Target is <strong>Cinnabar Red (650 nm)</strong> with Red Filter.</p>
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
