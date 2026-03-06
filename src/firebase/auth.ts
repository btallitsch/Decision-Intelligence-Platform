import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from './config';

const googleProvider = new GoogleAuthProvider();
// Request email scope so we can display the gmail address
googleProvider.addScope('email');
googleProvider.addScope('profile');
// Always prompt account chooser so users can switch accounts
googleProvider.setCustomParameters({ prompt: 'select_account' });

// ─── Sign in with Google popup ─────────────────────────────────────────────
export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

// ─── Sign out ──────────────────────────────────────────────────────────────
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

// ─── Subscribe to auth state ───────────────────────────────────────────────
export function subscribeToAuthState(
  callback: (user: User | null) => void
): () => void {
  return onAuthStateChanged(auth, callback);
}

export type { User };
