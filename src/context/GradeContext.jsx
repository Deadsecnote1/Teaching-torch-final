import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { getCached, setCache, invalidateCache } from '../utils/cacheUtils';
import { getDocs, getDoc, doc as firestoreDoc, collection, query, onSnapshot, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const GradeContext = createContext();

// Helper to process collection snapshots
const processSnapshot = (snapshot) => {
  const data = {};
  snapshot.forEach(doc => {
    data[doc.id] = { id: doc.id, ...doc.data() };
  });
  return data;
};

export const GradeProvider = ({ children }) => {
  const [grades, setGrades] = useState({});
  const [subjects, setSubjects] = useState({});
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { db, isInitialized, isManageMode } = useAuth();

  useEffect(() => {
    if (!isInitialized || !db) return;

    const fetchInitialData = async () => {
      try {
        const fetchCollection = async (colName, setter, isSingle = false) => {
          let data = isManageMode ? null : getCached(colName);
          if (!data) {
            if (isSingle) {
              const snap = await getDoc(firestoreDoc(db, colName, 'general'));
              data = snap.exists() ? snap.data() : {};
            } else {
              const snap = await getDocs(query(collection(db, colName)));
              data = processSnapshot(snap);
            }
            if (!isManageMode) setCache(colName, data);
          }
          setter(data);
        };

        await Promise.all([
          fetchCollection('grades', setGrades),
          fetchCollection('subjects', setSubjects),
          fetchCollection('settings', setSettings, true)
        ]);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching initial grade data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchInitialData();

    let unsubs = [];
    if (isManageMode) {
      console.log("%c[Admin] Real-time Listeners Active", "color: #3b82f6; font-weight: bold;");
      
      const setupListener = (colName, setter, isSingle = false) => {
        const target = isSingle ? firestoreDoc(db, colName, 'general') : query(collection(db, colName));
        return onSnapshot(target, (snap) => {
          const data = isSingle ? (snap.exists() ? snap.data() : {}) : processSnapshot(snap);
          setter(data);
          invalidateCache(colName);
        });
      };

      unsubs = [
        setupListener('grades', setGrades),
        setupListener('subjects', setSubjects),
        setupListener('settings', setSettings, true)
      ];
    }

    return () => unsubs.forEach(unsub => unsub());
  }, [isInitialized, db, isManageMode]);

  const addGrade = useCallback(async (gradeId, gradeData) => {
    if (!db) return false;
    await setDoc(firestoreDoc(db, "grades", gradeId), { ...gradeData, id: gradeId, active: true });
    return true;
  }, [db]);

  const updateGrade = useCallback(async (gradeId, gradeData) => {
    if (!db) return false;
    await updateDoc(firestoreDoc(db, "grades", gradeId), gradeData);
    return true;
  }, [db]);

  const deleteGrade = useCallback(async (gradeId) => {
    if (!db) return false;
    await deleteDoc(firestoreDoc(db, "grades", gradeId));
    return true;
  }, [db]);

  const addSubject = useCallback(async (subjectId, subjectData) => {
    if (!db) return false;
    await setDoc(firestoreDoc(db, "subjects", subjectId), { ...subjectData, id: subjectId });
    return true;
  }, [db]);

  const updateSubject = useCallback(async (subjectId, subjectData) => {
    if (!db) return false;
    await updateDoc(firestoreDoc(db, "subjects", subjectId), subjectData);
    return true;
  }, [db]);

  const deleteSubject = useCallback(async (subjectId) => {
    if (!db) return false;
    await deleteDoc(firestoreDoc(db, "subjects", subjectId));
    return true;
  }, [db]);

  // Pre-sort subjects by order/name
  const sortedSubjects = useMemo(() => {
    return Object.entries(subjects).sort((a, b) => {
      const orderA = a[1].order ?? 999;
      const orderB = b[1].order ?? 999;
      return orderA !== orderB ? orderA - orderB : (a[1].name || '').localeCompare(b[1].name || '');
    });
  }, [subjects]);

  const getSubjectsForGrade = useCallback((gradeId) => {
    const filtered = sortedSubjects.filter(([_, sub]) => sub.grades?.includes(gradeId));
    return Object.fromEntries(filtered);
  }, [sortedSubjects]);

  const generateGradePageData = useCallback((gradeId) => {
    const grade = grades[gradeId];
    if (!grade) return { grade: null, subjects: {} };
    return { grade, subjects: getSubjectsForGrade(gradeId) };
  }, [grades, getSubjectsForGrade]);

  const value = useMemo(() => ({
    grades,
    subjects,
    settings,
    loading,
    error,
    addGrade,
    updateGrade,
    deleteGrade,
    addSubject,
    updateSubject,
    deleteSubject,
    getSubjectsForGrade,
    generateGradePageData
  }), [
    grades, subjects, settings, loading, error, 
    addGrade, updateGrade, deleteGrade, 
    addSubject, updateSubject, deleteSubject,
    getSubjectsForGrade, generateGradePageData
  ]);

  return <GradeContext.Provider value={value}>{children}</GradeContext.Provider>;
};

export const useGrades = () => useContext(GradeContext);
export default GradeContext;
