import { firebaseConfig } from './firebaseConfig';

let firebaseApp = null;
let auth = null;
let db = null;
let analytics = null;

/**
 * Lazy-load and initialize Firebase only when needed.
 * This prevents blocking the main thread during initial app render.
 */
export const initFirebase = async () => {
  if (firebaseApp) return { app: firebaseApp, auth, db, analytics };

  // Dynamically import Firebase modules
  const [
    { initializeApp },
    { getAuth },
    { getFirestore },
    { isSupported, getAnalytics }
  ] = await Promise.all([
    import('firebase/app'),
    import('firebase/auth'),
    import('firebase/firestore'),
    import('firebase/analytics')
  ]);

  firebaseApp = initializeApp(firebaseConfig);
  auth = getAuth(firebaseApp);
  db = getFirestore(firebaseApp);
  
  // Defer analytics initialization to not block the main return
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(firebaseApp);
    }
  }).catch(err => {
    console.warn("Analytics deferred initialization failed:", err);
  });

  return { app: firebaseApp, auth, db, analytics };
};

// We still export these, but they will be null until initFirebase is called.
// Most components should now use the AuthContext to get these.
export { auth, db, analytics };
