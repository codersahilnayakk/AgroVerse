import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import chatbotService from '../../services/chatbotService';
import {
  isSTTSupported,
  isTTSSupported,
  startListening,
  stopListening,
  speakText,
  stopSpeaking,
} from '../../utils/speechUtils';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const SUPPORTED_LANGUAGES = [
  { code: 'en-IN', label: 'EN', full: 'English' },
  { code: 'hi-IN', label: 'हि', full: 'Hindi' },
  { code: 'mr-IN', label: 'म', full: 'Marathi' },
  { code: 'te-IN', label: 'తె', full: 'Telugu' },
  { code: 'ta-IN', label: 'த', full: 'Tamil' },
  { code: 'kn-IN', label: 'ಕ', full: 'Kannada' },
  { code: 'gu-IN', label: 'ગુ', full: 'Gujarati' },
  { code: 'pa-IN', label: 'ਪੰ', full: 'Punjabi' },
  { code: 'bn-IN', label: 'বা', full: 'Bengali' },
  { code: 'ml-IN', label: 'മ', full: 'Malayalam' },
];

const WELCOME_MESSAGE = {
  role: 'model',
  text: '🌾 **Namaste! I am Krishi Mitra** (कृषि मित्र), your farming assistant.\n\nI can help you with:\n- 💰 Government schemes & subsidies\n- 🌱 Crop recommendations\n- 💧 Irrigation advice\n- 🧪 Soil & fertilizer tips\n\nAsk me anything about farming, or tap a button below!',
};

const QUICK_ACTIONS = [
  { label: '🌾 Crop Help', action: 'crop_help' },
  { label: '💰 Schemes', query: 'Show me available government schemes for farmers' },
  { label: '💧 Irrigation', query: 'What irrigation schemes and methods are available?' },
  { label: '🧪 Soil Tips', query: 'Give me soil management and fertilizer advice' },
];

// ─────────────────────────────────────────────────────────────────────────────
// MARKDOWN LINK PARSER
// ─────────────────────────────────────────────────────────────────────────────

const parseMessageContent = (text) => {
  if (!text) return null;

  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  let keyIdx = 0;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <span key={`t-${keyIdx++}`}>
          {renderBoldAndNewlines(text.slice(lastIndex, match.index))}
        </span>
      );
    }

    const linkText = match[1];
    const linkUrl = match[2];

    if (linkUrl.startsWith('/')) {
      parts.push(
        <Link
          key={`l-${keyIdx++}`}
          to={linkUrl}
          className="text-green-600 font-semibold underline underline-offset-2 hover:text-green-800 transition-colors"
        >
          {linkText}
        </Link>
      );
    } else {
      parts.push(
        <a
          key={`a-${keyIdx++}`}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline underline-offset-2 hover:text-blue-800 transition-colors"
        >
          {linkText}
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(
      <span key={`t-${keyIdx++}`}>
        {renderBoldAndNewlines(text.slice(lastIndex))}
      </span>
    );
  }

  return parts.length > 0 ? parts : renderBoldAndNewlines(text);
};

const renderBoldAndNewlines = (text) => {
  if (!text) return null;

  const boldRegex = /\*\*([^*]+)\*\*/g;
  const segments = [];
  let lastIdx = 0;
  let m;
  let k = 0;

  while ((m = boldRegex.exec(text)) !== null) {
    if (m.index > lastIdx) {
      segments.push(renderNewlines(text.slice(lastIdx, m.index), `p-${k++}`));
    }
    segments.push(
      <strong key={`b-${k++}`} className="font-semibold">
        {m[1]}
      </strong>
    );
    lastIdx = m.index + m[0].length;
  }

  if (lastIdx < text.length) {
    segments.push(renderNewlines(text.slice(lastIdx), `p-${k++}`));
  }

  return segments;
};

const renderNewlines = (text, keyPrefix) => {
  if (!text.includes('\n')) return text;
  return text.split('\n').map((line, i, arr) => (
    <React.Fragment key={`${keyPrefix}-${i}`}>
      {line}
      {i < arr.length - 1 && <br />}
    </React.Fragment>
  ));
};

