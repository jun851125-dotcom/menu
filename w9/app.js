// Core Game Logic & State Management
document.addEventListener("DOMContentLoaded", () => {
  // --- Game State Variables ---
  let state = {
    xp: 0,
    diamonds: 5,
    streak: 1,
    lastPracticeDate: "",
    unlockedLevels: [1],
    completedLevels: [],
    currentLevelId: 1,
    currentScreen: "map", // map, study, quiz, victory
  };

  // Study Phase variables
  let studyState = {
    vocabList: [],
    currentIndex: 0,
    isFlipped: false
  };

  // Quiz Phase variables
  let quizState = {
    questions: [],
    currentIndex: 0,
    hearts: 3,
    selectedOption: null, // for multi-choice
    arrangedWords: [],    // for sentence puzzle
    reservoirWords: [],   // for sentence puzzle
    isAnswerChecked: false,
    isAnswerCorrect: false
  };

  // Load progress from Local Storage
  function loadProgress() {
    const saved = localStorage.getItem("portuguese_game_progress");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        state = { ...state, ...parsed };
        
        // Ensure unlockedLevels contains at least level 1
        if (!state.unlockedLevels.includes(1)) {
          state.unlockedLevels.push(1);
        }
      } catch (e) {
        console.error("Failed to parse progress, using defaults", e);
      }
    }
    updateStreak();
    saveProgress();
    renderStats();
  }

  // Save progress to Local Storage
  function saveProgress() {
    localStorage.setItem("portuguese_game_progress", JSON.stringify(state));
  }

  // Daily Streak Calculator
  function updateStreak() {
    const today = new Date().toDateString();
    if (state.lastPracticeDate) {
      const lastDate = new Date(state.lastPracticeDate);
      const todayDate = new Date(today);
      const diffTime = Math.abs(todayDate - lastDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Practiced yesterday, keep streak going when practicing today
        // (will be officially updated when finishing a study/quiz session)
      } else if (diffDays > 1) {
        // Streak lost
        state.streak = 1;
      }
    } else {
      state.streak = 1;
    }
  }

  function commitPracticeDay() {
    const today = new Date().toDateString();
    if (state.lastPracticeDate !== today) {
      if (state.lastPracticeDate) {
        const lastDate = new Date(state.lastPracticeDate);
        const todayDate = new Date(today);
        const diffTime = Math.abs(todayDate - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          state.streak += 1;
        } else if (diffDays > 1) {
          state.streak = 1;
        }
      } else {
        state.streak = 1;
      }
      state.lastPracticeDate = today;
    }
    saveProgress();
    renderStats();
  }

  // Render top navigation stats
  function renderStats() {
    document.getElementById("header-xp").textContent = state.xp;
    document.getElementById("header-diamonds").textContent = state.diamonds;
    document.getElementById("header-streak").textContent = state.streak;

    // XP calculation: levels up every 100 XP
    const currentXpInLevel = state.xp % 100;
    const playerLevelNum = Math.floor(state.xp / 100) + 1;
    document.getElementById("header-level-name").textContent = `等級 ${playerLevelNum}`;
    document.getElementById("header-xp-bar").style.width = `${currentXpInLevel}%`;
  }

  // Reset Progress Handler
  document.getElementById("btn-reset-progress").addEventListener("click", () => {
    if (confirm("⚠️ 確定要重設所有學習進度和寶石嗎？此動作無法復原！")) {
      state = {
        xp: 0,
        diamonds: 5,
        streak: 1,
        lastPracticeDate: "",
        unlockedLevels: [1],
        completedLevels: [],
        currentLevelId: 1,
        currentScreen: "map",
      };
      saveProgress();
      renderStats();
      showScreen("map");
      renderMapNodes();
      AudioEngine.playSFX("click");
      sayMascot("進度已重設！讓我們從第一關重頭開始吧！");
    }
  });

  // Mascot Random Phrases
  const MASCOT_PHRASES = [
    "Olá! 我是大嘴鳥 Tuca。今天想學習哪一個關卡呢？點擊圓圈開始吧！",
    "你知道嗎？巴西人常用 'Tudo bem?' 來問候彼此喔！",
    "點擊字卡發音聽聽看，大聲跟著念效果更棒！",
    "每天練習 5 分鐘，巴西葡萄牙語就會越來越流利！",
    "挑戰測驗可以獲得 XP 和藍色寶石 💎 喔！加油！",
    "學累了嗎？可以先在第一關複習一下簡單的單字喔！"
  ];

  function sayMascot(text) {
    const speechEl = document.getElementById("mascot-speech");
    speechEl.classList.remove("bounce-once");
    void speechEl.offsetWidth; // Trigger reflow
    speechEl.textContent = text;
    speechEl.classList.add("bounce-once");
  }

  function mascotRandomSpeak() {
    const idx = Math.floor(Math.random() * MASCOT_PHRASES.length);
    sayMascot(MASCOT_PHRASES[idx]);
  }

  // --- Render Map Section ---
  function renderMapNodes() {
    const container = document.getElementById("level-nodes-container");
    container.innerHTML = "";

    VOCAB_DATABASE.levels.forEach((lvl, idx) => {
      const wrapper = document.createElement("div");
      wrapper.className = "level-node-wrapper";

      const node = document.createElement("div");
      node.className = "level-node";
      node.dataset.id = lvl.id;
      node.textContent = lvl.icon;

      // Determine level status
      if (state.completedLevels.includes(lvl.id)) {
        node.classList.add("completed");
      } else if (state.unlockedLevels.includes(lvl.id)) {
        node.classList.add("unlocked");
      } else {
        node.classList.add("locked");
      }

      // Add badge for level number
      const badge = document.createElement("div");
      badge.className = "level-badge";
      badge.textContent = idx + 1;
      node.appendChild(badge);

      const title = document.createElement("div");
      title.className = "level-node-title";
      title.textContent = lvl.name;

      wrapper.appendChild(node);
      wrapper.appendChild(title);
      container.appendChild(wrapper);

      // Event Listener for Popover
      node.addEventListener("click", () => {
        if (node.classList.contains("locked")) {
          AudioEngine.playSFX("wrong");
          sayMascot("這個關卡還鎖著呢！需要完成前一關的挑戰才能解鎖喔！🔒");
          // Shake effect on locked node
          node.classList.add("shake-once");
          setTimeout(() => node.classList.remove("shake-once"), 400);
          return;
        }
        
        AudioEngine.playSFX("click");
        openLevelPopover(lvl);
      });
    });
  }

  // --- Level Popover Logic ---
  const popover = document.getElementById("level-popover");
  const overlay = document.getElementById("popover-overlay");

  function openLevelPopover(level) {
    state.currentLevelId = level.id;
    document.getElementById("popover-level-icon").textContent = level.icon;
    document.getElementById("popover-level-title").textContent = level.name;
    document.getElementById("popover-level-subtitle").textContent = `NÍVEL ${level.id}`;
    document.getElementById("popover-level-desc").textContent = level.description;

    // Show popover
    popover.classList.add("active");
    overlay.classList.add("active");
  }

  function closeLevelPopover() {
    popover.classList.remove("active");
    overlay.classList.remove("active");
  }

  document.getElementById("popover-btn-close").addEventListener("click", closeLevelPopover);
  overlay.addEventListener("click", closeLevelPopover);

  // Popover Actions
  document.getElementById("popover-btn-study").addEventListener("click", () => {
    closeLevelPopover();
    startStudy(state.currentLevelId);
  });

  document.getElementById("popover-btn-quiz").addEventListener("click", () => {
    closeLevelPopover();
    startQuiz(state.currentLevelId);
  });

  document.getElementById("popover-btn-advance").addEventListener("click", () => {
    closeLevelPopover();
    const lvl = VOCAB_DATABASE.levels.find(l => l.id === state.currentLevelId);
    if (confirm(`🎓 你覺得「${lvl.name}」練習夠了嗎？可以直接解鎖下一關喔！`)) {
      unlockNextLevel(state.currentLevelId);
      AudioEngine.playSFX("victory");
      renderMapNodes();
      sayMascot("恭喜！新關卡已解鎖，快去探索吧！🚀");
    }
  });

  function unlockNextLevel(currentId) {
    if (!state.completedLevels.includes(currentId)) {
      state.completedLevels.push(currentId);
    }
    const nextId = currentId + 1;
    const nextLevelExists = VOCAB_DATABASE.levels.some(l => l.id === nextId);
    if (nextLevelExists && !state.unlockedLevels.includes(nextId)) {
      state.unlockedLevels.push(nextId);
    }
    saveProgress();
  }

  // --- Screen Navigation ---
  function showScreen(screenId) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById(`screen-${screenId}`).classList.add("active");
    state.currentScreen = screenId;
    window.scrollTo(0,0);
  }

  // --- Study Room Logic ---
  const flashcard = document.getElementById("study-flashcard");

  function startStudy(levelId) {
    const level = VOCAB_DATABASE.levels.find(l => l.id === levelId);
    studyState.vocabList = [...level.vocab];
    studyState.currentIndex = 0;
    studyState.isFlipped = false;
    flashcard.classList.remove("flipped");

    document.getElementById("study-unit-title").textContent = `學習：${level.name}`;
    renderCard();
    showScreen("study");
    sayMascot("點擊字卡發音！準備好再點擊卡片翻轉看翻譯喔！");
  }

  function renderCard() {
    const currentVocab = studyState.vocabList[studyState.currentIndex];
    
    // Front side elements
    document.getElementById("study-card-emoji").textContent = currentVocab.emoji || "💡";
    document.getElementById("study-card-portuguese").textContent = currentVocab.word;
    
    // Back side elements
    document.getElementById("study-card-translation").textContent = currentVocab.translation;
    document.getElementById("study-card-hint").textContent = currentVocab.hint || "";

    // Update Progress Indicator
    document.getElementById("study-progress-text").textContent = 
      `${studyState.currentIndex + 1} / ${studyState.vocabList.length}`;

    // Speak automatically on display
    setTimeout(() => {
      AudioEngine.speak(currentVocab.word);
    }, 300);
  }

  // Flip card handler
  flashcard.addEventListener("click", () => {
    studyState.isFlipped = !studyState.isFlipped;
    if (studyState.isFlipped) {
      flashcard.classList.add("flipped");
      AudioEngine.playSFX("click");
    } else {
      flashcard.classList.remove("flipped");
      AudioEngine.playSFX("click");
      // Speak again on turning to front
      AudioEngine.speak(studyState.vocabList[studyState.currentIndex].word);
    }
  });

  // Study buttons
  document.getElementById("study-btn-next").addEventListener("click", () => {
    AudioEngine.playSFX("click");
    if (studyState.currentIndex < studyState.vocabList.length - 1) {
      studyState.currentIndex++;
      studyState.isFlipped = false;
      flashcard.classList.remove("flipped");
      renderCard();
    } else {
      // Finished all cards! Give XP reward and return to map
      state.xp += 10;
      commitPracticeDay();
      saveProgress();
      renderStats();
      
      // Setup Victory Screen
      document.getElementById("victory-subtitle-text").textContent = "你完成了單字學習複習！";
      document.getElementById("victory-xp-gain").textContent = "+10";
      document.getElementById("victory-diamonds-gain").textContent = "+1";
      state.diamonds += 1;
      saveProgress();
      renderStats();
      AudioEngine.playSFX("victory");
      showScreen("victory");
    }
  });

  document.getElementById("study-btn-prev").addEventListener("click", () => {
    AudioEngine.playSFX("click");
    if (studyState.currentIndex > 0) {
      studyState.currentIndex--;
      studyState.isFlipped = false;
      flashcard.classList.remove("flipped");
      renderCard();
    }
  });

  document.getElementById("study-btn-flip").addEventListener("click", () => {
    flashcard.click();
  });

  document.getElementById("study-btn-back").addEventListener("click", () => {
    AudioEngine.playSFX("click");
    showScreen("map");
    mascotRandomSpeak();
    renderMapNodes();
  });

  // --- Quiz Challenge Logic ---
  function startQuiz(levelId) {
    const level = VOCAB_DATABASE.levels.find(l => l.id === levelId);
    quizState.hearts = 3;
    quizState.currentIndex = 0;
    quizState.isAnswerChecked = false;
    quizState.isAnswerCorrect = false;

    // Generate dynamic questions based on vocab
    quizState.questions = generateQuestions(level);

    renderHearts();
    renderQuizQuestion();
    showScreen("quiz");
    sayMascot("挑戰開始！仔細閱讀題目，找出正確答案喔！");
  }

  function renderHearts() {
    const heartsContainer = document.getElementById("quiz-hearts");
    heartsContainer.innerHTML = "";
    for (let i = 0; i < 3; i++) {
      if (i < quizState.hearts) {
        heartsContainer.innerHTML += "❤️ ";
      } else {
        heartsContainer.innerHTML += "🖤 ";
      }
    }
  }

  // Dynamic Question Generator
  function generateQuestions(level) {
    const pool = level.vocab;
    const sentences = level.sentences;
    const questions = [];

    // Question 1 & 2: Multiple Choice (Image Choice / Emojis)
    // E.g. "哪個是 'água' ?"
    const imageVocabs = pool.filter(v => v.emoji);
    const shuffledImageVocabs = shuffleArray([...imageVocabs]);
    
    for (let i = 0; i < Math.min(2, shuffledImageVocabs.length); i++) {
      const correctItem = shuffledImageVocabs[i];
      // get 2 distractors
      const distractors = pool.filter(v => v.word !== correctItem.word);
      const chosenDistractors = shuffleArray(distractors).slice(0, 2);
      const options = shuffleArray([correctItem, ...chosenDistractors]);

      questions.push({
        type: "image-choice",
        prompt: `哪一個是「${correctItem.translation}」呢？`,
        correctWord: correctItem.word,
        options: options.map(o => ({ word: o.word, emoji: o.emoji, translation: o.translation }))
      });
    }

    // Question 3: Listening Choice
    // E.g. Play audio, guess the word
    const listeningVocabs = shuffleArray([...pool]);
    if (listeningVocabs.length > 0) {
      const correctItem = listeningVocabs[0];
      const distractors = pool.filter(v => v.word !== correctItem.word);
      const chosenDistractors = shuffleArray(distractors).slice(0, 2);
      const options = shuffleArray([correctItem, ...chosenDistractors]);

      questions.push({
        type: "listening-choice",
        prompt: "點擊按鈕聽語音，選出聽到的是哪一個單字：",
        correctWord: correctItem.word,
        options: options.map(o => ({ word: o.word, emoji: o.emoji, translation: o.translation }))
      });
    }

    // Question 4: Word Translation Matching
    // E.g. Portuguese word -> select translation
    const matchingVocabs = shuffleArray([...pool]);
    if (matchingVocabs.length > 1) {
      const correctItem = matchingVocabs[1];
      const distractors = pool.filter(v => v.word !== correctItem.word);
      const chosenDistractors = shuffleArray(distractors).slice(0, 2);
      const options = shuffleArray([correctItem, ...chosenDistractors]);

      questions.push({
        type: "word-select",
        prompt: `「${correctItem.word}」的意思是什麼？`,
        correctWord: correctItem.translation,
        options: options.map(o => ({ word: o.translation, displayWord: o.translation }))
      });
    }

    // Question 5: Sentence Puzzle
    // E.g. Build sentence
    if (sentences && sentences.length > 0) {
      const sentenceObj = shuffleArray([...sentences])[0];
      // Split the correct sentence into tokens
      const correctTokens = sentenceObj.portuguese.replace(/[?,.!]/g, "").split(" ");
      // Add 2 random distractors from other words
      const distractorPool = pool.map(v => v.word);
      const distractors = distractorPool.filter(w => !correctTokens.includes(w));
      const chosenDistractors = shuffleArray(distractors).slice(0, 3);
      
      const allTokens = shuffleArray([...correctTokens, ...chosenDistractors]);

      questions.push({
        type: "sentence-arrange",
        prompt: `拼湊出翻譯句型：「${sentenceObj.translation}」`,
        correctSentence: sentenceObj.portuguese,
        correctTokens: correctTokens,
        reservoir: allTokens
      });
    }

    return questions;
  }

  function renderQuizQuestion() {
    const q = quizState.questions[quizState.currentIndex];
    
    // Reset checker panel state
    const checker = document.getElementById("quiz-checker-panel");
    checker.className = "quiz-checker-panel";
    document.getElementById("checker-feedback").style.display = "none";
    document.getElementById("quiz-btn-action").textContent = "檢查";
    document.getElementById("quiz-btn-action").className = "btn-cartoon primary";

    quizState.isAnswerChecked = false;
    quizState.selectedOption = null;
    quizState.arrangedWords = [];

    // Set Header Labels
    const progressPercent = ((quizState.currentIndex) / quizState.questions.length) * 100;
    document.getElementById("quiz-progress-bar").style.width = `${progressPercent}%`;
    document.getElementById("quiz-prompt-text").textContent = q.prompt;

    // Toggle view containers
    const optionsGrid = document.getElementById("quiz-options-container");
    const puzzleContainer = document.getElementById("quiz-puzzle-container");
    const listeningContainer = document.getElementById("quiz-listening-container");

    optionsGrid.style.display = "none";
    puzzleContainer.style.display = "none";
    listeningContainer.style.display = "none";

    if (q.type === "image-choice") {
      document.getElementById("quiz-question-type-label").textContent = "看圖選單字";
      optionsGrid.style.display = "grid";
      optionsGrid.className = "options-grid grid-cols-3";
      renderImageOptions(q.options, "word");
    } 
    else if (q.type === "listening-choice") {
      document.getElementById("quiz-question-type-label").textContent = "聽音辨字題";
      listeningContainer.style.display = "flex";
      optionsGrid.style.display = "grid";
      optionsGrid.className = "options-grid grid-cols-3";
      renderImageOptions(q.options, "word");
      
      // Autoplay TTS
      setTimeout(() => {
        AudioEngine.speak(q.correctWord);
      }, 500);

      // Bind speaker button
      document.getElementById("quiz-speaker-btn").onclick = () => {
        AudioEngine.speak(q.correctWord);
      };
    } 
    else if (q.type === "word-select") {
      document.getElementById("quiz-question-type-label").textContent = "單字翻譯題";
      optionsGrid.style.display = "grid";
      optionsGrid.className = "options-grid"; // vertical stack
      renderTextOptions(q.options);
    } 
    else if (q.type === "sentence-arrange") {
      document.getElementById("quiz-question-type-label").textContent = "句型翻譯拼圖";
      puzzleContainer.style.display = "block";
      quizState.reservoirWords = [...q.reservoir];
      renderSentencePuzzle();
    }
  }

  // Render option cards with emojis
  function renderImageOptions(options, compareField) {
    const grid = document.getElementById("quiz-options-container");
    grid.innerHTML = "";

    options.forEach((opt, idx) => {
      const card = document.createElement("div");
      card.className = "option-card";
      
      const emoji = document.createElement("div");
      emoji.className = "option-emoji";
      emoji.textContent = opt.emoji || "📝";
      
      const label = document.createElement("div");
      label.className = "option-label";
      label.textContent = opt.word;

      const index = document.createElement("div");
      index.className = "option-index";
      index.textContent = idx + 1;

      card.appendChild(emoji);
      card.appendChild(label);
      card.appendChild(index);
      grid.appendChild(card);

      card.addEventListener("click", () => {
        if (quizState.isAnswerChecked) return;
        
        // Select logic
        document.querySelectorAll(".option-card").forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
        quizState.selectedOption = opt.word;
        
        // Speak word
        AudioEngine.speak(opt.word);
        AudioEngine.playSFX("click");
      });
    });
  }

  // Render vertical text options
  function renderTextOptions(options) {
    const grid = document.getElementById("quiz-options-container");
    grid.innerHTML = "";

    options.forEach((opt, idx) => {
      const card = document.createElement("div");
      card.className = "option-card";
      card.style.flexDirection = "row";
      card.style.justifyContent = "space-between";
      card.style.padding = "20px";

      const label = document.createElement("div");
      label.className = "option-label";
      label.textContent = opt.word;

      const index = document.createElement("div");
      index.className = "option-index";
      index.textContent = idx + 1;
      index.style.position = "static";

      card.appendChild(label);
      card.appendChild(index);
      grid.appendChild(card);

      card.addEventListener("click", () => {
        if (quizState.isAnswerChecked) return;

        document.querySelectorAll(".option-card").forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
        quizState.selectedOption = opt.word;
        AudioEngine.playSFX("click");
      });
    });
  }

  // Render word puzzle area
  function renderSentencePuzzle() {
    const tray = document.getElementById("quiz-sentence-tray");
    const reservoir = document.getElementById("quiz-word-reservoir");

    tray.innerHTML = "";
    reservoir.innerHTML = "";

    // Render arranged tokens
    quizState.arrangedWords.forEach((word, idx) => {
      const chip = document.createElement("div");
      chip.className = "word-chip";
      chip.textContent = word;
      tray.appendChild(chip);

      chip.addEventListener("click", () => {
        if (quizState.isAnswerChecked) return;
        AudioEngine.playSFX("click");
        // Remove from arranged, return to reservoir
        quizState.arrangedWords.splice(idx, 1);
        renderSentencePuzzle();
      });
    });

    // Render available tokens in reservoir
    quizState.reservoirWords.forEach((word) => {
      const chip = document.createElement("div");
      chip.className = "word-chip";
      chip.textContent = word;

      // Count how many times it's been used in the tray
      const usedCount = quizState.arrangedWords.filter(w => w === word).length;
      const totalCount = quizState.reservoirWords.filter(w => w === word).length;

      if (usedCount >= totalCount) {
        chip.classList.add("used");
      } else {
        chip.addEventListener("click", () => {
          if (quizState.isAnswerChecked) return;
          // Pronounce chip if it is a single word
          AudioEngine.speak(word.replace(/[?,.!]/g, ""));
          AudioEngine.playSFX("click");

          quizState.arrangedWords.push(word);
          renderSentencePuzzle();
        });
      }
      reservoir.appendChild(chip);
    });
  }

  // Check / Continue Click Handler
  document.getElementById("quiz-btn-action").addEventListener("click", () => {
    if (quizState.isAnswerChecked) {
      // Continue to next question or end quiz
      advanceQuiz();
    } else {
      // Perform checking
      evaluateAnswer();
    }
  });

  function evaluateAnswer() {
    const q = quizState.questions[quizState.currentIndex];
    let isCorrect = false;
    let feedbackTitle = "";
    let feedbackDetail = "";

    if (q.type === "image-choice" || q.type === "listening-choice") {
      if (!quizState.selectedOption) {
        alert("請選擇一個答案！");
        return;
      }
      isCorrect = quizState.selectedOption.toLowerCase() === q.correctWord.toLowerCase();
      feedbackTitle = isCorrect ? "答對了！ Muito bem!" : "答錯了！ Oh não!";
      feedbackDetail = isCorrect ? "你掌握了這個單字！" : `正確答案是: ${q.correctWord}`;
    } 
    else if (q.type === "word-select") {
      if (!quizState.selectedOption) {
        alert("請選擇一個答案！");
        return;
      }
      isCorrect = quizState.selectedOption === q.correctWord;
      feedbackTitle = isCorrect ? "答對了！ Excelente!" : "答錯了！";
      feedbackDetail = isCorrect ? "非常棒的翻譯能力！" : `正確答案是: ${q.correctWord}`;
    } 
    else if (q.type === "sentence-arrange") {
      if (quizState.arrangedWords.length === 0) {
        alert("請至少選擇一些單字來組合句子！");
        return;
      }
      
      // Join arranged tokens and compare with target sentence (ignoring case, punctuation)
      const userSentence = quizState.arrangedWords.join(" ").toLowerCase().replace(/[?,.!]/g, "").trim();
      const targetSentence = q.correctSentence.toLowerCase().replace(/[?,.!]/g, "").trim();
      
      isCorrect = userSentence === targetSentence;
      feedbackTitle = isCorrect ? "答對了！ Fantástico!" : "答錯了！";
      feedbackDetail = isCorrect ? "完美的句型結構！" : `正確答案是: ${q.correctSentence}`;

      // Speak the correct sentence
      AudioEngine.speak(q.correctSentence);
    }

    // Update screen feedback state
    quizState.isAnswerChecked = true;
    quizState.isAnswerCorrect = isCorrect;

    const checker = document.getElementById("quiz-checker-panel");
    const feedbackTitleEl = document.getElementById("checker-feedback-title");
    const feedbackDetailEl = document.getElementById("checker-feedback-detail");
    const feedbackIconEl = document.getElementById("checker-feedback-icon");
    const btnAction = document.getElementById("quiz-btn-action");

    if (isCorrect) {
      checker.classList.add("correct");
      feedbackTitleEl.textContent = feedbackTitle;
      feedbackDetailEl.textContent = feedbackDetail;
      feedbackIconEl.textContent = "✔";
      btnAction.textContent = "繼續";
      btnAction.className = "btn-cartoon primary";
      AudioEngine.playSFX("correct");
      sayMascot("做得好！離下一關又更近一步了！🎉");
    } else {
      checker.classList.add("incorrect");
      feedbackTitleEl.textContent = feedbackTitle;
      feedbackDetailEl.textContent = feedbackDetail;
      feedbackIconEl.textContent = "✖";
      btnAction.textContent = "繼續";
      btnAction.className = "btn-cartoon primary"; // keep standard layout
      AudioEngine.playSFX("wrong");
      
      // Lose a heart
      quizState.hearts--;
      renderHearts();
      sayMascot("沒關係，失敗是成功之母！多複習幾次就記住了！💪");
    }

    document.getElementById("checker-feedback").style.display = "flex";
  }

  function advanceQuiz() {
    if (quizState.hearts <= 0) {
      // Out of hearts, fail quiz
      alert("💔 紅心用完了！不用氣餒，再多學習單字後重新挑戰吧！");
      showScreen("map");
      renderMapNodes();
      mascotRandomSpeak();
      return;
    }

    if (quizState.currentIndex < quizState.questions.length - 1) {
      quizState.currentIndex++;
      renderQuizQuestion();
    } else {
      // Quiz completed!
      completeLevelChallenge();
    }
  }

  function completeLevelChallenge() {
    // Unlock next level
    unlockNextLevel(state.currentLevelId);
    
    // Add rewards
    state.xp += 15;
    state.diamonds += 3;
    commitPracticeDay();
    saveProgress();
    renderStats();

    // Show Victory screen
    document.getElementById("victory-subtitle-text").textContent = "你順利通過了這個關卡的挑戰測驗！";
    document.getElementById("victory-xp-gain").textContent = "+15";
    document.getElementById("victory-diamonds-gain").textContent = "+3";
    AudioEngine.playSFX("victory");
    showScreen("victory");
  }

  // Exit Quiz button
  document.getElementById("quiz-btn-close").addEventListener("click", () => {
    if (confirm("🚪 確定要離開測驗嗎？目前的進度將不會被保存喔！")) {
      showScreen("map");
      renderMapNodes();
      mascotRandomSpeak();
      AudioEngine.playSFX("click");
    }
  });

  // --- Victory Screen Buttons ---
  document.getElementById("victory-btn-continue").addEventListener("click", () => {
    AudioEngine.playSFX("click");
    showScreen("map");
    renderMapNodes();
    mascotRandomSpeak();
  });

  document.getElementById("victory-btn-replay").addEventListener("click", () => {
    AudioEngine.playSFX("click");
    startQuiz(state.currentLevelId);
  });

  // Helper shuffle function
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // --- Startup Initialization ---
  loadProgress();
  renderMapNodes();
  mascotRandomSpeak();

  // Allow Web Audio context initialization on first click
  document.body.addEventListener("click", () => {
    AudioEngine.init();
  }, { once: true });
});
