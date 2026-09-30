/* ==========================================================================
   THE TRIAD PARADOX: CENTRAL STATE ENGINE & CAUSALITY MANAGER
   Tracks: 3 Eras, 5 Nodes, 6-Track Ripple Matrix, Action Points,
           Chronal Stability, Paradox Detection & Star P2P Synchronization
   ========================================================================== */

class TriadStateManager {
  constructor() {
    this.chronalStability = 20;
    this.round = 1;
    this.activeEra = '1979'; // '1979' -> '1999' -> '2019' -> 'CONSENSUS'
    this.gameEnded = false;
    this.isVictory = false;

    // Action Points per player per round (Max 3)
    this.ap = {
      '1979': 3,
      '1999': 3,
      '2019': 3
    };

    // Current Room / Node for each era meeple (1 to 5)
    // 1: Laboratory, 2: Director's Office, 3: Temporal Vault, 4: Courtyard, 5: Security Hub
    this.meepleNodes = {
      '1979': 5,
      '1999': 5,
      '2019': 5
    };

    this.nodeNames = [
      'Laboratory',
      "Director's Office",
      'Temporal Vault',
      'Courtyard',
      'Security Hub'
    ];

    // Ripple Matrix: 6 State Tracks
    this.rippleTracks = {
      vaultDoor: {
        id: 'vaultDoor',
        name: 'Temporal Vault Bulkhead',
        state: 'LOCKED', // 'LOCKED' | 'UNLOCKED'
        states: ['LOCKED', 'UNLOCKED'],
        desc: 'Reinforced magnetic blast door sealing the primary temporal chamber.'
      },
      coolantLine: {
        id: 'coolantLine',
        name: 'Reactor Cryo-Coolant Line',
        state: 'PRESSURIZED', // 'PRESSURIZED' | 'DEPRESSURIZED'
        states: ['PRESSURIZED', 'DEPRESSURIZED'],
        desc: 'Liquid nitrogen coolant line. When pressurized, ventilation ducts are filled with freezing fog.'
      },
      courtyardCistern: {
        id: 'courtyardCistern',
        name: 'Courtyard Sub-Cistern',
        state: 'FLOODED', // 'FLOODED' | 'DRAINED'
        states: ['FLOODED', 'DRAINED'],
        desc: 'Subterranean rainwater drainage basin. Grate is submerged under 10ft of water when flooded.'
      },
      directorSafe: {
        id: 'directorSafe',
        name: "Director's Biometric Wall Safe",
        state: 'BIOMETRIC_LOCKED', // 'BIOMETRIC_LOCKED' | 'BYPASSED'
        states: ['BIOMETRIC_LOCKED', 'BYPASSED'],
        desc: 'Executive wall safe calibrated to Julian Vance’s retinal and palm imprint.'
      },
      powerGrid: {
        id: 'powerGrid',
        name: 'Sub-Level High Voltage Grid',
        state: 'HIGH_VOLTAGE', // 'HIGH_VOLTAGE' | 'REROUTED'
        states: ['HIGH_VOLTAGE', 'REROUTED'],
        desc: 'Supplies experimental 50kV power to laboratory coils and containment fields.'
      },
      securityArchive: {
        id: 'securityArchive',
        name: 'Security Archive Reel Media',
        state: 'UNSHIELDED', // 'UNSHIELDED' | 'FARADAY_SHIELDED'
        states: ['UNSHIELDED', 'FARADAY_SHIELDED'],
        desc: 'Reel-to-reel magnetic backup tapes storing facility surveillance.'
      }
    };

    // Private Player Hands
    this.hands = {
      '1979': [],
      '1999': [],
      '2019': []
    };

    // Public Intel Pool (Cards that have been Analyzed face-up)
    this.publicIntel = [];

    // 2019 Unlocked Revelations
    this.revelations = [];

    // Planted Items by 1979: { [nodeNumber]: cardObject }
    this.plantedItems = {};

    // Secured Items by 1999
    this.securedItems = [];

    // Bypasses activated by 2019 Decrypt action
    this.decryptedBypasses = {};

    // Consensus Notebook State
    this.consensusNotebook = {
      culprit: '',
      weapon: '',
      motive: ''
    };

    // Correct Canonical Solution for Case 005
    this.solution = {
      culprit: 'Valerie Cross',
      weapon: 'Dual-Harmonic Tachyon Emitter',
      motive: 'Patent Theft & Temporal Assassination'
    };

    // Deck Piles
    this.deckPiles = {
      '1979': [],
      '1999': [],
      '2019': [],
      forensic: [],
      revelation: []
    };

    this.initDecks();
  }

