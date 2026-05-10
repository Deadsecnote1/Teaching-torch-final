const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

// Allow passing a custom env file (e.g. node scripts/restore_db.cjs backup.json .env.staging)
const envFile = process.argv[3] || '.env';
require('dotenv').config({ path: path.join(__dirname, '..', envFile) });

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

const backupFile = process.argv[2];

if (!backupFile) {
  console.error("❌ Please provide the backup filename: node scripts/restore_db.cjs <filename>");
  process.exit(1);
}

const filepath = path.isAbsolute(backupFile) ? backupFile : path.join(__dirname, '../backups', backupFile);

if (!fs.existsSync(filepath)) {
  console.error(`❌ File not found: ${filepath}`);
  process.exit(1);
}

async function restore() {
  console.log(`🚀 Starting Firestore Restore from ${backupFile}...`);
  console.log(`🎯 Targeting Project: ${firebaseConfig.projectId}`);
  
  const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
  let totalRestored = 0;

  for (const [colName, docs] of Object.entries(data)) {
    console.log(`📤 Restoring collection: ${colName} (${docs.length} docs)...`);
    for (const docData of docs) {
      const { id, ...payload } = docData;
      try {
        await setDoc(doc(db, colName, id), payload);
        totalRestored++;
      } catch (error) {
        console.error(`❌ Error restoring ${colName}/${id}:`, error.message);
      }
    }
  }

  console.log("\n✨ Restore Complete!");
  console.log(`📊 Total Documents Restored: ${totalRestored}`);
  process.exit(0);
}

restore();
