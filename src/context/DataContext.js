import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
  setDoc,
  updateDoc
} from 'firebase/firestore';

// Create Data Context
const DataContext = createContext();

// Initial State
const initialState = {
  grades: {},
  subjects: {},
  resources: {},
  videos: {},
  allResources: [], // New state property
  settings: {},
  loading: true, // Start loading as true
  gradesLoading: true,
  subjectsLoading: true,
  error: null
};

// Helper to structure resources like the old state for UI compatibility
const processResources = (docs) => {
  const structuredResources = {};
  const structuredVideos = {};
  const allResources = []; // Flat list for Admin Dashboard

  docs.forEach(doc => {
    const data = { id: doc.id, ...doc.data() };
    allResources.push(data);

    const { grade, subject, resourceType } = data;
    data.language = data.languages ? data.languages[0] : 'english';

    // Initialize grade/subject nesting
    if (!structuredResources[grade]) structuredResources[grade] = {};
    if (!structuredResources[grade][subject]) {
      structuredResources[grade][subject] = {
        textbooks: {},
        papers: { terms: { term1: [], term2: [], term3: [] }, chapters: {} },
        notes: {}
      };
    }

    if (!structuredVideos[grade]) structuredVideos[grade] = {};
    if (!structuredVideos[grade][subject]) structuredVideos[grade][subject] = [];

    // Categorize
    if (resourceType === 'textbook') {
      // Use language as key for textbooks (legacy structure)
      // If multiple textbooks of same language, this legacy structure might be limiting,
      // but matching previous behavior: "textbooks: { [medium]: fileData }"
      // We'll map it to an array if possible or keep as object. 
      // Previous reducer: textbooks: { ...textbooks, [medium]: fileData }
      // The UI expects an object keyed by language OR an array? 
      // TextbooksPage.js: computed uploadedSubjectTextbooks.sinhala which seems to be an ARRAY there.
      // Wait, TextbooksPage.js lines 47-58 groups them.
      // Let's check the previous reducer ADD_TEXTBOOK case.
      // It stored: textbooks: { [medium]: { ...fileData } }
      // This implied ONE textbook per medium per subject/grade. 
      // But TextbooksPage seems to handle arrays.
      // Let's store them in the state as arrays if we can, but let's stick to valid structure.
      // Actually, TextbooksPage processes `uploadedFiles` which it fetches from localStorage itself (lines 24-30).
      // So DataContext structure for 'resources' is mainly used by `getResources` utility.

      const target = structuredResources[grade][subject].textbooks;
      const lang = data.languages ? data.languages[0] : 'english';

      if (!target[lang]) {
        target[lang] = [];
      }
      target[lang].push(data);
    } else if (resourceType === 'papers') {
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
      structuredVideos[grade][subject].push(data);
    } else if (resourceType === 'notes') {
      const target = structuredResources[grade][subject].notes;
      target[data.id] = data;
    }
  });

  return { structuredResources, structuredVideos, allResources };
};

// Data Reducer
const dataReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'INITIALIZE_DATA':
      return {
        ...state,
        ...action.payload,
        loading: false,
        gradesLoading: false,
        subjectsLoading: false
      };

    case 'UPDATE_RESOURCES':
      return {
        ...state,
        resources: action.payload.resources,
        videos: action.payload.videos,
        allResources: action.payload.allResources
      };

    case 'UPDATE_GRADES':
      return {
        ...state,
        grades: action.payload,
        gradesLoading: false
      };

    case 'UPDATE_SUBJECTS':
      return {
        ...state,
        subjects: action.payload,
        subjectsLoading: false
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };

    default:
      return state;
  }
};

