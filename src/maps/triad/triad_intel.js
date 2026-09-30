/* ==========================================================================
   OPERATION: ZERO HOUR - MAP 5: THE TRIAD PARADOX (CASE 005)
   OPERATIVE 3: 2019 THE ARCHIVIST - DEDICATED QUANTUM ARCHIVE CONSOLE
   Full-Screen Station: Keyword Synthesizer, Decrypt Tools & Revelation Shelf
   ========================================================================== */

class TriadIntelView {
  constructor(controller) {
    this.controller = controller;
    this.activeTab = 'room'; // 'room', 'synthesizer', 'revelations', 'decrypt', 'hand', 'notebook'
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
        <span class="nav-label">2019 ARCHIVIST RUINS EXPLORATION (1 AP):</span>
        <div class="nodes-nav-grid">
          ${[1, 2, 3, 4, 5].map(n => {
            const isHere = (currentNode === n);
            let statusNotice = '';
            if (n === 1) {
              const decrypted = state.decryptedBypasses['coolantLine'] || state.rippleTracks.coolantLine.state === 'DEPRESSURIZED';
              statusNotice = decrypted ? '<span class="node-tag open">⚡ SENSORS ONLINE</span>' : '<span class="node-tag cold">❄️ CRYO RESIDUE</span>';
            } else if (n === 2) {
              const decrypted = state.decryptedBypasses['directorSafe'] || state.rippleTracks.directorSafe.state === 'BYPASSED';
              statusNotice = decrypted ? '<span class="node-tag open">⚡ SAFE BYPASSED</span>' : '<span class="node-tag locked">🔐 CORRUPT LOCK</span>';
            } else if (n === 3) {
              const decrypted = state.decryptedBypasses['vaultDoor'] || state.rippleTracks.vaultDoor.state === 'UNLOCKED';
              statusNotice = decrypted ? '<span class="node-tag open">⚡ BYPASS ACTIVE</span>' : '<span class="node-tag locked">🔒 SEALED BULKHEAD</span>';
            } else if (n === 4) {
              const clear = state.decryptedBypasses['courtyardCistern'] || state.rippleTracks.courtyardCistern.state === 'DRAINED';
              statusNotice = clear ? '<span class="node-tag dry">☀️ EXCAVATION ACCESS</span>' : '<span class="node-tag wet">🌊 SUBMERGED RUINS</span>';
            } else if (n === 5) {
              const recovered = state.decryptedBypasses['securityArchive'] || state.rippleTracks.securityArchive.state === 'FARADAY_SHIELDED';
              statusNotice = recovered ? '<span class="node-tag open">⚡ ARCHIVE RESTORED</span>' : '<span class="node-tag warning">📼 EMP CORRUPTED</span>';
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
        <button class="station-tab-btn ${this.activeTab === 'room' ? 'active' : ''}" onclick="triadIntelInstance.switchTab('room')">
          🖼️ 2019 RUINS ROOM VIEW
        </button>
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

    if (this.activeTab === 'room') {
      const currentNode = state ? state.meepleNodes['2019'] : 5;
      return this.render2DRoomView(currentNode, state);
    }

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
        <span class="transit-era-tag">2019 ARCHIVIST // QUANTUM RUINS EXPEDITION</span>
        <div class="transit-room-name">
          <span class="transit-node-badge">SECTOR 0${nodeNum}</span>
          <strong>${roomName.toUpperCase()}</strong>
        </div>
        <span class="transit-status-sub">LiDAR POINT-CLOUD &amp; AR SENSOR STREAM SYNCED</span>
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
      const decrypted = state.decryptedBypasses['coolantLine'] || state.rippleTracks.coolantLine.state === 'DEPRESSURIZED';
      roomStatusBadge = decrypted 
        ? `<span class="room-status-badge badge-cyan">⚡ LiDAR AR SPECTROMETRY // ONLINE</span>`
        : `<span class="room-status-badge badge-purple">❄️ CRYO RESIDUE DETECTED // DECRYPTION REQUIRED</span>`;
      roomDesc = `Laboratory ruins 40 years later. Autoclaves overgrown with bioluminescent moss, broken glass reflecting holographic LiDAR scan lasers.`;
      
      hotspots = [
        { key: 'spectro', title: 'SPECTROMETRIC SENSOR HUD', icon: '📡', x: 35, y: 55, desc: 'LiDAR scan isolates chemical spectral peak at 432 Hz inverted temporal harmonic and potassium cyanide.' },
        { key: 'bio', title: 'BIO-LUMINESCENT SPORES', icon: '🌿', x: 65, y: 40, desc: 'Microscopic cellular aging anomalies detected on petri dish remains.' },
        { key: 'duct', title: 'CORRODED CRYO MANIFOLD', icon: '❄️', x: 20, y: 35, desc: decrypted ? 'Sensors restored! Complete airflow telemetry recovered.' : 'Offline. Click Decrypt (1 AP) to bypass.' }
      ];

      roomSvg = `
        <svg class="room-2d-svg" viewBox="0 0 900 380" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="intelLabBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#050811" />
              <stop offset="70%" stop-color="#0c1626" />
              <stop offset="100%" stop-color="#04060c" />
            </linearGradient>
            <linearGradient id="lidarBeam" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="rgba(0, 240, 255, 0)" />
              <stop offset="50%" stop-color="rgba(0, 240, 255, 0.4)" />
              <stop offset="100%" stop-color="rgba(0, 240, 255, 0)" />
            </linearGradient>
          </defs>
          <rect width="900" height="380" fill="url(#intelLabBg)" />
          <!-- Decayed Ceiling with Open Skylight -->
          <polygon points="350,0 550,0 520,60 380,60" fill="#090d16" stroke="#00f0ff" stroke-width="1.5" stroke-dasharray="4,4" />
          <!-- Cyan LiDAR Grid Scan Lines -->
          ${[80, 140, 200, 260].map(gy => `<line x1="0" y1="${gy}" x2="900" y2="${gy}" stroke="#00f0ff" stroke-width="1" opacity="0.3" stroke-dasharray="6,6" />`).join('')}
          <!-- Decayed Floor -->
          <polygon points="0,260 900,260 900,380 0,380" fill="#070c14" />
          <!-- Rusted Counter with Moss -->
          <rect x="180" y="210" width="540" height="90" fill="#0f172a" stroke="#0284c7" stroke-width="2" rx="4" />
          <path d="M 180,210 Q 250,215 320,210 T 460,212 T 600,210 L 720,210" fill="none" stroke="#10b981" stroke-width="6" opacity="0.7" />
          <!-- AR Spectrometry Holographic Telemetry Box -->
          <rect x="220" y="110" width="180" height="95" fill="rgba(6, 182, 212, 0.12)" stroke="#00f0ff" stroke-width="2" rx="4" />
          <text x="310" y="132" font-size="11" font-weight="900" fill="#00f0ff" text-anchor="middle">SPECTRAL ANALYSIS</text>
          <path d="M 230,170 Q 270,140 310,165 T 390,140" fill="none" stroke="#38bdf8" stroke-width="2" />
          <text x="310" y="190" font-size="10" fill="#93c5fd" text-anchor="middle">PEAK: 432.00 Hz // K-CYANIDE</text>
          <!-- Bioluminescent Flora Clusters -->
          <circle cx="580" cy="180" r="14" fill="#a855f7" opacity="0.6" />
          <circle cx="610" cy="170" r="10" fill="#00f0ff" opacity="0.7" />
          <circle cx="630" cy="190" r="16" fill="#10b981" opacity="0.6" />
          <!-- LiDAR Scan Line Sweep Animation Bar -->
          <rect x="0" y="170" width="900" height="20" fill="url(#lidarBeam)" />
        </svg>
      `;
    } else if (nodeNum === 2) {
      const safeOpen = state.decryptedBypasses['directorSafe'] || state.rippleTracks.directorSafe.state === 'BYPASSED';
      roomStatusBadge = safeOpen
        ? `<span class="room-status-badge badge-cyan">⚡ EXECUTIVE SAFE DECRYPTED // DATA EXTRACTION 100%</span>`
        : `<span class="room-status-badge badge-purple">🔐 128-BIT CIPHER LOCK // 1 AP TO DECRYPT BYPASS</span>`;
      roomDesc = `Decayed executive suite. Rotted wood paneling, rain dripping through collapsed joists. A holographic AR projector reconstructs Dr. Julian Vance standing by his desk on Dec 31, 1979.`;

      hotspots = [
        { key: 'hologram', title: 'DR. VANCE AR GHOST HOLOGRAM', icon: '👤', x: 45, y: 48, desc: 'Holographic reconstruction of Vance on Dec 31, 1979 recording: "If Rowe tries to steal the emitter, Lin and I have locked the frequency to 432 Hz."' },
        { key: 'safe', title: 'QUANTUM WALL SAFE CIPHER', icon: '🔐', x: 78, y: 45, desc: safeOpen ? 'Safe unlatched in AR wireframe. Schematics for Project Ouroboros decrypted.' : 'Encrypted with Vance/Lin biometric polynomial. Click Decrypt (1 AP) to bypass.' },
        { key: 'diary', title: 'WATERLOGGED DIARY ARCHIVE', icon: '📜', x: 25, y: 65, desc: 'Decayed diary pages salvaged from desk drawer. Reveals Marcus Rowe forged logistics invoices.' }
      ];

      roomSvg = `
        <svg class="room-2d-svg" viewBox="0 0 900 380" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="intelOfficeBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#0a0705" />
              <stop offset="70%" stop-color="#1a1008" />
              <stop offset="100%" stop-color="#080504" />
            </linearGradient>
            <radialGradient id="holoGlow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stop-color="rgba(0, 240, 255, 0.4)" />
              <stop offset="60%" stop-color="rgba(168, 85, 247, 0.2)" />
              <stop offset="100%" stop-color="rgba(0, 0, 0, 0)" />
            </radialGradient>
          </defs>
          <rect width="900" height="380" fill="url(#intelOfficeBg)" />
          <!-- Decayed Wall Paneling -->
          ${[100, 250, 400, 550, 700].map(wx => `<rect x="${wx}" y="40" width="80" height="220" fill="#241208" stroke="#3b1d11" stroke-width="2" opacity="0.6" />`).join('')}
          <polygon points="0,260 900,260 900,380 0,380" fill="#140a04" />
          <!-- Rotted Desk Base -->
          <rect x="300" y="220" width="300" height="85" fill="#271309" stroke="#451a03" stroke-width="2" rx="4" />
          <!-- AR Drone Projector Hovering -->
          <circle cx="450" cy="110" r="18" fill="#1e293b" stroke="#00f0ff" stroke-width="2" />
          <polygon points="450,110 390,240 510,240" fill="url(#holoGlow)" />
          <!-- Dr. Julian Vance 1979 Holographic Ghost Figure -->
          <path d="M 450,135 C 440,135 440,150 450,150 C 460,150 460,135 450,135 Z" fill="none" stroke="#00f0ff" stroke-width="2.5" />
          <path d="M 450,150 L 450,195 M 430,165 L 470,165 M 435,195 L 445,235 M 465,195 L 455,235" fill="none" stroke="#00f0ff" stroke-width="2.5" stroke-dasharray="4,2" />
          <text x="450" y="250" font-size="11" font-weight="900" fill="#00f0ff" text-anchor="middle">AR RECONSTRUCTION // JULIAN VANCE (1979)</text>
          <!-- Rusted Safe with AR Wireframe -->
          <rect x="680" y="100" width="120" height="120" fill="#0f172a" stroke="${safeOpen ? '#00f0ff' : '#a855f7'}" stroke-width="3" rx="4" />
          ${safeOpen ? `
            <text x="740" y="165" font-size="12" font-weight="900" fill="#00f0ff" text-anchor="middle">DECRYPTED</text>
          ` : `
            <text x="740" y="165" font-size="12" font-weight="900" fill="#a855f7" text-anchor="middle">LOCKED</text>
          `}
        </svg>
      `;
    } else if (nodeNum === 3) {
      const decrypted = state.decryptedBypasses['vaultDoor'] || state.rippleTracks.vaultDoor.state === 'UNLOCKED';
      roomStatusBadge = decrypted
        ? `<span class="room-status-badge badge-cyan">⚡ 432 Hz HARMONIC STABILIZED // TIMELINE CONVERGENCE POINT ACTIVE</span>`
        : `<span class="room-status-badge badge-purple">🌀 432 Hz TACHYON SINGULARITY // FLUX CRITICAL</span>`;
      roomDesc = `Ground Zero: Temporal Ground Zero. A crackling purple tachyon spacetime singularity rotates in the center of the shattered vault chamber. Heavy quantum containment pylons hum with energy.`;

      hotspots = [
        { key: 'singularity', title: '432 Hz TACHYON SINGULARITY RIFT', icon: '🌀', x: 50, y: 42, desc: 'The exact temporal ground zero where Julian Vance was displaced and murdered. Emits pure 432.000 Hz resonance waveform.' },
        { key: 'pylons', title: 'QUANTUM CONTAINMENT PYLONS', icon: '⚡', x: 25, y: 55, desc: 'Stabilizes the singularity. Linked to timeline consensus variables.' },
        { key: 'residue', title: 'TEMPORAL DISPLACEMENT RESIDUE', icon: '💀', x: 74, y: 68, desc: 'Scans reveal atomic timeline entanglement. The 2019 self murdered the 1999 self to monopolize the Ouroboros patent!' }
      ];

      roomSvg = `
        <svg class="room-2d-svg" viewBox="0 0 900 380" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="intelVaultBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#04020a" />
              <stop offset="70%" stop-color="#100a22" />
              <stop offset="100%" stop-color="#05030d" />
            </linearGradient>
            <radialGradient id="singularityGlow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stop-color="#ec4899" />
              <stop offset="40%" stop-color="#8b5cf6" />
              <stop offset="70%" stop-color="#3b82f6" />
              <stop offset="100%" stop-color="rgba(0,0,0,0)" />
            </radialGradient>
          </defs>
          <rect width="900" height="380" fill="url(#intelVaultBg)" />
          <!-- Blast Chamber Remains -->
          <polygon points="120,40 160,70 160,270 120,270" fill="#0f172a" stroke="#a855f7" stroke-width="2" />
          <polygon points="780,40 740,70 740,270 780,270" fill="#0f172a" stroke="#a855f7" stroke-width="2" />
          <polygon points="0,260 900,260 900,380 0,380" fill="#07040e" />
          <!-- Spinning Tachyon Singularity Core -->
          <circle cx="450" cy="150" r="85" fill="url(#singularityGlow)" opacity="0.85" />
          <circle cx="450" cy="150" r="50" fill="#7c3aed" />
          <circle cx="450" cy="150" r="25" fill="#f43f5e" />
          <!-- Rotating Arc Rings -->
          <ellipse cx="450" cy="150" rx="100" ry="35" fill="none" stroke="#00f0ff" stroke-width="2" transform="rotate(25 450 150)" />
          <ellipse cx="450" cy="150" rx="100" ry="35" fill="none" stroke="#a855f7" stroke-width="2" transform="rotate(-35 450 150)" />
          <text x="450" y="275" font-size="12" font-weight="900" fill="#ec4899" text-anchor="middle">ANOMALY HARMONIC: 432.000 Hz</text>
          <!-- Containment Pylons -->
          <rect x="230" y="100" width="24" height="160" fill="#1e293b" stroke="#00f0ff" stroke-width="2" rx="3" />
          <line x1="242" y1="120" x2="400" y2="150" stroke="#00f0ff" stroke-width="2" opacity="0.6" stroke-dasharray="6,4" />
          <rect x="646" y="100" width="24" height="160" fill="#1e293b" stroke="#00f0ff" stroke-width="2" rx="3" />
          <line x1="658" y1="120" x2="500" y2="150" stroke="#00f0ff" stroke-width="2" opacity="0.6" stroke-dasharray="6,4" />
        </svg>
      `;
    } else if (nodeNum === 4) {
      const clear = state.decryptedBypasses['courtyardCistern'] || state.rippleTracks.courtyardCistern.state === 'DRAINED';
      roomStatusBadge = clear
        ? `<span class="room-status-badge badge-cyan">☀️ EXCAVATION SITE CLEAR // TIME CAPSULE RECOVERED</span>`
        : `<span class="room-status-badge badge-purple">🌊 CISTERN SILT SUBMERGED // PUMP DECRYPT REQUIRED</span>`;
      roomDesc = `Archaeological Cistern Excavation. Powerful halogen floodlight tripods illuminate the sunken pit while industrial generator pumps extract water.`;

      hotspots = [
        { key: 'pump', title: 'INDUSTRIAL PUMP GENERATOR', icon: '🚜', x: 25, y: 55, desc: clear ? 'Pumps running at 100%. Cistern basin completely drained.' : 'Engine offline. Click Decrypt (1 AP) to power up drainage.' },
        { key: 'grid', title: 'ARCHAEOLOGICAL STRATA GRID', icon: '📐', x: 50, y: 70, desc: 'Excavation grid marks 1979 foundation bedrock and 1999 sediment layers.' },
        { key: 'capsule', title: 'SUB-SURFACE TIME CAPSULE', icon: '📦', x: 74, y: 65, desc: 'Historical evidence stashed during 1979 and 1999 eras.' }
      ];

      roomSvg = `
        <svg class="room-2d-svg" viewBox="0 0 900 380" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="excavBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#020617" />
              <stop offset="60%" stop-color="#0f172a" />
              <stop offset="100%" stop-color="#020617" />
            </linearGradient>
            <radialGradient id="floodBeam" cx="0.5" cy="0.1" r="0.7">
              <stop offset="0%" stop-color="rgba(254, 240, 138, 0.4)" />
              <stop offset="70%" stop-color="rgba(254, 240, 138, 0.05)" />
              <stop offset="100%" stop-color="rgba(0,0,0,0)" />
            </radialGradient>
          </defs>
          <rect width="900" height="380" fill="url(#excavBg)" />
          <rect width="900" height="380" fill="url(#floodBeam)" />
          <!-- Halogen Worklight Tripods -->
          <polygon points="120,40 100,260 140,260" fill="none" stroke="#eab308" stroke-width="3" />
          <circle cx="120" cy="40" r="16" fill="#fde047" stroke="#ca8a04" stroke-width="3" />
          <polygon points="780,40 760,260 800,260" fill="none" stroke="#eab308" stroke-width="3" />
          <circle cx="780" cy="40" r="16" fill="#fde047" stroke="#ca8a04" stroke-width="3" />
          <!-- Excavation Ground & Pit -->
          <polygon points="0,260 900,260 900,380 0,380" fill="#090d16" />
          <polygon points="250,260 650,260 700,360 200,360" fill="#1e293b" stroke="#eab308" stroke-width="2" />
          <!-- Grid String Lines -->
          ${[280, 360, 440, 520, 600].map(gx => `<line x1="${gx}" y1="260" x2="${gx}" y2="360" stroke="#facc15" stroke-width="1" stroke-dasharray="4,4" />`).join('')}
          <!-- Industrial Extraction Pump Generator -->
          <rect x="220" y="190" width="80" height="60" fill="#ca8a04" stroke="#eab308" stroke-width="2" rx="4" />
          <path d="M 280,240 Q 320,290 380,310" fill="none" stroke="#000" stroke-width="8" />
          <text x="450" y="325" font-size="12" font-weight="900" fill="${clear ? '#10b981' : '#38bdf8'}" text-anchor="middle">
            ${clear ? 'EXCAVATION ACTIVE // BEDROCK REACHED' : 'DRAINAGE PUMP RUNNING // BYPASS READY'}
          </text>
        </svg>
      `;
    } else if (nodeNum === 5) {
      const recovered = state.decryptedBypasses['securityArchive'] || state.rippleTracks.securityArchive.state === 'FARADAY_SHIELDED';
      roomStatusBadge = recovered
        ? `<span class="room-status-badge badge-cyan">⚡ ARCHIVE STREAM 100% // AUDIO RESTORATION COMPLETE</span>`
        : `<span class="room-status-badge badge-purple">📼 EMP PACKET LOSS // 1 AP TO DECRYPT BUS TAP</span>`;
      roomDesc = `Quantum Archive Cyber-Restoration Hub. High-tech rugged field laptop terminal hooked into the rusted 1979 mainframe backplane via glowing fiber optic bundles.`;

      hotspots = [
        { key: 'terminal', title: 'RUGGED QUANTUM FIELD TERMINAL', icon: '💻', x: 62, y: 55, desc: 'Military-spec laptop running cross-era timeline synthesis and cryptographic analysis.' },
        { key: 'fiber', title: 'FIBER OPTIC BACKPLANE TAP', icon: '🧬', x: 28, y: 45, desc: 'Optical sensor clamps directly onto the 1979 magnetic tape heads to pull raw timeline data.' },
        { key: 'decrypt', title: 'RUN NODE DECRYPT (1 AP)', icon: '⚡', x: 80, y: 65, desc: 'Spend 1 AP to bypass corrupt parity sectors and force open node clearance.' }
      ];

      roomSvg = `
        <svg class="room-2d-svg" viewBox="0 0 900 380" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="intelSecBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#020805" />
              <stop offset="70%" stop-color="#061f14" />
              <stop offset="100%" stop-color="#020805" />
            </linearGradient>
          </defs>
          <rect width="900" height="380" fill="url(#intelSecBg)" />
          <!-- 1979 Rusted Mainframe Shell -->
          <rect x="80" y="50" width="220" height="230" fill="#09140e" stroke="#1e293b" stroke-width="3" rx="4" />
          <!-- Fiber Optic Glowing Bus Cords -->
          <path d="M 190,140 Q 320,100 450,220" fill="none" stroke="#00f0ff" stroke-width="4" opacity="0.85" />
          <path d="M 190,180 Q 340,150 470,220" fill="none" stroke="#10b981" stroke-width="4" opacity="0.85" />
          <!-- Military Flight Case Desk -->
          <polygon points="0,260 900,260 900,380 0,380" fill="#040d07" />
          <rect x="420" y="210" width="280" height="80" fill="#1e293b" stroke="#334155" stroke-width="2" rx="4" />
          <!-- Open Rugged Laptop -->
          <rect x="470" y="140" width="160" height="100" fill="#0f172a" stroke="#00f0ff" stroke-width="2" rx="4" />
          <rect x="480" y="150" width="140" height="80" fill="#022c22" stroke="#10b981" />
          <!-- Code Waterfall -->
          ${[495, 515, 535, 555, 575, 595].map((cx, i) => `
            <text x="${cx}" y="170" font-size="9" fill="#10b981" font-family="monospace">0x${i}</text>
            <text x="${cx}" y="190" font-size="9" fill="#34d399" font-family="monospace">432</text>
            <text x="${cx}" y="210" font-size="9" fill="#00f0ff" font-family="monospace">OK</text>
          `).join('')}
          <text x="550" y="250" font-size="11" font-weight="900" fill="#00f0ff" text-anchor="middle">
            ${recovered ? 'STATUS: RESTORED // 100%' : 'STATUS: PARITY LOSS // DECRYPT READY'}
          </text>
        </svg>
      `;
    }

    return `
      <div class="triad-2d-room-viewport">
        <!-- Room Identity Banner -->
        <div class="room-2d-header">
          <div class="room-title-col">
            <div class="room-tag-line">
              <span class="room-era-pill badge-2019">2019 ARCHIVIST EXPEDITION</span>
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
              <div class="room-hotspot-pin" style="left: ${hs.x}%; top: ${hs.y}%;" onclick="triadIntelInstance.inspectHotspot(${nodeNum}, '${hs.key}')" title="${hs.title}">
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
            <button class="btn btn-action" onclick="triadIntelInstance.onSearch()">
              🔍 SCAN RUINS (1 AP)
            </button>
            <button class="btn btn-action btn-synth-quick" onclick="triadIntelInstance.switchTab('synthesizer')">
              ⚛️ KEYWORD SYNTHESIZER (2 AP)
            </button>
            <button class="btn btn-action" onclick="triadIntelInstance.switchTab('decrypt')">
              💻 DECRYPT TOOLS (1 AP)
            </button>
          </div>
          <div class="roster-right">
            <button class="btn btn-outline" onclick="triadIntelInstance.switchTab('revelations')">
              ✦ VIEW REVELATIONS
            </button>
            <button class="btn btn-outline" onclick="triadIntelInstance.switchTab('notebook')">
              ⚖️ CONSENSUS NOTEBOOK
            </button>
          </div>
        </div>
      </div>
    `;
  }

  inspectHotspot(nodeNum, key) {
    const state = window.triadState;
    if (window.audio && window.audio.playClick) window.audio.playClick();

    let title = '2019 QUANTUM EXPEDITION SCAN';
    let icon = '📡';
    let details = '';
    let deduction = '';

    if (nodeNum === 1) {
      if (key === 'spectro') {
        title = 'SPECTROMETRIC SENSOR HUD'; icon = '📡';
        details = 'LiDAR spectral analysis detects ionized air molecules consistent with an inverted tachyon discharge fired through the facility high-voltage grid.';
        deduction = 'Matches 432 Hz tachyon frequency. The weapon did not fire conventional bullets; it dissolved cellular bonds!';
      } else if (key === 'bio') {
        title = 'BIO-LUMINESCENT SPORES'; icon = '🌿';
        details = 'Mutated plant growth feeding on radioactive isotope decay in the laboratory drainage basin.';
        deduction = 'Confirms temporal displacement radiation has permeated Sector 1 since 1999.';
      } else {
        title = 'CORRODED CRYO MANIFOLD'; icon = '❄️';
        details = 'Nitrogen manifold has corroded over 40 years. Airflow duct pressure measurements can be calibrated into Public Intel.';
        deduction = 'Reveals the exact path the assailant used to flee the crime scene.';
      }
    } else if (nodeNum === 2) {
      if (key === 'hologram') {
        title = 'DR. JULIAN VANCE AR HOLOGRAM'; icon = '👤';
        details = 'Audio stream extracted: "Marcus Rowe has filed competing patent claims. If he succeeds, he will erase Maya and me from history."';
        deduction = 'Direct motive evidence: Patent theft and monopolization of time displacement technology!';
      } else if (key === 'safe') {
        title = 'QUANTUM WALL SAFE CIPHER'; icon = '🔐';
        details = '128-bit quantum hash lock. Decrypting restores the complete 1979 patent schematics to Public Intel.';
        deduction = 'Proves the weapon design was co-authored by Julian Vance and Dr. Maya Lin.';
      } else {
        title = 'WATERLOGGED DIARY ARCHIVE'; icon = '📜';
        details = 'Corrupted log files recovered. Shows Assistant Director Valerie Cross was in communication with Chief Physicist Marcus Rowe on Dec 31, 1999.';
        deduction = 'Conspiracy alibi evidence: Cross provided the stolen security badge!';
      }
    } else if (nodeNum === 3) {
      if (key === 'singularity') {
        title = '432 Hz TACHYON SINGULARITY RIFT'; icon = '🌀';
        details = 'An active spacetime singularity locked at precisely 432.000 Hz. The murder was committed with a Directed Dual-Harmonic Tachyon Emitter.';
        deduction = 'The definitive murder weapon! Not a conventional gun or poison.';
      } else if (key === 'pylons') {
        title = 'QUANTUM CONTAINMENT PYLONS'; icon = '⚡';
        details = 'Harmonic pylons maintaining timeline equilibrium. If consensus is incorrect, containment fails and creates a Class-Omega Paradox.';
        deduction = 'Ensure all 3 operatives agree on Culprit, Weapon, and Motive!';
      } else {
        title = 'TEMPORAL DISPLACEMENT RESIDUE'; icon = '💀';
        details = 'Sub-atomic scans prove the victim in 1999 was killed by his own future 2019 self to preserve his corporate empire!';
        deduction = 'The culprit is Dr. Marcus Rowe utilizing Vance’s 2019 duplicate identities.';
      }
    } else if (nodeNum === 4) {
      if (key === 'pump') {
        title = 'INDUSTRIAL PUMP GENERATOR'; icon = '🚜';
        details = 'Generators hum, sucking storm silt from the ancient drainage culvert.';
        deduction = 'Allows recovery of 40-year-old physical prototypes stashed in 1979 or 1999.';
      } else if (key === 'grid') {
        title = 'ARCHAEOLOGICAL STRATA GRID'; icon = '📐';
        details = 'Stratigraphic cross-section shows the cistern was flooded during the 1999 storm and drained in the 2010s.';
        deduction = 'Confirms temporal causality track state changes across eras.';
      } else {
        title = 'SUB-SURFACE TIME CAPSULE'; icon = '📦';
        details = 'Titanium time capsule receptacle. Placed during the Prometheus Facility inception.';
        deduction = 'Cross-checks items planted by Operative 1.';
      }
    } else if (nodeNum === 5) {
      if (key === 'terminal') {
        title = 'RUGGED QUANTUM FIELD TERMINAL'; icon = '💻';
        details = 'Connected to the 1979 mainframe. All surveillance tapes and access logs are available for keyword synthesis.';
        deduction = 'Use Keyword Synthesizer (2 AP) to unlock revelations!';
      } else if (key === 'fiber') {
        title = 'FIBER OPTIC BUS TAP'; icon = '🧬';
        details = 'High-speed optical coupler reading oxidized magnetic particles directly off the 1979 reels.';
        deduction = 'Restores audio waveforms even from degraded media.';
      } else {
        this.onDecrypt('securityArchive');
        return;
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
        <div class="triad-modal-header" style="background: rgba(16, 12, 30, 0.95); border-bottom: 2px solid #a855f7;">
          <div class="triad-header-title">
            <h3 style="color: #c084fc; display: flex; align-items: center; gap: 8px; margin: 0;">
              <span>${icon}</span> ${title}
            </h3>
            <span class="triad-case-tag" style="color: #94a3b8;">2019 AR TELEMETRY // SECTOR 0${nodeNum}</span>
          </div>
          <button class="modal-close-btn" onclick="triadIntelInstance.closeInspectModal()">✕</button>
        </div>
        <div class="triad-modal-body" style="padding: 20px; font-family: 'Rajdhani', sans-serif; font-size: 1.05rem; line-height: 1.5; color: #e2e8f0;">
          <div style="background: rgba(0, 0, 0, 0.4); border-left: 4px solid #00f0ff; padding: 12px 16px; border-radius: 4px; margin-bottom: 16px;">
            <strong style="color: #00f0ff; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">LiDAR SENSOR READOUT:</strong>
            <p style="margin: 0; font-size: 0.95rem; color: #f1f5f9;">${details}</p>
          </div>
          <div style="background: rgba(168, 85, 247, 0.12); border-left: 4px solid #a855f7; padding: 12px 16px; border-radius: 4px;">
            <strong style="color: #c084fc; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">QUANTUM DEDUCTION &amp; REVELATION LINK:</strong>
            <p style="margin: 0; font-size: 0.95rem; color: #e9d5ff;">${deduction}</p>
          </div>
        </div>
        <div class="triad-modal-footer" style="padding: 12px 20px; background: rgba(12, 10, 22, 0.95); border-top: 1px solid rgba(255, 255, 255, 0.1); display: flex; justify-content: space-between; align-items: center;">
          <button class="btn btn-outline" onclick="triadIntelInstance.switchTab('notebook'); triadIntelInstance.closeInspectModal();">
            ⚖️ OPEN NOTEBOOK
          </button>
          <button class="btn btn-primary" onclick="triadIntelInstance.closeInspectModal()" style="background: #a855f7; color: #fff; font-weight: 800;">
            DISMISS AR TELEMETRY
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
