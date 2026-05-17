import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef } from 'react';
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
  updateDoc
} from 'firebase/firestore';

const ResourceContext = createContext();

const getDefaultStructure = () => ({
  textbooks: {},
  papers: { terms: { term1: [], term2: [], term3: [] }, chapters: {} },
  notes: {},
  extras: {}
});

const sanitizeId = (val) => {
  if (val && typeof val === 'object' && val.id) return val.id;
  return typeof val === 'string' ? val : '';
};

/** Normalize Firestore resourceType values (DB uses singular `textbook`). */
export const normalizeResourceType = (resourceType) => {
  if (!resourceType || typeof resourceType !== 'string') return '';
  const t = resourceType.toLowerCase();
  if (t === 'textbook' || t === 'textbooks') return 'textbooks';
  if (t === 'paper' || t === 'papers') return 'papers';
  if (t === 'note' || t === 'notes') return 'notes';
  if (t === 'video' || t === 'videos') return 'videos';
  return resourceType;
};

const processResources = (docs) => {
  const structuredResources = {};
  const structuredVideos = {};
  const allResources = [];

  docs.forEach((docSnap) => {
    const data = { id: docSnap.id, ...docSnap.data() };
    data.grade = sanitizeId(data.grade);
    data.subject = sanitizeId(data.subject);

    const rawType = data.resourceType || '';
    const bucket = normalizeResourceType(rawType);
    data.resourceType = bucket || rawType;

    const langs = data.languages?.length
      ? data.languages
      : data.language
        ? [data.language]
        : ['english'];
    data.languages = langs;
    data.language = langs[0];

    allResources.push(data);

    const { grade, subject } = data;
    if (!grade || !subject) return;

    if (bucket === 'videos') {
      if (!structuredVideos[grade]) structuredVideos[grade] = {};
      if (!structuredVideos[grade][subject]) structuredVideos[grade][subject] = [];
      structuredVideos[grade][subject].push(data);
      return;
    }

    if (!structuredResources[grade]) structuredResources[grade] = {};
    if (!structuredResources[grade][subject]) {
      structuredResources[grade][subject] = getDefaultStructure();
    }
    const target = structuredResources[grade][subject];

    switch (bucket) {
      case 'textbooks':
        langs.forEach((lang) => {
          if (!target.textbooks[lang]) target.textbooks[lang] = [];
          target.textbooks[lang].push({
            ...data,
            title: data.title || data.name
          });
        });
        break;
      case 'papers': {
        const { paperType, paperCategory } = data;
        if (paperType === 'term') {
          if (!target.papers.terms[paperCategory]) target.papers.terms[paperCategory] = [];
          target.papers.terms[paperCategory].push(data);
        } else {
          if (!target.papers.chapters[paperCategory]) target.papers.chapters[paperCategory] = [];
          target.papers.chapters[paperCategory].push(data);
        }
        break;
      }
      case 'notes':
        target.notes[data.id] = data;
        break;
      default:
        if (!target.extras) target.extras = {};
        const extraKey = rawType || bucket;
        if (!target.extras[extraKey]) target.extras[extraKey] = [];
        target.extras[extraKey].push(data);
        break;
    }
  });

  return { structuredResources, structuredVideos, allResources };
};

const sortDocsByUploadDate = (docs) =>
  [...docs].sort((a, b) => {
    const orderA = a.data().order !== undefined ? a.data().order : 999;
    const orderB = b.data().order !== undefined ? b.data().order : 999;
    if (orderA !== orderB) return orderA - orderB;
    const dateA = a.data().uploadDate || '';
    const dateB = b.data().uploadDate || '';
    return dateB.localeCompare(dateA);
  });

