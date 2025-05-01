import { createContext, JSX, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';
import { app } from './firebase';

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profile: { displayName?: string }) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    const user = auth.currentUser;
    if (user) {
      console.log('User signed in:', user);
      const idToken = await user.getIdToken();
      document.cookie = `firebaseIdToken=${idToken}; path=/;`; // Set cookie syn
      localStorage.setItem('firebaseIdToken', idToken);
    }
  };

  const signUp = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    await signOut(auth).then(async () => {
      document.cookie = 'firebaseIdToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }).finally(() => {
      setUser(null);
      setLoading(false);
      window.location.href = '/login'; // Redirect to login page after logout
    })
  };

  const updateProfile = async (profile: { displayName?: string }) => {
    if (!auth.currentUser) return;
    await updateProfile(profile);
    setUser({ ...auth.currentUser, ...profile });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        logout,
        updateProfile,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};