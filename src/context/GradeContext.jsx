import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  collection,
  onSnapshot,
  query,
  doc,
  setDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';

const GradeContext = createContext();

export const GradeProvider = ({ children }) => {
  const [grades, setGrades] = useState({});
  const [subjects, setSubjects] = useState({});
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const { db, isInitialized, isManageMode } = useAuth();

  useEffect(() => {
    if (!isInitialized || !db) return;

    const { getCached, setCache, invalidateCache } = require('../utils/cacheUtils');

    // 1. Load from cache OR one-time fetch for everyone
    const fetchInitialData = async () => {
      try {
        const { getDocs, query, collection, doc, getDoc } = await import('firebase/firestore');
        
        // Cache-aware fetch for Grades
        let liveGrades = isManageMode ? null : getCached('grades');
        if (!liveGrades) {
          const gradesSnap = await getDocs(query(collection(db, "grades")));
          liveGrades = {};
          gradesSnap.forEach(doc => {
            liveGrades[doc.id] = { id: doc.id, ...doc.data() };
          });
          if (!isManageMode) setCache('grades', liveGrades);
        }
        setGrades(liveGrades);
        
        // Cache-aware fetch for Subjects
        let liveSubjects = isManageMode ? null : getCached('subjects');
        if (!liveSubjects) {
          const subjectsSnap = await getDocs(query(collection(db, "subjects")));
          liveSubjects = {};
          subjectsSnap.forEach(doc => {
            liveSubjects[doc.id] = { id: doc.id, ...doc.data() };
          });
          if (!isManageMode) setCache('subjects', liveSubjects);
        }
        setSubjects(liveSubjects);
        
        // Cache-aware fetch for Settings
        let liveSettings = isManageMode ? null : getCached('settings');
        if (!liveSettings) {
          const settingsSnap = await getDoc(doc(db, "settings", "general"));
          if (settingsSnap.exists()) {
            liveSettings = settingsSnap.data();
            if (!isManageMode) setCache('settings', liveSettings);
          }
        }
        if (liveSettings) setSettings(liveSettings);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching initial grade data:", err);
        setLoading(false);
      }
    };

    fetchInitialData();

    // 2. Real-time listeners ONLY if in Manage Mode (Admin)
    let unsubs = [];
    if (isManageMode) {
      console.log("%c[Admin] Real-time Listeners Active", "color: #3b82f6; font-weight: bold;");
      
      // Listen to Grades
      unsubs.push(onSnapshot(query(collection(db, "grades")), (snapshot) => {
        const liveGrades = {};
        snapshot.forEach(doc => {
          liveGrades[doc.id] = { id: doc.id, ...doc.data() };
        });
        setGrades(liveGrades);
        // Clear cache so it's fresh for next user-mode visit
        invalidateCache('grades');
      }));

      // Listen to Subjects
      unsubs.push(onSnapshot(query(collection(db, "subjects")), (snapshot) => {
        const liveSubjects = {};
        snapshot.forEach(doc => {
          liveSubjects[doc.id] = { id: doc.id, ...doc.data() };
        });
        setSubjects(liveSubjects);
        invalidateCache('subjects');
      }));

      // Listen to Settings
      unsubs.push(onSnapshot(doc(db, "settings", "general"), (docSnap) => {
        if (docSnap.exists()) {
          setSettings(docSnap.data());
          invalidateCache('settings');
        }
      }));
    }

    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, [isInitialized, db, isManageMode]);

  const addGrade = useCallback(async (gradeId, gradeData) => {
    if (!db) return false;
    const docRef = doc(db, "grades", gradeId);
    await setDoc(docRef, { ...gradeData, id: gradeId, active: true });
    return true;
  }, [db]);

  const updateGrade = useCallback(async (gradeId, gradeData) => {
    if (!db) return false;
    await updateDoc(doc(db, "grades", gradeId), gradeData);
    return true;
  }, [db]);

  const deleteGrade = useCallback(async (gradeId) => {
    if (!db) return false;
    await deleteDoc(doc(db, "grades", gradeId));
    return true;
  }, [db]);

  const addSubject = useCallback(async (subjectId, subjectData) => {
    if (!db) return false;
    await setDoc(doc(db, "subjects", subjectId), { ...subjectData, id: subjectId });
    return true;
  }, [db]);

  const updateSubject = useCallback(async (subjectId, subjectData) => {
    if (!db) return false;
    await updateDoc(doc(db, "subjects", subjectId), subjectData);
    return true;
  }, [db]);

  const deleteSubject = useCallback(async (subjectId) => {
    if (!db) return false;
    await deleteDoc(doc(db, "subjects", subjectId));
    return true;
  }, [db]);

  const getSubjectsForGrade = useCallback((gradeId) => {
    const validSubjectsArray = Object.entries(subjects)
      .filter(([_, subject]) => subject.grades?.includes(gradeId));

    validSubjectsArray.sort((a, b) => {
      const orderA = a[1].order !== undefined ? a[1].order : 999;
      const orderB = b[1].order !== undefined ? b[1].order : 999;
      return orderA !== orderB ? orderA - orderB : (a[1].name || '').localeCompare(b[1].name || '');
    });

    return Object.fromEntries(validSubjectsArray);
  }, [subjects]);

  const generateGradePageData = useCallback((gradeId) => {
    const grade = grades[gradeId];
    if (!grade) return { grade: null, subjects: {} };

    const gradeSubjects = getSubjectsForGrade(gradeId);
    return { grade, subjects: gradeSubjects };
  }, [grades, getSubjectsForGrade]);

  const value = {
    grades,
    subjects,
    settings,
    loading,
    addGrade,
    updateGrade,
    deleteGrade,
    addSubject,
    updateSubject,
    deleteSubject,
    getSubjectsForGrade,
    generateGradePageData
  };

  return <GradeContext.Provider value={value}>{children}</GradeContext.Provider>;
};

export const useGrades = () => useContext(GradeContext);
export default GradeContext;
