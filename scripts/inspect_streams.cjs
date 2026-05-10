const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
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

async function inspect() {
  console.log("🔍 Inspecting al_streams...");
  const snapshot = await getDocs(collection(db, 'al_streams'));
  snapshot.docs.forEach(doc => {
    console.log(`ID: ${doc.id} | Name: ${doc.data().name} | Icon: "${doc.data().icon}" | Color: ${doc.data().color}`);
  });
  process.exit(0);
}

inspect();
