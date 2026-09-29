/* ==========================================================================
   OPERATION: ZERO HOUR - MAP 4: LEVEL NULL (INCIDENT 1989)
   MODULE 3: INTERROGATION & WIRETAP DECRYPTION
   University War Alibi Truth/Lie Matrix & Radio Frequency Demodulator
   ========================================================================== */

class LevelNullInterrogationModule {
  constructor() {
    this.id = 'levelnull_interrogation';
    this.name = 'Wiretap Intercept & Alibi Decrypter';
    this.disarmed = false;

    this.CHANNELS = [
      { freq: 88.5, label: 'CH-1: SECTOR 1 INTERCOM', noise: 'High fluorescent hum' },
      { freq: 94.2, label: 'CH-2: HYDRO PUMP MONITOR', noise: 'Hydraulic rhythmic hiss' },
      { freq: 108.6, label: 'CH-3: QUANTUM RESONANCE', noise: 'Sub-harmonic pulse tone' },
      { freq: 122.4, label: 'CH-4: COVERT TRANSMITTER', noise: 'Pulsed cipher carrier' }
    ];

    this.targetChannel = null;
    this.currentFreq = 88.0;
    this.cipherKey = '1989';

    // 6 Alibi statements, where 2 contain logical contradictions
    this.statements = [];
  }

  generate(seed = 1989) {
    this.disarmed = false;
    const chIdx = Math.abs((seed * 7) % this.CHANNELS.length);
    this.targetChannel = this.CHANNELS[chIdx];

    // Generate 4-digit cipher key deterministically
    const d1 = (Math.abs(seed) % 9) + 1;
    const d2 = (Math.abs(seed * 2) % 9) + 1;
    const d3 = (Math.abs(seed * 3) % 9) + 1;
    const d4 = (Math.abs(seed * 4) % 9) + 1;
    this.cipherKey = `${d1}${d2}${d3}${d4}`;

    this.currentFreq = 85.0;

    this.statements = [
      { id: 'STMT_1', speaker: 'Cmdr. Ramos', text: 'I was checking the Sector 1 fire door when the alarm tripped. Dr. Vance was in the core.', veracity: 'TRUTH' },
      { id: 'STMT_2', speaker: 'Dr. Park', text: 'I was running toxicology assays. Sophia can confirm I never touched the potassium cyanide bottle.', veracity: 'VERIFIED' },
      { id: 'STMT_3', speaker: 'Eng. Chen', text: 'I was balancing Valve B in Hydro. The pressure dropped suddenly at the time of breach.', veracity: 'TRUTH' },
      { id: 'STMT_4', speaker: 'Dr. Thorne', text: 'My headphones were tuned to the telemetry array. I heard footsteps near the victim’s office.', veracity: 'TRUTH' },
      { id: 'STMT_5', speaker: 'Agent Miller', text: 'I saw someone wearing heavy rubber diving boots running toward the emergency vent.', veracity: 'TRUTH' },
      { id: 'STMT_6', speaker: 'Tech. O\'Connor', text: 'I was asleep in the bunk. My boots were locked in the dry room all morning.', veracity: 'CONTRADICTED' }
    ];
  }

  tuneFrequencyDelta(delta) {
    if (this.disarmed) return;
    this.currentFreq = Math.round((this.currentFreq + delta) * 10) / 10;
    if (this.currentFreq < 80.0) this.currentFreq = 80.0;
    if (this.currentFreq > 135.0) this.currentFreq = 135.0;

    if (typeof audio !== 'undefined' && audio.playSwitch) audio.playSwitch();
    this.renderInspectUI();
  }

  confirmWiretapLock() {
    if (this.disarmed) return { status: 'ALREADY_DISARMED' };

    const freqDiff = Math.abs(this.currentFreq - this.targetChannel.freq);
    if (freqDiff <= 0.3) {
      this.disarmed = true;
      if (typeof audio !== 'undefined' && audio.playDisarmed) audio.playDisarmed();

      // Broadcast sync
      if (window.game && window.game.network && window.game.network.broadcast) {
        window.game.network.broadcast({
          type: 'LEVELNULL_INTERROGATION_DISARMED',
          cipherKey: this.cipherKey,
          freq: this.targetChannel.freq
        });
      }

      this.renderInspectUI();
      if (window.game) window.game.checkVictory();
      return { status: 'DISARMED', cipherKey: this.cipherKey };
    } else {
      if (typeof audio !== 'undefined' && audio.playStrike) audio.playStrike();
      if (window.game) window.game.addStrike();
      return { status: 'STRIKE', reason: 'Receiver off-frequency, static burst tripped alert' };
    }
  }

