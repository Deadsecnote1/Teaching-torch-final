import React, { useState } from 'react';
import { getDownloadUrl, getEmbedUrl, isGoogleDriveLink } from '../../utils/googleDrive';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../features/ol';
import { logEvent } from 'firebase/analytics';
import { extractYouTubeId, isYouTubeLink } from '../../utils/youtube';
import toast from 'react-hot-toast';
import { 
  FileText, PlayCircle, Headphones, Book, HelpCircle, File, 
  Download, Eye, Square, Play, Pencil, Trash2 
} from 'lucide-react';

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
  const { isManageMode, analytics } = useAuth();
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
      if (analytics) {
        logEvent(analytics, 'resource_download', {
          resource_id: resource.id || 'unknown',
          resource_title: title || resource.title || resource.filename || 'unknown',
          resource_type: resource.resourceType || 'unknown',
          grade: resource.grade || 'unknown',
          subject: resource.subject || 'unknown',
          language: language || 'unknown'
        });
      }
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
      if (analytics) {
        logEvent(analytics, 'resource_view', {
          resource_id: resource.id || 'unknown',
          resource_title: title || resource.title || resource.filename || 'unknown',
          resource_type: resource.resourceType || 'unknown',
          grade: resource.grade || 'unknown',
          subject: resource.subject || 'unknown',
          language: language || 'unknown'
        });
      }
    } catch (err) {
      console.error("Analytics error:", err);
    }

    if (embedUrl) {
      window.open(embedUrl, '_blank', 'noopener,noreferrer');
    } else if (downloadUrl) {
      window.open(downloadUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const type = resource.resourceType || '';
  const mediaType = resource.mediaType || '';
  const url = resource.driveLink || resource.fileUrl || resource.url || '';
  
  let IconComponent = FileText;
  let iconColor = 'text-danger';
  
  // Auto-detect from URL or collection type
  if (isYouTubeLink(url) || type === 'videos' || type === 'video' || mediaType === 'video') {
    IconComponent = PlayCircle;
    iconColor = 'text-primary';
  } else if (url.toLowerCase().match(/\.(mp3|wav|ogg|m4a)$/) || type === 'audio' || mediaType === 'audio') {
    IconComponent = Headphones;
    iconColor = 'text-success';
  } else if (type === 'papers' || type === 'paper' || type.includes('paper')) {
    IconComponent = FileText;
    iconColor = 'text-info';
  } else if (type === 'notes' || type === 'note') {
    IconComponent = FileText;
    iconColor = 'text-warning';
  } else if (type === 'textbooks' || type === 'textbook') {
    IconComponent = Book;
    iconColor = 'text-success';
  } else if (type.includes('question')) {
    IconComponent = HelpCircle;
    iconColor = 'text-warning';
  } else if (mediaType === 'document') {
    IconComponent = FileText;
    iconColor = 'text-info';
  } else {
    IconComponent = File;
  }

  const isAudio = resource.mediaType === 'audio' || 
                  (resource.fileUrl || resource.url || '').match(/\.(mp3|wav|ogg|m4a|aac)$/i) ||
                  resource.resourceType === 'audio';

  return (
    <div className={`transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-primary border border-border bg-bg-secondary rounded-lg ${className}`}>
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center flex-grow min-w-0 overflow-hidden">
          <div className="mr-4 flex-shrink-0">
            <IconComponent className={`w-6 h-6 ${iconColor}`} />
          </div>
          <div className="flex-grow min-w-0 overflow-hidden">
            <h6 className="mb-0 text-sm font-semibold text-text-primary truncate" title={title || resource.title || resource.filename || resource.name}>
              {title || resource.title || resource.filename || resource.name}
            </h6>
            {description && (
              <small className="text-xs text-text-muted block truncate mt-0.5">{description}</small>
            )}
            {showLanguageLabel && language && (
              <small className="text-[11px] text-text-muted block mt-0.5">{t.languageLabel}: {language}</small>
            )}
          </div>
        </div>

        <div className="flex gap-2 ml-4 items-center flex-shrink-0 min-w-fit">
          {/* Standard User Actions */}
          {showViewButton && (embedUrl || downloadUrl || isYouTubeLink(resource.fileUrl || resource.url)) && (
            <button
              className="p-1.5 text-primary hover:bg-primary hover:text-white border border-primary rounded-md transition-colors flex items-center justify-center"
              onClick={() => {
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
              title={isAudio ? 'Listen/Play' : 'View'}
            >
              {isPlayingAudio ? (
                <Square className="w-4 h-4 fill-current" />
              ) : isAudio || isYouTubeLink(resource.fileUrl || resource.url) ? (
                <Play className="w-4 h-4 fill-current" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}
          {showDownloadButton && !(resource.mediaType === 'video' || resource.mediaType === 'audio' || isYouTubeLink(resource.fileUrl || resource.url || '')) && (
            <a
              href={safeDownloadUrl}
              className={`p-1.5 border rounded-md transition-colors flex items-center justify-center ${isManageMode ? 'text-text-muted border-border hover:bg-bg-tertiary' : 'text-primary border-primary hover:bg-primary hover:text-white'}`}
              onClick={handleDownload}
              target="_blank"
              rel="noopener noreferrer"
              download={!isDrive}
              title="Download"
            >
              <Download className="w-4 h-4" />
            </a>
          )}

          {/* Admin Management Actions */}
          {isManageMode && (
            <div className="flex gap-2 border-l border-border pl-3 ml-1">
              <button
                className="p-1.5 text-info hover:bg-info hover:text-white border border-info/30 rounded-md transition-colors flex items-center justify-center"
                onClick={() => onEdit && onEdit(resource)}
                title="Edit Resource"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                className="p-1.5 text-danger hover:bg-danger hover:text-white border border-danger/30 rounded-md transition-colors flex items-center justify-center"
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
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Inline Audio Player */}
      {isPlayingAudio && (
        <div className="mt-2 p-3 bg-bg-tertiary rounded-b-lg border-t border-success/30 animate-fade-in">
          {isDrive ? (
            <>
              <iframe 
                src={embedUrl} 
                title="Audio Player" 
                className="w-full rounded-md"
                style={{ height: '140px', border: 'none' }}
                allow="autoplay"
              ></iframe>
              <div className="text-right mt-2">
                <button 
                  className="px-3 py-1 text-xs font-medium text-danger border border-danger/50 rounded hover:bg-danger/10 transition-colors"
                  onClick={() => setIsPlayingAudio(false)}
                >
                  Close Player
                </button>
              </div>
            </>
          ) : (
            <audio 
              controls 
              autoPlay 
              className="w-full h-10" 
              onEnded={() => setIsPlayingAudio(false)}
            >
              <source src={safeDownloadUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(ResourceCard);
