import React, { useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useGradePage } from '../hooks/useGradePage';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import ResourceCard from '../components/common/ResourceCard';
import ResourceEditorModal from '../components/admin/ResourceEditorModal';
import MetadataEditorModal from '../components/admin/MetadataEditorModal';
import { extractYouTubeId, getYouTubeThumbnail, isYouTubeLink } from '../utils/youtube';
import { getEmbedUrl, isGoogleDriveLink } from '../utils/googleDrive';
import { subjectTranslations } from '../utils/subjectTranslations';
import { getResourceTypeName } from '../utils/resourceTranslations';
import toast from 'react-hot-toast';

const VideosPage = () => {
  const { gradeId, streamId, subjectId: paramSubjectId } = useParams();
  const [searchParams] = useSearchParams();
  const selectedSubjectId = paramSubjectId || searchParams.get('subject');
  const { grade: rawGrade, subjects, isLoading, isGradeMissing } = useGradePage(streamId || gradeId);
  const { updateSubject, deleteSubject, grades } = useData();
  const { selectedLanguage, setLanguage, shouldShowResource, getLanguageIndicator, languages } = useLanguage();
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
  const [activeVideo, setActiveVideo] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);

  const grade = rawGrade;
  const parentGrade = streamId ? grades[gradeId] : null;
  const subject = selectedSubjectId ? subjects[selectedSubjectId] : null;

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

  const handlePlayVideo = (video, videoUrl) => {
    const youtubeId = extractYouTubeId(videoUrl);
    if (youtubeId) {
      setActiveVideo({
        title: video.title,
        embedUrl: `https://www.youtube.com/embed/${youtubeId}?autoplay=1`
      });
      setShowPlayer(true);
      return;
    }

    if (isGoogleDriveLink(videoUrl)) {
      const embedUrl = getEmbedUrl(videoUrl);
      if (embedUrl) {
        setActiveVideo({
          title: video.title,
          embedUrl
        });
        setShowPlayer(true);
        return;
      }
    }

    // Fallback: open in new tab
    window.open(videoUrl, '_blank', 'noopener,noreferrer');
  };

  // Generate videos grid component
  const VideosGrid = ({ videos, onEdit }) => {
    if (!videos || videos.length === 0) {
      return (
        <div className="text-center py-5">
          <i className="bi bi-youtube text-muted" style={{ fontSize: '4rem' }}></i>
          <h5 className="mt-3 text-muted">No video lessons available</h5>
          <p className="text-muted">Video lessons for this subject haven't been added yet.</p>
        </div>
      );
    }

    // Filter videos by language
    const filteredVideos = videos.filter(video => shouldShowResource(video));

    if (filteredVideos.length === 0) {
      return (
        <div className="text-center py-5">
          <i className="bi bi-search text-muted" style={{ fontSize: '4rem' }}></i>
          <h5 className="mt-3 text-muted">No videos found</h5>
          <p className="text-muted">
            No video lessons available in{' '}
            {selectedLanguage === 'sinhala' && 'Sinhala'}
            {selectedLanguage === 'tamil' && 'Tamil'}
            {selectedLanguage === 'english' && 'English'}
            {' '}for this subject.
          </p>
        </div>
      );
    }

    return (
      <div className="videos-grid">
        <div className="row g-4">
          {filteredVideos.map((video, index) => {
            const videoUrl = video.driveLink || video.url || video.youtubeUrl;
            const thumbnail = getYouTubeThumbnail(videoUrl);

            return (
              <div key={video.id || index} className="col-md-6 col-lg-4">
                <div className="video-card h-100" data-language={video.language}>
                  <div className="card h-100">
                    {/* Video Thumbnail */}
                    <div className="video-thumbnail position-relative">
                      {thumbnail ? (
                        <img
                          src={thumbnail}
                          alt={video.title}
                          className="card-img-top"
                          style={{ height: '200px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}

                      {/* Fallback thumbnail */}
                      <div
                        className="placeholder-thumbnail d-flex align-items-center justify-content-center bg-light"
                        style={{
                          height: '200px',
                          display: thumbnail ? 'none' : 'flex'
                        }}
                      >
                        <i className="bi bi-play-circle text-muted" style={{ fontSize: '4rem' }}></i>
                      </div>

                      {/* Play overlay */}
                      <div className="play-overlay position-absolute top-50 start-50 translate-middle">
                        <div className="play-button bg-danger text-white rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: '60px', height: '60px' }}>
                          <i className="bi bi-play-fill" style={{ fontSize: '1.5rem', marginLeft: '4px' }}></i>
                        </div>
                      </div>

                      {/* Language badge */}
                      <div className="position-absolute top-0 end-0 m-2">
                        <span className="badge bg-dark bg-opacity-75 d-flex align-items-center">
                          <span
                            className="language-indicator me-1"
                            {...getLanguageIndicator(video.language || video.languages?.[0])}
                          ></span>
                          {video.language || video.languages?.[0]}
                        </span>
                      </div>
                    </div>

                    {/* Video Content */}
                    <div className="card-body d-flex flex-column">
                      <div className="video-content flex-grow-1">
                        <h6 className="video-title mb-2">{video.title}</h6>

                        {video.chapter && (
                          <p className="text-muted mb-2">
                            <i className="bi bi-bookmark me-1"></i>
                            <small>{video.chapter}</small>
                          </p>
                        )}

                        {video.description && (
                          <p className="text-muted small mb-3">{video.description}</p>
                        )}

                          <small className="text-muted d-block">
                            <i className="bi bi-calendar me-1"></i>
                            Added: {video.addedDate ? new Date(video.addedDate).toLocaleDateString() : 'Recently'}
                          </small>
                      </div>

                      {/* Video Actions */}
                      <div className="video-actions mt-3">
                        <button
                          className={`btn btn-sm w-100 ${isYouTubeLink(videoUrl) ? 'btn-danger' : 'btn-primary'}`}
                          onClick={() => handlePlayVideo(video, videoUrl)}
                        >
                          <i className="bi bi-play-circle me-1"></i>
                          Play Video
                        </button>
                      </div>

                      {/* Admin Management Actions */}
                      {isManageMode && (
                        <div className="admin-management mt-2 pt-2 border-top">
                          <ResourceCard
                            resource={video}
                            title={video.title}
                            description={video.chapter ? `Chapter: ${video.chapter}` : ''}
                            showViewButton={false}
                            showDownloadButton={false}
                            onEdit={onEdit}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="videos-page">
      {/* Header */}
      <header className="grade-header">
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-0">{grade.display} Video Lessons</h1>
          <p className="lead mt-2">Curated educational videos and tutorials</p>
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
                {getResourceTypeName('videos', selectedLanguage)}
              </li>
            </ol>
          </nav>
        </div>
      </section>



      {/* Videos Content */}
      <section className="py-5">
        <div className="container">
          {Object.keys(subjects).filter(subjectId => {
            if (subjectId === 'standalone') return false;
            const subject = subjects[subjectId];
            if (subject.languages && subject.languages.length > 0) {
              return subject.languages.includes(selectedLanguage);
            }
            return true;
          }).map(subjectId => {
            const subject = subjects[subjectId];
            const videos = subject.videos || [];

            const mergedVideos = videos;

            // Filter by selected subject if specified
            if (selectedSubjectId && subjectId !== selectedSubjectId) {
              return null;
            }

            // Check if any videos match the filter
            const hasFilteredVideos = mergedVideos.some(video => shouldShowResource(video));

            // Skip subject if no videos match filter
            if (!hasFilteredVideos) {
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
                      <small className="text-muted">Educational video lessons</small>
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

                <VideosGrid videos={mergedVideos} onEdit={(r) => setEditingResource(r)} />

                {isManageMode && (
                  <div className="mt-4 pt-3 border-top">
                    <button 
                      className="btn btn-outline-success w-100 py-2"
                      style={{ borderStyle: 'dashed', borderWidth: '2px' }}
                      onClick={() => {
                        setAddModalInitialData({
                          grade: gradeId,
                          subject: subjectId,
                          resourceType: 'videos',
                          languages: ['sinhala', 'tamil', 'english']
                        });
                        setIsAddModalOpen(true);
                      }}
                    >
                      <i className="bi bi-plus-lg me-2"></i>
                      Add New Video
                    </button>
                  </div>
                )}
              </div>
            );
          })}



          {/* No Subjects Message */}
          {Object.keys(subjects).length === 0 && (
            <div className="text-center py-5">
              <i className="bi bi-youtube text-muted" style={{ fontSize: '4rem' }}></i>
              <h4 className="mt-3 text-muted">No video lessons available</h4>
              <p className="text-muted">Video lessons for this grade haven't been added yet.</p>
              <Link to={`/grade/${gradeId}`} className="btn btn-primary">
                <i className="bi bi-arrow-left me-1"></i>Back to Grade Overview
              </Link>
            </div>
          )}

          {/* No Results for Filter */}
          {Object.keys(subjects).length > 0 &&
            !Object.values(subjects).some(subject =>
              (subject.videos || []).some(video => shouldShowResource(video))
            ) && (
              <div className="text-center py-5">
                <i className="bi bi-search text-muted" style={{ fontSize: '4rem' }}></i>
                <h4 className="mt-3 text-muted">No videos found</h4>
                <p className="text-muted">
                  No video lessons available in{' '}
                  {selectedLanguage === 'sinhala' && 'Sinhala'}
                  {selectedLanguage === 'tamil' && 'Tamil'}
                  {selectedLanguage === 'english' && 'English'}
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

      {/* Video Player Modal */}
      {showPlayer && activeVideo && (
        <div
          className="modal fade show d-block"
          style={{
            backgroundColor: 'rgba(0,0,0,0.6)',
            position: 'fixed',
            inset: 0,
            zIndex: 1050
          }}
          onClick={() => setShowPlayer(false)}
        >
          <div
            className="modal-dialog modal-xl modal-dialog-centered"
            style={{ margin: '2rem auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-play-circle text-danger me-2"></i>
                  {activeVideo.title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowPlayer(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body p-0">
                <div className="ratio ratio-16x9">
                  <iframe
                    title={activeVideo.title}
                    src={activeVideo.embedUrl}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ border: 'none' }}
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .video-thumbnail {
          position: relative;
          overflow: hidden;
          border-radius: 0.5rem;
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
        }

        .video-thumbnail img {
          transition: transform 0.3s ease;
        }

        .video-thumbnail:hover img {
          transform: scale(1.05);
        }

        .placeholder-thumbnail {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 0.5rem;
          z-index: 1;
        }

        .play-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        .play-button {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal.show {
          display: block !important;
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

export default VideosPage;