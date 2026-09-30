/* ==========================================================================
   THE TRIAD PARADOX: RIPPLE MATRIX & CHRONAL TIMELINE MODAL UI
   Side-board visualization of the 6 State Tracks, 3-Era Node Tracks,
   Chronal Stability Dial & Public Intel Board (Shared across all 3 Operatives)
   ========================================================================== */

class TriadRippleMatrixUI {
  constructor() {
    this.modalEl = null;
    this.isOpen = false;
    this.initDOM();
  }

  initDOM() {
    // Floating Timeline HUD button across all roles
    let btn = document.getElementById('btn-triad-matrix-toggle');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'btn-triad-matrix-toggle';
      btn.className = 'btn-triad-matrix-hud hidden';
      btn.innerHTML = `
        <span class="matrix-hud-icon">🌀</span>
        <span class="matrix-hud-text">RIPPLE MATRIX &amp; TIMELINE</span>
        <span id="matrix-hud-stability-badge" class="matrix-hud-stability">STABILITY: 18</span>
      `;
      btn.onclick = () => this.toggleModal();
      document.body.appendChild(btn);
    }

    // Modal Container
    let modal = document.getElementById('triad-matrix-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'triad-matrix-modal';
      modal.className = 'modal-overlay hidden';
      modal.innerHTML = `
        <div class="triad-modal-card glass-panel">
          <div class="triad-modal-header">
            <div class="triad-header-title">
              <span class="triad-pulse-icon">🌀</span>
              <h2>THE RIPPLE MATRIX &amp; CAUSAL TIMELINE</h2>
              <span class="triad-case-tag">CASE #005: THE OUROBOROS CONVERGENCE</span>
            </div>
            <div class="triad-stability-box">
              <span class="stability-label">CHRONAL STABILITY:</span>
              <strong id="modal-stability-counter" class="stability-number">18</strong>
              <div class="stability-meter-track">
                <div id="modal-stability-meter-fill" class="stability-meter-fill" style="width: 100%;"></div>
              </div>
            </div>
            <button class="btn-icon btn-close" onclick="triadRippleUI.closeModal()">✕</button>
          </div>

          <div class="triad-modal-tabs">
            <button class="triad-tab-btn active" id="tab-btn-matrix" onclick="triadRippleUI.switchTab('matrix')">1. RIPPLE MATRIX (6 TRACKS)</button>
            <button class="triad-tab-btn" id="tab-btn-tracks" onclick="triadRippleUI.switchTab('tracks')">2. 3-ERA NODE BOARD (MEEPLES)</button>
            <button class="triad-tab-btn" id="tab-btn-intel" onclick="triadRippleUI.switchTab('intel')">3. PUBLIC INTEL BOARD</button>
            <button class="triad-tab-btn" id="tab-btn-notebook" onclick="triadRippleUI.switchTab('notebook')">4. CONSENSUS NOTEBOOK</button>
          </div>

          <div class="triad-modal-body">
            <!-- TAB 1: RIPPLE MATRIX -->
            <div id="triad-view-matrix" class="triad-tab-view active">
              <div class="matrix-legend-banner">
                <span>⚡ <strong>DOWNSTREAM PROPAGATION:</strong> The 1979 Architect spends 2 AP to alter physical states. Changes instantly propagate to 1999 and 2019! Beware Paradoxes!</span>
              </div>
              <div class="ripple-tracks-grid" id="ripple-tracks-container">
                <!-- Rendered dynamically -->
              </div>
            </div>

            <!-- TAB 2: 3-ERA NODE BOARD -->
            <div id="triad-view-tracks" class="triad-tab-view hidden">
              <div class="era-tracks-container">
                <div class="era-track-row track-1979">
                  <div class="era-track-badge">1979: THE ARCHITECT (PAST)</div>
                  <div class="nodes-strip" id="nodes-strip-1979"></div>
                </div>
                <div class="era-track-row track-1999">
                  <div class="era-track-badge">1999: THE DETECTIVE (PRESENT CRIME SCENE)</div>
                  <div class="nodes-strip" id="nodes-strip-1999"></div>
                </div>
                <div class="era-track-row track-2019">
                  <div class="era-track-badge">2019: THE ARCHIVIST (FUTURE RUINS)</div>
                  <div class="nodes-strip" id="nodes-strip-2019"></div>
                </div>
              </div>
            </div>

            <!-- TAB 3: PUBLIC INTEL BOARD -->
            <div id="triad-view-intel" class="triad-tab-view hidden">
              <div class="public-intel-header">
                <h3>TABLE INTEL (ANALYZED CARDS ACCESSIBLE TO ALL OPERATIVES)</h3>
                <p class="whisper-rule-note">💡 Un-Analyzed cards in your hand obey the Whisper Rule (only describe concepts). Once Analyzed (1 AP), full card details appear here for keyword synthesis!</p>
              </div>
              <div class="public-intel-grid" id="public-intel-container">
                <!-- Rendered dynamically -->
              </div>
            </div>

            <!-- TAB 4: CONSENSUS NOTEBOOK -->
            <div id="triad-view-notebook" class="triad-tab-view hidden">
              <div class="notebook-container glass-panel">
                <div class="notebook-header">
                  <h3>THE CONSENSUS NOTEBOOK: FINAL VERDICT</h3>
                  <p>In Phase 4 of each round, operatives log their deductions. When ready, submit the Final Accusation. A single error creates a divergent timeline!</p>
                </div>
                <div class="notebook-fields-grid">
                  <div class="notebook-field">
                    <label>1. CULPRIT / ASSAILANT:</label>
                    <select id="nb-input-culprit" class="triad-select" onchange="triadRippleUI.onNotebookChange('culprit', this.value)">
                      <option value="">-- SELECT SUSPECT --</option>
                      <option value="Dr. Marcus Rowe">Dr. Marcus Rowe (Chief Physicist)</option>
                      <option value="Valerie Cross">Assistant Director Valerie Cross (Logistics Liaison)</option>
                      <option value="Dr. Maya Lin">Dr. Maya Lin (Bio-Temporal Specialist)</option>
                    </select>
                  </div>
                  <div class="notebook-field">
                    <label>2. MURDER WEAPON &amp; MECHANISM:</label>
                    <select id="nb-input-weapon" class="triad-select" onchange="triadRippleUI.onNotebookChange('weapon', this.value)">
                      <option value="">-- SELECT WEAPON --</option>
                      <option value="Conventional .38 Revolver">Conventional .38 Revolver</option>
                      <option value="Dual-Harmonic Tachyon Emitter">Dual-Harmonic Directed Tachyon Emitter (Project Ouroboros)</option>
                      <option value="Potassium Cyanide Vial">Potassium Cyanide Vial</option>
                      <option value="50kV High-Voltage Terminal Arcing">50kV High-Voltage Terminal Arcing</option>
                    </select>
                  </div>
                  <div class="notebook-field">
                    <label>3. MOTIVE:</label>
                    <select id="nb-input-motive" class="triad-select" onchange="triadRippleUI.onNotebookChange('motive', this.value)">
                      <option value="">-- SELECT MOTIVE --</option>
                      <option value="Personal Jealousy &amp; Romantic Rejection">Personal Jealousy &amp; Romantic Rejection</option>
                      <option value="Patent Theft &amp; Temporal Assassination">Patent Theft, Corporate Monopolization &amp; Erasing Vance's 2019 Self</option>
                      <option value="Accidental Malfunction Cover-Up">Accidental Malfunction Cover-Up</option>
                    </select>
                  </div>
                </div>
                <div class="notebook-actions">
                  <button class="btn btn-primary btn-large btn-accuse" onclick="triadRippleUI.submitAccusation()">⚖️ SUBMIT FINAL ACCUSATION (TRIGGER ENDGAME)</button>
                </div>
              </div>
            </div>

          </div>

          <div class="triad-modal-footer">
            <span id="triad-status-bar">CHRONAL ROUND: 1 // ACTIVE ERA: 1979 // AP REMAINING: 3</span>
            <button class="btn btn-secondary" onclick="triadRippleUI.closeModal()">RETURN TO STATION</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    this.modalEl = modal;
  }

  showHUDButton(show = true) {
    const btn = document.getElementById('btn-triad-matrix-toggle');
    if (btn) {
      btn.classList.toggle('hidden', !show);
    }
  }

  toggleModal() {
    if (this.isOpen) this.closeModal();
    else this.openModal();
  }

  openModal() {
    if (!this.modalEl) this.initDOM();
    this.modalEl.classList.remove('hidden');
    this.isOpen = true;
    this.renderAll();
    if (window.audio && window.audio.playZoom) window.audio.playZoom();
  }

  closeModal() {
    if (this.modalEl) this.modalEl.classList.add('hidden');
    this.isOpen = false;
    if (window.audio && window.audio.playClick) window.audio.playClick();
  }

  switchTab(tabKey) {
    document.querySelectorAll('.triad-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.triad-tab-view').forEach(v => {
      v.classList.remove('active');
      v.classList.add('hidden');
    });

    const activeBtn = document.getElementById(`tab-btn-${tabKey}`);
    const activeView = document.getElementById(`triad-view-${tabKey}`);

    if (activeBtn) activeBtn.classList.add('active');
    if (activeView) {
      activeView.classList.remove('hidden');
      activeView.classList.add('active');
    }

    if (window.audio && window.audio.playClick) window.audio.playClick();
    this.renderAll();
  }

  renderAll() {
    this.updateStabilityMeter();
    this.renderRippleTracks();
    this.render3EraNodes();
    this.renderPublicIntel();
    this.renderNotebook();
  }

  updateStabilityMeter() {
    const state = window.triadState;
    if (!state) return;

    const stab = state.chronalStability;
    const hudStab = document.getElementById('matrix-hud-stability-badge');
    const modalStab = document.getElementById('modal-stability-counter');
    const meterFill = document.getElementById('modal-stability-meter-fill');
    const statusBar = document.getElementById('triad-status-bar');

    if (hudStab) hudStab.innerText = `STABILITY: ${stab}`;
    if (modalStab) {
      modalStab.innerText = stab;
      modalStab.style.color = stab <= 5 ? '#ff3344' : (stab <= 10 ? '#f5d76e' : '#00f0ff');
    }
    if (meterFill) {
      const pct = Math.max(0, Math.min(100, (stab / 18) * 100));
      meterFill.style.width = `${pct}%`;
      meterFill.style.background = stab <= 5 ? '#ff3344' : (stab <= 10 ? '#f5d76e' : '#00f0ff');
    }
    if (statusBar) {
      statusBar.innerHTML = `ROUND: <strong>${state.round}</strong> // ACTIVE STABILITY: <strong>${stab}</strong> // 1979 AP: <strong>${state.ap['1979']}</strong> | 1999 AP: <strong>${state.ap['1999']}</strong> | 2019 AP: <strong>${state.ap['2019']}</strong>`;
    }
  }

  renderRippleTracks() {
    const container = document.getElementById('ripple-tracks-container');
    if (!container || !window.triadState) return;

    const state = window.triadState;
    const is1979 = (window.game && window.game.role === 'defuser'); // Operative 1 is 1979
    const tracks = Object.values(state.rippleTracks);

    container.innerHTML = tracks.map(track => {
      const isLocked = track.state.includes('LOCKED') || track.state.includes('PRESSURIZED') || track.state.includes('FLOODED') || track.state.includes('HIGH_VOLTAGE') || track.state.includes('UNSHIELDED');
      const stateBadgeClass = isLocked ? 'state-locked' : 'state-active';

      // 1979 Flip Buttons
      let flipBtnHtml = '';
      if (is1979) {
        const otherState = track.states.find(s => s !== track.state);
        flipBtnHtml = `
          <button class="btn btn-ripple-flip" onclick="triadRippleUI.onFlipTrack('${track.id}', '${otherState}')">
            FLIP TO [${otherState}] (2 AP)
          </button>
        `;
      }

      return `
        <div class="ripple-track-card glass-panel" id="track-card-${track.id}">
          <div class="track-header">
            <h4>${track.name}</h4>
            <span class="track-state-badge ${stateBadgeClass}">${track.state}</span>
          </div>
          <p class="track-desc">${track.desc}</p>
          <div class="track-causality-chain">
            <div class="causal-step"><span class="c-era">1979:</span> <em>Physical Mechanism</em></div>
            <div class="causal-step"><span class="c-era">1999:</span> <em>${this.getTrack1999Effect(track.id, track.state)}</em></div>
            <div class="causal-step"><span class="c-era">2019:</span> <em>${this.getTrack2019Effect(track.id, track.state)}</em></div>
          </div>
          ${flipBtnHtml}
        </div>
      `;
    }).join('');
  }

  getTrack1999Effect(id, state) {
    if (id === 'vaultDoor') return state === 'LOCKED' ? 'Vault door deadbolted from console' : 'Vault door breached open';
    if (id === 'coolantLine') return state === 'PRESSURIZED' ? 'Vent shaft filled with freezing cryo-fog' : 'Vent shaft clear: Crawling bypass unlocked';
    if (id === 'courtyardCistern') return state === 'FLOODED' ? 'Cistern flooded under 10ft of muddy water' : 'Cistern dry: Planted core can be secured';
    if (id === 'directorSafe') return state === 'BIOMETRIC_LOCKED' ? 'Safe biometrics fried by EMP' : 'Safe door cracked open';
    if (id === 'powerGrid') return state === 'HIGH_VOLTAGE' ? 'High voltage busbars arcing in Lab' : 'Emergency auxiliary amber lighting';
    if (id === 'securityArchive') return state === 'UNSHIELDED' ? 'Tapes burned by 23:40 EMP' : 'Tapes shielded inside Faraday sleeve';
    return state;
  }

  getTrack2019Effect(id, state) {
    if (id === 'vaultDoor') return state === 'LOCKED' ? 'Sealed behind collapsed bulkhead' : 'Open ruins entry';
    if (id === 'coolantLine') return state === 'PRESSURIZED' ? 'Dry corroded pipe' : 'Structural collapse risk (requires Decrypt)';
    if (id === 'courtyardCistern') return state === 'FLOODED' ? 'Sealed under 50 tons of concrete' : 'Excavation trench reachable';
    if (id === 'directorSafe') return state === 'BIOMETRIC_LOCKED' ? 'Rusted empty safe' : 'Stripped open';
    if (id === 'powerGrid') return state === 'HIGH_VOLTAGE' ? 'Power dead' : 'Solar micro-grid standby';
    if (id === 'securityArchive') return state === 'UNSHIELDED' ? 'Corrupted magnetic noise' : 'Clean audio restored';
    return state;
  }

  render3EraNodes() {
    if (!window.triadState) return;
    const state = window.triadState;
    const nodes = state.nodeNames;

    ['1979', '1999', '2019'].forEach(era => {
      const container = document.getElementById(`nodes-strip-${era}`);
      if (!container) return;

      const currentMeepleNode = state.meepleNodes[era];
      container.innerHTML = nodes.map((name, idx) => {
        const nodeNum = idx + 1;
        const isCurrent = (currentMeepleNode === nodeNum);
        const hasPlanted = state.plantedItems[nodeNum];
        return `
          <div class="node-slot ${isCurrent ? 'occupied' : ''}" onclick="triadRippleUI.onNodeClick('${era}', ${nodeNum})">
            <span class="node-num">N${nodeNum}</span>
            <span class="node-name">${name}</span>
            ${isCurrent ? `<span class="meeple-badge">${era} OPERATIVE</span>` : ''}
            ${hasPlanted ? `<span class="planted-marker" title="Item Planted">🌱</span>` : ''}
          </div>
        `;
      }).join('');
    });
  }

  renderPublicIntel() {
    const container = document.getElementById('public-intel-container');
    if (!container || !window.triadState) return;

    const intel = window.triadState.publicIntel;
    if (intel.length === 0) {
      container.innerHTML = `
        <div class="empty-intel-notice">
          <p>No cards have been Analyzed yet. Spend 1 AP at your station to analyze private clues and reveal them here!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = intel.map(card => {
      const keywordsHtml = (card.keywords || []).map(k => `<span class="intel-keyword-chip">${k}</span>`).join(' ');
      return `
        <div class="public-intel-card glass-panel">
          <div class="intel-card-header">
            <span class="intel-era-badge">${card.analyzedBy || 'INTEL'}</span>
            <h4>${card.title}</h4>
            <span class="intel-type-badge">${card.type}</span>
          </div>
          <p class="intel-card-text">${card.text}</p>
          <div class="intel-keywords-row">
            ${keywordsHtml}
          </div>
        </div>
      `;
    }).join('');
  }

  renderNotebook() {
    if (!window.triadState) return;
    const nb = window.triadState.consensusNotebook;
    const culEl = document.getElementById('nb-input-culprit');
    const weaEl = document.getElementById('nb-input-weapon');
    const motEl = document.getElementById('nb-input-motive');

    if (culEl && nb.culprit) culEl.value = nb.culprit;
    if (weaEl && nb.weapon) weaEl.value = nb.weapon;
    if (motEl && nb.motive) motEl.value = nb.motive;
  }

  onFlipTrack(trackId, newState) {
    if (!window.triadState) return;
    const success = window.triadState.temporalRipple(trackId, newState);
    if (success) {
      this.renderAll();
    }
  }

  onNodeClick(era, nodeNum) {
    // Only permit moving own meeple
    const myEra = window.triadState.getRoleEra(window.game.role);
    if (era !== myEra) {
      if (window.game) window.game.showToast(`⚠️ You can only move your own Operative meeple (${myEra})!`);
      return;
    }
    window.triadState.moveMeeple(myEra, nodeNum);
    this.renderAll();
  }

  onNotebookChange(field, val) {
    if (!window.triadState) return;
    window.triadState.setVerdict(field, val);
  }

  submitAccusation() {
    if (!window.triadState) return;
    const confirmed = confirm('ARE YOU CERTAIN? Submitting an incorrect Final Accusation will immediately trigger a Divergent Timeline collapse!');
    if (!confirmed) return;
    window.triadState.submitFinalAccusation();
  }
}

window.TriadRippleMatrixUI = TriadRippleMatrixUI;
window.triadRippleUI = new TriadRippleMatrixUI();
window.triadUI = window.triadRippleUI;