// ─────────────────────────────────────────────────────────────────────────────
// CHAT WINDOW COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const ChatWindow = ({ onClose }) => {
  // ── State ──
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en-IN');
  const [isListening, setIsListening] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);

  // Crop Help flow state
  const [activeFlow, setActiveFlow] = useState(null); // null | { type: 'crop_help', step, data }

  // ── Refs ──
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const langPickerRef = useRef(null);

  // ── Auto-scroll ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // ── Cleanup ──
  useEffect(() => {
    return () => {
      stopListening();
      stopSpeaking();
    };
  }, []);

  // ── Close lang picker on outside click ──
  useEffect(() => {
    const handler = (e) => {
      if (langPickerRef.current && !langPickerRef.current.contains(e.target)) {
        setShowLangPicker(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Start New Chat ──
  const handleNewChat = useCallback(() => {
    stopSpeaking();
    setMessages([WELCOME_MESSAGE]);
    setSessionId(null);
    setInputText('');
    setIsLoading(false);
    setActiveFlow(null);
  }, []);

  // ── Crop Help Flow handler ──
  const handleCropHelpStep = useCallback(
    async (step, value) => {
      setIsLoading(true);

      // Build flow data based on current state + new selection
      let flowData = activeFlow?.data || {};
      if (step === 'soil') flowData = { ...flowData, soilType: value };
      else if (step === 'season') flowData = { ...flowData, season: value };
      else if (step === 'waterLevel') flowData = { ...flowData, waterLevel: value };

      // Add user's selection as a message
      if (value) {
        setMessages((prev) => [...prev, { role: 'user', text: value }]);
      }

      try {
        // Determine the API step name
        let apiStep = step;
        if (step === 'waterLevel') apiStep = 'result';

        const data = await chatbotService.cropHelpFlow(apiStep, flowData, sessionId, selectedLanguage);

        if (data.sessionId) setSessionId(data.sessionId);

        // Add bot response with options
        const botMsg = {
          role: 'model',
          text: data.response,
          options: data.options || [],
          flowType: data.flowType,
          flowStep: data.flowStep,
          flowData: data.flowData,
        };
        setMessages((prev) => [...prev, botMsg]);

        // Update flow state
        if (data.flowStep === 'done') {
          setActiveFlow(null);
        } else {
          setActiveFlow({
            type: 'crop_help',
            step: data.flowStep,
            data: data.flowData || flowData,
          });
        }
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          { role: 'model', text: '❌ Sorry, something went wrong. Please try again.' },
        ]);
        setActiveFlow(null);
      } finally {
        setIsLoading(false);
      }
    },
    [activeFlow, sessionId]
  );

  // ── Handle option button click (from crop help flow) ──
  const handleOptionClick = useCallback(
    (option, msg) => {
      if (isLoading) return;

      const flowStep = msg.flowStep;
      if (flowStep === 'soil') {
        handleCropHelpStep('soil', option.value);
      } else if (flowStep === 'season') {
        handleCropHelpStep('season', option.value);
      } else if (flowStep === 'waterLevel') {
        handleCropHelpStep('waterLevel', option.value);
      }
    },
    [isLoading, handleCropHelpStep]
  );

  // ── Send text message handler ──
  const handleSend = useCallback(
    async (text, isVoice = false) => {
      const query = (text || inputText).trim();
      if (!query || isLoading) return;

      setInputText('');

      const userMsg = { role: 'user', text: query, isVoiceInitiated: isVoice };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const data = await chatbotService.sendMessage(
          query,
          selectedLanguage,
          isVoice,
          sessionId
        );

        if (data.sessionId) setSessionId(data.sessionId);

        const botMsg = { role: 'model', text: data.response };
        setMessages((prev) => [...prev, botMsg]);

        if (isVoice && isTTSSupported()) {
          speakText(data.response, selectedLanguage);
        }
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          { role: 'model', text: '❌ Sorry, I could not process your request right now. Please try again in a moment.' },
        ]);
      } finally {
        setIsLoading(false);
        inputRef.current?.focus();
      }
    },
    [inputText, isLoading, selectedLanguage, sessionId]
  );

  // ── Quick action click handler ──
  const handleQuickAction = useCallback(
    (action) => {
      if (isLoading) return;

      if (action.action === 'crop_help') {
        // Start guided crop help flow
        setActiveFlow({ type: 'crop_help', step: 'start', data: {} });
        handleCropHelpStep('start', null);
      } else if (action.query) {
        handleSend(action.query, false);
      }
    },
    [isLoading, handleCropHelpStep, handleSend]
  );

  // ── Keyboard submit ──
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Voice toggle ──
  const toggleVoice = () => {
    if (isListening) {
      stopListening();
      setIsListening(false);
      return;
    }

    if (!isSTTSupported()) {
      setMessages((prev) => [
        ...prev,
        { role: 'model', text: '🎤 Voice input is not supported in this browser. Please use **Chrome** or **Edge**.' },
      ]);
      return;
    }

    setIsListening(true);
    recognitionRef.current = startListening(
      selectedLanguage,
      (transcript) => {
        setIsListening(false);
        handleSend(transcript, true);
      },
      (errorMessage) => {
        setIsListening(false);
        setMessages((prev) => [
          ...prev,
          { role: 'model', text: `🎤 ${errorMessage}` },
        ]);
      }
    );
  };

  // ── Read aloud ──
  const handleReadAloud = (text) => {
    if (isTTSSupported()) speakText(text, selectedLanguage);
  };

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage);

  // ── Render ──
  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col w-[370px] h-[580px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
      style={{ maxWidth: 'calc(100vw - 2rem)' }}
    >
      {/* ═══════════ HEADER ═══════════ */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌾</span>
          <div>
            <h3 className="text-sm font-bold leading-tight">Krishi Mitra</h3>
            <p className="text-[10px] opacity-80">AI Farming Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleNewChat}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
            title="Start new chat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
            title="Close chat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* ═══════════ MESSAGES ═══════════ */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50/50">
        {messages.map((msg, idx) => (
          <div key={idx}>
            {/* Message bubble */}
            <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`relative max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-green-600 text-white rounded-br-md'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md shadow-sm'
                }`}
              >
                {msg.isVoiceInitiated && (
                  <span className="inline-block mr-1 text-xs opacity-70" title="Voice message">🎤</span>
                )}
                <div className="whitespace-pre-wrap break-words">
                  {parseMessageContent(msg.text)}
                </div>
                {msg.role === 'model' && isTTSSupported() && (
                  <button
                    onClick={() => handleReadAloud(msg.text)}
                    className="absolute -bottom-1 -right-1 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 border border-gray-200 text-gray-400 hover:text-green-600 hover:border-green-300 transition-all text-xs"
                    title="Read aloud"
                  >
                    🔊
                  </button>
                )}
              </div>
            </div>

            {/* ── Option buttons (from crop help flow) ── */}
            {msg.role === 'model' && msg.options && msg.options.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2 ml-1">
                {msg.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleOptionClick(opt, msg)}
                    disabled={isLoading || activeFlow?.step !== msg.flowStep}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      activeFlow?.step === msg.flowStep
                        ? 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100 hover:border-green-400 cursor-pointer'
                        : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                    } disabled:opacity-50`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* ── In-chat Quick Actions ── */}
        {!isLoading && !activeFlow && (
          <div className="flex flex-wrap gap-1.5 pt-1 pb-1">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                onClick={() => handleQuickAction(action)}
                className="text-xs px-2.5 py-1.5 rounded-full bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 hover:border-green-300 transition-all whitespace-nowrap"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-xs text-gray-400 ml-2">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ═══════════ INPUT AREA ═══════════ */}
      <div className="shrink-0 border-t border-gray-200 bg-white px-3 py-2.5">
        <div className="flex items-end gap-1.5">
          {/* Language picker */}
          <div className="relative shrink-0" ref={langPickerRef}>
            <button
              onClick={() => setShowLangPicker(!showLangPicker)}
              className={`w-9 h-9 flex items-center justify-center rounded-full transition-all focus:outline-none ${
                showLangPicker
                  ? 'bg-green-100 text-green-700 ring-2 ring-green-300'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-green-600'
              }`}
              title={`Voice language: ${currentLang?.full || 'English'}`}
            >
              <span className="text-sm font-medium">{currentLang?.label || '🌐'}</span>
            </button>

            {showLangPicker && (
              <div className="absolute bottom-11 left-0 bg-white border border-gray-200 rounded-xl shadow-xl p-2 grid grid-cols-2 gap-1 w-44 z-50">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLanguage(lang.code);
                      setShowLangPicker(false);
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                      selectedLanguage === lang.code
                        ? 'bg-green-100 text-green-800 font-semibold'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span className="font-medium text-sm">{lang.label}</span>
                    <span className="text-gray-500">{lang.full}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mic button */}
          <button
            onClick={toggleVoice}
            disabled={isLoading}
            className={`shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-all focus:outline-none ${
              isListening
                ? 'bg-red-500 text-white animate-pulse shadow-md'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-green-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={isListening ? 'Stop listening' : `Voice input (${currentLang?.full})`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {isListening ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              )}
            </svg>
          </button>

          {/* Text input */}
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            maxLength={500}
            placeholder={
              isListening
                ? 'Listening...'
                : activeFlow
                ? 'Select an option above, or type here...'
                : 'Ask about schemes, crops...'
            }
            disabled={isLoading || isListening}
            className="flex-1 resize-none rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 disabled:opacity-50 disabled:bg-gray-100 transition-colors"
            style={{ maxHeight: '80px' }}
          />

          {/* Send button */}
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isLoading}
            className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-green-600 text-white hover:bg-green-700 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-400"
            title="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
