/* ==========================================================================
   OPERATION: ZERO HOUR - MAP 4: LEVEL NULL (INCIDENT 1989)
   MODULE 4: 8-PHOTO INVESTIGATION BOARD & GRAND INDICTMENT TERMINAL
   University War "Murder Identity" Master Culprit Deduction Engine
   ========================================================================== */

class LevelNullIndictmentModule {
  constructor() {
    this.id = 'levelnull_indictment';
    this.name = 'Grand Indictment & 8-Photo Terminal';
    this.disarmed = false;

    this.SUSPECTS = [
      { id: 'SUSPECT_1', photoId: 'PHOTO-01', name: 'Dr. Elena Vance', role: 'Quantum Physicist', traits: 'Spectacles, Wrist Scar, Type O, H:168cm' },
      { id: 'SUSPECT_2', photoId: 'PHOTO-02', name: 'Cmdr. Viktor Ramos', role: 'Chief of Security', traits: 'Military Build, Left-Handed, Type A, H:188cm' },
      { id: 'SUSPECT_3', photoId: 'PHOTO-03', name: 'Dr. Jin-Woo Park', role: 'Biochemist', traits: 'Lab Stains, Right-Handed, Type B, H:174cm' },
      { id: 'SUSPECT_4', photoId: 'PHOTO-04', name: 'Eng. Sophia Chen', role: 'Hydro Engineer', traits: 'Rubber Gauntlets, Grease Smudge, Type AB, H:165cm' },
      { id: 'SUSPECT_5', photoId: 'PHOTO-05', name: 'Dr. Marcus Thorne', role: 'Telemetry Specialist', traits: 'Headphones, Right Leg Limp, Type O, H:179cm' },
      { id: 'SUSPECT_6', photoId: 'PHOTO-06', name: 'Agent Sarah Miller', role: 'Internal Affairs', traits: 'Trench Coat, Smoker Matches, Type A, H:161cm' },
      { id: 'SUSPECT_7', photoId: 'PHOTO-07', name: 'Dr. Dmitry Volkov', role: 'High-Voltage Engineer', traits: 'Pacemaker (EM sensitive), Type B, H:182cm' },
      { id: 'SUSPECT_8', photoId: 'PHOTO-08', name: 'Tech. Liam O\'Connor', role: 'Core Diver', traits: 'Scuba Boots (Size 11), Wet Cuffs, Type AB, H:185cm' }
    ];

    this.targetCulprit = null;
    this.targetWeaponId = 'BRASS_BATON';
    this.targetSectorId = 'SECTOR_1';
    this.targetCipher = '1989';

    // Player board state
    this.suspectTags = {}; // photoId -> 'SUSPECT' | 'ALIBI' | 'ACCUSED'
    this.selectedCulpritIdx = 0;
    this.selectedWeaponIdx = 0;
    this.selectedSectorIdx = 0;
    this.enteredCipher = '----';
  }

  generate(seed = 1989) {
    this.disarmed = false;

    // Pick culprit based on seed
    const culpritIdx = Math.abs(seed % this.SUSPECTS.length);
    this.targetCulprit = this.SUSPECTS[culpritIdx];

    // Align with Module 1, 2, 3 targets
    if (window.levelNullForensicsModule && window.levelNullForensicsModule.targetWeapon) {
      this.targetWeaponId = window.levelNullForensicsModule.targetWeapon.id;
    } else {
      this.targetWeaponId = 'BRASS_BATON';
    }

    if (window.levelNullTimelineModule && window.levelNullTimelineModule.targetSector) {
      this.targetSectorId = window.levelNullTimelineModule.targetSector.id;
    } else {
      this.targetSectorId = 'SECTOR_1';
    }

    if (window.levelNullInterrogationModule && window.levelNullInterrogationModule.cipherKey) {
      this.targetCipher = window.levelNullInterrogationModule.cipherKey;
    } else {
      this.targetCipher = '1989';
    }

    // Initialize tags
    this.suspectTags = {};
    this.SUSPECTS.forEach(s => {
      this.suspectTags[s.photoId] = 'SUSPECT';
    });

    this.selectedCulpritIdx = 0;
    this.selectedWeaponIdx = 0;
    this.selectedSectorIdx = 0;
    this.enteredCipher = '';
  }

  toggleSuspectTag(photoId) {
    if (this.disarmed) return;
    const current = this.suspectTags[photoId] || 'SUSPECT';
    let next = 'SUSPECT';
    if (current === 'SUSPECT') next = 'ALIBI';
    else if (current === 'ALIBI') next = 'ACCUSED';
    else next = 'SUSPECT';

    this.suspectTags[photoId] = next;

    // If marked accused, select them on indictment terminal
    if (next === 'ACCUSED') {
      const idx = this.SUSPECTS.findIndex(s => s.photoId === photoId);
      if (idx !== -1) this.selectedCulpritIdx = idx;
    }

    if (typeof audio !== 'undefined' && audio.playSwitch) audio.playSwitch();
    this.renderInspectUI();
  }

