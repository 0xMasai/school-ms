import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../db/firebase.js';
import { getUserByUid } from '../db/userService.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true); // true until first auth check resolves

  useEffect(() => {
    // Firebase Auth persists session automatically across app restarts.
    // onAuthStateChanged fires immediately with the current auth state on mount.
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await getUserByUid(firebaseUser.uid);
          if (profile?.active) {
            setUser(profile);
          } else {
            // Account exists in Firebase Auth but has been deactivated in Firestore
            await signOut(auth);
            setUser(null);
          }
        } catch (err) {
          console.error('Failed to load user profile:', err);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe; // Cleanup listener on unmount
  }, []);

  // login: signs in via Firebase Auth, then immediately fetches the Firestore
  // profile so the caller gets a fully-populated user object.
  const login = useCallback(async (email, password) => {
    const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    const profile    = await getUserByUid(credential.user.uid);

    if (!profile) {
      await signOut(auth);
      throw new Error('Account not configured. Contact your administrator.');
    }
    if (!profile.active) {
      await signOut(auth);
      throw new Error('Your account has been deactivated. Contact your administrator.');
    }

    setUser(profile);
    return profile;
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
  }, []);

  // Call this after an admin edits their own profile in Firestore
  const refreshUser = useCallback(async () => {
    if (!auth.currentUser) return;
    const profile = await getUserByUid(auth.currentUser.uid);
    if (profile) setUser(profile);
  }, []);

  const hasRole  = useCallback((...roles) => !!user && roles.includes(user.role), [user]);
  const isAdmin   = useCallback(() => user?.role === 'admin',   [user]);
  const isTeacher = useCallback(() => user?.role === 'teacher', [user]);
  const isBursar  = useCallback(() => user?.role === 'bursar',  [user]);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, refreshUser, hasRole, isAdmin, isTeacher, isBursar }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