  initDecks() {
    if (!window.TRIAD_CARDS_DB) return;
    this.deckPiles['1979'] = [...window.TRIAD_CARDS_DB.deck1979];
    this.deckPiles['1999'] = [...window.TRIAD_CARDS_DB.deck1999];
    this.deckPiles['2019'] = [...window.TRIAD_CARDS_DB.deck2019];
    this.deckPiles.forensic = [...window.TRIAD_CARDS_DB.forensic1999];
    this.deckPiles.revelation = [...window.TRIAD_CARDS_DB.revelations2019];

    // Deal 3 starting cards to each era
    this.hands['1979'] = this.drawCards('1979', 3);
    this.hands['1999'] = this.drawCards('1999', 3);
    this.hands['2019'] = this.drawCards('2019', 3);
  }

  drawCards(era, count = 1, node = null) {
    const pile = this.deckPiles[era];
    if (!pile || pile.length === 0) return [];
    
    let eligible = pile;
    if (node !== null) {
      eligible = pile.filter(c => c.node === node);
      if (eligible.length === 0) eligible = pile; // fallback to any
    }

    const drawn = [];
    for (let i = 0; i < count && eligible.length > 0; i++) {
      const idx = Math.floor(Math.random() * eligible.length);
      const card = eligible.splice(idx, 1)[0];
      // remove from main pile as well
      const mainIdx = pile.findIndex(c => c.id === card.id);
      if (mainIdx !== -1) pile.splice(mainIdx, 1);
      drawn.push(card);
    }
    return drawn;
  }

  // Map GameEngine roles to Triad eras
  getRoleEra(role) {
    if (role === 'defuser') return '1979'; // The Architect
    if (role === 'manual') return '1999';  // The Detective
    if (role === 'intel') return '2019';   // The Archivist
    return '1979';
  }

  getEraRole(era) {
    if (era === '1979') return 'defuser';
    if (era === '1999') return 'manual';
    if (era === '2019') return 'intel';
    return 'defuser';
  }

  // ==========================================================================
  // ACTION POINT (AP) ECONOMY & STANDARD ACTIONS
  // ==========================================================================

  hasAP(era, cost = 1) {
    return (this.ap[era] || 0) >= cost;
  }

  spendAP(era, cost = 1) {
    if (!this.hasAP(era, cost)) return false;
    this.ap[era] -= cost;
    this.checkTurnProgression();
    this.broadcastState('AP_SPENT', { era, cost, remaining: this.ap[era] });
    return true;
  }

  checkTurnProgression() {
    // If all players have 0 AP, advance round
    const totalRemaining = this.ap['1979'] + this.ap['1999'] + this.ap['2019'];
    if (totalRemaining === 0) {
      this.advanceChronalRound();
    }
  }

  advanceChronalRound() {
    // Chronal Decay
    this.chronalStability -= 1;
    this.round += 1;

    // Reset AP for all players
    this.ap['1979'] = 3;
    this.ap['1999'] = 3;
    this.ap['2019'] = 3;

    if (window.audio && window.audio.playClockTick) window.audio.playClockTick();

    if (this.chronalStability <= 0) {
      this.triggerTimelineCollapse('CHRONAL_STABILITY_ZERO');
      return;
    }

    if (window.game) {
      window.game.showToast(`⏳ CHRONAL DECAY: Stability drops to ${this.chronalStability}. Round ${this.round} begins!`);
    }

    this.broadcastState('ROUND_ADVANCED', {
      round: this.round,
      stability: this.chronalStability,
      ap: this.ap
    });
  }