  cycleCulprit(dir = 1) {
    if (this.disarmed) return;
    this.selectedCulpritIdx = (this.selectedCulpritIdx + dir + this.SUSPECTS.length) % this.SUSPECTS.length;
    if (typeof audio !== 'undefined' && audio.playSwitch) audio.playSwitch();
    this.renderInspectUI();
  }

  cycleWeapon(dir = 1) {
    if (this.disarmed) return;
    const weaponsCount = window.levelNullForensicsModule ? window.levelNullForensicsModule.WEAPONS.length : 4;
    this.selectedWeaponIdx = (this.selectedWeaponIdx + dir + weaponsCount) % weaponsCount;
    if (typeof audio !== 'undefined' && audio.playSwitch) audio.playSwitch();
    this.renderInspectUI();
  }

  cycleSector(dir = 1) {
    if (this.disarmed) return;
    const sectorsCount = window.levelNullTimelineModule ? window.levelNullTimelineModule.SECTORS.length : 3;
    this.selectedSectorIdx = (this.selectedSectorIdx + dir + sectorsCount) % sectorsCount;
    if (typeof audio !== 'undefined' && audio.playSwitch) audio.playSwitch();
    this.renderInspectUI();
  }

  appendCipher(char) {
    if (this.disarmed) return;
    if (this.enteredCipher.length < 4) {
      this.enteredCipher += char;
      if (typeof audio !== 'undefined' && audio.playKeypadBeep) audio.playKeypadBeep();
      this.renderInspectUI();
    }
  }

  clearCipher() {
    if (this.disarmed) return;
    this.enteredCipher = '';
    if (typeof audio !== 'undefined' && audio.playSwitch) audio.playSwitch();
    this.renderInspectUI();
  }

  submitGrandIndictment() {
    if (this.disarmed) return { status: 'ALREADY_DISARMED' };

    // Get selected values
    const accused = this.SUSPECTS[this.selectedCulpritIdx];
    const weapons = window.levelNullForensicsModule ? window.levelNullForensicsModule.WEAPONS : [
      { id: 'BRASS_BATON', name: 'BRASS MASTER BATON' },
      { id: 'CYANIDE_SOLUTION', name: 'POTASSIUM CYANIDE' },
      { id: 'HIGH_VOLTAGE', name: 'HIGH-VOLTAGE DISCHARGE' },
      { id: 'HYDRAULIC_CRUSH', name: 'PISTON SHEAR LUG' }
    ];
    const sectors = window.levelNullTimelineModule ? window.levelNullTimelineModule.SECTORS : [
      { id: 'SECTOR_1', name: 'SECTOR 1: EXECUTIVE OFFICE' },
      { id: 'SECTOR_2', name: 'SECTOR 2: HYDRO-SUBSTATION' },
      { id: 'SECTOR_3', name: 'SECTOR 3: QUANTUM CORE RIFT' }
    ];

    const chosenWeapon = weapons[this.selectedWeaponIdx];
    const chosenSector = sectors[this.selectedSectorIdx];

    // Fetch live targets from Modules 1, 2, 3
    const liveTargetWeaponId = window.levelNullForensicsModule ? window.levelNullForensicsModule.targetWeapon.id : this.targetWeaponId;
    const liveTargetSectorId = window.levelNullTimelineModule ? window.levelNullTimelineModule.targetSector.id : this.targetSectorId;
    const liveTargetCipher = window.levelNullInterrogationModule ? window.levelNullInterrogationModule.cipherKey : this.targetCipher;

    const culpritMatches = accused.id === this.targetCulprit.id;
    const weaponMatches = chosenWeapon.id === liveTargetWeaponId;
    const sectorMatches = chosenSector.id === liveTargetSectorId;
    const cipherMatches = this.enteredCipher === liveTargetCipher;

    if (culpritMatches && weaponMatches && sectorMatches && cipherMatches) {
      this.disarmed = true;
      if (typeof audio !== 'undefined' && audio.playDisarmed) audio.playDisarmed();

      // Open blast doors in 3D environment
      if (window.levelNullEnv) {
        if (window.levelNullEnv.openDoor1) window.levelNullEnv.openDoor1();
        if (window.levelNullEnv.openDoor2) window.levelNullEnv.openDoor2();
        if (window.levelNullEnv.openPortal) window.levelNullEnv.openPortal();
      }

      // Broadcast sync
      if (window.game && window.game.network && window.game.network.broadcast) {
        window.game.network.broadcast({
          type: 'LEVELNULL_INDICTMENT_SOLVED',
          culpritName: accused.name,
          culpritPhotoId: accused.photoId
        });
      }

      this.renderInspectUI();
      if (window.game) window.game.checkVictory();
      return { status: 'DISARMED', culprit: accused.name };
    } else {
      if (typeof audio !== 'undefined' && audio.playStrike) audio.playStrike();
      if (window.game) window.game.addStrike();

      let reason = 'Indictment rejected: ';
      if (!culpritMatches) reason += 'Incorrect culprit identity. ';
      if (!weaponMatches) reason += 'Mismatched murder weapon. ';
      if (!sectorMatches) reason += 'Invalid crime sector. ';
      if (!cipherMatches) reason += 'Invalid saboteur cipher. ';

      return { status: 'STRIKE', reason };
    }
  }

