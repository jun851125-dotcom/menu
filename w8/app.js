// Game Database - Junior & Senior High Level Brazilian Portuguese Vocab & Sentences
const gameData = {
  levels: [
    {
      id: 1,
      name: "Saudações e Números (問候與數字)",
      description: "學會基本的巴西葡萄牙語問候與年齡表達！",
      icon: "👋",
      items: [
        {
          id: "l1_1",
          portuguese: "Bom dia! Como você está?",
          translation: "早上好！你怎麼樣？",
          example: "Bom dia! Como você está? - Tudo bem, e você?",
          english: "Good morning! How are you?",
          type: "sentence"
        },
        {
          id: "l1_2",
          portuguese: "Muito prazer em conhecê-lo.",
          translation: "很高興認識你。",
          example: "Oi, meu nome é Lico. Muito prazer em conhecê-lo.",
          english: "Nice to meet you.",
          type: "sentence"
        },
        {
          id: "l1_3",
          portuguese: "Tudo bem, obrigado.",
          translation: "一切都好，謝謝。",
          example: "Como vai? - Tudo bem, obrigado.",
          english: "Everything is fine, thank you.",
          type: "sentence"
        },
        {
          id: "l1_4",
          portuguese: "Eu tenho quinze anos.",
          translation: "我十五歲。",
          example: "Eu sou estudante e tenho quinze anos.",
          english: "I am fifteen years old.",
          type: "sentence"
        },
        {
          id: "l1_5",
          portuguese: "Obrigado pela sua ajuda.",
          translation: "謝謝你的幫忙。",
          example: "Obrigado pela sua ajuda com a lição.",
          english: "Thank you for your help.",
          type: "sentence"
        }
      ]
    },
    {
      id: 2,
      name: "Na Escola (在學校)",
      description: "課堂常用物品、學科與日常生活對話。",
      icon: "🎒",
      items: [
        {
          id: "l2_1",
          portuguese: "Onde fica a biblioteca?",
          translation: "圖書館在哪裡？",
          example: "Com licença, onde fica a biblioteca da escola?",
          english: "Where is the library?",
          type: "sentence"
        },
        {
          id: "l2_2",
          portuguese: "Eu gosto de estudar matemática.",
          translation: "我喜歡讀數學。",
          example: "Eu gosto de estudar matemática e ciências.",
          english: "I like studying math.",
          type: "sentence"
        },
        {
          id: "l2_3",
          portuguese: "Você pode me emprestar uma caneta?",
          translation: "你能借我一支筆嗎？",
          example: "Esqueci meu estojo. Você pode me emprestar uma caneta?",
          english: "Can you lend me a pen?",
          type: "sentence"
        },
        {
          id: "l2_4",
          portuguese: "Precisamos fazer o dever de casa.",
          translation: "我們需要做功課。",
          example: "Hoje nós precisamos fazer o dever de casa juntos.",
          english: "We need to do homework.",
          type: "sentence"
        },
        {
          id: "l2_5",
          portuguese: "Amanhã temos prova de história.",
          translation: "明天我們有歷史考試。",
          example: "Estude bastante, amanhã temos prova de história.",
          english: "Tomorrow we have a history exam.",
          type: "sentence"
        }
      ]
    },
    {
      id: 3,
      name: "Hobbies e Rotina (愛好與作息)",
      description: "描述日常生活、週末活動與休閒娛樂。",
      icon: "⚽",
      items: [
        {
          id: "l3_1",
          portuguese: "Eu pratico esportes no fim de semana.",
          translation: "我在週末做運動。",
          example: "Eu pratico esportes no fim de semana com meus amigos.",
          english: "I play sports on the weekend.",
          type: "sentence"
        },
        {
          id: "l3_2",
          portuguese: "Qual é o seu passatempo favorito?",
          translation: "你最喜歡的嗜好是什麼？",
          example: "Qual é o seu passatempo favorito? Gosto de desenhar.",
          english: "What is your favorite hobby?",
          type: "sentence"
        },
        {
          id: "l3_3",
          portuguese: "Eu costumo acordar cedo.",
          translation: "我通常很早起床。",
          example: "Eu costumo acordar cedo para ir à escola.",
          english: "I usually wake up early.",
          type: "sentence"
        },
        {
          id: "l3_4",
          portuguese: "Ela adora ouvir música brasileira.",
          translation: "她熱愛聽巴西音樂。",
          example: "Ela adora ouvir música brasileira, especialmente Samba.",
          english: "She loves listening to Brazilian music.",
          type: "sentence"
        },
        {
          id: "l3_5",
          portuguese: "Nós jogamos videogame juntos.",
          translation: "我們一起玩電子遊戲。",
          example: "Nas sextas-feiras, nós jogamos videogame juntos.",
          english: "We play video games together.",
          type: "sentence"
        }
      ]
    },
    {
      id: 4,
      name: "Amigos e Redes Sociais (朋友與社群媒體)",
      description: "巴西青少年的社交用語、網路縮寫與日常聊天。",
      icon: "📱",
      items: [
        {
          id: "l4_1",
          portuguese: "Manda uma mensagem no WhatsApp.",
          translation: "在WhatsApp發個訊息。",
          example: "Qualquer dúvida, manda uma mensagem no WhatsApp.",
          english: "Send a message on WhatsApp.",
          type: "sentence"
        },
        {
          id: "l4_2",
          portuguese: "Vamos tirar uma foto legal.",
          translation: "我們來拍張好看的照片。",
          example: "Esse lugar é lindo! Vamos tirar uma foto legal.",
          english: "Let's take a cool photo.",
          type: "sentence"
        },
        {
          id: "l4_3",
          portuguese: "Eu sigo muitos influenciadores.",
          translation: "我追蹤很多網紅。",
          example: "Eu sigo muitos influenciadores de viagem no Instagram.",
          english: "I follow many influencers.",
          type: "sentence"
        },
        {
          id: "l4_4",
          portuguese: "Valeu pelo convite para a festa!",
          translation: "謝啦，邀請我參加派對！",
          example: "Oi cara! Valeu pelo convite para a festa!",
          english: "Thanks for the party invitation!",
          type: "sentence"
        },
        {
          id: "l4_5",
          portuguese: "Qual é a sua rede social favorita?",
          translation: "你最喜歡的社群媒體是什麼？",
          example: "Estou no TikTok sempre. Qual é a sua rede social favorita?",
          english: "What is your favorite social media?",
          type: "sentence"
        }
      ]
    }
  ],
  shop: [
    { id: "soccer", name: "巴西足球球衣", emoji: "👕", price: 10, targetClass: "soccer-jersey" },
    { id: "sunglasses", name: "酷炫墨鏡", emoji: "🕶️", price: 15, targetClass: "cool-sunglasses" },
    { id: "graduation", name: "學士帽", emoji: "🎓", price: 25, targetClass: "grad-hat" },
    { id: "party", name: "派對帽", emoji: "🥳", price: 8, targetClass: "party-hat" }
  ]
};

