import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useGradePage } from '../hooks/useGradePage';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import ResourceCard from '../components/common/ResourceCard';
import ResourceEditorModal from '../components/admin/ResourceEditorModal';
import MetadataEditorModal from '../components/admin/MetadataEditorModal';
import { subjectTranslations } from '../utils/subjectTranslations';
import { getResourceTypeName } from '../utils/resourceTranslations';
import AdSenseComponent from '../components/common/AdSenseComponent';
import toast from 'react-hot-toast';


// Removed API_BASE_URL - using Google Drive links instead

const TextbooksPage = () => {
  const { gradeId, streamId, subjectId: paramSubjectId } = useParams();
  const selectedSubjectId = paramSubjectId;
  const { grade: rawGrade, subjects, isLoading, isGradeMissing } = useGradePage(streamId || gradeId);
  const { updateSubject, deleteSubject, grades } = useData();
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

  const grade = rawGrade;
  const parentGrade = streamId ? grades[gradeId] : null;
  const subject = selectedSubjectId ? subjects[selectedSubjectId] : null;
  const { selectedLanguage, setLanguage, shouldShowResource, isShowingAll, languages } = useLanguage();

  // Flatten resources from subjects for backward compatibility or direct usage
  const uploadedFiles = useMemo(() => {
    if (!subjects) return [];

    // Aggregate all textbooks from all subjects in this grade
    const allTextbooks = [];
    Object.values(subjects).forEach(subject => {
      if (subject.resources && subject.resources.textbooks) {
        Object.values(subject.resources.textbooks).forEach(tbArray => {
          if (Array.isArray(tbArray)) {
            allTextbooks.push(...tbArray);
          } else {
            allTextbooks.push(tbArray);
          }
        });
      }
    });
    return allTextbooks;
  }, [subjects]);

  // Group uploaded textbooks by subject and language
  const getTextbooksBySubject = () => {
    const groupedTextbooks = {};

    if (subjects) {
      Object.entries(subjects).forEach(([subjectId, subjectData]) => {
        if (subjectData.resources && subjectData.resources.textbooks) {
          const textbooksObj = subjectData.resources.textbooks;
          // textbooksObj is { english: {...}, sinhala: {...} }

          groupedTextbooks[subjectId] = {};

          Object.entries(textbooksObj).forEach(([lang, dataArray]) => {
            // DataContext now naturally provides an array
            groupedTextbooks[subjectId][lang] = Array.isArray(dataArray) ? dataArray : [dataArray];
          });
        }
      });
    }

    return groupedTextbooks;
  };

  const uploadedTextbooks = getTextbooksBySubject();

  if (isLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (isGradeMissing) {
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

  // Generate uploaded textbook component
  const UploadedTextbookDownload = ({ files, language, onEdit }) => {
    if (!files || files.length === 0) {
      return (
        <div className="text-center py-4">
          <i className="bi bi-file-earmark text-muted" style={{ fontSize: '3rem' }}></i>
          <p className="text-muted mt-2">No textbook available</p>
        </div>
      );
    }

    return (
      <div className="uploaded-textbooks">
        {files.map((file, index) => (
          <ResourceCard
            key={file.id || index}
            resource={file}
            title={file.title || file.name || file.originalName}
            description={file.description}
            language={language}
            showViewButton={true}
            showDownloadButton={true}
            className="mb-3"
            showLanguageLabel={false}
            onEdit={onEdit}
          />
        ))}
      </div>
    );
  };

  const allSubjects = Object.fromEntries(
    Object.entries(subjects).filter(([subjectId, subject]) => {
      if (subjectId === 'standalone') return false;
      if (selectedSubjectId && subjectId !== selectedSubjectId) return false;
      if (subject.languages && subject.languages.length > 0) {
        return isShowingAll() || subject.languages.includes(selectedLanguage);
      }
      return true;
    })
  );

  if (isLoading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading textbooks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="textbooks-page">
      {/* Header */}
      <header className="grade-header">
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-0">{grade.display} Textbooks</h1>
          <p className="lead mt-2">Official Government textbooks in your preferred medium</p>
        </div>
      </header>

      {/* Language Switcher Section */}
      <section className="py-4 switcher-container border-bottom">
        <div className="container">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-3">
            <span className="fw-bold text-uppercase tracking-wider small opacity-75">Select Content Medium:</span>
            <div className="btn-group shadow-sm" role="group">
              {['sinhala', 'tamil', 'english'].map(lang => (
                <button
                  key={lang}
                  type="button"
                  className={`btn px-4 py-2 content-medium-btn ${selectedLanguage === lang ? 'btn-primary active' : 'btn-outline-custom'}`}
                  onClick={() => setLanguage(lang)}
                  style={{ minWidth: '120px' }}
                >
                  <i className={`bi bi-circle-fill me-2`} style={{ color: languages[lang].color, fontSize: '0.7rem' }}></i>
                  {languages[lang].display}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="py-3 bg-light">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              {parentGrade && (
                <li className="breadcrumb-item">
                  <Link to={`/grade/${gradeId}`}>{parentGrade.display}</Link>
                </li>
              )}
              <li className="breadcrumb-item">
                <Link to={streamId ? `/grade/${gradeId}/${streamId}` : `/grade/${gradeId}`}>{grade.display}</Link>
              </li>
              {subject && (
                <li className="breadcrumb-item">
                  <Link to={`/grade/${gradeId}/${streamId}/${selectedSubjectId}`}>{subject.display}</Link>
                </li>
              )}
              <li className="breadcrumb-item active" aria-current="page">
                {getResourceTypeName('textbooks', selectedLanguage)}
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Header Ad Unit */}
      <AdSenseComponent slot="TEXTBOOKS_HEADER_AD_SLOT" />

      {/* Upload Status */}
      {uploadedFiles.length > 0 && (
        <section className="py-2 bg-success bg-opacity-10">
          <div className="container">
            <div className="text-center">
              <small className="text-success">
                <i className="bi bi-cloud-check me-1"></i>
                <strong>{uploadedFiles.length} uploaded textbook{uploadedFiles.length !== 1 ? 's' : ''}</strong> available for {grade.display}
                {uploadedFiles.some(f => f.downloadUrl) && ' | 🔗 Server files available for download'}
              </small>
            </div>
          </div>
        </section>
      )}

      {/* Textbooks Content */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            {Object.entries(allSubjects).map(([subjectId, subject]) => {
              const uploadedSubjectTextbooks = uploadedTextbooks[subjectId] || {};

              return (
                <div key={subjectId} className="col-lg-6 mb-4">
                  <div className="subject-section h-100 p-4 border rounded shadow-sm" style={{ backgroundColor: 'var(--card-bg)' }}>
                    <div className="subject-header mb-4 border-bottom pb-2 d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <div className="subject-icon-large me-3">
                          <i className={subject.icon} style={{ fontSize: '2rem', color: 'var(--primary)' }}></i>
                        </div>
                        <div>
                          <h4 className="subject-title mb-0">
                            {subjectTranslations.getTranslatedName(subjectId, subject, selectedLanguage)}
                          </h4>
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

                    <div className="row g-3">
                      {/* Sinhala Textbooks */}
                      {shouldShowResource('sinhala') && (
                        <div className="col-12 mb-3">
                          <div className="textbook-medium-card h-100 w-100">
                            <div className="card h-100 w-100 d-flex flex-column">
                              <div className="card-header bg-danger text-white text-center py-2">
                                <h6 className="mb-0">
                                  <i className="bi bi-download me-2"></i>
                                  {/* Removed as per request */}
                                </h6>
                              </div>
                              <div className="card-body p-2 flex-grow-1 overflow-auto">
                                {uploadedSubjectTextbooks.sinhala ? (
                                  <UploadedTextbookDownload
                                    files={uploadedSubjectTextbooks.sinhala}
                                    language="sinhala"
                                    onEdit={(r) => setEditingResource(r)}
                                  />
                                ) : (
                                  <div className="text-center py-3">
                                    <i className="bi bi-dash-circle text-muted" style={{ fontSize: '1.5rem' }}></i>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tamil Textbooks */}
                      {shouldShowResource('tamil') && (
                        <div className="col-12 mb-3">
                          <div className="textbook-medium-card h-100 w-100">
                            <div className="card h-100 w-100 d-flex flex-column">
                              <div className="card-header text-white text-center py-2" style={{ backgroundColor: 'var(--tamil)' }}>
                                <h6 className="mb-0">
                                  <i className="bi bi-download me-2"></i>
                                  {/* Removed as per request */}
                                </h6>
                              </div>
                              <div className="card-body p-2 flex-grow-1 overflow-auto">
                                {uploadedSubjectTextbooks.tamil ? (
                                  <UploadedTextbookDownload
                                    files={uploadedSubjectTextbooks.tamil}
                                    language="tamil"
                                    onEdit={(r) => setEditingResource(r)}
                                  />
                                ) : (
                                  <div className="text-center py-3">
                                    <i className="bi bi-dash-circle text-muted" style={{ fontSize: '1.5rem' }}></i>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* English Textbooks */}
                      {shouldShowResource('english') && (
                        <div className="col-12 mb-3">
                          <div className="textbook-medium-card h-100 w-100">
                            <div className="card h-100 w-100 d-flex flex-column">
                              <div className="card-header bg-primary text-white text-center py-2">
                                <h6 className="mb-0">
                                  <i className="bi bi-download me-2"></i>
                                  {/* Removed as per request */}
                                </h6>
                              </div>
                              <div className="card-body p-2 flex-grow-1 overflow-auto">
                                {uploadedSubjectTextbooks.english ? (
                                  <UploadedTextbookDownload
                                    files={uploadedSubjectTextbooks.english}
                                    language="english"
                                    onEdit={(r) => setEditingResource(r)}
                                  />
                                ) : (
                                  <div className="text-center py-3">
                                    <i className="bi bi-dash-circle text-muted" style={{ fontSize: '1.5rem' }}></i>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {isManageMode && (
                      <div className="mt-4 pt-3 border-top">
                        <button 
                          className="btn btn-outline-success w-100 py-2"
                          style={{ borderStyle: 'dashed', borderWidth: '2px' }}
                          onClick={() => {
                            setAddModalInitialData({
                              grade: gradeId,
                              subject: subjectId,
                              resourceType: 'textbooks',
                              languages: ['sinhala', 'tamil', 'english']
                            });
                            setIsAddModalOpen(true);
                          }}
                        >
                          <i className="bi bi-plus-lg me-2"></i>
                          Add New Textbook
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* No subjects for A/L without stream */}
          {gradeId === 'al' && (
            <div className="text-center py-5">
              <i className="bi bi-arrow-up text-muted" style={{ fontSize: '4rem' }}></i>
              <h4 className="mt-3 text-muted">Select a Stream</h4>
              <p className="text-muted">Please select your A/L stream above to view available textbooks.</p>
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

      <style>{`
        .textbook-medium-card .card {
          transition: all 0.3s ease;
          border-color: #eee;
        }

        .textbook-medium-card .card:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          border-color: var(--primary);
        }

        .download-item {
          transition: all 0.3s ease;
          padding: 1rem;
          border-radius: 10px;
        }

        .uploaded-textbooks {
          max-height: 250px;
          overflow-y: auto;
        }

        .subject-icon-large {
          min-width: 60px;
        }

        .subject-section {
          background-color: var(--card-bg);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .subject-section:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px var(--card-shadow) !important;
        }

        .textbook-medium-card .card {
          background-color: var(--bg-tertiary) !important;
        }
      `}</style>
      {/* Resource Editor Modal (Centralized) */}
      <ResourceEditorModal
        resource={editingResource || addModalInitialData}
        isOpen={!!editingResource || isAddModalOpen}
        onClose={() => {
          setEditingResource(null);
          setIsAddModalOpen(false);
          setAddModalInitialData(null);
        }}
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

export default TextbooksPage;