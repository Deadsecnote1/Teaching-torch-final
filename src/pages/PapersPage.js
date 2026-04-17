import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import ResourceCard from '../components/common/ResourceCard';
import ResourceEditorModal from '../components/admin/ResourceEditorModal';
import MetadataEditorModal from '../components/admin/MetadataEditorModal';
import { subjectTranslations } from '../utils/subjectTranslations';
import { getResourceTypeName } from '../utils/resourceTranslations';
import AdSenseComponent from '../components/common/AdSenseComponent';
import toast from 'react-hot-toast';

const PapersPage = () => {
  const { gradeId } = useParams();
  const [searchParams] = useSearchParams();
  const selectedSubjectId = searchParams.get('subject');
  const { generateGradePageData, fetchResourcesForGrade, updateSubject, deleteSubject } = useData();
  const { selectedLanguage, shouldShowResource } = useLanguage();
  const { isManageMode } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalInitialData, setAddModalInitialData] = useState(null);
  const [editingResource, setEditingResource] = useState(null);
  const [metadataModal, setMetadataModal] = useState({
    isOpen: false,
    initialData: null,
    type: 'subject',
    key: null
  });

  // Lazy-load resources for this grade
  useEffect(() => {
    if (gradeId) {
      fetchResourcesForGrade(gradeId);
    }
  }, [gradeId, fetchResourcesForGrade]);

  // Generate page data
  const pageData = useMemo(() => {
    return generateGradePageData(gradeId);
  }, [gradeId, generateGradePageData]);

  if (!pageData.grade) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2>Grade Not Found</h2>
          <p>The requested grade does not exist.</p>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  const { grade, subjects } = pageData;



  // Helper function to format term names
  const formatTermName = (termKey) => {
    const termNames = {
      'term1': '1st Term',
      'term2': '2nd Term',
      'term3': '3rd Term'
    };
    return termNames[termKey] || termKey.charAt(0).toUpperCase() + termKey.slice(1);
  };

  // Helper function to format chapter names
  const formatChapterName = (chapterKey) => {
    if (chapterKey.startsWith('ch')) {
      const chapterNum = chapterKey.replace('ch', '');
      return `Chapter ${chapterNum}`;
    }
    return chapterKey.charAt(0).toUpperCase() + chapterKey.slice(1).replace('-', ' ');
  };

  // Generate term papers component
  const TermPapers = ({ termPapers, onEdit }) => {
    if (!termPapers || Object.keys(termPapers).length === 0) {
      return (
        <div className="text-center py-4">
          <i className="bi bi-file-earmark text-muted" style={{ fontSize: '2rem' }}></i>
          <p className="text-muted mt-2">No term papers available</p>
        </div>
      );
    }

    return (
      <div className="papers-list">
        {Object.entries(termPapers).map(([termKey, papers]) => {
          if (!Array.isArray(papers) || papers.length === 0) return null;

          // Filter papers by language
          const filteredPapers = papers.filter(paper => shouldShowResource(paper.language));

          if (filteredPapers.length === 0) return null;

          return (
            <div key={termKey} className="term-section mb-4">
              <h6 className="text-primary mb-3">
                <i className="bi bi-calendar me-2"></i>
                {formatTermName(termKey)}
              </h6>
              <div className="row g-2">
                {filteredPapers.map((paper, index) => (
                  <div key={paper.id || index} className="col-12 mb-2">
                    <ResourceCard
                      resource={paper}
                      title={paper.filename || paper.title || paper.name}
                      description={paper.school ? `School: ${paper.school}` : ''}
                      language={paper.language}
                      showLanguageLabel={true}
                      showViewButton={true}
                      showDownloadButton={true}
                      onEdit={onEdit}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Generate chapter papers component
  const ChapterPapers = ({ chapterPapers, onEdit }) => {
    if (!chapterPapers || Object.keys(chapterPapers).length === 0) {
      return (
        <div className="text-center py-4">
          <i className="bi bi-file-earmark text-muted" style={{ fontSize: '2rem' }}></i>
          <p className="text-muted mt-2">No chapter papers available</p>
        </div>
      );
    }

    return (
      <div className="papers-list">
        {Object.entries(chapterPapers).map(([chapterKey, papers]) => {
          if (!Array.isArray(papers) || papers.length === 0) return null;

          // Filter papers by language
          const filteredPapers = papers.filter(paper => shouldShowResource(paper.language));

          if (filteredPapers.length === 0) return null;

          return (
            <div key={chapterKey} className="chapter-section mb-4">
              <h6 className="text-success mb-3">
                <i className="bi bi-journal-text me-2"></i>
                {formatChapterName(chapterKey)}
              </h6>
              <div className="row g-2">
                {filteredPapers.map((paper, index) => (
                  <div key={paper.id || index} className="col-12 mb-2">
                    <ResourceCard
                      resource={paper}
                      title={paper.filename || paper.title || paper.name}
                      description={paper.school ? `School: ${paper.school}` : ''}
                      language={paper.language}
                      showLanguageLabel={true}
                      showViewButton={true}
                      showDownloadButton={true}
                      onEdit={onEdit}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="papers-page">
      {/* Page Header */}
      <header className="grade-header">
        <div className="container text-center">
          <h1 className="display-4 fw-bold">{grade.display} {getResourceTypeName('papers', selectedLanguage)}</h1>
          <p className="lead">Past papers for practice and preparation</p>
        </div>
      </header>

      {/* Header Ad Unit */}
      <AdSenseComponent slot="PAPERS_HEADER_AD_SLOT" />

      {/* Breadcrumb */}
      <section className="py-3 bg-light">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to={`/grade/${gradeId}`}>{grade.display}</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {getResourceTypeName('papers', selectedLanguage)}
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Language Filter Info */}
      {selectedLanguage !== 'all' && (
        <section className="py-2 bg-info bg-opacity-10">
          <div className="container">
            <div className="text-center">
              <small className="text-info">
                <i className="bi bi-filter me-1"></i>
                Showing papers in: <strong>
                  {selectedLanguage === 'sinhala' && 'සිංහල (Sinhala)'}
                  {selectedLanguage === 'tamil' && 'தமிழ் (Tamil)'}
                  {selectedLanguage === 'english' && 'English'}
                </strong>
              </small>
            </div>
          </div>
        </section>
      )}

      {/* Papers Content */}
      <section className="py-5">
        <div className="container">
          {Object.keys(subjects).filter(subjectId => {
            const subject = subjects[subjectId];
            if (subject.languages && subject.languages.length > 0) {
              return subject.languages.includes(selectedLanguage);
            }
            return true;
          }).map(subjectId => {
            const subject = subjects[subjectId];
            const papers = subject.resources.papers || {};

            // Merge uploaded papers with existing papers (now fully handled by Firestore)
            const mergedPapers = {
              terms: {
                term1: papers.terms?.term1 || [],
                term2: papers.terms?.term2 || [],
                term3: papers.terms?.term3 || []
              },
              chapters: papers.chapters || {}
            };

            // Check if any papers match the filter
            const hasTermPapers = mergedPapers.terms && Object.values(mergedPapers.terms).some(termPapers =>
              Array.isArray(termPapers) && termPapers.some(paper => shouldShowResource(paper.language))
            );
            const hasChapterPapers = mergedPapers.chapters && Object.values(mergedPapers.chapters).some(chapterPapers =>
              Array.isArray(chapterPapers) && chapterPapers.some(paper => shouldShowResource(paper.language))
            );

            // Filter by selected subject if specified
            if (selectedSubjectId && subjectId !== selectedSubjectId) {
              return null;
            }

            // Skip subject if no papers match filter
            if (!hasTermPapers && !hasChapterPapers) {
              return null;
            }

            return (
              <div key={subjectId} className="subject-section mb-5">
                <div className="subject-header mb-4 d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div className="subject-icon-large me-3">
                      <i className={subject.icon} style={{ fontSize: '2.5rem', color: 'var(--primary)' }}></i>
                    </div>
                    <div>
                      <h3 className="mb-0">
                        {subjectTranslations.getTranslatedName(subjectId, subject, selectedLanguage)}
                      </h3>
                      <small className="text-muted">Past examination papers</small>
                    </div>
                  </div>

                  {isManageMode && (
                    <div className="admin-subject-actions d-flex gap-2">
                       <button 
                        className="btn btn-sm btn-outline-info"
                        onClick={() => {
                          setMetadataModal({
                            isOpen: true,
                            initialData: subject,
                            type: 'subject',
                            key: subjectId
                          });
                        }}
                        title="Edit Subject"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete "${subject.name}"?`)) {
                            deleteSubject(subjectId);
                            toast.success('Subject Deleted');
                          }
                        }}
                        title="Delete Subject"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  )}
                </div>

                <div className="row g-4">
                  {/* Term Papers */}
                  <div className="col-md-6">
                    <div className="paper-type-card h-100 position-relative">
                      <div className="card h-100">
                        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-2">
                          <h5 className="mb-0 h6">
                            <i className="bi bi-calendar me-2"></i>Term Papers
                          </h5>
                          {isManageMode && (
                            <button 
                              className="btn btn-sm btn-light py-0 text-primary fw-bold"
                              onClick={() => {
                                setAddModalInitialData({
                                  grade: gradeId,
                                  subject: subjectId,
                                  resourceType: 'papers',
                                  languages: ['sinhala', 'tamil', 'english']
                                });
                                setIsAddModalOpen(true);
                              }}
                            >
                              <i className="bi bi-plus"></i> Add
                            </button>
                          )}
                        </div>
                        <div className="card-body">
                          <TermPapers termPapers={mergedPapers.terms} onEdit={(r) => setEditingResource(r)} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chapter Papers */}
                  <div className="col-md-6">
                    <div className="paper-type-card h-100">
                      <div className="card h-100">
                        <div className="card-header bg-success text-white d-flex justify-content-between align-items-center py-2">
                          <h5 className="mb-0 h6">
                            <i className="bi bi-journal-text me-2"></i>Chapter Papers
                          </h5>
                          {isManageMode && (
                            <button 
                              className="btn btn-sm btn-light py-0 text-success fw-bold"
                              onClick={() => {
                                setAddModalInitialData({
                                  grade: gradeId,
                                  subject: subjectId,
                                  resourceType: 'papers',
                                  languages: ['sinhala', 'tamil', 'english']
                                });
                                setIsAddModalOpen(true);
                              }}
                            >
                              <i className="bi bi-plus"></i> Add
                            </button>
                          )}
                        </div>
                        <div className="card-body">
                          <ChapterPapers chapterPapers={mergedPapers.chapters} onEdit={(r) => setEditingResource(r)} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <ResourceEditorModal 
            isOpen={isAddModalOpen}
            onClose={() => {
              setIsAddModalOpen(false);
              setAddModalInitialData(null);
            }}
            resource={addModalInitialData}
          />

          {/* No Subjects Message */}
          {Object.keys(subjects).length === 0 && (
            <div className="text-center py-5">
              <i className="bi bi-file-earmark-text text-muted" style={{ fontSize: '4rem' }}></i>
              <h4 className="mt-3 text-muted">No exam papers available</h4>
              <p className="text-muted">Past papers for this grade haven't been added yet.</p>
              <Link to={`/grade/${gradeId}`} className="btn btn-primary">
                <i className="bi bi-arrow-left me-1"></i>Back to Grade Overview
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Back to Grade Button */}
      <section className="py-3 bg-light">
        <div className="container text-center">
          <Link to={`/grade/${gradeId}`} className="btn btn-outline-primary">
            <i className="bi bi-arrow-left me-2"></i>Back to {grade.display} Overview
          </Link>
        </div>
      </section>
      {/* Resource Editor Modal (Centralized) */}
      <ResourceEditorModal
        resource={editingResource}
        isOpen={!!editingResource}
        onClose={() => setEditingResource(null)}
      />

      {/* Edit Subject Modal */}
      <MetadataEditorModal
        isOpen={metadataModal.isOpen}
        onClose={() => setMetadataModal({ ...metadataModal, isOpen: false })}
        onSave={(updatedData) => {
          updateSubject(metadataModal.key, updatedData);
          toast.success('Subject Updated');
        }}
        title="Edit Subject"
        initialData={metadataModal.initialData}
        type="subject"
      />
    </div>
  );
};

export default PapersPage;