// Game State Definition
let state = {
  xp: 0,
  diamonds: 10,
  streak: 0,
  lastPracticeDate: null,
  currentLevelId: 1,
  activeCategoryIndex: null, // Select which category cards to practice
  unlockedCostumes: ["none"],
  activeCostume: "none",
  dailyPracticeCount: 0,
  learnedItems: {}, // tracks which items have been spoken at least once today {itemId: count}
};

// Global variables for playing
let speechRate = 1.0; // Normal rate
let voices = [];
let currentPracticeItemIndex = 0;
let challengeMode = false;
let challengeQuestions = [];
let currentQuestionIndex = 0;
let challengeScore = 0;
let selectedWordsForPuzzle = [];

// Initialize Sound Synthesizer (Web Audio API)
let audioCtx = null;

function initAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playSynthesizedSound(frequencies, duration, type = "sine", gainSequence = null) {
  try {
    initAudioContext();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = type;
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    if (frequencies.length === 1) {
      osc.frequency.setValueAtTime(frequencies[0], now);
    } else {
      // Frequency sweeping / sequence
      osc.frequency.setValueAtTime(frequencies[0], now);
      for (let i = 1; i < frequencies.length; i++) {
        const timeOffset = (duration / (frequencies.length - 1)) * i;
        osc.frequency.setValueAtTime(frequencies[i], now + timeOffset);
      }
    }
    
    if (gainSequence) {
      gainNode.gain.setValueAtTime(gainSequence[0], now);
      for (let i = 1; i < gainSequence.length; i++) {
        const timeOffset = (duration / (gainSequence.length - 1)) * i;
        gainNode.gain.exponentialRampToValueAtTime(gainSequence[i], now + timeOffset);
      }
    } else {
      gainNode.gain.setValueAtTime(0.15, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
    }
    
    osc.start(now);
    osc.stop(now + duration);
  } catch (e) {
    console.warn("Audio synthesis failed:", e);
  }
}

// Sound effects wrapper
function playClickSound() {
  playSynthesizedSound([400, 800], 0.08, "triangle");
}

function playCorrectSound() {
  playSynthesizedSound([523.25, 659.25, 783.99, 1046.50], 0.35, "sine"); // C5-E5-G5-C6 arpeggio
}

function playWrongSound() {
  playSynthesizedSound([150, 110], 0.25, "sawtooth", [0.2, 0.001]);
}

function playLevelUpSound() {
  // Funfare arpeggio
  setTimeout(() => playSynthesizedSound([261.63, 329.63, 392.00, 523.25], 0.2, "square"), 0);
  setTimeout(() => playSynthesizedSound([329.63, 392.00, 523.25, 659.25], 0.2, "square"), 150);
  setTimeout(() => playSynthesizedSound([523.25, 659.25, 783.99, 1046.50], 0.4, "sine"), 300);
}

// Speech Synthesis Setup
function setupSpeech() {
  if ('speechSynthesis' in window) {
    // Populate voice selection
    voices = window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices();
    };
  }
}

// Speak Brazilian Portuguese text
function speakPortuguese(text) {
  if (!('speechSynthesis' in window)) {
    showNotification("瀏覽器不支援發音功能 😢", "error");
    return;
  }
  
  // Cancel any ongoing speeches
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Find a Brazilian Portuguese voice
  const ptVoice = voices.find(v => v.lang.includes("pt-BR") || v.lang.includes("pt_BR"));
  if (ptVoice) {
    utterance.voice = ptVoice;
  } else {
    // Fallback to any Portuguese voice
    const anyPtVoice = voices.find(v => v.lang.startsWith("pt"));
    if (anyPtVoice) {
      utterance.voice = anyPtVoice;
    }
  }
  
  utterance.lang = "pt-BR";
  utterance.rate = speechRate;
  utterance.pitch = 1.1; // Cute high pitch parrot tone!
  
  window.speechSynthesis.speak(utterance);
}

