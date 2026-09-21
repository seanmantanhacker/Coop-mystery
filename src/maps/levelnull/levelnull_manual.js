/* ==========================================================================
   OPERATION: ZERO HOUR - MAP 4: LEVEL NULL (THE SHIFTING BACKROOMS)
   MANUAL SPECIALIST: CLEARANCE GATES α, β, & Ω CLASSIFIED DOSSIER
   EXPERT COOPERATIVE SYNCHRONIZATION PROTOCOL
   ========================================================================== */

class LevelNullManualView {
  static get totalPages() {
    return 4;
  }

  static renderTabs(tabContainer) {
    if (!tabContainer) return;
    tabContainer.innerHTML = `
      <button class="binder-tab-btn active" onclick="manualView.goToSection(0)">I. FIRE DOOR (GATE α)</button>
      <button class="binder-tab-btn" onclick="manualView.goToSection(1)">II. SUB HATCH (GATE β)</button>
      <button class="binder-tab-btn" onclick="manualView.goToSection(2)">III. REALITY RIFT (GATE Ω)</button>
      <button class="binder-tab-btn" onclick="manualView.goToSection(3)">IV. ANOMALY LOGS</button>
      <button class="binder-tab-btn binder-close-btn" onclick="manualView.setView('DESK_OVERVIEW')" title="Return to Desk">✕ CLOSE</button>
    `;
  }

