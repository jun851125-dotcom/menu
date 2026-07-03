// Audio Engine for TTS Pronunciation and Web Audio SFX Synthesis
const AudioEngine = (() => {
  let audioCtx = null;
  let englishVoice = null;

  // Initialize Web Audio API Context on demand
  function getAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Load and cache the en-US voice
  function loadVoice() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const voices = window.speechSynthesis.getVoices();
    // Try to find en-US voice
    englishVoice = voices.find(v => v.lang.toLowerCase() === 'en-us' || v.lang.toLowerCase().replace('_', '-') === 'en-us') ||
                   voices.find(v => v.lang.toLowerCase().startsWith('en')) ||
                   null;
  }

  // Set up listener for async loading of voices in some browsers
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoice;
    }
    loadVoice();
  }

  // Pronounce words/sentences using en-US voice
  function speak(text) {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      console.warn("Speech synthesis not supported in this environment.");
      return;
    }

    // Cancel active speaking to avoid queuing delay
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Load voice if not already set
    if (!englishVoice) {
      loadVoice();
    }

    if (englishVoice) {
      utterance.voice = englishVoice;
    } else {
      // Set lang directly if exact voice reference isn't resolved yet
      utterance.lang = 'en-US';
    }

    utterance.rate = 0.85; // Slightly slower for better learning/comprehension
    utterance.pitch = 1.0;
    
    window.speechSynthesis.speak(utterance);
  }

  // Synthesize game sound effects using Web Audio API
  function playSFX(type) {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      switch (type) {
        case 'click': {
          // Playful short pop
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.type = 'sine';
          osc.frequency.setValueAtTime(400, now);
          osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);

          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

          osc.start(now);
          osc.stop(now + 0.05);
          break;
        }

        case 'correct': {
          // High upbeat double-chime (Duolingo style)
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.type = 'triangle';
          // First note
          osc.frequency.setValueAtTime(523.25, now); // C5
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.08, now + 0.08);

          // Second note (perfect fifth/octave higher)
          osc.frequency.setValueAtTime(783.99, now + 0.08); // G5
          gain.gain.setValueAtTime(0.15, now + 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

          osc.start(now);
          osc.stop(now + 0.3);
          break;
        }

        case 'wrong': {
          // Playful negative slide/buzz
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(220, now); // A3
          osc.frequency.linearRampToValueAtTime(110, now + 0.25); // Slide down to A2

          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

          osc.start(now);
          osc.stop(now + 0.25);
          break;
        }

        case 'victory': {
          // Triumphant fanfare
          const notes = [
            { f: 261.63, d: 0.1 }, // C4
            { f: 329.63, d: 0.1 }, // E4
            { f: 392.00, d: 0.1 }, // G4
            { f: 523.25, d: 0.3 }  // C5
          ];

          let timeOffset = 0;
          notes.forEach(note => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(note.f, now + timeOffset);

            gain.gain.setValueAtTime(0.1, now + timeOffset);
            gain.gain.exponentialRampToValueAtTime(0.001, now + timeOffset + note.d);

            osc.start(now + timeOffset);
            osc.stop(now + timeOffset + note.d);
            timeOffset += note.d * 0.8;
          });
          break;
        }

        case 'diamond': {
          // Sparkly high-pitched glass chime
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.type = 'sine';
          osc.frequency.setValueAtTime(987.77, now); // B5
          osc.frequency.exponentialRampToValueAtTime(1975.53, now + 0.15); // B6 slide up

          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

          osc.start(now);
          osc.stop(now + 0.25);
          break;
        }
      }
    } catch (e) {
      console.error("Audio SFX failed to initialize or play: ", e);
    }
  }

  return {
    speak,
    playSFX,
    init: getAudioContext
  };
})();

// Export if in Node context, else define globally
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AudioEngine };
}