// Mascot Expression and Accessories Control
function updateMascot(expression = "idle") {
  const eyeL = document.getElementById("mascot-eye-l");
  const eyeR = document.getElementById("mascot-eye-r");
  const wingL = document.getElementById("mascot-wing-l");
  const wingR = document.getElementById("mascot-wing-r");
  const mascotBubble = document.getElementById("mascot-bubble");
  const container = document.querySelector(".mascot-container");
  
  // Clean classes
  container.classList.remove("bounce-animation", "shake-animation", "dance-animation");
  wingL.setAttribute("transform", "rotate(0)");
  wingR.setAttribute("transform", "rotate(0)");

  // Eye configurations
  if (expression === "happy") {
    // Curved happy arches
    eyeL.outerHTML = `<path id="mascot-eye-l" d="M 65 60 Q 75 50 85 60" stroke="#0f172a" stroke-width="6" fill="none" stroke-linecap="round" />`;
    eyeR.outerHTML = `<path id="mascot-eye-r" d="M 115 60 Q 125 50 135 60" stroke="#0f172a" stroke-width="6" fill="none" stroke-linecap="round" />`;
    // Flapping wings
    container.classList.add("dance-animation");
    wingL.setAttribute("transform", "rotate(-15 45 90)");
    wingR.setAttribute("transform", "rotate(15 155 90)");
    mascotBubble.innerText = "Muito bem! 太棒了！";
  } else if (expression === "wrong") {
    // Crosses X X
    eyeL.outerHTML = `<g id="mascot-eye-l">
      <line x1="65" y1="52" x2="81" y2="68" stroke="#0f172a" stroke-width="6" stroke-linecap="round" />
      <line x1="81" y1="52" x2="65" y2="68" stroke="#0f172a" stroke-width="6" stroke-linecap="round" />
    </g>`;
    eyeR.outerHTML = `<g id="mascot-eye-r">
      <line x1="119" y1="52" x2="135" y2="68" stroke="#0f172a" stroke-width="6" stroke-linecap="round" />
      <line x1="135" y1="52" x2="119" y2="68" stroke="#0f172a" stroke-width="6" stroke-linecap="round" />
    </g>`;
    container.classList.add("shake-animation");
    mascotBubble.innerText = "Ops! 再試一次吧！";
  } else if (expression === "thinking") {
    // Looking up
    eyeL.outerHTML = `<g id="mascot-eye-l">
      <circle cx="75" cy="55" r="10" fill="#0f172a" />
      <circle cx="78" cy="52" r="4" fill="white" />
    </g>`;
    eyeR.outerHTML = `<g id="mascot-eye-r">
      <circle cx="125" cy="55" r="10" fill="#0f172a" />
      <circle cx="128" cy="52" r="4" fill="white" />
    </g>`;
    container.classList.add("bounce-animation");
    mascotBubble.innerText = "Humm... 讓我想想...";
  } else {
    // Idle (Default cute look)
    eyeL.outerHTML = `<g id="mascot-eye-l">
      <circle cx="75" cy="60" r="10" fill="#0f172a" />
      <circle cx="72" cy="57" r="4" fill="white" />
    </g>`;
    eyeR.outerHTML = `<g id="mascot-eye-r">
      <circle cx="125" cy="60" r="10" fill="#0f172a" />
      <circle cx="122" cy="57" r="4" fill="white" />
    </g>`;
    mascotBubble.innerText = "Olá! Vamos praticar português?";
  }
  
  // Costume logic
  // Hide all accessory classes first
  gameData.shop.forEach(item => {
    const el = document.getElementById(`mascot-${item.targetClass}`);
    if (el) el.style.display = "none";
  });
  
  // Show active costume
  if (state.activeCostume !== "none") {
    const activeItem = gameData.shop.find(i => i.id === state.activeCostume);
    if (activeItem) {
      const el = document.getElementById(`mascot-${activeItem.targetClass}`);
      if (el) el.style.display = "block";
    }
  }
}

// Safe localStorage wrapper to prevent access-denied crashes on local file protocols
const safeStorage = {
  memoryStore: {},
  getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn("Storage read blocked, using memory fallback.", e);
      return this.memoryStore[key] || null;
    }
  },
  setItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn("Storage write blocked, using memory fallback.", e);
      this.memoryStore[key] = value;
    }
  }
};

// Local Storage Handlers
function saveState() {
  safeStorage.setItem("papagaio_game_state", JSON.stringify(state));
}

function loadState() {
  const saved = safeStorage.getItem("papagaio_game_state");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Ensure all fields are merged with default state to prevent undefined errors
      state = {
        xp: parsed.xp ?? 0,
        diamonds: parsed.diamonds ?? 10,
        streak: parsed.streak ?? 0,
        lastPracticeDate: parsed.lastPracticeDate ?? null,
        currentLevelId: parsed.currentLevelId ?? 1,
        activeCategoryIndex: parsed.activeCategoryIndex ?? null,
        unlockedCostumes: parsed.unlockedCostumes ?? ["none"],
        activeCostume: parsed.activeCostume ?? "none",
        dailyPracticeCount: parsed.dailyPracticeCount ?? 0,
        learnedItems: parsed.learnedItems ?? {}
      };
      // Daily check reset
      checkDailyReset();
    } catch (e) {
      console.error("Error loading state:", e);
    }
  } else {
    checkDailyReset();
  }
}

function checkDailyReset() {
  const today = new Date().toDateString();
  if (state.lastPracticeDate !== today) {
    state.lastPracticeDate = today;
    state.dailyPracticeCount = 0;
    state.learnedItems = {};
    saveState();
  }
}

// UI State Updates
function updateStatsUI() {
  document.getElementById("stat-xp").innerText = state.xp;
  document.getElementById("stat-diamonds").innerText = state.diamonds;
  document.getElementById("stat-streak").innerText = state.streak;
  document.getElementById("level-badge-text").innerText = `Level ${state.currentLevelId}`;
}

function showNotification(text, type = "success") {
  const existingAlert = document.querySelector(".msg-alert");
  if (existingAlert) existingAlert.remove();
  
  const alert = document.createElement("div");
  alert.className = `msg-alert msg-${type}`;
  alert.innerText = text;
  
  const playArea = document.querySelector(".play-area");
  playArea.insertBefore(alert, playArea.firstChild);
  
  setTimeout(() => {
    alert.remove();
  }, 4000);
}

// Navigation screen management
function switchScreen(screenId) {
  document.querySelectorAll(".screen").forEach(scr => scr.classList.remove("active"));
  document.getElementById(screenId).classList.add("active");
  
  // Reset mascot
  updateMascot("idle");
}

