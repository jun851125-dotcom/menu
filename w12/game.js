// ============================================================================
// Canvas roundRect Polyfill for Older Browsers
// ============================================================================
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (typeof r === 'number') {
      r = { tl: r, tr: r, br: r, bl: r };
    } else if (Array.isArray(r)) {
      r = { tl: r[0], tr: r[1] || r[0], br: r[2] || r[0], bl: r[3] || r[1] || r[0] };
    } else {
      r = { tl: r.tl || 0, tr: r.tr || 0, br: r.br || 0, bl: r.bl || 0 };
    }
    this.beginPath();
    this.moveTo(x + r.tl, y);
    this.lineTo(x + w - r.tr, y);
    this.quadraticCurveTo(x + w, y, x + w, y + r.tr);
    this.lineTo(x + w, y + h - r.br);
    this.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
    this.lineTo(x + r.bl, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r.bl);
    this.lineTo(x, y + r.tl);
    this.quadraticCurveTo(x, y, x, y + r.tl);
    this.closePath();
    return this;
  };
}

// ============================================================================
// CyberBreak - Procedural Chiptune Sequencer for BGM
// ============================================================================
class BGMPlayer {
  constructor(audioCtx) {
    this.ctx = audioCtx;
    this.isPlaying = false;
    this.schedulerId = null;
    this.currentStep = 0;
    this.bpm = 115;
    this.stepDuration = 60 / this.bpm / 2; // eighth notes
    this.nextNoteTime = 0.0;
    
    // E-minor retro cyberpunk bassline: E2 (82.41), G2 (98.00), A2 (110.00), C2 (65.41), D2 (73.42)
    this.bassline = [
      82.41, 82.41, 98.00, 98.00, 110.00, 110.00, 82.41, 82.41,
      65.41, 65.41, 73.42, 73.42, 82.41,  82.41,  82.41,  82.41
    ];
    
    // Ambient retro lead melody notes
    this.melody = [
      329.63, 392.00, 493.88, 392.00, 440.00, 523.25, 440.00, 392.00,
      261.63, 329.63, 392.00, 329.63, 293.66, 369.99, 440.00, 369.99
    ];
  }

  start() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.currentStep = 0;
    this.nextNoteTime = this.ctx.currentTime;
    this.scheduler();
  }

  stop() {
    this.isPlaying = false;
    if (this.schedulerId) {
      clearTimeout(this.schedulerId);
      this.schedulerId = null;
    }
  }

  scheduler() {
    if (!this.isPlaying) return;
    
    while (this.nextNoteTime < this.ctx.currentTime + 0.1) {
      this.scheduleNote(this.currentStep, this.nextNoteTime);
      this.advanceStep();
    }
    
    this.schedulerId = setTimeout(() => this.scheduler(), 30);
  }

  advanceStep() {
    this.currentStep = (this.currentStep + 1) % 16;
    this.nextNoteTime += this.stepDuration;
  }

  scheduleNote(step, time) {
    const bassFreq = this.bassline[step];
    if (bassFreq > 0) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(bassFreq, time);
      
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.08, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, time + this.stepDuration - 0.02);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(time);
      osc.stop(time + this.stepDuration);
    }

    if (step % 2 === 0 && Math.random() < 0.8) {
      const melFreq = this.melody[step];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(melFreq, time);
      
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.015, time + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.18);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(time);
      osc.stop(time + 0.18);
    }
  }
}

// ============================================================================
// CyberBreak - Web Audio procedural sound synthesizer
// ============================================================================
class SoundGenerator {
  constructor() {
    this.ctx = null;
    this.bgm = null;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.bgm = new BGMPlayer(this.ctx);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playPaddleHit() {
    this.init();
    if (!this.ctx) return;
    
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
    
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  playBrickHit(toughness) {
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'square';
    // Higher pitches for lighter bricks, deeper crash for heavy bricks
    const baseFreq = toughness === 4 ? 80 : (400 - (toughness * 80));
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.12);
    
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  playPowerUpSpawn() {
    this.init();
    if (!this.ctx) return;
    
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.linearRampToValueAtTime(600, now + 0.15);
    
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  playPowerUpCollect() {
    this.init();
    if (!this.ctx) return;
    
    const now = this.ctx.currentTime;
    
    // Play a satisfying three-note chord
    const playNote = (freq, delay, duration) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);
      
      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(0.12, now + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + delay);
      osc.stop(now + delay + duration);
    };

    playNote(261.63, 0, 0.2); // C4
    playNote(329.63, 0.06, 0.22); // E4
    playNote(392.00, 0.12, 0.25); // G4
    playNote(523.25, 0.18, 0.3); // C5
  }

  playLoseLife() {
    this.init();
    if (!this.ctx) return;
    
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.4);
    
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
  }

