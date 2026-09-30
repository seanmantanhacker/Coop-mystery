/* ==========================================================================
   OPERATION: ZERO HOUR - MAP 5: THE TRIAD PARADOX (CASE 005)
   OPERATIVE 3: 2019 THE ARCHIVIST - DEDICATED QUANTUM ARCHIVE CONSOLE
   Full-Screen Station: Keyword Synthesizer, Decrypt Tools & Revelation Shelf
   ========================================================================== */

class TriadIntelView {
  constructor(controller) {
    this.controller = controller;
    this.activeTab = 'synthesizer'; // 'synthesizer', 'revelations', 'decrypt', 'hand', 'notebook'
    window.triadIntelInstance = this;
  }

  init() {
    this.render();
  }

  render() {
    const screenIntel = document.getElementById('screen-intel');
    if (!screenIntel) return;

    // Hide legacy room-viewport completely so workstation fills screen-intel
    const viewport = screenIntel.querySelector('.room-viewport');
    if (viewport) viewport.classList.add('hidden');

    // Hide legacy Cold War console and monitors
    const overview = document.getElementById('intel-console-overview');
    const inspectCenter = document.getElementById('intel-inspect-center');
    const inspectDossier = document.getElementById('intel-inspect-dossier');
    const inspectEmergency = document.getElementById('intel-inspect-emergency');
    const backBtn = document.getElementById('intel-back-btn');
    if (overview) overview.classList.add('hidden');
    if (inspectCenter) inspectCenter.classList.add('hidden');
    if (inspectDossier) inspectDossier.classList.add('hidden');
    if (inspectEmergency) inspectEmergency.classList.add('hidden');
    if (backBtn) backBtn.classList.add('hidden');

    // Create or locate dedicated Triad Archivist Console container
    let container = document.getElementById('triad-archivist-station');
    if (!container) {
      container = document.createElement('div');
      container.id = 'triad-archivist-station';
      container.className = 'triad-workstation triad-2019-workstation';
      screenIntel.appendChild(container);
    }
    container.classList.remove('hidden');

    if (!window.triadState && window.TriadStateManager) {
      window.triadState = new window.TriadStateManager();
    }
    const state = window.triadState;
    if (!state) return;

    const ap = state.ap['2019'];
    const currentNode = state.meepleNodes['2019'];
    const currentNodeName = state.nodeNames[currentNode - 1];
    const stab = state.chronalStability;

    container.innerHTML = `
      <!-- TOP COMMAND HEADER -->
      <div class="triad-station-header glass-panel">
        <div class="station-identity">
          <span class="station-era-badge badge-2019">2019: THE ARCHIVIST</span>
          <span class="station-sub-title">QUANTUM COLD CASE MAINFRAME // CASE #005</span>
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
            <strong class="m-val loc-val">N${currentNode}: ${currentNodeName} (RUINS)</strong>
          </div>
          <button class="btn btn-primary btn-sm btn-matrix-toggle" onclick="triadRippleUI.openModal()">
            🌀 RIPPLE MATRIX
          </button>
        </div>
      </div>

      <!-- NODE MOVEMENT BAR -->
      <div class="triad-nodes-navbar glass-panel">
        <span class="nav-label">RUINS EXPLORATION (1 AP):</span>
        <div class="nodes-nav-grid">
          ${[1, 2, 3, 4, 5].map(n => {
            const isHere = (currentNode === n);
            let statusNotice = '';
            if (n === 3) {
              const decrypted = state.decryptedBypasses['vaultDoor'];
              statusNotice = decrypted ? '<span class="node-tag open">⚡ BYPASS ACTIVE</span>' : '<span class="node-tag locked">🔒 SEALED BULKHEAD</span>';
            }
            return `
              <button class="btn-node-nav ${isHere ? 'active' : ''}" onclick="triadIntelInstance.onMoveNode(${n})">
                <span class="node-num-tag">NODE ${n}</span>
                <span class="node-title-tag">${state.nodeNames[n - 1]}</span>
                ${isHere ? '<span class="meeple-here-badge">YOU ARE HERE</span>' : ''}
                ${statusNotice}
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <!-- ARCHIVIST ACTION TOOLBAR -->
      <div class="triad-actions-toolbar glass-panel">
        <button class="btn btn-action" onclick="triadIntelInstance.onSearch()">
          🔍 SEARCH ARCHIVES (1 AP)
        </button>
        <button class="btn btn-action btn-synth-quick" onclick="triadIntelInstance.switchTab('synthesizer')">
          ⚛️ KEYWORD SYNTHESIZER (2 AP)
        </button>
        <button class="btn btn-action" onclick="triadIntelInstance.switchTab('decrypt')">
          💻 DECRYPT BYPASS (1 AP)
        </button>
        <button class="btn btn-action btn-consensus-quick" onclick="triadIntelInstance.switchTab('notebook')">
          ⚖️ CONSENSUS NOTEBOOK
        </button>
      </div>

      <!-- WORKSTATION NAVIGATION TABS -->
      <div class="triad-station-tabs">
        <button class="station-tab-btn ${this.activeTab === 'synthesizer' ? 'active' : ''}" onclick="triadIntelInstance.switchTab('synthesizer')">
          ⚛️ QUANTUM SYNTHESIZER
        </button>
        <button class="station-tab-btn ${this.activeTab === 'revelations' ? 'active' : ''}" onclick="triadIntelInstance.switchTab('revelations')">
          ✦ REVELATIONS (${state.revelations.length} / 5)
        </button>
        <button class="station-tab-btn ${this.activeTab === 'decrypt' ? 'active' : ''}" onclick="triadIntelInstance.switchTab('decrypt')">
          💻 DECRYPT TOOLS
        </button>
        <button class="station-tab-btn ${this.activeTab === 'hand' ? 'active' : ''}" onclick="triadIntelInstance.switchTab('hand')">
          🃏 ARCHIVIST HAND (${state.hands['2019'].length})
        </button>
        <button class="station-tab-btn ${this.activeTab === 'notebook' ? 'active' : ''}" onclick="triadIntelInstance.switchTab('notebook')">
          ⚖️ CONSENSUS VERDICT
        </button>
      </div>

      <!-- WORKSTATION TAB CONTENT VIEWPORT -->
      <div class="triad-station-body glass-panel">
        ${this.renderActiveTabContent()}
      </div>
    `;

    this.attachSynthesisListeners();
  }

  switchTab(tabKey) {
    this.activeTab = tabKey;
    if (window.audio && window.audio.playClick) window.audio.playClick();
    this.render();
  }

  renderActiveTabContent() {
    const state = window.triadState;

    if (this.activeTab === 'synthesizer') {
      const publicIntel = state.publicIntel;
      const cards79 = publicIntel.filter(c => c.id.startsWith('79-'));
      const cards99 = publicIntel.filter(c => c.id.startsWith('99-'));

      return `
        <div class="dossier-tab-view">
          <div class="dossier-header-banner">
            <h3>QUANTUM KEYWORD SYNTHESIZER TERMINAL</h3>
            <span class="dossier-date">CROSS-ERA TACHYON FREQUENCY HARMONIZATION</span>
          </div>

          <div class="synthesizer-main-box glass-panel">
            <p class="synth-instructions">
              Select one <strong>1979 Analyzed Card</strong> and one <strong>1999 Analyzed Card</strong>. When their underlying temporal keywords match, the terminal synthesizes a classified <em>Revelation Card</em>!
            </p>

            <div class="synth-selection-row">
              <div class="synth-column">
                <label>1979 PUBLIC INTEL (PAST):</label>
                <select id="ui-synth-79" class="triad-select" onchange="triadIntelInstance.checkKeywordMatch()">
                  <option value="">-- SELECT 1979 CARD --</option>
                  ${cards79.map(c => `
                    <option value="${c.id}" data-keywords="${(c.keywords || []).join(',')}">
                      ${c.title} [${(c.keywords || []).join(', ')}]
                    </option>
                  `).join('')}
                </select>
              </div>

              <div class="synth-column">
                <label>1999 PUBLIC INTEL (PRESENT):</label>
                <select id="ui-synth-99" class="triad-select" onchange="triadIntelInstance.checkKeywordMatch()">
                  <option value="">-- SELECT 1999 CARD --</option>
                  ${cards99.map(c => `
                    <option value="${c.id}" data-keywords="${(c.keywords || []).join(',')}">
                      ${c.title} [${(c.keywords || []).join(', ')}]
                    </option>
                  `).join('')}
                </select>
              </div>
            </div>

            <!-- KEYWORD MATCH FEEDBACK -->
            <div id="synth-match-indicator" class="match-indicator-banner">
              <span class="indicator-icon">⚛️</span>
              <span id="synth-match-text">SELECT TWO CARDS ABOVE TO TEST TEMPORAL HARMONICS</span>
            </div>

            <div class="synth-action-row">
              <button id="btn-fire-synthesis" class="btn btn-primary btn-large btn-synth-fire" onclick="triadIntelInstance.onExecuteSynthesis()">
                ⚡ INITIATE QUANTUM SYNTHESIS (2 AP)
              </button>
            </div>
          </div>
        </div>
      `;
    }

    if (this.activeTab === 'revelations') {
      const revs = state.revelations;
      return `
        <div class="dossier-tab-view">
          <div class="dossier-header-banner">
            <h3>DECRYPTED REVELATION ARCHIVE (${revs.length} / 5)</h3>
            <span class="dossier-date">CONVERGENCE TRUTHS PROVING CULPRIT, WEAPON &amp; MOTIVE</span>
          </div>

          ${revs.length === 0 ? `
            <div class="empty-state-card glass-panel">
              <p>No revelations decrypted yet. Use the <strong>QUANTUM KEYWORD SYNTHESIZER (2 AP)</strong> to harmonize 1979 and 1999 clue cards!</p>
            </div>
          ` : `
            <div class="revelations-grid">
              ${revs.map(r => `
                <div class="revelation-card-full glass-panel">
                  <div class="rev-card-header">
                    <h4>${r.title}</h4>
                    <span class="rev-proven-tag">PROVES: ${r.proves}</span>
                  </div>
                  <p class="rev-card-body">${r.text}</p>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      `;
    }

    if (this.activeTab === 'decrypt') {
      const bypasses = state.decryptedBypasses;
      return `
        <div class="dossier-tab-view">
          <div class="dossier-header-banner">
            <h3>ELECTRONIC DECRYPT &amp; STRUCTURAL BYPASS CONSOLE</h3>
            <span class="dossier-date">2019 DIGITAL OVERRIDES (DOES NOT ALTER 1979 PAST)</span>
          </div>

          <div class="decrypt-cards-grid">
            <div class="decrypt-card glass-panel">
              <h4>1. TEMPORAL VAULT BULKHEAD</h4>
              <p>The vault entrance is blocked by tons of collapsed ceiling rubble in 2019. Fire hydraulic emergency jacks to breach entry.</p>
              <button class="btn ${bypasses['vaultDoor'] ? 'btn-success' : 'btn-primary'}" onclick="triadIntelInstance.onDecrypt('vaultDoor')">
                ${bypasses['vaultDoor'] ? '✓ BULKHEAD BYPASSED' : '🔓 DECRYPT VAULT BULKHEAD (1 AP)'}
              </button>
            </div>

            <div class="decrypt-card glass-panel">
              <h4>2. DIRECTOR'S WALL SAFE</h4>
              <p>The safe is locked in the ruins with corrupted biometrics. Run quantum prime factorization algorithm to bypass the electronic lock.</p>
              <button class="btn ${bypasses['directorSafe'] ? 'btn-success' : 'btn-primary'}" onclick="triadIntelInstance.onDecrypt('directorSafe')">
                ${bypasses['directorSafe'] ? '✓ SAFE CIPHER CRACKED' : '🔓 DECRYPT WALL SAFE (1 AP)'}
              </button>
            </div>

            <div class="decrypt-card glass-panel">
              <h4>3. COOLANT LINE COLLAPSE STABILIZER</h4>
              <p>If 1979 depressurizes the coolant line, structural corrosion threatens Sector 1. Engage automated magnetic struts.</p>
              <button class="btn ${bypasses['coolantLine'] ? 'btn-success' : 'btn-primary'}" onclick="triadIntelInstance.onDecrypt('coolantLine')">
                ${bypasses['coolantLine'] ? '✓ STRUCTURAL STRUTS ENGAGED' : '🔓 SHORE UP COOLANT COLLAPSE (1 AP)'}
              </button>
            </div>
          </div>
        </div>
      `;
    }

    if (this.activeTab === 'hand') {
      const hand = state.hands['2019'];
      return `
        <div class="dossier-tab-view">
          <div class="dossier-header-banner">
            <h3>ARCHIVIST PRIVATE HAND</h3>
            <span class="dossier-date">OBEY THE WHISPER RULE (SUMMARIZE CONCEPTS ONLY)</span>
          </div>

          ${hand.length === 0 ? `
            <div class="empty-state-card glass-panel">
              <p>Your hand is currently empty. Click <strong>SEARCH ARCHIVES (1 AP)</strong> to investigate 2019 cold case records!</p>
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
                    <button class="btn btn-sm btn-primary" onclick="triadIntelInstance.onAnalyze('${card.id}')">
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
                <select class="triad-select" onchange="window.triadState.setVerdict('culprit', this.value); triadIntelInstance.render();">
                  <option value="">-- SELECT SUSPECT --</option>
                  <option value="Dr. Marcus Rowe" ${nb.culprit === 'Dr. Marcus Rowe' ? 'selected' : ''}>Dr. Marcus Rowe (Chief Physicist)</option>
                  <option value="Valerie Cross" ${nb.culprit === 'Valerie Cross' ? 'selected' : ''}>Assistant Director Valerie Cross (Logistics Liaison)</option>
                  <option value="Dr. Maya Lin" ${nb.culprit === 'Dr. Maya Lin' ? 'selected' : ''}>Dr. Maya Lin (Vault Architect)</option>
                </select>
              </div>

              <div class="c-field">
                <label>2. MURDER WEAPON &amp; FIRING METHOD:</label>
                <select class="triad-select" onchange="window.triadState.setVerdict('weapon', this.value); triadIntelInstance.render();">
                  <option value="">-- SELECT WEAPON --</option>
                  <option value="Conventional .38 Revolver" ${nb.weapon === 'Conventional .38 Revolver' ? 'selected' : ''}>Conventional .38 Revolver</option>
                  <option value="Dual-Harmonic Tachyon Emitter" ${nb.weapon === 'Dual-Harmonic Tachyon Emitter' ? 'selected' : ''}>Dual-Harmonic Directed Tachyon Emitter (Project Ouroboros 432 Hz)</option>
                  <option value="Potassium Cyanide Vial" ${nb.weapon === 'Potassium Cyanide Vial' ? 'selected' : ''}>Potassium Cyanide Vial</option>
                  <option value="50kV High-Voltage Terminal Arcing" ${nb.weapon === '50kV High-Voltage Terminal Arcing' ? 'selected' : ''}>50kV High-Voltage Terminal Arcing</option>
                </select>
              </div>

              <div class="c-field">
                <label>3. MOTIVE:</label>
                <select class="triad-select" onchange="window.triadState.setVerdict('motive', this.value); triadIntelInstance.render();">
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

  attachSynthesisListeners() {
    this.checkKeywordMatch();
  }

  checkKeywordMatch() {
    const s79 = document.getElementById('ui-synth-79');
    const s99 = document.getElementById('ui-synth-99');
    const matchText = document.getElementById('synth-match-text');
    const indicator = document.getElementById('synth-match-indicator');
    const fireBtn = document.getElementById('btn-fire-synthesis');
    if (!s79 || !s99 || !matchText || !indicator) return;

    const opt79 = s79.options[s79.selectedIndex];
    const opt99 = s99.options[s99.selectedIndex];

    if (!opt79 || !opt99 || !s79.value || !s99.value) {
      matchText.innerText = 'SELECT BOTH A 1979 AND 1999 CARD TO TEST HARMONICS';
      indicator.className = 'match-indicator-banner';
      if (fireBtn) fireBtn.disabled = true;
      return;
    }

    const kw79 = (opt79.dataset.keywords || '').split(',').filter(Boolean);
    const kw99 = (opt99.dataset.keywords || '').split(',').filter(Boolean);
    const shared = kw79.filter(k => kw99.includes(k));

    if (shared.length > 0) {
      matchText.innerHTML = `✦ <strong style="color:#00f0ff;">QUANTUM ALIGNMENT DETECTED:</strong> [${shared.join(', ')}]`;
      indicator.className = 'match-indicator-banner match-found';
      if (fireBtn) fireBtn.disabled = false;
    } else {
      matchText.innerHTML = `❌ <span style="color:#ff3344;">NO HARMONIC OVERLAP:</span> Selected clues share no temporal keywords.`;
      indicator.className = 'match-indicator-banner no-match';
      if (fireBtn) fireBtn.disabled = true;
    }
  }

  onExecuteSynthesis() {
    const s79 = document.getElementById('ui-synth-79');
    const s99 = document.getElementById('ui-synth-99');
    if (!s79 || !s99 || !s79.value || !s99.value || !window.triadState) return;

    const ok = window.triadState.synthesizeIntel(s79.value, s99.value);
    if (ok) {
      this.activeTab = 'revelations';
      this.render();
    }
  }

  onMoveNode(nodeNum) {
    if (!window.triadState) return;
    window.triadState.moveMeeple('2019', nodeNum);
    this.render();
  }

  onSearch() {
    if (!window.triadState) return;
    window.triadState.searchCurrentNode('2019');
    this.render();
  }

  onDecrypt(trackId) {
    if (!window.triadState) return;
    window.triadState.decryptTrack(trackId);
    this.render();
  }

  onAnalyze(cardId) {
    if (!window.triadState) return;
    window.triadState.analyzeCard('2019', cardId);
    this.render();
  }
}

window.TriadIntelView = TriadIntelView;