// Init Category selection list
function buildCategoryList() {
  const grid = document.getElementById("category-grid");
  grid.innerHTML = "";
  
  gameData.levels.forEach((lvl, idx) => {
    const isLocked = lvl.id > state.currentLevelId;
    const card = document.createElement("div");
    card.className = "category-card";
    if (isLocked) {
      card.style.opacity = "0.5";
      card.style.cursor = "not-allowed";
    }
    
    // Calculate progress inside category
    let practiceStatus = "未開始";
    const completedAll = lvl.items.every(item => state.learnedItems[item.id] > 0);
    if (completedAll) {
      practiceStatus = "⭐ 練習完成";
    } else {
      const completedCount = lvl.items.filter(item => state.learnedItems[item.id] > 0).length;
      if (completedCount > 0) {
        practiceStatus = `已複習 ${completedCount}/${lvl.items.length}`;
      }
    }
    
    card.innerHTML = `
      <div class="category-icon">${isLocked ? "🔒" : lvl.icon}</div>
      <div class="category-title">${lvl.name}</div>
      <div class="category-progress">${isLocked ? "解鎖下一關以練習" : practiceStatus}</div>
    `;
    
    if (!isLocked) {
      card.onclick = () => {
        playClickSound();
        startPractice(idx);
      };
    } else {
      card.onclick = () => {
        playWrongSound();
        showNotification("你需要先通過目前等級的進階測驗！", "error");
      };
    }
    
    grid.appendChild(card);
  });
  
  // Update Mascot speech context
  const incompleteLvl = gameData.levels.find(lvl => lvl.id === state.currentLevelId);
  const mascotSpeech = document.getElementById("mascot-bubble");
  if (incompleteLvl) {
    mascotSpeech.innerText = `準備好挑戰「${incompleteLvl.name}」了嗎？點擊卡片開始複習！`;
  } else {
    mascotSpeech.innerText = `哇！你已經完成了所有的單字！可以重複練習來收集更多鑽石喔！`;
  }
}

// Start Practice Session
function startPractice(levelIdx) {
  state.activeCategoryIndex = levelIdx;
  currentPracticeItemIndex = 0;
  
  switchScreen("screen-practice");
  loadPracticeItem();
}

function loadPracticeItem() {
  const level = gameData.levels[state.activeCategoryIndex];
  const item = level.items[currentPracticeItemIndex];
  
  // Header Info
  document.getElementById("practice-title").innerText = `${level.name} - 複習 (${currentPracticeItemIndex + 1}/${level.items.length})`;
  
  // Reset card state (non-flipped)
  const card = document.querySelector(".vocab-card");
  card.classList.remove("flipped");
  
  // Populate Card contents
  document.getElementById("card-word-pt").innerText = item.portuguese;
  document.getElementById("card-word-zh").innerText = item.translation;
  document.getElementById("card-word-example").innerText = `例句: ${item.example}`;
  
  // Speak word immediately
  setTimeout(() => {
    speakPortuguese(item.portuguese);
  }, 300);
  
  // Track learning & Reward logic (Repeated daily practice)
  if (!state.learnedItems[item.id]) {
    state.learnedItems[item.id] = 0;
  }
  
  // Grant experience points for the first speak each day
  if (state.learnedItems[item.id] === 0) {
    state.learnedItems[item.id] = 1;
    state.xp += 5;
    
    // Check daily streak / quest update
    checkDailyQuestProgress();
    updateStatsUI();
    saveState();
  }
}

function checkDailyQuestProgress() {
  checkDailyReset();
  
  // Count how many unique items practiced today
  let practicedToday = 0;
  for (let key in state.learnedItems) {
    if (state.learnedItems[key] > 0) {
      practicedToday++;
    }
  }
  
  // Quest targets 3 items practiced per day
  if (practicedToday >= 3 && state.dailyPracticeCount < 3) {
    state.dailyPracticeCount = 3; // mark quest completed today
    state.streak++;
    state.diamonds += 5;
    state.xp += 30;
    setTimeout(() => {
      playLevelUpSound();
      showNotification("🎉 達成每日重複練習任務！獲得 +5 鑽石 & +30 XP！", "success");
      triggerConfetti();
    }, 800);
  }
}

// Flip Card Action
function flipCard() {
  playClickSound();
  const card = document.querySelector(".vocab-card");
  card.classList.toggle("flipped");
}

// Card Navigation
function nextPracticeItem() {
  playClickSound();
  const level = gameData.levels[state.activeCategoryIndex];
  if (currentPracticeItemIndex < level.items.length - 1) {
    currentPracticeItemIndex++;
    loadPracticeItem();
  } else {
    // Practice completed for this category! Choose to take test or repeat
    showPracticeFinishedOptions();
  }
}

function prevPracticeItem() {
  playClickSound();
  if (currentPracticeItemIndex > 0) {
    currentPracticeItemIndex--;
    loadPracticeItem();
  }
}

function showPracticeFinishedOptions() {
  switchScreen("screen-practice-finished");
  
  // Give reward for finished practice run
  state.diamonds += 1;
  state.xp += 10;
  updateStatsUI();
  saveState();
  
  playCorrectSound();
  
  const finishedBubble = document.getElementById("mascot-bubble");
  finishedBubble.innerText = "Parabéns! 你做得很棒！要不要直接測試看看？";
}

// Trigger challenge mode for current Category
function startCategoryChallenge() {
  playClickSound();
  challengeMode = true;
  challengeScore = 0;
  currentQuestionIndex = 0;
  
  // Generate Quiz questions based on the items in active category
  const items = gameData.levels[state.activeCategoryIndex].items;
  generateQuestions(items);
  
  switchScreen("screen-challenge");
  loadChallengeQuestion();
}

function generateQuestions(items) {
  challengeQuestions = [];
  
  // We want to create 3 random questions from this dataset
  // Let's shuffle items
  const shuffledItems = [...items].sort(() => 0.5 - Math.random());
  const selectedItems = shuffledItems.slice(0, Math.min(3, items.length));
  
  selectedItems.forEach((item, qIdx) => {
    // Choose question type: 0: MCQ (PT->ZH), 1: Listening (Lico PT->Select Translation), 2: Sentence Unscramble
    let qType = qIdx % 3; // Ensure variety
    
    if (qType === 0) {
      // Multiple Choice
      // Grab 3 wrong translations
      const wrongOptions = gameData.levels
        .flatMap(l => l.items)
        .filter(i => i.translation !== item.translation)
        .map(i => i.translation)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
        
      const options = [item.translation, ...wrongOptions].sort(() => 0.5 - Math.random());
      
      challengeQuestions.push({
        type: "mcq",
        question: `「${item.portuguese}」的中文翻譯是？`,
        correctOption: item.translation,
        options: options,
        audioText: item.portuguese,
        rawItem: item
      });
    } else if (qType === 1) {
      // Listening Multiple Choice
      const wrongOptions = gameData.levels
        .flatMap(l => l.items)
        .filter(i => i.translation !== item.translation)
        .map(i => i.translation)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
        
      const options = [item.translation, ...wrongOptions].sort(() => 0.5 - Math.random());
      
      challengeQuestions.push({
        type: "listening",
        question: "聽一聽，鸚鵡 Lico 說的是哪一句話？",
        correctOption: item.translation,
        options: options,
        audioText: item.portuguese,
        rawItem: item
      });
    } else {
      // Sentence Unscramble
      // Split the portuguese words
      // Strip punctuation for bubbles
      const cleanText = item.portuguese.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"");
      const words = cleanText.split(" ").filter(w => w.trim() !== "");
      const scrambled = [...words].sort(() => 0.5 - Math.random());
      
      challengeQuestions.push({
        type: "unscramble",
        question: `請組合出這句話的葡萄牙語：「${item.translation}」`,
        correctWords: words,
        scrambledWords: scrambled,
        audioText: item.portuguese,
        rawItem: item
      });
    }
  });
}