  static renderPage(pageIdx, pageContent) {
    if (!pageContent) return;

    const pages = [
      // Page 0: Gate Alpha (Fire Door & Breakers)
      `
        <div class="parchment-header">
          <span class="stamp-box">SECTOR 1989 // EXPERT SPEC</span>
          <h2>CLEARANCE GATE α: INDUSTRIAL FIRE DOOR BREAKER</h2>
        </div>
        <p class="classified-caption">ELECTROMAGNETIC HARMONIC NULLIFICATION &amp; LOCK BEAM PROTOCOL</p>

        <div class="parchment-rule-box">
          <h3>Procedural Breach Protocol:</h3>
          <p>1. <strong>Identify Resonant Breakers</strong>: Query the <strong>Intel Analyst</strong> for the peak electromagnetic harmonic frequency (kHz). Cross-reference with the matrix below to energize the two designated phase breakers (leave the other two disengaged):</p>
        </div>

        <div class="simon-table-container">
          <table class="simon-table">
            <thead>
              <tr>
                <th>INTEL PEAK FREQUENCY</th>
                <th>ENGAGE BREAKER 1</th>
                <th>ENGAGE BREAKER 2</th>
                <th>DISENGAGED (OPEN)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>30.0 kHz – 44.0 kHz</strong></td>
                <td><strong style="color:#f5d76e;">PHASE α</strong></td>
                <td><strong style="color:#c084fc;">PHASE γ</strong></td>
                <td>PHASE β &amp; PHASE δ</td>
              </tr>
              <tr>
                <td><strong>45.0 kHz – 58.0 kHz</strong></td>
                <td><strong style="color:#00f0ff;">PHASE β</strong></td>
                <td><strong style="color:#ff3344;">PHASE δ</strong></td>
                <td>PHASE α &amp; PHASE γ</td>
              </tr>
              <tr>
                <td><strong>59.0 kHz – 72.0 kHz</strong></td>
                <td><strong style="color:#f5d76e;">PHASE α</strong></td>
                <td><strong style="color:#00f0ff;">PHASE β</strong></td>
                <td>PHASE γ &amp; PHASE δ</td>
              </tr>
              <tr>
                <td><strong>73.0 kHz – 88.0 kHz</strong></td>
                <td><strong style="color:#c084fc;">PHASE γ</strong></td>
                <td><strong style="color:#ff3344;">PHASE δ</strong></td>
                <td>PHASE α &amp; PHASE β</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="parchment-rule-box" style="margin-top: 14px;">
          <h3>Real-Time Cooperative Synchronization:</h3>
          <p>2. <strong>Frequency Tuning</strong>: Defuser tunes the manual dial to match Intel's peak frequency within <strong>±3.0 kHz</strong>.</p>
          <p>3. <strong>Intel EM Lock Beam</strong>: The magnetic core is permanently energized until the <strong>Intel Analyst</strong> engages the <strong>[EM RESONANCE LOCK BEAM]</strong> (20-second active window).</p>
          <p>4. <strong>Push Fire Bar</strong>: Defuser must push the <strong>EMERGENCY FIRE BAR</strong> while the EM Lock Beam is actively counting down. The mag-lock will de-energize and unseal Sector 1!</p>
        </div>
        <p class="matrix-footnote">⚠️ Forcing the fire bar without the EM Lock Beam active or with mismatched breakers will trip an overcharge STRIKE!</p>
      `,

      // Page 1: Gate Beta (Submarine Vault Hatch)
      `
        <div class="parchment-header">
          <span class="stamp-box">SECTOR 2 // HYDRO-SUBSTATION</span>
          <h2>CLEARANCE GATE β: HYDROSTATIC SUBMARINE VAULT HATCH</h2>
        </div>
        <p class="classified-caption">DIFFERENTIAL HYDRAULIC EQUILIBRIUM &amp; PURGE SEQUENCE</p>

        <div class="parchment-rule-box">
          <h3>Equilibrium Protocol:</h3>
          <p>Sector 2 is flooded with pressurized industrial brine. The 6 locking lugs are pinned by 80 PSI differential hydraulic shear:</p>
          <p>1. <strong>Intel Aux Drain Pump</strong>: Have the <strong>Intel Analyst</strong> activate the remote <strong>[AUX HYDRO DRAIN PUMP]</strong>. While active, the pump continuously purges brine from the chamber.</p>
          <p>2. <strong>Backpressure Purge</strong>: If drainage stalls, Intel can pulse <strong>[PURGE -25 PSI]</strong> to instantly dump backpressure.</p>
          <p>3. <strong>Balance Manifold Valves</strong>: Use the (+ / −) controls on the manifold to dial each pipe pressure to match Intel's target telemetry within <strong>±5 PSI</strong>:</p>
        </div>

        <div class="simon-table-container">
          <table class="simon-table">
            <thead>
              <tr>
                <th>MANIFOLD VALVE</th>
                <th>OPERATIONAL SYSTEM</th>
                <th>PRESSURE TOLERANCE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong style="color:#00f0ff;">VALVE A (INTAKE)</strong></td>
                <td>Brine intake conduit</td>
                <td>Match Intel Target ±5 PSI</td>
              </tr>
              <tr>
                <td><strong style="color:#f5d76e;">VALVE B (RETURN)</strong></td>
                <td>Recirculation return manifold</td>
                <td>Match Intel Target ±5 PSI</td>
              </tr>
              <tr>
                <td><strong style="color:#00ff88;">VALVE C (EQUALIZER)</strong></td>
                <td>6-Lug hydraulic pressure equalizing loop</td>
                <td>Match Intel Target ±5 PSI</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="parchment-rule-box" style="margin-top: 14px;">
          <h3>Hatch Unsealing:</h3>
          <p>4. <strong>Rotate Vault Wheel</strong>: With all 3 valves stabilized, the Aux Pump active, and <strong>Seal Pressure ≤ 15 PSI</strong>, Defuser rotates the central brass hand-wheel. The 6 mechanical lugs will disengage!</p>
        </div>
        <p class="matrix-footnote">⚠️ Rotating wheel while valves are unbalanced, pump is offline, or seal pressure exceeds 15 PSI causes a hydraulic water-hammer STRIKE!</p>
      `,

      // Page 2: Gate Omega (Quantum Core Reality Anchor)
      `
        <div class="parchment-header">
          <span class="stamp-box">FINAL GATE // SECTOR 3</span>
          <h2>CLEARANCE GATE Ω: REALITY ANCHOR PORTAL</h2>
        </div>
        <p class="classified-caption">SPATIAL-TEMPORAL EXTRACTION &amp; ANCHOR STABILIZATION</p>

        <div class="parchment-rule-box">
          <h3>Portal Extraction Protocol:</h3>
          <p>Consensus reality has collapsed into an extradimensional rift. Stabilization requires three synchronized actions:</p>
          <p>1. <strong>Tri-Axis Prism Beam Alignment</strong>: Defuser clicks <em>ROTATE 90°</em> on the 3 optical beam prisms. Have the <strong>Intel Analyst</strong> monitor the live <strong>Reality Distortion Index (RDI)</strong>:</p>
          <ul class="dossier-list" style="margin: 4px 0 8px 16px; font-size: 0.85rem;">
            <li><strong style="color:#c084fc;">PRISM 1 (LEFT PEDESTAL)</strong>: Correct angle reduces distortion by 33%.</li>
            <li><strong style="color:#c084fc;">PRISM 2 (RIGHT PEDESTAL)</strong>: Correct angle reduces distortion by 33%.</li>
            <li><strong style="color:#c084fc;">PRISM 3 (CENTER PEDESTAL)</strong>: Correct angle stabilizes field to <strong>RDI: 0%</strong>.</li>
          </ul>
        </div>

        <div class="parchment-rule-box" style="margin-top: 14px;">
          <h3>Intel Reality Tether &amp; Stabilization Key:</h3>
          <p>2. <strong>Discharge Reality Tether</strong>: Once RDI reaches 0%, the <strong>Intel Analyst</strong> must press <strong>[DISCHARGE REALITY TETHER PULSE]</strong> (45-second stabilization window).</p>
          <p>3. <strong>Anchor Key Decrypt &amp; Commit</strong>: Intel relays the decrypted <strong>4-Digit Anchor Key</strong> from their console. Defuser enters the 4 digits into the core terminal and presses <strong>COMMIT ANCHOR STABILIZATION KEY</strong>.</p>
        </div>

        <div class="formula-callout" style="border-color:#00ff88; color:#00ff88; background:rgba(0,255,136,0.08); padding:10px; font-weight:bold; text-align:center;">
          ✓ EXPERT VICTORY: Align 3 prisms (RDI 0%) + Intel Reality Tether pulse + 4-digit anchor code unlocks the portal gateway!
        </div>
        <p class="matrix-footnote">⚠️ Entering an incorrect key or committing without active tether pulse causes temporal backlash and triggers a STRIKE!</p>
      `,

      // Page 3: Sector 1989 Incident Logs & Quick Reference
      `
        <div class="parchment-header">
          <span class="stamp-box">ARCHIVAL DOSSIER</span>
          <h2>INCIDENT 1989-Ω: LEVEL NULL CONTAINMENT LOGS</h2>
        </div>
        <p class="classified-caption">CONFIDENTIAL MEMORANDUM // EXPERT MODE (20:00 MISSION CLOCK)</p>

        <div class="parchment-rule-box">
          <h3>Operative Synchronization Matrix:</h3>
          <table class="simon-table" style="font-size:0.8rem;">
            <thead>
              <tr>
                <th>CHAMBER</th>
                <th>INTEL ACTION</th>
                <th>DEFUSER ACTION</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>CHAMBER 1: OFFICE</strong></td>
                <td>Relays peak kHz + pulses [EM RESONANCE LOCK BEAM].</td>
                <td>Engages 2 phase breakers + dials kHz ±3 + pushes Fire Bar.</td>
              </tr>
              <tr>
                <td><strong>CHAMBER 2: SUBSTATION</strong></td>
                <td>Sets [AUX DRAIN PUMP] ONLINE + pulses [PURGE -25 PSI].</td>
                <td>Matches Valves A/B/C ±5 PSI + turns Sub Wheel when Seal ≤15 PSI.</td>
              </tr>
              <tr>
                <td><strong>CHAMBER 3: QUANTUM CORE</strong></td>
                <td>Tracks RDI to 0% + fires [REALITY TETHER] + transmits 4-digit code.</td>
                <td>Rotates Prisms until RDI 0% + keys in 4-digit anchor code.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="parchment-rule-box" style="margin-top: 14px;">
          <h3>Excerpt from Dr. K. Aris (Chief Research Physicist, 1989):</h3>
          <p style="font-style:italic; font-size:0.83rem; line-height:1.5;">
            "The architecture down here refuses to obey Euclidean geometry. Doors lead into subterranean reservoirs that shouldn't fit inside the perimeter. Total mission clock is 20 minutes before dimensional collapse. Maintain constant voice or telemetry link between the field operative and the surface monitor station."
          </p>
        </div>
      `
    ];

    pageContent.innerHTML = pages[pageIdx] || pages[0];
  }

