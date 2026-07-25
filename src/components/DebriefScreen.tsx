import React, { useState } from 'react';
import { motion } from 'motion/react';
import { RehearsalSession } from '../types';

interface DebriefScreenProps {
  session: RehearsalSession;
  onRestartSameSituation: () => void;
  onNewRehearsal: () => void;
}

export const DebriefScreen: React.FC<DebriefScreenProps> = ({
  session,
  onRestartSameSituation,
  onNewRehearsal,
}) => {
  const [showTranscript, setShowTranscript] = useState(false);
  const debrief = session.debrief;

  if (!debrief) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="font-serif text-xl text-[#1c1c1a] mb-2">Analyzing your rehearsal...</p>
        <p className="text-xs text-[#73736c]">Reviewing transcript to prepare your honest debrief.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Header Area */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="border-b border-[#e8e8e3] pb-6"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#52524e] bg-[#f4f4f0] px-2.5 py-0.5 rounded-md border border-[#e2e2dc]">
            Session Debrief
          </span>
          <span className="text-xs text-[#73736c]">
            {new Date(session.updatedAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl text-[#1c1c1a] font-normal tracking-tight mb-2" id="debrief-heading">
          Debrief
        </h1>

        <p className="text-sm text-[#52524e] font-medium">
          Situation: <span className="text-[#1c1c1a] font-normal">"{session.situation}"</span>
        </p>
        <p className="text-xs text-[#73736c] mt-1 flex items-center gap-2">
          <span>Opponent archetype: <strong className="text-[#52524e]">{session.archetypeName}</strong></span>
          {session.language && (
            <span className="text-[10px] font-medium text-[#334155] bg-[#f0f4f8] px-2 py-0.5 rounded border border-[#cbd5e1]">
              {session.language}
            </span>
          )}
        </p>
      </motion.div>

      {/* SECTION 1: Where you were strong (Delay 0.1s) */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="bg-white border border-[#e8e8e3] rounded-xl p-5 sm:p-6 shadow-2xs"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-[#10b981]" />
          <h2 className="font-serif text-xl font-semibold text-[#1c1c1a]">
            Where you were strong
          </h2>
        </div>

        <div className="space-y-4">
          {debrief.strongMoments && debrief.strongMoments.length > 0 ? (
            debrief.strongMoments.map((moment, idx) => (
              <div key={idx} className="p-4 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg">
                <blockquote className="text-xs sm:text-sm font-serif italic text-[#166534] mb-2 pl-3 border-l-2 border-[#16a34a]">
                  "{moment.quote}"
                </blockquote>
                <p className="text-xs text-[#14532d] leading-relaxed">
                  {moment.explanation}
                </p>
              </div>
            ))
          ) : (
            <p className="text-xs text-[#73736c]">
              No clear strong moments identified in this session.
            </p>
          )}
        </div>
      </motion.section>

      {/* SECTION 2: Where you lost ground (Delay 0.25s) */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.25 }}
        className="bg-white border border-[#e8e8e3] rounded-xl p-5 sm:p-6 shadow-2xs"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
          <h2 className="font-serif text-xl font-semibold text-[#1c1c1a]">
            Where you lost ground
          </h2>
        </div>

        <div className="space-y-4">
          {debrief.lostGroundMoments && debrief.lostGroundMoments.length > 0 ? (
            debrief.lostGroundMoments.map((moment, idx) => (
              <div key={idx} className="p-4 bg-[#fffbeb] border border-[#fef3c7] rounded-lg">
                <blockquote className="text-xs sm:text-sm font-serif italic text-[#92400e] mb-2 pl-3 border-l-2 border-[#d97706]">
                  "{moment.quote}"
                </blockquote>
                <p className="text-xs text-[#78350f] leading-relaxed">
                  {moment.explanation}
                </p>
              </div>
            ))
          ) : (
            <p className="text-xs text-[#73736c]">
              You maintained ground consistently throughout this session.
            </p>
          )}
        </div>
      </motion.section>

      {/* SECTION 3: Try saying it like this instead (Delay 0.4s) */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.4 }}
        className="bg-white border border-[#e8e8e3] rounded-xl p-5 sm:p-6 shadow-2xs"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-[#3b82f6]" />
          <h2 className="font-serif text-xl font-semibold text-[#1c1c1a]">
            Try saying it like this instead
          </h2>
        </div>

        <div className="space-y-4">
          {debrief.alternativePhrasings && debrief.alternativePhrasings.length > 0 ? (
            debrief.alternativePhrasings.map((alt, idx) => (
              <div key={idx} className="p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg space-y-2">
                <div className="text-xs text-[#64748b]">
                  <span className="font-semibold uppercase text-[10px] tracking-wider text-[#94a3b8] block mb-1">
                    Instead of:
                  </span>
                  <span className="line-through text-[#475569]">"{alt.originalWeakMoment}"</span>
                </div>

                <div className="text-xs sm:text-sm text-[#0f172a] bg-white p-3 rounded-md border border-[#cbd5e1] font-medium">
                  <span className="font-semibold uppercase text-[10px] tracking-wider text-[#2563eb] block mb-1">
                    Try saying:
                  </span>
                  "{alt.alternative}"
                </div>

                <p className="text-xs text-[#475569] leading-relaxed pt-1">
                  <strong className="text-[#334155]">Why this works better:</strong> {alt.rationale}
                </p>
              </div>
            ))
          ) : (
            <p className="text-xs text-[#73736c]">
              No alternative phrasings generated.
            </p>
          )}
        </div>
      </motion.section>

      {/* SECTION 4: How this might actually go (Delay 0.55s) */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.55 }}
        className="bg-white border border-[#e8e8e3] rounded-xl p-5 sm:p-6 shadow-2xs"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-[#334155]" />
          <h2 className="font-serif text-xl font-semibold text-[#1c1c1a]">
            How this might actually go
          </h2>
        </div>

        <div className="p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-xs sm:text-sm text-[#334155] leading-relaxed">
          {debrief.realWorldPrediction}
        </div>
      </motion.section>

      {/* Toggle View Full Transcript */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.65 }}
        className="bg-white border border-[#e8e8e3] rounded-xl p-5 shadow-2xs"
      >
        <button
          onClick={() => setShowTranscript(!showTranscript)}
          className="w-full flex items-center justify-between text-xs font-semibold text-[#52524e] hover:text-[#1c1c1a] focus:outline-none cursor-pointer"
        >
          <span>{showTranscript ? 'Hide conversation transcript' : 'View full conversation transcript'}</span>
          <span>{showTranscript ? '▲' : '▼'}</span>
        </button>

        {showTranscript && (
          <div className="mt-4 pt-4 border-t border-[#e8e8e3] space-y-3 max-h-96 overflow-y-auto">
            {session.messages.map((m) => (
              <div
                key={m.id}
                className={`p-3 rounded-lg text-xs ${
                  m.role === 'user'
                    ? 'bg-[#f4f4f0] text-[#1c1c1a] ml-4'
                    : 'bg-[#f8fafc] text-[#334155] border border-[#e2e8f0] mr-4 font-serif'
                }`}
              >
                <div className="font-semibold text-[10px] text-[#73736c] uppercase mb-1">
                  {m.role === 'user' ? 'You' : session.archetypeName}
                </div>
                <p className="whitespace-pre-wrap">{m.content}</p>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.75 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4"
      >
        <button
          onClick={onRestartSameSituation}
          className="w-full sm:w-auto px-6 py-3 bg-[#334155] hover:bg-[#1e293b] text-white text-xs font-medium rounded-lg shadow-2xs transition-all cursor-pointer"
          id="re-rehearse-btn"
        >
          Practice this conversation again
        </button>

        <button
          onClick={onNewRehearsal}
          className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-[#f4f4f0] text-[#1c1c1a] border border-[#d8d8d2] text-xs font-medium rounded-lg transition-all cursor-pointer"
          id="new-rehearsal-debrief-btn"
        >
          Start a new conversation
        </button>
      </motion.div>
    </div>
  );
};
