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

const NotesPage = () => {
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

  // Helper function to format chapter names
  const formatChapterName = (chapterKey) => {
    if (chapterKey.includes('_')) {
      // Remove language suffix for display
      const baseName = chapterKey.split('_')[0];
      if (baseName.startsWith('ch')) {
        const chapterNum = baseName.replace('ch', '');
        return `Chapter ${chapterNum}`;
      }
      return baseName.charAt(0).toUpperCase() + baseName.slice(1).replace('-', ' ');
    }

    if (chapterKey.startsWith('ch')) {
      const chapterNum = chapterKey.replace('ch', '');
      return `Chapter ${chapterNum}`;
    }
    return chapterKey.charAt(0).toUpperCase() + chapterKey.slice(1).replace('-', ' ');
  };

  // Generate notes grid component
  const NotesGrid = ({ notes, onEdit }) => {
    if (!notes || Object.keys(notes).length === 0) {
      return (
        <div className="text-center py-5">
          <i className="bi bi-sticky text-muted" style={{ fontSize: '4rem' }}></i>
          <h5 className="mt-3 text-muted">No notes available</h5>
          <p className="text-muted">Short notes for this subject haven't been added yet.</p>
        </div>
      );
    }

    // Filter notes by language
    const filteredNotes = Object.entries(notes).filter(([noteKey, note]) =>
      shouldShowResource(note.language)
    );

    if (filteredNotes.length === 0) {
      return (
        <div className="text-center py-5">
          <i className="bi bi-search text-muted" style={{ fontSize: '4rem' }}></i>
          <h5 className="mt-3 text-muted">No notes found</h5>
          <p className="text-muted">
            No notes available in{' '}
            {selectedLanguage === 'sinhala' ? 'Sinhala' :
              selectedLanguage === 'tamil' ? 'Tamil' :
                selectedLanguage === 'english' ? 'English' : 'the selected language'}
            {' '}for this subject.
          </p>
        </div>
      );
    }

    return (
      <div className="notes-grid">
        <div className="row g-3">
          {filteredNotes.map(([noteKey, note]) => (
            <div key={noteKey} className="col-md-6 col-lg-4">
              <div className="note-card h-100" data-language={note.language}>
                <div className="card h-100">
                  <div className="card-body d-flex flex-column">
                    <div className="note-header mb-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="note-icon">
                          <i className="bi bi-file-pdf text-danger" style={{ fontSize: '2rem' }}></i>
                        </div>
                      </div>
                    </div>

                    <div className="note-content flex-grow-1">
                      <h6 className="note-title mb-2">
                        {formatChapterName(note.chapter || noteKey)}
                      </h6>
                      <div className="note-meta mb-3">
                        <small className="text-muted d-block">{note.filename}</small>
                      </div>
                    </div>

                    <div className="note-actions mt-auto">
                      {note.driveLink || note.url ? (
                        <ResourceCard
                          resource={{
                            ...note,
                            driveLink: note.driveLink || note.url || note.path
                          }}
                          title={formatChapterName(note.chapter || noteKey)}
                          description={note.filename}
                          showViewButton={true}
                          showDownloadButton={true}
                          onEdit={onEdit}
                        />
                      ) : (
                        <a
                          href={`/${note.path}`}
                          className="btn btn-primary btn-sm w-100"
                          download
                        >
                          <i className="bi bi-download me-1"></i>Download Notes
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="notes-page">
      {/* Page Header */}
      <header className="grade-header">
        <div className="container text-center">
          <h1 className="display-4 fw-bold">{grade.display} {getResourceTypeName('notes', selectedLanguage)}</h1>
          <p className="lead">Quick reference notes for all chapters</p>
        </div>
      </header>

      {/* Header Ad Unit */}
      <AdSenseComponent slot="NOTES_HEADER_AD_SLOT" />

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
                {getResourceTypeName('notes', selectedLanguage)}
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
                Showing notes in: <strong>
                  {selectedLanguage === 'sinhala' ? 'සිංහල (Sinhala)' :
                    selectedLanguage === 'tamil' ? 'தமிழ் (Tamil)' :
                      selectedLanguage === 'english' ? 'English' : 'All Languages'}
                </strong>
              </small>
            </div>
          </div>
        </section>
      )}

      {/* Notes Content */}
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
            const notes = subject.resources.notes || {};
            const mergedNotes = notes;

            // Filter by selected subject if specified
            if (selectedSubjectId && subjectId !== selectedSubjectId) {
              return null;
            }

            // Check if any notes match the filter
            const hasFilteredNotes = Object.values(mergedNotes).some(note => shouldShowResource(note.language));

            // Skip subject if no notes match filter
            if (!hasFilteredNotes) {
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
                      <small className="text-muted">Chapter-wise short notes</small>
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

                <NotesGrid notes={mergedNotes} onEdit={(r) => setEditingResource(r)} />

                {isManageMode && (
                  <div className="mt-4 pt-3 border-top">
                    <button 
                      className="btn btn-outline-success w-100 py-2"
                      style={{ borderStyle: 'dashed', borderWidth: '2px' }}
                      onClick={() => {
                        setAddModalInitialData({
                          grade: gradeId,
                          subject: subjectId,
                          resourceType: 'notes',
                          languages: ['sinhala', 'tamil', 'english']
                        });
                        setIsAddModalOpen(true);
                      }}
                    >
                      <i className="bi bi-plus-lg me-2"></i>
                      Add New Note
                    </button>
                  </div>
                )}
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
              <i className="bi bi-sticky text-muted" style={{ fontSize: '4rem' }}></i>
              <h4 className="mt-3 text-muted">No notes available</h4>
              <p className="text-muted">Short notes for this grade haven't been added yet.</p>
              <Link to={`/grade/${gradeId}`} className="btn btn-primary">
                <i className="bi bi-arrow-left me-1"></i>Back to Grade Overview
              </Link>
            </div>
          )}

          {/* No Results for Filter */}
          {Object.keys(subjects).length > 0 &&
            !Object.values(subjects).some(subject =>
              Object.values(subject.resources.notes || {}).some(note => shouldShowResource(note.language))
            ) && (
              <div className="text-center py-5">
                <i className="bi bi-search text-muted" style={{ fontSize: '4rem' }}></i>
                <h4 className="mt-3 text-muted">No notes found</h4>
                <p className="text-muted">
                  No notes available in{' '}
                  {selectedLanguage === 'sinhala' ? 'Sinhala' :
                    selectedLanguage === 'tamil' ? 'Tamil' :
                      selectedLanguage === 'english' ? 'English' : 'the selected language'}
                  {' '}for this grade.
                </p>
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

export default NotesPage;