  static renderBoard(boardContent) {
    if (!boardContent) return;
    boardContent.innerHTML = `
      <div class="polaroid-photo" style="transform: rotate(-3deg);">
        <div class="photo-img" style="background: #151d18; color: #f5d76e; display:flex; align-items:center; justify-content:center; height:100px; font-weight:bold;">
          🚪 SECTOR 1 FIRE DOOR
        </div>
        <span>FIRE BAR // EM LOCK BEAM</span>
      </div>

      <div class="polaroid-photo" style="transform: rotate(2deg);">
        <div class="photo-img" style="background: #081a20; color: #00f0ff; display:flex; align-items:center; justify-content:center; height:100px; font-weight:bold;">
          ⚓ SUB VAULT HATCH
        </div>
        <span>SEAL PURGE ≤15 PSI</span>
      </div>

      <div class="polaroid-photo" style="transform: rotate(-1deg);">
        <div class="photo-img" style="background: #180d24; color: #c084fc; display:flex; align-items:center; justify-content:center; height:100px; font-weight:bold;">
          🌀 QUANTUM CORE RIFT
        </div>
        <span>45s REALITY TETHER PULSE</span>
      </div>

      <div class="sticky-memo">
        <h4>SYNCHRONIZATION:</h4>
        <p>In Sector 1, Defuser CANNOT open the fire door until Intel engages the [EM RESONANCE LOCK BEAM]!</p>
      </div>

      <div class="sticky-memo yellow">
        <h4>SEAL PRESSURE:</h4>
        <p>In Sector 2, hatch seal must drain to ≤15 PSI with Intel's Aux Pump before turning the submarine wheel!</p>
      </div>
    `;
  }
}

window.LevelNullManualView = LevelNullManualView;
