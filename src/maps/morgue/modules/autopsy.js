/**
 * OPERATION: ZERO HOUR - MAP 3: THE LOCKED MORGUE
 * MODULE 2: FORENSIC AUTOPSY & WOUND BALLISTICS
 * Standalone deterministic puzzle logic.
 */

class AutopsyModule {
  constructor() {
    this.id = 'autopsy';
    this.disarmed = false;
    this.solved = false;

    this.suspects = {
      dr_allen: {
        id: 'dr_allen',
        name: 'DR. VICTORIA ALLEN',
        role: 'Chief Pathologist',
        tier: 4,
        handedness: 'LEFT-HANDED (Amputated Right Forearm)',
        weapon: '#11 Precision Surgical Scalpel',
        pattern: 'Narrow incised puncture < 2.5cm; downward left-to-right slant (35°-45°).',
        vitalWounds: 4
      },
      nurse_miller: {
        id: 'nurse_miller',
        name: 'NURSE SAMUEL MILLER',
        role: 'ICU Charge Nurse',
        tier: 2,
        handedness: 'RIGHT-HANDED',
        weapon: '18-Gauge Trocar Needle',
        pattern: 'Small circular puncture without lateral laceration; direct steep angle (80°-90°).',
        vitalWounds: 2
      },
      guard_harris: {
        id: 'guard_harris',
        name: 'OFFICER MARCUS HARRIS',
        role: 'Facility Security Guard',
        tier: 1,
        handedness: 'RIGHT-HANDED',
        weapon: '50cm Heavy Steel Tactical Baton',
        pattern: 'Blunt contusion laceration with internal tissue bridging; downward right-to-left sweep (120°-140°).',
        vitalWounds: 3
      },
      orderly_vance: {
        id: 'orderly_vance',
        name: 'ORDERLY DAMIAN VANCE',
        role: 'Morgue Custodian',
        tier: 3,
        handedness: 'AMBIDEXTROUS',
        weapon: 'Autopsy Bone Saw & Embalming Trocar',
        pattern: 'Serrated ragged margins; multi-directional jagged strike (60°-75°).',
        vitalWounds: 5
      }
    };

    this.activeSuspectKey = 'dr_allen';
    this.wounds = [];
    this.vitalWoundCount = 4;
    this.selectedWoundIdx = 0;
  }

  generate(seed = 12345, params = {}) {
    this.disarmed = false;
    const suspectKeys = ['dr_allen', 'nurse_miller', 'guard_harris', 'orderly_vance'];
    const sIdx = Math.abs(seed + 7) % suspectKeys.length;
    this.activeSuspectKey = suspectKeys[sIdx];
    const culprit = this.suspects[this.activeSuspectKey];
    this.vitalWoundCount = culprit.vitalWounds;

    // Generate vital wounds matching culprit weapon morphology
    this.wounds = [];
    for (let i = 0; i < culprit.vitalWounds; i++) {
      let depth = 2.2;
      let angle = 40;
      let desc = 'Clean incised margins with extravasated coagulation thrombi (VITAL).';

      if (this.activeSuspectKey === 'dr_allen') {
        depth = 2.1 + (i * 0.1);
        angle = 38 + (i * 2);
        desc = 'Narrow linear scalpel puncture; sharp lower angle (VITAL).';
      } else if (this.activeSuspectKey === 'nurse_miller') {
        depth = 4.2 + (i * 0.2);
        angle = 85 + (i * 2);
        desc = 'Circular bore puncture; deep subcutaneous penetration (VITAL).';
      } else if (this.activeSuspectKey === 'guard_harris') {
        depth = 3.2 + (i * 0.3);
        angle = 125 + (i * 4);
        desc = 'Crush contusion with microscopic vascular bridging (VITAL).';
      } else if (this.activeSuspectKey === 'orderly_vance') {
        depth = 3.6 + (i * 0.2);
        angle = 68 + (i * 3);
        desc = 'Ragged micro-serrated laceration with bone striations (VITAL).';
      }

      this.wounds.push({
        id: i + 1,
        location: `Anatomical Quadrant ${['Thoracic Left', 'Subclavian', 'Epigastric', 'Intercostal 5th', 'Sternum'][i % 5]}`,
        depth: depth.toFixed(1),
        angle: angle,
        desc: desc,
        isVital: true,
        reaction: 'HYPEREMIC (Coagulated Anti-Mortem)'
      });
    }

    // Add 2 post-mortem artifacts / red herrings
    this.wounds.push({
      id: this.wounds.length + 1,
      location: 'Dorsal Lumbar',
      depth: '0.6',
      angle: 15,
      desc: 'Superficial skin slippage from mortuary transit slab.',
      isVital: false,
      reaction: 'PALE / DRY (Post-Mortem Abrasion)'
    });
    this.wounds.push({
      id: this.wounds.length + 1,
      location: 'Left Deltoid',
      depth: '1.2',
      angle: 90,
      desc: 'Old surgical drainage scar with complete fibrous healing.',
      isVital: false,
      reaction: 'FIBROTIC (Healed / Pre-dating Incident)'
    });

    console.log(`[Autopsy Module] True Culprit: ${culprit.name} (Tier ${culprit.tier}) | Vital Wounds: ${this.vitalWoundCount}`);
    this.updateHUD();
  }