function loadChallengeQuestion() {
  const q = challengeQuestions[currentQuestionIndex];
  
  // Update progress bar
  const progressPercent = (currentQuestionIndex / challengeQuestions.length) * 100;
  document.getElementById("challenge-progress-bar").style.width = `${progressPercent}%`;
  
  document.getElementById("challenge-q-title").innerText = `題目 ${currentQuestionIndex + 1}/${challengeQuestions.length}`;
  
  // Hide all dynamic areas
  document.getElementById("challenge-options-area").style.display = "none";
  document.getElementById("challenge-unscramble-area").style.display = "none";
  document.getElementById("challenge-listen-btn").style.display = "none";
  
  // Render specific question styles
  if (q.type === "mcq" || q.type === "listening") {
    document.getElementById("challenge-q-box").innerText = q.question;
    document.getElementById("challenge-options-area").style.display = "grid";
    
    if (q.type === "listening") {
      document.getElementById("challenge-listen-btn").style.display = "inline-flex";
      // Speak the prompt automatically
      setTimeout(() => {
        speakPortuguese(q.audioText);
      }, 500);
    }
    
    // Build options
    const optionsGrid = document.getElementById("challenge-options-grid");
    optionsGrid.innerHTML = "";
    q.options.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.innerHTML = `<span>${opt}</span> <span class="feedback-icon"></span>`;
      btn.onclick = () => selectChallengeOption(btn, opt, q.correctOption);
      optionsGrid.appendChild(btn);
    });
  } else if (q.type === "unscramble") {
    document.getElementById("challenge-q-box").innerText = q.question;
    document.getElementById("challenge-unscramble-area").style.display = "block";
    
    selectedWordsForPuzzle = [];
    renderPuzzleSlots();
    renderPuzzleBubbles(q.scrambledWords);
  }
}

// User Action: Multiple choice select
function selectChallengeOption(btn, selectedVal, correctVal) {
  // Prevent double click
  const buttons = document.querySelectorAll(".option-btn");
  buttons.forEach(b => b.disabled = true);
  
  if (selectedVal === correctVal) {
    btn.classList.add("correct");
    btn.querySelector(".feedback-icon").innerText = "🎉";
    playCorrectSound();
    updateMascot("happy");
    challengeScore++;
  } else {
    btn.classList.add("wrong");
    btn.querySelector(".feedback-icon").innerText = "❌";
    // Show correct one as green
    buttons.forEach(b => {
      if (b.innerText.includes(correctVal)) {
        b.classList.add("correct");
      }
    });
    playWrongSound();
    updateMascot("wrong");
  }
  
  // Autoplay translation pronunciation on result
  const q = challengeQuestions[currentQuestionIndex];
  setTimeout(() => {
    speakPortuguese(q.audioText);
  }, 600);
  
  // Transition to next question
  setTimeout(() => {
    goToNextQuestion();
  }, 2200);
}

// Puzzle / Word Unscramble logic
function renderPuzzleSlots() {
  const slotContainer = document.getElementById("puzzle-slots");
  slotContainer.innerHTML = "";
  
  if (selectedWordsForPuzzle.length === 0) {
    slotContainer.innerHTML = `<span style="color: #94a3b8; font-style: italic;">點擊下方單字卡填入...</span>`;
    return;
  }
  
  selectedWordsForPuzzle.forEach((word, idx) => {
    const bubble = document.createElement("div");
    bubble.className = "puzzle-word-bubble";
    bubble.innerText = word;
    bubble.onclick = () => {
      playClickSound();
      removeWordFromPuzzle(idx);
    };
    slotContainer.appendChild(bubble);
  });
}

function renderPuzzleBubbles(words) {
  const bubbleContainer = document.getElementById("puzzle-bubbles");
  bubbleContainer.innerHTML = "";
  
  words.forEach((word, idx) => {
    const bubble = document.createElement("div");
    bubble.className = "puzzle-word-bubble";
    
    // If word is currently used, grey it out
    // Since duplicates might exist, we check index usage rather than raw string
    const occurrencesInSelection = selectedWordsForPuzzle.filter(w => w === word).length;
    // Simple rough check: if user already selected this word as many times as it appears up to index
    let countInScrambledBeforeThis = 0;
    for(let i=0; i<=idx; i++) {
      if (words[i] === word) countInScrambledBeforeThis++;
    }
    
    if (occurrencesInSelection >= countInScrambledBeforeThis) {
      bubble.classList.add("used");
    } else {
      bubble.onclick = () => {
        playClickSound();
        addWordToPuzzle(word);
      };
    }
    
    bubble.innerText = word;
    bubbleContainer.appendChild(bubble);
  });
}

function addWordToPuzzle(word) {
  selectedWordsForPuzzle.push(word);
  renderPuzzleSlots();
  
  const q = challengeQuestions[currentQuestionIndex];
  renderPuzzleBubbles(q.scrambledWords);
}

function removeWordFromPuzzle(index) {
  selectedWordsForPuzzle.splice(index, 1);
  renderPuzzleSlots();
  
  const q = challengeQuestions[currentQuestionIndex];
  renderPuzzleBubbles(q.scrambledWords);
}

