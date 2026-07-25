import React from 'react';
import { User } from '../services/firebase';

interface UserAvatarProps {
  user?: User | null;
  photoURL?: string | null;
  displayName?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  photoURL,
  displayName,
  size = 'md',
  className = '',
}) => {
  const actualPhoto = photoURL || user?.photoURL;
  const actualName = displayName || user?.displayName || user?.email || 'You';

  const dimMap = {
    xs: 24,
    sm: 28,
    md: 32,
    lg: 40,
  };

  const px = dimMap[size] || 32;

  if (actualPhoto) {
    return (
      <img
        src={actualPhoto}
        alt={actualName}
        referrerPolicy="no-referrer"
        className={`rounded-full object-cover shrink-0 border border-[#e2e2dc] shadow-2xs ${className}`}
        style={{ width: `${px}px`, height: `${px}px` }}
      />
    );
  }

  // Neutral guest placeholder avatar
  return (
    <div
      className={`rounded-full bg-[#1c1c1a] text-white flex items-center justify-center shrink-0 shadow-2xs ${className}`}
      style={{ width: `${px}px`, height: `${px}px` }}
      title={actualName}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-1/2 h-1/2 text-white"
      >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </div>
  );
};
