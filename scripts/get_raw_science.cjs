const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');
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

async function getRaw() {
  console.log("🔍 Getting raw science doc...");
  const d = await getDoc(doc(db, 'al_streams', 'science'));
  console.log(JSON.stringify(d.data(), null, 2));
  process.exit(0);
}

getRaw();
