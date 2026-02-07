import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserProfile, UserRole } from '@/types';
import { User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const logoutFirebase = async () => {
  return signOut(auth);
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const docRef = doc(db, 'users', uid);
  const snap = await getDoc(docRef);
  return snap.exists() ? (snap.data() as UserProfile) : null;
};

export const syncUserProfile = async (currentUser: User): Promise<UserProfile> => {
  const userRef = doc(db, 'users', currentUser.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }

  const newUser: UserProfile = {
    uid: currentUser.uid,
    email: currentUser.email || '',
    displayName: currentUser.displayName || '',
    photoURL: currentUser.photoURL || '',
    totalPoints: 0,
    ranking: 999,
    role: UserRole.USER,
  };

  await setDoc(userRef, newUser);
  return newUser;
};
