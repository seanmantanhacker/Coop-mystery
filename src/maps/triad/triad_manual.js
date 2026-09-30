/* ==========================================================================
   OPERATION: ZERO HOUR - MAP 5: THE TRIAD PARADOX (CASE 005)
   OPERATIVE 2: 1999 THE DETECTIVE - DEDICATED CRIME SCENE WORKSTATION
   Full-Screen Station: Node Traversal, Forensic Sweeps, Autopsy & Accusation
   ========================================================================== */

class TriadManualView {
  constructor(controller) {
    this.controller = controller;
    this.activeTab = 'room'; // 'room', 'autopsy', 'suspects', 'hand', 'intel', 'notebook'
    window.triadManualInstance = this;
  }

  static get totalPages() {
    return 5;
  }

  static renderTabs(tabContainer) {
    // Legacy stub for ManualViewEngine
  }

  static renderPage(pageIdx, pageContent) {
    // Legacy stub
  }

  init() {
    this.render();
  }

  render() {
    const screenManual = document.getElementById('screen-manual');
    if (!screenManual) return;

    // Hide legacy room-viewport completely so workstation fills screen-manual
    const viewport = screenManual.querySelector('.room-viewport');
    if (viewport) viewport.classList.add('hidden');

    // Hide legacy desk room and binder modals
    const deskRoom = document.getElementById('manual-desk-room');
    const binderInspect = document.getElementById('manual-binder-inspect');
    const boardInspect = document.getElementById('manual-board-inspect');
    const backBtn = document.getElementById('manual-back-btn');
    if (deskRoom) deskRoom.classList.add('hidden');
    if (binderInspect) binderInspect.classList.add('hidden');
    if (boardInspect) boardInspect.classList.add('hidden');
    if (backBtn) backBtn.classList.add('hidden');

    // Create or locate dedicated Triad Detective Station container
    let container = document.getElementById('triad-detective-station');
    if (!container) {
      container = document.createElement('div');
      container.id = 'triad-detective-station';
      container.className = 'triad-workstation triad-1999-workstation';
      screenManual.appendChild(container);
    }
    container.classList.remove('hidden');

    if (!window.triadState && window.TriadStateManager) {
      window.triadState = new window.TriadStateManager();
    }
    const state = window.triadState;
    if (!state) return;

    const ap = state.ap['1999'];
    const currentNode = state.meepleNodes['1999'];
    const currentNodeName = state.nodeNames[currentNode - 1];
    const stab = state.chronalStability;

    // Check if in Vault (Node 3) for Forensic Sweep
    const canSweep = (currentNode === 3 && ap >= 2);
    // Check if planted item in current node
    const hasPlanted = !!state.plantedItems[currentNode];

    container.innerHTML = `
      <!-- TOP COMMAND HEADER -->
      <div class="triad-station-header glass-panel">
        <div class="station-identity">
          <span class="station-era-badge badge-1999">1999: THE DETECTIVE</span>
          <span class="station-sub-title">MILLENNIUM CRIME SCENE DESK // CASE #005</span>
        </div>
        <div class="station-metrics">
          <div class="metric-chip">
            <span class="m-label">STABILITY:</span>
            <strong class="m-val stab-val" style="color:${stab <= 5 ? '#ff3344' : (stab <= 10 ? '#f5d76e' : '#00f0ff')};">${stab}</strong>
          </div>
          <div class="metric-chip">
            <span class="m-label">ACTION POINTS:</span>
            <strong class="m-val ap-val">${ap} / 3</strong>
          </div>
          <div class="metric-chip">
            <span class="m-label">LOCATION:</span>
            <strong class="m-val loc-val">N${currentNode}: ${currentNodeName}</strong>
          </div>
          <button class="btn btn-primary btn-sm btn-matrix-toggle" onclick="triadRippleUI.openModal()">
            🌀 RIPPLE MATRIX
          </button>
        </div>
      </div>

      <!-- NODE MOVEMENT BAR -->
      <div class="triad-nodes-navbar glass-panel">
        <span class="nav-label">1999 DETECTIVE FIELD MOVEMENT (1 AP):</span>
        <div class="nodes-nav-grid">
          ${[1, 2, 3, 4, 5].map(n => {
            const isHere = (currentNode === n);
            let statusNotice = '';
            if (n === 1) {
              const ventClear = state.rippleTracks.coolantLine.state === 'DEPRESSURIZED';
              statusNotice += ventClear ? '<span class="node-tag vent">💨 VENT CRAWL OPEN</span>' : '<span class="node-tag cold">❄️ FROZEN CRYO</span>';
            } else if (n === 2) {
              const safeOpen = state.rippleTracks.directorSafe.state === 'BYPASSED';
              statusNotice += safeOpen ? '<span class="node-tag open">🔓 SAFE OPEN</span>' : '<span class="node-tag locked">🔐 SAFE LOCKED</span>';
            } else if (n === 3) {
              statusNotice += '<span class="node-tag crime">💀 CRIME SCENE</span>';
              const vaultLocked = state.rippleTracks.vaultDoor.state === 'LOCKED';
              const ventClear = state.rippleTracks.coolantLine.state === 'DEPRESSURIZED';
              if (vaultLocked && !ventClear) statusNotice += '<span class="node-tag locked">🔒 VENT FROZEN</span>';
              else if (vaultLocked && ventClear) statusNotice += '<span class="node-tag vent">💨 VENT CRAWL</span>';
              else statusNotice += '<span class="node-tag open">🚪 DOOR OPEN</span>';
            } else if (n === 4) {
              const flooded = state.rippleTracks.courtyardCistern.state === 'FLOODED';
              statusNotice += flooded ? '<span class="node-tag wet">🌊 CISTERN FLOODED</span>' : '<span class="node-tag dry">☀️ DRAINED</span>';
            } else if (n === 5) {
              const saved = state.rippleTracks.securityArchive.state === 'FARADAY_SHIELDED';
              statusNotice += saved ? '<span class="node-tag dry">🛡️ TAPES SAVED</span>' : '<span class="node-tag warning">📼 TAPES BURNT</span>';
            }
            if (state.plantedItems && state.plantedItems[n]) {
              const isBlockedFlooded = (n === 4 && state.rippleTracks.courtyardCistern.state === 'FLOODED');
              statusNotice += isBlockedFlooded 
                ? '<span class="node-tag warning">🌊 STASH SUBMERGED</span>' 
                : '<span class="node-tag planted">📦 EVIDENCE STASH</span>';
            }
            return `
              <button class="btn-node-nav ${isHere ? 'active' : ''}" onclick="triadManualInstance.onMoveNode(${n})">
                <span class="node-num-tag">NODE ${n}</span>
                <span class="node-title-tag">${state.nodeNames[n - 1]}</span>
                ${isHere ? '<span class="meeple-here-badge">YOU ARE HERE</span>' : ''}
                ${statusNotice}
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <!-- DETECTIVE ACTION TOOLBAR -->
      <div class="triad-actions-toolbar glass-panel">
        <button class="btn btn-action" onclick="triadManualInstance.onSearch()">
          🔍 SEARCH NODE (1 AP)
        </button>
        <button class="btn btn-action ${canSweep ? 'btn-highlight' : 'btn-dim'}" onclick="triadManualInstance.onSweep()">
          🔬 FORENSIC SWEEP VAULT (2 AP)
        </button>
        <button class="btn btn-action ${hasPlanted ? 'btn-highlight' : 'btn-dim'}" onclick="triadManualInstance.onSecure()">
          📦 SECURE EVIDENCE (1 AP)
        </button>
        <button class="btn btn-action btn-consensus-quick" onclick="triadManualInstance.switchTab('notebook')">
          ⚖️ CONSENSUS NOTEBOOK
        </button>
      </div>

      <!-- WORKSTATION NAVIGATION TABS -->
      <div class="triad-station-tabs">
        <button class="station-tab-btn ${this.activeTab === 'room' ? 'active' : ''}" onclick="triadManualInstance.switchTab('room')">
          🖼️ 1999 ROOM VIEW
        </button>
        <button class="station-tab-btn ${this.activeTab === 'autopsy' ? 'active' : ''}" onclick="triadManualInstance.switchTab('autopsy')">
          💀 VAULT CRIME SCENE &amp; AUTOPSY
        </button>
        <button class="station-tab-btn ${this.activeTab === 'suspects' ? 'active' : ''}" onclick="triadManualInstance.switchTab('suspects')">
          🕵️ SUSPECTS &amp; ALIBIS
        </button>
        <button class="station-tab-btn ${this.activeTab === 'hand' ? 'active' : ''}" onclick="triadManualInstance.switchTab('hand')">
          🃏 DETECTIVE HAND (${state.hands['1999'].length})
        </button>
        <button class="station-tab-btn ${this.activeTab === 'intel' ? 'active' : ''}" onclick="triadManualInstance.switchTab('intel')">
          📜 PUBLIC INTEL (${state.publicIntel.length})
        </button>
        <button class="station-tab-btn ${this.activeTab === 'notebook' ? 'active' : ''}" onclick="triadManualInstance.switchTab('notebook')">
          ⚖️ CONSENSUS VERDICT
        </button>
      </div>

      <!-- WORKSTATION TAB CONTENT VIEWPORT -->
      <div class="triad-station-body glass-panel">
        ${this.renderActiveTabContent()}
      </div>
    `;
  }

  switchTab(tabKey) {
    this.activeTab = tabKey;
    if (window.audio && window.audio.playClick) window.audio.playClick();
    this.render();
  }

  renderActiveTabContent() {
    const state = window.triadState;

    if (this.activeTab === 'room') {
      const currentNode = state ? state.meepleNodes['1999'] : 5;
      return this.render2DRoomView(currentNode, state);
    }

    if (this.activeTab === 'autopsy') {
      return `
        <div class="dossier-tab-view">
          <div class="dossier-header-banner">
            <h3>POST-MORTEM EXAMINATION // VICTIM: DR. JULIAN VANCE</h3>
            <span class="dossier-date">TIMESTAMP: 23:59:00 // DECEMBER 31, 1999</span>
          </div>

          <div class="autopsy-cards-grid">
            <div class="evidence-card glass-panel">
              <div class="e-card-header">
                <span class="e-icon">💀</span>
                <h4>THE 20-YEAR AGE DISCREPANCY</h4>
              </div>
              <p>Julian Vance was born in 1947, making him 52 years old in 1999. However, microscopic osteoblast bone density and cellular aging scans indicate this corpse is biologically <strong>72 years old</strong>!</p>
              <div class="e-keywords">
                <span class="kw-tag">[CELLULAR-DISINTEGRATION]</span>
                <span class="kw-tag">[AGE-ANOMALY]</span>
              </div>
            </div>

            <div class="evidence-card glass-panel">
              <div class="e-card-header">
                <span class="e-icon">✋</span>
                <h4>THE SEVERED BIOMETRIC PALM</h4>
              </div>
              <p>A severed human left hand was found charred beside the inner vault console. DNA analysis confirms it belongs to <strong>Dr. Maya Lin</strong>, Vance's co-creator. Kept in cryogenic preservation to bypass the biometric double-key deadbolt.</p>
              <div class="e-keywords">
                <span class="kw-tag">[BIOMETRIC-ENCRYPTION]</span>
                <span class="kw-tag">[MAYA-LIN]</span>
              </div>
            </div>

            <div class="evidence-card glass-panel">
              <div class="e-card-header">
                <span class="e-icon">⚡</span>
                <h4>ACOUSTIC 432 Hz TACHYON RESONANCE</h4>
              </div>
              <p>The victim did not suffer gunshot or blunt trauma. Cellular bonds across bone marrow were dissolved by an inverted temporal pulse calibrated to <strong>432.0 Hz</strong>, fired through the facility power conduit.</p>
              <div class="e-keywords">
                <span class="kw-tag">[RESONANCE-432HZ]</span>
                <span class="kw-tag">[DISPLACEMENT-CORE]</span>
              </div>
            </div>

            <div class="evidence-card glass-panel">
              <div class="e-card-header">
                <span class="e-icon">⏱️</span>
                <h4>SCORCHED POCKET CHRONOMETER</h4>
              </div>
              <p>Stopped at 23:44:12. Inside the casing is a microfiche stamped: <em>"Property of Vance-Cross Aerospace Corp, Serial 2019-Alpha"</em>. Proves corporate involvement from the future!</p>
              <div class="e-keywords">
                <span class="kw-tag">[CORPORATE-ACQUISITION]</span>
                <span class="kw-tag">[VALERIE-CROSS]</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (this.activeTab === 'suspects') {
      return `
        <div class="dossier-tab-view">
          <div class="dossier-header-banner">
            <h3>INTERROGATION RECORDS &amp; ALIBI ELIMINATION MATRIX</h3>
            <span class="dossier-date">MILLENNIUM INCIDENT SUSPECT POOL</span>
          </div>

          <div class="suspects-table-container">
            <table class="triad-data-table">
              <thead>
                <tr>
                  <th>SUSPECT</th>
                  <th>ROLE &amp; CLEARANCE</th>
                  <th>CLAIMED 1999 ALIBI</th>
                  <th>FORENSIC VERIFICATION</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong style="color:#00f0ff;">Dr. Marcus Rowe</strong></td>
                  <td>Chief Resonance Physicist</td>
                  <td>Trapped in Security Hub in wheelchair during EMP blackout.</td>
                  <td><span class="badge-exonerated">EXONERATED</span> Blood toxicology confirms high Haloperidol sedation at 23:15. Physically paralyzed.</td>
                </tr>
                <tr>
                  <td><strong style="color:#ff3344;">Valerie Cross</strong></td>
                  <td>Assistant Director (Logistics Liaison)</td>
                  <td>Inspecting courtyard storm drainage basin alone.</td>
                  <td><span class="badge-guilty">GUILTY</span> Mud footprints at cistern match her Size-7 boots. Lab coat stained with copper tachyon residue. Swiss wiretaps prove patent conspiracy!</td>
                </tr>
                <tr>
                  <td><strong style="color:#f5d76e;">Dr. Maya Lin</strong></td>
                  <td>Vault Architect &amp; Physicist</td>
                  <td>Reported killed in 23:42 Lab chemical explosion.</td>
                  <td><span class="badge-victim">VICTIM</span> Never triggered the blast. Severed hand was harvested by Cross to deadbolt Vance inside the Vault.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    if (this.activeTab === 'hand') {
      const hand = state.hands['1999'];
      return `
        <div class="dossier-tab-view">
          <div class="dossier-header-banner">
            <h3>DETECTIVE PRIVATE HAND</h3>
            <span class="dossier-date">OBEY THE WHISPER RULE (SUMMARIZE CONCEPTS ONLY)</span>
          </div>

          ${hand.length === 0 ? `
            <div class="empty-state-card glass-panel">
              <p>Your hand is currently empty. Conduct a <strong>FORENSIC SWEEP (2 AP)</strong> in Node 3 (Vault) or <strong>SEARCH (1 AP)</strong> to gather clues!</p>
            </div>
          ` : `
            <div class="cards-deck-grid">
              ${hand.map(card => `
                <div class="triad-card-item glass-panel">
                  <div class="c-item-header">
                    <span class="c-type-pill">${card.type}</span>
                    <h4>${card.title}</h4>
                  </div>
                  <p class="c-item-body">${card.text}</p>
                  <div class="c-item-keywords">
                    ${(card.keywords || []).map(k => `<span class="kw-tag">${k}</span>`).join(' ')}
                  </div>
                  <div class="c-item-actions">
                    <button class="btn btn-sm btn-primary" onclick="triadManualInstance.onAnalyze('${card.id}')">
                      📜 ANALYZE (1 AP - REVEAL TO TABLE)
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      `;
    }

    if (this.activeTab === 'intel') {
      const intel = state.publicIntel;
      return `
        <div class="dossier-tab-view">
          <div class="dossier-header-banner">
            <h3>PUBLIC INTEL BOARD (SYNTHESIS POOL)</h3>
            <span class="dossier-date">REVEALED INTEL ACCESSIBLE TO ALL OPERATIVES</span>
          </div>

          ${intel.length === 0 ? `
            <div class="empty-state-card glass-panel">
              <p>No cards have been Analyzed yet. Spend 1 AP in your hand to publish clues to the table!</p>
            </div>
          ` : `
            <div class="cards-deck-grid">
              ${intel.map(card => `
                <div class="triad-card-item glass-panel intel-analyzed">
                  <div class="c-item-header">
                    <span class="c-type-pill">${card.type} [BY ${card.analyzedBy || '1999'}]</span>
                    <h4>${card.title}</h4>
                  </div>
                  <p class="c-item-body">${card.text}</p>
                  <div class="c-item-keywords">
                    ${(card.keywords || []).map(k => `<span class="kw-tag">${k}</span>`).join(' ')}
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      `;
    }

    if (this.activeTab === 'notebook') {
      const nb = state.consensusNotebook;
      return `
        <div class="dossier-tab-view">
          <div class="consensus-form-card glass-panel">
            <div class="consensus-title">
              <span class="scale-icon">⚖️</span>
              <h3>THE CONSENSUS NOTEBOOK: CASE 005 VERDICT</h3>
            </div>
            <p class="consensus-desc">
              All 3 operatives must agree on the final verdict before declaring the accusation. A single discrepancy causes a divergent timeline collapse!
            </p>

            <div class="consensus-fields">
              <div class="c-field">
                <label>1. CULPRIT / ACCUSED ASSAILANT:</label>
                <select class="triad-select" onchange="window.triadState.setVerdict('culprit', this.value); triadManualInstance.render();">
                  <option value="">-- SELECT SUSPECT --</option>
                  <option value="Dr. Marcus Rowe" ${nb.culprit === 'Dr. Marcus Rowe' ? 'selected' : ''}>Dr. Marcus Rowe (Chief Physicist)</option>
                  <option value="Valerie Cross" ${nb.culprit === 'Valerie Cross' ? 'selected' : ''}>Assistant Director Valerie Cross (Logistics Liaison)</option>
                  <option value="Dr. Maya Lin" ${nb.culprit === 'Dr. Maya Lin' ? 'selected' : ''}>Dr. Maya Lin (Vault Architect)</option>
                </select>
              </div>

              <div class="c-field">
                <label>2. MURDER WEAPON &amp; FIRING METHOD:</label>
                <select class="triad-select" onchange="window.triadState.setVerdict('weapon', this.value); triadManualInstance.render();">
                  <option value="">-- SELECT WEAPON --</option>
                  <option value="Conventional .38 Revolver" ${nb.weapon === 'Conventional .38 Revolver' ? 'selected' : ''}>Conventional .38 Revolver</option>
                  <option value="Dual-Harmonic Tachyon Emitter" ${nb.weapon === 'Dual-Harmonic Tachyon Emitter' ? 'selected' : ''}>Dual-Harmonic Directed Tachyon Emitter (Project Ouroboros 432 Hz)</option>
                  <option value="Potassium Cyanide Vial" ${nb.weapon === 'Potassium Cyanide Vial' ? 'selected' : ''}>Potassium Cyanide Vial</option>
                  <option value="50kV High-Voltage Terminal Arcing" ${nb.weapon === '50kV High-Voltage Terminal Arcing' ? 'selected' : ''}>50kV High-Voltage Terminal Arcing</option>
                </select>
              </div>

              <div class="c-field">
                <label>3. MOTIVE:</label>
                <select class="triad-select" onchange="window.triadState.setVerdict('motive', this.value); triadManualInstance.render();">
                  <option value="">-- SELECT MOTIVE --</option>
                  <option value="Personal Jealousy &amp; Romantic Rejection" ${nb.motive === 'Personal Jealousy & Romantic Rejection' ? 'selected' : ''}>Personal Jealousy &amp; Romantic Rejection</option>
                  <option value="Patent Theft &amp; Temporal Assassination" ${nb.motive === 'Patent Theft & Temporal Assassination' ? 'selected' : ''}>Patent Theft, Corporate Monopolization &amp; Erasing Vance's 2019 Self</option>
                  <option value="Accidental Malfunction Cover-Up" ${nb.motive === 'Accidental Malfunction Cover-Up' ? 'selected' : ''}>Accidental Malfunction Cover-Up</option>
                </select>
              </div>
            </div>

            <div class="consensus-submit-row">
              <button class="btn btn-primary btn-large btn-accuse-large" onclick="triadRippleUI.submitAccusation()">
                ⚖️ DECLARE FINAL ACCUSATION (TRIGGER ENDGAME)
              </button>
            </div>
          </div>
        </div>
      `;
    }

    return '';
  }

  onMoveNode(nodeNum) {
    if (!window.triadState) return;
    window.triadState.moveMeeple('1999', nodeNum);
    this.activeTab = 'room'; // Immediately display the 2D room view when moving nodes!
    this.showRoomTransitNotice(nodeNum);
    this.render();
  }

  showRoomTransitNotice(nodeNum) {
    const state = window.triadState;
    const roomName = (state && state.nodeNames[nodeNum - 1]) ? state.nodeNames[nodeNum - 1] : `Node ${nodeNum}`;
    if (window.audio) {
      if (window.audio.playSlide) window.audio.playSlide();
      else if (window.audio.playClick) window.audio.playClick();
    }
    let banner = document.getElementById('triad-room-transit-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'triad-room-transit-banner';
      banner.className = 'triad-room-transit-banner';
      document.body.appendChild(banner);
    }
    banner.innerHTML = `
      <div class="transit-banner-content">
        <span class="transit-era-tag">1999 DETECTIVE // FIELD MOVEMENT</span>
        <div class="transit-room-name">
          <span class="transit-node-badge">SECTOR 0${nodeNum}</span>
          <strong>${roomName.toUpperCase()}</strong>
        </div>
        <span class="transit-status-sub">2D CRIME SCENE RECONSTRUCTION SYNCHRONIZED</span>
      </div>
    `;
    banner.classList.remove('active');
    void banner.offsetWidth;
    banner.classList.add('active');
    if (this._transitTimeout) clearTimeout(this._transitTimeout);
    this._transitTimeout = setTimeout(() => {
      banner.classList.remove('active');
    }, 2200);
  }

  render2DRoomView(nodeNum, state) {
    const roomName = state.nodeNames[nodeNum - 1];
    let roomSvg = '';
    let roomStatusBadge = '';
    let roomDesc = '';
    let hotspots = [];

    if (nodeNum === 1) {
      const ventClear = state.rippleTracks.coolantLine.state === 'DEPRESSURIZED';
      roomStatusBadge = ventClear 
        ? `<span class="room-status-badge badge-green">💨 VENTILATION DUCT VENTED // CRAWLWAY OPEN</span>`
        : `<span class="room-status-badge badge-red">❄️ CRYO PRESSURIZED // -196°C DUCT FROZEN BLOCKED</span>`;
      roomDesc = `Abandoned laboratory wing. Liquid nitrogen coolant manifolds line the walls. Glassware from 1979 sits broken across stainless steel benches.`;
      
      hotspots = [
        { key: 'coolant', title: 'COOLANT PRESSURE MANIFOLD', icon: '❄️', x: 28, y: 35, desc: ventClear ? 'Vented and depressurized. Crawlway into Vault is safe.' : 'Sub-zero cryo fog roaring. Frozen shut.' },
        { key: 'spectro', title: 'SPECTROMETER & BENCH', icon: '🧪', x: 55, y: 62, desc: 'Centrifuge and shattered vials. Detects traces of potassium cyanide and cellular degradation.' },
        { key: 'duct', title: 'VENTILATION ACCESS CRAWLWAY', icon: '💨', x: 80, y: 32, desc: ventClear ? 'Bypasses the Vault Bulkhead lock! Direct access to crime scene.' : 'Blocked by solid nitrogen frost.' }
      ];

      roomSvg = `
        <svg class="room-2d-svg" viewBox="0 0 900 380" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="labBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#0b1320" />
              <stop offset="70%" stop-color="#162232" />
              <stop offset="100%" stop-color="#090d14" />
            </linearGradient>
            <linearGradient id="coolPipe" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#0284c7" />
              <stop offset="50%" stop-color="#38bdf8" />
              <stop offset="100%" stop-color="#0369a1" />
            </linearGradient>
          </defs>
          <rect width="900" height="380" fill="url(#labBg)" />
          <!-- Ceiling Pipes -->
          <rect x="0" y="40" width="900" height="18" fill="url(#coolPipe)" opacity="0.8" />
          <rect x="0" y="65" width="900" height="10" fill="#334155" />
          <!-- Tile Floor -->
          <polygon points="0,260 900,260 900,380 0,380" fill="#131b26" />
          <line x1="0" y1="260" x2="900" y2="260" stroke="#0284c7" stroke-width="2" opacity="0.5" />
          ${[100, 250, 400, 550, 700, 850].map(x => `<line x1="${x}" y1="260" x2="${x - 60}" y2="380" stroke="#1e293b" stroke-width="1.5" />`).join('')}
          <!-- Lab Counter -->
          <rect x="180" y="210" width="540" height="90" fill="#1e293b" stroke="#334155" stroke-width="2" rx="4" />
          <rect x="180" y="210" width="540" height="12" fill="#475569" />
          <!-- Oscilloscope on bench -->
          <rect x="220" y="150" width="110" height="60" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5" rx="3" />
          <rect x="230" y="160" width="50" height="38" fill="#022c22" stroke="#10b981" />
          <path d="M 235,179 Q 245,165 255,179 T 275,179" fill="none" stroke="#10b981" stroke-width="2" />
          <!-- Coolant Manifold Valve -->
          <circle cx="250" cy="100" r="30" fill="none" stroke="${ventClear ? '#10b981' : '#ef4444'}" stroke-width="8" />
          <circle cx="250" cy="100" r="8" fill="#d97706" />
          <line x1="220" y1="100" x2="280" y2="100" stroke="#d97706" stroke-width="4" />
          <line x1="250" y1="70" x2="250" y2="130" stroke="#d97706" stroke-width="4" />
          <!-- Reagent Flasks & Yellow Evidence Tent -->
          <polygon points="560,200 580,170 590,170 610,200" fill="rgba(56, 189, 248, 0.4)" stroke="#38bdf8" />
          <polygon points="500,210 515,185 530,210" fill="#fbbf24" stroke="#000" />
          <text x="515" y="204" font-size="12" font-weight="900" fill="#000" text-anchor="middle">#02</text>
          <!-- Vent Crawlway Hatch -->
          <rect x="710" y="100" width="100" height="120" fill="#0f172a" stroke="${ventClear ? '#10b981' : '#ef4444'}" stroke-width="3" rx="4" />
          ${ventClear ? `
            <text x="760" y="165" font-size="13" font-weight="800" fill="#10b981" text-anchor="middle">OPEN</text>
            <text x="760" y="185" font-size="10" fill="#94a3b8" text-anchor="middle">CRAWLWAY</text>
          ` : `
            <text x="760" y="165" font-size="13" font-weight="800" fill="#ef4444" text-anchor="middle">FROZEN</text>
            <text x="760" y="185" font-size="10" fill="#94a3b8" text-anchor="middle">-196°C</text>
          `}
          <!-- Fog Overlay when frozen -->
          ${!ventClear ? `
            <rect x="0" y="230" width="900" height="150" fill="url(#labBg)" opacity="0.35" />
            <path d="M 0,320 Q 200,290 450,320 T 900,310 L 900,380 L 0,380 Z" fill="rgba(147, 197, 253, 0.25)" />
          ` : ''}
        </svg>
      `;
    } else if (nodeNum === 2) {
      const safeOpen = state.rippleTracks.directorSafe.state === 'BYPASSED';
      roomStatusBadge = safeOpen
        ? `<span class="room-status-badge badge-green">🔓 BIOMETRIC SAFE BYPASSED // PATENT DOSSIER EXPOSED</span>`
        : `<span class="room-status-badge badge-red">🔐 DUAL-BIOMETRIC DEADBOLT ENGAGED // VANCE &amp; LIN IMPRINT REQUIRED</span>`;
      roomDesc = `Dr. Julian Vance's private executive suite. Drawers pulled out, files scattered across the floor, rain beating on dark window glass.`;

      hotspots = [
        { key: 'safe', title: 'BIOMETRIC WALL SAFE', icon: '🔐', x: 78, y: 45, desc: safeOpen ? 'Safe unlatched with bypass ribbon cables. Julian Vance’s secret ledger revealed.' : 'Calibrated to Vance and Lin’s palm prints. Bypassed by severed hand or 1979 override.' },
        { key: 'desk', title: "VANCE'S MAHOGANY DESK", icon: '📁', x: 42, y: 65, desc: 'Executive desk calendar turned to DEC 31, 1999: "Ouroboros Convergence at Midnight".' },
        { key: 'bookcase', title: 'SECRET BOOKCASE COMPARTMENT', icon: '📚', x: 18, y: 48, desc: 'Hollowed book contains patent disputes between Dr. Marcus Rowe and Julian Vance.' }
      ];

      roomSvg = `
        <svg class="room-2d-svg" viewBox="0 0 900 380" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="officeWall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#241006" />
              <stop offset="70%" stop-color="#3d1b09" />
              <stop offset="100%" stop-color="#180a04" />
            </linearGradient>
          </defs>
          <rect width="900" height="380" fill="url(#officeWall)" />
          <!-- Gothic Arched Window with Rain -->
          <path d="M 380,30 Q 450,-10 520,30 L 520,180 L 380,180 Z" fill="#0f172a" stroke="#78350f" stroke-width="4" />
          <line x1="450" y1="10" x2="450" y2="180" stroke="#78350f" stroke-width="3" />
          <line x1="380" y1="100" x2="520" y2="100" stroke="#78350f" stroke-width="3" />
          <!-- Raindrops on glass -->
          ${[400, 420, 460, 490, 510].map(rx => `<line x1="${rx}" y1="${30 + (rx % 30)}" x2="${rx - 5}" y2="${70 + (rx % 40)}" stroke="#38bdf8" stroke-width="1.2" opacity="0.6" />`).join('')}
          <!-- Floor with Persian Rug -->
          <polygon points="0,260 900,260 900,380 0,380" fill="#261007" />
          <polygon points="200,270 700,270 750,370 150,370" fill="#7f1d1d" stroke="#f59e0b" stroke-width="2" />
          <!-- Executive Bookcase -->
          <rect x="60" y="70" width="130" height="210" fill="#3b1d11" stroke="#522514" stroke-width="3" />
          ${[110, 160, 210].map(sy => `<line x1="60" y1="${sy}" x2="190" y2="${sy}" stroke="#78350f" stroke-width="3" />`).join('')}
          <!-- Executive Desk -->
          <rect x="300" y="210" width="300" height="95" fill="#451a03" stroke="#78350f" stroke-width="3" rx="4" />
          <rect x="360" y="215" width="180" height="10" fill="#1e293b" />
          <!-- Overturned Chair -->
          <rect x="250" y="250" width="40" height="50" fill="#15803d" transform="rotate(-35 250 250)" />
          <!-- Biometric Wall Safe -->
          <rect x="670" y="100" width="130" height="130" fill="#1e293b" stroke="#475569" stroke-width="4" rx="4" />
          <circle cx="735" cy="165" r="35" fill="#0f172a" stroke="${safeOpen ? '#10b981' : '#f59e0b'}" stroke-width="4" />
          <circle cx="735" cy="165" r="10" fill="#d97706" />
          <circle cx="770" cy="120" r="5" fill="${safeOpen ? '#10b981' : '#ef4444'}" />
          ${safeOpen ? `
            <!-- Open Safe Door -->
            <polygon points="800,100 860,80 860,210 800,230" fill="#334155" stroke="#64748b" />
            <text x="735" y="170" font-size="11" font-weight="800" fill="#10b981" text-anchor="middle">BYPASSED</text>
          ` : `
            <text x="735" y="170" font-size="11" font-weight="800" fill="#ef4444" text-anchor="middle">LOCKED</text>
          `}
          <!-- Scattered papers -->
          <polygon points="340,320 370,315 375,340 345,345" fill="#f8fafc" opacity="0.85" />
          <polygon points="520,330 550,325 555,350 525,355" fill="#f8fafc" opacity="0.85" />
          <polygon points="460,335 475,310 490,335" fill="#fbbf24" stroke="#000" />
          <text x="475" y="329" font-size="11" font-weight="900" fill="#000" text-anchor="middle">#04</text>
        </svg>
      `;
    } else if (nodeNum === 3) {
      const vaultLocked = state.rippleTracks.vaultDoor.state === 'LOCKED';
      roomStatusBadge = vaultLocked
        ? `<span class="room-status-badge badge-red">💀 GROUND ZERO CRIME SCENE // BULKHEAD SEALED</span>`
        : `<span class="room-status-badge badge-green">🚪 CRIME SCENE UNSEALED // TACHYON CORE ACCESSIBLE</span>`;
      roomDesc = `The primary crime scene of Case 005. Julian Vance's corpse lies in front of the colossal circular vault bulkhead. Police caution tape and flashing strobes cordon off the chamber.`;

      hotspots = [
        { key: 'corpse', title: "JULIAN VANCE'S CORPSE OUTLINE", icon: '💀', x: 42, y: 70, desc: 'Age Discrepancy: Corpse is biologically 72 years old (expected 52). Bone marrow dissolved by 432 Hz inverted temporal pulse.' },
        { key: 'hand', title: "SEVERED CRYOGENIC HAND", icon: '✋', x: 26, y: 74, desc: "Found in cryo cooler. Belongs to Dr. Maya Lin. Used to bypass biometric deadbolt." },
        { key: 'bulkhead', title: "CIRCULAR VAULT BULKHEAD", icon: '🚪', x: 50, y: 35, desc: vaultLocked ? "Sealed titanium blast door. 8 locking lugs engaged." : "Unlocked! Tachyon singularity spinning within." },
        { key: 'sweep', title: "CONDUCT FORENSIC SWEEP (2 AP)", icon: '🔬', x: 74, y: 70, desc: "Perform comprehensive luminol, ballistics, and spectrographic sweep of Ground Zero." }
      ];

      roomSvg = `
        <svg class="room-2d-svg" viewBox="0 0 900 380" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="vaultBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#090a12" />
              <stop offset="70%" stop-color="#141724" />
              <stop offset="100%" stop-color="#07080f" />
            </linearGradient>
            <radialGradient id="policeStrobe" cx="0.5" cy="0.3" r="0.5">
              <stop offset="0%" stop-color="rgba(239, 68, 68, 0.3)" />
              <stop offset="50%" stop-color="rgba(59, 130, 246, 0.2)" />
              <stop offset="100%" stop-color="rgba(0,0,0,0)" />
            </radialGradient>
          </defs>
          <rect width="900" height="380" fill="url(#vaultBg)" />
          <rect width="900" height="380" fill="url(#policeStrobe)" />
          <!-- Heavy Blast Archway -->
          <polygon points="120,40 160,70 160,270 120,270" fill="#1e293b" />
          <polygon points="780,40 740,70 740,270 780,270" fill="#1e293b" />
          <polygon points="120,40 780,40 740,70 160,70" fill="#334155" />
          <!-- Massive Circular Titanium Bulkhead Door -->
          <circle cx="450" cy="150" r="110" fill="#1e293b" stroke="#475569" stroke-width="8" />
          <circle cx="450" cy="150" r="85" fill="#0f172a" stroke="#64748b" stroke-width="4" />
          <!-- 8 Locking Lugs -->
          ${[0, 45, 90, 135, 180, 225, 270, 315].map(deg => {
            const rad = deg * Math.PI / 180;
            const lx = 450 + Math.cos(rad) * 95;
            const ly = 150 + Math.sin(rad) * 95;
            return `<rect x="${lx - 10}" y="${ly - 10}" width="20" height="20" fill="#eab308" transform="rotate(${deg} ${lx} ${ly})" stroke="#000" />`;
          }).join('')}
          ${!vaultLocked ? `
            <!-- Open Core Tachyon Glow -->
            <circle cx="450" cy="150" r="60" fill="#a855f7" opacity="0.8" />
            <circle cx="450" cy="150" r="30" fill="#c084fc" />
          ` : `
            <text x="450" y="155" font-size="14" font-weight="900" fill="#eab308" text-anchor="middle">SEALED</text>
          `}
          <!-- Blast Floor -->
          <polygon points="0,260 900,260 900,380 0,380" fill="#0d111a" />
          <!-- White Chalk Body Outline of Julian Vance -->
          <path d="M 370,290 C 370,280 390,280 390,290 C 390,300 410,310 430,305 C 440,300 450,315 440,325 C 430,335 410,330 400,345 C 390,360 370,360 365,345 C 355,330 350,310 370,290 Z" fill="none" stroke="#f8fafc" stroke-width="2.5" stroke-dasharray="6,3" />
          <!-- Blood Spatter -->
          <circle cx="420" cy="315" r="8" fill="#991b1b" opacity="0.8" />
          <circle cx="435" cy="320" r="4" fill="#991b1b" opacity="0.7" />
          <!-- Severed Hand Cooler Box -->
          <rect x="210" y="275" width="55" height="40" fill="#0284c7" stroke="#38bdf8" stroke-width="2" rx="3" />
          <rect x="205" y="270" width="65" height="8" fill="#e0f2fe" />
          <text x="237" y="298" font-size="10" font-weight="800" fill="#fff" text-anchor="middle">CRYO</text>
          <!-- Evidence Markers -->
          <polygon points="330,330 345,305 360,330" fill="#fbbf24" stroke="#000" />
          <text x="345" y="324" font-size="11" font-weight="900" fill="#000" text-anchor="middle">#01</text>
          <polygon points="460,340 475,315 490,340" fill="#fbbf24" stroke="#000" />
          <text x="475" y="334" font-size="11" font-weight="900" fill="#000" text-anchor="middle">#05</text>
          <!-- Yellow Police Caution Tape Strip -->
          <polygon points="0,70 900,120 900,145 0,95" fill="#facc15" opacity="0.85" />
          <polygon points="0,70 900,120 900,145 0,95" fill="none" stroke="#000" stroke-width="2" />
          ${[50, 180, 310, 440, 570, 700, 830].map(tx => `<text x="${tx}" y="112" font-size="12" font-weight="900" fill="#000" transform="rotate(3 ${tx} 112)">POLICE LINE DO NOT CROSS</text>`).join('')}
        </svg>
      `;
    } else if (nodeNum === 4) {
      const flooded = state.rippleTracks.courtyardCistern.state === 'FLOODED';
      const hasPlanted = !!state.plantedItems[4];
      roomStatusBadge = flooded
        ? `<span class="room-status-badge badge-blue">🌊 CISTERN FLOODED // GRATE SUBMERGED UNDER 10FT RUNOFF</span>`
        : `<span class="room-status-badge badge-green">☀️ CISTERN DRAINED // SUBTERRANEAN ACCESS CLEAR</span>`;
      roomDesc = `Rain-slicked subterranean drainage courtyard. Storm runoff cascades from roof spouts into the central concrete cistern pit.`;

      hotspots = [
        { key: 'grate', title: 'SUBTERRANEAN CISTERN GRATE', icon: '🌊', x: 50, y: 70, desc: flooded ? 'Underwater! Grate is covered by 10 feet of churning storm runoff.' : 'Drained and accessible. Cast-iron bars exposed over subterranean culvert.' },
        { key: 'downspout', title: 'RUNOFF DOWNPIPE & VALVE', icon: '🌧️', x: 20, y: 40, desc: 'Stormwater bypass line. Linked to the 1979 hydraulic valve routing.' }
      ];

      if (hasPlanted) {
        hotspots.push({
          key: 'stash',
          title: 'PLANTED TIME CAPSULE BOX',
          icon: '📦',
          x: 58,
          y: 65,
          desc: flooded ? 'Stash submerged underwater! Drain the cistern in 1979 to retrieve.' : 'Recovered time capsule sitting in the dried mud! Click to secure.'
        });
      }

      roomSvg = `
        <svg class="room-2d-svg" viewBox="0 0 900 380" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="courtyardSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#030712" />
              <stop offset="60%" stop-color="#0f172a" />
              <stop offset="100%" stop-color="#1e293b" />
            </linearGradient>
            <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#0284c7" stop-opacity="0.8" />
              <stop offset="100%" stop-color="#082f49" stop-opacity="0.95" />
            </linearGradient>
          </defs>
          <rect width="900" height="380" fill="url(#courtyardSky)" />
          <!-- Brick Walls -->
          <rect x="0" y="40" width="200" height="230" fill="#1e293b" stroke="#334155" stroke-width="2" />
          <rect x="700" y="40" width="200" height="230" fill="#1e293b" stroke="#334155" stroke-width="2" />
          <!-- Storm Rain Streaks -->
          ${[40, 110, 190, 260, 340, 420, 500, 580, 660, 740, 820].map(rx => `<line x1="${rx}" y1="20" x2="${rx - 25}" y2="280" stroke="#38bdf8" stroke-width="1.2" opacity="0.4" stroke-dasharray="8,12" />`).join('')}
          <!-- Courtyard Paved Floor -->
          <polygon points="0,260 900,260 900,380 0,380" fill="#0f172a" />
          <!-- Sunken Cistern Pit -->
          <polygon points="250,260 650,260 700,360 200,360" fill="#090d16" stroke="#475569" stroke-width="3" />
          ${flooded ? `
            <!-- Water Body -->
            <polygon points="255,270 645,270 690,355 210,355" fill="url(#waterGrad)" />
            <path d="M 230,290 Q 350,280 470,290 T 670,290" fill="none" stroke="#38bdf8" stroke-width="2" opacity="0.7" />
            <path d="M 220,320 Q 360,310 500,320 T 680,320" fill="none" stroke="#38bdf8" stroke-width="2" opacity="0.5" />
            <text x="450" y="320" font-size="14" font-weight="900" fill="#bae6fd" text-anchor="middle">SUBMERGED 10 FT</text>
          ` : `
            <!-- Drained Pit with Cast-Iron Grate -->
            <rect x="350" y="280" width="200" height="60" fill="#1e293b" stroke="#000" stroke-width="3" />
            ${[370, 390, 410, 430, 450, 470, 490, 510, 530].map(gx => `<line x1="${gx}" y1="280" x2="${gx}" y2="340" stroke="#000" stroke-width="4" />`).join('')}
            <text x="450" y="315" font-size="12" font-weight="900" fill="#10b981" text-anchor="middle">DRAINED // ACCESSIBLE</text>
          `}
          <!-- Planted Item Glow if Drained -->
          ${hasPlanted && !flooded ? `
            <rect x="520" y="295" width="30" height="24" fill="#fbbf24" stroke="#d97706" stroke-width="2" rx="3" />
            <text x="535" y="311" font-size="12" text-anchor="middle">📦</text>
          ` : ''}
          <!-- Downspout on Left Wall -->
          <rect x="160" y="40" width="16" height="230" fill="#475569" stroke="#64748b" />
        </svg>
      `;
    } else if (nodeNum === 5) {
      const saved = state.rippleTracks.securityArchive.state === 'FARADAY_SHIELDED';
      roomStatusBadge = saved
        ? `<span class="room-status-badge badge-green">🛡️ FARADAY SHIELD SECURE // SURVEILLANCE TAPES INTACT</span>`
        : `<span class="room-status-badge badge-red">📼 UNSHIELDED // EMP SURGE DESTROYED MAGNETIC TAPES</span>`;
      roomDesc = `Security mainframe control room. Racks of reel-to-reel magnetic backup drives and phosphor green CRT monitors hum in the darkness.`;

      hotspots = [
        { key: 'tapes', title: 'SURVEILLANCE TAPE DRIVES', icon: '📼', x: 25, y: 45, desc: saved ? 'Protected in lead Faraday enclosure. Complete audio logs from 23:50 to midnight recovered!' : 'Blackened and charred by electromagnetic pulse. Tapes corrupted.' },
        { key: 'crt', title: 'SURVEILLANCE CRT MONITORS', icon: '📺', x: 55, y: 55, desc: 'Flickering screens show security feed frozen at 23:59:00 with shadowy figure fleeing the Vault.' },
        { key: 'badge', title: 'RESTRICTED ACCESS BADGE LOG', icon: '🗄️', x: 78, y: 65, desc: 'Logs Julian Vance, Dr. Maya Lin, and Valerie Cross entering the facility prior to incident.' }
      ];

      roomSvg = `
        <svg class="room-2d-svg" viewBox="0 0 900 380" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="secBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#02140d" />
              <stop offset="70%" stop-color="#062e1d" />
              <stop offset="100%" stop-color="#020d09" />
            </linearGradient>
          </defs>
          <rect width="900" height="380" fill="url(#secBg)" />
          <!-- Server Racks on Left -->
          <rect x="80" y="50" width="220" height="230" fill="#0f172a" stroke="#334155" stroke-width="3" rx="4" />
          <!-- 4 Tape Reels -->
          ${[[140, 110], [240, 110], [140, 190], [240, 190]].map(([rx, ry], idx) => `
            <circle cx="${rx}" cy="${ry}" r="32" fill="${saved ? '#94a3b8' : '#334155'}" stroke="${saved ? '#10b981' : '#ef4444'}" stroke-width="3" />
            <circle cx="${rx}" cy="${ry}" r="10" fill="#000" />
            <line x1="${rx - 25}" y1="${ry}" x2="${rx + 25}" y2="${ry}" stroke="#000" stroke-width="2" />
          `).join('')}
          ${saved ? `
            <rect x="75" y="45" width="230" height="240" fill="none" stroke="#10b981" stroke-width="2" stroke-dasharray="6,4" />
            <text x="190" y="260" font-size="11" font-weight="900" fill="#10b981" text-anchor="middle">FARADAY SHIELD: ACTIVE</text>
          ` : `
            <text x="190" y="260" font-size="11" font-weight="900" fill="#ef4444" text-anchor="middle">EMP BURN: CORRUPTED</text>
          `}
          <!-- Operator Desk & CRT Monitors -->
          <polygon points="0,260 900,260 900,380 0,380" fill="#04120a" />
          <rect x="380" y="200" width="460" height="100" fill="#132a1e" stroke="#10b981" stroke-width="2" rx="4" />
          <!-- 3 CRT Monitors -->
          ${[410, 560, 710].map((mx, idx) => `
            <rect x="${mx}" y="120" width="120" height="90" fill="#0f172a" stroke="#10b981" stroke-width="2" rx="4" />
            <rect x="${mx + 10}" y="130" width="100" height="70" fill="#022c22" stroke="#059669" />
            <!-- Scanlines -->
            <line x1="${mx + 10}" y1="150" x2="${mx + 110}" y2="150" stroke="#10b981" opacity="0.5" />
            <line x1="${mx + 10}" y1="170" x2="${mx + 110}" y2="170" stroke="#10b981" opacity="0.5" />
            <text x="${mx + 60}" y="168" font-size="10" font-weight="800" fill="#10b981" text-anchor="middle">CAM 0${idx + 1}: 23:59</text>
          `).join('')}
        </svg>
      `;
    }

    return `
      <div class="triad-2d-room-viewport">
        <!-- Room Identity Banner -->
        <div class="room-2d-header">
          <div class="room-title-col">
            <div class="room-tag-line">
              <span class="room-era-pill badge-1999">1999 DETECTIVE SCENE</span>
              <span class="room-sector-pill">SECTOR 0${nodeNum}</span>
            </div>
            <h3 class="room-name-text">${roomName.toUpperCase()}</h3>
            <p class="room-desc-text">${roomDesc}</p>
          </div>
          <div class="room-status-col">
            ${roomStatusBadge}
          </div>
        </div>

        <!-- 2D Illustrated Stage -->
        <div class="room-stage-wrapper">
          ${roomSvg}
          <!-- Interactive Hotspot Badges overlaid on top of scene -->
          <div class="room-hotspots-overlay">
            ${hotspots.map((hs, i) => `
              <div class="room-hotspot-pin" style="left: ${hs.x}%; top: ${hs.y}%;" onclick="triadManualInstance.inspectHotspot(${nodeNum}, '${hs.key}')" title="${hs.title}">
                <div class="hotspot-pulse"></div>
                <div class="hotspot-core">${hs.icon}</div>
                <span class="hotspot-label">${hs.title}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Room Action & Evidence Roster Bar -->
        <div class="room-roster-bar">
          <div class="roster-left">
            <button class="btn btn-action" onclick="triadManualInstance.onSearch()">
              🔍 SEARCH ${roomName.toUpperCase()} (1 AP)
            </button>
            ${state.plantedItems[nodeNum] ? `
              <button class="btn btn-action btn-highlight" onclick="triadManualInstance.onSecure()">
                📦 SECURE STASHED EVIDENCE (1 AP)
              </button>
            ` : ''}
            ${nodeNum === 3 ? `
              <button class="btn btn-action btn-highlight" onclick="triadManualInstance.onSweep()">
                🔬 CONDUCT FORENSIC SWEEP (2 AP)
              </button>
            ` : ''}
          </div>
          <div class="roster-right">
            <button class="btn btn-outline" onclick="triadManualInstance.switchTab('autopsy')">
              📋 FULL AUTOPSY DOSSIER
            </button>
            <button class="btn btn-outline" onclick="triadManualInstance.switchTab('suspects')">
              🕵️ SUSPECT ALIBIS
            </button>
          </div>
        </div>
      </div>
    `;
  }

  inspectHotspot(nodeNum, key) {
    const state = window.triadState;
    if (window.audio && window.audio.playClick) window.audio.playClick();

    let title = 'CRIME SCENE EVIDENCE';
    let icon = '🔍';
    let details = '';
    let deduction = '';

    if (nodeNum === 1) {
      if (key === 'coolant') {
        const cool = state.rippleTracks.coolantLine.state === 'DEPRESSURIZED';
        title = 'COOLANT PRESSURE MANIFOLD'; icon = '❄️';
        details = cool 
          ? 'The 1979 hydraulic valve was successfully vented! The cryo duct crawlway into the vault is warm and clear.'
          : 'Cryo line is pressurized at -196°C. Vents are choked with blinding nitrogen fog, blocking direct ventilation access to the vault.';
        deduction = 'Requires 1979 Architect to spend 2 AP on the Ripple Matrix to depressurize the coolant line.';
      } else if (key === 'spectro') {
        title = 'SPECTROMETER & SHATTERED VIALS'; icon = '🧪';
        details = 'Centrifuge tray shows broken glass ampoules. Chemical test identifies traces of Potassium Cyanide alongside high-voltage ozone ionization.';
        deduction = 'Matches the secondary alibi evidence. Dr. Marcus Rowe checked out biochemistry clearance on Dec 31, 1999.';
      } else {
        title = 'VENTILATION ACCESS CRAWLWAY'; icon = '💨';
        details = 'A maintenance crawlway connecting Sector 1 (Lab) directly behind the sealed vault door.';
        deduction = 'If vented, Operative 2 can enter the vault even while the main circular blast door remains locked.';
      }
    } else if (nodeNum === 2) {
      if (key === 'safe') {
        const bypassed = state.rippleTracks.directorSafe.state === 'BYPASSED';
        title = "DIRECTOR'S BIOMETRIC WALL SAFE"; icon = '🔐';
        details = bypassed 
          ? 'Safe deadbolt is unlatched. Inside rests Julian Vance’s handwritten cipher diary and the Ouroboros patent license.'
          : 'High-security double biometric deadbolt. Requires simultaneous right hand of Julian Vance and left hand of Dr. Maya Lin.';
        deduction = 'Can be unlocked either by 1979 Architect bypassing the safe track on the Ripple Matrix, or using the severed cryogenic hand.';
      } else if (key === 'desk') {
        title = "JULIAN VANCE'S DESK CALENDAR"; icon = '📁';
        details = 'Desk calendar marked with urgent red circle: "Midnight DEC 31, 1999: Initiate Ouroboros Convergence. Erase 2019 divergent thread."';
        deduction = 'Reveals Julian Vance knew of his future 2019 counterpart and was attempting a temporal reset.';
      } else {
        title = 'HIDDEN BOOKCASE JOURNAL'; icon = '📚';
        details = 'Dr. Maya Lin’s private laboratory notes describing how the tachyon emitter was calibrated to harmonic 432 Hz to bypass biological cellular bonds.';
        deduction = 'Confirmed murder weapon firing frequency: 432.000 Hz!';
      }
    } else if (nodeNum === 3) {
      if (key === 'corpse') {
        title = "POST-MORTEM: DR. JULIAN VANCE'S CORPSE"; icon = '💀';
        details = 'Corpse age discrepancy: Born in 1947, should be 52 years old in 1999. Microscopic osteoblast bone density proves corpse is biologically 72 years old!';
        deduction = 'The victim was killed by his own 2019 future self via temporal tachyon displacement!';
      } else if (key === 'hand') {
        title = "THE SEVERED CRYOGENIC HAND"; icon = '✋';
        details = 'Frozen human left hand found in a medical cooler box. DNA analysis confirms it belongs to Dr. Maya Lin, preserved at -196°C.';
        deduction = 'The assailant severed Maya Lin’s hand to bypass the biometric double-key deadbolt on the Vault and Office Safe.';
      } else if (key === 'sweep') {
        this.onSweep();
        return;
      } else {
        title = 'CIRCULAR TITANIUM BULKHEAD DOOR'; icon = '🚪';
        details = 'Massive 8-lug blast door sealing the temporal core. Ionized scorch marks show a directed tachyon pulse ruptured the locks from the outside.';
        deduction = 'Can be unsealed via 1979 Ripple Matrix or bypassed via the ventilation crawlway.';
      }
    } else if (nodeNum === 4) {
      const flooded = state.rippleTracks.courtyardCistern.state === 'FLOODED';
      if (key === 'stash') {
        this.onSecure();
        return;
      } else if (key === 'grate') {
        title = 'SUBTERRANEAN CISTERN GRATE'; icon = '🌊';
        details = flooded
          ? 'Basin is filled with 10 feet of turbulent dark storm water. Heavy iron grate is totally submerged.'
          : 'Cistern is drained! Muddy culvert and iron grate exposed. Dropped evidence can now be reached safely.';
        deduction = 'Requires 1979 Architect to drain the cistern using the Ripple Matrix.';
      } else {
        title = 'STORM RUNOFF VALVE'; icon = '🌧️';
        details = 'Industrial drainage bypass. Rainwater from the city storm sewer cascades through these pipes.';
        deduction = 'Cross-references the 1979 courtyard drainage schematics.';
      }
    } else if (nodeNum === 5) {
      const saved = state.rippleTracks.securityArchive.state === 'FARADAY_SHIELDED';
      if (key === 'tapes') {
        title = 'SURVEILLANCE BACKUP TAPES'; icon = '📼';
        details = saved
          ? 'Enclosed inside a heavy lead-lined Faraday shielding box! All magnetic surveillance reels from Dec 31, 1999 are 100% intact.'
          : 'Scorched and demagnetized by high-voltage EMP surge. Tape ribbons melted to plastic hubs.';
        deduction = saved ? 'Full security logs can be analyzed into Public Intel!' : 'Requires Faraday Shield track in 1979.';
      } else if (key === 'crt') {
        title = 'SECURITY CRT MONITORS'; icon = '📺';
        details = 'Screen 2 captures a silhouette in a heavy winter trenchcoat entering the vault airlock at 23:54:12.';
        deduction = 'Matches physical stature of Chief Physicist Dr. Marcus Rowe.';
      } else {
        title = 'RESTRICTED KEYCARD ACCESS LOG'; icon = '🗄️';
        details = 'Keycard audit terminal: Keycard #04 was swiped into Sector 3 at 23:52:00.';
        deduction = 'Keycard #04 was officially issued to Assistant Director Valerie Cross!';
      }
    }

    let modal = document.getElementById('triad-evidence-inspect-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'triad-evidence-inspect-modal';
      modal.className = 'triad-modal-overlay';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="triad-modal-card evidence-inspect-card" style="max-width: 580px;">
        <div class="triad-modal-header" style="background: rgba(20, 26, 38, 0.95); border-bottom: 2px solid #f59e0b;">
          <div class="triad-header-title">
            <h3 style="color: #fbbf24; display: flex; align-items: center; gap: 8px; margin: 0;">
              <span>${icon}</span> ${title}
            </h3>
            <span class="triad-case-tag" style="color: #94a3b8;">1999 FORENSIC ANALYSIS // SECTOR 0${nodeNum}</span>
          </div>
          <button class="modal-close-btn" onclick="triadManualInstance.closeInspectModal()">✕</button>
        </div>
        <div class="triad-modal-body" style="padding: 20px; font-family: 'Rajdhani', sans-serif; font-size: 1.05rem; line-height: 1.5; color: #e2e8f0;">
          <div style="background: rgba(0, 0, 0, 0.4); border-left: 4px solid #38bdf8; padding: 12px 16px; border-radius: 4px; margin-bottom: 16px;">
            <strong style="color: #38bdf8; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">OBSERVED PHYSICAL EVIDENCE:</strong>
            <p style="margin: 0; font-size: 0.95rem; color: #f1f5f9;">${details}</p>
          </div>
          <div style="background: rgba(245, 158, 11, 0.12); border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 4px;">
            <strong style="color: #fbbf24; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">FORENSIC DEDUCTION &amp; TIMELINE IMPACT:</strong>
            <p style="margin: 0; font-size: 0.95rem; color: #fde68a;">${deduction}</p>
          </div>
        </div>
        <div class="triad-modal-footer" style="padding: 12px 20px; background: rgba(14, 18, 26, 0.95); border-top: 1px solid rgba(255, 255, 255, 0.1); display: flex; justify-content: space-between; align-items: center;">
          <button class="btn btn-outline" onclick="triadManualInstance.switchTab('notebook'); triadManualInstance.closeInspectModal();">
            ⚖️ OPEN NOTEBOOK
          </button>
          <button class="btn btn-primary" onclick="triadManualInstance.closeInspectModal()" style="background: #f59e0b; color: #111; font-weight: 800;">
            CLOSE EVIDENCE FILE
          </button>
        </div>
      </div>
    `;
    modal.style.display = 'flex';
  }

  closeInspectModal() {
    const modal = document.getElementById('triad-evidence-inspect-modal');
    if (modal) modal.style.display = 'none';
  }

  onSearch() {
    if (!window.triadState) return;
    window.triadState.searchCurrentNode('1999');
    this.render();
  }

  onSweep() {
    if (!window.triadState) return;
    window.triadState.forensicSweep();
    this.render();
  }

  onSecure() {
    if (!window.triadState) return;
    const node = window.triadState.meepleNodes['1999'];
    window.triadState.securePlantedEvidence(node);
    this.render();
  }

  onAnalyze(cardId) {
    if (!window.triadState) return;
    window.triadState.analyzeCard('1999', cardId);
    this.render();
  }
}

window.TriadManualView = TriadManualView;