  // Action: MOVE (1 AP)
  moveMeeple(era, targetNode) {
    if (targetNode < 1 || targetNode > 5) return false;
    if (this.meepleNodes[era] === targetNode) return true; // already there

    // Check locked doors for 1999 / 2019
    if (targetNode === 3) { // Temporal Vault
      if (era === '1999' && this.rippleTracks.vaultDoor.state === 'LOCKED') {
        // Can only enter if coolant is depressurized (vent bypass)
        if (this.rippleTracks.coolantLine.state !== 'DEPRESSURIZED') {
          if (window.game) window.game.showToast('🔒 VAULT SEALED: Door is locked and vent shaft is filled with freezing cryo-fog!');
          if (window.audio && window.audio.playBuzz) window.audio.playBuzz();
          return false;
        }
      }
      if (era === '2019' && this.rippleTracks.vaultDoor.state === 'LOCKED' && !this.decryptedBypasses['vaultDoor']) {
        if (window.game) window.game.showToast('🔒 BULKHEAD COLLAPSED: 2019 requires DECRYPT action to breach the vault ruins!');
        if (window.audio && window.audio.playBuzz) window.audio.playBuzz();
        return false;
      }
    }

    if (!this.spendAP(era, 1)) return false;

    this.meepleNodes[era] = targetNode;
    if (window.audio && window.audio.playStep) window.audio.playStep();
    if (window.game) {
      window.game.showToast(`🚶 ${era} moved to Node ${targetNode}: <strong>${this.nodeNames[targetNode - 1]}</strong>`);
    }

    this.broadcastState('MEEPLE_MOVED', { era, node: targetNode });
    return true;
  }

  // Action: SEARCH (1 AP)
  searchCurrentNode(era) {
    if (!this.hasAP(era, 1)) return false;
    const currentNode = this.meepleNodes[era];
    const drawn = this.drawCards(era, 2, currentNode);

    if (drawn.length === 0) {
      if (window.game) window.game.showToast(`🔍 ${era} searched ${this.nodeNames[currentNode - 1]}, but found no further records.`);
      return false;
    }

    if (!this.spendAP(era, 1)) return false;

    // Player keeps 1, discards other
    const keptCard = drawn[0];
    this.hands[era].push(keptCard);

    if (window.audio && window.audio.playPageTurn) window.audio.playPageTurn();
    if (window.game) {
      window.game.showToast(`🔍 ${era} discovered a card in ${this.nodeNames[currentNode - 1]}: <em>"${keptCard.title}"</em>`);
    }

    this.broadcastState('CARD_SEARCHED', { era, card: keptCard });
    return true;
  }

  // Action: ANALYZE (1 AP)
  analyzeCard(era, cardId) {
    if (!this.hasAP(era, 1)) return false;
    const hand = this.hands[era];
    const cardIndex = hand.findIndex(c => c.id === cardId);
    if (cardIndex === -1) return false;

    if (!this.spendAP(era, 1)) return false;

    const [card] = hand.splice(cardIndex, 1);
    card.analyzedBy = era;
    this.publicIntel.push(card);

    if (window.audio && window.audio.playDisarmed) window.audio.playDisarmed();
    if (window.game) {
      window.game.showToast(`📜 PUBLIC INTEL REVEALED: ${era} analyzed <strong>"${card.title}"</strong>!`);
    }

    this.broadcastState('CARD_ANALYZED', { era, card });
    return true;
  }

  // ==========================================================================
  // ERA-SPECIFIC ACTIONS
  // ==========================================================================

  // 1979 Action: TEMPORAL RIPPLE (2 AP)
  // Changes a State Token on the Ripple Matrix. Checks for Paradoxes!
  temporalRipple(trackId, targetState) {
    if (!this.hasAP('1979', 2)) {
      if (window.game) window.game.showToast('⚠️ Requires 2 AP to alter a Temporal Ripple!');
      return false;
    }

    const track = this.rippleTracks[trackId];
    if (!track) return false;
    if (track.state === targetState) return true;

    // Check for Paradox Traps!
    const paradoxCheck = this.checkParadox(trackId, targetState);
    if (paradoxCheck.isParadox) {
      this.triggerParadox(paradoxCheck.reason);
      this.ap['1979'] = Math.max(0, this.ap['1979'] - 2);
      this.checkTurnProgression();
      return false;
    }

    if (!this.spendAP('1979', 2)) return false;

    const oldState = track.state;
    track.state = targetState;

    if (window.audio && window.audio.playTemporalRipple) {
      window.audio.playTemporalRipple();
    } else if (window.audio && window.audio.playSuccess) {
      window.audio.playSuccess();
    }

    if (window.game) {
      window.game.showToast(`🌀 TEMPORAL RIPPLE: 1979 flipped <strong>${track.name}</strong> from [${oldState}] to [${targetState}]! Future reality altered!`);
    }

    this.broadcastState('RIPPLE_CHANGED', { trackId, oldState, newState: targetState });
    return true;
  }

