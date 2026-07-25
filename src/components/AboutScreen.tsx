import React from 'react';
import { motion } from 'motion/react';
import { AboutIllustration } from './Illustrations';

interface AboutScreenProps {
  onStartRehearsal: () => void;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({ onStartRehearsal }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-16 space-y-12">
      {/* Essay Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="border-b border-[#e8e8e3] pb-8 space-y-3"
      >
        <span className="text-xs uppercase tracking-widest font-semibold text-[#52524e]">
          Manifesto & Design Philosophy
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#1c1c1a] font-normal tracking-tight leading-tight" id="about-title">
          Why Rehearsal Exists
        </h1>
        <p className="text-sm sm:text-base text-[#52524e] font-serif italic max-w-xl">
          On the power of saying the words out loud before you say them for real.
        </p>
      </motion.div>

      {/* Main Essay Body */}
      <motion.article
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="space-y-6 text-sm sm:text-base text-[#2e2e2a] leading-relaxed font-normal"
      >
        <p>
          Most of the anxiety surrounding difficult conversations doesn't stem from lack of preparation on paper—it stems from the fact that we have never actually spoken the words aloud.
        </p>

        <p>
          In our heads, our arguments sound bulletproof. We imagine stating our boundary clearly, having the other person listen attentively, and reaching a swift, mutually respectful conclusion.
        </p>

        <p className="font-serif text-lg text-[#1c1c1a] italic border-l-2 border-[#334155] pl-4 py-1 my-6 bg-[#f8fafc] rounded-r-lg">
          "Real human conflict rarely follows an agreeable script. People get defensive, deflect, bring up past grievances, or offer empty apologies."
        </p>

        <p>
          When faced with real-world pushback, our brain's fight-or-flight response takes over. We soften our boundaries, apologize for asking, or get dragged into side arguments that have nothing to do with our core point.
        </p>

        {/* Custom Illustration */}
        <div className="py-6 flex justify-center">
          <div className="p-4 bg-white border border-[#e8e8e3] rounded-xl shadow-2xs w-full max-w-md">
            <AboutIllustration className="w-full h-auto" />
            <p className="text-[11px] text-[#73736c] text-center mt-2 font-serif">
              Rehearsal vs. Unprepared Reality — bridging the gap with deliberate practice.
            </p>
          </div>
        </div>

        <h3 className="font-serif text-xl sm:text-2xl text-[#1c1c1a] pt-4 font-normal">
          Not a helpful AI assistant. A realistic opponent.
        </h3>

        <p>
          Most AI chat interfaces are programmed to be relentlessly polite, encouraging, and compliant. If you practice a conversation with a standard chatbot, it will quickly apologize and tell you what a wonderful point you've made.
        </p>

        <p>
          That builds false confidence. Rehearsal was built differently: the AI is instructed to simulate realistic human friction. An <strong>Avoider</strong> will try to change the subject; a <strong>Defensive One</strong> will counter-accuse; a <strong>Cold Negotiator</strong> will demand metrics before granting ground.
        </p>

        <p>
          When you finish practicing, Rehearsal provides an honest, objective debrief—citing your exact words, pointing out where you conceded ground unnecessarily, and offering stronger alternative phrasings.
        </p>
      </motion.article>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-white border border-[#e8e8e3] rounded-xl p-6 sm:p-8 text-center shadow-2xs space-y-4 mt-8"
      >
        <h3 className="font-serif text-xl text-[#1c1c1a] font-normal">
          Have a conversation you're dreading?
        </h3>
        <p className="text-xs sm:text-sm text-[#52524e] max-w-md mx-auto">
          Take five minutes to test your opening lines in a quiet, private space.
        </p>
        <button
          onClick={onStartRehearsal}
          className="px-6 py-3 bg-[#334155] hover:bg-[#1e293b] text-white text-xs font-medium rounded-lg shadow-2xs transition-all cursor-pointer"
        >
          Start a rehearsal
        </button>
      </motion.div>
    </div>
  );
};
