import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
  collection,
  onSnapshot,
  query,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc
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

  const [loading, setLoading] = useState(true);
  const { db, isInitialized } = useAuth();

  useEffect(() => {
    if (!isInitialized || !db) return;

    const processDoc = (doc) => {
      const d = doc.data();
      const obj = {
        id: doc.id,
        ...d
      };
      if (d.name) obj.name = normalizeString(d.name);
      if (d.description) obj.description = normalizeString(d.description);
      if (d.title) obj.title = normalizeString(d.title);
      return obj;
    };

    const collections = ['al_streams', 'al_subjects', 'al_resource_types', 'al_sub_categories'];
    const setters = {
      al_streams: setAlStreams,
      al_subjects: setAlSubjects,
      al_resource_types: setAlResourceTypes,
      al_sub_categories: setAlSubCategories
    };
    const loadedCollections = new Set();

    const setupListener = (colName) => {
      return onSnapshot(query(collection(db, colName)), (snapshot) => {
        const data = snapshot.docs.map(processDoc);
        data.sort((a, b) => (a.order || 0) - (b.order || 0));
        setters[colName](data);
        loadedCollections.add(colName);
        if (loadedCollections.size === collections.length) {
          setLoading(false);
        }
      }, (err) => {
        console.error(`Error loading ${colName}:`, err);
        loadedCollections.add(colName); 
        if (loadedCollections.size === collections.length) setLoading(false);
      });
    };

    const unsubs = collections.map(setupListener);

    return () => unsubs.forEach(unsub => unsub());
  }, [isInitialized, db]);

  // On-demand fetch for resources to save reads
  const fetchALResources = async (force = false) => {
    if (!db || (alResources.length > 0 && !force)) return;
    try {
      const { getDocs } = await import('firebase/firestore');
      const snapshot = await getDocs(query(collection(db, 'al_resources')));
      const data = snapshot.docs.map(processDoc);
      data.sort((a, b) => (a.order || 0) - (b.order || 0));
      setAlResources(data);
    } catch (err) {
      console.error("Error fetching AL resources:", err);
    }
  };

  // Generic generic functions
  const addDocument = async (collectionName, data, customId = null) => {
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
      throw e;
    }
  };

  const updateDocument = async (collectionName, id, data) => {
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
      throw e;
    }
  };

  const deleteDocument = async (collectionName, id) => {
    if (!db) return false;
    try {
      await deleteDoc(doc(db, collectionName, id));
      return true;
    } catch (e) {
      console.error(`Error deleting from ${collectionName}:`, e);
      throw e;
    }
  };

  const value = React.useMemo(() => ({
    alStreams,
    alSubjects,
    alResourceTypes,
    alSubCategories,
    alResources,
    loading,
    fetchALResources,
    addDocument,
    updateDocument,
    deleteDocument,
    db // Expose db if needed
  }), [
    alStreams, alSubjects, alResourceTypes, alSubCategories, 
    alResources, loading, fetchALResources, addDocument, updateDocument, deleteDocument, db
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