  playWin() {
    this.init();
    if (!this.ctx) return;
    
    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      
      gain.gain.setValueAtTime(0.08, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.3);
    });
  }

  playGameOver() {
    this.init();
    if (!this.ctx) return;
    
    const now = this.ctx.currentTime;
    
    const playBassNote = (freq, startOffset, duration) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + startOffset);
      osc.frequency.linearRampToValueAtTime(freq - 20, now + startOffset + duration);
      
      gain.gain.setValueAtTime(0.12, now + startOffset);
      gain.gain.linearRampToValueAtTime(0.001, now + startOffset + duration);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + startOffset);
      osc.stop(now + startOffset + duration);
    };

    playBassNote(180, 0, 0.25);
    playBassNote(150, 0.2, 0.25);
    playBassNote(120, 0.4, 0.3);
    playBassNote(90, 0.7, 0.65);
  }
}

const sound = new SoundGenerator();

// ============================================================================
// Space Starfield System (Background Parallax)
// ============================================================================
class Starfield {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.resize();
    this.initStars();
    
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initStars() {
    const numStars = 100;
    this.stars = [];
    for (let i = 0; i < numStars; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.3 + 0.05,
        color: this.getRandomColor()
      });
    }
  }

  getRandomColor() {
    const colors = [
      'rgba(0, 240, 255, 0.6)',  // Neon cyan
      'rgba(255, 0, 127, 0.6)',  // Neon magenta
      'rgba(255, 255, 255, 0.7)', // White
      'rgba(176, 38, 255, 0.5)'  // Neon purple
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.stars.forEach(star => {
      star.y += star.speed;
      if (star.y > this.canvas.height) {
        star.y = 0;
        star.x = Math.random() * this.canvas.width;
      }
    });
  }

  draw() {
    this.ctx.fillStyle = 'rgba(5, 5, 8, 0.3)'; // Trail effect
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.stars.forEach(star => {
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      this.ctx.fillStyle = star.color;
      this.ctx.shadowBlur = star.size * 2;
      this.ctx.shadowColor = star.color;
      this.ctx.fill();
    });
    // Reset shadow
    this.ctx.shadowBlur = 0;
  }
}

// ============================================================================
// Particle System
// ============================================================================
class Particle {
  constructor(x, y, color, size, isFlame = false) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size || Math.random() * 4 + 2;
    this.vx = (Math.random() - 0.5) * (isFlame ? 2 : 6);
    this.vy = isFlame ? (Math.random() * 2 + 1) : (Math.random() - 0.5) * 6; // Flames float up/drift back
    this.alpha = 1;
    this.decay = Math.random() * 0.02 + 0.015;
    this.gravity = isFlame ? -0.05 : 0.08;
    this.isFlame = isFlame;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.alpha -= this.decay;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    
    // Add glow
    ctx.shadowBlur = this.isFlame ? 12 : 8;
    ctx.shadowColor = this.color;
    ctx.fill();
    ctx.restore();
  }
}

// ============================================================================
// Power-Up Capsule Class
// ============================================================================
class PowerUp {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.width = 24;
    this.height = 14;
    this.type = type; // 'lengthen', 'shorten', 'faster', 'slower', 'fireball'
    this.vy = 2.2;
    this.pulse = 0;
  }

  update() {
    this.y += this.vy;
    this.pulse += 0.1;
  }

  getStyle() {
    switch (this.type) {
      case 'lengthen': return { color: '#39ff14', text: '🌟', shadow: 'rgba(57, 255, 20, 0.8)' };
      case 'shorten':  return { color: '#ff3131', text: '💀', shadow: 'rgba(255, 49, 49, 0.8)' };
      case 'faster':   return { color: '#ffdf00', text: '⚡', shadow: 'rgba(255, 223, 0, 0.8)' };
      case 'slower':   return { color: '#00f0ff', text: '❄️', shadow: 'rgba(0, 240, 255, 0.8)' };
      case 'fireball': return { color: '#b026ff', text: '🔥', shadow: 'rgba(176, 38, 255, 0.8)' };
    }
  }

  draw(ctx) {
    const style = this.getStyle();
    ctx.save();
    
    // Capsule Shape
    const pulseRadius = 2 * Math.sin(this.pulse);
    ctx.shadowBlur = 10 + pulseRadius * 2;
    ctx.shadowColor = style.color;
    
    ctx.fillStyle = 'rgba(13, 14, 24, 0.9)';
    ctx.strokeStyle = style.color;
    ctx.lineWidth = 2;
    
    // Draw rounded capsule
    ctx.beginPath();
    ctx.roundRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height, 8);
    ctx.fill();
    ctx.stroke();
    
    // Symbol icon inside capsule
    ctx.shadowBlur = 0;
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(style.text, this.x, this.y + 0.5);
    
    ctx.restore();
  }
}

