import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage, RehearsalSession } from '../types';
import { ArchetypeAvatar } from './ArchetypeAvatar';
import { UserAvatar } from './UserAvatar';
import { User } from '../services/firebase';

interface LiveRehearsalScreenProps {
  session: RehearsalSession;
  onSendMessage: (messageText: string) => Promise<void>;
  onEndRehearsal: () => Promise<void>;
  onExitWithoutEnding: () => void;
  isSending: boolean;
  user?: User | null;
}

export const LiveRehearsalScreen: React.FC<LiveRehearsalScreenProps> = ({
  session,
  onSendMessage,
  onEndRehearsal,
  onExitWithoutEnding,
  isSending,
  user,
}) => {
  const [inputText, setInputText] = useState('');
  const [isEnding, setIsEnding] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll to bottom when new messages arrive or typing status changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session.messages, isSending]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isSending || isEnding) return;

    const textToSend = inputText.trim();
    setInputText('');

    if (textToSend === '[END REHEARSAL]') {
      handleEndSession();
      return;
    }

    await onSendMessage(textToSend);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEndSession = async () => {
    setIsEnding(true);
    await onEndRehearsal();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#fbfbfa] text-[#1c1c1a] font-sans h-screen w-screen overflow-hidden">
      {/* 1. SLIM TOP BAR (WhatsApp style, restrained cream/ink palette) */}
      <header className="h-14 border-b border-[#e8e8e3] bg-[#fbfbfa]/95 backdrop-blur-sm px-4 sm:px-6 flex items-center justify-between shrink-0 z-10 shadow-2xs">
        {/* Left: Exit/Back button */}
        <button
          onClick={() => setShowExitConfirm(true)}
          className="flex items-center gap-1.5 text-xs text-[#52524e] hover:text-[#1c1c1a] font-medium py-1.5 px-2.5 rounded-md hover:bg-[#f4f4f0] transition-colors cursor-pointer"
          id="rehearsal-exit-btn"
        >
          <span className="text-sm">←</span>
          <span>Exit</span>
        </button>

        {/* Center: Archetype avatar & title */}
        <div className="flex items-center gap-2.5 min-w-0 text-center">
          <ArchetypeAvatar id={session.archetypeId} size="md" />
          <div className="min-w-0 text-left">
            <div className="flex items-center gap-1.5 leading-tight">
              <h2 className="font-serif text-sm font-semibold text-[#1c1c1a] truncate">
                {session.archetypeName}
              </h2>
              {session.language && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#f4f4f0] text-[#334155] border border-[#e2e2dc] font-sans font-medium shrink-0">
                  {session.language}
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#73736c] truncate max-w-[180px] sm:max-w-xs font-normal">
              "{session.situation}"
            </p>
          </div>
        </div>

        {/* Right: End Rehearsal Primary Action */}
        <button
          onClick={handleEndSession}
          disabled={isEnding || session.messages.length < 2}
          className={`text-xs px-3.5 py-1.5 rounded-md border font-medium transition-all ${
            isEnding
              ? 'bg-[#f4f4f0] text-[#a3a39c] border-[#e2e2dc] cursor-wait'
              : session.messages.length < 2
              ? 'bg-[#f8f8f6] text-[#a3a39c] border-[#e8e8e3] cursor-not-allowed opacity-60'
              : 'bg-white hover:bg-[#fef2f2] text-[#991b1b] border-[#fecaca] hover:border-[#f87171] cursor-pointer shadow-2xs'
          }`}
          id="end-rehearsal-top-btn"
          title={session.messages.length < 2 ? 'Have at least one exchange before ending' : 'End rehearsal and analyze performance'}
        >
          {isEnding ? 'Analyzing...' : 'End rehearsal'}
        </button>
      </header>

      {/* 2. MAIN CHAT CONTAINER */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4 max-w-3xl mx-auto w-full">
        {session.messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-center py-12 px-4 space-y-3 flex flex-col items-center"
          >
            <ArchetypeAvatar id={session.archetypeId} size="xl" className="mb-2" />
            <p className="font-serif text-lg text-[#1c1c1a]">The space is quiet.</p>
            <p className="text-xs text-[#73736c] max-w-md mx-auto leading-relaxed">
              Type your opening statement below to begin speaking with{' '}
              <strong className="text-[#1c1c1a]">{session.archetypeName}</strong>. State your boundary or concern as you intend to in real life.
            </p>
          </motion.div>
        ) : (
          <AnimatePresence initial={false}>
            {session.messages.map((msg: ChatMessage) => {
              const isUser = msg.role === 'user';

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {/* AI Circular Avatar */}
                  {!isUser && (
                    <ArchetypeAvatar id={session.archetypeId} size="sm" className="mt-0.5" />
                  )}

                  {/* Message Bubble */}
                  <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[75%]`}>
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        isUser
                          ? 'bg-[#334155] text-white rounded-tr-xs font-normal shadow-2xs'
                          : 'bg-[#f4f4f0] text-[#1c1c1a] border border-[#e2e2dc] rounded-tl-xs font-serif shadow-2xs'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>

                    <span className="text-[10px] text-[#94948d] mt-1 px-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* User Circular Avatar */}
                  {isUser && (
                    <UserAvatar user={user} size="sm" className="mt-0.5" />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}

        {/* Typing indicator (3 animated dots in AI bubble) */}
        {isSending && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="flex items-start gap-2.5 justify-start"
          >
            <ArchetypeAvatar id={session.archetypeId} size="sm" className="mt-0.5" />

            <div className="bg-[#f4f4f0] border border-[#e2e2dc] rounded-2xl rounded-tl-xs px-4 py-3 flex items-center gap-1.5 shadow-2xs">
              <motion.span
                animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
                className="w-1.5 h-1.5 rounded-full bg-[#52524e]"
              />
              <motion.span
                animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                className="w-1.5 h-1.5 rounded-full bg-[#52524e]"
              />
              <motion.span
                animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                className="w-1.5 h-1.5 rounded-full bg-[#52524e]"
              />
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. FIXED BOTTOM MESSAGE INPUT BAR */}
      <footer className="border-t border-[#e8e8e3] bg-white p-3 sm:p-4 shrink-0 shadow-lg">
        <div className="max-w-3xl mx-auto w-full">
          <form onSubmit={handleSend} className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSending || isEnding}
              placeholder={
                session.messages.length === 0
                  ? "Type your opening line... (Press Enter to send)"
                  : "Type your message..."
              }
              rows={2}
              className="flex-1 bg-[#fbfbfa] border border-[#e8e8e3] focus:border-[#334155] focus:bg-white rounded-xl p-3 text-sm text-[#1c1c1a] placeholder-[#94948d] focus:outline-none resize-none transition-all"
              id="rehearsal-chat-input"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isSending || isEnding}
              className={`px-5 py-3 rounded-xl text-xs font-medium transition-all ${
                !inputText.trim() || isSending || isEnding
                  ? 'bg-[#e8e8e3] text-[#a3a39c] cursor-not-allowed'
                  : 'bg-[#334155] hover:bg-[#1e293b] text-white shadow-xs cursor-pointer'
              }`}
              id="rehearsal-chat-send-btn"
            >
              Send
            </button>
          </form>

          <div className="flex items-center justify-between px-1 pt-1.5 text-[11px] text-[#73736c]">
            <span>Shift + Enter for new line</span>
            {session.messages.length >= 2 && (
              <button
                type="button"
                onClick={handleEndSession}
                className="text-[#334155] font-semibold hover:underline cursor-pointer"
              >
                Ready for debrief? Click "End rehearsal"
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-[#e8e8e3] rounded-xl p-6 max-w-sm w-full shadow-lg space-y-4 text-left"
          >
            <h3 className="font-serif text-lg font-semibold text-[#1c1c1a]">
              Exit this rehearsal?
            </h3>
            <p className="text-xs text-[#52524e] leading-relaxed">
              Your transcript so far will be saved in your past rehearsals history.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="px-4 py-2 border border-[#d8d8d2] text-xs font-medium rounded-md hover:bg-[#f4f4f0] cursor-pointer"
              >
                Continue practicing
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  onExitWithoutEnding();
                }}
                className="px-4 py-2 bg-[#334155] text-white text-xs font-medium rounded-md hover:bg-[#1e293b] cursor-pointer"
              >
                Yes, exit
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
