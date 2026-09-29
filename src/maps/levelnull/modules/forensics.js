/* ==========================================================================
   OPERATION: ZERO HOUR - MAP 4: LEVEL NULL (INCIDENT 1989)
   MODULE 1: FORENSIC PATHOLOGY & WEAPON IDENTIFICATION
   University War "Signal Investigation" Forensic Deduction Engine
   ========================================================================== */

class LevelNullForensicsModule {
  constructor() {
    this.id = 'levelnull_forensics';
    this.name = 'Forensic Pathology & Weapon Analyzer';
    this.disarmed = false;

    // Suspect reference data
    this.SUSPECTS = [
      { id: 'SUSPECT_1', photoId: 'PHOTO-01', name: 'Dr. Elena Vance', role: 'Quantum Physicist', blood: 'O', hand: 'RIGHT', height: 168, emSensitive: false, glove: false, bootSize: 7 },
      { id: 'SUSPECT_2', photoId: 'PHOTO-02', name: 'Cmdr. Viktor Ramos', role: 'Chief of Security', blood: 'A', hand: 'LEFT', height: 188, emSensitive: false, glove: false, bootSize: 10 },
      { id: 'SUSPECT_3', photoId: 'PHOTO-03', name: 'Dr. Jin-Woo Park', role: 'Biochemist', blood: 'B', hand: 'RIGHT', height: 174, emSensitive: false, glove: false, bootSize: 8 },
      { id: 'SUSPECT_4', photoId: 'PHOTO-04', name: 'Eng. Sophia Chen', role: 'Hydro Engineer', blood: 'AB', hand: 'RIGHT', height: 165, emSensitive: false, glove: true, bootSize: 6 },
      { id: 'SUSPECT_5', photoId: 'PHOTO-05', name: 'Dr. Marcus Thorne', role: 'Telemetry Specialist', blood: 'O', hand: 'RIGHT', height: 179, emSensitive: false, glove: false, bootSize: 9 },
      { id: 'SUSPECT_6', photoId: 'PHOTO-06', name: 'Agent Sarah Miller', role: 'Internal Affairs', blood: 'A', hand: 'RIGHT', height: 161, emSensitive: false, glove: false, bootSize: 6 },
      { id: 'SUSPECT_7', photoId: 'PHOTO-07', name: 'Dr. Dmitry Volkov', role: 'High-Voltage Engineer', blood: 'B', hand: 'RIGHT', height: 182, emSensitive: true, glove: true, bootSize: 9 },
      { id: 'SUSPECT_8', photoId: 'PHOTO-08', name: 'Tech. Liam O\'Connor', role: 'Core Diver', blood: 'AB', hand: 'RIGHT', height: 185, emSensitive: false, glove: true, bootSize: 11 }
    ];

    this.WEAPONS = [
      { id: 'BRASS_BATON', name: 'BRASS MASTER BATON', type: 'BLUNT', handRequired: 'LEFT', minHeight: 180, clearance: 'SECURITY' },
      { id: 'CYANIDE_SOLUTION', name: 'POTASSIUM CYANIDE', type: 'TOXIN', toxinClass: 'CYANIDE', reagentColor: 'TEAL', clearance: 'BIOCHEM' },
      { id: 'HIGH_VOLTAGE', name: 'HIGH-VOLTAGE DISCHARGE', type: 'ELECTRICAL', kvRating: 50, requiresGlove: true, clearance: 'ELECTRICAL' },
      { id: 'HYDRAULIC_CRUSH', name: 'PISTON SHEAR LUG', type: 'MECHANICAL', minBootSize: 11, wetFootprint: true, clearance: 'HYDRO' }
    ];

    // Generated state
    this.targetWeapon = null;
    this.victimTrauma = '';
    this.toxicReagent = '';
    this.selectedWeaponIndex = 0;
    this.selectedReagentIndex = 0;
  }

  generate(seed = 1989) {
    this.disarmed = false;
    const weaponIdx = Math.abs(seed % this.WEAPONS.length);
    this.targetWeapon = this.WEAPONS[weaponIdx];

    // Seed forensic clues based on target weapon
    if (this.targetWeapon.id === 'BRASS_BATON') {
      this.victimTrauma = 'Crushed cranial trauma on right temple (striker was LEFT-HANDED, height > 180cm)';
      this.toxicReagent = 'NONE (Non-toxic contusion)';
      this.reagents = ['NONE', 'CYANIDE', 'STRYCHNINE', 'HYDROCHLORIC'];
      this.targetReagent = 'NONE';
    } else if (this.targetWeapon.id === 'CYANIDE_SOLUTION') {
      this.victimTrauma = 'Severe asphyxia petechiae & bitter almond odor on lips. Teal precipitate upon ferrocyanide test.';
      this.toxicReagent = 'CYANIDE (Teal Precipitate)';
      this.reagents = ['NONE', 'CYANIDE', 'STRYCHNINE', 'HYDROCHLORIC'];
      this.targetReagent = 'CYANIDE';
    } else if (this.targetWeapon.id === 'HIGH_VOLTAGE') {
      this.victimTrauma = 'Lichtenberg feathering burn marks on chest (50kV arcing discharge). Rubber glove micro-fragments recovered.';
      this.toxicReagent = 'OZONE OVAL (Arc Flash)';
      this.reagents = ['NONE', 'CYANIDE', 'OZONE', 'HYDROCHLORIC'];
      this.targetReagent = 'OZONE';
    } else {
      this.victimTrauma = 'Massive thoracic compression trauma & high-pressure brine saturation. Size 11 rubber tread imprint.';
      this.toxicReagent = 'INDUSTRIAL BRINE (Saline)';
      this.reagents = ['NONE', 'CYANIDE', 'BRINE', 'HYDROCHLORIC'];
      this.targetReagent = 'BRINE';
    }

    this.selectedWeaponIndex = 0;
    this.selectedReagentIndex = 0;
  }

