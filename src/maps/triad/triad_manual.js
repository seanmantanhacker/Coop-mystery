/* ==========================================================================
   OPERATION: ZERO HOUR - MAP 5: THE TRIAD PARADOX (CASE 005)
   OPERATIVE 2: 1999 THE DETECTIVE - DEDICATED CRIME SCENE WORKSTATION
   Full-Screen Station: Node Traversal, Forensic Sweeps, Autopsy & Accusation
   ========================================================================== */

class TriadManualView {
  constructor(controller) {
    this.controller = controller;
    this.activeTab = 'autopsy'; // 'autopsy', 'suspects', 'hand', 'intel', 'notebook'
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
        <span class="nav-label">FIELD MOVEMENT (1 AP):</span>
        <div class="nodes-nav-grid">
          ${[1, 2, 3, 4, 5].map(n => {
            const isHere = (currentNode === n);
            let statusNotice = '';
            if (n === 3) {
              const vaultLocked = state.rippleTracks.vaultDoor.state === 'LOCKED';
              const ventClear = state.rippleTracks.coolantLine.state === 'DEPRESSURIZED';
              if (vaultLocked && !ventClear) statusNotice = '<span class="node-tag locked">🔒 VENT FROZEN</span>';
              else if (vaultLocked && ventClear) statusNotice = '<span class="node-tag vent">💨 VENT CRAWL</span>';
              else statusNotice = '<span class="node-tag open">🚪 DOOR OPEN</span>';
            } else if (n === 4) {
              const flooded = state.rippleTracks.courtyardCistern.state === 'FLOODED';
              statusNotice = flooded ? '<span class="node-tag wet">🌊 FLOODED</span>' : '<span class="node-tag dry">☀️ DRAINED</span>';
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
    this.render();
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
