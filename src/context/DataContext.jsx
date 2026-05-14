import React, { createContext, useContext, useMemo } from 'react';
import { useGrades } from './GradeContext';
import { useResources } from './ResourceContext';
import { useLanguage } from './LanguageContext';

const DataContext = createContext();

const DEFAULT_RESOURCE_STRUCTURE = { 
  textbooks: {}, 
  papers: { terms: { term1: [], term2: [], term3: [] }, chapters: {} }, 
  notes: {} 
};

export const DataProvider = ({ children }) => {
  const gradeData = useGrades();
  const resourceData = useResources();
  const { selectedLanguage } = useLanguage();

  const addTextbook = React.useCallback((grade, subject, langs, data) =>
    resourceData.addResource({ ...data, grade, subject, resourceType: 'textbook', languages: Array.isArray(langs) ? langs : [langs] }),
    [resourceData]);

  const addPaper = React.useCallback((grade, subject, paperType, paperCategory, data, school, langs) =>
    resourceData.addResource({ ...data, grade, subject, resourceType: 'papers', paperType, paperCategory, school, languages: langs }),
    [resourceData]);

  const addVideo = React.useCallback((grade, subject, data) =>
    resourceData.addResource({ ...data, grade, subject, resourceType: 'videos', languages: [data.language || 'english'] }),
    [resourceData]);

  const addNote = React.useCallback((grade, subject, data, langs) =>
    resourceData.addResource({ ...data, grade, subject, resourceType: 'notes', languages: Array.isArray(langs) ? langs : [langs] }),
    [resourceData]);

  const generateGradePageData = React.useCallback((gradeId) => {
    const pageData = gradeData.generateGradePageData(gradeId);
    if (!pageData.grade) return pageData;

    const gradeResources = resourceData.resources[gradeId] || {};
    const gradeVideos = resourceData.videos[gradeId] || {};

    const subjectsWithResources = {};
    Object.entries(pageData.subjects).forEach(([subjectId, subject]) => {
      subjectsWithResources[subjectId] = {
        ...subject,
        resources: gradeResources[subjectId] || DEFAULT_RESOURCE_STRUCTURE,
        videos: gradeVideos[subjectId] || []
      };
    });

    return {
      ...pageData,
      subjects: subjectsWithResources
    };
  }, [gradeData, resourceData.resources, resourceData.videos]);

  const getStats = React.useCallback(() => ({
    totalGrades: Object.keys(gradeData.grades).length,
    totalSubjects: Object.keys(gradeData.subjects).length,
    totalResources: resourceData.allResources.length,
    totalLanguages: 3 // English, Sinhala, Tamil
  }), [gradeData.grades, gradeData.subjects, resourceData.allResources.length]);

  const value = useMemo(() => ({
    ...gradeData,
    ...resourceData,
    language: selectedLanguage,
    gradesLoading: gradeData.loading,
    allResources: resourceData.allResources,
    addTextbook,
    addPaper,
    addVideo,
    addNote,
    generateGradePageData,
    getStats
  }), [gradeData, resourceData, selectedLanguage, addTextbook, addPaper, addVideo, addNote, generateGradePageData, getStats]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export default DataContext;