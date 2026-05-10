const { initializeApp } = require('firebase/app');
const { getFirestore, doc, updateDoc } = require('firebase/firestore');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.staging') });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function updateIcon() {
  console.log("🛠 Updating Science icon to bi-lightbulb...");
  try {
    await updateDoc(doc(db, 'al_streams', 'science'), {
      icon: 'bi-lightbulb'
    });
    console.log("✅ Updated!");
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}

updateIcon();