  renderInspectUI() {
    const statusEl = document.getElementById('indictment-status');
    const accusedNameEl = document.getElementById('indictment-accused-name');
    const accusedPhotoEl = document.getElementById('indictment-accused-photo');
    const weaponValEl = document.getElementById('indictment-weapon-val');
    const sectorValEl = document.getElementById('indictment-sector-val');
    const cipherValEl = document.getElementById('indictment-cipher-val');
    const submitBtn = document.getElementById('indictment-submit-btn');

    const accused = this.SUSPECTS[this.selectedCulpritIdx];
    if (accusedNameEl) accusedNameEl.innerText = `${accused.photoId}: ${accused.name} (${accused.role})`;
    if (accusedPhotoEl) accusedPhotoEl.innerText = accused.photoId;

    const weapons = window.levelNullForensicsModule ? window.levelNullForensicsModule.WEAPONS : [];
    if (weaponValEl && weapons[this.selectedWeaponIdx]) {
      weaponValEl.innerText = weapons[this.selectedWeaponIdx].name;
    }

    const sectors = window.levelNullTimelineModule ? window.levelNullTimelineModule.SECTORS : [];
    if (sectorValEl && sectors[this.selectedSectorIdx]) {
      sectorValEl.innerText = sectors[this.selectedSectorIdx].name;
    }

    if (cipherValEl) {
      cipherValEl.innerText = this.enteredCipher.padEnd(4, '-');
    }

    // Update 8 photo card tags on corkboard
    this.SUSPECTS.forEach(s => {
      const tagEl = document.getElementById(`photo-tag-${s.photoId}`);
      const cardEl = document.getElementById(`photo-card-${s.photoId}`);
      const tag = this.suspectTags[s.photoId] || 'SUSPECT';
      if (tagEl) {
        tagEl.innerText = tag;
        tagEl.className = `photo-badge ${tag.toLowerCase()}`;
      }
      if (cardEl) {
        cardEl.className = `polaroid-card ${tag.toLowerCase()}`;
        if (typeof document !== 'undefined' && document.createElement && cardEl.querySelector && !cardEl.querySelector('.pushpin-pin')) {
          const pin = document.createElement('div');
          pin.className = 'pushpin-pin';
          cardEl.appendChild(pin);
        }
      }
    });

    if (statusEl) {
      if (this.disarmed) {
        statusEl.innerText = `INDICTMENT CONFIRMED: ${this.targetCulprit.name} ACCUSED ✓`;
        statusEl.className = 'module-status-badge solved';
        if (submitBtn) submitBtn.disabled = true;
      } else {
        statusEl.innerText = 'SELECT 8-PHOTO EVIDENCE & COMMIT VERDICT';
        statusEl.className = 'module-status-badge pending';
        if (submitBtn) submitBtn.disabled = false;
      }
    }
  }

  filterSuspects(category = 'ALL') {
    this.currentFilter = category;
    ['all', 'suspects', 'alibi'].forEach(tabId => {
      const btn = document.getElementById(`filter-${tabId}`);
      if (btn && btn.classList) {
        btn.classList.toggle('active',
          (category === 'ALL' && tabId === 'all') ||
          (category === 'SUSPECT' && tabId === 'suspects') ||
          (category === 'ALIBI' && tabId === 'alibi')
        );
      }
    });

    this.SUSPECTS.forEach(s => {
      const cardEl = document.getElementById(`photo-card-${s.photoId}`);
      if (cardEl && cardEl.style) {
        const tag = this.suspectTags[s.photoId] || 'SUSPECT';
        if (category === 'ALL') {
          cardEl.style.display = 'flex';
        } else if (category === 'SUSPECT') {
          cardEl.style.display = (tag === 'SUSPECT' || tag === 'ACCUSED') ? 'flex' : 'none';
        } else if (category === 'ALIBI') {
          cardEl.style.display = (tag === 'ALIBI') ? 'flex' : 'none';
        }
      }
    });
    if (typeof audio !== 'undefined' && audio.playSwitch) audio.playSwitch();
  }
}

window.LevelNullIndictmentModule = LevelNullIndictmentModule;
window.levelNullIndictmentModule = new LevelNullIndictmentModule();
