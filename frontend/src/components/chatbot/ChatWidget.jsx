import React, { useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import ChatWindow from './ChatWindow';

/**
 * ChatWidget — Floating Action Button (FAB) + chat panel container.
 * Only renders when the user is authenticated.
 * Placed at a global level in App.jsx so it persists across all routes.
 */
const ChatWidget = () => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  // Don't render anything for unauthenticated visitors
  if (!user) return null;

  return (
    <>
      {/* ── Chat Window ── */}
      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}

      {/* ── Floating Action Button ── */}
      {!isOpen && (
        <button
          id="chatbot-fab"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-green-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-300"
          title="Chat with Krishi Mitra"
          aria-label="Open AI Chat Assistant"
        >
          {/* Wheat / chat icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>

          {/* Pulse ring */}
          <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-30 animate-ping pointer-events-none" />
        </button>
      )}
    </>
  );
};

export default ChatWidget;