// Validate Unscramble answer
function checkPuzzleAnswer() {
  const q = challengeQuestions[currentQuestionIndex];
  const cleanAnswers = q.correctWords.map(w => w.toLowerCase());
  const cleanSelection = selectedWordsForPuzzle.map(w => w.toLowerCase());
  
  const isCorrect = cleanAnswers.length === cleanSelection.length && 
                    cleanAnswers.every((val, index) => val === cleanSelection[index]);
  
  const slotContainer = document.getElementById("puzzle-slots");
  
  if (isCorrect) {
    slotContainer.style.background = "#dcfce7";
    slotContainer.style.borderColor = "#15803d";
    playCorrectSound();
    updateMascot("happy");
    challengeScore++;
  } else {
    slotContainer.style.background = "#fee2e2";
    slotContainer.style.borderColor = "#b91c1c";
    
    // Show correct sentence
    const correctStr = q.correctWords.join(" ");
    const feedback = document.createElement("div");
    feedback.style.color = "#b91c1c";
    feedback.style.fontWeight = "700";
    feedback.style.marginTop = "8px";
    feedback.innerText = `正確解答: ${correctStr}`;
    slotContainer.appendChild(feedback);
    
    playWrongSound();
    updateMascot("wrong");
  }
  
  // Disable buttons temporarily
  document.getElementById("puzzle-check-btn").disabled = true;
  
  setTimeout(() => {
    speakPortuguese(q.audioText);
  }, 500);
  
  setTimeout(() => {
    document.getElementById("puzzle-check-btn").disabled = false;
    goToNextQuestion();
  }, 2500);
}

function goToNextQuestion() {
  if (currentQuestionIndex < challengeQuestions.length - 1) {
    currentQuestionIndex++;
    loadChallengeQuestion();
  } else {
    // Challenge Finished!
    showChallengeResults();
  }
}

function showChallengeResults() {
  switchScreen("screen-challenge-results");
  
  const pct = (challengeScore / challengeQuestions.length) * 100;
  let rewardDiamonds = 0;
  let rewardXP = 0;
  let textResult = "";
  
  if (pct === 100) {
    rewardDiamonds = 3;
    rewardXP = 25;
    textResult = "🏆 完美挑戰！太厲害了，所有題目都答對了！";
    updateMascot("happy");
    playLevelUpSound();
    triggerConfetti();
  } else if (pct >= 60) {
    rewardDiamonds = 1;
    rewardXP = 15;
    textResult = "👍 恭喜通過！你已經掌握得差不多了！";
    updateMascot("happy");
    playCorrectSound();
  } else {
    rewardDiamonds = 0;
    rewardXP = 5;
    textResult = "加油！再複習一下單字，下次一定可以做得更好！";
    updateMascot("wrong");
    playWrongSound();
  }
  
  state.diamonds += rewardDiamonds;
  state.xp += rewardXP;
  updateStatsUI();
  saveState();
  
  document.getElementById("challenge-result-text").innerText = textResult;
  document.getElementById("challenge-result-stats").innerText = `答對題數: ${challengeScore}/${challengeQuestions.length} | 獲得小獎勵: +${rewardDiamonds} 💎 | +${rewardXP} XP`;
}

// Level up trigger and Level Gate Quiz
function requestLevelUp() {
  playClickSound();
  const currentLvlIdx = gameData.levels.findIndex(l => l.id === state.currentLevelId);
  const totalLevels = gameData.levels.length;
  
  if (currentLvlIdx === -1 || state.currentLevelId >= totalLevels) {
    showNotification("你已經達到了最高等級！可以繼續練習收集鑽石喔！", "success");
    return;
  }
  
  // Launch level gate test
  challengeMode = true;
  challengeScore = 0;
  currentQuestionIndex = 0;
  
  // Level Gate consists of 5 random questions across the current level vocabulary list
  const currentLvlItems = gameData.levels[currentLvlIdx].items;
  
  // Create level gate questions
  generateLevelGateQuestions(currentLvlItems);
  
  switchScreen("screen-level-gate");
  loadLevelGateQuestion();
}

function generateLevelGateQuestions(items) {
  challengeQuestions = [];
  
  // Shuffle items to generate 5 questions
  const shuffledItems = [...items].sort(() => 0.5 - Math.random());
  
  shuffledItems.forEach((item, qIdx) => {
    let qType = qIdx % 3;
    if (qType === 0) {
      const wrongOptions = gameData.levels
        .flatMap(l => l.items)
        .filter(i => i.translation !== item.translation)
        .map(i => i.translation)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      const options = [item.translation, ...wrongOptions].sort(() => 0.5 - Math.random());
      
      challengeQuestions.push({
        type: "mcq",
        question: `「${item.portuguese}」代表的意思是？`,
        correctOption: item.translation,
        options: options,
        audioText: item.portuguese,
        rawItem: item
      });
    } else if (qType === 1) {
      const wrongOptions = gameData.levels
        .flatMap(l => l.items)
        .filter(i => i.translation !== item.translation)
        .map(i => i.translation)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      const options = [item.translation, ...wrongOptions].sort(() => 0.5 - Math.random());
      
      challengeQuestions.push({
        type: "listening",
        question: "聽一聽，鸚鵡說了什麼句子？",
        correctOption: item.translation,
        options: options,
        audioText: item.portuguese,
        rawItem: item
      });
    } else {
      const cleanText = item.portuguese.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"");
      const words = cleanText.split(" ").filter(w => w.trim() !== "");
      const scrambled = [...words].sort(() => 0.5 - Math.random());
      
      challengeQuestions.push({
        type: "unscramble",
        question: `排列出這句巴西葡語：「${item.translation}」`,
        correctWords: words,
        scrambledWords: scrambled,
        audioText: item.portuguese,
        rawItem: item
      });
    }
  });
}

