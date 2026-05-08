import React from 'react';
import { getDownloadUrl, getEmbedUrl, isGoogleDriveLink } from '../../utils/googleDrive';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { analytics } from '../../firebase';
import { extractYouTubeId, isYouTubeLink } from '../../utils/youtube';
import toast from 'react-hot-toast';
import { useState } from 'react';

/**
 * Resource Card Component
 * Displays a resource with download and view options
 */
const ResourceCard = ({
  resource,
  title,
  description,
  language,
  showLanguageLabel = false,
  showViewButton = true,
  showDownloadButton = true,
  className = '',
  onEdit, // New prop for centralized editing
  onDelete, // Prop for custom deletion logic (e.g. A/L)
  onPlayVideo
}) => {
  const { isManageMode } = useAuth();
  const { deleteResource } = useData();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);


  const t = { languageLabel: 'Language', deleteConfirm: 'Are you sure you want to delete' };

  // Support both Google Drive links and regular URLs
  const driveLink = resource.driveLink || resource.downloadUrl || resource.url || resource.path || resource.fileUrl;
  const isDrive = isGoogleDriveLink(driveLink);

  const downloadUrl = (isDrive ? getDownloadUrl(driveLink) : driveLink) || '';
  
  // Security: Prevent javascript: protocol XSS
  const safeDownloadUrl = downloadUrl.toLowerCase().startsWith('javascript:') ? '#' : downloadUrl;
  
  const embedUrl = isDrive ? getEmbedUrl(driveLink) : null;

  const handleDownload = (e) => {
    try {
      logEvent(analytics, 'resource_download', {
        resource_id: resource.id || 'unknown',
        resource_title: title || resource.title || resource.filename || 'unknown',
        resource_type: resource.resourceType || 'unknown',
        grade: resource.grade || 'unknown',
        subject: resource.subject || 'unknown',
        language: language || 'unknown'
      });
    } catch (err) {
      console.error("Analytics error:", err);
    }

    if (!isDrive) {
      // For non-Drive links, let browser handle it (we still log the click above)
      return;
    }
    // For Drive links, open in new tab
    e.preventDefault();
    window.open(safeDownloadUrl, '_blank');
  };

  const handleView = () => {
    try {
      logEvent(analytics, 'resource_view', {
        resource_id: resource.id || 'unknown',
        resource_title: title || resource.title || resource.filename || 'unknown',
        resource_type: resource.resourceType || 'unknown',
        grade: resource.grade || 'unknown',
        subject: resource.subject || 'unknown',
        language: language || 'unknown'
      });
    } catch (err) {
      console.error("Analytics error:", err);
    }

    if (embedUrl) {
      window.open(embedUrl, '_blank', 'noopener,noreferrer');
    } else if (downloadUrl) {
      window.open(downloadUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      <div className={`resource-card-item ${className}`}>
        <div className="d-flex align-items-center justify-content-between p-2 border rounded">
          <div className="resource-info d-flex align-items-center flex-grow-1" style={{ minWidth: 0, overflow: 'hidden' }}>
            {(() => {
              const type = resource.resourceType || '';
              const mediaType = resource.mediaType || '';
              const url = resource.driveLink || resource.fileUrl || resource.url || '';
              
              let iconClass = 'bi-file-pdf text-danger';
              
              // Auto-detect from URL or collection type
              if (isYouTubeLink(url) || type === 'videos' || type === 'video' || mediaType === 'video') iconClass = 'bi-play-circle text-primary';
              else if (url.toLowerCase().match(/\.(mp3|wav|ogg|m4a)$/) || type === 'audio' || mediaType === 'audio') iconClass = 'bi-headphones text-success';
              else if (type === 'papers' || type === 'paper' || type.includes('paper')) iconClass = 'bi-file-earmark-text text-info';
              else if (type === 'notes' || type === 'note') iconClass = 'bi-journal-text text-warning';
              else if (type === 'textbooks' || type === 'textbook') iconClass = 'bi-book text-success';
              else if (type.includes('question')) iconClass = 'bi-patch-question text-warning';
              else if (mediaType === 'document') iconClass = 'bi-file-earmark-text text-info';
              
              return <i className={`bi ${iconClass} me-3`} style={{ fontSize: '1.5rem', flexShrink: 0 }}></i>;
            })()}
            <div className="flex-grow-1" style={{ minWidth: 0, overflow: 'hidden' }}>
              <h6 className="mb-0 small text-truncate w-100" title={title || resource.title || resource.filename || resource.name}>
                {title || resource.title || resource.filename || resource.name}
              </h6>
              {description && (
                <small className="text-muted d-block text-truncate w-100" style={{ fontSize: '0.75rem' }}>{description}</small>
              )}
              {showLanguageLabel && language && (
                <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>{t.languageLabel}: {language}</small>
              )}
            </div>
          </div>

          <div className="resource-actions d-flex gap-1 ms-3 align-items-center" style={{ flexShrink: 0, minWidth: 'fit-content' }}>
            {/* Standard User Actions */}
            {showViewButton && (embedUrl || downloadUrl || isYouTubeLink(resource.fileUrl || resource.url)) && (
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => {
                  const isAudio = resource.mediaType === 'audio' || (resource.fileUrl || resource.url || '').match(/\.(mp3|wav|ogg|m4a)$/i);
                  const isTelegram = (resource.fileUrl || resource.url || resource.driveLink || '').includes('t.me/');
                  
                  if (isYouTubeLink(resource.fileUrl || resource.url)) {
                    if (onPlayVideo) onPlayVideo(resource);
                    else handleView();
                  } else if (isAudio && !isTelegram) {
                    setIsPlayingAudio(!isPlayingAudio);
                  } else {
                    handleView();
                  }
                }}
                title={(resource.mediaType === 'audio' || (resource.fileUrl || resource.url || '').match(/\.(mp3|wav|ogg|m4a)$/i)) ? 'Listen/Play' : 'View'}
              >
                <i className={`bi ${isPlayingAudio ? 'bi-stop-fill' : ((resource.mediaType === 'audio' || (resource.fileUrl || resource.url || '').match(/\.(mp3|wav|ogg|m4a)$/i) || isYouTubeLink(resource.fileUrl || resource.url)) ? 'bi-play-fill' : 'bi-eye')}`}></i>
              </button>
            )}
            {showDownloadButton && !(resource.mediaType === 'video' || resource.mediaType === 'audio' || isYouTubeLink(resource.fileUrl || resource.url || '')) && (
              <a
                href={safeDownloadUrl}
                className={`btn btn-sm ${isManageMode ? 'btn-outline-secondary' : 'btn-primary'}`}
                onClick={handleDownload}
                target="_blank"
                rel="noopener noreferrer"
                download={!isDrive}
                title="Download"
              >
                <i className="bi bi-download"></i>
              </a>
            )}

            {/* Admin Management Actions */}
            {isManageMode && (
              <div className="admin-actions d-flex gap-1 border-start ps-2 ms-1">
                <button
                  className="btn btn-sm btn-info text-white"
                  onClick={() => onEdit && onEdit(resource)}
                  title="Edit Resource"
                >
                  <i className="bi bi-pencil"></i>
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={async () => {
                    if (window.confirm(`Are you sure you want to delete "${title || resource.title}"?`)) {
                      try {
                        if (onDelete) {
                          await onDelete(resource.id);
                        } else {
                          await deleteResource(resource.id);
                        }
                        toast.success('Deleted successfully');
                      } catch (err) {
                        toast.error('Failed to delete');
                      }
                    }
                  }}
                  title="Delete Resource"
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Inline Audio Player */}
        {isPlayingAudio && (
          <div className="audio-player-container mt-2 p-2 bg-light rounded border border-success animate-fade-in">
            {isDrive ? (
              <>
                <iframe 
                  src={embedUrl} 
                  title="Audio Player" 
                  className="w-100 rounded"
                  style={{ height: '140px', border: 'none' }}
                  allow="autoplay"
                ></iframe>
                <div className="text-end mt-1">
                  <button className="btn btn-sm btn-outline-danger py-0" style={{fontSize: '0.7rem'}} onClick={() => setIsPlayingAudio(false)}>Close Player</button>
                </div>
              </>
            ) : (
              <audio 
                controls 
                autoPlay 
                className="w-100" 
                style={{ height: '35px' }}
                onEnded={() => setIsPlayingAudio(false)}
              >
                <source src={safeDownloadUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}
          </div>
        )}


      </div>

      <style>{`
        .resource-card-item {
          transition: all 0.3s ease;
        }

        .resource-card-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          border-color: var(--primary);
        }
        
        .resource-card-item .border {
           transition: border-color 0.3s ease;
        }
      `}</style>
    </>
  );
};

export default React.memo(ResourceCard);

