/**
 * AI Classroom Commander Assistant - Core JS
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // Theme Toggle (Dark / Light)
  // ==========================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  themeToggleBtn.addEventListener('click', () => {
    initAudio();
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'light') {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
    
    setTimeout(() => {
      const activeTab = document.querySelector('.tab-btn.active');
      updateTabIndicator(activeTab);
    }, 150);
  });

  // ==========================================
  // Global Setup
  // ==========================================
  const DEFAULT_MAX_SEAT = 30;

  // Web Audio Context Setup
  let audioCtx = null;
  let alarmIntervalId = null;

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // ==========================================
  // Tab Switch Controller
  // ==========================================
  const tabBtns = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.content-panel');
  const tabIndicator = document.querySelector('.tab-indicator');

  function updateTabIndicator(activeBtn) {
    if (!activeBtn) return;
    tabIndicator.style.width = `${activeBtn.offsetWidth}px`;
    tabIndicator.style.transform = `translateX(${activeBtn.offsetLeft - 6}px)`;
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      initAudio();
      
      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(btn.getAttribute('data-tab'));
      if (targetPanel) {
        targetPanel.classList.add('active');
        targetPanel.style.opacity = '0';
        targetPanel.style.transform = 'translateY(12px)';
        setTimeout(() => {
          targetPanel.style.opacity = '1';
          targetPanel.style.transform = 'translateY(0)';
        }, 50);
      }

      updateTabIndicator(btn);
    });
  });

  setTimeout(() => {
    const activeTab = document.querySelector('.tab-btn.active');
    updateTabIndicator(activeTab);
  }, 100);

  window.addEventListener('resize', () => {
    const activeTab = document.querySelector('.tab-btn.active');
    updateTabIndicator(activeTab);
  });

  // ==========================================
  // Classroom Roll Caller Logic (Seats 1 to N)
  // ==========================================
  const textareaNames = document.getElementById('student-names');
  const studentCountBadge = document.getElementById('student-count');
  const btnResetList = document.getElementById('btn-reset-list');
  const btnClearExclude = document.getElementById('btn-clear-exclude');
  const btnStartDraw = document.getElementById('btn-start-draw');
  const drawPlaceholder = document.getElementById('draw-placeholder');
  const drawResult = document.getElementById('draw-result');
  const maxSeatInput = document.getElementById('max-seat-num');
  const excludeWinnersCheckbox = document.getElementById('exclude-winners');
  const excludedChipsContainer = document.getElementById('excluded-chips');
  const excludedCountDisplay = document.getElementById('excluded-count');

  let drawnList = [];

  function generateSeats(maxNum) {
    const seats = [];
    for (let i = 1; i <= maxNum; i++) {
      seats.push(`${i}`);
    }
    return seats;
  }

  function formatName(name) {
    if (/[\u4e00-\u9fa5]/.test(name)) {
      return name;
    }
    if (/\d$/.test(name) || /^\d/.test(name)) {
      return name + ' 號';
    }
    return name;
  }

  function getStudentList() {
    const rawText = textareaNames.value;
    return rawText
      .split(/[\n,，\s]+/)
      .map(name => name.trim().replace(/號$/, ''))
      .filter(name => name.length > 0 && name !== '號');
  }

  function updateStudentCount() {
    const list = getStudentList();
    studentCountBadge.textContent = `${list.length} 人`;
    if (list.length === 0) {
      studentCountBadge.style.borderColor = 'rgba(244, 63, 94, 0.3)';
      studentCountBadge.style.color = 'var(--color-danger)';
      studentCountBadge.style.backgroundColor = 'rgba(244, 63, 94, 0.1)';
    } else {
      studentCountBadge.style.borderColor = 'rgba(59, 130, 246, 0.2)';
      studentCountBadge.style.color = 'var(--color-primary)';
      studentCountBadge.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
    }
  }

  function loadList(namesArray) {
    textareaNames.value = namesArray.join(', ');
    updateStudentCount();
  }

  function updateExcludedUI() {
    excludedChipsContainer.innerHTML = '';
    excludedCountDisplay.textContent = `(${drawnList.length})`;
    
    if (drawnList.length === 0) {
      excludedChipsContainer.textContent = '無';
    } else {
      drawnList.forEach(num => {
        const chip = document.createElement('span');
        chip.className = 'excluded-chip';
        chip.textContent = formatName(num);
        excludedChipsContainer.appendChild(chip);
      });
    }
  }

  function clearDrawnList() {
    drawnList = [];
    updateExcludedUI();
  }

  loadList(generateSeats(DEFAULT_MAX_SEAT));
  clearDrawnList();

  maxSeatInput.addEventListener('input', () => {
    let val = parseInt(maxSeatInput.value, 10);
    if (isNaN(val) || val < 1) val = 1;
    if (val > 100) val = 100;
    
    loadList(generateSeats(val));
    clearDrawnList();
  });

  textareaNames.addEventListener('input', updateStudentCount);

  btnResetList.addEventListener('click', () => {
    initAudio();
    maxSeatInput.value = 30;
    loadList(generateSeats(30));
    clearDrawnList();
  });

  btnClearExclude.addEventListener('click', () => {
    initAudio();
    clearDrawnList();
  });

  let drawIntervalId = null;
  btnStartDraw.addEventListener('click', () => {
    initAudio();
    const allStudents = getStudentList();
    const excludeEnabled = excludeWinnersCheckbox.checked;

    const availableStudents = excludeEnabled
      ? allStudents.filter(name => !drawnList.includes(name))
      : allStudents;
    
    if (availableStudents.length === 0) {
      if (excludeEnabled && drawnList.length > 0 && allStudents.length > 0) {
        alert('所有座號皆已中籤！請先點擊右下方「重設中籤紀錄」。');
      } else {
        alert('請先在名單中設定號碼！');
      }
      return;
    }

    btnStartDraw.disabled = true;
    textareaNames.disabled = true;
    btnResetList.disabled = true;
    btnClearExclude.disabled = true;
    maxSeatInput.disabled = true;

    drawPlaceholder.style.opacity = '0';
    drawResult.classList.remove('winner');
    drawResult.classList.add('rolling');

    let duration = 3000;
    let intervalTime = 60;
    let elapsed = 0;

    drawIntervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * availableStudents.length);
      drawResult.textContent = formatName(availableStudents[randomIndex]);
      elapsed += intervalTime;

      if (elapsed >= duration - 1000) {
        clearInterval(drawIntervalId);
        startSlowingDown(availableStudents, elapsed, duration, intervalTime);
      }
    }, intervalTime);
  });

  function startSlowingDown(availableStudents, elapsed, duration, currentInterval) {
    let delay = currentInterval;
    
    function step() {
      const randomIndex = Math.floor(Math.random() * availableStudents.length);
      drawResult.textContent = formatName(availableStudents[randomIndex]);
      elapsed += delay;
      
      if (elapsed < duration) {
        delay += 40;
        drawIntervalId = setTimeout(step, delay);
      } else {
        finalizeDraw(availableStudents);
      }
    }
    
    drawIntervalId = setTimeout(step, delay);
  }

  function finalizeDraw(availableStudents) {
    clearInterval(drawIntervalId);
    
    const randomIndex = Math.floor(Math.random() * availableStudents.length);
    const winnerName = availableStudents[randomIndex];
    drawResult.textContent = formatName(winnerName);

    drawResult.classList.remove('rolling');
    drawResult.classList.add('winner');

    playWinnerSound();
    triggerConfetti();

    if (excludeWinnersCheckbox.checked) {
      drawnList.push(winnerName);
      updateExcludedUI();
    }

    btnStartDraw.disabled = false;
    textareaNames.disabled = false;
    btnResetList.disabled = false;
    btnClearExclude.disabled = false;
    maxSeatInput.disabled = false;
  }

  // ==========================================
  // Audio Synthesizer (Winner Sound)
  // ==========================================
  function playWinnerSound() {
    if (!audioCtx) return;
    
    const now = audioCtx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    notes.forEach((freq, index) => {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + index * 0.08);
      
      gainNode.gain.setValueAtTime(0, now + index * 0.08);
      gainNode.gain.linearRampToValueAtTime(0.12, now + index * 0.08 + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 0.4);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 0.45);
    });
  }

  // ==========================================
  // Canvas Confetti Effect
  // ==========================================
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationFrameId = null;

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class ConfettiParticle {
    constructor(x, y, vx, vy) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.size = Math.random() * 8 + 6;
      
      const colors = [
        '#ff3b30', '#ff9500', '#ffcc00', '#4cd964', 
        '#5ac8fa', '#007aff', '#5856d6', '#ff2d55', 
        '#a855f7', '#ec4899', '#10b981', '#f59e0b'
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.shape = Math.floor(Math.random() * 3);
      
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 10;
      this.opacity = 1;
      this.gravity = Math.random() * 0.15 + 0.18;
      this.friction = 0.98;
      
      this.wobble = Math.random() * 2 * Math.PI;
      this.wobbleSpeed = Math.random() * 0.05 + 0.02;
    }

    update() {
      this.vx *= this.friction;
      this.vy *= this.friction;
      this.vy += this.gravity;
      
      this.x += this.vx + Math.sin(this.wobble) * 0.5;
      this.y += this.vy;
      
      this.wobble += this.wobbleSpeed;
      this.rotation += this.rotationSpeed;
      
      if (this.vy > 1) {
        this.opacity -= 0.012;
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;

      ctx.beginPath();
      if (this.shape === 0) {
        ctx.arc(0, 0, this.size / 2, 0, 2 * Math.PI);
        ctx.fill();
      } else if (this.shape === 1) {
        ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
      } else {
        ctx.moveTo(0, -this.size / 2);
        ctx.lineTo(this.size / 2, this.size / 2);
        ctx.lineTo(-this.size / 2, this.size / 2);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function triggerConfetti() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    particles = [];

    const w = window.innerWidth;
    const h = window.innerHeight;

    for (let i = 0; i < 90; i++) {
      const angle = (Math.random() * 30 + 30) * Math.PI / 180;
      const speed = Math.random() * 15 + 12;
      particles.push(new ConfettiParticle(
        0, 
        h, 
        Math.cos(angle) * speed, 
        -Math.sin(angle) * speed
      ));
    }

    for (let i = 0; i < 90; i++) {
      const angle = (Math.random() * 30 + 120) * Math.PI / 180;
      const speed = Math.random() * 15 + 12;
      particles.push(new ConfettiParticle(
        w, 
        h, 
        Math.cos(angle) * speed, 
        -Math.sin(angle) * speed
      ));
    }

    animateConfetti();
  }

  function animateConfetti() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach((p, index) => {
      p.update();
      p.draw();

      if (p.opacity <= 0 || p.y > window.innerHeight) {
        particles.splice(index, 1);
      }
    });

    if (particles.length > 0) {
      animationFrameId = requestAnimationFrame(animateConfetti);
    } else {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }


  // ==========================================
  // Practical Countdown Timer Logic
  // ==========================================
  const progressRingBar = document.querySelector('.progress-ring-bar');
  const timerTimeDisplay = document.getElementById('timer-time');
  const timerStatusDisplay = document.getElementById('timer-status');
  const timerCard = document.querySelector('.timer-card');
  const presetChips = document.querySelectorAll('.chip');
  const btnTimerStart = document.getElementById('btn-timer-start');
  const btnTimerStartText = document.getElementById('btn-timer-start-text');
  const btnTimerReset = document.getElementById('btn-timer-reset');
  const iconPlay = document.querySelector('.icon-play');
  const iconPause = document.querySelector('.icon-pause');

  const RING_RADIUS = 120;
  const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
  
  progressRingBar.style.strokeDasharray = `${RING_CIRCUMFERENCE} ${RING_CIRCUMFERENCE}`;
  progressRingBar.style.strokeDashoffset = 0;

  let totalDuration = 180;
  let timeRemaining = 180;
  let timerIntervalId = null;
  let timerActive = false;
  let isTimerFinished = false;

  function updateTimerUI() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const displayMinutes = String(minutes).padStart(2, '0');
    const displaySeconds = String(seconds).padStart(2, '0');
    timerTimeDisplay.textContent = `${displayMinutes}:${displaySeconds}`;

    if (totalDuration > 0) {
      const percentage = timeRemaining / totalDuration;
      const offset = RING_CIRCUMFERENCE - (percentage * RING_CIRCUMFERENCE);
      progressRingBar.style.strokeDashoffset = offset;
    } else {
      progressRingBar.style.strokeDashoffset = RING_CIRCUMFERENCE;
    }
  }

  function setTimerTime(seconds, updatePresetChips = true) {
    stopTimerInterval();
    stopAlarmSound();
    
    totalDuration = seconds;
    timeRemaining = seconds;
    timerActive = false;
    isTimerFinished = false;

    timerCard.classList.remove('alarm-active');
    timerStatusDisplay.textContent = '已就緒';
    btnTimerStartText.textContent = '開始';
    iconPlay.style.display = 'inline-block';
    iconPause.style.display = 'none';
    
    updateTimerUI();

    if (updatePresetChips) {
      presetChips.forEach(chip => {
        if (parseInt(chip.getAttribute('data-time'), 10) === seconds) {
          chip.classList.add('active');
        } else {
          chip.classList.remove('active');
        }
      });
    }
  }

  function startTimerInterval() {
    if (timerIntervalId) return;
    
    timerStatusDisplay.textContent = '計時中';
    btnTimerStartText.textContent = '暫停';
    iconPlay.style.display = 'none';
    iconPause.style.display = 'inline-block';
    timerActive = true;

    timerIntervalId = setInterval(() => {
      if (timeRemaining > 0) {
        timeRemaining--;
        updateTimerUI();
      } else {
        handleTimerEnd();
      }
    }, 1000);
  }

  function stopTimerInterval() {
    if (timerIntervalId) {
      clearInterval(timerIntervalId);
      timerIntervalId = null;
    }
    if (timerActive && timeRemaining > 0) {
      timerStatusDisplay.textContent = '已暫停';
    }
    btnTimerStartText.textContent = '開始';
    iconPlay.style.display = 'inline-block';
    iconPause.style.display = 'none';
    timerActive = false;
  }

  function handleTimerEnd() {
    stopTimerInterval();
    isTimerFinished = true;
    timerStatusDisplay.textContent = '時間到！';
    timerCard.classList.add('alarm-active');
    
    startAlarmSound();
  }

  btnTimerStart.addEventListener('click', () => {
    initAudio();
    
    if (isTimerFinished) {
      setTimerTime(totalDuration);
      startTimerInterval();
    } else if (timerActive) {
      stopTimerInterval();
    } else {
      startTimerInterval();
    }
  });

  btnTimerReset.addEventListener('click', () => {
    initAudio();
    setTimerTime(totalDuration);
  });

  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      initAudio();
      const seconds = parseInt(chip.getAttribute('data-time'), 10);
      setTimerTime(seconds);
    });
  });

  setTimerTime(180);

  window.testSetTimer = (seconds) => {
    setTimerTime(seconds, false);
  };

  // ==========================================
  // Alarm Ringtone Synthesizer
  // ==========================================
  function playPeacefulDingDong() {
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.2, now + 0.05);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
    
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    
    osc1.start(now);
    osc1.stop(now + 0.85);

    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(523.25, now + 0.25);
    
    gain2.gain.setValueAtTime(0, now + 0.25);
    gain2.gain.linearRampToValueAtTime(0.25, now + 0.25 + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.25 + 1.2);
    
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    
    osc2.start(now + 0.25);
    osc2.stop(now + 0.25 + 1.25);
  }

  function startAlarmSound() {
    stopAlarmSound();
    playPeacefulDingDong();
    alarmIntervalId = setInterval(() => {
      playPeacefulDingDong();
    }, 2500);
  }

  function stopAlarmSound() {
    if (alarmIntervalId) {
      clearInterval(alarmIntervalId);
      alarmIntervalId = null;
    }
  }
});
