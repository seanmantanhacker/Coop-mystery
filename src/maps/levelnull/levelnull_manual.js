/* ==========================================================================
   OPERATION: ZERO HOUR - MAP 4: LEVEL NULL (INCIDENT 1989)
   MANUAL SPECIALIST: "MURDER IDENTITY" CASE FILES & CLEARANCE GATES
   University War Asymmetric Deduction & Logic Elimination Guide
   ========================================================================== */

class LevelNullManualView {
  static get totalPages() {
    return 4;
  }

  static renderTabs(tabContainer) {
    if (!tabContainer) return;
    tabContainer.innerHTML = `
      <button class="binder-tab-btn active" onclick="manualView.goToSection(0)">I. FIRE DOOR (GATE α) - PATHOLOGY</button>
      <button class="binder-tab-btn" onclick="manualView.goToSection(1)">II. SUB HATCH (GATE β) - TIMELINE</button>
      <button class="binder-tab-btn" onclick="manualView.goToSection(2)">III. REALITY RIFT (GATE Ω) - ALIBI LOGIC</button>
      <button class="binder-tab-btn" onclick="manualView.goToSection(3)">IV. ANOMALY LOGS - THE 8 SUSPECTS</button>
      <button class="binder-tab-btn binder-close-btn" onclick="manualView.setView('DESK_OVERVIEW')" title="Return to Desk">✕ CLOSE</button>
    `;
  }

