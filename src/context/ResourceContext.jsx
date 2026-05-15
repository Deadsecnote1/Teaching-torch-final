import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
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

// Pure helper to ensure default structure
const getDefaultStructure = () => ({
  textbooks: {},
  papers: { terms: { term1: [], term2: [], term3: [] }, chapters: {} },
  notes: {}
});

// Optimized resource processor
const processResources = (docs) => {
  const structuredResources = {};
  const structuredVideos = {};
  const allResources = []; 

  docs.forEach(doc => {
    const data = { id: doc.id, ...doc.data() };
    allResources.push(data);

    const { grade, subject, resourceType, languages } = data;
    data.language = languages?.[0] || 'english';

    if (resourceType === 'videos') {
      if (!structuredVideos[grade]) structuredVideos[grade] = {};
      if (!structuredVideos[grade][subject]) structuredVideos[grade][subject] = [];
      structuredVideos[grade][subject].push(data);
      return;
    }

    if (!structuredResources[grade]) structuredResources[grade] = {};
    if (!structuredResources[grade][subject]) structuredResources[grade][subject] = getDefaultStructure();
    
    const target = structuredResources[grade][subject];

    switch (resourceType) {
      case 'textbook':
        const langs = languages?.length > 0 ? languages : ['english'];
        langs.forEach(lang => {
          if (!target.textbooks[lang]) target.textbooks[lang] = [];
          target.textbooks[lang].push(data);
        });
        break;
      case 'papers':
        const { paperType, paperCategory } = data;
        if (paperType === 'term') {
          if (!target.papers.terms[paperCategory]) target.papers.terms[paperCategory] = [];
          target.papers.terms[paperCategory].push(data);
        } else {
          if (!target.papers.chapters[paperCategory]) target.papers.chapters[paperCategory] = [];
          target.papers.chapters[paperCategory].push(data);
        }
        break;
      case 'notes':
        target.notes[data.id] = data;
        break;
      default:
        break;
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
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gradeLoading, setGradeLoading] = useState({});

  const { db } = useAuth();

  useEffect(() => {
    return () => {
      Object.values(listenersRef.current).forEach(unsub => {
        if (typeof unsub === 'function') unsub();
      });
    };
  }, []);

  const fetchResourcesForGrade = useCallback(async (gradeId) => {
    if (!db || !gradeId || fetchedGrades[gradeId]) return;
    
    setGradeLoading(prev => ({ ...prev, [gradeId]: true }));
    setError(null);

    try {
      // Proper, scalable query
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
    } catch (err) {
      console.error("Error fetching grade resources:", err);
      setError(err.message);
    } finally {
      setGradeLoading(prev => ({ ...prev, [gradeId]: false }));
    }
  }, [db, fetchedGrades]);

  const fetchResourcesPaginated = useCallback(async (isFirstPage = false, pageSize = 20) => {
    if (!db) return;
    setLoading(true);
    setError(null);

    try {
      let q;
      if (isFirstPage) {
        q = query(collection(db, "resources"), orderBy("uploadDate", "desc"), limit(pageSize));
      } else if (lastVisible) {
        q = query(collection(db, "resources"), orderBy("uploadDate", "desc"), startAfter(lastVisible), limit(pageSize));
      } else {
        return;
      }

      const snapshot = await getDocs(q);
      const last = snapshot.docs[snapshot.docs.length - 1];
      const hasNext = snapshot.docs.length === pageSize;
      const { allResources: fresh } = processResources(snapshot.docs);

      setAllResources(prev => isFirstPage ? fresh : [...prev, ...fresh]);
      setLastVisible(last);
      setHasMore(hasNext);
    } catch (err) {
      console.error("Pagination error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [db, lastVisible]);

  const addResource = useCallback(async (data) => {
    if (!db) return;
    return addDoc(collection(db, "resources"), { ...data, uploadDate: new Date().toISOString() });
  }, [db]);

  const updateResource = useCallback(async (id, data) => {
    if (!db) return;
    return updateDoc(doc(db, "resources", id), data);
  }, [db]);

  const deleteResource = useCallback(async (id) => {
    if (!db) return;
    return deleteDoc(doc(db, "resources", id));
  }, [db]);

  const value = useMemo(() => ({
    resources, videos, allResources, lastVisible, hasMore,
    loading, error, gradeLoading,
    fetchResourcesForGrade, fetchResourcesPaginated,
    addResource, updateResource, deleteResource
  }), [
    resources, videos, allResources, lastVisible, hasMore,
    loading, error, gradeLoading,
    fetchResourcesForGrade, fetchResourcesPaginated,
    addResource, updateResource, deleteResource
  ]);

  return <ResourceContext.Provider value={value}>{children}</ResourceContext.Provider>;
};

export const useResources = () => useContext(ResourceContext);
export default ResourceContext;
