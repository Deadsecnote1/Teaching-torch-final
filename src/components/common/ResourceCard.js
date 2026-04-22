import React from 'react';
import { getDownloadUrl, getEmbedUrl, isGoogleDriveLink } from '../../utils/googleDrive';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import toast from 'react-hot-toast';

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
  onEdit // New prop for centralized editing
}) => {
  const { isManageMode } = useAuth();
  const { deleteResource } = useData();


  const t = { languageLabel: 'Language', deleteConfirm: 'Are you sure you want to delete' };

  // Support both Google Drive links and regular URLs
  const driveLink = resource.driveLink || resource.downloadUrl || resource.url || resource.path;
  const isDrive = isGoogleDriveLink(driveLink);

  const downloadUrl = isDrive ? getDownloadUrl(driveLink) : driveLink;
  const embedUrl = isDrive ? getEmbedUrl(driveLink) : null;

  const handleDownload = (e) => {
    if (!isDrive) {
      // For non-Drive links, let browser handle it
      return;
    }
    // For Drive links, open in new tab
    e.preventDefault();
    window.open(downloadUrl, '_blank');
  };

  const handleView = () => {
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
              let iconClass = 'bi-file-pdf text-danger';
              if (type === 'videos' || type === 'video') iconClass = 'bi-play-circle text-primary';
              else if (type === 'papers' || type === 'paper' || type.includes('paper')) iconClass = 'bi-file-earmark-text text-info';
              else if (type === 'notes' || type === 'note') iconClass = 'bi-journal-text text-warning';
              else if (type === 'textbooks' || type === 'textbook') iconClass = 'bi-book text-success';
              else if (type.includes('question')) iconClass = 'bi-patch-question text-warning';
              
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

          <div className="resource-actions d-flex gap-1 ms-3 align-items-center" style={{ flexShrink: 0 }}>
            {/* Standard User Actions */}
            {showViewButton && (embedUrl || downloadUrl) && (
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={handleView}
                title="View PDF"
              >
                <i className="bi bi-eye"></i>
              </button>
            )}
            {showDownloadButton && (
              <a
                href={downloadUrl}
                className={`btn btn-sm ${isManageMode ? 'btn-outline-secondary' : 'btn-primary'}`}
                onClick={handleDownload}
                target="_blank"
                rel="noopener noreferrer"
                download={!isDrive}
                title="Download PDF"
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
                        await deleteResource(resource.id);
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

export default ResourceCard;

