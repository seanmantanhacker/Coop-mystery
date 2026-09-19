/**
 * OPERATION: ZERO HOUR - MAP 3: THE LOCKED MORGUE
 * MODULE 1: TWO-TIER TOXICOLOGY ASSAY & ANTIDOTE SYNTHESIZER
 * Standalone deterministic puzzle logic.
 */

class ToxicologyModule {
  constructor() {
    this.id = 'toxicology';
    this.disarmed = false;
    this.solved = false;

    this.poisons = {
      cyanide: {
        name: 'HYDROGEN CYANIDE (Prussic Acid)',
        symptoms: 'Faint scent of bitter almonds; bright blue subungual discoloration beneath fingernails; bright pinkish-cherry lividity.',
        assayResult: 'Prussian Blue Ferric Ferrocyanide precipitate (Deep Cobalt Cyan)',
        assayColor: '#0055ff',
        reagents: { a: 'Hydroxocobalamin', b: 'Sodium Thiosulfate', c: 'Sodium Nitrite' },
        baseRatios: { a: 45, b: 30, c: 15 }
      },
      strychnine: {
        name: 'STRYCHNINE ALKALOID',
        symptoms: 'Severe muscle rigidity; arched spine spasm (opisthotonos); locked jaw grimace (risus sardonicus).',
        assayResult: 'Sulfuric-Dichromate violet-purple chromatic oxidation ring',
        assayColor: '#b000ff',
        reagents: { a: 'Tannic Complex', b: 'Diazepam Emulsion', c: 'Potassium Permanganate' },
        baseRatios: { a: 35, b: 50, c: 20 }
      },
      arsenic: {
        name: 'ARSENIC TRIOXIDE',
        symptoms: 'Distinct white transverse Mees\' lines banding fingernails; garlic scent; severe mucosal petechiae.',
        assayResult: 'Marsh reduction mirror with dark metallic silver sheen',
        assayColor: '#c0c0c0',
        reagents: { a: 'Dimercaprol (BAL)', b: 'Succimer (DMSA)', c: 'Penicillamine Buffer' },
        baseRatios: { a: 40, b: 25, c: 45 }
      },
      potassium: {
        name: 'POTASSIUM CHLORIDE (KCl)',
        symptoms: 'Undetectable odor; acute cardiac arrest; microscopic injection puncture mark with localized edema.',
        assayResult: 'Sodium Tetraphenylborate dense white crystalline curd',
        assayColor: '#e0f7fa',
        reagents: { a: 'Insulin Buffer', b: 'Calcium Gluconate', c: 'Sodium Polystyrene' },
        baseRatios: { a: 50, b: 35, c: 30 }
      }
    };

    this.currentPoisonKey = 'cyanide';
    this.currentReagents = { a: 0, b: 0, c: 0 };
    this.targetReagents = { a: 45, b: 30, c: 15 };
    this.sampleCentrifuged = false;
    this.victimMass = 75.0;
  }

  generate(seed = 12345, params = {}) {
    this.disarmed = false;
    this.sampleCentrifuged = false;
    this.currentReagents = { a: 0, b: 0, c: 0 };

    const keys = ['cyanide', 'strychnine', 'arsenic', 'potassium'];
    const pIdx = Math.abs(seed) % keys.length;
    this.currentPoisonKey = keys[pIdx];

    const poison = this.poisons[this.currentPoisonKey];

    // Victim mass — always a whole number for clean calculation
    const rawMass = params.victimMass || (70 + (Math.abs(seed) % 15));
    this.victimMass = Math.round(rawMass); // integer kg

    // Factors match exactly what the Manual binder states:
    //   Cyanide:    Base A=40, Factor=0.5  | Base B=20, Factor=0.3  | Base C=10, Factor=0.2
    //   Strychnine: Base A=30, Factor=0.4  | Base B=45, Factor=0.5  | Base C=15, Factor=0.2
    //   Arsenic:    Base A=50, Factor=0.6  | Base B=20, Factor=0.3  | Base C=40, Factor=0.4
    //   Potassium:  Base A=45, Factor=0.5  | Base B=30, Factor=0.4  | Base C=25, Factor=0.3
    const formulas = {
      cyanide:    { a: [40, 0.5], b: [20, 0.3], c: [10, 0.2] },
      strychnine: { a: [30, 0.4], b: [45, 0.5], c: [15, 0.2] },
      arsenic:    { a: [50, 0.6], b: [20, 0.3], c: [40, 0.4] },
      potassium:  { a: [45, 0.5], b: [30, 0.4], c: [25, 0.3] }
    };

    const f = formulas[this.currentPoisonKey];
    const massDelta = this.victimMass - 70;

    // Targets are rounded to nearest integer (±1 buttons can reach any value)
    const ri = (v) => Math.round(v);

    this.targetReagents = {
      a: Math.max(5, Math.min(95, ri(f.a[0] + massDelta * f.a[1]))),
      b: Math.max(5, Math.min(95, ri(f.b[0] + massDelta * f.b[1]))),
      c: Math.max(5, Math.min(95, ri(f.c[0] + massDelta * f.c[1])))
    };

    console.log(`[Toxicology] Poison: ${poison.name} | Mass: ${this.victimMass} kg | MassDelta: +${massDelta} kg | Targets:`, this.targetReagents);
    this.updateHUD();
  }