  static renderPage(pageIdx, pageContent) {
    if (!pageContent) return;

    const pages = [
      // Page 0: Gate Alpha (Forensic Pathology & Weapon Matrix)
      `
        <div class="parchment-header">
          <span class="stamp-box">SECTOR 1989 // CASE #89-Ω</span>
          <h2>CLEARANCE GATE α: FORENSIC PATHOLOGY &amp; WEAPON MATRIX</h2>
        </div>
        <p class="classified-caption">POST-MORTEM CORONER ANALYSIS // VICTIM: DR. KENNETH ARIS</p>

        <div class="parchment-rule-box">
          <h3>Deduction Rule 1: Weapon &amp; Physical Trait Cross-Reference</h3>
          <p>Query the <strong>Defuser</strong> for the observed trauma marks on Dr. Aris's body, then query the <strong>Intel Analyst</strong> for the toxic chemical spectral peak:</p>
        </div>

        <div class="simon-table-container">
          <table class="simon-table">
            <thead>
              <tr>
                <th>OBSERVED TRAUMA</th>
                <th>FATAL WEAPON</th>
                <th>CHEMICAL TEST</th>
                <th>MANDATORY ASSAILANT TRAIT</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Crushed cranial trauma on right temple</td>
                <td><strong style="color:#f5d76e;">BRASS MASTER BATON</strong></td>
                <td>NONE</td>
                <td>Must be <strong>LEFT-HANDED</strong> &amp; Height &gt; 180 cm</td>
              </tr>
              <tr>
                <td>Petechiae &amp; bitter almond lip odor</td>
                <td><strong style="color:#00f0ff;">POTASSIUM CYANIDE</strong></td>
                <td>CYANIDE (Teal Precipitate)</td>
                <td>Requires <strong>Biochem Lab Clearance</strong></td>
              </tr>
              <tr>
                <td>Lichtenberg feathering burn on chest</td>
                <td><strong style="color:#c084fc;">50kV HIGH-VOLTAGE</strong></td>
                <td>OZONE OVAL</td>
                <td>Requires <strong>Insulated Gloves</strong> (Fatal to Pacemakers)</td>
              </tr>
              <tr>
                <td>Bilateral thoracic piston collapse</td>
                <td><strong style="color:#ff3344;">PISTON SHEAR LUG</strong></td>
                <td>INDUSTRIAL BRINE</td>
                <td>Requires <strong>Heavy Boots (Size 11)</strong> / Wet Cuffs</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="parchment-rule-box" style="margin-top: 14px;">
          <h3>Elimination Action:</h3>
          <p>Once the Defuser confirms the weapon and reagent in Sector 1, cross off any suspect who does not meet the physical criteria on the 8-photo corkboard!</p>
        </div>
      `,

      // Page 1: Gate Beta (Spatiotemporal Timeline & Sector Transit)
      `
        <div class="parchment-header">
          <span class="stamp-box">SPATIAL TELEMETRY</span>
          <h2>CLEARANCE GATE β: SPATIOTEMPORAL SECTOR TRANSIT &amp; TIMELINE</h2>
        </div>
        <p class="classified-caption">NON-EUCLIDEAN LEVEL NULL TRAVERSAL BOUNDARIES</p>

        <div class="parchment-rule-box">
          <h3>Deduction Rule 2: Minimum Transit Times</h3>
          <p>Level Null's corridors fold through anomalous geometry. Walking between chambers obeys strict physical time limits:</p>
          <ul class="dossier-list" style="margin: 6px 0 10px 18px; font-size: 0.86rem; line-height: 1.6;">
            <li><strong>Sector 1 (Office) ➔ Sector 2 (Hydro)</strong>: Exactly <strong>6 minutes</strong> on foot.</li>
            <li><strong>Sector 2 (Hydro) ➔ Sector 3 (Quantum Core)</strong>: Exactly <strong>6 minutes</strong> on foot.</li>
            <li><strong>Sector 1 (Office) ➔ Sector 3 (Direct)</strong>: Impossible without passing Sector 2 (Total <strong>12 minutes</strong>).</li>
            <li><strong>Emergency Ventilation Duct Bypass</strong>: Takes <strong>3 minutes</strong>, but entry is restricted to individuals under <strong>170 cm</strong> in height with no heavy bulky equipment.</li>
            <li><strong>EM Radiation Hazard</strong>: Sector 1 Breaker and Sector 3 Core emit high-frequency fields that will trigger fatal arrhythmia in anyone with a <strong>cardiac pacemaker</strong>.</li>
          </ul>
        </div>

        <div class="simon-table-container">
          <table class="simon-table">
            <thead>
              <tr>
                <th>SECTOR</th>
                <th>KEY ENVIRONMENT</th>
                <th>LETHAL HAZARDS &amp; RESTRICTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>SECTOR 1</strong></td>
                <td>Director Executive Office</td>
                <td>Master safe, fluorescent breaker panel (65 kHz EM field)</td>
              </tr>
              <tr>
                <td><strong>SECTOR 2</strong></td>
                <td>Hydrostatic Substation</td>
                <td>Flooded brine floor, deep water drains, heavy pistons</td>
              </tr>
              <tr>
                <td><strong>SECTOR 3</strong></td>
                <td>Quantum Core Rift</td>
                <td>High-voltage busbars, spatial rupture, radio intercept array</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="matrix-footnote">⚠️ If a suspect swiped into Sector 3 within 4 minutes of a crime in Sector 1, they could NOT have committed the murder—unless their badge was stolen!</p>
      `,

      // Page 2: Gate Omega (Sworn Alibi Statements & Logic Matrix)
      `
        <div class="parchment-header">
          <span class="stamp-box">LOGIC MATRIX</span>
          <h2>CLEARANCE GATE Ω: SWORN ALIBI STATEMENTS &amp; CIPHER</h2>
        </div>
        <p class="classified-caption">INTERROGATION TRANSCRIPTS // UNIVERSITY WAR TRUTH/LIE PUZZLE</p>

        <div class="parchment-rule-box">
          <h3>Sworn Statements (Recorded at 14:30 Lockdown):</h3>
          <ol style="margin: 6px 0 10px 20px; font-size: 0.85rem; line-height: 1.6;">
            <li><strong>Cmdr. Ramos</strong>: <em>"I was checking the Sector 1 fire door when the alarm tripped. Dr. Vance was in the core."</em></li>
            <li><strong>Dr. Park</strong>: <em>"I was running toxicology assays. Sophia can confirm I never touched the potassium cyanide bottle."</em></li>
            <li><strong>Eng. Chen</strong>: <em>"I was balancing Valve B in Hydro. The pressure dropped suddenly at the time of breach."</em></li>
            <li><strong>Dr. Thorne</strong>: <em>"My headphones were tuned to the telemetry array. I heard footsteps near the victim’s office."</em></li>
            <li><strong>Agent Miller</strong>: <em>"I saw someone wearing heavy rubber diving boots running toward the emergency vent."</em></li>
            <li><strong>Tech. O'Connor</strong>: <em>"I was asleep in the bunk. My boots were locked in the dry room all morning."</em></li>
          </ol>
        </div>

        <div class="parchment-rule-box" style="margin-top: 14px;">
          <h3>University War Cross-Examination Rules:</h3>
          <p>1. <strong>Contradiction Analysis</strong>: If physical evidence proves wet diving boot prints at the crime scene, Tech. O'Connor's statement #6 is a <strong>confirmed lie</strong>!</p>
          <p>2. <strong>The Wiretap Carrier</strong>: Have the <strong>Intel Analyst</strong> scan the covert surveillance channels (88.5, 94.2, 108.6, or 122.4 MHz). Locking onto the active carrier will intercept the saboteur's broadcast and decrypt the <strong>4-digit Override Cipher</strong>!</p>
        </div>
      `,

      // Page 3: Incident 1989-Ω Logs & Suspects Dossier
      `
        <div class="parchment-header">
          <span class="stamp-box">ARCHIVAL DOSSIER</span>
          <h2>INCIDENT 1989-Ω: LEVEL NULL ANOMALY LOGS &amp; DOSSIERS</h2>
        </div>
        <p class="classified-caption">CONFIDENTIAL PERSONNEL DOSSIERS // 8 SUSPECTS MATRIX</p>

        <div class="simon-table-container">
          <table class="simon-table" style="font-size: 0.8rem;">
            <thead>
              <tr>
                <th>PHOTO ID</th>
                <th>NAME &amp; ROLE</th>
                <th>BLOOD</th>
                <th>HAND</th>
                <th>HEIGHT</th>
                <th>NOTABLE TRAITS &amp; GEAR</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>PHOTO-01</strong></td>
                <td>Dr. Elena Vance (Quantum)</td>
                <td>Type O</td>
                <td>Right</td>
                <td>168 cm</td>
                <td>Gold glasses, wrist scar, vent eligible</td>
              </tr>
              <tr>
                <td><strong>PHOTO-02</strong></td>
                <td>Cmdr. Viktor Ramos (Security)</td>
                <td>Type A</td>
                <td><strong>LEFT</strong></td>
                <td><strong>188 cm</strong></td>
                <td>Military build, carries brass master baton</td>
              </tr>
              <tr>
                <td><strong>PHOTO-03</strong></td>
                <td>Dr. Jin-Woo Park (Biochem)</td>
                <td>Type B</td>
                <td>Right</td>
                <td>174 cm</td>
                <td>Lab coat, chemical access, missing finger tip</td>
              </tr>
              <tr>
                <td><strong>PHOTO-04</strong></td>
                <td>Eng. Sophia Chen (Hydro)</td>
                <td>Type AB</td>
                <td>Right</td>
                <td>165 cm</td>
                <td>Rubber gauntlets, grease smudges, vent eligible</td>
              </tr>
              <tr>
                <td><strong>PHOTO-05</strong></td>
                <td>Dr. Marcus Thorne (Telemetry)</td>
                <td>Type O</td>
                <td>Right</td>
                <td>179 cm</td>
                <td>Heavy headphones, right leg limp (uses cane)</td>
              </tr>
              <tr>
                <td><strong>PHOTO-06</strong></td>
                <td>Agent Sarah Miller (Archives)</td>
                <td>Type A</td>
                <td>Right</td>
                <td>161 cm</td>
                <td>Trench coat, matches in pocket, vent eligible</td>
              </tr>
              <tr>
                <td><strong>PHOTO-07</strong></td>
                <td>Dr. Dmitry Volkov (Electrical)</td>
                <td>Type B</td>
                <td>Right</td>
                <td>182 cm</td>
                <td><strong>Pacemaker</strong>, insulated apron, high EM danger</td>
              </tr>
              <tr>
                <td><strong>PHOTO-08</strong></td>
                <td>Tech. Liam O'Connor (Diver)</td>
                <td>Type AB</td>
                <td>Right</td>
                <td>185 cm</td>
                <td><strong>Size 11 Diving Boots</strong>, wet cuffs, piston tool</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="formula-callout" style="border-color:#ff3344; color:#ff7788; background:rgba(255,51,68,0.08); padding:10px; font-weight:bold; text-align:center; margin-top:14px;">
          ✓ GRAND INDICTMENT: Eliminate 7 suspects until exactly 1 matches the weapon, timeline, and alibi. Enter their Photo #, Weapon, Sector, and 4-Digit Cipher to lift Level Null lockdown!
        </div>
      `
    ];

    pageContent.innerHTML = pages[pageIdx] || pages[0];
  }