  // 1979 Action: PLANT ITEM (1 AP)
  plantItem(cardId, nodeNumber) {
    if (!this.hasAP('1979', 1)) return false;
    const hand = this.hands['1979'];
    const idx = hand.findIndex(c => c.id === cardId);
    if (idx === -1) return false;

    const card = hand[idx];
    if (!card.canPlant) {
      if (window.game) window.game.showToast(`⚠️ "${card.title}" cannot be planted in the environment.`);
      return false;
    }

    if (!this.spendAP('1979', 1)) return false;

    hand.splice(idx, 1);
    this.plantedItems[nodeNumber] = card;

    if (window.audio && window.audio.playClick) window.audio.playClick();
    if (window.game) {
      window.game.showToast(`🌱 ITEM PLANTED: 1979 stashed <strong>"${card.title}"</strong> in ${this.nodeNames[nodeNumber - 1]} for future discovery!`);
    }

    this.broadcastState('ITEM_PLANTED', { nodeNumber, card });
    return true;
  }

  // 1999 Action: FORENSIC SWEEP (2 AP)
  // Must be in the murder room (Node 3: Temporal Vault)
  forensicSweep() {
    if (!this.hasAP('1999', 2)) {
      if (window.game) window.game.showToast('⚠️ Forensic Sweep requires 2 AP!');
      return false;
    }

    if (this.meepleNodes['1999'] !== 3) {
      if (window.game) window.game.showToast('⚠️ Forensic Sweep can only be conducted inside the crime scene (Node 3: Temporal Vault)!');
      if (window.audio && window.audio.playBuzz) window.audio.playBuzz();
      return false;
    }

    if (this.deckPiles.forensic.length === 0) {
      if (window.game) window.game.showToast('🔬 Forensic analysis complete: All physical crime scene evidence has already been secured.');
      return false;
    }

    if (!this.spendAP('1999', 2)) return false;

    const card = this.deckPiles.forensic.shift();
    this.hands['1999'].push(card);

    if (window.audio && window.audio.playSuccess) window.audio.playSuccess();
    if (window.game) {
      window.game.showToast(`🔬 FORENSIC EVIDENCE SECURED: 1999 uncovered <strong>"${card.title}"</strong>!`);
    }

    this.broadcastState('FORENSIC_SWEEP_DONE', { card });
    return true;
  }

  // 1999 Action: SECURE EVIDENCE (1 AP)
  securePlantedEvidence(nodeNumber) {
    if (!this.hasAP('1999', 1)) return false;
    const planted = this.plantedItems[nodeNumber];

    if (!planted) {
      if (window.game) window.game.showToast(`🔎 Nothing planted in ${this.nodeNames[nodeNumber - 1]}.`);
      return false;
    }

    // Check if cistern was flooded when planted in node 4
    if (nodeNumber === 4 && this.rippleTracks.courtyardCistern.state === 'FLOODED') {
      if (window.game) window.game.showToast('🌊 FLOODED: The cistern is submerged under muddy water. 1979 must drain it first!');
      return false;
    }

    if (!this.spendAP('1999', 1)) return false;

    delete this.plantedItems[nodeNumber];
    this.hands['1999'].push(planted);
    this.securedItems.push(planted.id);

    if (window.audio && window.audio.playSuccess) window.audio.playSuccess();
    if (window.game) {
      window.game.showToast(`📦 EVIDENCE RETRIEVED: 1999 recovered 1979's planted <strong>"${planted.title}"</strong> from ${this.nodeNames[nodeNumber - 1]}!`);
    }

    this.broadcastState('EVIDENCE_SECURED', { nodeNumber, card: planted });
    return true;
  }