function loadLevelGateQuestion() {
  const q = challengeQuestions[currentQuestionIndex];
  
  // Progress
  const progressPercent = (currentQuestionIndex / challengeQuestions.length) * 100;
  document.getElementById("level-gate-progress-bar").style.width = `${progressPercent}%`;
  
  document.getElementById("level-gate-q-title").innerText = `進階測驗 ${currentQuestionIndex + 1}/${challengeQuestions.length}`;
  
  // Hide all dynamic areas
  document.getElementById("level-gate-options-area").style.display = "none";
  document.getElementById("level-gate-unscramble-area").style.display = "none";
  document.getElementById("level-gate-listen-btn").style.display = "none";
  
  if (q.type === "mcq" || q.type === "listening") {
    document.getElementById("level-gate-q-box").innerText = q.question;
    document.getElementById("level-gate-options-area").style.display = "grid";
    
    if (q.type === "listening") {
      document.getElementById("level-gate-listen-btn").style.display = "inline-flex";
      setTimeout(() => {
        speakPortuguese(q.audioText);
      }, 500);
    }
    
    const optionsGrid = document.getElementById("level-gate-options-grid");
    optionsGrid.innerHTML = "";
    q.options.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.innerHTML = `<span>${opt}</span> <span class="feedback-icon"></span>`;
      btn.onclick = () => selectLevelGateOption(btn, opt, q.correctOption);
      optionsGrid.appendChild(btn);
    });
  } else if (q.type === "unscramble") {
    document.getElementById("level-gate-q-box").innerText = q.question;
    document.getElementById("level-gate-unscramble-area").style.display = "block";
    
    selectedWordsForPuzzle = [];
    renderLevelGatePuzzleSlots();
    renderLevelGatePuzzleBubbles(q.scrambledWords);
  }
}

function selectLevelGateOption(btn, selectedVal, correctVal) {
  const buttons = document.querySelectorAll("#level-gate-options-grid .option-btn");
  buttons.forEach(b => b.disabled = true);
  
  if (selectedVal === correctVal) {
    btn.classList.add("correct");
    btn.querySelector(".feedback-icon").innerText = "🎉";
    playCorrectSound();
    updateMascot("happy");
    challengeScore++;
  } else {
    btn.classList.add("wrong");
    btn.querySelector(".feedback-icon").innerText = "❌";
    buttons.forEach(b => {
      if (b.innerText.includes(correctVal)) {
        b.classList.add("correct");
      }
    });
    playWrongSound();
    updateMascot("wrong");
  }
  
  const q = challengeQuestions[currentQuestionIndex];
  setTimeout(() => speakPortuguese(q.audioText), 600);
  
  setTimeout(() => {
    goToNextLevelGateQuestion();
  }, 2200);
}

function renderLevelGatePuzzleSlots() {
  const slotContainer = document.getElementById("level-gate-puzzle-slots");
  slotContainer.innerHTML = "";
  if (selectedWordsForPuzzle.length === 0) {
    slotContainer.innerHTML = `<span style="color: #94a3b8; font-style: italic;">點擊單字卡填入...</span>`;
    return;
  }
  selectedWordsForPuzzle.forEach((word, idx) => {
    const bubble = document.createElement("div");
    bubble.className = "puzzle-word-bubble";
    bubble.innerText = word;
    bubble.onclick = () => {
      playClickSound();
      selectedWordsForPuzzle.splice(idx, 1);
      renderLevelGatePuzzleSlots();
      renderLevelGatePuzzleBubbles(challengeQuestions[currentQuestionIndex].scrambledWords);
    };
    slotContainer.appendChild(bubble);
  });
}

function renderLevelGatePuzzleBubbles(words) {
  const bubbleContainer = document.getElementById("level-gate-puzzle-bubbles");
  bubbleContainer.innerHTML = "";
  words.forEach((word, idx) => {
    const bubble = document.createElement("div");
    bubble.className = "puzzle-word-bubble";
    const occurrences = selectedWordsForPuzzle.filter(w => w === word).length;
    let countBefore = 0;
    for(let i=0; i<=idx; i++) {
      if (words[i] === word) countBefore++;
    }
    if (occurrences >= countBefore) {
      bubble.classList.add("used");
    } else {
      bubble.onclick = () => {
        playClickSound();
        selectedWordsForPuzzle.push(word);
        renderLevelGatePuzzleSlots();
        renderLevelGatePuzzleBubbles(words);
      };
    }
    bubble.innerText = word;
    bubbleContainer.appendChild(bubble);
  });
}

function checkLevelGatePuzzleAnswer() {
  const q = challengeQuestions[currentQuestionIndex];
  const cleanAnswers = q.correctWords.map(w => w.toLowerCase());
  const cleanSelection = selectedWordsForPuzzle.map(w => w.toLowerCase());
  const isCorrect = cleanAnswers.length === cleanSelection.length && 
                    cleanAnswers.every((val, index) => val === cleanSelection[index]);
  
  const slotContainer = document.getElementById("level-gate-puzzle-slots");
  if (isCorrect) {
    slotContainer.style.background = "#dcfce7";
    slotContainer.style.borderColor = "#15803d";
    playCorrectSound();
    updateMascot("happy");
    challengeScore++;
  } else {
    slotContainer.style.background = "#fee2e2";
    slotContainer.style.borderColor = "#b91c1c";
    const correctStr = q.correctWords.join(" ");
    const feedback = document.createElement("div");
    feedback.style.color = "#b91c1c";
    feedback.style.fontWeight = "700";
    feedback.style.marginTop = "8px";
    feedback.innerText = `正確解答: ${correctStr}`;
    slotContainer.appendChild(feedback);
    
    playWrongSound();
    updateMascot("wrong");
  }
  
  document.getElementById("level-gate-puzzle-check-btn").disabled = true;
  setTimeout(() => speakPortuguese(q.audioText), 500);
  
  setTimeout(() => {
    document.getElementById("level-gate-puzzle-check-btn").disabled = false;
    goToNextLevelGateQuestion();
  }, 2500);
}

function goToNextLevelGateQuestion() {
  if (currentQuestionIndex < challengeQuestions.length - 1) {
    currentQuestionIndex++;
    loadLevelGateQuestion();
  } else {
    showLevelGateResults();
  }
}

