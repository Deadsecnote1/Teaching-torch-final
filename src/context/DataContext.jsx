import React, { createContext, useContext, useMemo } from 'react';
import { useGrades } from './GradeContext';
import { useResources } from './ResourceContext';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const gradeData = useGrades();
  const resourceData = useResources();

  // Combine both contexts to maintain backward compatibility
  const value = useMemo(() => ({
    ...gradeData,
    ...resourceData,
    // Add any missing specific legacy mappings here
    gradesLoading: gradeData.loading,
    allResources: resourceData.allResources,
    addTextbook: (grade, subject, langs, data) => 
      resourceData.addResource({ ...data, grade, subject, resourceType: 'textbook', languages: Array.isArray(langs) ? langs : [langs] }),
    addPaper: (grade, subject, paperType, paperCategory, data, school, langs) => 
      resourceData.addResource({ ...data, grade, subject, resourceType: 'papers', paperType, paperCategory, school, languages: langs }),
    addVideo: (grade, subject, data) => 
      resourceData.addResource({ ...data, grade, subject, resourceType: 'videos', languages: [data.language || 'english'] }),
    addNote: (grade, subject, data, langs) => 
      resourceData.addResource({ ...data, grade, subject, resourceType: 'notes', languages: Array.isArray(langs) ? langs : [langs] }),
    
    // Legacy helper functions
    getStats: () => ({
      totalGrades: Object.keys(gradeData.grades).length,
      totalSubjects: Object.keys(gradeData.subjects).length,
      totalResources: resourceData.allResources.length,
    })
  }), [gradeData, resourceData]);

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