import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Briefcase,
  Home,
  Heart,
  Users,
  Sparkles,
  Shield,
  EyeOff,
  HeartHandshake,
  Scale,
  MessageSquare,
  Sliders,
  Info,
  ArrowRight,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { ARCHETYPES } from '../data/archetypes';
import { ArchetypeAvatar } from './ArchetypeAvatar';
import { SAMPLE_SITUATIONS } from '../data/sampleSituations';
import { ArchetypeId } from '../types';
import { User } from '../services/firebase';

interface SetupScreenProps {
  onStartRehearsal: (
    situation: string,
    archetypeId: ArchetypeId,
    customDescription?: string,
    language?: string
  ) => void;
  user: User | null;
  onSignInWithGoogle: () => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({
  onStartRehearsal,
  user,
  onSignInWithGoogle,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [situation, setSituation] = useState('');
  const [selectedArchetypeId, setSelectedArchetypeId] = useState<ArchetypeId>('defensive');
  const [customDescription, setCustomDescription] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [error, setError] = useState<string | null>(null);
  const [activeTooltipId, setActiveTooltipId] = useState<string | null>(null);

  const handleNextStep = () => {
    if (!situation.trim()) {
      setError('Please describe the conversation you want to rehearse.');
      return;
    }
    setError(null);
    setStep(2);
  };

  const handlePrevStep = () => {
    setError(null);
    setStep(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!situation.trim()) {
      setError('Please describe the conversation you want to rehearse.');
      setStep(1);
      return;
    }

    if (selectedArchetypeId === 'custom' && !customDescription.trim()) {
      setError('Please provide a short description of the person\'s style.');
      return;
    }

    setError(null);
    onStartRehearsal(
      situation.trim(),
      selectedArchetypeId,
      customDescription.trim(),
      selectedLanguage
    );
  };

  const handleSelectSample = (
    sampleSituation: string,
    suggestedArchetype: ArchetypeId
  ) => {
    setSituation(sampleSituation);
    setSelectedArchetypeId(suggestedArchetype);
    setError(null);
  };

  // Map category icons for quick sample options
  const getSampleIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Briefcase className="w-3.5 h-3.5 text-[#334155] shrink-0" />;
      case 1:
        return <Home className="w-3.5 h-3.5 text-[#334155] shrink-0" />;
      case 2:
        return <Heart className="w-3.5 h-3.5 text-[#334155] shrink-0" />;
      case 3:
        return <Users className="w-3.5 h-3.5 text-[#334155] shrink-0" />;
      case 4:
        return <Sparkles className="w-3.5 h-3.5 text-[#334155] shrink-0" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-[#334155] shrink-0" />;
    }
  };

  // Map abstract icons per archetype
  const getArchetypeIcon = (id: ArchetypeId) => {
    switch (id) {
      case 'avoider':
        return <EyeOff className="w-4 h-4 text-[#334155]" />;
      case 'defensive':
        return <Shield className="w-4 h-4 text-[#334155]" />;
      case 'guilt_tripper':
        return <HeartHandshake className="w-4 h-4 text-[#334155]" />;
      case 'cold_negotiator':
        return <Scale className="w-4 h-4 text-[#334155]" />;
      case 'over_apologizer':
        return <MessageSquare className="w-4 h-4 text-[#334155]" />;
      case 'custom':
        return <Sliders className="w-4 h-4 text-[#334155]" />;
      default:
        return <Shield className="w-4 h-4 text-[#334155]" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* MINIMAL STEP PROGRESS INDICATOR */}
      <div className="flex items-center justify-center gap-2 mb-8" id="setup-progress-bar">
        <button
          type="button"
          onClick={() => setStep(1)}
          className={`h-1.5 rounded-full transition-all cursor-pointer ${
            step === 1 ? 'w-10 bg-[#334155]' : 'w-2.5 bg-[#e2e2dc] hover:bg-[#a3a39c]'
          }`}
          title="Step 1: Situation"
        />
        <button
          type="button"
          onClick={() => situation.trim() && setStep(2)}
          disabled={!situation.trim()}
          className={`h-1.5 rounded-full transition-all ${
            step === 2
              ? 'w-10 bg-[#334155] cursor-pointer'
              : 'w-2.5 bg-[#e2e2dc] cursor-not-allowed'
          }`}
          title="Step 2: Person"
        />
      </div>

      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {step === 1 ? (
            /* STEP 1: WHAT'S THE CONVERSATION YOU'RE AVOIDING? */
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="space-y-6"
            >
              <div className="text-center space-y-1.5">
                <h1
                  className="font-serif text-2xl sm:text-3xl text-[#1c1c1a] font-normal tracking-tight"
                  id="setup-step1-title"
                >
                  What's the conversation you're avoiding?
                </h1>
                <p className="text-xs sm:text-sm text-[#73736c] max-w-md mx-auto font-normal">
                  State what you need to say or ask for clearly.
                </p>
              </div>

              <div className="bg-white border border-[#e8e8e3] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5">
                <div className="relative">
                  <textarea
                    id="situation-input"
                    value={situation}
                    onChange={(e) => {
                      setSituation(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="e.g., I need to tell my manager I deserve a raise after taking on team lead duties for six months..."
                    rows={4}
                    className="w-full p-4 text-sm bg-[#fcfcfb] border border-[#d8d8d2] focus:border-[#334155] focus:bg-white rounded-xl text-[#1c1c1a] placeholder-[#94948d] focus:outline-none transition-all resize-none leading-relaxed shadow-inner"
                    autoFocus
                  />
                </div>

                {/* QUICK VISUAL EXAMPLE OPTIONS */}
                <div>
                  <span className="text-[11px] font-semibold text-[#73736c] uppercase tracking-wider block mb-2.5">
                    Need an example? Tap to load:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {SAMPLE_SITUATIONS.map((sample, idx) => {
                      const isSelectedSample = situation === sample.situation;

                      return (
                        <motion.button
                          key={idx}
                          type="button"
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            handleSelectSample(
                              sample.situation,
                              sample.suggestedArchetype as ArchetypeId
                            )
                          }
                          className={`flex items-center gap-2 text-xs px-3 py-2 rounded-xl border transition-all text-left cursor-pointer ${
                            isSelectedSample
                              ? 'bg-[#f4f4f0] border-[#334155] text-[#1c1c1a] font-medium shadow-2xs'
                              : 'bg-[#fcfcfb] border-[#e8e8e3] text-[#52524e] hover:bg-white hover:border-[#cbd5e1]'
                          }`}
                        >
                          <div className="w-5 h-5 rounded-md bg-[#f4f4f0] border border-[#e2e2dc] flex items-center justify-center shrink-0">
                            {getSampleIcon(idx)}
                          </div>
                          <span>{sample.title}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* REHEARSAL LANGUAGE SELECTOR */}
                <div className="pt-3.5 border-t border-[#f4f4f0] space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-[11px] font-semibold text-[#73736c] uppercase tracking-wider block">
                      Rehearsal Language
                    </span>
                    <span className="text-[11px] text-[#73736c] font-normal">
                      Roleplay & debrief in <strong className="text-[#334155] font-medium">{selectedLanguage}</strong>
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {['English', 'Urdu', 'Spanish', 'French', 'Arabic'].map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setSelectedLanguage(lang)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                          selectedLanguage === lang
                            ? 'bg-[#334155] text-white border-[#334155] shadow-2xs'
                            : 'bg-[#fcfcfb] text-[#52524e] border-[#e8e8e3] hover:bg-white hover:border-[#cbd5e1]'
                        }`}
                        id={`lang-pill-${lang.toLowerCase()}`}
                      >
                        {lang}
                      </button>
                    ))}

                    <div className="relative inline-block">
                      <select
                        id="language-select-dropdown"
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="bg-[#fcfcfb] border border-[#d8d8d2] focus:border-[#334155] focus:bg-white rounded-lg px-3 py-1.5 text-xs text-[#1c1c1a] font-medium focus:outline-none transition-all cursor-pointer appearance-none pr-7"
                      >
                        {[
                          'English',
                          'Urdu',
                          'Spanish',
                          'French',
                          'Arabic',
                          'German',
                          'Hindi',
                          'Portuguese',
                          'Mandarin Chinese',
                          'Japanese',
                          'Italian',
                          'Russian',
                          'Turkish',
                          'Bengali',
                          'Korean',
                        ].map((lang) => (
                          <option key={lang} value={lang}>
                            {lang}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#73736c]">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error notification */}
              {error && (
                <div
                  className="p-3 bg-[#fef2f2] border border-[#fecaca] rounded-xl text-xs text-[#991b1b]"
                  id="setup-error-msg"
                >
                  {error}
                </div>
              )}

              {/* Step 1 Action */}
              <div className="flex justify-end pt-2">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleNextStep}
                  disabled={!situation.trim()}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    situation.trim()
                      ? 'bg-[#334155] hover:bg-[#1e293b] text-white shadow-xs'
                      : 'bg-[#e8e8e3] text-[#a3a39c] cursor-not-allowed'
                  }`}
                  id="next-step-btn"
                >
                  <span>Next: Choose who you're talking to</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </motion.button>
              </div>
            </motion.div>
          ) : (
            /* STEP 2: WHO ARE YOU TALKING TO? */
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="space-y-6"
            >
              <div className="text-center space-y-1.5">
                <h1
                  className="font-serif text-2xl sm:text-3xl text-[#1c1c1a] font-normal tracking-tight"
                  id="setup-step2-title"
                >
                  Who are you talking to?
                </h1>
                <p className="text-xs sm:text-sm text-[#73736c] max-w-md mx-auto font-normal">
                  Select their communication archetype to set their resistance.
                </p>
              </div>

              {/* ARCHETYPE CARDS GRID (MINIMAL CONTENT) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="archetype-grid">
                {ARCHETYPES.map((arch) => {
                  const isSelected = selectedArchetypeId === arch.id;
                  const isTooltipOpen = activeTooltipId === arch.id;

                  return (
                    <motion.div
                      key={arch.id}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedArchetypeId(arch.id);
                        if (error) setError(null);
                      }}
                      className={`relative cursor-pointer p-4 rounded-xl border transition-all text-left flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#334155] bg-[#f8fafc] shadow-xs'
                          : 'border-[#e8e8e3] bg-white hover:border-[#cbd5e1]'
                      }`}
                      id={`archetype-card-${arch.id}`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <ArchetypeAvatar id={arch.id} size="sm" />
                            <h3 className="font-serif text-sm font-semibold text-[#1c1c1a]">
                              {arch.name}
                            </h3>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* Info Tooltip button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTooltipId(isTooltipOpen ? null : arch.id);
                              }}
                              className="p-1 rounded-full hover:bg-[#f4f4f0] text-[#73736c] hover:text-[#1c1c1a] transition-colors cursor-pointer"
                              title="View detail"
                            >
                              <Info className="w-3.5 h-3.5" />
                            </button>

                            {/* Radio check status */}
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                                isSelected
                                  ? 'border-[#334155] bg-[#334155] text-white'
                                  : 'border-[#d8d8d2]'
                              }`}
                            >
                              {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                          </div>
                        </div>

                        {/* Title and Short Tagline ONLY */}
                        <p className="text-xs text-[#52524e] font-normal leading-snug">
                          {arch.tagline}
                        </p>

                        {/* Expandable info paragraph */}
                        <AnimatePresence>
                          {isTooltipOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pt-2 border-t border-[#e2e2dc] mt-2"
                            >
                              <p className="text-[11px] text-[#73736c] leading-relaxed">
                                {arch.description}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Custom Description Input if Custom is selected */}
              {selectedArchetypeId === 'custom' && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-[#f8fafc] border border-[#cbd5e1] rounded-xl space-y-2"
                >
                  <label
                    htmlFor="custom-archetype-desc"
                    className="block text-xs font-semibold text-[#334155]"
                  >
                    Describe their communication style:
                  </label>
                  <textarea
                    id="custom-archetype-desc"
                    value={customDescription}
                    onChange={(e) => {
                      setCustomDescription(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="e.g. Gets passive-aggressive when feedback is given, usually shifts the blame onto external factors..."
                    rows={2}
                    className="w-full p-3 text-xs bg-white border border-[#cbd5e1] rounded-lg text-[#1c1c1a] placeholder-[#94948d] focus:outline-none focus:border-[#334155] resize-none"
                    autoFocus
                  />
                </motion.div>
              )}

              {/* Optional Sign-In bar */}
              {!user ? (
                <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3.5 flex items-center justify-between gap-3 text-left">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-white border border-[#cbd5e1] flex items-center justify-center shrink-0 shadow-2xs">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#1c1c1a]">
                        Sign in with Google (Optional)
                      </p>
                      <p className="text-[11px] text-[#73736c]">
                        Save sessions across devices or continue anonymously.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onSignInWithGoogle}
                    className="px-3 py-1.5 bg-white border border-[#d8d8d2] hover:border-[#1c1c1a] text-[#1c1c1a] text-xs font-medium rounded-lg shadow-2xs whitespace-nowrap cursor-pointer hover:bg-[#f4f4f0] transition-colors"
                    id="setup-google-signin-btn"
                  >
                    Sign in
                  </button>
                </div>
              ) : (
                <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-2.5 px-3.5 flex items-center gap-2 text-xs text-[#166534]">
                  <span className="w-2 h-2 rounded-full bg-[#16a34a] shrink-0" />
                  <span>
                    Saving session under <strong>{user.displayName || user.email}</strong>
                  </span>
                </div>
              )}

              {/* Error notification */}
              {error && (
                <div
                  className="p-3 bg-[#fef2f2] border border-[#fecaca] rounded-xl text-xs text-[#991b1b]"
                  id="setup-error-msg"
                >
                  {error}
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-2 gap-3">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 py-3 border border-[#d8d8d2] text-[#52524e] hover:text-[#1c1c1a] hover:bg-[#f4f4f0] text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  id="prev-step-btn"
                >
                  <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
                  <span>Back</span>
                </button>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="px-8 py-3.5 bg-[#334155] hover:bg-[#1e293b] text-white text-xs font-semibold tracking-wide rounded-xl shadow-xs transition-all cursor-pointer"
                  id="start-rehearsal-btn"
                >
                  Start rehearsal
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};
