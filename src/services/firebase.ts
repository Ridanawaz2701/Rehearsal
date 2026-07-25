import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User,
  Auth,
  NextOrObserver
} from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

/**
 * Read Firebase configuration from environment variables.
 * Do not hardcode any keys.
 */
const env = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || '',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: env.VITE_FIREBASE_APP_ID || '',
};

// Helper to check if Firebase configuration is provided
export const isFirebaseConfigured = (): boolean => {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.apiKey.trim().length > 0 && firebaseConfig.projectId);
};

// Lazy singletons
let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let googleProviderInstance: GoogleAuthProvider | null = null;

function getAuthInstance(): Auth | null {
  if (!isFirebaseConfigured()) {
    return null;
  }
  if (!authInstance) {
    if (!getApps().length) {
      appInstance = initializeApp(firebaseConfig);
    } else {
      appInstance = getApp();
    }
    authInstance = getAuth(appInstance);
  }
  return authInstance;
}

export function getFirestoreInstance(): Firestore | null {
  if (!isFirebaseConfigured()) {
    return null;
  }
  if (!dbInstance) {
    if (!getApps().length) {
      appInstance = initializeApp(firebaseConfig);
    } else {
      appInstance = getApp();
    }
    try {
      dbInstance = getFirestore(appInstance);
    } catch (e) {
      console.error('Failed to initialize Firestore:', e);
      return null;
    }
  }
  return dbInstance;
}

function getGoogleProvider(): GoogleAuthProvider {
  if (!googleProviderInstance) {
    googleProviderInstance = new GoogleAuthProvider();
  }
  return googleProviderInstance;
}

/**
 * Sign in with Google using popup flow with lazy initialization.
 */
export const signInWithGoogle = async (): Promise<User | null> => {
  const auth = getAuthInstance();
  if (!auth) {
    throw new Error('Google Sign-In is not configured. Please set VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID in your environment variables.');
  }
  try {
    const provider = getGoogleProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error: any) {
    if (error?.code === 'auth/unauthorized-domain') {
      console.warn('Firebase domain authorization notice:', error.message);
    } else {
      console.error('Google Sign-In Error:', error);
    }
    throw error;
  }
};

/**
 * Sign out current user safely.
 */
export const signOutUser = async (): Promise<void> => {
  const auth = getAuthInstance();
  if (!auth) return;
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign Out Error:', error);
    throw error;
  }
};

/**
 * Safe auth state listener that handles missing Firebase config gracefully.
 */
export const onAuthStateChanged = (
  callbackOrObserver: NextOrObserver<User | null>
): (() => void) => {
  const auth = getAuthInstance();
  if (!auth) {
    // If Firebase isn't configured, notify that user is null and return dummy unsubscribe
    if (typeof callbackOrObserver === 'function') {
      callbackOrObserver(null);
    } else if (callbackOrObserver && typeof callbackOrObserver.next === 'function') {
      callbackOrObserver.next(null);
    }
    return () => {};
  }

  return firebaseOnAuthStateChanged(auth, callbackOrObserver);
};

export type { User };
