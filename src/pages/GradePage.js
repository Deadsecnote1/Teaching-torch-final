import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const GradePage = () => {
  const { gradeId } = useParams();
  const { generateGradePageData } = useData();
  const [recentResources, setRecentResources] = useState([]);

  // Load recent resources for this grade
  useEffect(() => {
    const savedFiles = localStorage.getItem('teachingTorch_uploadedFiles');
    if (savedFiles) {
      try {
        const allFiles = JSON.parse(savedFiles);
        // Filter by grade and sort by upload date (most recent first)
        const gradeResources = allFiles
          .filter(file => file.grade === gradeId)
          .sort((a, b) => {
            const dateA = new Date(a.uploadDate || 0);
            const dateB = new Date(b.uploadDate || 0);
            return dateB - dateA; // Most recent first
          })
          .slice(0, 6); // Show only the 6 most recent
        
        setRecentResources(gradeResources);
      } catch (error) {
        console.error('Error loading recent resources:', error);
      }
    }
  }, [gradeId]);

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

  return (
    <div className="grade-page">
      {/* Grade Header */}
      <header className="grade-header">
        <div className="container text-center">
          <h1 className="display-4 fw-bold">{grade.display} Resources</h1>
          <p className="lead">Quick access to textbooks, papers, notes, and videos.</p>
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
              <li className="breadcrumb-item active" aria-current="page">
                {grade.display}
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Resource Type Cards */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4 mb-5">
            <div className="col-md-3">
              <Link 
                to={`/grade/${gradeId}/textbooks`} 
                className="resource-type-card textbooks"
              >
                <div className="card h-100 text-center">
                  <div className="card-body">
                    <div className="resource-type-icon mb-3">
                      <i className="bi bi-book text-primary" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <h5 className="card-title">Textbooks</h5>
                    <p className="card-text">Downloadable PDF textbooks</p>
                  </div>
                </div>
              </Link>
            </div>
            
            <div className="col-md-3">
              <Link to={`/grade/${gradeId}/papers`} className="resource-type-card papers">
                <div className="card h-100 text-center">
                  <div className="card-body">
                    <div className="resource-type-icon mb-3">
                      <i className="bi bi-file-earmark-text text-info" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <h5 className="card-title">Exam Papers</h5>
                    <p className="card-text">Term & chapter papers</p>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-md-3">
              <Link to={`/grade/${gradeId}/notes`} className="resource-type-card notes">
                <div className="card h-100 text-center">
                  <div className="card-body">
                    <div className="resource-type-icon mb-3">
                      <i className="bi bi-sticky text-warning" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <h5 className="card-title">Short Notes</h5>
                    <p className="card-text">Chapter-wise summaries</p>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-md-3">
              <Link to={`/grade/${gradeId}/videos`} className="resource-type-card videos">
                <div className="card h-100 text-center">
                  <div className="card-body">
                    <div className="resource-type-icon mb-3">
                      <i className="bi bi-play-circle text-danger" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <h5 className="card-title">Video Lessons</h5>
                    <p className="card-text">Educational videos</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Recently Added Resources */}
          <div className="recent-resources">
            <h3 className="mb-4 text-center">
              <i className="bi bi-clock-history me-2"></i>
              Recently Added Resources
            </h3>
            {recentResources.length > 0 ? (
              <div className="row g-4">
                {recentResources.map((resource) => {
                  const getResourceIcon = () => {
                    switch (resource.resourceType) {
                      case 'textbook':
                        return 'bi-book text-primary';
                      case 'papers':
                        return 'bi-file-text text-info';
                      case 'notes':
                        return 'bi-sticky text-warning';
                      case 'videos':
                        return 'bi-play-circle text-danger';
                      default:
                        return 'bi-file-earmark text-secondary';
                    }
                  };

                  const getResourceTypeLabel = () => {
                    switch (resource.resourceType) {
                      case 'textbook':
                        return 'Textbook';
                      case 'papers':
                        return 'Exam Paper';
                      case 'notes':
                        return 'Short Note';
                      case 'videos':
                        return 'Video';
                      default:
                        return 'Resource';
                    }
                  };

                  const getResourceLink = () => {
                    const subjectParam = resource.subject ? `?subject=${resource.subject}` : '';
                    switch (resource.resourceType) {
                      case 'textbook':
                        return `/grade/${gradeId}/textbooks${subjectParam}`;
                      case 'papers':
                        return `/grade/${gradeId}/papers${subjectParam}`;
                      case 'notes':
                        return `/grade/${gradeId}/notes${subjectParam}`;
                      case 'videos':
                        return `/grade/${gradeId}/videos${subjectParam}`;
                      default:
                        return `/grade/${gradeId}`;
                    }
                  };

                  const formatDate = (dateString) => {
                    if (!dateString) return 'Recently';
                    const date = new Date(dateString);
                    const now = new Date();
                    const diffTime = Math.abs(now - date);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    if (diffDays === 0) return 'Today';
                    if (diffDays === 1) return 'Yesterday';
                    if (diffDays < 7) return `${diffDays} days ago`;
                    return date.toLocaleDateString();
                  };

                  const getSubjectName = () => {
                    const subjectNames = {
                      'mathematics': 'Mathematics',
                      'science': 'Science',
                      'english': 'English',
                      'history': 'History'
                    };
                    return subjectNames[resource.subject] || resource.subject || 'Unknown';
                  };

                  return (
                    <div key={resource.id} className="col-lg-4 col-md-6">
                      <Link 
                        to={getResourceLink()} 
                        className="recent-resource-card"
                      >
                        <div className="card h-100">
                          <div className="card-body">
                            <div className="d-flex align-items-start mb-3">
                              <div className="resource-icon me-3">
                                <i className={`bi ${getResourceIcon()}`} style={{ fontSize: '2rem' }}></i>
                              </div>
                              <div className="flex-grow-1">
                                <span className="badge bg-secondary mb-2">
                                  {getResourceTypeLabel()}
                                </span>
                                <h6 className="card-title mb-1" style={{ 
                                  overflow: 'hidden', 
                                  textOverflow: 'ellipsis', 
                                  whiteSpace: 'nowrap' 
                                }} title={resource.title || resource.name}>
                                  {resource.title || resource.name || 'Untitled Resource'}
                                </h6>
                                <small className="text-muted d-block">
                                  <i className="bi bi-bookmark me-1"></i>
                                  {getSubjectName()}
                                </small>
                              </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mt-3">
                              <small className="text-muted">
                                <i className="bi bi-calendar3 me-1"></i>
                                {formatDate(resource.uploadDate)}
                              </small>
                              {resource.languages && resource.languages.length > 0 && (
                                <div className="language-badges">
                                  {resource.languages.slice(0, 2).map((lang, idx) => (
                                    <span 
                                      key={idx} 
                                      className="badge bg-light text-dark me-1"
                                      style={{ fontSize: '0.65rem' }}
                                    >
                                      {lang === 'sinhala' ? 'සිං' : lang === 'tamil' ? 'த' : 'EN'}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-5">
                <i className="bi bi-inbox text-muted" style={{ fontSize: '4rem' }}></i>
                <h5 className="mt-3 text-muted">No resources added yet</h5>
                <p className="text-muted">
                  Resources added for {grade.display} will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-4 bg-light">
        <div className="container text-center">
          <h4 className="mb-3">Need More Resources?</h4>
          <p className="text-muted mb-4">
            Can't find what you're looking for? Contact our admin team to request additional materials.
          </p>
          <Link to="/contact" className="btn btn-primary">
            <i className="bi bi-envelope me-2"></i>Contact Us
          </Link>
        </div>
      </section>

      <style jsx>{`
        .resource-type-card {
          text-decoration: none;
          color: inherit;
          display: block;
          transition: all 0.3s ease;
        }

        .resource-type-card:hover {
          text-decoration: none;
          color: inherit;
          transform: translateY(-5px);
        }

        .resource-type-card .card {
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .resource-type-card:hover .card {
          border-color: var(--primary);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }

        .recent-resource-card {
          text-decoration: none;
          color: inherit;
          display: block;
          transition: all 0.3s ease;
        }

        .recent-resource-card:hover {
          text-decoration: none;
          color: inherit;
          transform: translateY(-3px);
        }

        .recent-resource-card .card {
          transition: all 0.3s ease;
          border: 2px solid var(--border-color);
          height: 100%;
        }

        .recent-resource-card:hover .card {
          border-color: var(--primary);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .resource-icon {
          min-width: 50px;
        }

        .stat-card {
          background: var(--card-bg);
          border-radius: 15px;
          padding: 2rem 1rem;
          border: 1px solid var(--border-color);
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }

        .stats-summary {
          background: var(--card-bg);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 5px 20px rgba(0,0,0,0.05);
        }

        @media (max-width: 768px) {
          .resource-type-card .card {
            margin-bottom: 1rem;
          }

          .subject-card {
            padding: 1.5rem 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default GradePage;