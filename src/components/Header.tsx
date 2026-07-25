import React from 'react';
import { ViewScreen } from '../types';
import { User } from '../services/firebase';

interface HeaderProps {
  currentScreen: ViewScreen;
  onNavigate: (screen: ViewScreen) => void;
  hasHistory: boolean;
  user: User | null;
  onSignInWithGoogle: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  hasHistory,
  user,
  onSignInWithGoogle,
  onSignOut,
}) => {
  // Hide header completely on rehearsal screen per user request:
  // "The rehearsal chat should open as its own dedicated, full-screen page with no header nav, no footer..."
  if (currentScreen === 'rehearsal') {
    return null;
  }

  return (
    <header className="w-full border-b border-[#e8e8e3] bg-[#fbfbfa]/90 backdrop-blur-sm sticky top-0 z-30 transition-all duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-2">
        {/* Logo / Wordmark */}
        <button
          onClick={() => onNavigate('home')}
          className="group focus:outline-none flex items-center gap-2 cursor-pointer shrink-0"
          id="header-wordmark-btn"
        >
          <span className="font-serif tracking-tight text-[#1c1c1a] font-medium text-xl hover:text-[#334155] transition-colors">
            Rehearsal
          </span>
        </button>

        {/* Header Navigation + Auth Controls */}
        <div className="flex items-center gap-2 sm:gap-4 text-xs font-medium">
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onNavigate('home')}
              className={`transition-colors px-2.5 py-1 rounded-md cursor-pointer ${
                currentScreen === 'home'
                  ? 'bg-[#eef0eb] text-[#1c1c1a] font-semibold'
                  : 'text-[#52524e] hover:text-[#1c1c1a]'
              }`}
              id="nav-home-btn"
            >
              Home
            </button>

            <button
              onClick={() => onNavigate('setup')}
              className={`transition-colors px-2.5 py-1 rounded-md cursor-pointer ${
                currentScreen === 'setup'
                  ? 'bg-[#eef0eb] text-[#1c1c1a] font-semibold'
                  : 'text-[#52524e] hover:text-[#1c1c1a]'
              }`}
              id="nav-start-btn"
            >
              Start rehearsal
            </button>

            <button
              onClick={() => onNavigate('history')}
              className={`transition-colors px-2.5 py-1 rounded-md cursor-pointer relative ${
                currentScreen === 'history'
                  ? 'bg-[#eef0eb] text-[#1c1c1a] font-semibold'
                  : 'text-[#52524e] hover:text-[#1c1c1a]'
              }`}
              id="nav-history-btn"
            >
              Past rehearsals
              {hasHistory && (
                <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#334155]" />
              )}
            </button>

            <button
              onClick={() => onNavigate('about')}
              className={`transition-colors px-2.5 py-1 rounded-md cursor-pointer ${
                currentScreen === 'about'
                  ? 'bg-[#eef0eb] text-[#1c1c1a] font-semibold'
                  : 'text-[#52524e] hover:text-[#1c1c1a]'
              }`}
              id="nav-about-btn"
            >
              About
            </button>
          </nav>

          {/* User Sign-In / Account status */}
          <div className="pl-1 sm:pl-2 border-l border-[#e8e8e3] flex items-center">
            {user ? (
              <div className="flex items-center gap-2 bg-[#f4f4f0] border border-[#e2e2dc] rounded-full pl-1.5 pr-2.5 py-1">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-5 h-5 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-[#334155] text-white text-[10px] font-semibold flex items-center justify-center shrink-0">
                    {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs text-[#1c1c1a] font-medium max-w-[110px] truncate hidden md:inline">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
                <button
                  onClick={onSignOut}
                  className="text-[11px] text-[#73736c] hover:text-[#991b1b] font-medium transition-colors cursor-pointer ml-0.5"
                  id="header-signout-btn"
                  title="Sign out of Google"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={onSignInWithGoogle}
                className="flex items-center gap-1.5 border border-[#d8d8d2] hover:border-[#1c1c1a] bg-white text-[#1c1c1a] text-xs font-medium px-2.5 py-1 rounded-md transition-all shadow-2xs hover:shadow-xs cursor-pointer"
                id="header-google-signin-btn"
                title="Sign in with Google account"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
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
                <span className="hidden sm:inline">Sign in with Google</span>
                <span className="sm:hidden">Sign in</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
