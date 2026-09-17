/* ==========================================================================
   OPERATION: ZERO HOUR - CENTRAL GAME ENGINE & STATE MANAGER
   Supports Multi-Map Scenarios:
   - Scenario A: 'Silo 44' (Cold War Taiga Missile Bunker)
   - Scenario B: "The Alchemist's Study" (Victorian Clockwork Crypt)
   ========================================================================== */

class GameEngine {
  constructor() {
    this.scenario = 'silo44'; // 'silo44' or 'alchemist'
    this.role = null; // 'defuser', 'manual', 'intel'
    this.roomCode = '';
    this.timerSeconds = 300;
    this.timerInterval = null;
    this.strikes = 0;
    this.serialNumber = 'A3-89K';
    this.batteries = 2;
    this.indicators = { FRK: true, CAR: false };
    this.overrideUsed = false;
    this.gameEnded = false;

    // Authoritative Room State (Synchronized via Host)
    this.roomState = {
      scenario: 'silo44',
      roles: {
        defuser: null, // { clientId, label }
        manual: null,
        intel: null
      }
    };

    this.initDOM();
  }

  initDOM() {
    const setup = () => {
      const btnCreate = document.getElementById('btn-create-room');
      const btnJoin = document.getElementById('btn-join-room');
      const btnStart = document.getElementById('btn-start-game');
      const roomInput = document.getElementById('room-input');

      if (btnCreate) {
        btnCreate.addEventListener('click', () => {
          const code = roomInput.value.trim() || 'ALPHA';
          this.roomCode = code.toUpperCase();
          const roleBox = document.getElementById('role-selection-box');
          if (roleBox) roleBox.classList.remove('hidden');
          
          network.init(this.roomCode, true);
          this.configureHostLobby();
          this.updateRosterUI();
        });
      }

      if (btnJoin) {
        btnJoin.addEventListener('click', () => {
          const code = roomInput.value.trim() || 'ALPHA';
          this.roomCode = code.toUpperCase();
          const roleBox = document.getElementById('role-selection-box');
          if (roleBox) roleBox.classList.remove('hidden');
          
          network.init(this.roomCode, false);
          this.configureClientLobby();
          this.updateRosterUI();

          // Request authoritative room state from Host immediately and with slight fallback
          network.broadcast({ type: 'REQUEST_ROOM_STATE', clientId: network.clientId });
          setTimeout(() => {
            network.broadcast({ type: 'REQUEST_ROOM_STATE', clientId: network.clientId });
          }, 400);
        });
      }

      if (btnStart) {
        btnStart.addEventListener('click', () => {
          if (!network.isHost) return;
          if (!this.role) {
            alert('MISSION COMMANDER: You must assign an operative station before launching!');
            return;
          }

          this.startGameMission();
          network.broadcast({
            type: 'START_MISSION',
            roomCode: this.roomCode,
            scenario: this.scenario,
            roomState: this.roomState
          });
        });
      }

      network.onMessage((data) => this.handleNetworkMessage(data));
      network.onPeerDisconnect((lostClientId) => {
        if (network.isHost) {
          this.handlePeerDisconnected(lostClientId);
        }
      });

      // Auto-detect ?room= query parameter or prefill unique room code
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const urlRoom = urlParams.get('room');
        if (urlRoom && roomInput) {
          roomInput.value = urlRoom.toUpperCase();
          const banner = document.getElementById('lobby-network-banner');
          if (banner) {
            banner.innerHTML = `<span>🔗 Invite link detected for room <strong>${urlRoom.toUpperCase()}</strong>! Click <strong>JOIN ROOM</strong> to connect.</span>`;
          }
        } else if (roomInput && !roomInput.value) {
          const prefixes = ['SILO', 'KOLA', 'VAULT', 'APEX', 'RADAR', 'TITAN'];
          roomInput.value = prefixes[Math.floor(Math.random() * prefixes.length)] + Math.floor(Math.random() * 90 + 10);
        }
      } catch(e) {}
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setup);
    } else {
      setup();
    }
  }

  configureHostLobby() {
    const notice = document.getElementById('scenario-host-notice');
    if (notice) notice.classList.add('hidden');

    document.querySelectorAll('.scenario-card').forEach(card => {
      card.classList.remove('locked-client');
    });

    const startBtn = document.getElementById('btn-start-game');
    if (startBtn) {
      startBtn.classList.remove('hidden');
      startBtn.innerText = 'START DEFUSAL OPERATION';
    }
  }

  configureClientLobby() {
    const notice = document.getElementById('scenario-host-notice');
    if (notice) notice.classList.remove('hidden');

    // Disable scenario picking for non-host clients
    document.querySelectorAll('.scenario-card').forEach(card => {
      card.classList.add('locked-client');
    });

    const startBtn = document.getElementById('btn-start-game');
    if (startBtn) {
      startBtn.disabled = true;
      startBtn.innerText = 'SELECT YOUR OPERATIVE STATION ABOVE';
    }

    const statusText = document.getElementById('lobby-status-text');
    if (statusText) {
      statusText.innerHTML = 'STATUS: <span class="glow-yellow">JOINED ROOM — PLEASE SELECT A STATION ABOVE</span>';
    }
  }

  selectScenario(scenarioId) {
    // Only Host can change the map/scenario!
    if (!network.isHost) {
      if (window.audio) window.audio.playBuzz();
      console.warn('[Security] Map selection restricted to Mission Commander (Host)');
      return;
    }

    this.scenario = scenarioId;
    this.roomState.scenario = scenarioId;
    this.timerSeconds = (scenarioId === 'silo44') ? 300 : 360;

    this.updateScenarioUI(scenarioId);

    if (window.audio) window.audio.playClick();
    this.syncRoomState();
  }

  updateScenarioUI(scenarioId) {
    document.querySelectorAll('.scenario-card').forEach(card => {
      card.classList.toggle('active', card.dataset.scenario === scenarioId);
    });

    const titleEl = document.getElementById('current-scenario-title');
    if (titleEl) {
      titleEl.innerText = (scenarioId === 'silo44') 
        ? 'SILO 44: THE COLD WAR THERMOBARIC INCIDENT' 
        : "THE ALCHEMIST'S STUDY: LORD BLACKWOOD'S CLOCKWORK CRYPT";
    }
  }

  toggleRole(roleKey) {
    if (!this.roomState) return;

    // 1. Check if THIS client already holds this role -> Unclaim it
    if (this.role === roleKey) {
      this.requestUnclaimRole(roleKey);
      return;
    }

    // 2. Check if role is occupied by another operative -> Block with alert
    const occupant = this.roomState.roles[roleKey];
    if (occupant && occupant.clientId !== network.clientId) {
      if (window.audio) window.audio.playBuzz();
      alert(`STATION OCCUPIED: ${roleKey.toUpperCase()} is already claimed by ${occupant.label}! Choose another station.`);
      return;
    }

    // 3. Claim the role
    this.requestClaimRole(roleKey);
  }

  requestClaimRole(roleKey) {
    if (network.isHost) {
      // Clear any prior role held by Host
      for (let r in this.roomState.roles) {
        if (this.roomState.roles[r]?.clientId === network.clientId) {
          this.roomState.roles[r] = null;
        }
      }
      this.roomState.roles[roleKey] = {
        clientId: network.clientId,
        label: network.clientLabel
      };
      this.role = roleKey;
      if (window.audio) window.audio.playClick();
      this.syncRoomState();
      this.updateRosterUI();
    } else {
      if (!network.isConnected()) {
        this.pendingRoleClaim = roleKey;
        const statusText = document.getElementById('lobby-status-text');
        if (statusText) {
          statusText.innerHTML = `STATUS: <span class="glow-yellow">CONNECTING... Will auto-assign ${roleKey.toUpperCase()} upon connection!</span>`;
        }
        return;
      }
      this.pendingRoleClaim = null;
      // Send claim request to Host
      network.broadcast({
        type: 'CLAIM_ROLE_REQUEST',
        role: roleKey,
        clientId: network.clientId,
        label: network.clientLabel
      });
    }
  }

  onNetworkConnected() {
    if (this.pendingRoleClaim) {
      console.log('[Game] Connection established! Auto-claiming queued role:', this.pendingRoleClaim);
      const target = this.pendingRoleClaim;
      this.pendingRoleClaim = null;
      this.requestClaimRole(target);
    }
  }

  requestUnclaimRole(roleKey) {
    if (network.isHost) {
      if (this.roomState.roles[roleKey]?.clientId === network.clientId) {
        this.roomState.roles[roleKey] = null;
      }
      this.role = null;
      if (window.audio) window.audio.playClick();
      this.syncRoomState();
      this.updateRosterUI();
    } else {
      network.broadcast({
        type: 'UNCLAIM_ROLE_REQUEST',
        role: roleKey,
        clientId: network.clientId
      });
    }
  }

  syncRoomState() {
    if (network.isHost) {
      network.broadcast({
        type: 'ROOM_STATE_SYNC',
        roomState: this.roomState
      });
    }
  }

  updateRosterUI() {
    if (!this.roomState || !this.roomState.roles) return;

    let assignedCount = 0;
    const rolesList = ['defuser', 'manual', 'intel'];

    rolesList.forEach(r => {
      const assignment = this.roomState.roles[r];
      const chipEl = document.getElementById(`roster-status-${r}`);
      const btnEl = document.getElementById(`btn-role-${r}`);
      const cardEl = document.getElementById(`card-role-${r}`);

      if (!assignment) {
        // OPEN SLOT
        if (chipEl) {
          chipEl.className = 'slot-badge open';
          chipEl.innerText = 'OPEN SLOT';
        }
        if (btnEl) {
          btnEl.disabled = false;
          btnEl.className = 'btn btn-role';
          btnEl.innerText = `SELECT ${r.toUpperCase()}`;
        }
        if (cardEl) {
          cardEl.classList.remove('active', 'claimed');
        }
      } else if (assignment.clientId === network.clientId) {
        // CLAIMED BY YOU
        assignedCount++;
        if (chipEl) {
          chipEl.className = 'slot-badge you';
          chipEl.innerText = 'ASSIGNED (YOU)';
        }
        if (btnEl) {
          btnEl.disabled = false;
          btnEl.className = 'btn btn-role assigned-you';
          btnEl.innerText = 'ASSIGNED (YOU) - CLICK TO RELEASE';
        }
        if (cardEl) {
          cardEl.classList.add('active');
          cardEl.classList.remove('claimed');
        }
      } else {
        // CLAIMED BY ANOTHER PEER
        assignedCount++;
        if (chipEl) {
          chipEl.className = 'slot-badge claimed';
          chipEl.innerText = `CLAIMED: ${assignment.label}`;
        }
        if (btnEl) {
          btnEl.disabled = true;
          btnEl.className = 'btn btn-role claimed-by-peer';
          btnEl.innerText = `CLAIMED BY ${assignment.label}`;
        }
        if (cardEl) {
          cardEl.classList.remove('active');
          cardEl.classList.add('claimed');
        }
      }
    });

    // Update Readiness Badge
    const badgeEl = document.getElementById('roster-readiness-badge');
    if (badgeEl) {
      if (assignedCount === 3) {
        badgeEl.className = 'badge badge-success glow-green';
        badgeEl.innerText = '3 / 3 OPERATIVES READY (ALL STATIONS MANNED)';
      } else {
        badgeEl.className = 'badge badge-warning';
        badgeEl.innerText = `${assignedCount} / 3 STATIONS ASSIGNED`;
      }
    }

    // Role display in top header
    const roleDisp = document.getElementById('role-display');
    if (roleDisp) {
      roleDisp.innerHTML = `ROLE: <strong class="text-highlight">${this.role ? this.role.toUpperCase() : 'UNASSIGNED'}</strong>`;
    }

    // Update Start Button & Lobby Status
    const startBtn = document.getElementById('btn-start-game');
    const statusText = document.getElementById('lobby-status-text');

    if (network.isHost) {
      if (assignedCount > 0) {
        if (startBtn) {
          startBtn.disabled = false;
          startBtn.innerText = (assignedCount === 3) 
            ? '🚀 LAUNCH OPERATION (3/3 READY)' 
            : `START OPERATION (${assignedCount}/3 ASSIGNED)`;
        }
        if (statusText) {
          statusText.innerHTML = 'STATUS: <span class="glow-green">READY TO LAUNCH</span>';
        }
      } else {
        if (startBtn) {
          startBtn.disabled = true;
          startBtn.innerText = 'SELECT AN OPERATIVE STATION';
        }
        if (statusText) {
          statusText.innerHTML = 'STATUS: <span class="glow-yellow">AWAITING OPERATIVES</span>';
        }
      }
    } else {
      if (startBtn) {
        startBtn.disabled = true;
        startBtn.innerText = this.role 
          ? 'STATION MANNED — WAITING FOR COMMANDER (HOST) TO LAUNCH' 
          : 'SELECT YOUR OPERATIVE STATION ABOVE TO READY UP';
      }
      if (statusText) {
        statusText.innerHTML = this.role 
          ? 'STATUS: <span class="glow-green">READY! WAITING FOR COMMANDER (HOST) TO LAUNCH MISSION</span>' 
          : 'STATUS: <span class="glow-yellow">ACTION REQUIRED: SELECT AN OPEN STATION ABOVE</span>';
      }
    }
  }

  startGameMission() {
    const seed = this.hashString(this.roomCode);
    this.generateMissionSpecs(seed);

    // Hide all screens, activate selected role screen
    document.querySelectorAll('section').forEach(s => s.classList.remove('active-screen'));

    // Update top bar level display for all operatives
    const levelDisplay = document.getElementById('level-display');
    const levelName = document.getElementById('level-display-name');
    if (levelDisplay && levelName) {
      levelDisplay.classList.remove('hidden');
      levelName.innerText = (this.scenario === 'silo44') ? 'MAP 1 // SILO 44' : "MAP 2 // THE ALCHEMIST'S STUDY";
    }

    if (this.role === 'defuser') {
      const screen = document.getElementById('screen-defuser');
      if (screen) screen.classList.add('active-screen');
      if (window.bomb3D) {
        window.bomb3D.init(this.scenario);
      }
    } else if (this.role === 'manual') {
      const screen = document.getElementById('screen-manual');
      if (screen) screen.classList.add('active-screen');
      if (window.manualView) window.manualView.init(this.scenario);
    } else if (this.role === 'intel') {
      const screen = document.getElementById('screen-intel');
      if (screen) screen.classList.add('active-screen');
      if (window.intelView) window.intelView.init(this.scenario);
    } else {
      const screen = document.getElementById('screen-defuser');
      if (screen) screen.classList.add('active-screen');
      if (window.bomb3D) {
        window.bomb3D.init(this.scenario);
      }
    }

    this.startTimer();
  }

  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  generateMissionSpecs(seed) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const char1 = chars[seed % chars.length];
    const num1 = nums[(seed + 3) % nums.length];
    const num2 = nums[(seed + 7) % nums.length];
    const num3 = nums[(seed + 11) % nums.length];
    const char2 = chars[(seed + 5) % chars.length];

    this.serialNumber = `${char1}${num1}-${num2}${num3}${char2}`;
    this.batteries = (seed % 3) + 1;
    this.indicators = {
      FRK: (seed % 2 === 0),
      CAR: (seed % 3 === 0)
    };

    if (this.scenario === 'silo44') {
      this.timerSeconds = 300;
      if (window.wiresModule) window.wiresModule.generate(seed, this.serialNumber);
      if (window.keypadModule) window.keypadModule.generate(seed + 10);
      if (window.frequencyModule) window.frequencyModule.generate(seed + 25);
      if (window.simonModule) window.simonModule.generate(seed + 40);
    } else {
      this.timerSeconds = 360;
      if (window.zodiacModule) window.zodiacModule.generate(seed);
      if (window.mercuryModule) window.mercuryModule.generate(seed + 15);
      if (window.prismModule) window.prismModule.generate(seed + 30);
      if (window.escapementModule) window.escapementModule.generate(seed + 45);
    }

    this.updateClockDisplays();
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    
    this.timerInterval = setInterval(() => {
      if (this.gameEnded) return;

      this.timerSeconds -= 1;
      if (this.scenario === 'silo44') {
        if (window.audio) window.audio.playTick();
      } else {
        if (window.audio) window.audio.playClockTick(this.timerSeconds % 2 === 0);
      }
      this.updateClockDisplays();

      if (this.timerSeconds <= 0) {
        this.triggerExplosion('TIME_EXPIRED');
      }
    }, 1000);
  }

  updateClockDisplays() {
    const mins = Math.floor(Math.max(0, this.timerSeconds) / 60);
    const secs = Math.max(0, this.timerSeconds) % 60;
    const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    const defTimer = document.getElementById('defuser-timer');
    if (defTimer) defTimer.innerText = timeStr;
  }

  addStrike() {
    this.strikes += 1;
    network.broadcast({ type: 'STRIKE_EVENT', strikes: this.strikes });
    this.updateStrikeDisplays();

    if (this.strikes >= 3) {
      this.triggerExplosion('MAX_STRIKES');
    }
  }

  updateStrikeDisplays() {
    for (let i = 1; i <= 3; i++) {
      const led = document.getElementById(`strike-${i}`);
      if (led) {
        if (i <= this.strikes) led.classList.add('active');
        else led.classList.remove('active');
      }
    }
  }

  checkVictory() {
    let allSolved = false;

    if (this.scenario === 'silo44') {
      const wSolved = window.wiresModule ? window.wiresModule.disarmed : false;
      const kSolved = window.keypadModule ? window.keypadModule.disarmed : false;
      const fSolved = window.frequencyModule ? window.frequencyModule.disarmed : false;
      const sSolved = window.simonModule ? window.simonModule.disarmed : false;
      allSolved = (wSolved && kSolved && fSolved && sSolved);
    } else {
      const zSolved = window.zodiacModule ? window.zodiacModule.solved : false;
      const mSolved = window.mercuryModule ? window.mercuryModule.solved : false;
      const pSolved = window.prismModule ? window.prismModule.solved : false;
      const eSolved = window.escapementModule ? window.escapementModule.solved : false;
      allSolved = (zSolved && mSolved && pSolved && eSolved);
    }

    if (allSolved) {
      this.triggerVictory();
      network.broadcast({ type: 'MISSION_VICTORY' });
    }
  }

  checkAllModulesDisarmed() {
    this.checkVictory();
  }

  triggerEmergencyOverride() {
    if (this.overrideUsed || this.gameEnded) return;

    this.overrideUsed = true;
    this.timerSeconds += 30;
    if (window.audio) window.audio.playDisarmed();

    network.broadcast({ type: 'OVERRIDE_ACTIVATED', seconds: this.timerSeconds });
    this.updateClockDisplays();
  }

  triggerVictory() {
    this.gameEnded = true;
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (window.audio) window.audio.playSuccess();

    const modal = document.getElementById('game-over-modal');
    const title = document.getElementById('end-title');
    const subtitle = document.getElementById('end-subtitle');

    if (title) {
      title.innerText = (this.scenario === 'silo44') 
        ? 'PERIMETR CASCADE HALTED - SILO DISARMED' 
        : 'SOLOMON PORTCULLIS UNLOCKED - MAGNUM OPUS PRESERVED';
      title.className = 'end-heading victory';
    }
    if (subtitle) {
      subtitle.innerText = (this.scenario === 'silo44')
        ? 'The Iskra-7 warhead failsafe is safely neutralized. World saved from nuclear exchange.'
        : 'The Athanor Horologium has ceased ticking. The phosgene vitriol gas vents have safely closed!';
    }

    const defTimer = document.getElementById('defuser-timer');
    const timeEl = document.getElementById('end-time');
    const strikesEl = document.getElementById('end-strikes');
    if (timeEl) timeEl.innerText = defTimer ? defTimer.innerText : '00:00';
    if (strikesEl) strikesEl.innerText = `${this.strikes} / 3`;

    if (modal) modal.classList.remove('hidden');
  }

  triggerExplosion(reason) {
    this.gameEnded = true;
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (window.audio) window.audio.playExplosion();

    const modal = document.getElementById('game-over-modal');
    const title = document.getElementById('end-title');
    const subtitle = document.getElementById('end-subtitle');

    if (title) {
      title.innerText = (this.scenario === 'silo44') ? 'THERMOBARIC COLLAPSE!' : 'VITRIOL GAS DETONATION!';
      title.className = 'end-heading loss';
    }
    if (subtitle) {
      subtitle.innerText = reason === 'MAX_STRIKES' 
        ? '3 strikes incurred. Anti-tamper failsafe triggered catastrophic detonation.' 
        : 'Terminal countdown reached zero. All operatives compromised!';
    }

    const timeEl = document.getElementById('end-time');
    const strikesEl = document.getElementById('end-strikes');
    if (timeEl) timeEl.innerText = '00:00';
    if (strikesEl) strikesEl.innerText = `${this.strikes} / 3`;

    if (modal) modal.classList.remove('hidden');
  }

  // Environmental Lore Modal Handlers
  openLoreModal(loreId) {
    const modal = document.getElementById('lore-inspect-modal');
    const title = document.getElementById('lore-modal-title');
    const body = document.getElementById('lore-modal-body');
    if (!modal || !title || !body) return;

    if (loreId === 'logbook') {
      title.innerText = 'DOCUMENT: STAINED MAINTENANCE LOG (W/O VORONIN)';
      body.innerHTML = `
        <div class="lore-document-paper">
          <p><strong>DATE: 14.X.1983 // OBJECT 44-KEDR</strong></p>
          <p><em>"The men who arrived this morning do not wear Red Army insignia. They carry civilian forged transit papers signed by General-Colonel Gerasimov. Commander calls himself 'Kassad'. They unloaded three wooden crates into Chamber 4-B. It is not fertilizer. It is the Iskra device from Arzamas-16."</em></p>
          <p><em>"Kassad caught Private Zotov trying to use the field radio. Shot him against the blast door. They forced me at gunpoint to solder the dual-stage frequency relay into the primary timer board. God forgive me, I deliberately swapped the secondary feedback loop... DO NOT trust the stamped casing numbers—check battery cell polarity before cutting the black ground wire!"</em></p>
          <p class="blood-note" style="color:#d44; font-weight:bold;">[Smear of dried blood: "Masha, run to the dacha. They are going to burn the sky."]</p>
        </div>
      `;
    } else if (loreId === 'dictaphone') {
      title.innerText = 'AUDIO TAPE RECORDING: VEF-SPIDOLA 1978';
      body.innerHTML = `
        <div class="lore-audio-paper">
          <p><strong>[SOUND: 50Hz GROUND HUM, TAPE HEAD HISS]</strong></p>
          <p><strong>VOICE (KASSAD):</strong> <em>"Report to Central. The detonator harness is seated. Iskra-7 is live. The fools in Moscow think this is a bluff. When the barometric pressure drops in Helsinki tonight, they will understand that the Union will not bleed quietly into history."</em></p>
          <p><strong>VOICE (VORONIN):</strong> <em>"Commander, the seal... if the hydraulic pressure drops in the blast door, the dead-hand loop will trigger automatically—"</em></p>
          <p><strong>VOICE (KASSAD):</strong> <em>"Good. Then neither we nor they shall leave this vault alive."</em></p>
        </div>
      `;
    } else if (loreId === 'journal') {
      title.innerText = "MEMOIRS: LORD ALISTAIR BLACKWOOD (SAMHAIN 1888)";
      body.innerHTML = `
        <div class="lore-document-paper gothic-text">
          <p><em>"They knock upon the manor gates even now. Men of small minds—constables and cowards who mistake the great art of transmutation for charlatanism. Brother Moros warned me the Lodge had been bought by the Crown."</em></p>
          <p><em>"The Horologium is wound. Its heart beats sixty times each minute, governed not by mundane springs, but by the weight of falling mercury. I have devised the final safeguard: <strong>The blood of the dragon must never be divided while the Moon sleeps in the house of Saturn.</strong>"</em></p>
          <p><em>"If an uninitiated hand cuts the scarlet filament while the planetary dial points toward the waning crescent, the glass reservoir will shatter, and the breath of the basilisk will claim every soul within these walls."</em></p>
        </div>
      `;
    } else if (loreId === 'phonograph') {
      title.innerText = "WAX CYLINDER RECORDING: PHONOGRAPH 1888";
      body.innerHTML = `
        <div class="lore-audio-paper">
          <p><strong>[SOUND: SURFACE SCRATCH, CRACKLING REED HORN]</strong></p>
          <p><strong>VOICE (BROTHER MOROS):</strong> <em>"Silas Thorne... if you have breached the scriptorium, turn back. Blackwood has linked the chamber portcullis directly to the escapement of the Horologium. You cannot force the doors without shattering the phosgene ampoules."</em></p>
          <p><em>"Your only salvation lies in the Tabula Hermetica. Find the ruling house, align the three brass rings at the zenith needle, and balance the quicksilver drams before midnight chimes."</em></p>
        </div>
      `;
    } else if (loreId === 'briefing') {
      if (this.scenario === 'silo44') {
        title.innerText = 'MISSION DOSSIER: SILO 44 - THE COLD WAR THERMOBARIC INCIDENT';
        body.innerHTML = `
          <div class="lore-briefing-paper">
            <h3>LOCATION: Kola Peninsula, USSR // Object 44 ("Kedr")</h3>
            <p><strong>PREMISE:</strong> An ultra-nationalist splinter syndicate has seized a decommissioned early-warning missile bunker and armed "Iskra-7", a high-yield aerosolized thermobaric warhead.</p>
            <p><strong>THE TRAP:</strong> Protocol 'Zaslon' locked Hermetic Gate 04. Operative 1 is sealed inside Chamber 4-B with toxic nitrogen dioxide rising.</p>
            <p><strong>THE CONSEQUENCE:</strong> Detonation will trigger the automated Soviet nuclear command grid (*Perimetr / Dead Hand*), launching counter-strikes across Eurasia in 27 minutes.</p>
            <p><strong>COMMUNICATION:</strong> Operatives 2 & 3 are tapped into sound-powered TA-57 field telephones and umbilical telemetry cables.</p>
          </div>
        `;
      } else {
        title.innerText = "CASE FILE: THE ALCHEMIST'S STUDY - LORD BLACKWOOD'S CLOCKWORK CRYPT";
        body.innerHTML = `
          <div class="lore-briefing-paper">
            <h3>LOCATION: Yorkshire Moors, England // Blackwood Manor Scriptorium (1888)</h3>
            <p><strong>PREMISE:</strong> Lord Alistair Blackwood, Supreme Magus of the Hermetic Circle of the Ouroboros, has locked himself in his subterranean laboratory with the Athanor Horologium.</p>
            <p><strong>THE TRAP:</strong> Stepping on the mosaic triggered Solomon's Portcullis. Iron deadbolts geared to the ticking contraption have severed the exit archway.</p>
            <p><strong>THE CONSEQUENCE:</strong> At midnight chime, concentrated red vitriol (alchemical phosgene) acid valves will deluge the crypt, collapsing the manor foundation into the subterranean aqueduct.</p>
            <p><strong>COMMUNICATION:</strong> Acoustic speaking tubes through the granite walls and Cooke & Wheatstone needle telegraph.</p>
          </div>
        `;
      }
    }

    modal.classList.remove('hidden');
    if (window.audio) window.audio.playPageTurn();
  }

  closeLoreModal() {
    const modal = document.getElementById('lore-inspect-modal');
    if (modal) modal.classList.add('hidden');
    if (window.audio) window.audio.playClick();
    if (window.bomb3D && window.bomb3D.currentView !== 'OVERVIEW') {
      window.bomb3D.setView('OVERVIEW');
    }
  }

  handlePeerDisconnected(lostClientId) {
    if (!network.isHost) return;
    let modified = false;
    for (let r in this.roomState.roles) {
      if (this.roomState.roles[r]?.clientId === lostClientId) {
        console.log(`[Host] Operative ${lostClientId} disconnected. Vacating role: ${r}`);
        this.roomState.roles[r] = null;
        modified = true;
      }
    }
    if (modified) {
      this.syncRoomState();
      this.updateRosterUI();
    }
  }

  handleNetworkMessage(data) {
    if (!data) return;

    // ================= 1. HOST AUTHORITATIVE ROLE HANDLING =================
    if (network.isHost) {
      if (data.type === 'REQUEST_ROOM_STATE' || data.type === 'PEER_CONNECTED' || data.type === 'PEER_HANDSHAKE') {
        this.syncRoomState();
        return;
      }

      if (data.type === 'CLAIM_ROLE_REQUEST') {
        const { role, clientId, label } = data;
        const currentOccupant = this.roomState.roles[role];

        // If role is free OR already held by same client: grant!
        if (!currentOccupant || currentOccupant.clientId === clientId) {
          // Clear any other role this client might have held
          for (let r in this.roomState.roles) {
            if (this.roomState.roles[r]?.clientId === clientId) {
              this.roomState.roles[r] = null;
            }
          }
          this.roomState.roles[role] = { clientId, label: label || 'OPERATIVE' };
          this.syncRoomState();
          this.updateRosterUI();
        } else {
          // Role is already occupied! Reject claim
          network.broadcast({
            type: 'ROLE_CLAIM_REJECTED',
            targetClientId: clientId,
            role: role,
            reason: `Station already claimed by ${currentOccupant.label}`
          });
        }
        return;
      }

      if (data.type === 'UNCLAIM_ROLE_REQUEST') {
        const { role, clientId } = data;
        if (this.roomState.roles[role]?.clientId === clientId) {
          this.roomState.roles[role] = null;
          this.syncRoomState();
          this.updateRosterUI();
        }
        return;
      }

      if (data.type === 'PEER_DISCONNECTED') {
        this.handlePeerDisconnected(data.clientId);
        return;
      }
    }

    // ================= 2. CLIENT & PEER STATE SYNCHRONIZATION =================
    if (data.type === 'ROOM_STATE_SYNC') {
      this.roomState = data.roomState;

      // Sync scenario from host
      if (data.roomState.scenario) {
        this.scenario = data.roomState.scenario;
        this.updateScenarioUI(data.roomState.scenario);
      }

      // Check if my role has been assigned or released
      let myRole = null;
      for (let r in this.roomState.roles) {
        if (this.roomState.roles[r]?.clientId === network.clientId) {
          myRole = r;
          break;
        }
      }
      this.role = myRole;
      this.updateRosterUI();

    } else if (data.type === 'ROLE_CLAIM_REJECTED') {
      if (data.targetClientId === network.clientId) {
        if (window.audio) window.audio.playBuzz();
        alert(`STATION OCCUPIED: ${data.reason}! Please pick another station.`);
      }

    } else if (data.type === 'START_MISSION') {
      if (data.scenario) this.scenario = data.scenario;
      if (data.roomState) this.roomState = data.roomState;

      // Verify that this client has a role before entering
      if (!this.role) {
        for (let r in this.roomState?.roles) {
          if (this.roomState.roles[r]?.clientId === network.clientId) {
            this.role = r;
            break;
          }
        }
      }

      this.startGameMission();

    } else if (data.type === 'STRIKE_EVENT') {
      this.strikes = data.strikes;
      this.updateStrikeDisplays();

    } else if (data.type === 'OVERRIDE_ACTIVATED') {
      this.timerSeconds = data.seconds;
      this.updateClockDisplays();

    } else if (data.type === 'FREQ_TUNE_UPDATE') {
      if (window.frequencyModule) {
        window.frequencyModule.currentFreq = data.freq;
        const el = document.getElementById('intel-dossier-current-freq');
        if (el) el.innerText = `${data.freq.toFixed(1)} MHz`;
      }

    } else if (data.type === 'MISSION_VICTORY') {
      this.triggerVictory();
    }
  }
}

const game = new GameEngine();
window.game = game;