  static renderBoard(boardContent) {
    if (!boardContent) return;
    boardContent.innerHTML = `
      <div class="polaroid-photo" style="transform: rotate(-3deg);">
        <div class="photo-img" style="background: #1e1b18; color: #f5d76e; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100px; font-weight:bold; font-size:0.8rem; text-align:center;">
          <span style="font-size:1.6rem; margin-bottom:4px;">🚪</span>
          SECTOR 1 FIRE DOOR
        </div>
        <span>FIRE BAR // CRIME SCENE</span>
      </div>

      <div class="polaroid-photo" style="transform: rotate(2deg);">
        <div class="photo-img" style="background: #111a1f; color: #00f0ff; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100px; font-weight:bold; font-size:0.8rem; text-align:center;">
          <span style="font-size:1.6rem; margin-bottom:4px;">⚓</span>
          SUB VAULT HATCH
        </div>
        <span>HYDROSTATION SECTOR 2</span>
      </div>

      <div class="polaroid-photo" style="transform: rotate(-2deg);">
        <div class="photo-img" style="background: #1d1124; color: #c084fc; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100px; font-weight:bold; font-size:0.8rem; text-align:center;">
          <span style="font-size:1.6rem; margin-bottom:4px;">🌀</span>
          QUANTUM CORE RIFT
        </div>
        <span>8-PHOTO CORKBOARD &amp; CARRIER</span>
      </div>

      <div class="sticky-memo">
        <h4>UNIVERSITY WAR TIP:</h4>
        <p>Do NOT guess! A false indictment trips an emergency security strike. Eliminate all 7 suspects with verified alibis or physical impossibilities first!</p>
      </div>

      <div class="sticky-memo yellow">
        <h4>PACEMAKER WARNING:</h4>
        <p>Dr. Volkov has a pacemaker. If the crime weapon involved 50kV electrical discharge or took place in high-EM zones, he is physically excluded!</p>
      </div>
    `;
  }
}

window.LevelNullManualView = LevelNullManualView;
