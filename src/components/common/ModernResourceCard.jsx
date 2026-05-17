import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDownloadUrl, getEmbedUrl, isGoogleDriveLink } from '../../utils/googleDrive';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../features/ol';
import { logEvent } from 'firebase/analytics';
import { isYouTubeLink } from '../../utils/youtube';
import toast from 'react-hot-toast';
import { FileText, Play, Headphones, Book, HelpCircle, Eye, Download, Edit, Trash2, StopCircle } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';

const ModernResourceCard = ({
  resource,
  title,
  description,
  language,
  showLanguageLabel = false,
  showViewButton = true,
  showDownloadButton = true,
  className = '',
  onEdit,
  onDelete,
  onPlayVideo
}) => {
  const { isManageMode, analytics } = useAuth();
  const { deleteResource } = useData();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const driveLink = resource.driveLink || resource.downloadUrl || resource.url || resource.path || resource.fileUrl;
  const isDrive = isGoogleDriveLink(driveLink);
  const downloadUrl = (isDrive ? getDownloadUrl(driveLink) : driveLink) || '';
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
    } catch (err) {}
    if (!isDrive) return;
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
    } catch (err) {}
    if (embedUrl) {
      window.open(embedUrl, '_blank', 'noopener,noreferrer');
    } else if (downloadUrl) {
      window.open(downloadUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Determine Icon
  const type = resource.resourceType || '';
  const mediaType = resource.mediaType || '';
  const url = resource.driveLink || resource.fileUrl || resource.url || '';
  
  let Icon = FileText;
  let iconColor = 'text-danger';
  let iconBgColor = 'bg-danger/10';
  
  if (isYouTubeLink(url) || type === 'videos' || type === 'video' || mediaType === 'video') {
    Icon = Play;
    iconColor = 'text-primary';
    iconBgColor = 'bg-primary/10';
  } else if (url.toLowerCase().match(/\.(mp3|wav|ogg|m4a)$/) || type === 'audio' || mediaType === 'audio') {
    Icon = Headphones;
    iconColor = 'text-success';
    iconBgColor = 'bg-success/10';
  } else if (type === 'papers' || type === 'paper' || type.includes('paper') || mediaType === 'document') {
    Icon = FileText;
    iconColor = 'text-info';
    iconBgColor = 'bg-info/10';
  } else if (type === 'notes' || type === 'note') {
    Icon = Book;
    iconColor = 'text-warning';
    iconBgColor = 'bg-warning/10';
  } else if (type === 'textbooks' || type === 'textbook') {
    Icon = Book;
    iconColor = 'text-success';
    iconBgColor = 'bg-success/10';
  } else if (type.includes('question')) {
    Icon = HelpCircle;
    iconColor = 'text-warning';
    iconBgColor = 'bg-warning/10';
  }

  const isAudio = mediaType === 'audio' || url.match(/\.(mp3|wav|ogg|m4a|aac)$/i) || type === 'audio';
  const isYouTube = isYouTubeLink(url);
  const isTelegram = url.includes('t.me/');
  const finalTitle = title || resource.title || resource.filename || resource.name;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={cn("bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col", className)}
    >
      <div className="p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        {/* Resource Info */}
        <div className="flex items-start gap-3 flex-1 min-w-0 w-full">
          <div className={cn("p-2.5 rounded-xl flex-shrink-0", iconBgColor)}>
            <Icon className={cn("w-5 h-5 sm:w-6 sm:h-6", iconColor)} />
          </div>
          <div className="flex flex-col min-w-0 pt-0.5">
            <h6 className="font-semibold text-text-primary text-sm sm:text-base leading-tight truncate" title={finalTitle}>
              {finalTitle}
            </h6>
            {description && (
              <p className="text-xs text-text-muted line-clamp-1 mt-1" title={description}>
                {description}
              </p>
            )}
            {showLanguageLabel && language && (
              <span className="text-[10px] sm:text-xs font-medium text-text-muted bg-bg-secondary border border-border px-2 py-0.5 rounded-md w-fit mt-2">
                Language: {language}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-shrink-0 border-t sm:border-t-0 border-border pt-3 sm:pt-0 mt-1 sm:mt-0">
          {showViewButton && (embedUrl || downloadUrl || isYouTube) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (isYouTube) {
                  if (onPlayVideo) onPlayVideo(resource);
                  else handleView();
                } else if (isAudio && !isTelegram) {
                  setIsPlayingAudio(!isPlayingAudio);
                } else {
                  handleView();
                }
              }}
              title={isAudio ? 'Listen/Play' : 'View'}
              className="flex-1 sm:flex-none h-8 px-3 rounded-lg"
            >
              {isPlayingAudio ? <StopCircle className="w-4 h-4 sm:mr-1.5" /> : (isAudio || isYouTube ? <Play className="w-4 h-4 sm:mr-1.5" /> : <Eye className="w-4 h-4 sm:mr-1.5" />)}
              <span className="text-xs hidden sm:inline">{isAudio ? (isPlayingAudio ? 'Stop' : 'Play') : 'View'}</span>
            </Button>
          )}

          {showDownloadButton && !isYouTube && !isAudio && (
            <a
              href={safeDownloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={!isDrive}
              title="Download"
              onClick={handleDownload}
              className={cn(
                "inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium transition-colors flex-1 sm:flex-none",
                "border border-primary text-primary hover:bg-primary-light"
              )}
            >
              <Download className="w-4 h-4 sm:mr-0" />
              <span className="hidden sm:inline">Download</span>
            </a>
          )}

          {isManageMode && (
            <div className="flex items-center gap-1 pl-2 ml-1 border-l border-border">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit && onEdit(resource)}
                title="Edit"
                className="h-8 w-8 text-info hover:text-info hover:bg-info/10 rounded-lg"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={async () => {
                  if (window.confirm(`Are you sure you want to delete "${finalTitle}"?`)) {
                    try {
                      if (onDelete) await onDelete(resource.id);
                      else await deleteResource(resource.id);
                      toast.success('Deleted successfully');
                    } catch (err) {
                      toast.error('Failed to delete');
                    }
                  }
                }}
                title="Delete"
                className="h-8 w-8 text-danger hover:text-danger hover:bg-danger/10 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Inline Audio Player */}
      <AnimatePresence>
        {isPlayingAudio && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border bg-bg-secondary/30"
          >
            <div className="p-3">
              {isDrive ? (
                <div className="flex flex-col gap-2">
                  <iframe 
                    src={embedUrl} 
                    title="Audio Player" 
                    className="w-full rounded-lg border border-border bg-card"
                    style={{ height: '140px' }}
                    allow="autoplay"
                  />
                  <Button variant="ghost" size="sm" onClick={() => setIsPlayingAudio(false)} className="self-end text-xs h-7 text-danger hover:bg-danger/10">
                    Close Player
                  </Button>
                </div>
              ) : (
                <audio 
                  controls 
                  autoPlay 
                  className="w-full h-10 rounded-md" 
                  onEnded={() => setIsPlayingAudio(false)}
                >
                  <source src={safeDownloadUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default React.memo(ModernResourceCard);
