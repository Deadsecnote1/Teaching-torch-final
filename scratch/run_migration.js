const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, updateDoc } = require('firebase/firestore');
require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrate() {
  console.log("Starting A/L migration...");

  try {
    // 1. Create the Master A/L Grade
    const alRef = doc(db, "grades", "al");
    await setDoc(alRef, {
      name: "Advanced Level",
      display: "Advanced Level",
      shortName: "A/L",
      order: 100,
      icon: "bi-mortarboard",
      color: "teal",
      visibleResourceTypes: [] // Inherit all
    });
    console.log("Created Master A/L Grade.");

    // 2. Link Science Stream to A/L
    const scienceRef = doc(db, "grades", "advanced_level_science");
    await updateDoc(scienceRef, {
      parentGradeId: "al",
      display: "Science Stream"
    });
    console.log("Linked Science Stream to A/L.");

    console.log("Migration complete.");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
