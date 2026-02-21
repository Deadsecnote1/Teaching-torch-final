import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import ResourceCard from '../components/common/ResourceCard';
import { subjectTranslations } from '../utils/subjectTranslations';


// Removed API_BASE_URL - using Google Drive links instead

const TextbooksPage = () => {
  const { gradeId } = useParams();
  const { generateGradePageData, loading: isLoading } = useData();
  // Generate page data
  const pageData = useMemo(() => {
    return generateGradePageData(gradeId);
  }, [gradeId, generateGradePageData]);
  const { selectedLanguage, shouldShowResource } = useLanguage();

  // Flatten resources from pageData for backward compatibility or direct usage
  const uploadedFiles = useMemo(() => {
    if (!pageData || !pageData.subjects) return [];

    // Aggregate all textbooks from all subjects in this grade
    const allTextbooks = [];
    Object.values(pageData.subjects).forEach(subject => {
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
  }, [pageData]);

  // Group uploaded textbooks by subject and language
  const getTextbooksBySubject = () => {
    const groupedTextbooks = {};

    if (pageData && pageData.subjects) {
      Object.entries(pageData.subjects).forEach(([subjectId, subjectData]) => {
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
  const uploadedTextbooks = getTextbooksBySubject();

  // Generate uploaded textbook component
  const UploadedTextbookDownload = ({ files, language }) => {
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
            showLanguageLabel={false} // Don't show language label inside card since column header has it
          />
        ))}
      </div>
    );
  };

  const allSubjects = subjects;

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
      {/* Page Header */}
      <header className="grade-header">
        <div className="container text-center">
          <h1 className="display-4 fw-bold">{grade.display} Textbooks</h1>
          <p className="lead">
            {gradeId === 'al' ? 'Download A/L textbooks by stream' : 'Download textbooks in Sinhala, Tamil, and English'}
          </p>
        </div>
      </header>

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
                Textbooks
              </li>
            </ol>
          </nav>
        </div>
      </section>

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
              const hasUploadedTextbooks = Object.keys(uploadedSubjectTextbooks).length > 0;

              return (
                <div key={subjectId} className="col-lg-6 mb-4">
                  <div className="subject-section h-100 p-4 border rounded shadow-sm" style={{ backgroundColor: 'var(--card-bg)' }}>
                    <div className="subject-header mb-4 border-bottom pb-2">
                      <div className="d-flex align-items-center">
                        <div className="subject-icon-large me-3">
                          <i className={subject.icon} style={{ fontSize: '2rem', color: 'var(--primary)' }}></i>
                        </div>
                        <div>
                          <h3 className="mb-0">
                            {subjectTranslations.getTranslatedName(subjectId, subject, selectedLanguage)}
                          </h3>
                          <small className="text-muted">
                            {hasUploadedTextbooks ?
                              `${Object.values(uploadedSubjectTextbooks).flat().length} textbook${Object.values(uploadedSubjectTextbooks).flat().length !== 1 ? 's' : ''} available` :
                              'No textbooks uploaded yet'
                            }
                          </small>
                        </div>
                      </div>
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
    </div>
  );
};

export default TextbooksPage;