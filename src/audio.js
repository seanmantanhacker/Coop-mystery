/* ==========================================================================
   OPERATION: ZERO HOUR - WEB AUDIO API SYNTHESIZER (TACTILE EXPANDED)
   Pure client-side audio generation without external sound files.
   ========================================================================== */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  // Camera Zoom / Whoosh Sound
  playZoom() {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.15);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  // Paper Page Turn Flutter
  playPageTurn() {
    if (this.muted) return;
    this.init();
    const bufferSize = this.ctx.sampleRate * 0.18;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
    filter.Q.value = 1.8;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
  }

  // Mechanical Flip Guard Cover Snap Open/Close
  playFlipGuard() {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(950, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(250, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  // Heavy Metal Toggle Switch Clack
  playToggleSwitch() {
    if (this.muted) return;
    this.init();
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.1);

    osc2.type = 'square';
    osc2.frequency.setValueAtTime(1400, this.ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(this.ctx.currentTime + 0.1);
    osc2.stop(this.ctx.currentTime + 0.1);
  }

  // Rotary Dial Detent Click
  playDialClick() {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.02);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.02);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.02);
  }

  playTick() {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  playClick() {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // Simon Says Electronic Beep Tones (C4, E4, G4, A4)
  playSimonTone(color) {
    if (this.muted) return;
    this.init();
    const freqs = { red: 261.63, blue: 329.63, green: 392.00, yellow: 440.00 };
    const freq = freqs[color] || 350;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  playWireCut() {
    if (this.muted) return;
    this.init();
    const bufferSize = this.ctx.sampleRate * 0.12;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 2400;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
  }

  playStrike() {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.setValueAtTime(90, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.45, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.45);
  }

  // Tactical Error Buzzer Tone
  playBuzz() {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc.frequency.setValueAtTime(105, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  playDisarmed() {
    if (this.muted) return;
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.value = freq;

      const startTime = this.ctx.currentTime + idx * 0.09;
      gain.gain.setValueAtTime(0.22, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.22);
    });
  }

  playSuccess() {
    this.playDisarmed();
  }

  // Grandfather Clock Chime Note with Rich Resonant Harmonics
  playChimeNote(freq = 440, duration = 1.2) {
    if (this.muted) return;
    this.init();
    const harmonics = [1, 2, 2.76, 5.4];
    const weights = [0.22, 0.12, 0.08, 0.04];

    harmonics.forEach((h, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * h, this.ctx.currentTime);

      gain.gain.setValueAtTime(weights[idx], this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    });
  }

  // Mechanical Clockwork Tick
  playClockTick(isTock = false) {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(isTock ? 780 : 920, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.03);

    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.03);
  }

  // Cooke & Wheatstone Needle Telegraph Galvanic Click
  playTelegraphClick() {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.02);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.02);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.02);
  }

  // Pure Frequency Tone Beep (for valves, switches)
  playBeep(freq = 440, duration = 0.08) {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  // Deep-Sea Sonar Ping (Echolocation Echo)
  playSonarPing() {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 1.2);

    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 1.2);
  }

  // Deep-Sea Hydrostatic Cavitation Clank
  playCavitationClank() {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(80, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  playExplosion() {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(18, this.ctx.currentTime + 1.8);

    gain.gain.setValueAtTime(0.85, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.8);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 1.8);
  }

  // 1980s Magnetic Cassette Tape Audio Synthesizer
  playCassetteTape() {
    if (this.muted) return null;
    this.init();
    if (this.tapeSource) {
      this.stopCassetteTape();
    }

    const t = this.ctx.currentTime;

    // 1. Mechanical Latch "Click-Clack"
    const latchOsc = this.ctx.createOscillator();
    const latchGain = this.ctx.createGain();
    latchOsc.type = 'triangle';
    latchOsc.frequency.setValueAtTime(1400, t);
    latchOsc.frequency.exponentialRampToValueAtTime(120, t + 0.06);
    latchGain.gain.setValueAtTime(0.3, t);
    latchGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    latchOsc.connect(latchGain);
    latchGain.connect(this.ctx.destination);
    latchOsc.start(t);
    latchOsc.stop(t + 0.06);

    // 2. Continuous 55Hz Motor Hum with subtle wow/flutter
    const motorOsc = this.ctx.createOscillator();
    const motorGain = this.ctx.createGain();
    motorOsc.type = 'sine';
    motorOsc.frequency.setValueAtTime(55, t);

    // LFO for Wow & Flutter
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(4.2, t);
    lfoGain.gain.setValueAtTime(2.5, t);
    lfo.connect(motorOsc.frequency);
    lfo.start(t + 0.06);

    motorGain.gain.setValueAtTime(0.001, t);
    motorGain.gain.exponentialRampToValueAtTime(0.045, t + 0.15);
    motorOsc.connect(motorGain);
    motorGain.connect(this.ctx.destination);
    motorOsc.start(t + 0.06);

    // 3. Pink Noise / Tape Head Hiss
    const bufferSize = Math.floor(this.ctx.sampleRate * 2.0);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      data[i] = (b0 + b1 + b2) * 0.25;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, t);
    filter.Q.setValueAtTime(1.2, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.035, t + 0.15);

    noiseSource.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noiseSource.start(t + 0.06);

    this.tapeSource = {
      motorOsc,
      motorGain,
      lfo,
      noiseSource,
      noiseGain
    };

    return this.tapeSource;
  }

  stopCassetteTape() {
    if (!this.tapeSource) return;
    this.init();
    const t = this.ctx.currentTime;

    try {
      this.tapeSource.motorGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      this.tapeSource.noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      this.tapeSource.motorOsc.stop(t + 0.1);
      this.tapeSource.lfo.stop(t + 0.1);
      this.tapeSource.noiseSource.stop(t + 0.1);
    } catch (e) {}

    this.tapeSource = null;

    // Mechanical Stop Clack
    if (!this.muted) {
      const stopOsc = this.ctx.createOscillator();
      const stopGain = this.ctx.createGain();
      stopOsc.type = 'triangle';
      stopOsc.frequency.setValueAtTime(900, t);
      stopOsc.frequency.exponentialRampToValueAtTime(80, t + 0.05);
      stopGain.gain.setValueAtTime(0.25, t);
      stopGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      stopOsc.connect(stopGain);
      stopGain.connect(this.ctx.destination);
      stopOsc.start(t);
      stopOsc.stop(t + 0.05);
    }
  }

  // Temporal Ripple Causality Shift (Phase-shifted resonant pulse)
  playTemporalRipple() {
    if (this.muted) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(432, t + 0.25);
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.6);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(432, t);
    osc2.frequency.exponentialRampToValueAtTime(864, t + 0.3);
    osc2.frequency.exponentialRampToValueAtTime(216, t + 0.6);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.18, t + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.65);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc2.start(t);
    osc.stop(t + 0.65);
    osc2.stop(t + 0.65);
  }

  // Paradox Alarm (Dissonant descending tritone feedback)
  playParadoxAlarm() {
    if (this.muted) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';
    osc1.frequency.setValueAtTime(440, t);
    osc2.frequency.setValueAtTime(622.25, t); // Tritone interval
    osc1.frequency.linearRampToValueAtTime(220, t + 0.4);
    osc2.frequency.linearRampToValueAtTime(311.13, t + 0.4);

    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.45);
    osc2.stop(t + 0.45);
  }

  // Quantum Synthesis Success (Crystalline arpeggio)
  playSynthesisSuccess() {
    if (this.muted) return;
    this.init();
    const t = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.08);

      gain.gain.setValueAtTime(0.12, t + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + idx * 0.08);
      osc.stop(t + idx * 0.08 + 0.35);
    });
  }
}

const audio = new SoundEngine();

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('audio-toggle-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      const isMuted = audio.toggleMute();
      btn.innerHTML = isMuted 
        ? '<span class="audio-icon">🔇</span><span class="audio-label"> SOUND OFF</span>' 
        : '<span class="audio-icon">🔊</span><span class="audio-label"> SOUND ON</span>';
    });
  }
});
