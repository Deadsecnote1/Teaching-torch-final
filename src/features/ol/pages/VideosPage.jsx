import React, { useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import { useGradePage } from '../hooks/useGradePage';
import { useLanguage } from '../../../context/LanguageContext';
import { useAuth } from '../../../context/AuthContext';
import ModernResourceCard from '../../../components/common/ModernResourceCard';
import ResourceEditorModal from '../../../components/admin/ResourceEditorModal';
import MetadataEditorModal from '../../../components/admin/MetadataEditorModal';
import { extractYouTubeId, getYouTubeThumbnail, isYouTubeLink } from '../../../utils/youtube';
import { getEmbedUrl, isGoogleDriveLink } from '../../../utils/googleDrive';
import { subjectTranslations } from '../../../utils/subjectTranslations';
import { getResourceTypeName } from '../../../utils/resourceTranslations';
import { logEvent } from 'firebase/analytics';
import AdSenseComponent from '../../../components/common/AdSenseComponent';
import { getLucideIcon } from '../../../utils/iconUtils';
import toast from 'react-hot-toast';
import { ChevronRight, ArrowLeft, Edit, Trash2, Plus, Video, Play, X, Search, Calendar, Bookmark } from 'lucide-react';
import { Container, Section, Grid } from '../../../components/ui/Layout';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { cn } from '../../../utils/cn';

const VideosPage = () => {
  const { gradeId, streamId, subjectId: paramSubjectId } = useParams();
  const [searchParams] = useSearchParams();
  const selectedSubjectId = paramSubjectId || searchParams.get('subject');
  const { grade: rawGrade, subjects, isLoading, isGradeMissing } = useGradePage(streamId || gradeId);
  const { updateSubject, deleteSubject, grades } = useData();
  const { selectedLanguage, setLanguage, shouldShowResource, getLanguageIndicator, languages } = useLanguage();
  const { isManageMode, analytics } = useAuth();
  
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
      <Container className="py-20 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-text-muted">Loading videos...</p>
      </Container>
    );
  }

  if (isGradeMissing) {
    return (
      <Container className="py-20 text-center min-h-[50vh] flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-text-primary mb-4">Grade Not Found</h2>
        <p className="text-text-muted mb-8">The requested grade does not exist.</p>
        <Link to="/" className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg font-medium transition-colors bg-primary text-white hover:bg-primary-dark">
          Go Home
        </Link>
      </Container>
    );
  }

  const handlePlayVideo = (video, videoUrl) => {
    try {
      if (analytics) {
        logEvent(analytics, 'video_play', {
          video_id: video.id || 'unknown',
          video_title: video.title || 'unknown',
          grade: gradeId || 'unknown',
          language: video.language || 'unknown'
        });
      }
    } catch (err) {}

    const youtubeId = extractYouTubeId(videoUrl);
    if (youtubeId) {
      setActiveVideo({ title: video.title, embedUrl: `https://www.youtube.com/embed/${youtubeId}?autoplay=1` });
      setShowPlayer(true);
      return;
    }
    if (isGoogleDriveLink(videoUrl)) {
      const embedUrl = getEmbedUrl(videoUrl);
      if (embedUrl) {
        setActiveVideo({ title: video.title, embedUrl });
        setShowPlayer(true);
        return;
      }
    }
    window.open(videoUrl, '_blank', 'noopener,noreferrer');
  };

  const VideosGrid = ({ videos, onEdit }) => {
    if (!videos || videos.length === 0) {
      return (
        <div className="text-center py-10">
          <Video className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-30" />
          <h5 className="text-lg font-medium text-text-primary mb-2">No video lessons available</h5>
          <p className="text-sm text-text-muted">Video lessons for this subject haven't been added yet.</p>
        </div>
      );
    }

    const filteredVideos = videos.filter(video => shouldShowResource(video));

    if (filteredVideos.length === 0) {
      return (
        <div className="text-center py-10">
          <Search className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-30" />
          <h5 className="text-lg font-medium text-text-primary mb-2">No videos found</h5>
          <p className="text-sm text-text-muted">No video lessons available in {languages[selectedLanguage]?.display || 'the selected language'} for this subject.</p>
        </div>
      );
    }

    return (
      <Grid cols={3} gap={6} className="mt-4">
        {filteredVideos.map((video, index) => {
          const videoUrl = video.driveLink || video.url || video.youtubeUrl;
          const thumbnail = getYouTubeThumbnail(videoUrl);

          return (
            <div key={video.id || index} className="col-span-1 h-full">
              <Card className="h-full flex flex-col border-border hover:border-primary/50 transition-all shadow-sm overflow-hidden group">
                <div 
                  className="relative h-48 bg-bg-secondary cursor-pointer overflow-hidden"
                  onClick={() => handlePlayVideo(video, videoUrl)}
                >
                  {thumbnail ? (
                    <img src={thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="w-16 h-16 text-text-muted opacity-20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-danger text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md flex items-center gap-1.5 font-medium">
                      <span className="w-2 h-2 rounded-full" style={getLanguageIndicator(video.language || video.languages?.[0]).style}></span>
                      {video.language || video.languages?.[0]}
                    </span>
                  </div>
                </div>

                <div className="flex-1 p-4 flex flex-col">
                  <h6 className="font-bold text-text-primary line-clamp-2 mb-2">{video.title}</h6>
                  
                  {video.chapter && (
                    <div className="flex items-center text-xs text-text-muted mb-2">
                      <Bookmark className="w-3.5 h-3.5 mr-1" /> {video.chapter}
                    </div>
                  )}
                  {video.description && (
                    <p className="text-xs text-text-muted line-clamp-2 mb-3">{video.description}</p>
                  )}
                  
                  <div className="mt-auto pt-3 flex items-center justify-between text-xs text-text-muted border-t border-border/50">
                    <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" /> {video.addedDate ? new Date(video.addedDate).toLocaleDateString() : 'Recently'}</span>
                  </div>

                  {isManageMode && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <ModernResourceCard resource={video} title={video.title} description={video.chapter ? `Chapter: ${video.chapter}` : ''} showViewButton={false} showDownloadButton={false} onEdit={onEdit} />
                    </div>
                  )}
                </div>
              </Card>
            </div>
          );
        })}
      </Grid>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      {/* Header */}
      <header className="bg-bg-secondary border-b border-border py-12">
        <Container className="text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight mb-3">{grade.display} Video Lessons</h1>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">Curated educational videos and tutorials</p>
          </motion.div>
        </Container>
      </header>

      {/* Language Switcher */}
      <div className="bg-bg-primary border-b border-border sticky top-[64px] sm:top-[64px] z-40 shadow-sm backdrop-blur-md bg-opacity-90">
        <Container className="py-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Select Content Medium:</span>
            <div className="flex bg-bg-secondary p-1.5 rounded-xl shadow-inner border border-border">
              {['sinhala', 'tamil', 'english'].map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={cn(
                    "px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2",
                    selectedLanguage === lang 
                      ? "bg-card text-text-primary shadow-sm border border-border" 
                      : "text-text-muted hover:text-text-primary hover:bg-bg-tertiary"
                  )}
                >
                  <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: languages[lang].color }}></span>
                  {languages[lang].display}
                </button>
              ))}
            </div>
          </div>
        </Container>
      </div>

      {/* Breadcrumb */}
      <div className="bg-bg-secondary/50 border-b border-border">
        <Container className="py-3">
          <nav className="flex items-center text-sm font-medium text-text-muted whitespace-nowrap overflow-x-auto no-scrollbar">
            <Link to="/" className="hover:text-primary transition-colors flex items-center">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0 opacity-40" />
            {parentGrade && (
              <>
                <Link to={`/grade/${gradeId}`} className="hover:text-primary transition-colors flex items-center">{parentGrade.display}</Link>
                <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0 opacity-40" />
              </>
            )}
            <Link to={streamId ? `/grade/${gradeId}/${streamId}` : `/grade/${gradeId}`} className="hover:text-primary transition-colors flex items-center">{grade.display}</Link>
            <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0 opacity-40" />
            {subject && (
              <>
                <Link to={`/grade/${gradeId}/${streamId}/${selectedSubjectId}`} className="hover:text-primary transition-colors flex items-center">{subject.display}</Link>
                <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0 opacity-40" />
              </>
            )}
            <span className="text-text-primary font-semibold">{getResourceTypeName('videos', selectedLanguage)}</span>
          </nav>
        </Container>
      </div>

      {/* Content */}
      <Section className="flex-1 pt-8">
        <div className="flex flex-col gap-8">
          {Object.keys(subjects).filter(subjectId => {
            if (subjectId === 'standalone') return false;
            const subject = subjects[subjectId];
            if (subject.languages && subject.languages.length > 0) {
              return subject.languages.includes(selectedLanguage);
            }
            return true;
          }).map((subjectId, index) => {
            const subject = subjects[subjectId];
            const videos = subject.videos || [];
            
            if (selectedSubjectId && subjectId !== selectedSubjectId) return null;
            if (!videos.some(video => shouldShowResource(video))) return null;

            return (
              <motion.div
                key={subjectId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="flex flex-col border-border hover:border-primary/30 transition-colors shadow-sm overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-bg-secondary/40 pb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-bg-primary shadow-sm border border-border flex items-center justify-center">
                        {getLucideIcon(subject.icon, "text-2xl text-primary")}
                      </div>
                      <div>
                        <CardTitle className="text-xl">
                          {subjectTranslations.getTranslatedName(subjectId, subject, selectedLanguage)}
                        </CardTitle>
                        <p className="text-sm text-text-muted mt-1">Educational video lessons</p>
                      </div>
                    </div>

                    {isManageMode && (
                      <div className="flex gap-1 bg-card rounded-lg border border-border p-1 shadow-sm">
                        <Button size="icon" variant="ghost" onClick={() => setMetadataModal({ isOpen: true, initialData: subject, type: 'subject', key: subjectId })} className="h-8 w-8 text-info hover:bg-info/10">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => {
                          if (window.confirm(`Are you sure you want to delete "${subject.name}"?`)) {
                            deleteSubject(subjectId);
                            toast.success('Subject Deleted');
                          }
                        }} className="h-8 w-8 text-danger hover:bg-danger/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  
                  <CardContent className="p-5 bg-bg-primary">
                    <VideosGrid videos={videos} onEdit={setEditingResource} />

                    {isManageMode && (
                      <Button 
                        variant="outline" 
                        className="w-full mt-6 border-dashed border-2 hover:bg-success/5 hover:text-success hover:border-success h-12 rounded-xl"
                        onClick={() => {
                          setAddModalInitialData({ grade: gradeId, subject: subjectId, resourceType: 'videos', languages: ['sinhala', 'tamil', 'english'] });
                          setIsAddModalOpen(true);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" /> Add New Video
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {Object.keys(subjects).length === 0 && (
          <div className="text-center py-20">
            <Video className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-30" />
            <h4 className="text-xl font-bold text-text-primary mb-2">No video lessons available</h4>
            <p className="text-text-muted">Video lessons for this grade haven't been added yet.</p>
          </div>
        )}
      </Section>

      <div className="bg-bg-secondary border-t border-border py-8 text-center mt-auto">
        <Link 
          to={`/grade/${gradeId}`} 
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg font-medium transition-colors border border-border bg-card text-text-primary hover:bg-bg-tertiary shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to {grade.display} Overview
        </Link>
      </div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {showPlayer && activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6"
            onClick={() => setShowPlayer(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-border bg-bg-secondary">
                <h5 className="font-bold text-text-primary flex items-center gap-2">
                  <Play className="w-5 h-5 text-danger" />
                  {activeVideo.title}
                </h5>
                <button onClick={() => setShowPlayer(false)} className="p-2 rounded-full hover:bg-bg-tertiary text-text-muted hover:text-text-primary transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="aspect-video bg-black">
                <iframe
                  title={activeVideo.title}
                  src={activeVideo.embedUrl}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ResourceEditorModal
        resource={editingResource || addModalInitialData}
        isOpen={!!editingResource || isAddModalOpen}
        onClose={() => {
          setEditingResource(null);
          setIsAddModalOpen(false);
          setAddModalInitialData(null);
        }}
      />

      <MetadataEditorModal
        isOpen={metadataModal.isOpen}
        onClose={() => setMetadataModal({ ...metadataModal, isOpen: false })}
        onSave={async (updatedData) => {
          try {
            await updateSubject(metadataModal.key, updatedData);
            toast.success('Subject Updated');
          } catch {
            toast.error('Failed to update subject');
          }
        }}
        title="Edit Subject"
        initialData={metadataModal.initialData}
        type="subject"
      />
    </div>
  );
};

export default VideosPage;