  renderInspectUI() {
    const statusEl = document.getElementById('interrogation-status');
    const freqEl = document.getElementById('interrogation-freq-val');
    const cipherEl = document.getElementById('interrogation-cipher-val');
    const confirmBtn = document.getElementById('interrogation-confirm-btn');

    if (freqEl) freqEl.innerText = `${this.currentFreq.toFixed(1)} MHz`;

    const rssiBar = document.getElementById('interrogation-rssi-bar');
    const rssiVal = document.getElementById('interrogation-rssi-val');
    const diff = this.targetChannel ? Math.abs(this.currentFreq - this.targetChannel.freq) : 10;
    const lockPct = Math.max(8, Math.min(100, Math.round((1 - Math.min(1, diff / 8.0)) * 100)));
    const dbVal = Math.round(-48 + (lockPct / 100) * 44);
    if (rssiBar && rssiBar.style) rssiBar.style.width = `${lockPct}%`;
    if (rssiVal) rssiVal.innerText = `${dbVal} dB`;

    if (statusEl) {
      if (this.disarmed) {
        statusEl.innerText = `LOCKED: ${this.targetChannel.label} ✓`;
        statusEl.className = 'module-status-badge solved';
        if (cipherEl) cipherEl.innerText = `SABOTEUR CIPHER: ${this.cipherKey}`;
        if (confirmBtn) confirmBtn.disabled = true;
      } else {
        if (diff <= 1.0) {
          statusEl.innerText = 'SIGNAL CARRIER DETECTED - FINE TUNE';
          statusEl.className = 'module-status-badge warning';
        } else {
          statusEl.innerText = 'CARRIER SEARCHING...';
          statusEl.className = 'module-status-badge pending';
        }
        if (cipherEl) cipherEl.innerText = 'SABOTEUR CIPHER: [ENCRYPTED]';
        if (confirmBtn) confirmBtn.disabled = false;
      }
    }

    this.startOscilloscope();
  }

  startOscilloscope() {
    if (this._animFrame) return;
    if (typeof document === 'undefined' || !document.getElementById) return;
    const canvas = document.getElementById('wiretap-oscilloscope');
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const panel = document.getElementById('levelnull-inspect-interrogation');
      if (!panel || (panel.classList && panel.classList.contains && panel.classList.contains('hidden'))) {
        this._animFrame = null;
        return;
      }

      const w = canvas.width;
      const h = canvas.height;
      ctx.fillStyle = 'rgba(4, 9, 8, 0.35)';
      ctx.fillRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.12)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y < h; y += 24) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

      const diff = this.targetChannel ? Math.abs(this.currentFreq - this.targetChannel.freq) : 10;
      const t = performance.now() * 0.005;

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = (diff <= 0.3) ? '#00ff88' : (diff <= 1.2 ? '#f5d76e' : '#00f0ff');

      for (let x = 0; x < w; x++) {
        let y = h / 2;
        if (diff <= 0.3) {
          y += Math.sin(x * 0.06 + t * 4) * 26 + Math.sin(x * 0.12 + t * 2) * 7;
        } else if (diff <= 1.5) {
          const beat = Math.sin(x * 0.04 + t * 3) * (26 - diff * 10);
          const noise = (Math.random() - 0.5) * (diff * 14);
          y += beat + noise;
        } else {
          y += (Math.random() - 0.5) * 32;
        }
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      this._animFrame = requestAnimationFrame(draw);
    };
    this._animFrame = requestAnimationFrame(draw);
  }
}

window.LevelNullInterrogationModule = LevelNullInterrogationModule;
window.levelNullInterrogationModule = new LevelNullInterrogationModule();