// Data Provider Component
export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // Get default data structure (stable function)
  const getDefaultData = useCallback(() => ({
    grades: {},
    subjects: {},
    resources: {},
    videos: {},
    allResources: [],
    settings: {
      siteName: 'Teaching Torch',
      lastUpdated: new Date().toISOString(),
    }
  }), []);

  // Initialize data and listener
  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: true });

    // Set static data first
    const defaultData = getDefaultData();
    dispatch({ type: 'INITIALIZE_DATA', payload: defaultData });

    // Listen to Grades Collection
    const qGrades = query(collection(db, "grades"));
    const unsubGrades = onSnapshot(qGrades, (snapshot) => {
      const liveGrades = {};
      snapshot.forEach(doc => {
        liveGrades[doc.id] = { id: doc.id, ...doc.data() };
      });
      dispatch({ type: 'UPDATE_GRADES', payload: liveGrades });
    }, (error) => {
      console.error("Grades Firestore Error:", error);
      dispatch({ type: 'UPDATE_GRADES', payload: defaultData.grades });
    });

    // Listen to Subjects Collection
    const qSubjects = query(collection(db, "subjects"));
    const unsubSubjects = onSnapshot(qSubjects, (snapshot) => {
      const liveSubjects = {};
      snapshot.forEach(doc => {
        liveSubjects[doc.id] = { id: doc.id, ...doc.data() };
      });
      dispatch({ type: 'UPDATE_SUBJECTS', payload: liveSubjects });
    }, (error) => {
      console.error("Subjects Firestore Error:", error);
      dispatch({ type: 'UPDATE_SUBJECTS', payload: defaultData.subjects });
    });

    // Listen to Resources Collection
    const q = query(collection(db, "resources"), orderBy("uploadDate", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Need to use the latest subjects state which is tricky in a closure.
      const { structuredResources, structuredVideos, allResources } = processResources(snapshot.docs);
      dispatch({
        type: 'UPDATE_RESOURCES',
        payload: {
          resources: structuredResources,
          videos: structuredVideos,
          allResources
        }
      });
    }, (error) => {
      console.error("Firestore Error:", error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    });

    // Listen to Settings
    const unsubSettings = onSnapshot(doc(db, "settings", "general"), (docSnap) => {
      if (docSnap.exists()) {
        dispatch({ type: 'UPDATE_SETTINGS', payload: docSnap.data() });
      } else {
        // Init empty settings if it doesn't exist
        setDoc(doc(db, "settings", "general"), {
          whatsapp: '',
          email: '',
          phone: '',
          facebook: ''
        });
      }
    }, (error) => {
      console.error("Settings Firestore Error:", error);
    });

    return () => {
      unsubscribe();
      unsubGrades();
      unsubSubjects();
      unsubSettings();
    };
  }, [getDefaultData]);

  // Action creators (Modified to write to Firestore)
  const updateSettings = useCallback(async (newSettings) => {
    try {
      await setDoc(doc(db, "settings", "general"), newSettings, { merge: true });
      return true;
    } catch (e) {
      console.error("Error updating settings: ", e);
      throw e;
    }
  }, []);

  const addTextbook = useCallback(async (gradeId, subjectId, medium, fileData) => {
    try {
      await addDoc(collection(db, "resources"), {
        ...fileData,
        grade: gradeId,
        subject: subjectId,
        resourceType: 'textbook',
        languages: [medium],
        uploadDate: new Date().toISOString()
      });
      return true;
    } catch (e) {
      console.error("Error adding textbook: ", e);
      throw e;
    }
  }, []);

  const addPaper = useCallback(async (gradeId, subjectId, paperType, paperCategory, fileData, schoolName = '', language = 'english') => {
    try {
      await addDoc(collection(db, "resources"), {
        ...fileData,
        grade: gradeId,
        subject: subjectId,
        resourceType: 'papers',
        paperType,
        paperCategory,
        school: schoolName,
        languages: [language],
        uploadDate: new Date().toISOString()
      });
      return true;
    } catch (e) {
      console.error("Error adding paper: ", e);
      throw e;
    }
  }, []);

  const addVideo = useCallback(async (gradeId, subjectId, videoData) => {
    try {
      await addDoc(collection(db, "resources"), {
        ...videoData,
        grade: gradeId,
        subject: subjectId,
        resourceType: 'videos',
        languages: [videoData.language || 'english'],
        uploadDate: new Date().toISOString()
      });
      return true;
    } catch (e) {
      console.error("Error adding video: ", e);
      throw e;
    }
  }, []);

  const addNote = useCallback(async (gradeId, subjectId, noteData, language = 'english') => {
    try {
      await addDoc(collection(db, "resources"), {
        ...noteData,
        grade: gradeId,
        subject: subjectId,
        resourceType: 'notes',
        languages: [language],
        uploadDate: new Date().toISOString()
      });
      return true;
    } catch (e) {
      console.error("Error adding note: ", e);
      throw e;
    }
  }, []);

  const deleteResource = useCallback(async (id) => {
    try {
      await deleteDoc(doc(db, "resources", id));
      return true;
    } catch (e) {
      console.error("Error deleting resource: ", e);
      throw e;
    }
  }, []);

  const addGrade = useCallback(async (gradeId, gradeData) => {
    try {
      const docRef = doc(db, "grades", gradeId);
      await setDoc(docRef, { ...gradeData, id: gradeId, active: true });
      return true;
    } catch (e) {
      console.error("Error adding grade", e);
      throw e;
    }
  }, []);

  const addSubject = useCallback(async (subjectId, subjectData) => {
    try {
      await setDoc(doc(db, "subjects", subjectId), { ...subjectData, id: subjectId });
      return true;
    } catch (e) {
      console.error("Error adding subject", e);
      throw e;
    }
  }, []);

  const deleteGrade = useCallback(async (gradeId) => {
    try {
      await deleteDoc(doc(db, "grades", gradeId));
      return true;
    } catch (e) {
      console.error("Error deleting grade", e);
      throw e;
    }
  }, []);

  const deleteSubject = useCallback(async (subjectId) => {
    try {
      await deleteDoc(doc(db, "subjects", subjectId));
      return true;
    } catch (e) {
      console.error("Error deleting subject", e);
      throw e;
    }
  }, []);

  // Utility functions (Unchanged mostly, just reading from state)
  const getSubjectsForGrade = useCallback((gradeId) => {
    const subjects = {};
    Object.keys(state.subjects).forEach(subjectId => {
      const subject = state.subjects[subjectId];
      if (subject.grades.includes(gradeId)) {
        subjects[subjectId] = subject;
      }
    });
    return subjects;
  }, [state.subjects]);

  const getResources = useCallback((gradeId, subjectId) => {
    return state.resources[gradeId]?.[subjectId] || {
      textbooks: {},
      papers: {
        terms: { term1: [], term2: [], term3: [] },
        chapters: {}
      },
      notes: {}
    };
  }, [state.resources]);

  const getVideos = useCallback((gradeId, subjectId) => {
    return state.videos[gradeId]?.[subjectId] || [];
  }, [state.videos]);

  const getStats = useCallback(() => {
    // Recalculate stats based on Firestore data format would be better
    // But for now, returning basic counts based on state
    // This part might need better logic if state structure is different
    return {
      totalGrades: Object.keys(state.grades).length,
      totalSubjects: Object.keys(state.subjects).length,
      // approximate
      totalResources: 0,
      totalVideos: 0,
      languageBreakdown: { sinhala: 0, tamil: 0, english: 0 }
    };
  }, [state.grades, state.subjects]);

  const generateGradePageData = useCallback((gradeId) => {
    const grade = state.grades[gradeId];
    const subjects = getSubjectsForGrade(gradeId);
    const pageData = {
      grade: grade,
      subjects: {}
    };

    Object.keys(subjects).forEach(subjectId => {
      const subject = subjects[subjectId];
      const resources = getResources(gradeId, subjectId);
      const videos = getVideos(gradeId, subjectId);

      pageData.subjects[subjectId] = {
        ...subject,
        resources,
        videos
      };
    });

    return pageData;
  }, [state.grades, getSubjectsForGrade, getResources, getVideos]);

  // Context value
  const value = {
    ...state,
    addTextbook,
    addPaper,
    addVideo,
    addNote,
    deleteResource,
    deleteGrade,
    deleteSubject,
    addGrade,
    addSubject,
    updateSubject,
    getSubjectsForGrade,
    getResources,
    getVideos,
    getStats,
    generateGradePageData,
    updateSettings,
    dispatch
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export default DataContext;