export const ResourceProvider = ({ children }) => {
  const fetchingGradesRef = useRef({});
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

  const mergeGradeFetch = useCallback((gradeId, structuredResources, structuredVideos, fresh) => {
    setResources((prev) => ({ ...prev, ...structuredResources }));
    setVideos((prev) => ({ ...prev, ...structuredVideos }));
    setAllResources((prev) => {
      const others = prev.filter((r) => r.grade !== gradeId);
      const seen = new Set(others.map((r) => r.id));
      const merged = [...others];
      fresh.forEach((r) => {
        if (!seen.has(r.id)) {
          seen.add(r.id);
          merged.push(r);
        }
      });
      return merged;
    });
    setFetchedGrades((prev) => ({ ...prev, [gradeId]: true }));
  }, []);

  const fetchResourcesForGrade = useCallback(
    async (gradeId, force = false) => {
      if (!db || !gradeId) return;
      if (!force && (fetchedGrades[gradeId] || fetchingGradesRef.current[gradeId])) return;

      if (force) {
        setFetchedGrades((prev) => {
          const next = { ...prev };
          delete next[gradeId];
          return next;
        });
      }

      fetchingGradesRef.current[gradeId] = true;
      setGradeLoading((prev) => ({ ...prev, [gradeId]: true }));
      setError(null);

      try {
        let docs;
        try {
          const q = query(
            collection(db, 'resources'),
            where('grade', '==', gradeId),
            orderBy('uploadDate', 'desc'),
            limit(200)
          );
          const snapshot = await getDocs(q);
          docs = snapshot.docs;
        } catch (indexErr) {
          console.warn('Grade resource query falling back without orderBy:', indexErr.message);
          const q = query(collection(db, 'resources'), where('grade', '==', gradeId), limit(200));
          const snapshot = await getDocs(q);
          docs = sortDocsByUploadDate(snapshot.docs);
        }

        const { structuredResources, structuredVideos, allResources: fresh } = processResources(docs);
        mergeGradeFetch(gradeId, structuredResources, structuredVideos, fresh);
      } catch (err) {
        console.error('Error fetching grade resources:', err);
        setError(err.message);
      } finally {
        fetchingGradesRef.current[gradeId] = false;
        setGradeLoading((prev) => ({ ...prev, [gradeId]: false }));
      }
    },
    [db, fetchedGrades, mergeGradeFetch]
  );

  const fetchResourcesPaginated = useCallback(
    async (isFirstPage = false, pageSize = 20) => {
      if (!db) return;
      setLoading(true);
      setError(null);

      try {
        let q;
        if (isFirstPage) {
          q = query(collection(db, 'resources'), orderBy('uploadDate', 'desc'), limit(pageSize));
        } else if (lastVisible) {
          q = query(
            collection(db, 'resources'),
            orderBy('uploadDate', 'desc'),
            startAfter(lastVisible),
            limit(pageSize)
          );
        } else {
          return;
        }

        const snapshot = await getDocs(q);
        const last = snapshot.docs[snapshot.docs.length - 1];
        const hasNext = snapshot.docs.length === pageSize;
        const { allResources: fresh } = processResources(snapshot.docs);

        setAllResources((prev) => {
          if (isFirstPage) return fresh;
          const seen = new Set(prev.map((r) => r.id));
          const merged = [...prev];
          fresh.forEach((r) => {
            if (!seen.has(r.id)) merged.push(r);
          });
          return merged;
        });
        setLastVisible(last);
        setHasMore(hasNext);
      } catch (err) {
        console.error('Pagination error:', err);
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [db, lastVisible]
  );

  const fetchAllResources = useCallback(
    async (force = false) => {
      if (!force && allResources.length > 0) return;
      await fetchResourcesPaginated(true, 100);
    },
    [allResources.length, fetchResourcesPaginated]
  );

  const addResource = useCallback(
    async (data) => {
      if (!db) return;
      const grade = sanitizeId(data.grade);
      const subject = sanitizeId(data.subject);
      const payload = {
        ...data,
        grade,
        subject,
        resourceType: data.resourceType === 'textbooks' ? 'textbook' : data.resourceType,
        uploadDate: data.uploadDate || new Date().toISOString()
      };
      const ref = await addDoc(collection(db, 'resources'), payload);
      if (grade) {
        fetchingGradesRef.current[grade] = false;
        await fetchResourcesForGrade(grade, true);
      }
      return ref;
    },
    [db, fetchResourcesForGrade]
  );

  const updateResource = useCallback(
    async (id, data) => {
      if (!db) return;
      const existing = allResources.find((r) => r.id === id);
      const clean = { ...data };
      if (clean.grade) clean.grade = sanitizeId(clean.grade);
      if (clean.subject) clean.subject = sanitizeId(clean.subject);
      if (clean.resourceType === 'textbooks') clean.resourceType = 'textbook';
      await updateDoc(doc(db, 'resources', id), clean);
      const gradeId = clean.grade || existing?.grade;
      if (gradeId) {
        fetchingGradesRef.current[gradeId] = false;
        await fetchResourcesForGrade(gradeId, true);
      }
    },
    [db, fetchResourcesForGrade, allResources]
  );

  const deleteResource = useCallback(
    async (id) => {
      if (!db) return;
      const existing = allResources.find((r) => r.id === id);
      await deleteDoc(doc(db, 'resources', id));
      setAllResources((prev) => prev.filter((r) => r.id !== id));
      if (existing?.grade) {
        fetchingGradesRef.current[existing.grade] = false;
        await fetchResourcesForGrade(existing.grade, true);
      }
    },
    [db, allResources, fetchResourcesForGrade]
  );

  const value = useMemo(
    () => ({
      resources,
      videos,
      allResources,
      lastVisible,
      hasMore,
      loading,
      error,
      gradeLoading,
      fetchResourcesForGrade,
      fetchResourcesPaginated,
      fetchAllResources,
      addResource,
      updateResource,
      deleteResource
    }),
    [
      resources,
      videos,
      allResources,
      lastVisible,
      hasMore,
      loading,
      error,
      gradeLoading,
      fetchResourcesForGrade,
      fetchResourcesPaginated,
      fetchAllResources,
      addResource,
      updateResource,
      deleteResource
    ]
  );

  return <ResourceContext.Provider value={value}>{children}</ResourceContext.Provider>;
};

export const useResources = () => useContext(ResourceContext);
export default ResourceContext;
