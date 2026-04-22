import { useMemo, useEffect } from 'react';
import { useData } from '../context/DataContext';

/**
 * A shared hook to handle the repetitive "Grade Page Bootstrap" logic.
 * Handles fetching resources, generating page data, and detecting missing grades.
 */
export const useGradePage = (gradeId) => {
  const { 
    generateGradePageData, 
    fetchResourcesForGrade, 
    loading: dataLoading,
    gradesLoading,
    subjectsLoading
  } = useData();

  // 1. Trigger resource fetch for this grade
  useEffect(() => {
    if (gradeId) {
      fetchResourcesForGrade(gradeId);
    }
  }, [gradeId, fetchResourcesForGrade]);

  // 2. Generate the structured page data
  const pageData = useMemo(() => {
    return generateGradePageData(gradeId);
  }, [gradeId, generateGradePageData]);

  const isLoading = dataLoading || gradesLoading || subjectsLoading;
  const isGradeMissing = !isLoading && !pageData.grade;

  return {
    grade: pageData.grade,
    subjects: pageData.subjects,
    isLoading,
    isGradeMissing
  };
};
