/**
 * NEON TYPE SHOOTER - Game Script
 * Theme: Cyberpunk/Synthwave typing shooter
 * Technology: HTML5 Canvas, Web Audio API Sound Synthesis
 */

// --- Word Lists categorized by length ---
const WORDS_DATABASE = {
  short: [
    "it", "go", "to", "do", "he", "me", "we", "my", "up", "so", "no", "us", "am", "an", "at", "if", "in", "is", "on", "or",
    "cat", "dog", "sun", "run", "fly", "sky", "car", "map", "key", "box", "ice", "red", "big", "hot", "sad", "new", "old", "yes",
    "boy", "man", "toy", "ten", "cup", "pen", "hat", "pig", "fox", "bee", "cow", "job", "win", "use", "ask", "try", "out", "sea",
    "air", "day", "law", "war", "art", "fun", "bad", "wet", "dry", "coy", "fix", "mix", "zip", "gem", "web", "app", "dev", "net", "git", "api"
  ],
  medium: [
    "blue", "wind", "rain", "snow", "star", "moon", "tree", "leaf", "fish", "bird", "lion", "bear", "frog", "jump", "walk", "sing",
    "song", "book", "game", "code", "work", "play", "time", "date", "year", "life", "love", "hope", "mind", "soul", "fire", "wave",
    "sand", "rock", "gold", "iron", "hero", "zero", "city", "road", "ship", "boat", "neon", "grid", "warp", "glow", "type", "fast"
  ],
  long: [
    "water", "earth", "space", "light", "night", "green", "white", "black", "house", "mouse", "apple", "plant", "music", "dance",
    "dream", "happy", "smile", "laugh", "cloud", "storm", "river", "ocean", "stone", "metal", "paper", "glass", "laser", "pixel",
    "retro", "cyber", "world", "ghost", "witch", "magic", "sword", "shield", "rocket", "galaxy", "planet", "cosmic", "nebula", "matrix"
  ],
  expert: [
    "arcade", "player", "energy", "future", "system", "engine", "coding", "python", "script", "design", "portal", "vector", "shadow",
    "flight", "dragon", "knight", "castle", "forest", "jungle", "island", "bridge", "camera", "screen", "button", "universe", "asteroid",
    "keyboard", "computer", "database", "software", "hardware", "terminal", "shuttle", "satellite", "explorer", "adventure", "dimension"
  ]
};

// --- Web Audio API Synth (SFX & Sequenced BGM) ---
class AudioSynth {
  constructor() {
    this.ctx = null;
    this.enabled = true; // Global sound toggle
    
    // BGM loop timer state
    this.bgmSequenceTimer = null;
    this.bgmTick = 0;
    this.tempo = 112; // BPM
    this.beatDuration = 60 / this.tempo;
    this.tickDuration = this.beatDuration / 2; // eighth notes
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  startBGM() {
    this.init();
    if (!this.enabled || !this.ctx) return;
    if (this.bgmSequenceTimer) return; // already running
    
    this.bgmTick = 0;
    const tickTimeMs = this.tickDuration * 1000;
    this.bgmSequenceTimer = setInterval(() => {
      if (this.ctx && this.ctx.state !== 'suspended') {
        this.playBGMTick();
      }
    }, tickTimeMs);
  }

  stopBGM() {
    if (this.bgmSequenceTimer) {
      clearInterval(this.bgmSequenceTimer);
      this.bgmSequenceTimer = null;
    }
  }

  playBGMTick() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    
    // Chord progression frequencies (A2, F2, G2, E2)
    const rootNotes = [
      110.00, // A2 (Am)
      87.31,  // F2 (F)
      98.00,  // G2 (G)
      82.41   // E2 (Em)
    ];
    
    // Each chord lasts for 8 beats (16 ticks)
    const chordIndex = Math.floor((this.bgmTick % 64) / 16);
    const baseFreq = rootNotes[chordIndex];
    
    // Alternating synthwave bass pattern (disco bass / octaves)
    let freq = baseFreq;
    if (this.bgmTick % 8 === 2 || this.bgmTick % 8 === 6) {
      freq = baseFreq * 2; // octave up
    }
    
    // Create Bass Oscillator
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);
    