  // 2019 Action: SYNTHESIZE (2 AP)
  // Combines 1 Public Intel from 1979 and 1 from 1999 sharing a keyword
  synthesizeIntel(card1979Id, card1999Id) {
    if (!this.hasAP('2019', 2)) {
      if (window.game) window.game.showToast('⚠️ Synthesis requires 2 AP on the Quantum Archive Terminal!');
      return false;
    }

    const c1 = this.publicIntel.find(c => c.id === card1979Id);
    const c2 = this.publicIntel.find(c => c.id === card1999Id);

    if (!c1 || !c2) {
      if (window.game) window.game.showToast('⚠️ Both intel cards must be Analyzed (Public Intel) before synthesis!');
      return false;
    }

    // Find shared keywords
    const shared = (c1.keywords || []).filter(k => (c2.keywords || []).includes(k));
    if (shared.length === 0) {
      if (window.game) window.game.showToast('❌ NO QUANTUM MATCH: Selected cards share no matching keywords!');
      if (window.audio && window.audio.playBuzz) window.audio.playBuzz();
      return false;
    }

    // Check revelation deck for match
    const revIndex = this.deckPiles.revelation.findIndex(rev => {
      return rev.requiredKeywords.some(rk => shared.includes(rk));
    });

    if (revIndex === -1) {
      if (window.game) window.game.showToast(`⚠️ Keyword match [${shared.join(', ')}] analyzed, but no new revelation generated.`);
      return false;
    }

    if (!this.spendAP('2019', 2)) return false;

    const [revelation] = this.deckPiles.revelation.splice(revIndex, 1);
    this.revelations.push(revelation);

    if (window.audio && window.audio.playSuccess) window.audio.playSuccess();
    if (window.game) {
      window.game.showToast(`✨ QUANTUM SYNTHESIS SUCCESS: Unlocked <strong>"${revelation.title}"</strong>!`);
    }

    this.broadcastState('SYNTHESIS_SUCCESS', { revelation, sharedKeyword: shared[0] });
    return true;
  }

  // 2019 Action: DECRYPT (1 AP)
  // Modern electronic bypass without altering 1979 past
  decryptTrack(trackId) {
    if (!this.hasAP('2019', 1)) return false;
    if (this.decryptedBypasses[trackId]) {
      if (window.game) window.game.showToast('⚡ Track already decrypted by 2019 quantum terminal.');
      return true;
    }

    if (!this.spendAP('2019', 1)) return false;

    this.decryptedBypasses[trackId] = true;
    if (window.audio && window.audio.playKeypress) window.audio.playKeypress();
    if (window.game) {
      window.game.showToast(`💻 DECRYPTED: 2019 established a digital bypass for <strong>${this.rippleTracks[trackId]?.name || trackId}</strong>!`);
    }

    this.broadcastState('TRACK_DECRYPTED', { trackId });
    return true;
  }

  // ==========================================================================
  // PARADOX DETECTION SYSTEM
  // ==========================================================================

  checkParadox(trackId, targetState) {
    // Paradox Rule: If an item or clue has already been Analyzed in 1999 or 2019,
    // 1979 CANNOT take an action that contradicts that established future truth!

    // Paradox 1: Faraday Tape Shield Paradox
    if (trackId === 'securityArchive' && targetState === 'FARADAY_SHIELDED') {
      const tapeBurntPublic = this.publicIntel.some(c => c.id === '99-clue-01' || c.id === '99-item-04');
      if (tapeBurntPublic) {
        return {
          isParadox: true,
          reason: 'CAUSAL PARADOX: 1999 already verified the security tapes were burned by the EMP blast at 23:40! Shielding them in 1979 creates an impossible contradiction!'
        };
      }
    }

    // Paradox 2: Permanent Vault Lockout Paradox
    if (trackId === 'vaultDoor' && targetState === 'LOCKED') {
      const corpseDiscovered = this.publicIntel.some(c => c.id === '99-for-01' || c.id === '99-for-02');
      if (corpseDiscovered && this.rippleTracks.coolantLine.state === 'PRESSURIZED') {
        return {
          isParadox: true,
          reason: 'CAUSAL PARADOX: The victim and crime scene exist inside the Vault in 1999. Sealing all entry routes in 1979 prevents the victim from entering the chamber!'
        };
      }
    }

    return { isParadox: false };
  }

  triggerParadox(reason) {
    this.chronalStability -= 3;
    if (window.audio && window.audio.playParadoxAlarm) {
      window.audio.playParadoxAlarm();
    } else if (window.audio && window.audio.playBuzz) {
      window.audio.playBuzz();
    }

    if (window.game) {
      window.game.showToast(`🚨 <strong style="color:#ff3344;">PARADOX TRIGGERED!</strong><br>${reason}<br><strong>-3 CHRONAL STABILITY!</strong> (Now: ${this.chronalStability})`, 6000);
    }

    if (this.chronalStability <= 0) {
      this.triggerTimelineCollapse('PARADOX_CASCADE');
      return;
    }

    this.broadcastState('PARADOX_EVENT', { reason, stability: this.chronalStability });
  }

  // ==========================================================================
  // CONSENSUS STEP & FINAL VERDICT
  // ==========================================================================

  setVerdict(field, value) {
    if (this.consensusNotebook[field] !== undefined) {
      this.consensusNotebook[field] = value;
      this.broadcastState('VERDICT_FIELD_UPDATED', { field, value });
    }
  }

