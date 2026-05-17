import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { useGrades } from './GradeContext';
import { useResources } from './ResourceContext';
import { useLanguage } from '../../../context/LanguageContext';
import { resourceTranslations } from '../../../utils/resourceTranslations';

const DataContext = createContext();

const DEFAULT_RESOURCE_STRUCTURE = {
  textbooks: {},
  papers: { terms: { term1: [], term2: [], term3: [] }, chapters: {} },
  notes: {},
  extras: {}
};

const coercePayload = (gradeOrPayload, subject, langs, extra) => {
  if (gradeOrPayload && typeof gradeOrPayload === 'object' && gradeOrPayload.grade) {
    return { ...gradeOrPayload };
  }
  return {
    ...(extra || {}),
    grade: gradeOrPayload,
    subject,
    languages: Array.isArray(langs) ? langs : langs ? [langs] : extra?.languages
  };
};

/** Built-in module metadata (no Firestore `resource_types` collection). */
const buildResourceTypesCatalog = () =>
  Object.entries(resourceTranslations).map(([id, name], index) => ({
    id,
    name,
    description: { english: '' },
    icon: 'bi-archive',
    color: 'text-primary',
    active: true,
    order: index
  }));

export const DataProvider = ({ children }) => {
  const gradeData = useGrades();
  const resourceData = useResources();
  const { selectedLanguage } = useLanguage();

  const resourceTypes = useMemo(() => buildResourceTypesCatalog(), []);

  const addTextbook = useCallback(
    async (...args) => {
      const payload = coercePayload(...args);
      return resourceData.addResource({
        ...payload,
        resourceType: 'textbook',
        languages: payload.languages || ['english']
      });
    },
    [resourceData]
  );

  const addPaper = useCallback(
    async (...args) => {
      const payload = coercePayload(...args);
      return resourceData.addResource({
        ...payload,
        resourceType: 'papers',
        languages: payload.languages || ['english']
      });
    },
    [resourceData]
  );

  const addVideo = useCallback(
    async (...args) => {
      const payload = coercePayload(...args);
      return resourceData.addResource({
        ...payload,
        resourceType: 'videos',
        languages: payload.languages || (payload.language ? [payload.language] : ['english'])
      });
    },
    [resourceData]
  );

  const addNote = useCallback(
    async (...args) => {
      const payload = coercePayload(...args);
      return resourceData.addResource({
        ...payload,
        resourceType: 'notes',
        languages: payload.languages || ['english']
      });
    },
    [resourceData]
  );

  const addResource = useCallback(
    async (type, payload) => {
      const data = typeof type === 'object' ? type : { ...payload, resourceType: type };
      const rt = data.resourceType;
      if (rt === 'textbook' || rt === 'textbooks') return addTextbook(data);
      if (rt === 'papers' || rt === 'paper') return addPaper(data);
      if (rt === 'videos' || rt === 'video') return addVideo(data);
      if (rt === 'notes' || rt === 'note') return addNote(data);
      return resourceData.addResource(data);
    },
    [addTextbook, addPaper, addVideo, addNote, resourceData]
  );

  const generateGradePageData = useCallback(
    (gradeId) => {
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
    },
    [gradeData, resourceData.resources, resourceData.videos]
  );

  const getStats = useCallback(
    () => ({
      totalGrades: Object.keys(gradeData.grades).length,
      totalSubjects: Object.keys(gradeData.subjects).length,
      totalResources: resourceData.allResources.length,
      totalLanguages: 3
    }),
    [gradeData.grades, gradeData.subjects, resourceData.allResources.length]
  );

  const exportData = useCallback(() => {
    const backup = {
      timestamp: new Date().toISOString(),
      grades: gradeData.grades,
      subjects: gradeData.subjects,
      settings: gradeData.settings,
      resourceTypes,
      resources: resourceData.allResources
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `teaching_torch_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [gradeData.grades, gradeData.subjects, gradeData.settings, resourceTypes, resourceData.allResources]);

  /** Module labels come from translations; grade visibility is edited via grade metadata. */
  const updateResourceType = useCallback(async (typeId, typeData) => {
    const gradeId = typeData?.gradeId;
    if (!gradeId) {
      throw new Error('Module settings for grades 6–11 are read-only. Edit grade visibility from the grade card in manage mode.');
    }
    const grade = gradeData.grades[gradeId];
    if (!grade) throw new Error('Grade not found');
    const visible = grade.visibleResourceTypes || ['textbooks', 'papers', 'notes', 'videos'];
    return gradeData.updateGrade(gradeId, {
      visibleResourceTypes: typeData.visibleResourceTypes || visible
    });
  }, [gradeData]);

  const value = useMemo(
    () => ({
      ...gradeData,
      ...resourceData,
      language: selectedLanguage,
      gradesLoading: gradeData.loading,
      subjectsLoading: gradeData.loading,
      resourceTypes,
      allResources: resourceData.allResources,
      addTextbook,
      addPaper,
      addVideo,
      addNote,
      addResource,
      generateGradePageData,
      getStats,
      exportData,
      updateSettings: gradeData.updateSettings,
      updateResourceType,
      fetchAllResources: resourceData.fetchAllResources
    }),
    [
      gradeData,
      resourceData,
      selectedLanguage,
      resourceTypes,
      addTextbook,
      addPaper,
      addVideo,
      addNote,
      addResource,
      generateGradePageData,
      getStats,
      exportData,
      updateResourceType
    ]
  );

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