    // Warm lowpass filter to prevent harsh buzzing
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, now);
    
    // Pluck amplitude envelope
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.18);
    
    // Synthesize hi-hats on off-beats
    if (this.bgmTick % 2 === 1) {
      this.playSynthHiHat(now);
    }
    
    // Synthesize snare drums on beats 2 and 4
    if (this.bgmTick % 8 === 4) {
      this.playSynthSnare(now);
    }
    
    this.bgmTick++;
  }

  playSynthHiHat(time) {
    const bufferSize = this.ctx.sampleRate * 0.02; // very short sound
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(9000, time);
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.012, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.02);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    noise.start(time);
    noise.stop(time + 0.025);
  }

  playSynthSnare(time) {
    // White noise for snare brush
    const bufferSize = this.ctx.sampleRate * 0.06;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1000, time);
    
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.025, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);
    
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    
    // Low snap drum body
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, time);
    osc.frequency.exponentialRampToValueAtTime(80, time + 0.05);
    
    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(0.035, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
    
    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    
    noise.start(time);
    osc.start(time);
    noise.stop(time + 0.065);
    osc.stop(time + 0.055);
  }

  playLaser() {
    if (!this.enabled || !this.ctx) return;
    this.init();
    
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1000, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.14);
    
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.15);
  }

  playExplosion() {
    if (!this.enabled || !this.ctx) return;
    this.init();
    
    const now = this.ctx.currentTime;
    
    // Create white noise buffer
    const bufferSize = this.ctx.sampleRate * 0.35;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    // Low frequency rumble oscillator
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(25, now + 0.3);
    oscGain.gain.setValueAtTime(0.45, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.exponentialRampToValueAtTime(60, now + 0.35);
    
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.25, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    
    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    
    noise.start(now);
    osc.start(now);
    
    noise.stop(now + 0.36);
    osc.stop(now + 0.31);
  }

  playType() {
    if (!this.enabled || !this.ctx) return;
    this.init();
    
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1100, now);
    osc.frequency.setValueAtTime(700, now + 0.02);
    
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.04);
  }

  playError() {
    if (!this.enabled || !this.ctx) return;
    this.init();
    
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.setValueAtTime(105, now + 0.12);
    
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.23);
  }

  playLevelUp() {
    if (!this.enabled || !this.ctx) return;
    this.init();
    
    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // Arpeggio C4 E4 G4 C5 E5 G5 C6
    const duration = 0.07;
    
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * duration);
      
      gain.gain.setValueAtTime(0.12, now + idx * duration);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * duration + 0.18);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now + idx * duration);
      osc.stop(now + idx * duration + 0.2);
    });
  }

  playGameOver() {
    if (!this.enabled || !this.ctx) return;
    this.init();
    
    const now = this.ctx.currentTime;
    const notes = [587.33, 493.88, 440.00, 349.23, 293.66, 220.00]; // descending D5 B4 A4 F4 D4 A3
    const duration = 0.12;
    
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * duration);
      osc.frequency.exponentialRampToValueAtTime(freq - 15, now + idx * duration + 0.5);
      
      gain.gain.setValueAtTime(0.12, now + idx * duration);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * duration + 0.5);
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now + idx * duration);
      osc.stop(now + idx * duration + 0.52);
    });
  }
}

// --- Dynamic Twinkling Stars Background ---
class TwinklingStar {
  constructor() {
    this.reset(true);
  }

