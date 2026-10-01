/* ==========================================================================
   OPERATION: ZERO HOUR - MAP 5: THE TRIAD PARADOX CONFIGURATION & REGISTRY
   Case 005: "The Ouroboros Convergence" (1979 - 1999 - 2019)
   Asymmetric 3-Era Investigation, Ripple Matrix & Temporal Causality
   ========================================================================== */

window.ESCAPE_MAPS = window.ESCAPE_MAPS || {};

window.ESCAPE_MAPS['triad'] = {
  id: 'triad',
  name: 'THE TRIAD PARADOX: THE OUROBOROS CONVERGENCE',
  era: 'MAP 5 // TEMPORAL ANOMALY 1979-2019',
  baseTimer: 3000, // 50:00 minutes (Deep Asymmetric Investigation)
  danger: 'Class-Omega Paradox (LEVEL 5 MASTER)',
  modulesCount: '6 Ripple Tracks & 3-Era Investigation',
  desc: "Cross-era temporal murder mystery across 1979, 1999, and 2019. Manipulate the 6-track Ripple Matrix, investigate the sealed vault crime scene, and synthesize quantum archives before stability collapses.",

  getEnvClass() {
    return window.TriadEnvironment;
  },

  getManualRenderer() {
    return window.TriadManualView;
  },

  getIntelRenderer() {
    return window.TriadIntelView;
  },

  generateSpecs(seed, game) {
    game.timerSeconds = 3000; // 50:00 minutes base gameplay

    // Initialize or reset TriadStateManager
    if (window.TriadStateManager) {
      window.triadState = new window.TriadStateManager();
    }

    // Enable floating Ripple Matrix button across all 3 stations
    if (window.triadRippleUI) {
      window.triadRippleUI.showHUDButton(true);
      window.triadRippleUI.renderAll();
    }

    // Hook network listener for Triad events
    if (typeof network !== 'undefined' && network.onMessage) {
      network.onMessage((data) => {
        if (window.triadState) {
          window.triadState.handleNetworkEvent(data);
        }
      });
    }

    // Display Pre-Read Mission Briefing Modal on mission start
    setTimeout(() => {
      if (window.triadShowMissionBriefing) {
        window.triadShowMissionBriefing();
      }
    }, 450);
  },

  checkVictory() {
    return window.triadState ? window.triadState.isVictory : false;
  }
};

