/* ==========================================================================
   MODULE: CLOCKWORK ESCAPEMENT ('THE ALCHEMIST'S STUDY')
   Deadbeat Escapement Gear Train & Grandfather Clock Chime Synchronization
   ========================================================================== */

class EscapementModule {
  constructor() {
    this.melodies = [
      {
        id: 'whittington',
        name: 'Whittington Quarters',
        notes: [370.0, 440.0, 293.7, 554.4], // F#4 -> A4 -> D4 -> C#5
        noteNames: ['F#4', 'A4', 'D4', 'C#5'],
        validNote: 3, // Strike 3 (D4 attack)
        ruleText: 'Release precisely on Note 3 (D4) attack strike'
      },
      {
        id: 'westminster',
        name: 'Westminster Quarters',
        notes: [293.7, 370.0, 440.0, 554.4], // D4 -> F#4 -> A4 -> C#5
        noteNames: ['D4', 'F#4', 'A4', 'C#5'],
        validNote: 4, // Note 4 decay
        ruleText: 'Release during the lingering decay of Note 4 (C#5)'
      },
      {
        id: 'stmichael',
        name: 'St. Michael Chimes',
        notes: [554.4, 440.0, 370.0, 293.7], // C#5 -> A4 -> F#4 -> D4
        noteNames: ['C#5', 'A4', 'F#4', 'D4'],
        validNote: 5, // Silence after note 4
        ruleText: 'Release 1.5 seconds AFTER 4th Note in silence'
      }
    ];

    this.activeMelody = this.melodies[0];
    this.chimeInterval = null;
    this.currentStrike = 0; // 0 = idle, 1..4 = ringing note, 5 = post-chime silence
    this.strikeTimestamp = 0;
    this.solved = false;
  }

  generate(seed = 1888) {
    const s = Math.abs(seed);
    this.activeMelody = this.melodies[s % this.melodies.length];
    this.solved = false;
    this.currentStrike = 0;
    this.startChimeLoop();
  }

  startChimeLoop() {
    if (this.chimeInterval) clearInterval(this.chimeInterval);

    // Trigger 4-note chime sequence every 16 seconds
    this.chimeInterval = setInterval(() => {
      if (this.solved) return;
      this.playSequence();
    }, 16000);

    // Initial sequence after 3 seconds
    setTimeout(() => {
      if (!this.solved) this.playSequence();
    }, 3000);
  }

  playSequence() {
    const notes = this.activeMelody.notes;
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (this.solved) return;
        this.currentStrike = idx + 1;
        this.strikeTimestamp = Date.now();
        this.updateDOM();
        if (window.audio && window.audio.playChimeNote) {
          window.audio.playChimeNote(freq, 1.2);
        } else if (window.audio) {
          window.audio.playBeep(freq, 0.8);
        }
      }, idx * 1200);
    });

    // Reset strike to post-chime after 4th note
    setTimeout(() => {
      if (this.solved) return;
      this.currentStrike = 5; // Silence period
      this.updateDOM();
      setTimeout(() => {
        if (!this.solved) {
          this.currentStrike = 0;
          this.updateDOM();
        }
      }, 2500);
    }, 4 * 1200);
  }

  updateDOM() {
    const melEl = document.getElementById('escapement-chime-melody');
    const strEl = document.getElementById('escapement-strike-count');
    const statusEl = document.getElementById('escapement-status');

    if (melEl) melEl.innerText = `MELODY: ${this.activeMelody.name.toUpperCase()}`;
    if (strEl) {
      if (this.currentStrike === 0) {
        strEl.innerText = 'IDLE (TICKING...)';
        strEl.style.color = '#8fa2b8';
      } else if (this.currentStrike <= 4) {
        strEl.innerText = `STRIKE ${this.currentStrike} / 4 [${this.activeMelody.noteNames[this.currentStrike - 1]}]`;
        strEl.style.color = '#ffaa00';
      } else {
        strEl.innerText = 'CHIME DECAY / POST-CHIME SILENCE';
        strEl.style.color = '#00ff88';
      }
    }

    if (statusEl) {
      if (this.solved) {
        statusEl.classList.remove('hidden');
        statusEl.innerText = 'ESCAPEMENT BRAKE DISENGAGED ✓';
      } else {
        statusEl.classList.add('hidden');
      }
    }
  }

  // Defuser pulls Deadman Release Lever
  pullLever() {
    if (this.solved) return;

    const targetNote = this.activeMelody.validNote;
    const isCorrect = (this.currentStrike === targetNote);

    if (isCorrect) {
      this.solved = true;
      if (this.chimeInterval) clearInterval(this.chimeInterval);
      this.updateDOM();
      if (window.audio) window.audio.playSuccess();
      if (window.network && window.network.broadcast) {
        window.network.broadcast({ type: 'MODULE_SOLVED', module: 'escapement' });
      }
      if (window.game) {
        window.game.showToast('🕰️ GRANDFATHER CLOCK: ESCAPEMENT BRAKE DISENGAGED!');
        window.game.checkVictory();
      }
    } else {
      // Strike penalty for tripping brake at wrong millisecond
      if (window.audio) window.audio.playStrike();
      if (window.game) window.game.addStrike();
    }
  }

  getCurrentState() {
    return {
      melodyName: this.activeMelody.name,
      melodyId: this.activeMelody.id,
      noteNames: this.activeMelody.noteNames,
      currentStrike: this.currentStrike,
      ruleText: this.activeMelody.ruleText,
      solved: this.solved
    };
  }

  destroy() {
    if (this.chimeInterval) {
      clearInterval(this.chimeInterval);
      this.chimeInterval = null;
    }
  }
}

window.escapementModule = new EscapementModule();
