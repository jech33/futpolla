export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

export interface AuthProvider {
  signInWithGoogle(): Promise<AuthUser>;
  signOut(): Promise<void>;
  onAuthStateChanged(
    onChange: (user: AuthUser | null) => void,
    onError: (error: unknown) => void
  ): () => void;
}