// ==========================================================================
// PRE-READ MISSION BRIEFING MODAL IMPLEMENTATION
// Explains: Move Room, Search Room, Analyze Card, Plant Item, Ripple Matrix,
// and Action Point (AP) / Chronal Round progression.
// ==========================================================================
// PRE-READ MISSION BRIEFING MODAL IMPLEMENTATION
// Explains: Move Room, Search Room, Analyze Card, Plant Item, Ripple Matrix,
// and Action Point (AP) / Chronal Round progression.
// ==========================================================================
window.triadShowMissionBriefing = function() {
  let modal = document.getElementById('triad-briefing-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'triad-briefing-modal';
    modal.className = 'triad-briefing-modal-overlay';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.onclick = function(e) {
      if (e.target === modal) {
        window.triadCloseMissionBriefing();
      }
    };
    modal.innerHTML = `
      <div class="triad-briefing-modal-card dossier-folder" onclick="event.stopPropagation();">
        <!-- VINTAGE MANILA DOSSIER TOP TAB -->
        <div class="dossier-tab-header">
          <div class="dossier-tab-ear">
            <span class="dossier-file-no">FILE // CASE-005: THE OUROBOROS CONVERGENCE</span>
            <span class="dossier-security-badge">EYES ONLY // RESTRICTED</span>
          </div>
          <button class="briefing-close-x-btn" onclick="window.triadCloseMissionBriefing()" title="Close Dossier (ESC)" aria-label="Close Dossier">✕</button>
        </div>

        <!-- DOSSIER CLASSIFIED HEADER STRIP -->
        <div class="dossier-agency-bar">
          <div class="agency-title-block">
            <div class="agency-emblem">⚡</div>
            <div class="agency-meta">
              <span class="agency-dept">TEMPORAL INTEGRITY COMMISSION • INVESTIGATION DIVISION</span>
              <h2 class="agency-case-title">OPERATIONAL FIELD DOSSIER: THE TRIAD PARADOX</h2>
              <span class="agency-era-timeline">CROSS-ERA SYNCHRONIZATION PROTOCOL (1979 • 1999 • 2019)</span>
            </div>
          </div>
          <div class="dossier-stamps-group">
            <span class="stamp-red stamp-topsecret">TOP SECRET</span>
            <span class="stamp-purple stamp-verified">3-ERA CAUSALITY</span>
          </div>
        </div>

        <!-- DOSSIER BODY (PUNCHED PAPER / LINED FIELD REPORT) -->
        <div class="briefing-body dossier-sheet">
          <!-- URGENT MEMORANDUM STRIP -->
          <div class="dossier-memo-strip">
            <span class="memo-tape"></span>
            <div class="memo-header">
              <span class="memo-label">PRIORITY MEMORANDUM:</span>
              <span class="memo-meta">SUBJECT: ASYMMETRIC 3-PLAYER CAUSALITY DISPATCH // OPEN RADIO ACTIVE</span>
            </div>
            <p class="memo-text">
              Operatives communicate via <strong>Open Radio Comms</strong> (talk freely, read all clues aloud!). Asymmetry is mechanically enforced by the system:
              <span class="dossier-role-tag role-1979">1979 Architect</span> exclusively shapes past hardware; 
              <span class="dossier-role-tag role-1999">1999 Detective</span> investigates sealed crime scenes; 
              <span class="dossier-role-tag role-2019">2019 Archivist</span> operates the quantum synthesis engine. Every physical maneuver expends <strong>Action Points (AP)</strong>.
            </p>
          </div>

          <!-- 5 OPERATIONAL DIRECTIVES (INDEX CARDS WITH ERA STAMPS) -->
          <div class="dossier-index-grid">
            <!-- 1. MOVE ROOM -->
            <div class="dossier-card card-directive">
              <div class="card-pin"></div>
              <div class="d-card-header">
                <span class="d-card-step">DIRECTIVE 01</span>
                <span class="d-card-cost">COST: 1 AP</span>
              </div>
              <h4 class="d-card-title">🚶 ROOM MOBILIZATION</h4>
              <p class="d-card-desc">
                Navigate between <strong>Nodes 1 to 5</strong> (Lab, Office, Vault, Courtyard, Security Hub). 1999 &amp; 2019 obstacles require environmental overrides from the past.
              </p>
              <div class="d-card-footer">
                <span class="d-card-tag">PHYSICAL TRAVERSAL</span>
              </div>
            </div>

            <!-- 2. SEARCH ROOM -->
            <div class="dossier-card card-directive">
              <div class="card-pin"></div>
              <div class="d-card-header">
                <span class="d-card-step">DIRECTIVE 02</span>
                <span class="d-card-cost">COST: 1 AP</span>
              </div>
              <h4 class="d-card-title">🔍 SECTOR SEARCH &amp; RECON</h4>
              <p class="d-card-desc">
                Search your sector for dossiers, tapes, and tools into your Hand. <strong>Talk freely:</strong> read clues verbatim and coordinate clues openly with Operatives 2 &amp; 3!
              </p>
              <div class="d-card-footer">
                <span class="d-card-tag">UNRESTRICTED RADIO</span>
              </div>
            </div>

            <!-- 3. ANALYZE CARD -->
            <div class="dossier-card card-directive">
              <div class="card-pin"></div>
              <div class="d-card-header">
                <span class="d-card-step">DIRECTIVE 03</span>
                <span class="d-card-cost">COST: 1 AP</span>
              </div>
              <h4 class="d-card-title">📜 PUBLIC INTEL UPLOAD</h4>
              <p class="d-card-desc">
                Upload a hand clue to the shared <strong>Public Board</strong>! Operative 3's Quantum Engine programmatically requires uploaded cards to synthesize classified revelations.
              </p>
              <div class="d-card-footer">
                <span class="d-card-tag">SYSTEM ENFORCED</span>
              </div>
            </div>

            <!-- 4. PLANT ITEM -->
            <div class="dossier-card card-directive">
              <div class="card-pin"></div>
              <div class="d-card-header">
                <span class="d-card-step">DIRECTIVE 04</span>
                <span class="d-card-cost">COST: 1 AP</span>
              </div>
              <h4 class="d-card-title">🌱 TIME CAPSULE STASH</h4>
              <p class="d-card-desc">
                <strong>1979 Architect exclusive:</strong> Stash tools or prototypes in your sector. In 1999, the Detective can spend 1 AP to <strong>SECURE</strong> the preserved evidence 20 years forward!
              </p>
              <div class="d-card-footer">
                <span class="d-card-tag">FORWARD PROPAGATION</span>
              </div>
            </div>

            <!-- 5. RIPPLE MATRIX -->
            <div class="dossier-card card-directive card-full-span">
              <div class="card-pin"></div>
              <div class="d-card-header">
                <span class="d-card-step">DIRECTIVE 05</span>
                <span class="d-card-cost highlight-ap">COST: 2 AP</span>
              </div>
              <h4 class="d-card-title">🌀 THE RIPPLE MATRIX &amp; CAUSALITY</h4>
              <p class="d-card-desc">
                The facility contains <strong>6 Causality Tracks</strong> (Bulkhead, Cryo Line, Cistern, Wall Safe, High Voltage Grid, Security Archive). Manipulations in 1979 reshape 1999 &amp; 2019 reality in real time.
                <span class="paradox-alert-text">⚠️ Contradicting verified future facts triggers an automatic Causal Paradox (-3 Stability)!</span>
              </p>
              <div class="d-card-footer">
                <span class="d-card-tag tag-causality">CAUSAL CONTINUUM ENGINE</span>
              </div>
            </div>
          </div>


          <!-- ROUND ADVANCE & STABILITY BANNER -->
          <div class="dossier-round-banner">
            <div class="round-badge-col">
              <span class="badge-icon">⏳</span>
              <span class="badge-title">ROUNDS</span>
            </div>
            <div class="round-content-col">
              <strong>ROUND ADVANCEMENT &amp; AP RECHARGE:</strong> Operatives begin each round with <strong>3 AP</strong>. Once <em>all 3 operatives spend their AP to reach 0</em>, Chronal Stability decays by -1 and all operatives immediately recharge back to 3 AP!
            </div>
          </div>
        </div>

        <!-- DOSSIER FOOTER -->
        <div class="dossier-footer">
          <div class="dossier-footer-seal">
            <span class="seal-icon">🔏</span>
            <span class="seal-text">VERIFIED BY COMMISSION CHRONAL REGISTRY // PRESS [ESC] OR [ENTER]</span>
          </div>
          <div class="dossier-footer-actions">
            <button class="btn-dossier-confirm" onclick="window.triadCloseMissionBriefing()">
              <span class="confirm-icon">✓</span>
              <span class="confirm-text">CONFIRM DIRECTIVES // OPEN INVESTIGATION</span>
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  modal.classList.remove('briefing-hidden');
  modal.classList.add('briefing-active');
  modal.style.display = 'flex';

  // Attach global keyboard listener for Escape / Enter
  if (!window._triadBriefingKeyHandler) {
    window._triadBriefingKeyHandler = function(e) {
      if (e.key === 'Escape' || e.key === 'Enter') {
        const m = document.getElementById('triad-briefing-modal');
        if (m && m.style.display !== 'none') {
          window.triadCloseMissionBriefing();
        }
      }
    };
    document.addEventListener('keydown', window._triadBriefingKeyHandler);
  }
};

window.triadCloseMissionBriefing = function() {
  const modal = document.getElementById('triad-briefing-modal');
  if (modal) {
    modal.classList.remove('briefing-active');
    modal.classList.add('briefing-hidden');
    modal.style.display = 'none';
  }
  if (window._triadBriefingKeyHandler) {
    document.removeEventListener('keydown', window._triadBriefingKeyHandler);
    window._triadBriefingKeyHandler = null;
  }
  if (window.audio && window.audio.playClick) window.audio.playClick();
};

