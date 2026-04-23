
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, collection } = require('firebase/firestore');
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

const data = {
  streams: [
    { id: 'science', name: 'Science Stream', color: '#0ea5e9', icon: 'bi-flask', order: 1 },
    { id: 'commerce', name: 'Commerce Stream', color: '#10b981', icon: 'bi-briefcase', order: 2 },
    { id: 'arts', name: 'Arts Stream', color: '#f59e0b', icon: 'bi-palette', order: 3 },
    { id: 'technology', name: 'Technology Stream', color: '#6366f1', icon: 'bi-cpu', order: 4 }
  ],
  subjects: [
    // Science
    { id: 'combined-maths', name: 'Combined Mathematics', streamId: 'science', icon: 'bi-calculator', order: 1 },
    { id: 'physics-sci', name: 'Physics', streamId: 'science', icon: 'bi-lightning', order: 2 },
    { id: 'chemistry-sci', name: 'Chemistry', streamId: 'science', icon: 'bi-droplet', order: 3 },
    { id: 'ict-sci', name: 'Information And Communication Technology', streamId: 'science', icon: 'bi-pc-display', order: 4 },
    { id: 'biology-sci', name: 'Biology', streamId: 'science', icon: 'bi-tree', order: 5 },
    { id: 'agri-sci', name: 'Agricultural Science', streamId: 'science', icon: 'bi-flower1', order: 6 },
    
    // Commerce
    { id: 'business-studies', name: 'Business Studies', streamId: 'commerce', icon: 'bi-graph-up-arrow', order: 1 },
    { id: 'accounting', name: 'Accounting', streamId: 'commerce', icon: 'bi-calculator-fill', order: 2 },
    { id: 'economics-com', name: 'Economics', streamId: 'commerce', icon: 'bi-currency-dollar', order: 3 },
    { id: 'business-stats-com', name: 'Business Statistics', streamId: 'commerce', icon: 'bi-bar-chart', order: 4 },
    
    // Arts
    { id: 'buddhism', name: 'Buddhism', streamId: 'arts', icon: 'bi-sun', order: 1 },
    { id: 'hinduism', name: 'Hinduism', streamId: 'arts', icon: 'bi-brightness-high', order: 2 },
    { id: 'islam', name: 'Islam', streamId: 'arts', icon: 'bi-moon-stars', order: 3 },
    { id: 'christianity', name: 'Christianity', streamId: 'arts', icon: 'bi-plus-lg', order: 4 },
    { id: 'higher-maths-arts', name: 'Higher Mathematics', streamId: 'arts', icon: 'bi-infinity', order: 5 },
    { id: 'business-stats-arts', name: 'Business Statistics', streamId: 'arts', icon: 'bi-bar-chart', order: 6 },
    { id: 'bud-civ', name: 'Buddhist Civilization', streamId: 'arts', icon: 'bi-bank', order: 7 },
    { id: 'hin-civ', name: 'Hindu Civilization', streamId: 'arts', icon: 'bi-bank2', order: 8 },
    { id: 'isl-civ', name: 'Islam Civilization', streamId: 'arts', icon: 'bi-building-columns', order: 9 },
    { id: 'chr-civ', name: 'Christian Civilization', streamId: 'arts', icon: 'bi-house-heart', order: 10 },
    { id: 'greek-roman-civ', name: 'Greek and Roman Civilization', streamId: 'arts', icon: 'bi-columns-gap', order: 11 },
    { id: 'maths-arts', name: 'Mathematics', streamId: 'arts', icon: 'bi-plus-slash-minus', order: 12 },
    { id: 'economics-arts', name: 'Economics', streamId: 'arts', icon: 'bi-coin', order: 13 },
    { id: 'political-science', name: 'Political Science', streamId: 'arts', icon: 'bi-flag', order: 14 },
    { id: 'history', name: 'History', streamId: 'arts', icon: 'bi-clock-history', order: 15 },
    { id: 'home-economics', name: 'Home Economics', streamId: 'arts', icon: 'bi-house-door', order: 16 },
    { id: 'geography', name: 'Geography', streamId: 'arts', icon: 'bi-geo-alt', order: 17 },
    { id: 'logic', name: 'Logic and Scientific Method', streamId: 'arts', icon: 'bi-puzzle', order: 18 },
    { id: 'mass-media', name: 'Mass Media and Communication Studies', streamId: 'arts', icon: 'bi-megaphone', order: 19 },
    { id: 'aesthetic', name: 'Aesthetic subjects (Dancing, Music, Drama, Arts)', streamId: 'arts', icon: 'bi-music-note-beamed', order: 20 },
    { id: 'agri-arts', name: 'Agricultural Science', streamId: 'arts', icon: 'bi-tree-fill', order: 21 },
    
    // Languages (under Arts for now)
    { id: 'lang-sinhala', name: 'Sinhala Language', streamId: 'arts', icon: 'bi-translate', order: 30 },
    { id: 'lang-tamil', name: 'Tamil Language', streamId: 'arts', icon: 'bi-translate', order: 31 },
    { id: 'lang-english', name: 'English Language', streamId: 'arts', icon: 'bi-translate', order: 32 },
    
    // Technology
    { id: 'eng-tech', name: 'Engineering Technology', streamId: 'technology', icon: 'bi-tools', order: 1 },
    { id: 'sft', name: 'Science for Technology', streamId: 'technology', icon: 'bi-microscope', order: 2 },
    { id: 'bio-tech', name: 'Bio-system Technology', streamId: 'technology', icon: 'bi-dna', order: 3 },
    { id: 'maths-tech', name: 'Mathematics', streamId: 'technology', icon: 'bi-calculator', order: 4 }
  ]
};

async function populate() {
  console.log('Starting population...');
  
  try {
    console.log('Authenticating...');
    await signInWithEmailAndPassword(auth, 'admin@teachingtorch.lk', '14m4dm1n4tt');
    console.log('Authenticated successfully!');
  } catch (err) {
    console.error('Authentication failed:', err.message);
    process.exit(1);
  }
  
  for (const stream of data.streams) {
    await setDoc(doc(db, 'al_streams', stream.id), stream);
    console.log(`Added Stream: ${stream.name}`);
  }
  
  for (const subject of data.subjects) {
    await setDoc(doc(db, 'al_subjects', subject.id), subject);
    console.log(`Added Subject: ${subject.name} (${subject.streamId})`);
  }
  
  console.log('Population complete!');
  process.exit(0);
}

populate().catch(err => {
  console.error(err);
  process.exit(1);
});
