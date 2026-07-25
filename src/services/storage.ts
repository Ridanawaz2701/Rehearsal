import { RehearsalSession } from '../types';
import { getFirestoreInstance } from './firebase';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';

const BASE_STORAGE_KEY = 'rehearsal_sessions_v1';

function getStorageKey(userId?: string | null): string {
  if (userId) {
    return `${BASE_STORAGE_KEY}_user_${userId}`;
  }
  return `${BASE_STORAGE_KEY}_guest`;
}

/**
 * Rehearsal session storage manager.
 * - For signed-in users: Uses Firebase Firestore scoped to `users/{userId}/sessions/{sessionId}` with localStorage as fallback/cache.
 * - For guest users: Uses client-side localStorage.
 */
export const storage = {
  /**
   * Synchronously fetch cached sessions from localStorage.
   */
  getSessions(userId?: string | null): RehearsalSession[] {
    try {
      const key = getStorageKey(userId);
      let raw = localStorage.getItem(key);

      // Fallback migration check: if guest and legacy BASE_STORAGE_KEY exists
      if (!raw && !userId) {
        raw = localStorage.getItem(BASE_STORAGE_KEY);
      }

      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      }
      return [];
    } catch (e) {
      console.error('Failed to parse sessions from storage:', e);
      return [];
    }
  },

  /**
   * Asynchronously fetch sessions from Firestore for signed-in users,
   * falling back to local storage if offline or unauthenticated.
   */
  async getSessionsAsync(userId?: string | null): Promise<RehearsalSession[]> {
    const cached = this.getSessions(userId);

    if (!userId) {
      return cached;
    }

    const db = getFirestoreInstance();
    if (!db) {
      return cached;
    }

    try {
      // Path: users/{userId}/sessions
      const sessionsRef = collection(db, 'users', userId, 'sessions');
      const snapshot = await getDocs(sessionsRef);
      
      const firestoreSessions: RehearsalSession[] = [];
      snapshot.forEach((docSnap) => {
        if (docSnap.exists()) {
          firestoreSessions.push(docSnap.data() as RehearsalSession);
        }
      });

      if (firestoreSessions.length > 0) {
        firestoreSessions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        // Cache to local storage
        try {
          const key = getStorageKey(userId);
          localStorage.setItem(key, JSON.stringify(firestoreSessions));
        } catch (e) {
          console.warn('Failed to cache Firestore sessions locally:', e);
        }
        return firestoreSessions;
      }

      return cached;
    } catch (error) {
      console.error('Error reading sessions from Firestore, falling back to local cache:', error);
      return cached;
    }
  },

  getSessionById(id: string, userId?: string | null): RehearsalSession | undefined {
    const sessions = this.getSessions(userId);
    return sessions.find((s) => s.id === id);
  },

  /**
   * Save or update a session in localStorage and Firestore (if signed in).
   */
  saveSession(session: RehearsalSession, userId?: string | null): RehearsalSession {
    const sessions = this.getSessions(userId);
    const existingIndex = sessions.findIndex((s) => s.id === session.id);
    
    const updatedSession: RehearsalSession = {
      ...session,
      userId: userId || session.userId || undefined,
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      sessions[existingIndex] = updatedSession;
    } else {
      sessions.unshift(updatedSession);
    }

    // Save to local storage
    try {
      const key = getStorageKey(userId);
      localStorage.setItem(key, JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to save session to local storage:', e);
    }

    // Async save to Firestore if user is logged in
    const targetUserId = userId || session.userId;
    if (targetUserId) {
      const db = getFirestoreInstance();
      if (db) {
        // Path pattern: users/{userId}/sessions/{sessionId}
        const sessionDocRef = doc(db, 'users', targetUserId, 'sessions', updatedSession.id);
        setDoc(sessionDocRef, updatedSession, { merge: true }).catch((err) => {
          console.error('Failed to save session to Firestore:', err);
        });
      }
    }

    return updatedSession;
  },

  /**
   * Delete a session from localStorage and Firestore (if signed in).
   */
  deleteSession(id: string, userId?: string | null): void {
    const sessions = this.getSessions(userId).filter((s) => s.id !== id);
    try {
      const key = getStorageKey(userId);
      localStorage.setItem(key, JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to update storage on delete:', e);
    }

    if (userId) {
      const db = getFirestoreInstance();
      if (db) {
        // Path pattern: users/{userId}/sessions/{sessionId}
        const sessionDocRef = doc(db, 'users', userId, 'sessions', id);
        deleteDoc(sessionDocRef).catch((err) => {
          console.error('Failed to delete session from Firestore:', err);
        });
      }
    }
  },

  /**
   * Migrate guest sessions to Firestore upon Google Sign-In.
   */
  async migrateGuestSessionsToCloud(userId: string): Promise<void> {
    const guestSessions = this.getSessions(null);
    if (!guestSessions || guestSessions.length === 0) return;

    const db = getFirestoreInstance();
    if (!db) return;

    try {
      for (const sess of guestSessions) {
        const migratedSession: RehearsalSession = {
          ...sess,
          userId,
          updatedAt: new Date().toISOString(),
        };
        // Path pattern: users/{userId}/sessions/{sessionId}
        const docRef = doc(db, 'users', userId, 'sessions', migratedSession.id);
        await setDoc(docRef, migratedSession, { merge: true });
        this.saveSession(migratedSession, userId);
      }
    } catch (e) {
      console.error('Error migrating guest sessions to cloud:', e);
    }
  }
};

