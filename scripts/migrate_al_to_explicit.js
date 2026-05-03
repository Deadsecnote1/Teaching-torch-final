
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc } = require('firebase/firestore');
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

async function migrate() {
  await signInWithEmailAndPassword(auth, 'admin@teachingtorch.lk', '14m4dm1n4tt');
  
  console.log('Fetching all subjects...');
  const subjectsSnap = await getDocs(collection(db, 'al_subjects'));
  const allSubjectIds = subjectsSnap.docs.map(d => d.id);
  console.log(`Found ${allSubjectIds.length} subjects.`);

  // Migrate Resource Types
  console.log('\nMigrating Resource Types...');
  const typesSnap = await getDocs(collection(db, 'al_resource_types'));
  for (const d of typesSnap.docs) {
    const data = d.data();
    if (!data.subjectIds || data.subjectIds.length === 0) {
      console.log(`Populating global type: ${d.id} (${data.name})`);
      await updateDoc(doc(db, 'al_resource_types', d.id), { subjectIds: allSubjectIds });
    }
  }

  // Migrate Sub Categories
  console.log('\nMigrating Sub Categories...');
  const subCatsSnap = await getDocs(collection(db, 'al_sub_categories'));
  for (const d of subCatsSnap.docs) {
    const data = d.data();
    if (!data.subjectIds || data.subjectIds.length === 0) {
      console.log(`Populating global sub-cat: ${d.id} (${data.name})`);
      await updateDoc(doc(db, 'al_sub_categories', d.id), { subjectIds: allSubjectIds });
    }
  }

  console.log('\nMigration complete!');
  process.exit(0);
}

migrate().catch(console.error);
