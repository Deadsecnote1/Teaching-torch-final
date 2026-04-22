const { db } = require('../src/firebase');
const { collection, doc, setDoc, writeBatch } = require('firebase/firestore');

async function migrate() {
  console.log('Starting AL Hierarchy Migration...');
  const batch = writeBatch(db);

  // 1. Create AL Streams
  const streams = [
    { id: 'science-stream', name: { english: 'Science Stream', sinhala: 'විද්‍යා අංශය', tamil: 'விஞ்ஞானத் துறை' }, order: 1, icon: 'bi-lightbulb' },
    { id: 'arts-stream', name: { english: 'Arts Stream', sinhala: 'කලා අංශය', tamil: 'கலைத் துறை' }, order: 2, icon: 'bi-palette' },
    { id: 'commerce-stream', name: { english: 'Commerce Stream', sinhala: 'වාණිජ අංශය', tamil: 'வர்த்தகத் துறை' }, order: 3, icon: 'bi-graph-up-arrow' }
  ];

  streams.forEach(stream => {
    const streamRef = doc(db, 'al_streams', stream.id);
    batch.set(streamRef, stream);
  });

  // 2. Create AL Subjects (for Science Stream)
  const scienceSubjects = [
    { id: 'physics', streamId: 'science-stream', name: { english: 'Physics', sinhala: 'භෞතික විද්‍යාව', tamil: 'பௌதிகவியல்' }, order: 1, icon: 'bi-speedometer2' },
    { id: 'chemistry', streamId: 'science-stream', name: { english: 'Chemistry', sinhala: 'රසායන විද්‍යාව', tamil: 'රසායන විද්‍යාව' }, order: 2, icon: 'bi-beaker' },
    { id: 'biology', streamId: 'science-stream', name: { english: 'Biology', sinhala: 'ජීව විද්‍යාව', tamil: 'உயிரியல்' }, order: 3, icon: 'bi-tree' },
    { id: 'maths', streamId: 'science-stream', name: { english: 'Combined Maths', sinhala: 'සංයුක්ත ගණිතය', tamil: 'இணைந்த கணிதம்' }, order: 4, icon: 'bi-calculator' }
  ];

  scienceSubjects.forEach(subject => {
    const subjectRef = doc(db, 'al_subjects', subject.id);
    batch.set(subjectRef, subject);
  });

  await batch.commit();
  console.log('AL Hierarchy Migration Successful!');
}

migrate().catch(console.error);