  cycleWeapon(dir = 1) {
    if (this.disarmed) return;
    this.selectedWeaponIndex = (this.selectedWeaponIndex + dir + this.WEAPONS.length) % this.WEAPONS.length;
    if (typeof audio !== 'undefined' && audio.playSwitch) audio.playSwitch();
    this.renderInspectUI();
  }

  cycleReagent(dir = 1) {
    if (this.disarmed) return;
    this.selectedReagentIndex = (this.selectedReagentIndex + dir + this.reagents.length) % this.reagents.length;
    if (typeof audio !== 'undefined' && audio.playSwitch) audio.playSwitch();
    this.renderInspectUI();
  }

  confirmForensicAnalysis() {
    if (this.disarmed) return { status: 'ALREADY_DISARMED' };

    const chosenWeapon = this.WEAPONS[this.selectedWeaponIndex];
    const chosenReagent = this.reagents[this.selectedReagentIndex];

    const weaponMatches = chosenWeapon.id === this.targetWeapon.id;
    const reagentMatches = chosenReagent === this.targetReagent;

    if (weaponMatches && reagentMatches) {
      this.disarmed = true;
      if (typeof audio !== 'undefined' && audio.playDisarmed) audio.playDisarmed();

      // Open physical 3D door
      if (window.levelNullEnv && window.levelNullEnv.openDoor1) {
        window.levelNullEnv.openDoor1();
      }

      // Show advance button in UI
      const advanceOverlay = document.getElementById('levelnull-advance-room1');
      if (advanceOverlay) advanceOverlay.classList.remove('hidden');

      // Update Apparatus Bar
      const step1 = document.getElementById('step-room-1');
      if (step1) {
        step1.classList.remove('active');
        step1.classList.add('cleared');
      }

      // Broadcast sync
      if (window.game && window.game.network && window.game.network.broadcast) {
        window.game.network.broadcast({
          type: 'LEVELNULL_FORENSICS_DISARMED',
          weaponId: chosenWeapon.id
        });
        window.game.network.broadcast({
          type: 'LEVELNULL_DOOR_UNLOCKED',
          door: 1
        });
      }

      this.renderInspectUI();
      if (window.game) window.game.checkVictory();
      return { status: 'DISARMED', weapon: chosenWeapon.name };
    } else {
      if (typeof audio !== 'undefined' && audio.playStrike) audio.playStrike();
      if (window.game) window.game.addStrike();
      return { status: 'STRIKE', reason: 'Mismatched forensic pathology determination' };
    }
  }

  renderInspectUI() {
    const statusEl = document.getElementById('forensics-status');
    const traumaEl = document.getElementById('forensics-trauma-text');
    const weaponValEl = document.getElementById('forensics-weapon-val');
    const reagentValEl = document.getElementById('forensics-reagent-val');
    const confirmBtn = document.getElementById('forensics-confirm-btn');

    if (traumaEl) traumaEl.innerText = this.victimTrauma;
    if (weaponValEl) weaponValEl.innerText = this.WEAPONS[this.selectedWeaponIndex].name;
    if (reagentValEl) reagentValEl.innerText = this.reagents[this.selectedReagentIndex];

    const reactionBadge = document.getElementById('forensics-reaction-badge');
    if (reactionBadge) {
      const curReagent = this.reagents[this.selectedReagentIndex];
      if (curReagent === 'CYANIDE') {
        reactionBadge.innerText = 'TEAL PRECIPITATE [+]';
        reactionBadge.className = 'reagent-badge glow-cyan';
      } else if (curReagent === 'OZONE') {
        reactionBadge.innerText = '50kV ARC RESIDUE [+]';
        reactionBadge.className = 'reagent-badge glow-yellow';
      } else if (curReagent === 'BRINE') {
        reactionBadge.innerText = 'SALINE BRINE [+]';
        reactionBadge.className = 'reagent-badge glow-green';
      } else if (curReagent === 'NONE') {
        reactionBadge.innerText = 'NO CHEMO-REACTION';
        reactionBadge.className = 'reagent-badge';
      } else {
        reactionBadge.innerText = 'NEGATIVE [-]';
        reactionBadge.className = 'reagent-badge';
      }
    }

    if (statusEl) {
      if (this.disarmed) {
        statusEl.innerText = `CONFIRMED: ${this.targetWeapon.name} ✓`;
        statusEl.className = 'module-status-badge solved';
        if (confirmBtn) confirmBtn.disabled = true;
      } else {
        statusEl.innerText = 'PATHOLOGY EVIDENCE UNVERIFIED';
        statusEl.className = 'module-status-badge pending';
        if (confirmBtn) confirmBtn.disabled = false;
      }
    }
  }
}

window.LevelNullForensicsModule = LevelNullForensicsModule;
window.levelNullForensicsModule = new LevelNullForensicsModule();