  runCentrifuge() {
    this.sampleCentrifuged = true;
    if (window.audio && window.audio.playBuzz) window.audio.playBuzz();
    this.updateHUD();
    return this.poisons[this.currentPoisonKey].assayResult;
  }

  adjustReagent(key, delta) {
    if (this.disarmed) return;
    if (!this.currentReagents[key] && this.currentReagents[key] !== 0) return;

    this.currentReagents[key] = Math.max(0, Math.min(100, this.currentReagents[key] + delta));
    if (window.audio && window.audio.playClick) window.audio.playClick();
    this.updateHUD();
  }

  titrateAntidote() {
    if (this.disarmed) return { status: 'ALREADY_DISARMED' };

    const matchA = this.currentReagents.a === this.targetReagents.a;
    const matchB = this.currentReagents.b === this.targetReagents.b;
    const matchC = this.currentReagents.c === this.targetReagents.c;

    if (matchA && matchB && matchC) {
      this.disarmed = true;
      this.solved = true;
      if (window.audio && window.audio.playDisarmed) window.audio.playDisarmed();
      if (window.game) {
        window.game.showToast('TOXICOLOGY PROTOCOL NEUTRALIZED ✓', 'success');
        if (window.game.notifyModuleSolved) window.game.notifyModuleSolved('toxicology');
        else window.game.checkVictory();
      }
      this.updateHUD();
      return { status: 'DISARMED' };
    } else {
      if (window.audio && window.audio.playStrike) window.audio.playStrike();
      if (window.game) {
        window.game.addStrike();
        window.game.showToast('STRIKE: INCORRECT REAGENT TITRATION!', 'error');
      }
      this.updateHUD();
      return { status: 'STRIKE' };
    }
  }

  updateHUD() {
    const hud = document.getElementById('toxicology-inspect-hud');
    if (!hud) return;

    const poison = this.poisons[this.currentPoisonKey];
    const symptomsEl = document.getElementById('tox-symptoms-text');
    if (symptomsEl) symptomsEl.innerText = poison.symptoms;

    const assayEl = document.getElementById('tox-assay-result');
    const assayLight = document.getElementById('tox-assay-light');
    if (assayEl) {
      if (this.sampleCentrifuged) {
        assayEl.innerText = poison.assayResult;
        assayEl.style.color = poison.assayColor;
        if (assayLight) {
          assayLight.style.backgroundColor = poison.assayColor;
          assayLight.style.boxShadow = `0 0 12px ${poison.assayColor}`;
        }
      } else {
        assayEl.innerText = 'SAMPLE UNCENTRIFUGED — CLICK CENTRIFUGE';
        assayEl.style.color = '#78909c';
        if (assayLight) {
          assayLight.style.backgroundColor = '#37474f';
          assayLight.style.boxShadow = 'none';
        }
      }
    }

    // Reagent labels and values
    ['a', 'b', 'c'].forEach(k => {
      const lbl = document.getElementById(`tox-lbl-${k}`);
      const val = document.getElementById(`tox-val-${k}`);
      const bar = document.getElementById(`tox-bar-${k}`);
      if (lbl) lbl.innerText = `REAGENT ${k.toUpperCase()}: ${poison.reagents[k]}`;
      if (val) val.innerText = `${this.currentReagents[k]} mL`;
      if (bar) bar.style.height = `${this.currentReagents[k]}%`;
    });

    const statusBadge = document.getElementById('tox-status-badge');
    if (statusBadge) {
      if (this.disarmed) {
        statusBadge.className = 'badge badge-success';
        statusBadge.innerText = 'ANTIDOTE SYNTHESIZED ✓';
      } else {
        statusBadge.className = 'badge badge-warning';
        statusBadge.innerText = 'TITRATION INCOMPLETE';
      }
    }
  }

  updateDOM() {
    this.updateHUD();
  }
}

window.ToxicologyModule = ToxicologyModule;
window.toxicologyModule = new ToxicologyModule();
