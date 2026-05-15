/**
 * Speech utilities using the native Web Speech API.
 * 100% free — no external services, no API keys.
 *
 * STT: window.SpeechRecognition  (Chrome, Edge)
 * TTS: window.speechSynthesis    (Chrome, Edge, Firefox, Safari)
 */

// ─────────────────────────────────────────────────────────────────────────────
// Feature detection
// ─────────────────────────────────────────────────────────────────────────────

const SpeechRecognition =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

/**
 * Check if the browser supports Speech-to-Text (SpeechRecognition).
 */
export const isSTTSupported = () => !!SpeechRecognition;

/**
 * Check if the browser supports Text-to-Speech (SpeechSynthesis).
 */
export const isTTSSupported = () =>
  typeof window !== 'undefined' && 'speechSynthesis' in window;

// ─────────────────────────────────────────────────────────────────────────────
// STT — Speech-to-Text
// ─────────────────────────────────────────────────────────────────────────────

let activeRecognition = null;

/**
 * Start listening for voice input.
 *
 * @param {string}   language  BCP-47 code, e.g. 'hi-IN'
 * @param {Function} onResult  Called with the final transcript string
 * @param {Function} onError   Called with an error message string
 * @returns {Object|null}      The SpeechRecognition instance (call .stop() to cancel), or null if unsupported
 */
export const startListening = (language, onResult, onError) => {
  if (!SpeechRecognition) {
    onError('Voice input is not supported in this browser. Please use Chrome or Edge.');
    return null;
  }

  // Stop any currently-active recognition first
  if (activeRecognition) {
    try { activeRecognition.abort(); } catch (_) { /* ignore */ }
    activeRecognition = null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = language;
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  // Guard flag: ensures onResult is invoked at most ONCE per session.
  // Chrome (especially for en-IN) can fire `onresult` multiple times with
  // a growing `event.results` array, each entry being a partial transcript.
  // Without this guard, every fire would call handleSend → duplicate messages.
  let resultHandled = false;

  recognition.onresult = (event) => {
    if (resultHandled) return;          // already processed – ignore further fires
    resultHandled = true;

    // Read the LAST (most complete) result, not always index 0
    const lastIdx = event.results.length - 1;
    const result  = event.results[lastIdx];

    // Extra safety: only use final results (should always be true when
    // interimResults is false, but Chrome doesn't always honour that)
    if (result && result.isFinal) {
      const transcript = result[0]?.transcript;
      if (transcript) {
        onResult(transcript);
      } else {
        onError('Could not understand the audio. Please try again.');
      }
    } else {
      // Non-final result slipped through – wait for the final one
      resultHandled = false;
    }
  };

  recognition.onerror = (event) => {
    activeRecognition = null;
    switch (event.error) {
      case 'no-speech':
        onError('No speech detected. Please try again.');
        break;
      case 'audio-capture':
        onError('No microphone found. Please connect a microphone.');
        break;
      case 'not-allowed':
        onError('Microphone access denied. Please allow microphone permission in your browser settings.');
        break;
      case 'network':
        onError('Network error during speech recognition. Please check your connection.');
        break;
      default:
        onError(`Speech recognition error: ${event.error}`);
    }
  };

  recognition.onend = () => {
    // Only clear after result has been handled or an error occurred
    activeRecognition = null;
  };

  try {
    recognition.start();
    activeRecognition = recognition;
  } catch (err) {
    onError('Failed to start voice recognition. Please try again.');
    return null;
  }

  return recognition;
};

/**
 * Stop any currently running recognition.
 */
export const stopListening = () => {
  if (activeRecognition) {
    try { activeRecognition.stop(); } catch (_) { /* ignore */ }
    activeRecognition = null;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// TTS — Text-to-Speech
// ─────────────────────────────────────────────────────────────────────────────

// Pre-load voices to fix the Chrome/Edge silent bug
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

/**
 * Auto-detect the language of the text based on Unicode blocks.
 * Preserves the selected language if it matches the detected script.
 */
const detectLanguage = (text, defaultLang) => {
  const isDevanagari = /[\u0900-\u097F]/.test(text);
  if (isDevanagari) {
    // Marathi (mr-IN) and Hindi (hi-IN) both use Devanagari
    if (defaultLang === 'mr-IN' || defaultLang === 'hi-IN') return defaultLang;
    return 'hi-IN';
  }
  if (/[\u0A00-\u0A7F]/.test(text)) return 'pa-IN'; // Gurmukhi (Punjabi)
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta-IN'; // Tamil
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te-IN'; // Telugu
  if (/[\u0980-\u09FF]/.test(text)) return 'bn-IN'; // Bengali
  if (/[\u0C80-\u0CFF]/.test(text)) return 'kn-IN'; // Kannada
  if (/[\u0D00-\u0D7F]/.test(text)) return 'ml-IN'; // Malayalam
  if (/[\u0A80-\u0AFF]/.test(text)) return 'gu-IN'; // Gujarati
  return defaultLang;
};

/**
 * Speak the given text aloud in the specified language.
 * Cancels any currently playing speech before starting.
 *
 * @param {string} text     Text to read aloud
 * @param {string} defaultLanguage BCP-47 code, e.g. 'ta-IN'
 */
export const speakText = (text, defaultLanguage = 'en-IN') => {
  if (!isTTSSupported()) return;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Clean markdown-ish formatting so it sounds natural
  const cleanText = text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')   // [link text](url) → link text
    .replace(/\*\*([^*]+)\*\*/g, '$1')          // **bold** → bold
    .replace(/\*([^*]+)\*/g, '$1')              // *italic* → italic
    .replace(/#{1,6}\s?/g, '')                  // ### heading → heading
    .replace(/[-*]\s/g, '')                     // bullet points
    .replace(/\n{2,}/g, '. ')                   // double newlines → pause
    .replace(/\n/g, ' ')                        // single newlines → space
    .trim();

  if (!cleanText) return;

  // Auto-detect the actual script used in the text to prevent silent failures
  const actualLang = detectLanguage(cleanText, defaultLanguage);

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = actualLang;
  utterance.rate = 0.9;
  utterance.pitch = 1.0;

  // Try to find the best voice for this language
  const voices = window.speechSynthesis.getVoices();
  const langPrefix = actualLang.split('-')[0]; // 'hi' from 'hi-IN'
  
  // Look for exact regional match first, then generic prefix match
  const exactMatch = voices.find((v) => v.lang === actualLang);
  const prefixMatch = voices.find((v) => v.lang.startsWith(langPrefix));
  
  // Preferred Google cloud voices for Indian languages
  const googleVoice = voices.find((v) => v.name.includes('Google') && v.lang.startsWith(langPrefix));

  if (googleVoice) {
    utterance.voice = googleVoice;
  } else if (exactMatch) {
    utterance.voice = exactMatch;
  } else if (prefixMatch) {
    utterance.voice = prefixMatch;
  }

  window.speechSynthesis.speak(utterance);
};

/**
 * Stop any currently playing TTS.
 */
export const stopSpeaking = () => {
  if (isTTSSupported()) {
    window.speechSynthesis.cancel();
  }
};