  submitFinalAccusation() {
    const { culprit, weapon, motive } = this.consensusNotebook;

    if (!culprit || !weapon || !motive) {
      if (window.game) window.game.showToast('⚠️ All three fields (Culprit, Weapon, Motive) must be logged in the Consensus Notebook!');
      return false;
    }

    // Evaluate solution
    const culpritCorrect = culprit.toLowerCase().includes('cross');
    const weaponCorrect = weapon.toLowerCase().includes('tachyon') || weapon.toLowerCase().includes('ouroboros');
    const motiveCorrect = motive.toLowerCase().includes('patent') || motive.toLowerCase().includes('assassin') || motive.toLowerCase().includes('corporate');

    if (culpritCorrect && weaponCorrect && motiveCorrect) {
      this.isVictory = true;
      this.gameEnded = true;
      if (window.audio && window.audio.playSuccess) window.audio.playSuccess();
      if (window.game) window.game.triggerVictory();
      this.broadcastState('FINAL_VICTORY', { notebook: this.consensusNotebook });
      return true;
    } else {
      // Divergent timeline loss
      this.chronalStability = 0;
      this.triggerTimelineCollapse('DIVERGENT_TIMELINE_MISACCUSATION');
      this.broadcastState('MISSION_FAILED', { reason: 'DIVERGENT_TIMELINE' });
      return false;
    }
  }

  triggerTimelineCollapse(reason) {
    this.gameEnded = true;
    if (window.audio && window.audio.playExplosion) window.audio.playExplosion();
    if (window.game) {
      window.game.triggerExplosion('TIMELINE_COLLAPSE', false);
    }
  }

  // ==========================================================================
  // P2P STAR NETWORK SYNCHRONIZATION
  // ==========================================================================

  broadcastState(actionType, payload) {
    if (typeof network !== 'undefined' && network.broadcast) {
      network.broadcast({
        type: 'TRIAD_EVENT',
        action: actionType,
        payload: payload,
        fullState: this.serializeState()
      });
    }
  }

  handleNetworkEvent(data) {
    if (!data || data.type !== 'TRIAD_EVENT') return;
    if (data.fullState) {
      this.deserializeState(data.fullState);
    }
    if (data.action === 'FINAL_VICTORY' || this.isVictory) {
      if (window.game && !window.game.gameEnded) {
        window.game.triggerVictory();
      }
    } else if (data.action === 'MISSION_FAILED') {
      if (window.game && !window.game.gameEnded) {
        window.game.triggerExplosion('TIMELINE_COLLAPSE', false);
      }
    }
  }

  serializeState() {
    return {
      chronalStability: this.chronalStability,
      round: this.round,
      ap: this.ap,
      meepleNodes: this.meepleNodes,
      rippleTracks: this.rippleTracks,
      publicIntel: this.publicIntel,
      revelations: this.revelations,
      plantedItems: this.plantedItems,
      securedItems: this.securedItems,
      decryptedBypasses: this.decryptedBypasses,
      consensusNotebook: this.consensusNotebook,
      gameEnded: this.gameEnded,
      isVictory: this.isVictory
    };
  }

  deserializeState(state) {
    if (!state) return;
    this.chronalStability = state.chronalStability;
    this.round = state.round;
    this.ap = state.ap;
    this.meepleNodes = state.meepleNodes;
    this.rippleTracks = state.rippleTracks;
    this.publicIntel = state.publicIntel;
    this.revelations = state.revelations;
    this.plantedItems = state.plantedItems;
    this.securedItems = state.securedItems;
    this.decryptedBypasses = state.decryptedBypasses;
    this.consensusNotebook = state.consensusNotebook;
    this.gameEnded = state.gameEnded;
    this.isVictory = state.isVictory;

    // Refresh active UI controllers across all roles
    if (window.triadManualInstance && window.triadManualInstance.render) {
      window.triadManualInstance.render();
    }
    if (window.triadIntelInstance && window.triadIntelInstance.render) {
      window.triadIntelInstance.render();
    }
    if (window.triadRippleUI && window.triadRippleUI.renderAll) {
      window.triadRippleUI.renderAll();
    }
    if (window.triadEnvInstance && window.triadEnvInstance.renderHUD) {
      window.triadEnvInstance.renderHUD();
    }
  }
}

window.TriadStateManager = TriadStateManager;
window.triadState = new TriadStateManager();
