
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, deleteDoc } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
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
const auth = getAuth(app);

async function cleanup() {
  await signInWithEmailAndPassword(auth, 'admin@teachingtorch.lk', '14m4dm1n4tt');
  
  console.log('Fetching streams...');
  const streamsSnap = await getDocs(collection(db, 'al_streams'));
  streamsSnap.forEach(d => console.log(`Stream: ${d.id} - ${d.data().name}`));
  
  console.log('\nFetching subjects...');
  const subjectsSnap = await getDocs(collection(db, 'al_subjects'));
  subjectsSnap.forEach(d => console.log(`Subject: ${d.id} - ${d.data().name} (Stream: ${d.data().streamId})`));
  
  process.exit(0);
}

cleanup();
