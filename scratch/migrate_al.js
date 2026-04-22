
import { db } from '../src/firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

async function migrate() {
  console.log("Starting A/L migration...");

  // 1. Create the Master A/L Grade
  const alRef = doc(db, "grades", "al");
  await setDoc(alRef, {
    name: "Advanced Level",
    display: "Advanced Level",
    shortName: "A/L",
    order: 100, // Put it at the end
    icon: "bi-mortarboard",
    color: "#006764"
  });
  console.log("Created Master A/L Grade.");

  // 2. Link Science Stream to A/L
  const scienceRef = doc(db, "grades", "advanced_level_science");
  await updateDoc(scienceRef, {
    parentGradeId: "al",
    display: "Science Stream" // Rename for child view
  });
  console.log("Linked Science Stream to A/L.");

  console.log("Migration complete.");
}

migrate().catch(console.error);
