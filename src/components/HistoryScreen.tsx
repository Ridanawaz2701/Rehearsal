import React, { useState } from 'react';
import { motion } from 'motion/react';
import { RehearsalSession } from '../types';
import { EmptyStateIllustration } from './Illustrations';
import { ArchetypeAvatar } from './ArchetypeAvatar';

interface HistoryScreenProps {
  sessions: RehearsalSession[];
  onSelectSession: (session: RehearsalSession) => void;
  onDeleteSession: (id: string) => void;
  onNewRehearsal: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  sessions,
  onSelectSession,
  onDeleteSession,
  onNewRehearsal,
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8e8e3] pb-6"
      >
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1c1c1a] font-normal tracking-tight mb-2" id="past-rehearsals-title">
            Past rehearsals
          </h1>
          <p className="text-xs sm:text-sm text-[#52524e]">
            Review your previous practice sessions and debrief insights.
          </p>
        </div>

        <button
          onClick={onNewRehearsal}
          className="self-start sm:self-center px-4 py-2 bg-[#334155] hover:bg-[#1e293b] text-white text-xs font-medium rounded-lg shadow-2xs transition-all cursor-pointer"
          id="history-start-new-btn"
        >
          Start a rehearsal
        </button>
      </motion.div>

      {/* Sessions List or Empty State */}
      {sessions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="bg-white border border-[#e8e8e3] rounded-xl p-8 sm:p-12 text-center shadow-2xs my-8 flex flex-col items-center"
        >
          <EmptyStateIllustration className="w-28 h-28 mb-4" />

          <h3 className="font-serif text-lg text-[#1c1c1a] mb-2 font-medium">
            No rehearsals yet
          </h3>
          <p className="text-xs sm:text-sm text-[#73736c] max-w-md mx-auto leading-relaxed mb-6" id="empty-history-msg">
            No rehearsals yet. Describe a conversation you're dreading and practice it here first.
          </p>
          <button
            onClick={onNewRehearsal}
            className="px-6 py-2.5 bg-[#334155] hover:bg-[#1e293b] text-white text-xs font-medium rounded-lg shadow-2xs transition-all cursor-pointer"
          >
            Practice a conversation
          </button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session, index) => {
            const hasDebrief = !!session.debrief;
            const summaryText =
              session.debrief?.overallAssessment ||
              session.summary ||
              `${session.messages.length} conversation turn${
                session.messages.length === 1 ? '' : 's'
              } recorded.`;

            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
                whileHover={{ y: -2, transition: { duration: 0.15 } }}
                className="bg-white border border-[#e8e8e3] hover:border-[#cbd5e1] rounded-2xl p-5 shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div
                  className="flex items-start gap-3.5 flex-1 min-w-0 cursor-pointer"
                  onClick={() => onSelectSession(session)}
                >
                  <ArchetypeAvatar id={session.archetypeId} size="md" className="mt-1" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-[11px] text-[#73736c] mb-1">
                      <span className="font-semibold uppercase tracking-wider text-[#52524e] bg-[#f4f4f0] px-2 py-0.5 rounded border border-[#e2e2dc]">
                        {session.archetypeName}
                      </span>
                      {session.language && (
                        <span className="font-medium text-[#334155] bg-[#f0f4f8] px-2 py-0.5 rounded border border-[#cbd5e1]">
                          {session.language}
                        </span>
                      )}
                      <span>•</span>
                      <span>
                        {new Date(session.updatedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <h3 className="font-serif text-base sm:text-lg font-medium text-[#1c1c1a] mb-1 truncate">
                      "{session.situation}"
                    </h3>

                    <p className="text-xs text-[#52524e] line-clamp-2 leading-relaxed">
                      {summaryText}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f4f4f0]">
                  <button
                    onClick={() => onSelectSession(session)}
                    className="px-3.5 py-1.5 bg-[#f4f4f0] hover:bg-[#e8e8e3] text-[#1c1c1a] text-xs font-medium rounded-md transition-colors cursor-pointer"
                  >
                    {hasDebrief ? 'View debrief' : 'Continue'}
                  </button>

                  <button
                    onClick={() => {
                      if (deletingId === session.id) {
                        onDeleteSession(session.id);
                        setDeletingId(null);
                      } else {
                        setDeletingId(session.id);
                        setTimeout(() => setDeletingId(null), 3000);
                      }
                    }}
                    className={`px-2.5 py-1.5 text-xs rounded-md transition-colors cursor-pointer ${
                      deletingId === session.id
                        ? 'bg-[#fee2e2] text-[#991b1b] font-medium'
                        : 'text-[#73736c] hover:text-[#991b1b] hover:bg-[#fef2f2]'
                    }`}
                    title="Delete rehearsal"
                  >
                    {deletingId === session.id ? 'Confirm?' : 'Delete'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
