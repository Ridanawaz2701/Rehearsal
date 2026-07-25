import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  HeroIllustration,
  Step1Illustration,
  Step2Illustration,
  Step3Illustration,
} from './Illustrations';
import { ARCHETYPES } from '../data/archetypes';
import { ArchetypeId } from '../types';
import { ArchetypeAvatar } from './ArchetypeAvatar';
import { User } from '../services/firebase';

interface LandingScreenProps {
  onStartRehearsal: () => void;
  onNavigateAbout: () => void;
  user?: User | null;
  onSignInWithGoogle?: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onStartRehearsal,
  onNavigateAbout,
  user,
  onSignInWithGoogle,
}) => {
  const [selectedPreviewArchetype, setSelectedPreviewArchetype] =
    useState<ArchetypeId>('defensive');

  const activeArchetype =
    ARCHETYPES.find((a) => a.id === selectedPreviewArchetype) || ARCHETYPES[1];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-20 space-y-24 sm:space-y-36">
      {/* 1. HERO SECTION (Staggered Animations + Looping Vector Graphic) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[420px]">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
          className="lg:col-span-7 space-y-6 text-left"
        >
          {/* Eyebrow Tag */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
            }}
          >
            <span className="inline-block text-[11px] uppercase tracking-widest font-semibold text-[#52524e] bg-[#f4f4f0] px-3 py-1 rounded-md border border-[#e2e2dc]">
              Conversation Rehearsal Tool
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
            className="font-serif text-3xl sm:text-5xl text-[#1c1c1a] font-normal tracking-tight leading-[1.12]"
            id="landing-hero-title"
          >
            Practice the hard conversation before you have it.
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
            className="text-base sm:text-lg text-[#52524e] leading-relaxed font-normal max-w-xl"
          >
            People avoid or fumble important conversations because they've never actually said the words out loud before doing it for real. Rehearsal lets you practice against a realistic opponent who argues back—so you walk into the room prepared.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onStartRehearsal}
              className="px-8 py-3.5 bg-[#334155] hover:bg-[#1e293b] text-white text-sm font-medium rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#334155] cursor-pointer text-center"
              id="landing-hero-cta"
            >
              Start rehearsal
            </motion.button>

            {!user && onSignInWithGoogle && (
              <button
                onClick={onSignInWithGoogle}
                className="px-5 py-3.5 bg-white hover:bg-[#f4f4f0] text-[#1c1c1a] border border-[#d8d8d2] text-sm font-medium rounded-lg transition-all cursor-pointer text-center flex items-center justify-center gap-2"
                id="landing-google-signin-btn"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                <span>Sign in with Google</span>
              </button>
            )}

            <button
              onClick={onNavigateAbout}
              className="px-6 py-3.5 bg-white hover:bg-[#f4f4f0] text-[#1c1c1a] border border-[#d8d8d2] text-sm font-medium rounded-lg transition-all cursor-pointer text-center"
            >
              Why this exists
            </button>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 0.5, delay: 0.2 } },
            }}
            className="flex items-center gap-6 pt-4 text-xs text-[#73736c] border-t border-[#e8e8e3]"
          >
            <span>✓ Zero setup required</span>
            <span>✓ Private & confidential</span>
            <span>✓ AI opponent pushes back</span>
          </motion.div>
        </motion.div>

        {/* Hero Vector Graphic with Looping Micro-Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-5 flex justify-center"
        >
          <div className="p-4 bg-white border border-[#e8e8e3] rounded-2xl shadow-2xs w-full">
            <HeroIllustration className="w-full h-auto" />
          </div>
        </motion.div>
      </section>

      {/* 2. HOW IT WORKS SECTION (Visual step graphics + Scroll Reveal) */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="space-y-12 border-t border-[#e8e8e3] pt-16"
      >
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1c1a] font-normal">
            How Rehearsal works
          </h2>
          <p className="text-xs sm:text-sm text-[#52524e]">
            Three deliberate steps to build clarity and confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Set the scene',
              description:
                'Describe the specific conversation you\'re dreading—asking for a raise, establishing a boundary, or confronting a friend.',
              icon: <Step1Illustration />,
            },
            {
              step: '02',
              title: 'Choose their archetype',
              description:
                'Select who you\'re talking to—an Avoider, a Defensive person, a Cold Negotiator, or define your own custom personality.',
              icon: <Step2Illustration />,
            },
            {
              step: '03',
              title: 'Receive an honest debrief',
              description:
                'When you end the rehearsal, the AI breaks character and provides an objective analysis of your strong moments and weak points.',
              icon: <Step3Illustration />,
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.12 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white border border-[#e8e8e3] hover:border-[#cbd5e1] rounded-2xl p-6 shadow-2xs transition-all space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-3xl font-light text-[#334155]">
                  {item.step}
                </span>
                {item.icon}
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold text-[#1c1c1a] mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-[#52524e] leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 3. WHO YOU'LL PRACTICE WITH (Interactive Archetype Preview with Avatars) */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="space-y-8 border-t border-[#e8e8e3] pt-16"
      >
        <div className="space-y-2 text-left">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#52524e]">
            Opponent Archetypes
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1c1a] font-normal">
            Who you'll practice with
          </h2>
          <p className="text-xs sm:text-sm text-[#52524e]">
            Hover or tap an archetype to preview how they realistically push back in conversation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Archetypes Interactive List */}
          <div className="lg:col-span-5 space-y-2.5">
            {ARCHETYPES.map((arch) => {
              const isSelected = selectedPreviewArchetype === arch.id;

              return (
                <motion.div
                  key={arch.id}
                  onClick={() => setSelectedPreviewArchetype(arch.id)}
                  onMouseEnter={() => setSelectedPreviewArchetype(arch.id)}
                  whileHover={{ x: 4 }}
                  className={`cursor-pointer p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                    isSelected
                      ? 'border-[#334155] bg-white shadow-2xs'
                      : 'border-[#e8e8e3] bg-[#fcfcfb] hover:bg-white hover:border-[#cbcbc4]'
                  }`}
                  id={`preview-archetype-${arch.id}`}
                >
                  <ArchetypeAvatar id={arch.id} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-sm font-semibold text-[#1c1c1a] truncate">
                        {arch.name}
                      </h4>
                      {isSelected && (
                        <span className="text-[10px] bg-[#334155] text-white px-2 py-0.5 rounded font-sans shrink-0 ml-1">
                          Previewing
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#52524e] truncate mt-0.5 font-normal">
                      {arch.tagline}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Animated Preview Card */}
          <div className="lg:col-span-7 bg-white border border-[#e8e8e3] rounded-2xl p-6 shadow-2xs min-h-[300px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeArchetype.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 border-b border-[#f4f4f0] pb-3">
                  <ArchetypeAvatar id={activeArchetype.id} size="lg" />
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-[#1c1c1a]">
                      {activeArchetype.name}
                    </h3>
                    <p className="text-xs text-[#52524e] font-medium">
                      {activeArchetype.tagline}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-[#73736c] leading-relaxed">
                  {activeArchetype.description}
                </p>

                {/* Example dialogue pushback box */}
                <div className="p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl space-y-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748b] block">
                    Example pushback line:
                  </span>
                  <p className="font-serif text-xs sm:text-sm italic text-[#1e293b] leading-relaxed">
                    {activeArchetype.sampleDialogue}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeArchetype.traits.map((trait, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[11px] bg-[#f4f4f0] text-[#52524e] px-2.5 py-0.5 rounded-full border border-[#e2e2dc]"
                    >
                      • {trait}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="pt-4 mt-4 border-t border-[#f4f4f0] text-right">
              <button
                onClick={onStartRehearsal}
                className="text-xs text-[#334155] font-semibold hover:underline cursor-pointer"
              >
                Practice with {activeArchetype.name} →
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 4. SAMPLE DEBRIEF PREVIEW SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="space-y-8 border-t border-[#e8e8e3] pt-16"
      >
        <div className="space-y-2 text-center max-w-xl mx-auto">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#52524e]">
            Honest Feedback
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1c1a] font-normal">
            Sample Debrief Analysis
          </h2>
          <p className="text-xs sm:text-sm text-[#52524e]">
            Here is a real example of the structured feedback generated after a rehearsal session.
          </p>
        </div>

        <div className="bg-white border border-[#e8e8e3] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-xs text-[#334155]">
            <strong>Sample Scenario:</strong> Asking manager for a 15% salary raise during a performance review facing <em>The Cold Negotiator</em>.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Where you were strong */}
            <motion.div
              whileHover={{ y: -2 }}
              className="p-4 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl space-y-2"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#16a34a]" />
                <h4 className="font-serif text-sm font-semibold text-[#166534]">
                  Where you were strong
                </h4>
              </div>
              <blockquote className="text-xs font-serif italic text-[#14532d] pl-2 border-l-2 border-[#16a34a]">
                "I've taken full ownership of the Q1 redesign and trained two junior engineers over the past six months."
              </blockquote>
              <p className="text-xs text-[#166534] leading-relaxed">
                Quoting concrete achievements upfront prevents a cold negotiator from dismissing your request as purely emotional.
              </p>
            </motion.div>

            {/* Where you lost ground */}
            <motion.div
              whileHover={{ y: -2 }}
              className="p-4 bg-[#fffbeb] border border-[#fef3c7] rounded-xl space-y-2"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#d97706]" />
                <h4 className="font-serif text-sm font-semibold text-[#92400e]">
                  Where you lost ground
                </h4>
              </div>
              <blockquote className="text-xs font-serif italic text-[#78350f] pl-2 border-l-2 border-[#d97706]">
                "I mean, if the budget is tight right now, I guess we could talk about this again next quarter."
              </blockquote>
              <p className="text-xs text-[#78350f] leading-relaxed">
                Conceding before the manager even made a counter-offer weakens your negotiating position immediately.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Try saying it like this */}
            <motion.div
              whileHover={{ y: -2 }}
              className="p-4 bg-[#f8fafc] border border-[#cbd5e1] rounded-xl space-y-2"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#2563eb]" />
                <h4 className="font-serif text-sm font-semibold text-[#1e40af]">
                  Try saying it like this instead
                </h4>
              </div>
              <p className="text-xs text-[#1e293b] font-medium bg-white p-2.5 rounded-lg border border-[#e2e8f0]">
                "I understand budget timelines matter. What specific milestones do we need to hit to finalize this increase before Q3?"
              </p>
              <p className="text-xs text-[#475569]">
                Keeps the conversation open and sets clear criteria rather than accepting an indefinite delay.
              </p>
            </motion.div>

            {/* Real world prediction */}
            <motion.div
              whileHover={{ y: -2 }}
              className="p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl space-y-2"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#334155]" />
                <h4 className="font-serif text-sm font-semibold text-[#1e293b]">
                  How this might actually go
                </h4>
              </div>
              <p className="text-xs text-[#334155] leading-relaxed">
                Your manager will likely push back on initial budget figures. If you bring documented deliverables and refuse to self-concede early, you stand a strong chance of securing at least a 10-12% increase or a locked timeline.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* 5. BOTTOM CTA BANNER */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-white border border-[#e8e8e3] rounded-2xl p-8 sm:p-12 text-center shadow-2xs space-y-4"
      >
        <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1c1a] font-normal">
          Ready to practice your conversation?
        </h2>
        <p className="text-xs sm:text-sm text-[#52524e] max-w-md mx-auto">
          Say the words out loud first. Walk into your real conversation prepared and clear-headed.
        </p>
        <div className="pt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStartRehearsal}
            className="px-8 py-3.5 bg-[#334155] hover:bg-[#1e293b] text-white text-sm font-medium rounded-lg shadow-sm transition-all cursor-pointer"
            id="landing-bottom-cta"
          >
            Start rehearsal
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
};
