import React, { createContext, useContext, useEffect, useState } from 'react';
import { initFirebase } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isManageMode, setIsManageMode] = useState(false);
    const [instances, setInstances] = useState({ auth: null, db: null, analytics: null });

    // Initialize Firebase in the background
    useEffect(() => {
        let unsubscribe = null;
        
        const initialize = async () => {
            try {
                const { auth, db, analytics } = await initFirebase();
                const { onAuthStateChanged } = await import('firebase/auth');
                
                setInstances({ auth, db, analytics });
                
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

    useEffect(() => {
        if (!currentUser) {
            setIsManageMode(false);
        }
    }, [currentUser]);

    const login = async (email, password) => {
        if (!instances.auth) throw new Error("Auth not initialized");
        const { signInWithEmailAndPassword } = await import('firebase/auth');
        return signInWithEmailAndPassword(instances.auth, email, password);
    };

    const logout = async () => {
        if (!instances.auth) return;
        const { signOut } = await import('firebase/auth');
        return signOut(instances.auth);
    };

    const setManageMode = (value) => {
        setIsManageMode(value);
    };

    const toggleManageMode = () => {
        setIsManageMode(prev => !prev);
    };

    const value = {
        currentUser,
        isManageMode,
        toggleManageMode,
        setManageMode,
        login,
        logout,
        auth: instances.auth,
        db: instances.db,
        analytics: instances.analytics,
        isInitialized: !!instances.auth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
