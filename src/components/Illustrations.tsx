import React from 'react';
import { motion } from 'motion/react';

/**
 * Custom hand-crafted editorial SVG illustrations in ink and cream tones
 * enhanced with smooth, slow looping micro-animations.
 */

export const HeroIllustration: React.FC<{ className?: string }> = ({
  className = "w-full max-w-md h-auto",
}) => {
  return (
    <svg
      viewBox="0 0 480 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Background soft geometric frame */}
      <rect x="40" y="30" width="400" height="260" rx="16" fill="#f4f4f0" stroke="#e8e8e3" strokeWidth="1" />

      {/* Editorial Grid Lines */}
      <line x1="40" y1="90" x2="440" y2="90" stroke="#e8e8e3" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="40" y1="230" x2="440" y2="230" stroke="#e8e8e3" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="160" y1="30" x2="160" y2="290" stroke="#e8e8e3" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="320" y1="30" x2="320" y2="290" stroke="#e8e8e3" strokeWidth="1" strokeDasharray="4 4" />

      {/* Primary User Speech Arc (Ink) - Slowly floating/drifting */}
      <motion.g
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M 100 110 C 100 75, 220 75, 220 110 C 220 135, 180 150, 160 170 C 155 175, 140 185, 130 185 C 135 175, 140 160, 135 155 C 110 145, 100 130, 100 110 Z"
          fill="#fbfbfa"
          stroke="#1c1c1a"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <line x1="125" y1="105" x2="195" y2="105" stroke="#1c1c1a" strokeWidth="2" strokeLinecap="round" />
        <line x1="125" y1="122" x2="175" y2="122" stroke="#1c1c1a" strokeWidth="2" strokeLinecap="round" />
      </motion.g>

      {/* Opponent Resistance Arc (Muted Slate Accent) - Slowly drifting in opposition */}
      <motion.g
        animate={{ y: [0, 4, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <path
          d="M 380 190 C 380 225, 260 225, 260 190 C 260 165, 300 150, 320 130 C 325 125, 340 115, 350 115 C 345 125, 340 140, 345 145 C 370 155, 380 170, 380 190 Z"
          fill="#fbfbfa"
          stroke="#334155"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <line x1="285" y1="180" x2="355" y2="180" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
        <line x1="305" y1="197" x2="355" y2="197" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
      </motion.g>

      {/* Point of Tension / Rehearsal Focus (Subtle breathing pulse) */}
      <motion.circle
        cx="240"
        cy="150"
        r="28"
        fill="#fbfbfa"
        stroke="#334155"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx="240"
        cy="150"
        r="5"
        fill="#334155"
        animate={{ scale: [1, 1.25, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Minimal balance marks */}
      <circle cx="90" cy="65" r="3" fill="#1c1c1a" />
      <circle cx="390" cy="255" r="3" fill="#334155" />
    </svg>
  );
};

export const EmptyStateIllustration: React.FC<{ className?: string }> = ({
  className = "w-32 h-32",
}) => {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="100" cy="100" r="85" fill="#f4f4f0" stroke="#e8e8e3" strokeWidth="1" />

      {/* Open rehearsal journal */}
      <motion.g
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="55" y="60" width="90" height="80" rx="4" fill="#fbfbfa" stroke="#1c1c1a" strokeWidth="1.5" />
        <line x1="100" y1="60" x2="100" y2="140" stroke="#e8e8e3" strokeWidth="1.5" strokeDasharray="3 3" />

        {/* Left page dialogue lines */}
        <line x1="68" y1="78" x2="90" y2="78" stroke="#1c1c1a" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="68" y1="90" x2="86" y2="90" stroke="#73736c" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="68" y1="102" x2="92" y2="102" stroke="#73736c" strokeWidth="1.5" strokeLinecap="round" />

        {/* Right page debrief marks */}
        <line x1="110" y1="78" x2="132" y2="78" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="110" y1="90" x2="128" y2="90" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="120" cy="115" r="6" stroke="#16a34a" strokeWidth="1.5" fill="none" />
      </motion.g>

      {/* Quiet pen rest gently floating */}
      <motion.line
        x1="135"
        y1="130"
        x2="155"
        y2="150"
        stroke="#1c1c1a"
        strokeWidth="2"
        strokeLinecap="round"
        animate={{ rotate: [0, 3, 0], y: [0, -2, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
};

export const AboutIllustration: React.FC<{ className?: string }> = ({
  className = "w-full max-w-sm h-auto",
}) => {
  return (
    <svg
      viewBox="0 0 360 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="20" y="20" width="320" height="200" rx="12" fill="#f4f4f0" stroke="#e8e8e3" strokeWidth="1" />

      {/* Practice vs Reality */}
      <rect x="40" y="45" width="130" height="150" rx="6" fill="#fbfbfa" stroke="#d8d8d2" strokeWidth="1" />
      <rect x="190" y="45" width="130" height="150" rx="6" fill="#fbfbfa" stroke="#334155" strokeWidth="1.5" />

      {/* Header tags */}
      <line x1="55" y1="65" x2="115" y2="65" stroke="#1c1c1a" strokeWidth="2" strokeLinecap="round" />
      <line x1="205" y1="65" x2="275" y2="65" stroke="#334155" strokeWidth="2" strokeLinecap="round" />

      {/* Dialogue rehearsal flows */}
      <line x1="55" y1="85" x2="145" y2="85" stroke="#73736c" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="55" y1="98" x2="125" y2="98" stroke="#73736c" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="55" y1="111" x2="150" y2="111" stroke="#73736c" strokeWidth="1.5" strokeLinecap="round" />

      <line x1="205" y1="85" x2="295" y2="85" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="205" y1="98" x2="280" y2="98" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="205" y1="111" x2="300" y2="111" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />

      {/* Connecting bridge line with pulsing motion */}
      <motion.path
        d="M 170 120 C 180 120, 180 120, 190 120"
        stroke="#334155"
        strokeWidth="1.5"
        strokeDasharray="2 2"
        animate={{ strokeDashoffset: [0, -10] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  );
};

export const Step1Illustration: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <motion.div
    whileHover={{ scale: 1.08, rotate: -2 }}
    className="w-10 h-10 rounded-xl bg-[#f4f4f0] border border-[#e2e2dc] flex items-center justify-center text-[#1c1c1a] shrink-0"
  >
    <motion.svg
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <line x1="8" y1="9" x2="16" y2="9" />
      <line x1="8" y1="13" x2="13" y2="13" />
    </motion.svg>
  </motion.div>
);

export const Step2Illustration: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <motion.div
    whileHover={{ scale: 1.08, rotate: 2 }}
    className="w-10 h-10 rounded-xl bg-[#f4f4f0] border border-[#e2e2dc] flex items-center justify-center text-[#334155] shrink-0"
  >
    <motion.svg
      animate={{ scale: [1, 1.08, 1] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </motion.svg>
  </motion.div>
);

export const Step3Illustration: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <motion.div
    whileHover={{ scale: 1.08, rotate: -2 }}
    className="w-10 h-10 rounded-xl bg-[#f4f4f0] border border-[#e2e2dc] flex items-center justify-center text-[#1c1c1a] shrink-0"
  >
    <motion.svg
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </motion.svg>
  </motion.div>
);
