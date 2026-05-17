import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { initFirebase } from '../firebase';
import { resolveIsAdmin } from '../utils/adminAuth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheckLoading, setAdminCheckLoading] = useState(false);
  const [isManageMode, setIsManageMode] = useState(false);
  const instancesRef = useRef({ auth: null, db: null, analytics: null });
  const [isInitialized, setIsInitialized] = useState(false);

  const refreshAdminStatus = useCallback(async (user = currentUser) => {
    const { db } = instancesRef.current;
    if (!user || !db) {
      setIsAdmin(false);
      setAdminCheckLoading(false);
      return false;
    }

    setAdminCheckLoading(true);
    try {
      const admin = await resolveIsAdmin(db, user.uid);
      setIsAdmin(admin);
      if (!admin) setIsManageMode(false);
      return admin;
    } finally {
      setAdminCheckLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    let unsubscribe = null;

    const initialize = async () => {
      try {
        const { auth, db, analytics } = await initFirebase();
        const { onAuthStateChanged } = await import('firebase/auth');

        instancesRef.current = { auth, db, analytics };
        setIsInitialized(true);

        unsubscribe = onAuthStateChanged(auth, async (user) => {
          setCurrentUser(user);
          if (user) {
            setAdminCheckLoading(true);
            const admin = await resolveIsAdmin(db, user.uid);
            setIsAdmin(admin);
            if (!admin) setIsManageMode(false);
            setAdminCheckLoading(false);
          } else {
            setIsAdmin(false);
            setIsManageMode(false);
            setAdminCheckLoading(false);
          }
          setLoading(false);
        });
      } catch (err) {
        console.error('Firebase initialization failed:', err);
        setLoading(false);
        setAdminCheckLoading(false);
      }
    };

    initialize();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!currentUser && isManageMode) {
      setIsManageMode(false);
    }
  }, [currentUser, isManageMode]);

  useEffect(() => {
    if (!isAdmin && isManageMode) {
      setIsManageMode(false);
    }
  }, [isAdmin, isManageMode]);

  const login = useCallback(async (email, password) => {
    if (!instancesRef.current.auth) throw new Error('Auth not initialized');
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    return signInWithEmailAndPassword(instancesRef.current.auth, email, password);
  }, []);

  /** Sign in and verify allowlist; signs out if not an admin. */
  const loginAsAdmin = useCallback(
    async (email, password) => {
      const { signOut } = await import('firebase/auth');
      const credential = await login(email, password);
      const admin = await resolveIsAdmin(instancesRef.current.db, credential.user.uid);
      if (!admin) {
        await signOut(instancesRef.current.auth);
        setIsAdmin(false);
        setIsManageMode(false);
        const err = new Error('NOT_AUTHORIZED');
        err.code = 'NOT_AUTHORIZED';
        throw err;
      }
      setIsAdmin(true);
      setIsManageMode(true);
      return credential.user;
    },
    [login]
  );

  const logout = useCallback(async () => {
    if (!instancesRef.current.auth) return;
    const { signOut } = await import('firebase/auth');
    setIsManageMode(false);
    setIsAdmin(false);
    return signOut(instancesRef.current.auth);
  }, []);

  const setManageMode = useCallback(
    (value) => {
      if (value && !isAdmin) return;
      setIsManageMode(value);
    },
    [isAdmin]
  );

  const toggleManageMode = useCallback(() => {
    if (!isAdmin) return;
    setIsManageMode((prev) => !prev);
  }, [isAdmin]);

  const value = useMemo(
    () => ({
      currentUser,
      isAdmin,
      adminCheckLoading,
      isManageMode,
      toggleManageMode,
      setManageMode,
      login,
      loginAsAdmin,
      logout,
      refreshAdminStatus,
      auth: instancesRef.current.auth,
      db: instancesRef.current.db,
      analytics: instancesRef.current.analytics,
      isInitialized,
      firebaseProjectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || ''
    }),
    [
      currentUser,
      isAdmin,
      adminCheckLoading,
      isManageMode,
      toggleManageMode,
      setManageMode,
      login,
      loginAsAdmin,
      logout,
      refreshAdminStatus,
      isInitialized
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
