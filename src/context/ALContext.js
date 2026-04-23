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
    let unsubStreams, unsubSubjects, unsubResourceTypes, unsubSubCats, unsubResources;

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

    try {
      unsubStreams = onSnapshot(query(collection(db, "al_streams")), (snapshot) => {
        const data = snapshot.docs.map(processDoc).sort((a, b) => (a.order || 0) - (b.order || 0));
        setAlStreams(data);
      });

      unsubSubjects = onSnapshot(query(collection(db, "al_subjects")), (snapshot) => {
        const data = snapshot.docs.map(processDoc).sort((a, b) => (a.order || 0) - (b.order || 0));
        setAlSubjects(data);
      });

      unsubResourceTypes = onSnapshot(query(collection(db, "al_resource_types")), (snapshot) => {
        const data = snapshot.docs.map(processDoc).sort((a, b) => (a.order || 0) - (b.order || 0));
        setAlResourceTypes(data);
      });

      unsubSubCats = onSnapshot(query(collection(db, "al_sub_categories")), (snapshot) => {
        const data = snapshot.docs.map(processDoc).sort((a, b) => (a.order || 0) - (b.order || 0));
        setAlSubCategories(data);
      });

      unsubResources = onSnapshot(query(collection(db, "al_resources")), (snapshot) => {
        const data = snapshot.docs.map(processDoc);
        setAlResources(data);
        setLoading(false); // Consider loaded when resources are loaded
      });

    } catch (e) {
      console.error("AL Context Setup Error", e);
      setLoading(false);
    }

    return () => {
      if(unsubStreams) unsubStreams();
      if(unsubSubjects) unsubSubjects();
      if(unsubResourceTypes) unsubResourceTypes();
      if(unsubSubCats) unsubSubCats();
      if(unsubResources) unsubResources();
    };
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
