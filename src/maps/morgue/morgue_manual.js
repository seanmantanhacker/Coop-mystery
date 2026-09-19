/* ==========================================================================
   OPERATION: ZERO HOUR - MAP 3: THE LOCKED MORGUE MANUAL SPECIALIST VIEW
   Forensic Pathology & Crime Scene Investigation Dossier (Archivist)
   ========================================================================== */

class MorgueManualView {
  static get totalPages() {
    return 5;
  }

  static renderTabs(tabContainer) {
    if (!tabContainer) return;
    tabContainer.innerHTML = `
      <button class="binder-tab-btn active" onclick="manualView.goToSection(0)">I. TOXICOLOGY</button>
      <button class="binder-tab-btn" onclick="manualView.goToSection(1)">II. AUTOPSY</button>
      <button class="binder-tab-btn" onclick="manualView.goToSection(2)">III. DOOR PIN</button>
      <button class="binder-tab-btn" onclick="manualView.goToSection(3)">IV. LIFE SUPPORT</button>
      <button class="binder-tab-btn" onclick="manualView.goToSection(4)">V. SUSPECTS</button>
      <button class="binder-tab-btn binder-close-btn" onclick="manualView.setView('DESK_OVERVIEW')" title="Return to Desk">✕ CLOSE</button>
    `;
  }

