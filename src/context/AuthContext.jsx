import React, { createContext, useContext, useEffect, useState } from 'react';
import { initFirebase } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [isManageMode, setIsManageMode] = React.useState(false);
    const instancesRef = React.useRef({ auth: null, db: null, analytics: null });
    const [isInitialized, setIsInitialized] = React.useState(false);

    // Initialize Firebase in the background
    React.useEffect(() => {
        let unsubscribe = null;
        
        const initialize = async () => {
            try {
                const { auth, db, analytics } = await initFirebase();
                const { onAuthStateChanged } = await import('firebase/auth');
                
                instancesRef.current = { auth, db, analytics };
                setIsInitialized(true);
                
                unsubscribe = onAuthStateChanged(auth, (user) => {
                    setCurrentUser(user);
                    setLoading(false);
                });
            } catch (err) {
                console.error("Firebase initialization failed:", err);
                setLoading(false);
            }
        };

        initialize();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    React.useEffect(() => {
        if (!currentUser && isManageMode) {
            setIsManageMode(false);
        }
    }, [currentUser, isManageMode]);

    const login = React.useCallback(async (email, password) => {
        if (!instancesRef.current.auth) throw new Error("Auth not initialized");
        const { signInWithEmailAndPassword } = await import('firebase/auth');
        return signInWithEmailAndPassword(instancesRef.current.auth, email, password);
    }, []);

    const logout = React.useCallback(async () => {
        if (!instancesRef.current.auth) return;
        const { signOut } = await import('firebase/auth');
        return signOut(instancesRef.current.auth);
    }, []);

    const setManageMode = React.useCallback((value) => {
        setIsManageMode(value);
    }, []);

    const toggleManageMode = React.useCallback(() => {
        setIsManageMode(prev => !prev);
    }, []);

    const value = React.useMemo(() => ({
        currentUser,
        isManageMode,
        toggleManageMode,
        setManageMode,
        login,
        logout,
        auth: instancesRef.current.auth,
        db: instancesRef.current.db,
        analytics: instancesRef.current.analytics,
        isInitialized
    }), [currentUser, isManageMode, toggleManageMode, setManageMode, login, logout, isInitialized]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
