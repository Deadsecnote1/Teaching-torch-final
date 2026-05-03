
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
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

async function audit() {
  await signInWithEmailAndPassword(auth, 'admin@teachingtorch.lk', '14m4dm1n4tt');
  
  console.log('--- AUDIT: A/L STREAMS ---');
  const streamsSnap = await getDocs(collection(db, 'al_streams'));
  streamsSnap.forEach(d => console.log(`ID: ${d.id} | Name: ${d.data().name}`));

  console.log('\n--- AUDIT: A/L SUBJECTS ---');
  const subjectsSnap = await getDocs(collection(db, 'al_subjects'));
  subjectsSnap.forEach(d => console.log(`ID: ${d.id} | Name: ${d.data().name} | Stream: ${d.data().streamId}`));

  console.log('\n--- AUDIT: A/L RESOURCE TYPES ---');
  const typesSnap = await getDocs(collection(db, 'al_resource_types'));
  typesSnap.forEach(d => console.log(`ID: ${d.id} | Name: ${d.data().name} | Subjects: ${d.data().subjectIds?.length || 0}`));

  process.exit(0);
}

audit().catch(console.error);
