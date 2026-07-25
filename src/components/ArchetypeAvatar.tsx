import React from 'react';
import { ArchetypeId } from '../types';

interface ArchetypeAvatarProps {
  id: ArchetypeId | string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ArchetypeAvatar: React.FC<ArchetypeAvatarProps> = ({
  id,
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-7 h-7 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
    xl: 'w-12 h-12 text-lg',
  };

  const dimMap = {
    xs: 24,
    sm: 28,
    md: 32,
    lg: 40,
    xl: 48,
  };

  const px = dimMap[size] || 32;

  // Render distinct abstract line-art symbols
  const renderSymbol = () => {
    switch (id) {
      case 'avoider':
        // Spiral / dodge curve
        return (
          <path
            d="M 10 16 C 10 11, 14 8, 18 10 C 22 12, 21 18, 16 18 C 13 18, 13 15, 15 14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        );
      case 'defensive':
        // Shield shape
        return (
          <path
            d="M 16 7 L 22 9 C 22 15, 19 20, 16 23 C 13 20, 10 15, 10 9 L 16 7 Z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case 'guilt_tripper':
        // Interlocking loops / soft node
        return (
          <g stroke="currentColor" strokeWidth="1.75" fill="none">
            <path d="M 12 18 C 10 15, 10 11, 14 10 C 17 9, 18 13, 16 16 Z" />
            <path d="M 20 18 C 22 15, 22 11, 18 10 C 15 9, 14 13, 16 16 Z" />
          </g>
        );
      case 'cold_negotiator':
        // Balance scale line
        return (
          <g stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" fill="none">
            <line x1="9" y1="12" x2="23" y2="12" />
            <line x1="16" y1="12" x2="16" y2="21" />
            <line x1="12" y1="21" x2="20" y2="21" />
            <circle cx="10" cy="16" r="1.5" />
            <circle cx="22" cy="16" r="1.5" />
          </g>
        );
      case 'over_apologizer':
        // Concentric gentle speech waves
        return (
          <g stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" fill="none">
            <path d="M 10 14 A 6 6 0 0 1 22 14" />
            <path d="M 12 18 A 3.5 3.5 0 0 1 20 18" />
            <circle cx="16" cy="10" r="1.5" fill="currentColor" />
          </g>
        );
      case 'custom':
      default:
        // Abstract dials / node
        return (
          <g stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" fill="none">
            <circle cx="16" cy="16" r="7" />
            <circle cx="16" cy="16" r="2" fill="currentColor" />
            <line x1="16" y1="6" x2="16" y2="9" />
            <line x1="16" y1="23" x2="16" y2="26" />
          </g>
        );
    }
  };

  return (
    <div
      className={`rounded-full bg-[#334155] text-white flex items-center justify-center shrink-0 shadow-2xs ${sizeMap[size]} ${className}`}
      style={{ width: `${px}px`, height: `${px}px` }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 32 32"
        className="w-3/5 h-3/5 text-white"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {renderSymbol()}
      </svg>
    </div>
  );
};