// ============================================================================
// Levels Data & Configuration
// ============================================================================
const LEVELS = [
  // Level 1: Standard structured grid (7 rows)
  {
    layout: [
      [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]
  },
  // Level 2: Alternate blocks and unbreakable steel bricks (type 4) (7 rows)
  {
    layout: [
      [4, 4, 0, 0, 4, 4, 0, 0, 4, 4],
      [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      [2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
      [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      [4, 4, 0, 0, 4, 4, 0, 0, 4, 4]
    ]
  },
  // Level 3: Space Invader pattern expanded (7 rows)
  {
    layout: [
      [0, 0, 0, 3, 3, 3, 3, 0, 0, 0],
      [0, 0, 3, 2, 2, 2, 2, 3, 0, 0],
      [0, 3, 2, 1, 4, 4, 1, 2, 3, 0],
      [3, 2, 1, 1, 1, 1, 1, 1, 2, 3],
      [0, 3, 2, 1, 4, 4, 1, 2, 3, 0],
      [0, 0, 3, 2, 2, 2, 2, 3, 0, 0],
      [0, 0, 0, 3, 3, 3, 3, 0, 0, 0]
    ]
  },
  // Level 4: The Fortress (7 rows)
  {
    layout: [
      [4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      [3, 2, 3, 2, 3, 2, 3, 2, 3, 2],
      [3, 3, 3, 3, 0, 0, 3, 3, 3, 3],
      [4, 1, 4, 1, 4, 1, 4, 1, 4, 1],
      [2, 2, 2, 2, 0, 0, 2, 2, 2, 2],
      [3, 2, 3, 2, 3, 2, 3, 2, 3, 2],
      [4, 4, 4, 4, 4, 4, 4, 4, 4, 4]
    ]
  }
];

// Brick formatting dictionary
const BRICK_THEMES = {
  1: { name: 'Normal', hp: 1, baseColor: '#00f0ff', glow: 'rgba(0, 240, 255, 0.6)' },
  2: { name: 'Double', hp: 2, baseColor: '#ffdf00', glow: 'rgba(255, 223, 0, 0.6)' },
  3: { name: 'Hard', hp: 3, baseColor: '#ff007f', glow: 'rgba(255, 0, 127, 0.6)' },
  4: { name: 'Steel', hp: 999, baseColor: '#a1a8c2', glow: 'rgba(161, 168, 194, 0.5)' } // Breaks only with Fireball
};

// ============================================================================
// Core Game Engine
// ============================================================================
class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Core game state
    this.state = 'MENU'; // MENU, PLAYING, LEVEL_WIN, GAME_OVER, VICTORY, PAUSED
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('cyberbreak_high') || '0', 10);
    this.level = 0;
    this.lives = 3;
    
    // Game elements
    this.paddle = {
      x: 0,
      y: 0,
      width: 100,
      baseWidth: 100,
      targetWidth: 100,
      height: 12,
      speed: 8
    };
    
    this.ball = {
      x: 0,
      y: 0,
      radius: 8,
      vx: 0,
      vy: 0,
      speed: 4.0,
      baseSpeed: 4.0,
      isAttached: true
    };
    
    this.bricks = [];
    this.powerUps = [];
    this.particles = [];
    
    // Control status
    this.keys = {
      ArrowLeft: false,
      ArrowRight: false
    };
    this.mouseX = null;
    
    // Active power-up timers
    this.activePowerUps = {
      lengthen: { duration: 10000, timer: 0 },
      shorten: { duration: 10000, timer: 0 },
      faster: { duration: 10000, timer: 0 },
      slower: { duration: 10000, timer: 0 },
      fireball: { duration: 8000, timer: 0 }
    };
    
    this.lastTime = 0;
    
    // Set up inputs and elements
    this.initEvents();
    this.updateHUD();
  }

  initEvents() {
    // Keyboard input listeners
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') this.keys.ArrowLeft = true;
      if (e.key === 'ArrowRight' || e.key === 'd') this.keys.ArrowRight = true;
      
      if (e.key === ' ' && this.state === 'PLAYING' && this.ball.isAttached) {
        this.releaseBall();
      }
      
      if (e.key === 'Escape') {
        this.togglePause();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') this.keys.ArrowLeft = false;
      if (e.key === 'ArrowRight' || e.key === 'd') this.keys.ArrowRight = false;
    });

    // Mouse movement listener on Canvas viewport
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      this.mouseX = (e.clientX - rect.left) * scaleX;
    });

    // Mouse click to release ball
    this.canvas.addEventListener('click', () => {
      if (this.state === 'PLAYING' && this.ball.isAttached) {
        this.releaseBall();
      }
    });

    // Hook up screen buttons
    document.getElementById('start-btn').addEventListener('click', () => this.startGame());
    document.getElementById('restart-btn').addEventListener('click', () => this.startGame());
    document.getElementById('victory-restart-btn').addEventListener('click', () => this.startGame());
    document.getElementById('next-level-btn').addEventListener('click', () => this.nextLevel());
  }

  startGame() {
    sound.init();
    if (sound.bgm) sound.bgm.start();
    this.score = 0;
    this.lives = 3;
    this.level = 0;
    this.resetActivePowerups();
    this.loadLevel();
    this.state = 'PLAYING';
    this.hideAllOverlays();
  }

  nextLevel() {
    sound.init();
    this.level++;
    if (this.level >= LEVELS.length) {
      this.state = 'VICTORY';
      sound.playWin();
      if (sound.bgm) sound.bgm.stop();
      this.showOverlay('victory-screen');
      document.getElementById('victory-score').textContent = this.score.toString().padStart(5, '0');
    } else {
      if (sound.bgm) sound.bgm.start();
      this.resetActivePowerups();
      this.loadLevel();
      this.state = 'PLAYING';
      this.hideAllOverlays();
    }
  }

  loadLevel() {
    const lvl = LEVELS[this.level];
    this.bricks = [];
    this.powerUps = [];
    this.particles = [];
    
    // Layout geometry parameters
    const startY = 60;
    const padding = 6;
    const cols = 10;
    const brickWidth = (this.canvas.width - (padding * (cols + 1))) / cols;
    const brickHeight = 22;

    for (let r = 0; r < lvl.layout.length; r++) {
      for (let c = 0; c < lvl.layout[r].length; c++) {
        const type = lvl.layout[r][c];
        if (type > 0) {
          const theme = BRICK_THEMES[type];
          this.bricks.push({
            id: `b_${r}_${c}`,
            x: padding + c * (brickWidth + padding),
            y: startY + r * (brickHeight + padding),
            width: brickWidth,
            height: brickHeight,
            type: type,
            hp: theme.hp,
            maxHp: theme.hp,
            theme: theme
          });
        }
      }
    }
    
    this.resetRound();
    this.updateHUD();
  }

  resetRound() {
    // Reset paddle position
    this.paddle.x = this.canvas.width / 2 - this.paddle.width / 2;
    this.paddle.y = this.canvas.height - 35;
    
    // Lock ball on paddle
    this.ball.isAttached = true;
    this.ball.vx = 0;
    this.ball.vy = 0;
    this.updateBallPositionAttached();
  }

  releaseBall() {
    this.ball.isAttached = false;
    // Shoot upward at an angle
    const angle = -Math.PI / 3 - (Math.random() * Math.PI / 6); // Range roughly -60deg to -90deg
    const speed = this.getCurrentBallSpeed();
    this.ball.vx = speed * Math.cos(angle);
    this.ball.vy = speed * Math.sin(angle);
    sound.playPaddleHit();
  }

  updateBallPositionAttached() {
    this.ball.x = this.paddle.x + this.paddle.width / 2;
    this.ball.y = this.paddle.y - this.ball.radius - 2;
  }

  getCurrentBallSpeed() {
    let speedMultiplier = 1.0;
    if (this.activePowerUps.faster.timer > 0) speedMultiplier *= 1.35;
    if (this.activePowerUps.slower.timer > 0) speedMultiplier *= 0.70;
    return this.ball.baseSpeed * speedMultiplier;
  }

  resetActivePowerups() {
    Object.keys(this.activePowerUps).forEach(key => {
      this.activePowerUps[key].timer = 0;
    });
    this.paddle.width = this.paddle.baseWidth;
    this.paddle.targetWidth = this.paddle.baseWidth;
  }

  applyPowerUp(type) {
    sound.playPowerUpCollect();
    
    // Clear competing buffs/debuffs
    if (type === 'lengthen') this.activePowerUps.shorten.timer = 0;
    if (type === 'shorten') this.activePowerUps.lengthen.timer = 0;
    if (type === 'faster') this.activePowerUps.slower.timer = 0;
    if (type === 'slower') this.activePowerUps.faster.timer = 0;

    // Refresh duration
    const power = this.activePowerUps[type];
    power.timer = power.duration;
    
    this.updatePowerUpStatsUI();
  }

  updatePowerUpTimers(deltaTime) {
    let statsChanged = false;
    Object.keys(this.activePowerUps).forEach(key => {
      const p = this.activePowerUps[key];
      if (p.timer > 0) {
        p.timer -= deltaTime;
        if (p.timer <= 0) {
          p.timer = 0;
          statsChanged = true;
        }
      }
    });

    // Update paddle widths based on status
    if (this.activePowerUps.lengthen.timer > 0) {
      this.paddle.targetWidth = this.paddle.baseWidth * 1.45;
    } else if (this.activePowerUps.shorten.timer > 0) {
      this.paddle.targetWidth = this.paddle.baseWidth * 0.65;
    } else {
      this.paddle.targetWidth = this.paddle.baseWidth;
    }

    // Smooth lerp size adjustment for premium aesthetics
    if (Math.abs(this.paddle.width - this.paddle.targetWidth) > 0.5) {
      const diff = this.paddle.targetWidth - this.paddle.width;
      this.paddle.width += diff * 0.15; // Smooth resize lerp
    } else {
      this.paddle.width = this.paddle.targetWidth;
    }

    if (statsChanged) {
      this.updatePowerUpStatsUI();
    }
  }

  updatePowerUpStatsUI() {
    const container = document.getElementById('powerup-status-container');
    container.innerHTML = '';

    const labels = {
      lengthen: { name: '球拍加長', emoji: '🌟', cssClass: 'p-active-lengthen' },
      shorten: { name: '球拍變短', emoji: '💀', cssClass: 'p-active-shorten' },
      faster: { name: '球速變快', emoji: '⚡', cssClass: 'p-active-faster' },
      slower: { name: '球速變慢', emoji: '❄️', cssClass: 'p-active-slower' },
      fireball: { name: '終極火球', emoji: '🔥', cssClass: 'p-active-fireball' }
    };

    Object.keys(this.activePowerUps).forEach(key => {
      const p = this.activePowerUps[key];
      if (p.timer > 0) {
        const item = document.createElement('div');
        item.className = `powerup-status-item ${labels[key].cssClass}`;
        
        const pct = (p.timer / p.duration) * 100;
        
        item.innerHTML = `
          <div class="item-icon">${labels[key].emoji}</div>
          <div class="item-name">${labels[key].name}</div>
          <div class="bar-container">
            <div class="bar-fill" style="width: ${pct}%"></div>
          </div>
        `;
        container.appendChild(item);
      }
    });
  }

  // ============================================================================
  // Collision Physics
  // ============================================================================
  handleCollisions() {
    if (this.ball.isAttached) return;

    const ball = this.ball;
    const r = ball.radius;

    // Wall reflections: Left/Right walls
    if (ball.x - r < 0) {
      ball.x = r;
      ball.vx = -ball.vx;
      sound.playPaddleHit();
      this.spawnSparks(0, ball.y, 'rgba(0, 240, 255, 0.8)', 5);
    } else if (ball.x + r > this.canvas.width) {
      ball.x = this.canvas.width - r;
      ball.vx = -ball.vx;
      sound.playPaddleHit();
      this.spawnSparks(this.canvas.width, ball.y, 'rgba(0, 240, 255, 0.8)', 5);
    }

    // Top wall reflection
    if (ball.y - r < 0) {
      ball.y = r;
      ball.vy = -ball.vy;
      sound.playPaddleHit();
      this.spawnSparks(ball.x, 0, 'rgba(0, 240, 255, 0.8)', 5);
    }

    // Bottom boundary (Lose life)
    if (ball.y - r > this.canvas.height) {
      this.handleLoseLife();
      return;
    }

    // Paddle hit reflection
    const p = this.paddle;
    if (ball.x + r > p.x && ball.x - r < p.x + p.width &&
        ball.y + r > p.y && ball.y - r < p.y + p.height) {
      
      // Make sure ball is moving downwards to avoid sticking to paddle sides
      if (ball.vy > 0) {
        ball.y = p.y - r;
        
        // Dynamic reflection angle: depending on where the ball hits the paddle
        const relativeHitPoint = (ball.x - (p.x + p.width / 2)) / (p.width / 2); // Range -1 to 1
        const maxAngle = Math.PI / 3; // Max reflection 60 deg
        const angle = relativeHitPoint * maxAngle - Math.PI / 2; // Centralized upward
        
        const speed = this.getCurrentBallSpeed();
        ball.vx = speed * Math.cos(angle);
        ball.vy = speed * Math.sin(angle);
        
        sound.playPaddleHit();
        this.spawnSparks(ball.x, p.y, 'rgba(255, 0, 127, 0.9)', 8);
      }
    }

    // Brick Collisions
    const isFireball = this.activePowerUps.fireball.timer > 0;
    
    for (let i = this.bricks.length - 1; i >= 0; i--) {
      const b = this.bricks[i];
      
      // Check intersection
      const closestX = Math.max(b.x, Math.min(ball.x, b.x + b.width));
      const closestY = Math.max(b.y, Math.min(ball.y, b.y + b.height));
      const distSq = (ball.x - closestX) ** 2 + (ball.y - closestY) ** 2;

      if (distSq < r ** 2) {
        // Collided!
        this.damageBrick(b, i, isFireball);

        if (!isFireball) {
          // Bounce mathematics for standard ball:
          // Determine side of collision
          const overlapX = r - Math.abs(ball.x - closestX);
          const overlapY = r - Math.abs(ball.y - closestY);

          // Bounce back on narrower overlap side
          if (overlapX < overlapY) {
            ball.vx = ball.x < closestX ? -Math.abs(ball.vx) : Math.abs(ball.vx);
          } else {
            ball.vy = ball.y < closestY ? -Math.abs(ball.vy) : Math.abs(ball.vy);
          }
          break; // Process one collision bounce per frame max to prevent glitching
        }
      }
    }
  }

  damageBrick(brick, index, isFireball) {
    if (brick.type === 4 && !isFireball) {
      // Indestructible steel brick: plays low sound, sparks, no damage
      sound.playBrickHit(4);
      this.spawnSparks(this.ball.x, this.ball.y, '#a1a8c2', 6);
      return;
    }

    // Deal damage: fireball destroys instantly (deals max HP), regular deals 1 hp
    const damage = isFireball ? brick.hp : 1;
    brick.hp -= damage;
    this.score += 50 * damage;
    this.updateHUD();

    sound.playBrickHit(brick.type);

    if (brick.hp <= 0) {
      // Create explosion particles
      this.spawnSparks(brick.x + brick.width / 2, brick.y + brick.height / 2, brick.theme.baseColor, 15);
      
      // Roll random capsule drop
      if (Math.random() < 0.33) { // 33% drop rate (increased spawn frequency)
        this.spawnPowerUp(brick.x + brick.width / 2, brick.y + brick.height / 2);
      }

      // Remove from array
      this.bricks.splice(index, 1);
      
      // Level cleared check (ignoring indestructible brick 4, unless fireball broke it)
      const remainingBreakable = this.bricks.filter(b => b.type !== 4);
      if (remainingBreakable.length === 0) {
        this.state = 'LEVEL_WIN';
        sound.playWin();
        this.showOverlay('level-win-screen');
      }
    } else {
      // Cracking debris particles
      this.spawnSparks(this.ball.x, this.ball.y, brick.theme.baseColor, 4);
    }
  }

  spawnPowerUp(x, y) {
    const types = ['lengthen', 'shorten', 'faster', 'slower', 'fireball'];
    // Random selector
    const randomType = types[Math.floor(Math.random() * types.length)];
    this.powerUps.push(new PowerUp(x, y, randomType));
    sound.playPowerUpSpawn();
  }

  spawnSparks(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(x, y, color));
    }
  }

  handleLoseLife() {
    this.lives--;
    sound.playLoseLife();
    this.updateHUD();
    
    // Clear negative timers on death
    this.activePowerUps.shorten.timer = 0;
    this.activePowerUps.faster.timer = 0;
    this.updatePowerUpStatsUI();

    if (this.lives <= 0) {
      this.state = 'GAME_OVER';
      sound.playGameOver();
      if (sound.bgm) sound.bgm.stop();
      
      // Check high score
      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem('cyberbreak_high', this.highScore);
      }
      
      this.showOverlay('game-over-screen');
      document.getElementById('game-over-score').textContent = this.score.toString().padStart(5, '0');
    } else {
      this.resetRound();
    }
  }

  // ============================================================================
  // System State updates & game loops
  // ============================================================================
  update(deltaTime) {
    if (this.state !== 'PLAYING') return;

    // 1. Move Paddle (keyboard check / mouse target)
    const p = this.paddle;
    if (this.mouseX !== null) {
      // Target paddle center towards mouse X
      p.x = this.mouseX - p.width / 2;
    } else {
      // Fallback arrows
      if (this.keys.ArrowLeft) p.x -= p.speed;
      if (this.keys.ArrowRight) p.x += p.speed;
    }
    // Clamp to canvas borders
    p.x = Math.max(0, Math.min(this.canvas.width - p.width, p.x));

    // 2. Manage powerup durations
    this.updatePowerUpTimers(deltaTime);

    // 3. Move Ball
    if (this.ball.isAttached) {
      this.updateBallPositionAttached();
    } else {
      // Re-apply speed parameters if modified
      const currentSpeed = this.getCurrentBallSpeed();
      const actualSpeed = Math.sqrt(this.ball.vx ** 2 + this.ball.vy ** 2);
      if (Math.abs(actualSpeed - currentSpeed) > 0.1 && actualSpeed > 0) {
        // Renormalize direction vectors
        this.ball.vx = (this.ball.vx / actualSpeed) * currentSpeed;
        this.ball.vy = (this.ball.vy / actualSpeed) * currentSpeed;
      }
      
      this.ball.x += this.ball.vx;
      this.ball.y += this.ball.vy;
    }

    // 4. Fireball visual trail emitter
    if (this.activePowerUps.fireball.timer > 0 && !this.ball.isAttached) {
      // Flame particles trailing the ball
      const colors = ['#b026ff', '#ff007f', '#ffdf00'];
      const c = colors[Math.floor(Math.random() * colors.length)];
      this.particles.push(new Particle(this.ball.x, this.ball.y, c, Math.random() * 5 + 3, true));
    }

    // 5. Update Falling Power-up Capsules
    for (let i = this.powerUps.length - 1; i >= 0; i--) {
      const u = this.powerUps[i];
      u.update();
      
      // Hitbox intersection with paddle
      if (u.y + u.height / 2 > p.y && u.y - u.height / 2 < p.y + p.height &&
          u.x + u.width / 2 > p.x && u.x - u.width / 2 < p.x + p.width) {
        this.applyPowerUp(u.type);
        this.powerUps.splice(i, 1);
        continue;
      }

      // Out of bounds drop
      if (u.y > this.canvas.height) {
        this.powerUps.splice(i, 1);
      }
    }

    // 6. Physics Collision Solver
    this.handleCollisions();

    // 7. Update Spark particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const part = this.particles[i];
      part.update();
      if (part.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  // ============================================================================
  // Visual Canvas Rendering
  // ============================================================================
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw Bricks
    this.bricks.forEach(b => {
      const pctHP = b.hp / b.maxHp;
      this.ctx.save();
      
      // Shadow glow
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = b.theme.glow;
      
      // Draw neon border brick
      const grad = this.ctx.createLinearGradient(b.x, b.y, b.x, b.y + b.height);
      grad.addColorStop(0, b.theme.baseColor);
      grad.addColorStop(1, 'rgba(10, 11, 20, 0.95)');
      this.ctx.fillStyle = grad;
      this.ctx.strokeStyle = b.theme.baseColor;
      this.ctx.lineWidth = 1.5;
      
      this.ctx.beginPath();
      this.ctx.roundRect(b.x, b.y, b.width, b.height, 4);
      this.ctx.fill();
      this.ctx.stroke();

      // HP status lines/cracks indicators
      if (b.hp < b.maxHp && b.type !== 4) {
        this.ctx.shadowBlur = 0;
        this.ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        this.ctx.lineWidth = 1;
        // Simple randomized visual crack lines based on ID seeds
        const seed = b.id.charCodeAt(2) + b.id.charCodeAt(4);
        this.ctx.beginPath();
        if (seed % 2 === 0) {
          this.ctx.moveTo(b.x + b.width*0.2, b.y);
          this.ctx.lineTo(b.x + b.width*0.4, b.y + b.height*0.6);
          this.ctx.lineTo(b.x + b.width*0.55, b.y + b.height);
        } else {
          this.ctx.moveTo(b.x + b.width*0.8, b.y);
          this.ctx.lineTo(b.x + b.width*0.6, b.y + b.height*0.5);
          this.ctx.lineTo(b.x + b.width*0.4, b.y + b.height);
        }
        this.ctx.stroke();
      }
      
      this.ctx.restore();
    });

    // Draw Power-ups falling
    this.powerUps.forEach(u => u.draw(this.ctx));

    // Draw Particles
    this.particles.forEach(p => p.draw(this.ctx));

    // Draw Paddle (Neon Cylinder/Capsule)
    const p = this.paddle;
    this.ctx.save();
    
    // Choose paddle glow color based on active buffs
    let padColor = '#ff007f'; // Base Magenta
    if (this.activePowerUps.lengthen.timer > 0) padColor = '#39ff14'; // Green
    if (this.activePowerUps.shorten.timer > 0) padColor = '#ff3131'; // Red
    
    this.ctx.shadowBlur = 15;
    this.ctx.shadowColor = padColor;
    this.ctx.strokeStyle = padColor;
    this.ctx.lineWidth = 2.5;
    
    const padGrad = this.ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.height);
    padGrad.addColorStop(0, '#fff');
    padGrad.addColorStop(0.3, padColor);
    padGrad.addColorStop(1, '#05050a');
    this.ctx.fillStyle = padGrad;
    
    this.ctx.beginPath();
    ctxRoundArc(this.ctx, p.x, p.y, p.width, p.height, p.height/2);
    this.ctx.fill();
    this.ctx.stroke();
    
    this.ctx.restore();

    // Draw Ball
    const ball = this.ball;
    this.ctx.save();
    
    const isFireball = this.activePowerUps.fireball.timer > 0;
    
    if (isFireball) {
      // Fireball style
      this.ctx.shadowBlur = 20;
      this.ctx.shadowColor = '#b026ff'; // purple aura
      
      const fireGrad = this.ctx.createRadialGradient(ball.x, ball.y, 1, ball.x, ball.y, ball.radius);
      fireGrad.addColorStop(0, '#ffffff');
      fireGrad.addColorStop(0.3, '#ffdf00'); // yellow
      fireGrad.addColorStop(0.6, '#ff007f'); // magenta
      fireGrad.addColorStop(1, '#b026ff'); // purple
      this.ctx.fillStyle = fireGrad;
    } else {
      // Standard glowing sphere
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = '#00f0ff'; // Cyan glow
      
      const ballGrad = this.ctx.createRadialGradient(ball.x - 2, ball.y - 2, 1, ball.x, ball.y, ball.radius);
      ballGrad.addColorStop(0, '#ffffff');
      ballGrad.addColorStop(0.5, '#00f0ff');
      ballGrad.addColorStop(1, '#005f7a');
      this.ctx.fillStyle = ballGrad;
    }
    
    this.ctx.beginPath();
    this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  // ============================================================================
  // Overlay display routines
  // ============================================================================
  showOverlay(id) {
    this.hideAllOverlays();
    document.getElementById(id).classList.add('active');
  }

  hideAllOverlays() {
    const overlays = document.querySelectorAll('.screen-overlay');
    overlays.forEach(o => o.classList.remove('active'));
  }

  togglePause() {
    if (this.state === 'PLAYING') {
      this.state = 'PAUSED';
      if (sound.bgm) sound.bgm.stop();
      // Draw static PAUSED indicator on canvas
      this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
      this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
      this.ctx.font = '32px Orbitron';
      this.ctx.fillStyle = '#fff';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
    } else if (this.state === 'PAUSED') {
      this.state = 'PLAYING';
      if (sound.bgm) sound.bgm.start();
    }
  }

  updateHUD() {
    document.getElementById('level-val').textContent = (this.level + 1).toString();
    document.getElementById('score-val').textContent = this.score.toString().padStart(5, '0');
    document.getElementById('high-score-val').textContent = this.highScore.toString().padStart(5, '0');
    
    // Lives renderer with hearts
    const livesDiv = document.getElementById('lives-container');
    livesDiv.innerHTML = '';
    
    for (let i = 0; i < 3; i++) {
      const heart = document.createElement('svg');
      heart.setAttribute('viewBox', '0 0 24 24');
      heart.classList.add('heart-icon');
      if (i >= this.lives) {
        heart.classList.add('lost');
      }
      heart.innerHTML = `<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>`;
      livesDiv.appendChild(heart);
    }
  }
}

// Canvas rounded capsules helper
function ctxRoundArc(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// ============================================================================
// Initialization loop
// ============================================================================
window.addEventListener('load', () => {
  const bg = new Starfield('bg-canvas');
  const game = new Game();

  let lastTime = performance.now();

  function gameLoop(now) {
    const deltaTime = now - lastTime;
    lastTime = now;

    // Always update and render starfield background
    bg.update();
    bg.draw();

    // Game updates
    game.update(deltaTime);
    if (game.state === 'PLAYING') {
      game.draw();
    }

    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
});