  selectWound(idx) {
    this.selectedWoundIdx = Math.max(0, Math.min(this.wounds.length - 1, idx));
    if (window.audio && window.audio.playClick) window.audio.playClick();
    this.updateHUD();
  }

  confirmCulprit(suspectKey) {
    if (this.disarmed) return { status: 'ALREADY_DISARMED' };

    if (suspectKey === this.activeSuspectKey) {
      this.disarmed = true;
      this.solved = true;
      if (window.audio && window.audio.playDisarmed) window.audio.playDisarmed();
      if (window.game) {
        window.game.showToast(`FORENSIC CULPRIT CONFIRMED: ${this.suspects[suspectKey].name} ✓`, 'success');
        window.game.checkVictory();
      }
      this.updateHUD();
      return { status: 'DISARMED' };
    } else {
      if (window.audio && window.audio.playStrike) window.audio.playStrike();
      if (window.game) {
        window.game.addStrike();
        window.game.showToast('STRIKE: BALLISTIC INCONSISTENCY — SUSPECT EXCLUDED!', 'error');
      }
      this.updateHUD();
      return { status: 'STRIKE' };
    }
  }

  updateHUD() {
    const hud = document.getElementById('autopsy-inspect-hud');
    if (!hud) return;

    const currentWound = this.wounds[this.selectedWoundIdx] || this.wounds[0];
    if (currentWound) {
      const idEl = document.getElementById('autopsy-wound-id');
      const locEl = document.getElementById('autopsy-wound-loc');
      const depthEl = document.getElementById('autopsy-wound-depth');
      const angleEl = document.getElementById('autopsy-wound-angle');
      const reactionEl = document.getElementById('autopsy-wound-reaction');
      const descEl = document.getElementById('autopsy-wound-desc');

      if (idEl) idEl.innerText = `INSPECTION TARGET: WOUND #${currentWound.id} of ${this.wounds.length}`;
      if (locEl) locEl.innerText = currentWound.location;
      if (depthEl) depthEl.innerText = `${currentWound.depth} cm`;
      if (angleEl) angleEl.innerText = `${currentWound.angle}°`;
      if (reactionEl) {
        reactionEl.innerText = currentWound.reaction;
        reactionEl.className = currentWound.isVital ? 'glow-red' : 'glow-yellow';
      }
      if (descEl) descEl.innerText = currentWound.desc;
    }

    const badge = document.getElementById('autopsy-status-badge');
    if (badge) {
      if (this.disarmed) {
        badge.className = 'badge badge-success';
        badge.innerText = 'KILLER IDENTIFIED ✓';
      } else {
        badge.className = 'badge badge-warning';
        badge.innerText = 'PATHOLOGY INCOMPLETE';
      }
    }
  }

  updateDOM() {
    this.updateHUD();
  }
}

window.AutopsyModule = AutopsyModule;
window.autopsyModule = new AutopsyModule();
