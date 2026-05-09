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
  const { db, isInitialized } = useAuth();

  useEffect(() => {
    if (!isInitialized || !db) return;

    // Listen to Grades
    const unsubGrades = onSnapshot(query(collection(db, "grades")), (snapshot) => {
      const liveGrades = {};
      snapshot.forEach(doc => {
        liveGrades[doc.id] = { id: doc.id, ...doc.data() };
      });
      setGrades(liveGrades);
      setLoading(false);
    });

    // Listen to Subjects
    const unsubSubjects = onSnapshot(query(collection(db, "subjects")), (snapshot) => {
      const liveSubjects = {};
      snapshot.forEach(doc => {
        liveSubjects[doc.id] = { id: doc.id, ...doc.data() };
      });
      setSubjects(liveSubjects);
    });

    // Listen to Settings
    const unsubSettings = onSnapshot(doc(db, "settings", "general"), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      }
    });

    return () => {
      unsubGrades();
      unsubSubjects();
      unsubSettings();
    };
  }, [isInitialized, db]);

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
