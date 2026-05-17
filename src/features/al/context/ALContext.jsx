import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  collection,
  onSnapshot,
  query,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  where
} from 'firebase/firestore';

const ALContext = createContext();

const normalizeString = (val) => {
  if (typeof val === 'object' && val !== null) {
    return val.english || val.sinhala || val.tamil || Object.values(val)[0] || '';
  }
  return val || '';
};

export const ALProvider = ({ children }) => {
  const [alStreams, setAlStreams] = useState([]);
  const [alSubjects, setAlSubjects] = useState([]);
  const [alResourceTypes, setAlResourceTypes] = useState([]);
  const [alSubCategories, setAlSubCategories] = useState([]);
  const [alResources, setAlResources] = useState([]);

  const [status, setStatus] = useState('idle'); // idle | loading | ready | error
  const [error, setError] = useState(null);
  const { db, isInitialized } = useAuth();

  const processDoc = React.useCallback((doc) => {
    const d = doc.data();
    const obj = { id: doc.id, ...d };
    if (d.name) obj.name = normalizeString(d.name);
    if (d.description) obj.description = normalizeString(d.description);
    if (d.title) obj.title = normalizeString(d.title);
    if (d.icon) obj.icon = normalizeString(d.icon);
    if (d.color) obj.color = normalizeString(d.color);
    return obj;
  }, []);

  const initializeALData = React.useCallback(async () => {
    if (!isInitialized || !db || status === 'loading' || alStreams.length > 0) return;
    
    setStatus('loading');
    console.log("%c[AL] Initializing Lazy Metadata", "color: #8b5cf6; font-weight: bold;");
    
    try {
      const { getDocs, query, collection } = await import('firebase/firestore');
      
      const collections = ['al_streams', 'al_subjects', 'al_resource_types', 'al_sub_categories'];
      const setters = {
        al_streams: setAlStreams,
        al_subjects: setAlSubjects,
        al_resource_types: setAlResourceTypes,
        al_sub_categories: setAlSubCategories
      };

      const results = await Promise.all(
        collections.map(colName => getDocs(query(collection(db, colName))))
      );

      results.forEach((snapshot, index) => {
        const colName = collections[index];
        const data = snapshot.docs.map(processDoc);
        data.sort((a, b) => (a.order || 0) - (b.order || 0));
        setters[colName](data);
      });

      setStatus('ready');
    } catch (err) {
      console.error("Error loading AL data:", err);
      setError(err.message);
      setStatus('error');
    }
  }, [isInitialized, db, status, alStreams.length, processDoc]);

  const listenersRef = React.useRef({});
  const [fetchedSubjects, setFetchedSubjects] = useState({});

  const fetchALResources = React.useCallback((subjectId = null) => {
    if (!db || !subjectId || fetchedSubjects[subjectId]) return;
    
    try {
      const q = query(collection(db, 'al_resources'), where('alSubjectId', '==', subjectId));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fresh = snapshot.docs.map(processDoc);
        setAlResources(prev => {
          const others = prev.filter(r => r.alSubjectId !== subjectId);
          const combined = [...others, ...fresh];
          combined.sort((a, b) => (a.order || 0) - (b.order || 0));
          return combined;
        });
      });
      
      listenersRef.current[subjectId] = unsubscribe;
      setFetchedSubjects(prev => ({ ...prev, [subjectId]: true }));
    } catch (err) {
      console.error("Error setting up AL subject listener:", err);
    }
  }, [db, fetchedSubjects, processDoc]);

  useEffect(() => {
    return () => {
      Object.values(listenersRef.current).forEach(unsub => {
        if (typeof unsub === 'function') unsub();
      });
    };
  }, []);

  const addDocument = React.useCallback(async (collectionName, data, customId = null) => {
    if (!db) return false;
    try {
      if (customId) {
        await setDoc(doc(db, collectionName, customId), data);
      } else {
        await addDoc(collection(db, collectionName), data);
      }
      return true;
    } catch (e) {
      console.error(`Error adding to ${collectionName}:`, e);
      return false;
    }
  }, [db]);

  const updateDocument = React.useCallback(async (collectionName, id, data) => {
    if (!db) return false;
    try {
      const { id: _, ...rest } = data;
      const cleanData = Object.fromEntries(
        Object.entries(rest).filter(([_, v]) => v !== undefined)
      );
      await updateDoc(doc(db, collectionName, id), cleanData);
      return true;
    } catch (e) {
      console.error(`Error updating ${collectionName}:`, e);
      return false;
    }
  }, [db]);

  const deleteDocument = React.useCallback(async (collectionName, id) => {
    if (!db) return false;
    try {
      await deleteDoc(doc(db, collectionName, id));
      return true;
    } catch (e) {
      console.error(`Error deleting from ${collectionName}:`, e);
      return false;
    }
  }, [db]);

  const value = React.useMemo(() => ({
    alStreams,
    alSubjects,
    alResourceTypes,
    alSubCategories,
    alResources,
    loading: status === 'loading',
    status,
    error,
    initializeALData,
    fetchALResources,
    addDocument,
    updateDocument,
    deleteDocument,
    db
  }), [
    alStreams, alSubjects, alResourceTypes, alSubCategories, 
    alResources, status, error, initializeALData, fetchALResources, 
    addDocument, updateDocument, deleteDocument, db
  ]);

  return (
    <ALContext.Provider value={value}>
      {children}
    </ALContext.Provider>
  );
};

export const useALData = () => {
  const context = useContext(ALContext);
  if (context === undefined) {
    throw new Error('useALData must be used within an ALProvider');
  }
  return context;
};

export default ALContext;
