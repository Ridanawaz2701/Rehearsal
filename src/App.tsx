import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingScreen } from './components/LandingScreen';
import { SetupScreen } from './components/SetupScreen';
import { LiveRehearsalScreen } from './components/LiveRehearsalScreen';
import { DebriefScreen } from './components/DebriefScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { AboutScreen } from './components/AboutScreen';
import { ArchetypeId, ChatMessage, RehearsalSession, ViewScreen } from './types';
import { getArchetypeDescription, ARCHETYPES } from './data/archetypes';
import { storage } from './services/storage';
import { onAuthStateChanged, signInWithGoogle, signOutUser, User } from './services/firebase';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ViewScreen>('home');
  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<RehearsalSession[]>([]);
  const [activeSession, setActiveSession] = useState<RehearsalSession | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [authNotification, setAuthNotification] = useState<string | null>(null);

  // Subscribe to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      const uid = currentUser?.uid;
      // Load local cache immediately
      const initialLocal = storage.getSessions(uid);
      setSessions(initialLocal);

      // Async Firestore fetch if user is signed in
      if (uid) {
        await storage.migrateGuestSessionsToCloud(uid);
        const asyncSessions = await storage.getSessionsAsync(uid);
        setSessions(asyncSessions);
      }
    });

    return () => unsubscribe();
  }, []);

  const refreshSessions = async (userId?: string | null) => {
    const targetUid = userId !== undefined ? userId : user?.uid;
    const loaded = storage.getSessions(targetUid);
    setSessions(loaded);

    if (targetUid) {
      const cloudSessions = await storage.getSessionsAsync(targetUid);
      setSessions(cloudSessions);
    }
  };

  // Google Sign In handler
  const handleSignInWithGoogle = async () => {
    try {
      setAuthNotification(null);
      const signedInUser = await signInWithGoogle();
      if (signedInUser) {
        setUser(signedInUser);
        await storage.migrateGuestSessionsToCloud(signedInUser.uid);
        await refreshSessions(signedInUser.uid);
      }
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user') {
        // User closed popup, no error needed
        return;
      }
      if (err?.code === 'auth/unauthorized-domain') {
        const domain = window.location.hostname;
        console.warn(`Firebase Auth Domain notice: "${domain}" is not in Firebase Console > Authentication > Settings > Authorized domains.`);
        setAuthNotification(
          `Domain "${domain}" is not in your Firebase Authorized Domains list. Continuing in guest mode with local storage.`
        );
        setTimeout(() => setAuthNotification(null), 10000);
        return;
      }
      if (err?.code === 'auth/invalid-api-key' || err?.message?.includes('not configured')) {
        console.warn('Firebase Auth notice: API key not configured.');
        setAuthNotification('Google sign-in requires VITE_FIREBASE_API_KEY environment variable. Continuing in guest mode with local storage.');
        setTimeout(() => setAuthNotification(null), 8000);
        return;
      }
      console.error('Google Sign-In failed:', err);
      setAuthNotification('Google sign-in could not be completed. You can continue using local storage.');
      setTimeout(() => setAuthNotification(null), 6000);
    }
  };

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await signOutUser();
      setUser(null);
      refreshSessions(null);
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  // Navigation handler
  const handleNavigate = (screen: ViewScreen) => {
    if (screen === 'history') {
      refreshSessions();
    }
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Start a brand new rehearsal session
  const handleStartRehearsal = (
    situation: string,
    archetypeId: ArchetypeId,
    customDescription?: string,
    language: string = 'English'
  ) => {
    const archetypeObj = ARCHETYPES.find((a) => a.id === archetypeId);
    const archetypeName =
      archetypeId === 'custom'
        ? 'Custom Personality'
        : archetypeObj?.name || 'Opponent';

    const newSession: RehearsalSession = {
      id: 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      situation,
      archetypeId,
      customArchetypeDescription: customDescription,
      archetypeName,
      language: language || 'English',
      messages: [],
      status: 'active',
      userId: user?.uid,
    };

    const saved = storage.saveSession(newSession, user?.uid);
    setActiveSession(saved);
    refreshSessions();
    setCurrentScreen('rehearsal');
  };

  // Send turn message in roleplay chat
  const handleSendMessage = async (messageText: string) => {
    if (!activeSession) return;

    const userMessage: ChatMessage = {
      id: 'msg_' + Date.now() + '_user',
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...activeSession.messages, userMessage];

    const updatedSession: RehearsalSession = {
      ...activeSession,
      messages: updatedMessages,
      updatedAt: new Date().toISOString(),
      userId: user?.uid || activeSession.userId,
    };

    setActiveSession(updatedSession);
    storage.saveSession(updatedSession, user?.uid);
    setIsSending(true);

    try {
      const archetypeDesc = getArchetypeDescription(
        activeSession.archetypeId,
        activeSession.customArchetypeDescription
      );

      const res = await fetch('/api/rehearsal/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          situation: activeSession.situation,
          archetypeDescription: archetypeDesc,
          messages: updatedMessages,
          language: activeSession.language || 'English',
        }),
      });

      const data = await res.json();
      const replyContent =
        data.reply || data.fallbackReply || 'I... I need a minute to think about what you said.';

      const opponentMessage: ChatMessage = {
        id: 'msg_' + Date.now() + '_opp',
        role: 'opponent',
        content: replyContent,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, opponentMessage];

      const finalSession: RehearsalSession = {
        ...updatedSession,
        messages: finalMessages,
        updatedAt: new Date().toISOString(),
      };

      setActiveSession(finalSession);
      storage.saveSession(finalSession, user?.uid);
      refreshSessions();
    } catch (err) {
      console.error('Error fetching roleplay chat response:', err);

      // Fallback message if network error occurs
      const fallbackMessage: ChatMessage = {
        id: 'msg_' + Date.now() + '_opp_err',
        role: 'opponent',
        content: "Look, I hear what you're saying, but I need a moment. Let's keep going.",
        timestamp: new Date().toISOString(),
      };

      const finalSession: RehearsalSession = {
        ...updatedSession,
        messages: [...updatedMessages, fallbackMessage],
        updatedAt: new Date().toISOString(),
      };

      setActiveSession(finalSession);
      storage.saveSession(finalSession, user?.uid);
      refreshSessions();
    } finally {
      setIsSending(false);
    }
  };

  // End rehearsal session and trigger AI debrief
  const handleEndRehearsal = async () => {
    if (!activeSession) return;

    setIsSending(true);

    try {
      const archetypeDesc = getArchetypeDescription(
        activeSession.archetypeId,
        activeSession.customArchetypeDescription
      );

      const res = await fetch('/api/rehearsal/debrief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          situation: activeSession.situation,
          archetypeDescription: archetypeDesc,
          messages: activeSession.messages,
          language: activeSession.language || 'English',
        }),
      });

      const data = await res.json();
      const debriefData = data.debrief;

      const completedSession: RehearsalSession = {
        ...activeSession,
        status: 'completed',
        debrief: debriefData,
        summary: debriefData?.overallAssessment || 'Rehearsal completed.',
        updatedAt: new Date().toISOString(),
      };

      setActiveSession(completedSession);
      storage.saveSession(completedSession, user?.uid);
      refreshSessions();
      setCurrentScreen('debrief');
    } catch (err) {
      console.error('Error generating debrief:', err);

      // Fallback debrief
      const fallbackDebrief = {
        strongMoments: [
          {
            quote: 'You stated your initial concern clearly.',
            explanation: 'Opening directly establishes your topic before deflective maneuvers occur.',
          },
        ],
        lostGroundMoments: [
          {
            quote: 'Softening tone during pushback.',
            explanation: 'Conceding early when met with initial resistance signals that resistance works.',
          },
        ],
        alternativePhrasings: [
          {
            originalWeakMoment: 'I know this might not be ideal timing...',
            alternative: 'I want to discuss something important to make sure we align.',
            rationale: 'Establishes constructive firmness without preemptive apologies.',
          },
        ],
        realWorldPrediction:
          'If you hold your line firmly on key boundaries while remaining calm, you will make steady progress.',
        overallAssessment: 'Solid initial rehearsal.',
      };

      const completedSession: RehearsalSession = {
        ...activeSession,
        status: 'completed',
        debrief: fallbackDebrief,
        summary: fallbackDebrief.overallAssessment,
        updatedAt: new Date().toISOString(),
      };

      setActiveSession(completedSession);
      storage.saveSession(completedSession, user?.uid);
      refreshSessions();
      setCurrentScreen('debrief');
    } finally {
      setIsSending(false);
    }
  };

  // Restart rehearsal with same parameters
  const handleRestartSameSituation = () => {
    if (!activeSession) {
      setCurrentScreen('setup');
      return;
    }

    handleStartRehearsal(
      activeSession.situation,
      activeSession.archetypeId,
      activeSession.customArchetypeDescription
    );
  };

  // Select existing session from history
  const handleSelectSessionFromHistory = (session: RehearsalSession) => {
    setActiveSession(session);
    if (session.debrief || session.status === 'completed') {
      setCurrentScreen('debrief');
    } else {
      setCurrentScreen('rehearsal');
    }
  };

  // Delete session
  const handleDeleteSession = (id: string) => {
    storage.deleteSession(id, user?.uid);
    if (activeSession?.id === id) {
      setActiveSession(null);
      setCurrentScreen('setup');
    }
    refreshSessions();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfa] text-[#1c1c1a]">
      {/* Auth notification if Google sign-in fails */}
      {authNotification && (
        <div className="bg-[#fef2f2] border-b border-[#fecaca] text-[#991b1b] px-4 py-2 text-xs text-center font-medium">
          {authNotification}
        </div>
      )}

      {/* Header - Hidden on Rehearsal screen for zero distraction */}
      {currentScreen !== 'rehearsal' && (
        <Header
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          hasHistory={sessions.length > 0}
          user={user}
          onSignInWithGoogle={handleSignInWithGoogle}
          onSignOut={handleSignOut}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {currentScreen === 'home' && (
              <LandingScreen
                onStartRehearsal={() => handleNavigate('setup')}
                onNavigateAbout={() => handleNavigate('about')}
                user={user}
                onSignInWithGoogle={handleSignInWithGoogle}
              />
            )}

            {currentScreen === 'setup' && (
              <SetupScreen
                onStartRehearsal={handleStartRehearsal}
                user={user}
                onSignInWithGoogle={handleSignInWithGoogle}
              />
            )}

            {currentScreen === 'rehearsal' && activeSession && (
              <LiveRehearsalScreen
                session={activeSession}
                onSendMessage={handleSendMessage}
                onEndRehearsal={handleEndRehearsal}
                onExitWithoutEnding={() => handleNavigate('history')}
                isSending={isSending}
                user={user}
              />
            )}

            {currentScreen === 'debrief' && activeSession && (
              <DebriefScreen
                session={activeSession}
                onRestartSameSituation={handleRestartSameSituation}
                onNewRehearsal={() => handleNavigate('setup')}
              />
            )}

            {currentScreen === 'history' && (
              <HistoryScreen
                sessions={sessions}
                onSelectSession={handleSelectSessionFromHistory}
                onDeleteSession={handleDeleteSession}
                onNewRehearsal={() => handleNavigate('setup')}
              />
            )}

            {currentScreen === 'about' && (
              <AboutScreen onStartRehearsal={() => handleNavigate('setup')} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer - Hidden on Rehearsal screen for zero distraction */}
      {currentScreen !== 'rehearsal' && <Footer onNavigate={handleNavigate} />}
    </div>
  );
}