  reset(randomY = false) {
    this.x = Math.random() * window.innerWidth;
    this.y = randomY ? Math.random() * window.innerHeight : -10;
    this.size = Math.random() * 2 + 0.5;
    
    // Colorful star palette
    const colors = ['#00f3ff', '#ff007f', '#39ff14', '#ffdf00', '#ff00ff', '#ffffff', '#00bfff', '#ff6600'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.alpha = Math.random();
    
    // Slow drifting movement downwards
    this.vy = Math.random() * 0.3 + 0.1;
    this.twinkleSpeed = Math.random() * 0.02 + 0.005;
  }

  update() {
    this.y += this.vy;
    this.alpha += this.twinkleSpeed;
    if (this.alpha > 1 || this.alpha < 0.2) {
      this.twinkleSpeed = -this.twinkleSpeed;
    }
    
    // Wrap around screen
    if (this.y > window.innerHeight) {
      this.reset(false);
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0.1, this.alpha);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 5;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// --- Particle Systems ---
class Particle {
  constructor(x, y, color, type = 'spark') {
    this.x = x;
    this.y = y;
    this.color = color;
    this.type = type; // 'spark', 'debris', 'thrust'
    
    const angle = Math.random() * Math.PI * 2;
    if (type === 'debris') {
      const speed = Math.random() * 4 + 2.5;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.size = Math.random() * 3.5 + 1.5;
      this.alpha = 1;
      this.decay = Math.random() * 0.02 + 0.015;
      this.gravity = 0.06;
    } else if (type === 'thrust') {
      const speed = Math.random() * 2 + 1;
      const exhaustAngle = Math.PI / 2 + (Math.random() * 0.5 - 0.25); // down direction
      this.vx = Math.cos(exhaustAngle) * speed;
      this.vy = Math.sin(exhaustAngle) * speed;
      this.size = Math.random() * 3.5 + 1;
      this.alpha = 0.8;
      this.decay = Math.random() * 0.04 + 0.03;
      this.gravity = 0;
    } else { // 'spark'
      const speed = Math.random() * 3.5 + 1;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.size = Math.random() * 2.2 + 0.8;
      this.alpha = 1;
      this.decay = Math.random() * 0.05 + 0.035;
      this.gravity = 0;
    }
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.type === 'debris') {
      this.vy += this.gravity;
      this.vx *= 0.98;
      this.vy *= 0.98;
    }
    this.alpha -= this.decay;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = this.type === 'thrust' ? 6 : 12;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// --- Laser beam renderer ---
class LaserBeam {
  constructor(x1, y1, x2, y2, color) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.color = color;
    this.alpha = 1;
    this.width = 4.5;
  }

  update() {
    this.alpha -= 0.16;
    this.width = Math.max(0.5, this.width - 0.5);
  }

  draw(ctx) {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = this.alpha;
    
    // Outer glow
    ctx.lineWidth = this.width + 6;
    ctx.strokeStyle = this.color;
    ctx.shadowBlur = 18;
    ctx.shadowColor = this.color;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.stroke();

    // Inner bright core
    ctx.lineWidth = this.width;
    ctx.strokeStyle = '#ffffff';
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.stroke();

    ctx.restore();
  }
}

// --- Floating Score Text ---
class FloatingText {
  constructor(x, y, text, color) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
    this.vy = -1.6;
    this.alpha = 1;
  }

  update() {
    this.y += this.vy;
    this.alpha -= 0.02;
  }

  draw(ctx) {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.color;
    ctx.font = 'bold 18px "Share Tech Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
}

// --- Spaceship Player Ship ---
class PlayerShip {
  constructor() {
    this.resize();
    this.angle = 0; // Pointing straight up
    this.targetAngle = 0;
  }

  resize() {
    this.x = window.innerWidth / 2;
    this.y = window.innerHeight - 80;
    this.size = 25; // size scale
  }

  alignWith(targetX, targetY) {
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    this.targetAngle = Math.atan2(dy, dx) + Math.PI / 2;
  }

  update() {
    const angleDiff = this.targetAngle - this.angle;
    this.angle += angleDiff * 0.25;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00f3ff';
    
    // Main Body
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 3;
    ctx.fillStyle = 'rgba(10, 8, 19, 0.95)';
    ctx.beginPath();
    ctx.moveTo(0, -this.size); // nose
    ctx.lineTo(this.size * 0.8, this.size * 0.8); // bottom right
    ctx.lineTo(this.size * 0.3, this.size * 0.5); // inner notch right
    ctx.lineTo(-this.size * 0.3, this.size * 0.5); // inner notch left
    ctx.lineTo(-this.size * 0.8, this.size * 0.8); // bottom left
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Secondary wings (neon pink)
    ctx.strokeStyle = '#ff007f';
    ctx.shadowColor = '#ff007f';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(this.size * 0.4, this.size * 0.2);
    ctx.lineTo(this.size * 0.7, this.size * 0.6);
    ctx.moveTo(-this.size * 0.4, this.size * 0.2);
    ctx.lineTo(-this.size * 0.7, this.size * 0.6);
    ctx.stroke();

    // Engine Exhaust Core
    ctx.fillStyle = '#ff007f';
    ctx.beginPath();
    ctx.arc(0, this.size * 0.4, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// --- Falling Word Class ---
class FallingWord {
  constructor(text, speed, colorTheme) {
    this.text = text;
    this.speed = speed;
    this.colorTheme = colorTheme;
    
    // Expanded color palette (8 bright neon colors)
    this.colorMap = {
      cyan: { glow: '#00f3ff', typed: '#00bfff', normal: '#ffffff' },
      pink: { glow: '#ff007f', typed: '#b5179e', normal: '#ffffff' },
      green: { glow: '#39ff14', typed: '#00cc00', normal: '#ffffff' },
      purple: { glow: '#9d4edd', typed: '#7b2cbf', normal: '#ffffff' },
      yellow: { glow: '#ffdf00', typed: '#e69500', normal: '#ffffff' },
      orange: { glow: '#ff6600', typed: '#ff3700', normal: '#ffffff' },
      red: { glow: '#ff0033', typed: '#b30022', normal: '#ffffff' },
      magenta: { glow: '#ff00ff', typed: '#b300b3', normal: '#ffffff' }
    };
    
    this.colors = this.colorMap[colorTheme] || this.colorMap.cyan;
    
    const textWidthEstimate = text.length * 15;
    const padding = Math.max(60, textWidthEstimate);
    this.x = padding + Math.random() * (window.innerWidth - padding * 2);
    this.y = -35;
    this.typedIndex = 0;
    this.isTarget = false;
    this.width = textWidthEstimate;
    this.height = 24;
  }

  update() {
    this.y += this.speed;
  }

  draw(ctx) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 22px "Orbitron", sans-serif';

    const textY = this.y;
    const textX = this.x;
    
    // Semi-transparent box background for text readability
    ctx.fillStyle = 'rgba(10, 8, 19, 0.55)';
    ctx.fillRect(textX - this.width/2 - 8, textY - 14, this.width + 16, 28);
    
    ctx.shadowBlur = this.isTarget ? 16 : 8;
    ctx.shadowColor = this.colors.glow;

    const charWidth = 14; 
    const totalWidth = this.text.length * charWidth;
    let startX = textX - totalWidth / 2 + charWidth / 2;

    for (let i = 0; i < this.text.length; i++) {
      const char = this.text[i];
      if (i < this.typedIndex) {
        ctx.fillStyle = this.colors.glow;
        ctx.shadowBlur = 18;
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = this.isTarget ? 10 : 4;
      }
      ctx.fillText(char, startX + i * charWidth, textY);
    }

    // Bracket overlays for target word
    if (this.isTarget) {
      ctx.strokeStyle = this.colors.glow;
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 12;
      
      // Left bracket
      ctx.beginPath();
      ctx.moveTo(textX - totalWidth/2 - 10, textY - 12);
      ctx.lineTo(textX - totalWidth/2 - 14, textY - 12);
      ctx.lineTo(textX - totalWidth/2 - 14, textY + 12);
      ctx.lineTo(textX - totalWidth/2 - 10, textY + 12);
      ctx.stroke();

      // Right bracket
      ctx.beginPath();
      ctx.moveTo(textX + totalWidth/2 + 10, textY - 12);
      ctx.lineTo(textX + totalWidth/2 + 14, textY - 12);
      ctx.lineTo(textX + totalWidth/2 + 14, textY + 12);
      ctx.lineTo(textX + totalWidth/2 + 10, textY + 12);
      ctx.stroke();
    }

    ctx.restore();
  }
}

// --- Main Game Controller ---
class GameEngine {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Core game state
    this.score = 0;
    this.missedCount = 0;
    this.level = 1;
    this.destroyedWordsCount = 0;
    
    // Game loops collections
    this.words = [];
    this.activeWord = null;
    this.particles = [];
    this.lasers = [];
    this.floatingTexts = [];
    
    // Twinkling colorful stars backdrop
    this.stars = [];
    
    this.spawnTimer = 0;
    this.spawnRate = 3500; // spawn pacing in ms
    this.maxActiveWords = 2; // word density limiter
    
    this.lastFrameTime = 0;
    this.isRunning = false;
    this.redFlashAlpha = 0;
    
    // Typing telemetry
    this.totalKeystrokes = 0;
    this.correctKeystrokes = 0;
    this.gameStartTime = 0;
    
    // Instantiations
    this.synth = new AudioSynth();
    this.ship = new PlayerShip();

    this.resizeCanvas();
    this.initEventListeners();
    this.initStars();
  }

  resizeCanvas() {
    const scale = window.devicePixelRatio || 1;
    this.canvas.width = window.innerWidth * scale;
    this.canvas.height = window.innerHeight * scale;
    this.ctx.scale(scale, scale);
    this.ship.resize();
  }

  initStars() {
    this.stars = [];
    for (let i = 0; i < 40; i++) {
      this.stars.push(new TwinklingStar());
    }
  }

  initEventListeners() {
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.initStars(); // Re-populate stars for new dimensions
    });
    
    // Controls overlays
    const playBtn = document.getElementById('play-btn');
    const restartBtn = document.getElementById('restart-btn');
    const soundBtn = document.getElementById('sound-btn');
    const hudMuteBtn = document.getElementById('hud-mute-btn');
    
    playBtn.addEventListener('click', () => this.startGame());
    restartBtn.addEventListener('click', () => this.startGame());
    
    // Mute togglers synchronization
    soundBtn.addEventListener('click', () => this.toggleMute());
    hudMuteBtn.addEventListener('click', () => this.toggleMute());

    // Capture user typing
    window.addEventListener('keydown', (e) => this.handleKeyDown(e));
  }

  toggleMute() {
    const isMuted = !this.synth.enabled;
    this.setMuteState(isMuted);
  }

  setMuteState(muted) {
    this.synth.enabled = !muted;
    
    const soundBtn = document.getElementById('sound-btn');
    const hudMuteBtn = document.getElementById('hud-mute-btn');
    
    if (this.synth.enabled) {
      soundBtn.innerHTML = '<span class="icon">🔊</span> 音效：開啟';
      soundBtn.classList.remove('neon-text-red');
      hudMuteBtn.innerHTML = '🔊';
      hudMuteBtn.classList.remove('muted');
      
      if (this.isRunning) {
        this.synth.startBGM();
      }
    } else {
      soundBtn.innerHTML = '<span class="icon">🔇</span> 音效：關閉';
      soundBtn.classList.add('neon-text-red');
      hudMuteBtn.innerHTML = '🔇';
      hudMuteBtn.classList.add('muted');
      
      this.synth.stopBGM();
    }
  }

  updateDifficultySettings() {
    // Limits word counts and adjusts spawning speed based on current level
    if (this.level === 1) {
      this.maxActiveWords = 2; // Very few words at start
      this.spawnRate = 3500;  // Slow pace
    } else if (this.level === 2) {
      this.maxActiveWords = 3;
      this.spawnRate = 2800;
    } else if (this.level === 3) {
      this.maxActiveWords = 4;
      this.spawnRate = 2200;
    } else if (this.level === 4) {
      this.maxActiveWords = 6;
      this.spawnRate = 1800;
    } else {
      this.maxActiveWords = 8; // Density scales up
      this.spawnRate = 1350;  // Spawn quickly
    }
  }

  startGame() {
    this.synth.init();
    
    // Hide panels
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('hud').classList.remove('hidden');

    // Reset stats
    this.score = 0;
    this.missedCount = 0;
    this.level = 1;
    this.destroyedWordsCount = 0;
    
    this.words = [];
    this.activeWord = null;
    this.particles = [];
    this.lasers = [];
    this.floatingTexts = [];
    this.initStars();
    
    this.totalKeystrokes = 0;
    this.correctKeystrokes = 0;
    this.redFlashAlpha = 0;
    this.gameStartTime = Date.now();
    
    this.updateDifficultySettings();
    this.updateHUD();
    
    // Start running loops
    this.isRunning = true;
    this.lastFrameTime = performance.now();
    this.spawnTimer = performance.now();
    
    // Start synth background music
    this.synth.startBGM();
    this.synth.playLevelUp(); // trigger game start chime
    
    // Spawn first word
    this.spawnWord();
    
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  gameLoop(currentTime) {
    if (!this.isRunning) return;
    
    const deltaTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;
    
    this.update(currentTime, deltaTime);
    this.draw();
    
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  update(currentTime, deltaTime) {
    // Update drifting stars background
    this.stars.forEach(star => star.update());

    // Spawn new word if under limit and timer exceeded
    if (currentTime - this.spawnTimer > this.spawnRate) {
      if (this.words.length < this.maxActiveWords) {
        this.spawnWord();
      }
      this.spawnTimer = currentTime;
    }

    // Damage flash decay
    if (this.redFlashAlpha > 0) {
      this.redFlashAlpha -= 0.035;
    }

    // Ship target tracking angle
    if (this.activeWord) {
      this.ship.alignWith(this.activeWord.x, this.activeWord.y);
    } else {
      this.ship.targetAngle = 0;
    }
    this.ship.update();

    // Ship exhaust flame particles
    if (Math.random() < 0.35) {
      this.particles.push(new Particle(this.ship.x, this.ship.y + 12, '#ff007f', 'thrust'));
      this.particles.push(new Particle(this.ship.x, this.ship.y + 12, '#00f3ff', 'thrust'));
    }

    // Update words
    for (let i = this.words.length - 1; i >= 0; i--) {
      const word = this.words[i];
      word.update();
      
      // Hit bottom threshold
      if (word.y >= this.ship.y - 10) {
        this.handleWordMiss(i);
      }
    }

    // Update lasers
    for (let i = this.lasers.length - 1; i >= 0; i--) {
      this.lasers[i].update();
      if (this.lasers[i].alpha <= 0) {
        this.lasers.splice(i, 1);
      }
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      if (this.particles[i].alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Update float texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      this.floatingTexts[i].update();
      if (this.floatingTexts[i].alpha <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }

    // Update WPM
    const elapsedMinutes = (Date.now() - this.gameStartTime) / 60000;
    if (elapsedMinutes > 0.05) {
      const wpm = Math.round((this.correctKeystrokes / 5) / elapsedMinutes);
      document.getElementById('wpm-val').innerText = wpm;
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // 1. Draw drifting starfield background
    this.stars.forEach(star => star.draw(this.ctx));

    // 2. Draw lasers
    this.lasers.forEach(laser => laser.draw(this.ctx));

    // 3. Draw explosion particles
    this.particles.forEach(p => p.draw(this.ctx));

    // 4. Draw spaceship
    this.ship.draw(this.ctx);

    // 5. Draw words
    this.words.forEach(word => word.draw(this.ctx));

    // 6. Draw floating score indicators
    this.floatingTexts.forEach(ft => ft.draw(this.ctx));

    // 7. Red border shield damage flash
    if (this.redFlashAlpha > 0) {
      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, this.redFlashAlpha);
      const gradient = this.ctx.createRadialGradient(
        window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / 3,
        window.innerWidth / 2, window.innerHeight / 2, window.innerWidth
      );
      gradient.addColorStop(0, 'rgba(255, 0, 0, 0)');
      gradient.addColorStop(1, 'rgba(255, 0, 0, 0.4)');
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      this.ctx.restore();
    }
  }

  spawnWord() {
    // Difficulty lists select
    let wordPool = [];
    if (this.level === 1) {
      wordPool = WORDS_DATABASE.short;
    } else if (this.level === 2) {
      wordPool = [...WORDS_DATABASE.short, ...WORDS_DATABASE.medium];
    } else if (this.level === 3) {
      wordPool = [...WORDS_DATABASE.medium, ...WORDS_DATABASE.long];
    } else if (this.level === 4) {
      wordPool = [...WORDS_DATABASE.long, ...WORDS_DATABASE.expert];
    } else {
      wordPool = WORDS_DATABASE.expert;
    }

    const text = wordPool[Math.floor(Math.random() * wordPool.length)];
    
    // Expanded 8 colors
    const themes = ['cyan', 'pink', 'green', 'purple', 'yellow', 'orange', 'red', 'magenta'];
    const theme = themes[Math.floor(Math.random() * themes.length)];
    
    // Velocity scales up
    const baseSpeed = 0.5 + (this.level * 0.15);
    const speed = baseSpeed + (Math.random() * 0.35);

    this.words.push(new FallingWord(text, speed, theme));
  }

  handleKeyDown(e) {
    if (!this.isRunning) return;
    
    const char = e.key.toLowerCase();
    
    // Only accept A-Z
    if (char.length !== 1 || char < 'a' || char > 'z') return;
    
    this.totalKeystrokes++;

    if (!this.activeWord) {
      // Find matches starting with char
      let candidates = this.words.filter(w => w.text[0] === char);
      
      if (candidates.length > 0) {
        // Target threat closest to bottom
        candidates.sort((a, b) => b.y - a.y);
        this.activeWord = candidates[0];
        this.activeWord.isTarget = true;
        this.activeWord.typedIndex = 1;
        this.correctKeystrokes++;
        
        this.synth.playType();
        this.triggerSparks(this.activeWord.x, this.activeWord.y, this.activeWord.colors.glow);
      } else {
        this.synth.playError();
      }
    } else {
      const expectedChar = this.activeWord.text[this.activeWord.typedIndex];
      if (char === expectedChar) {
        this.activeWord.typedIndex++;
        this.correctKeystrokes++;
        
        this.synth.playType();
        this.triggerSparks(this.activeWord.x, this.activeWord.y, this.activeWord.colors.glow);

        if (this.activeWord.typedIndex === this.activeWord.text.length) {
          this.shootTarget(this.activeWord);
        }
      } else {
        this.synth.playError();
      }
    }
  }

  triggerSparks(x, y, color) {
    for (let i = 0; i < 5; i++) {
      this.particles.push(new Particle(x, y, color, 'spark'));
    }
  }

  shootTarget(word) {
    // Generate shooting laser SFX and lasers
    this.lasers.push(new LaserBeam(this.ship.x, this.ship.y - 12, word.x, word.y, word.colors.glow));
    this.synth.playLaser();
    
    // Colorful explosion debris (60% word glow color, 40% randomized rainbow colors)
    const rainbowColors = ['#00f3ff', '#ff007f', '#39ff14', '#9d4edd', '#ffdf00', '#ff6600', '#ff00ff', '#ff0033'];
    for (let i = 0; i < 22; i++) {
      const particleColor = Math.random() < 0.6 ? word.colors.glow : rainbowColors[Math.floor(Math.random() * rainbowColors.length)];
      this.particles.push(new Particle(word.x, word.y, particleColor, 'debris'));
    }
    
    setTimeout(() => this.synth.playExplosion(), 60);
    
    // Score updates
    const pts = word.text.length * 10;
    this.score += pts;
    this.destroyedWordsCount++;
    
    this.floatingTexts.push(new FloatingText(word.x, word.y - 20, `+${pts}`, word.colors.glow));

    // Remove word
    const index = this.words.indexOf(word);
    if (index > -1) {
      this.words.splice(index, 1);
    }
    this.activeWord = null;

    // Progression level thresholds
    const nextLevelThreshold = this.level * 150;
    if (this.score >= nextLevelThreshold) {
      this.levelUp();
    }

    this.updateHUD();
  }

  levelUp() {
    this.level++;
    this.updateDifficultySettings();
    this.synth.playLevelUp();
    
    this.floatingTexts.push(new FloatingText(window.innerWidth / 2, window.innerHeight / 2, `WAVE ${this.level} START!`, '#39ff14'));
  }

  handleWordMiss(index) {
    const word = this.words[index];
    
    // Deduct score by 1 (as requested: "如果沒打完的扣一分")
    this.score = Math.max(0, this.score - 1);
    this.missedCount++;
    
    this.floatingTexts.push(new FloatingText(word.x, this.ship.y - 40, "-1 SCORE", '#ff3333'));
    
    this.redFlashAlpha = 0.5;
    this.synth.playError();

    // Red impact sparks
    for (let i = 0; i < 10; i++) {
      this.particles.push(new Particle(word.x, this.ship.y - 10, '#ff3333', 'spark'));
    }

    if (word === this.activeWord) {
      this.activeWord = null;
    }

    this.words.splice(index, 1);
    this.updateHUD();

    // Game Over on 10 missed
    if (this.missedCount >= 10) {
      this.gameOver();
    }
  }

  gameOver() {
    this.isRunning = false;
    this.synth.stopBGM();
    this.synth.playGameOver();

    // Toggle panels
    document.getElementById('game-over-screen').classList.remove('hidden');
    document.getElementById('hud').classList.add('hidden');
    
    document.getElementById('final-score').innerText = this.score;
    document.getElementById('final-destroyed').innerText = this.destroyedWordsCount;
    document.getElementById('final-level').innerText = this.level;
    
    const elapsedMinutes = (Date.now() - this.gameStartTime) / 60000;
    const finalWPM = elapsedMinutes > 0.05 ? Math.round((this.correctKeystrokes / 5) / elapsedMinutes) : 0;
    document.getElementById('final-wpm').innerText = finalWPM;
  }

  updateHUD() {
    document.getElementById('score-val').innerText = this.score;
    document.getElementById('level-val').innerText = this.level;
    
    const dots = document.querySelectorAll('#misses-indicator .dot');
    dots.forEach((dot, idx) => {
      dot.className = 'dot';
      if (idx < (10 - this.missedCount)) {
        dot.classList.add('active'); // active green
      } else {
        dot.classList.add('missed'); // missed red
      }
    });
  }
}

// Start core system
window.addEventListener('load', () => {
  new GameEngine();
});