function showLevelGateResults() {
  switchScreen("screen-level-gate-results");
  
  const passed = challengeScore >= 4; // Need at least 4 out of 5 to level up
  let text = "";
  
  if (passed) {
    state.currentLevelId++;
    state.diamonds += 10;
    state.xp += 100;
    text = `🎉 恭喜通過進階測驗！你已解鎖 Level ${state.currentLevelId}！獲得大獎勵 +10 💎 & +100 XP！`;
    updateMascot("happy");
    playLevelUpSound();
    triggerConfetti();
  } else {
    text = `測驗未通過 (需答對 4 題，你答對了 ${challengeScore} 題)。別灰心，多練習幾次，一定可以通過的！`;
    updateMascot("wrong");
    playWrongSound();
  }
  
  saveState();
  updateStatsUI();
  
  document.getElementById("level-gate-result-text").innerText = text;
  document.getElementById("level-gate-result-stats").innerText = `答對題數: ${challengeScore}/5 | 目前等級: Level ${state.currentLevelId}`;
}

// Dialog Shop Controls
function openShop() {
  playClickSound();
  const shopOverlay = document.getElementById("shop-overlay");
  shopOverlay.classList.add("active");
  updateMascot("thinking");
  renderShop();
}

function closeShop() {
  playClickSound();
  const shopOverlay = document.getElementById("shop-overlay");
  shopOverlay.classList.remove("active");
  updateMascot("idle");
}

function renderShop() {
  const shopGrid = document.getElementById("shop-grid");
  shopGrid.innerHTML = "";
  
  // Normal None skin
  const noneEquipped = state.activeCostume === "none";
  const noneCard = document.createElement("div");
  noneCard.className = `shop-item ${noneEquipped ? 'equipped' : ''}`;
  noneCard.innerHTML = `
    <div class="shop-item-preview">🦜</div>
    <div class="shop-item-name">原版外觀</div>
    <div class="shop-item-price">免費</div>
  `;
  noneCard.onclick = () => equipCostume("none");
  shopGrid.appendChild(noneCard);
  
  gameData.shop.forEach(item => {
    const isUnlocked = state.unlockedCostumes.includes(item.id);
    const isEquipped = state.activeCostume === item.id;
    
    const card = document.createElement("div");
    card.className = `shop-item ${isEquipped ? 'equipped' : ''}`;
    
    let priceHTML = `<div class="shop-item-price">${item.emoji} ${item.price} 💎</div>`;
    if (isUnlocked) {
      priceHTML = `<div class="shop-item-price" style="color: var(--color-primary);">${isEquipped ? '已裝備' : '點擊裝備'}</div>`;
    }
    
    card.innerHTML = `
      <div class="shop-item-preview">${item.emoji}</div>
      <div class="shop-item-name">${item.name}</div>
      ${priceHTML}
    `;
    
    card.onclick = () => {
      if (isUnlocked) {
        equipCostume(item.id);
      } else {
        buyCostume(item);
      }
    };
    
    shopGrid.appendChild(card);
  });
}

function buyCostume(item) {
  if (state.diamonds >= item.price) {
    playLevelUpSound();
    state.diamonds -= item.price;
    state.unlockedCostumes.push(item.id);
    state.activeCostume = item.id;
    
    saveState();
    updateStatsUI();
    renderShop();
    updateMascot("happy");
    showNotification(`解鎖成功！你已為 Lico 穿上「${item.name}」👕`, "success");
  } else {
    playWrongSound();
    showNotification("你的鑽石不夠喔！快去練習關卡獲取鑽石吧！ 💎", "error");
  }
}

function equipCostume(itemId) {
  playClickSound();
  state.activeCostume = itemId;
  saveState();
  renderShop();
  updateMascot("happy");
}

// Confetti Effect Generator (Standard Canvas Animation)
let confettiActive = false;
let confettiParticles = [];

function triggerConfetti() {
  confettiActive = true;
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  confettiParticles = [];
  for (let i = 0; i < 100; i++) {
    confettiParticles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * canvas.height,
      color: `hsl(${Math.random() * 360}, 90%, 60%)`,
      tilt: Math.random() * 10 - 5,
      tiltAngleIncremental: Math.random() * 0.07 + 0.02,
      tiltAngle: 0
    });
  }
  
  function drawConfetti() {
    if (!confettiActive) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let activeParticlesCount = 0;
    confettiParticles.forEach((p, index) => {
      p.tiltAngle += p.tiltAngleIncremental;
      p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
      p.x += Math.sin(p.tiltAngle);
      p.tilt = Math.sin(p.tiltAngle - index/3) * 15;
      
      if (p.y <= canvas.height) {
        activeParticlesCount++;
      }
      
      ctx.beginPath();
      ctx.lineWidth = p.r / 2;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
      ctx.stroke();
    });
    
    if (activeParticlesCount === 0) {
      confettiActive = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      requestAnimationFrame(drawConfetti);
    }
  }
  
  requestAnimationFrame(drawConfetti);
}

// Page load initialization
window.addEventListener("load", () => {
  loadState();
  setupSpeech();
  updateStatsUI();
  buildCategoryList();
  switchScreen("screen-home");
});

// Expose functions globally for HTML element handlers
window.flipCard = flipCard;
window.nextPracticeItem = nextPracticeItem;
window.prevPracticeItem = prevPracticeItem;
window.switchScreen = (id) => { playClickSound(); switchScreen(id); if (id === 'screen-home') buildCategoryList(); };
window.startCategoryChallenge = startCategoryChallenge;
window.checkPuzzleAnswer = checkPuzzleAnswer;
window.checkLevelGatePuzzleAnswer = checkLevelGatePuzzleAnswer;
window.requestLevelUp = requestLevelUp;
window.openShop = openShop;
window.closeShop = closeShop;
window.speakPortuguese = speakPortuguese;
window.playClickSound = playClickSound;
window.toggleSpeechRate = () => {
  playClickSound();
  const rateBtn = document.getElementById("rate-toggle-btn");
  if (speechRate === 1.0) {
    speechRate = 0.6;
    rateBtn.innerText = "🐢 慢速";
  } else {
    speechRate = 1.0;
    rateBtn.innerText = "⚡ 正常音速";
  }
};
