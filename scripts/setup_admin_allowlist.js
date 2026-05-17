import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';

/**
 * SETUP INSTRUCTIONS:
 * 1. Download your service account key from Firebase Console -> Project Settings -> Service Accounts
 * 2. Save it as 'serviceAccountKey.json' in this folder
 * 3. Update the 'adminUids' array below with your actual Firebase Auth UIDs
 * 4. Run: node scripts/setup_admin_allowlist.js
 */

const adminUids = [
  "YOUR_AUTH_UID_HERE", 
  // Add more UIDs here
];

async function setup() {
  try {
    const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'));

    initializeApp({
      credential: cert(serviceAccount)
    });

    const db = getFirestore();
    const docRef = db.collection('admins').doc('allowedList');

    await docRef.set({ uids: adminUids });
    
    console.log('Successfully updated admin allowlist with UIDs:', adminUids);
    console.log('You can now safely deploy your firestore.rules');
  } catch (error) {
    console.error('Setup failed:', error);
    console.log('\nTIP: Make sure serviceAccountKey.json exists in the current directory.');
  }
}

setup();
