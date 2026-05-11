import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  onSnapshot
} from 'firebase/firestore';

const ResourceContext = createContext();

// Helper to structure resources like the old state for UI compatibility
const processResources = (docs) => {
  const structuredResources = {};
  const structuredVideos = {};
  const allResources = []; 

  docs.forEach(doc => {
    const data = { id: doc.id, ...doc.data() };
    allResources.push(data);

    const { grade, subject, resourceType, languages } = data;
    data.language = languages ? languages[0] : 'english';

    if (resourceType === 'textbook') {
      if (!structuredResources[grade]) structuredResources[grade] = {};
      if (!structuredResources[grade][subject]) {
        structuredResources[grade][subject] = { textbooks: {}, papers: { terms: { term1: [], term2: [], term3: [] }, chapters: {} }, notes: {} };
      }
      const target = structuredResources[grade][subject].textbooks;
      const langs = languages?.length > 0 ? languages : ['english'];
      langs.forEach(lang => {
        if (!target[lang]) target[lang] = [];
        target[lang].push(data);
      });
    } else if (resourceType === 'papers') {
      if (!structuredResources[grade]) structuredResources[grade] = {};
      if (!structuredResources[grade][subject]) {
        structuredResources[grade][subject] = { textbooks: {}, papers: { terms: { term1: [], term2: [], term3: [] }, chapters: {} }, notes: {} };
      }
      const { paperType, paperCategory } = data;
      const target = structuredResources[grade][subject].papers;
      if (paperType === 'term') {
        if (!target.terms[paperCategory]) target.terms[paperCategory] = [];
        target.terms[paperCategory].push(data);
      } else {
        if (!target.chapters[paperCategory]) target.chapters[paperCategory] = [];
        target.chapters[paperCategory].push(data);
      }
    } else if (resourceType === 'videos') {
      if (!structuredVideos[grade]) structuredVideos[grade] = {};
      if (!structuredVideos[grade][subject]) structuredVideos[grade][subject] = [];
      structuredVideos[grade][subject].push(data);
    } else if (resourceType === 'notes') {
      if (!structuredResources[grade]) structuredResources[grade] = {};
      if (!structuredResources[grade][subject]) {
        structuredResources[grade][subject] = { textbooks: {}, papers: { terms: { term1: [], term2: [], term3: [] }, chapters: {} }, notes: {} };
      }
      structuredResources[grade][subject].notes[data.id] = data;
    }
  });

  return { structuredResources, structuredVideos, allResources };
};

export const ResourceProvider = ({ children }) => {
  const listenersRef = React.useRef({});
  const [resources, setResources] = useState({});
  const [videos, setVideos] = useState({});
  const [allResources, setAllResources] = useState([]);
  const [fetchedGrades, setFetchedGrades] = useState({});
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const { db } = useAuth();

  useEffect(() => {
    // Global listener removed to save costs. 
    // We now use targeted listeners per grade.
    return () => {
      // Cleanup all grade listeners on unmount
      Object.values(listenersRef.current).forEach(unsub => {
        if (typeof unsub === 'function') unsub();
      });
    };
  }, []);

  const fetchResourcesForGrade = useCallback(async (gradeId) => {
    if (!db || !gradeId || fetchedGrades[gradeId]) return;
    
    try {
      const { getDocs, query, collection, where, orderBy, limit } = await import('firebase/firestore');
      const q = query(
        collection(db, "resources"), 
        where("grade", "==", gradeId),
        orderBy("uploadDate", "desc"),
        limit(200)
      );
      
      const snapshot = await getDocs(q);
      const { structuredResources, structuredVideos, allResources: fresh } = processResources(snapshot.docs);
      
      setResources(prev => ({ ...prev, ...structuredResources }));
      setVideos(prev => ({ ...prev, ...structuredVideos }));
      setAllResources(prev => {
        const others = prev.filter(r => r.grade !== gradeId);
        return [...others, ...fresh];
      });
      
      setFetchedGrades(prev => ({ ...prev, [gradeId]: true }));
    } catch (error) {
      console.error("Error fetching grade resources:", error);
    }
  }, [db, fetchedGrades]);

  const fetchResourcesPaginated = useCallback(async (isFirstPage = false, pageSize = 20) => {
    if (!db) return;
    try {
      let q = isFirstPage 
        ? query(collection(db, "resources"), orderBy("uploadDate", "desc"), limit(pageSize))
        : (lastVisible ? query(collection(db, "resources"), orderBy("uploadDate", "desc"), startAfter(lastVisible), limit(pageSize)) : null);

      if (!q) return;

      const snapshot = await getDocs(q);
      const last = snapshot.docs[snapshot.docs.length - 1];
      const hasNext = snapshot.docs.length === pageSize;
      const { allResources: fresh } = processResources(snapshot.docs);

      setAllResources(prev => isFirstPage ? fresh : [...prev, ...fresh]);
      setLastVisible(last);
      setHasMore(hasNext);
    } catch (error) {
      console.error("Pagination error:", error);
    }
  }, [db, lastVisible]);

  const addResource = async (data) => {
    if (!db) return;
    return addDoc(collection(db, "resources"), { ...data, uploadDate: new Date().toISOString() });
  };

  const updateResource = async (id, data) => {
    if (!db) return;
    return updateDoc(doc(db, "resources", id), data);
  };

  const deleteResource = async (id) => {
    if (!db) return;
    return deleteDoc(doc(db, "resources", id));
  };

  const value = {
    resources, videos, allResources, lastVisible, hasMore,
    fetchResourcesForGrade, fetchResourcesPaginated,
    addResource, updateResource, deleteResource
  };

  return <ResourceContext.Provider value={value}>{children}</ResourceContext.Provider>;
};

export const useResources = () => useContext(ResourceContext);
export default ResourceContext;
