/* ==========================================================================
   OPERATION: ZERO HOUR - MAP 4: LEVEL NULL (INCIDENT 1989)
   MODULE 2: TIMELINE & KEYCARD TELEMETRY RECONSTRUCTION
   Spatiotemporal Trajectory Analysis & Alibi Verification
   ========================================================================== */

class LevelNullTimelineModule {
  constructor() {
    this.id = 'levelnull_timeline';
    this.name = 'Keycard Telemetry & Timeline Mainframe';
    this.disarmed = false;

    this.SECTORS = [
      { id: 'SECTOR_1', name: 'SECTOR 1: EXECUTIVE OFFICE', transitMin: 0, desc: 'Fluorescent suite, director desk, master safe' },
      { id: 'SECTOR_2', name: 'SECTOR 2: HYDRO-SUBSTATION', transitMin: 6, desc: 'Brine circulation conduits & submerged vault' },
      { id: 'SECTOR_3', name: 'SECTOR 3: QUANTUM CORE RIFT', transitMin: 12, desc: 'Resonance chamber & high-EM containment rift' }
    ];

    this.targetSector = null;
    this.targetTimestamp = '14:22';
    this.selectedSectorIdx = 0;
    this.selectedHour = 14;
    this.selectedMinute = 20;

    // Mainframe log entries generated deterministically
    this.mainframeLogs = [];
  }

  generate(seed = 1989) {
    this.disarmed = false;
    const sectorIdx = Math.abs(seed % this.SECTORS.length);
    this.targetSector = this.SECTORS[sectorIdx];

    // Seed crime minute between 14:18 and 14:26
    const minOffset = Math.abs((seed * 3) % 9); // 0 to 8
    const fatalMin = 18 + minOffset;
    this.targetTimestamp = `14:${fatalMin.toString().padStart(2, '0')}`;

    // Build timeline logs for Intel Analyst & Terminal
    this.mainframeLogs = [
      { time: '14:05', card: 'CARD-02', suspect: 'Cmdr. Ramos', sector: 'SECTOR_1', auth: 'GRANTED' },
      { time: '14:10', card: 'CARD-05', suspect: 'Dr. Thorne', sector: 'SECTOR_3', auth: 'GRANTED' },
      { time: '14:14', card: 'CARD-07', suspect: 'Dr. Volkov', sector: 'SECTOR_2', auth: 'GRANTED' },
      { time: `14:${(fatalMin - 2).toString().padStart(2, '0')}`, card: 'CARD-MASTER', suspect: 'Dr. Aris (Victim)', sector: this.targetSector.id, auth: 'GRANTED' },
      { time: this.targetTimestamp, card: 'ANOMALOUS_BREACH', suspect: 'UNKNOWN ASSAILANT', sector: this.targetSector.id, auth: 'OVERRIDE_TAMPER' },
      { time: '14:28', card: 'CARD-04', suspect: 'Eng. Chen', sector: 'SECTOR_2', auth: 'GRANTED' },
      { time: '14:30', card: 'LOCKDOWN', suspect: 'SYSTEM_MAIN', sector: 'ALL_SECTORS', auth: 'EMERGENCY_LOCK' }
    ];

    this.selectedSectorIdx = 0;
    this.selectedHour = 14;
    this.selectedMinute = 15;
  }

  cycleSector(dir = 1) {
    if (this.disarmed) return;
    this.selectedSectorIdx = (this.selectedSectorIdx + dir + this.SECTORS.length) % this.SECTORS.length;
    if (typeof audio !== 'undefined' && audio.playSwitch) audio.playSwitch();
    this.renderInspectUI();
  }

  adjustMinute(delta = 1) {
    if (this.disarmed) return;
    this.selectedMinute = Math.max(0, Math.min(59, this.selectedMinute + delta));
    if (typeof audio !== 'undefined' && audio.playSwitch) audio.playSwitch();
    this.renderInspectUI();
  }