  static renderPage(pageIdx, pageContent) {
    if (!pageContent) return;

    const pages = [
      // Page 0: Toxicology Assay & Antidote Titration
      `
        <div class="parchment-header clinical-header">
          <span class="stamp-box forensic-stamp">DEPT OF FORENSIC PATHOLOGY</span>
          <h2>SECTION I: CLINICAL TOXICOLOGY ASSAY</h2>
        </div>
        <p class="classified-caption">STANDARD POST-MORTEM TOXIN IDENTIFICATION &amp; REAGENT PROTOCOL</p>

        <div class="parchment-rule-box clinical-rule-box">
          <h3>1. Qualitative Symptom Differentiation:</h3>
          <p>Cross-reference sensory clues reported by Field Operative with the differential matrix below:</p>
        </div>

        <div class="simon-table-container">
          <table class="simon-table morgue-table">
            <thead>
              <tr>
                <th>TOXIN</th>
                <th>PRIMARY PHYSICAL SYMPTOMS</th>
                <th>CENTRIFUGE REAGENT &amp; PRECIPITATE</th>
                <th>NEUTRALIZING ANTIDOTE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Cyanide (HCN)</strong></td>
                <td>Bitter almond scent, bright blue / cyanotic fingernails, cherry lividity</td>
                <td><strong style="color:#00bcd4;">Reagent A</strong> → Prussian Blue flakes</td>
                <td>Sodium Thiosulfate</td>
              </tr>
              <tr>
                <td><strong>Strychnine</strong></td>
                <td>Facial tetanic spasm (risus sardonicus), arched spinal rigidity</td>
                <td><strong style="color:#ab47bc;">Reagent B</strong> → Violet iridescent crystal</td>
                <td>Diazepam + Charcoal</td>
              </tr>
              <tr>
                <td><strong>Arsenic</strong></td>
                <td>Garlic odor, Mees white nail bands, acute gastrointestinal necrosis</td>
                <td><strong style="color:#ffb300;">Reagent C</strong> → Yellow curd precipitate</td>
                <td>Dimercaprol (BAL)</td>
              </tr>
              <tr>
                <td><strong>Potassium Chloride</strong></td>
                <td>Forearm puncture, flaccid cardiac standstill, severe hyperkalemia</td>
                <td><strong style="color:#e0e0e0;">Reagent D</strong> → Dense white crystalline salt</td>
                <td>Calcium Gluconate</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="parchment-rule-box clinical-rule-box" style="margin-top: 14px;">
          <h3>2. Quantitative Titration Law:</h3>
          <p>Query <strong>Intel Analyst</strong> for the victim's verified Body Mass (kg) from medical records:</p>
          <div class="formula-callout">
            Titration Target (mL) = Base Volume + (Victim Mass - 70.0 kg) × Factor
          </div>
          <ul class="dossier-list">
            <li><strong>Cyanide:</strong> Base = <strong>40.0 mL</strong> | Factor = <strong>0.5 mL / kg</strong></li>
            <li><strong>Strychnine:</strong> Base = <strong>30.0 mL</strong> | Factor = <strong>0.4 mL / kg</strong></li>
            <li><strong>Arsenic:</strong> Base = <strong>50.0 mL</strong> | Factor = <strong>0.6 mL / kg</strong></li>
            <li><strong>Potassium Chloride:</strong> Base = <strong>45.0 mL</strong> | Factor = <strong>0.5 mL / kg</strong></li>
          </ul>
          <p class="matrix-footnote">⚠️ Instruct Field Operative to load correct reagent, spin centrifuge, then titrate within ±1.0 mL.</p>
        </div>
      `,

      // Page 1: Autopsy & Vital Reaction Differentiation
      `
        <div class="parchment-header clinical-header">
          <span class="stamp-box forensic-stamp">AUTOPSY PROTOCOL</span>
          <h2>SECTION II: FORENSIC WOUND DIFFERENTIATION</h2>
        </div>
        <p class="classified-caption">VITAL ANTE-MORTEM TRAUMA VS. POST-MORTEM STAGED MUTILATION</p>

        <div class="parchment-rule-box clinical-rule-box">
          <h3>CRITICAL FORENSIC DISTINCTION (VITAL REACTIONS):</h3>
          <p>The perpetrator inflicted additional cuts post-mortem to deceive the investigation. Only <strong>VITAL (Ante-Mortem)</strong> wounds caused the victim's demise!</p>
          <ul class="dossier-list">
            <li><strong style="color:#d32f2f;">VITAL (Ante-Mortem):</strong> Margins show active clotting, coagulated deep crimson cellular adhesion, and active tissue contraction/gaping.</li>
            <li><strong style="color:#78909c;">POST-MORTEM (Staged):</strong> Margins are pale, uncoagulated, washed-out, with zero vital tissue retraction.</li>
          </ul>
          <p><strong>RULE:</strong> Count ONLY wounds with confirmed <span class="glow-cyan">VITAL</span> reaction toward the door PIN trauma formula!</p>
        </div>

        <div class="simon-table-container">
          <table class="simon-table morgue-table">
            <thead>
              <tr>
                <th>WEAPON</th>
                <th>CALIPER WIDTH</th>
                <th>ANGLE OF INCISION</th>
                <th>ACCESSIBLE PERSONNEL</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Scalpel #10</strong></td>
                <td>1.5 mm - 2.5 mm</td>
                <td>70° - 85° (Right-handed steep incision)</td>
                <td>Dr. Arthur Allen (Chief Surgeon)</td>
              </tr>
              <tr>
                <td><strong>Medical Shears</strong></td>
                <td>4.0 mm - 6.0 mm</td>
                <td>45° - 60° (Left-handed notched crush)</td>
                <td>Nurse Beatrice Miller (OR Scrub)</td>
              </tr>
              <tr>
                <td><strong>Security Baton</strong></td>
                <td>8.0 mm - 12.0 mm</td>
                <td>Blunt contusion with tissue bridging</td>
                <td>Guard Charles Harris (Facility Guard)</td>
              </tr>
              <tr>
                <td><strong>Bone Saw</strong></td>
                <td>14.0 mm - 20.0 mm</td>
                <td>Serrated striation teeth marks</td>
                <td>Orderly Daniel Vance (Morgue Tech)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="matrix-footnote">Instruct Operative to measure wound caliper width and check edge coagulation on each wound site.</p>
      `,

      // Page 2: Security Airlock Door Bypass PIN
      `
        <div class="parchment-header clinical-header">
          <span class="stamp-box forensic-stamp">SECURITY PROTOCOL</span>
          <h2>SECTION III: AIRLOCK DOOR SECURITY PIN</h2>
        </div>
        <p class="classified-caption">EMERGENCY CRYPTOGRAPHIC OVERRIDE FORMULA</p>

        <div class="parchment-rule-box clinical-rule-box">
          <h3>The 4-Digit Door PIN Derivation Formula:</h3>
          <p>The facility security controller calculates the temporary door bypass code using dynamic crime scene parameters:</p>
          
          <div class="formula-callout" style="font-size: 1.05rem; padding: 12px;">
            PIN = [Victim Birth Year] - ([Vital Wounds Count] × 5) + ([Killer Security Tier] × 12)
          </div>

          <p><strong>Step-by-step Execution:</strong></p>
          <ol class="dossier-ordered-list">
            <li><strong>Victim Birth Year &amp; Access Log:</strong> Query Intel Analyst to look up the deceased's birth year in central medical records (e.g. 1958) and verify the suspect's security clearance tier via the Ward 9 Security Access Log.</li>
            <li><strong>Vital Wounds Count:</strong> Count the number of verified ante-mortem wounds from the Autopsy table (do NOT include post-mortem cuts!). Multiply by 5 and subtract.</li>
            <li><strong>Killer Security Tier:</strong> Identify the perpetrator from weapon caliper evidence + handedness matching Intel records. Take the suspect's security access tier number (Tier 1 = 1, Tier 2 = 2, Tier 3 = 3, Tier 4 = 4). Multiply by 12 and add.</li>
            <li>Instruct the Field Operative to enter the resulting 4 digits on the door keypad.</li>
          </ol>
        </div>

        <div class="parchment-rule-box clinical-rule-box" style="margin-top: 14px;">
          <h3>Example Calculation:</h3>
          <p>• Victim Year = 1962 | Vital Wounds = 3 | Killer = Nurse Miller (Tier 2)</p>
          <p>• PIN = 1962 - (3 × 5) + (2 × 12) = 1962 - 15 + 24 = <strong>1971</strong></p>
        </div>
      `,

      // Page 3: Life Support & Ventilation Exhaust
      `
        <div class="parchment-header clinical-header">
          <span class="stamp-box forensic-stamp">LIFE SUPPORT</span>
          <h2>SECTION IV: AIR DAMPER &amp; FACILITY DISPATCH</h2>
        </div>
        <p class="classified-caption">BIO-HAZARD EXHAUST DUCTWORK &amp; 3-WAY DISPATCH COORDINATION</p>

        <div class="parchment-rule-box clinical-rule-box">
          <h3>1. Atmospheric Duct Equalization Law:</h3>
          <p>The Field Operative reads the <strong>BASE DUCT CALIBRATION (PSI)</strong> on the Life Support console. Query the <strong>Intel Analyst</strong> for the active <strong>CRIME SCENE CLASSIFICATION</strong> from the central police dossier:</p>
          
          <div class="simon-table-container" style="margin: 8px 0;">
            <table class="simon-table morgue-table">
              <thead>
                <tr>
                  <th>CRIME SCENE CLASSIFICATION</th>
                  <th>PSI MODIFIER</th>
                  <th>CONTAINMENT PROTOCOL</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>CLASS A: NEUROTOXIN GAS (TABUN-VX)</strong></td>
                  <td style="color:#00e5ff; font-weight:bold;">+2.0 PSI</td>
                  <td>Heavy vapor layer displacement</td>
                </tr>
                <tr>
                  <td><strong>CLASS B: RADIOLOGICAL PATHOGEN</strong></td>
                  <td style="color:#76ff03; font-weight:bold;">+5.0 PSI</td>
                  <td>Positive-pressure bio-isolation</td>
                </tr>
                <tr>
                  <td><strong>CLASS C: HEMOTOXIC VOLATILE AGENT</strong></td>
                  <td style="color:#ffb74d; font-weight:bold;">-3.0 PSI</td>
                  <td>Negative-pressure rapid evacuation</td>
                </tr>
                <tr>
                  <td><strong>CLASS D: CRYOGENIC COOLANT RUPTURE</strong></td>
                  <td style="color:#ff5252; font-weight:bold;">-5.0 PSI</td>
                  <td>Supercooled nitrogen displacement</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="formula-callout">
            TARGET EQUALIZED PSI = BASE DUCT CALIBRATION + CLASSIFICATION MODIFIER
          </div>
          <p class="matrix-footnote">Example: Base Calibration = 35.0 PSI. Intel reports Class B (+5.0 PSI) → Target = 40.0 PSI. Operative adjusts within ±0.8 PSI tolerance.</p>
        </div>

        <div class="parchment-rule-box clinical-rule-box" style="margin-top: 10px;">
          <h3>2. Auxiliary Power Grid &amp; Breaker Trip Protocol:</h3>
          <p>If the facility experiences an auxiliary brownout or breaker trip (indicated by ⚡ OFFLINE status on consoles), digital and pneumatic controls will freeze.</p>
          <p><strong>ACTION:</strong> Instruct the <strong>Intel Analyst</strong> to trigger <code>[TRIGGER: POWER_RESET]</code> on the central dispatch console to restore auxiliary voltage.</p>
        </div>

        <div class="parchment-rule-box clinical-rule-box" style="margin-top: 10px;">
          <h3>3. Remote Vent Flush &amp; Timed Lever Throw:</h3>
          <p>The mechanical damper lever remains locked while toxic back-pressure seals the duct. To disengage:</p>
          <ol class="dossier-ordered-list">
            <li><strong>Equalize Pressure:</strong> Operative sets duct pressure to Target PSI.</li>
            <li><strong>Remote Flush:</strong> Instruct Intel Analyst to fire <code>[TRIGGER: VENT_FLUSH]</code> from the central facility console.</li>
            <li><strong>15-Second Exhaust Window:</strong> Intel Analyst must count down the <strong>15-second interlock purge window</strong> over radio!</li>
            <li><strong>Physical Lever Throw:</strong> Operative must pull the emergency damper lever while the purge window is active!</li>
          </ol>
          <p class="matrix-footnote">⚠️ If the 15-second window expires, the damper re-seals and the team must coordinate the purge again.</p>
        </div>
      `,

      // Page 4: Criminal Suspect Dossiers & Security Tiers
      `
        <div class="parchment-header clinical-header">
          <span class="stamp-box forensic-stamp">CENTRAL POLICE DOSSIER</span>
          <h2>SECTION V: SUSPECT PROFILES &amp; TIER CLEARANCE</h2>
        </div>
        <p class="classified-caption">STAFF BIOMETRICS &amp; WEAPON ACCESSIBILITY ARCHIVE</p>

        <div class="simon-table-container">
          <table class="simon-table morgue-table">
            <thead>
              <tr>
                <th>SUSPECT</th>
                <th>STATION / ROLE</th>
                <th>CLEARANCE TIER</th>
                <th>DOMINANT HAND</th>
                <th>EXCLUSIVE WEAPON ACCESS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Dr. Arthur Allen</strong></td>
                <td>Attending Chief Surgeon</td>
                <td><strong style="color:#00e5ff;">Tier 4</strong> (Full Biohazard)</td>
                <td>Right-Handed</td>
                <td>Surgical Scalpel #10</td>
              </tr>
              <tr>
                <td><strong>Nurse Beatrice Miller</strong></td>
                <td>OR Scrub Nurse</td>
                <td><strong style="color:#69f0ae;">Tier 2</strong> (Clinical Ward)</td>
                <td>Left-Handed</td>
                <td>Medical Shears (Heavy Mayo)</td>
              </tr>
              <tr>
                <td><strong>Guard Charles Harris</strong></td>
                <td>Chief of Facility Security</td>
                <td><strong style="color:#ffd740;">Tier 3</strong> (Security Grid)</td>
                <td>Right-Handed</td>
                <td>Standard Security Baton</td>
              </tr>
              <tr>
                <td><strong>Orderly Daniel Vance</strong></td>
                <td>Morgue Assistant Tech</td>
                <td><strong style="color:#ff5252;">Tier 1</strong> (Maintenance Only)</td>
                <td>Ambidextrous</td>
                <td>Electric Bone Saw</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="parchment-rule-box clinical-rule-box" style="margin-top: 14px;">
          <h3>Investigative Deduction Checklist:</h3>
          <p>1. Compare the primary fatal wound caliper width with the autopsy tool table.</p>
          <p>2. Verify incision angle and handedness (e.g. 45°-60° notch indicates left-handed weapon stroke).</p>
          <p>3. Confirm suspect's security tier with Intel Analyst before calculating the door PIN!</p>
        </div>
      `
    ];

    pageContent.innerHTML = pages[pageIdx];
  }

  static renderBoard(boardContent) {
    if (!boardContent) return;
    boardContent.innerHTML = `
      <div class="polaroid-photo" style="transform: rotate(-2deg);">
        <div class="photo-img" style="background: #111a24; color: #5ce1e6;">🔬 WARD 9 MORGUE</div>
        <span>CRIME SCENE #94-B</span>
      </div>
      <div class="sticky-memo yellow">
        <h4>VITAL WOUND WARNING:</h4>
        <p>Do NOT count post-mortem cuts! Only coagulated, retracted edges are ante-mortem vital trauma!</p>
      </div>
      <div class="sticky-memo">
        <h4>REMOTE DISPATCH PROTOCOL:</h4>
        <p>Analyst must execute [VENT_FLUSH] from central console before Defuser can pull the ceiling damper lever!</p>
      </div>
    `;
  }
}

window.MorgueManualView = MorgueManualView;
