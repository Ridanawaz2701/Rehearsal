import React from 'react';
import { ViewScreen } from '../types';

interface FooterProps {
  onNavigate?: (screen: ViewScreen) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full border-t border-[#e8e8e3] py-8 mt-auto bg-[#fbfbfa]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-left">
          <p className="font-serif text-sm font-medium text-[#1c1c1a]">Rehearsal</p>
          <p className="text-xs text-[#73736c] font-normal tracking-wide">
            Practice the hard conversation before you have it.
          </p>
        </div>

        {onNavigate && (
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#52524e]">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-[#1c1c1a] transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('setup')}
              className="hover:text-[#1c1c1a] transition-colors cursor-pointer"
            >
              Start rehearsal
            </button>
            <button
              onClick={() => onNavigate('history')}
              className="hover:text-[#1c1c1a] transition-colors cursor-pointer"
            >
              Past rehearsals
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="hover:text-[#1c1c1a] transition-colors cursor-pointer"
            >
              About
            </button>
          </div>
        )}
      </div>
    </footer>
  );
};