  confirmTimeline() {
    if (this.disarmed) return { status: 'ALREADY_DISARMED' };

    const chosenSector = this.SECTORS[this.selectedSectorIdx];
    const chosenTime = `${this.selectedHour}:${this.selectedMinute.toString().padStart(2, '0')}`;

    const sectorMatches = chosenSector.id === this.targetSector.id;
    const timeMatches = chosenTime === this.targetTimestamp;

    if (sectorMatches && timeMatches) {
      this.disarmed = true;
      if (typeof audio !== 'undefined' && audio.playDisarmed) audio.playDisarmed();

      // Open physical 3D door 2
      if (window.levelNullEnv && window.levelNullEnv.openDoor2) {
        window.levelNullEnv.openDoor2();
      }

      // Show advance button in UI
      const advanceOverlay = document.getElementById('levelnull-advance-room2');
      if (advanceOverlay) advanceOverlay.classList.remove('hidden');

      // Update Apparatus Bar
      const step2 = document.getElementById('step-room-2');
      if (step2) {
        step2.classList.remove('active');
        step2.classList.add('cleared');
      }

      // Broadcast sync
      if (window.game && window.game.network && window.game.network.broadcast) {
        window.game.network.broadcast({
          type: 'LEVELNULL_TIMELINE_DISARMED',
          sectorId: chosenSector.id,
          timestamp: chosenTime
        });
        window.game.network.broadcast({
          type: 'LEVELNULL_DOOR_UNLOCKED',
          door: 2
        });
      }

      this.renderInspectUI();
      if (window.game) window.game.checkVictory();
      return { status: 'DISARMED', sector: chosenSector.name, time: chosenTime };
    } else {
      if (typeof audio !== 'undefined' && audio.playStrike) audio.playStrike();
      if (window.game) window.game.addStrike();
      return { status: 'STRIKE', reason: 'Mismatched spatiotemporal telemetry lock' };
    }
  }

  renderInspectUI() {
    const statusEl = document.getElementById('timeline-status');
    const sectorValEl = document.getElementById('timeline-sector-val');
    const timeValEl = document.getElementById('timeline-time-val');
    const confirmBtn = document.getElementById('timeline-confirm-btn');

    if (sectorValEl) sectorValEl.innerText = this.SECTORS[this.selectedSectorIdx].name;
    if (timeValEl) timeValEl.innerText = `${this.selectedHour}:${this.selectedMinute.toString().padStart(2, '0')}`;

    if (statusEl) {
      if (this.disarmed) {
        statusEl.innerText = `LOCKED: ${this.targetSector.name} @ ${this.targetTimestamp} ✓`;
        statusEl.className = 'module-status-badge solved';
        if (confirmBtn) confirmBtn.disabled = true;
      } else {
        statusEl.innerText = 'SPATIOTEMPORAL BREACH UNRESOLVED';
        statusEl.className = 'module-status-badge pending';
        if (confirmBtn) confirmBtn.disabled = false;
      }
    }

    // Highlight active sector node on SVG blueprint
    [1, 2, 3].forEach(n => {
      const nodeEl = document.getElementById(`node-sector-${n}`);
      if (nodeEl && nodeEl.querySelector) {
        const rect = nodeEl.querySelector('rect');
        if (rect && rect.setAttribute) {
          if (n === (this.selectedSectorIdx + 1)) {
            rect.setAttribute('stroke', '#00ff88');
            rect.setAttribute('stroke-width', '2.5');
            rect.setAttribute('fill', '#102e27');
          } else {
            rect.setAttribute('stroke', n === 3 ? '#c084fc' : '#00f0ff');
            rect.setAttribute('stroke-width', '1.8');
            rect.setAttribute('fill', '#0d1b1f');
          }
        }
      }
    });
  }
}

window.LevelNullTimelineModule = LevelNullTimelineModule;
window.levelNullTimelineModule = new LevelNullTimelineModule();
