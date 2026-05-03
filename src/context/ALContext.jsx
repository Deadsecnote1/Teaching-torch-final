import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
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

  useEffect(() => {
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

    const collections = ['al_streams', 'al_subjects', 'al_resource_types', 'al_sub_categories', 'al_resources'];
    const setters = {
      al_streams: setAlStreams,
      al_subjects: setAlSubjects,
      al_resource_types: setAlResourceTypes,
      al_sub_categories: setAlSubCategories,
      al_resources: setAlResources
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
        loadedCollections.add(colName); // Still count as attempt
        if (loadedCollections.size === collections.length) setLoading(false);
      });
    };

    const unsubs = collections.map(setupListener);

    return () => unsubs.forEach(unsub => unsub());
  }, []);

  // Generic generic functions
  const addDocument = async (collectionName, data, customId = null) => {
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
    try {
      const { id: _, ...rest } = data;
      // Remove any undefined values that Firestore doesn't support
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
    try {
      await deleteDoc(doc(db, collectionName, id));
      return true;
    } catch (e) {
      console.error(`Error deleting from ${collectionName}:`, e);
      throw e;
    }
  };

  const value = {
    alStreams,
    alSubjects,
    alResourceTypes,
    alSubCategories,
    alResources,
    loading,
    addDocument,
    updateDocument,
    deleteDocument
  };

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
