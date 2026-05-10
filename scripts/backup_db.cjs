const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

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

const collectionsToBackup = [
  'grades',
  'subjects',
  'resources',
  'al_resources',
  'al_streams',
  'al_subjects',
  'al_resource_types',
  'al_sub_categories',
  'settings'
];

async function backup() {
  console.log("🚀 Starting Firestore Backup...");
  const backupData = {};
  
  for (const colName of collectionsToBackup) {
    console.log(`📦 Fetching collection: ${colName}...`);
    try {
      const snapshot = await getDocs(collection(db, colName));
      backupData[colName] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log(`✅ Fetched ${backupData[colName].length} documents from ${colName}.`);
    } catch (error) {
      console.error(`❌ Error fetching ${colName}:`, error.message);
    }
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `backup_${timestamp}.json`;
  const filepath = path.join(__dirname, '../backups', filename);

  fs.writeFileSync(filepath, JSON.stringify(backupData, null, 2));
  
  console.log("\n✨ Backup Complete!");
  console.log(`📂 Saved to: ${filepath}`);
  
  const totalDocs = Object.values(backupData).reduce((sum, col) => sum + col.length, 0);
  console.log(`📊 Total Documents Backed Up: ${totalDocs}`);
  
  process.exit(0);
}

backup();
