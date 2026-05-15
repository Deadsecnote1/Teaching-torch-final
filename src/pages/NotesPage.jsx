import React, { useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import { useGradePage } from '../hooks/useGradePage';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import ModernResourceCard from '../components/common/ModernResourceCard';
import ResourceEditorModal from '../components/admin/ResourceEditorModal';
import MetadataEditorModal from '../components/admin/MetadataEditorModal';
import { subjectTranslations } from '../utils/subjectTranslations';
import { getResourceTypeName } from '../utils/resourceTranslations';
import AdSenseComponent from '../components/common/AdSenseComponent';
import { getLucideIcon } from '../utils/iconUtils';
import toast from 'react-hot-toast';
import { ChevronRight, ArrowLeft, Edit, Trash2, Plus, StickyNote, Search, Download } from 'lucide-react';
import { Container, Section, Grid } from '../components/ui/Layout';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { cn } from '../utils/cn';

const NotesPage = () => {
  const { gradeId, streamId, subjectId: paramSubjectId } = useParams();
  const [searchParams] = useSearchParams();
  const selectedSubjectId = paramSubjectId || searchParams.get('subject');
  const { grade: rawGrade, subjects, isLoading, isGradeMissing } = useGradePage(streamId || gradeId);
  const { updateSubject, deleteSubject, grades } = useData();
  const { selectedLanguage, setLanguage, shouldShowResource, languages } = useLanguage();
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

  if (isLoading) {
    return (
      <Container className="py-20 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-text-muted">Loading notes...</p>
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

  const formatChapterName = (chapterKey) => {
    if (chapterKey.includes('_')) {
      const baseName = chapterKey.split('_')[0];
      if (baseName.startsWith('ch')) {
        return `Chapter ${baseName.replace('ch', '')}`;
      }
      return baseName.charAt(0).toUpperCase() + baseName.slice(1).replace('-', ' ');
    }
    if (chapterKey.startsWith('ch')) {
      return `Chapter ${chapterKey.replace('ch', '')}`;
    }
    return chapterKey.charAt(0).toUpperCase() + chapterKey.slice(1).replace('-', ' ');
  };

  const NotesGrid = ({ notes, onEdit, subjectData }) => {
    if (!notes || Object.keys(notes).length === 0) {
      return (
        <div className="text-center py-10">
          <StickyNote className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-30" />
          <h5 className="text-lg font-medium text-text-primary mb-2">No notes available</h5>
          <p className="text-sm text-text-muted">Short notes for this subject haven't been added yet.</p>
        </div>
      );
    }

    const filteredNotes = Object.entries(notes).filter(([noteKey, note]) => shouldShowResource(note));

    if (filteredNotes.length === 0) {
      return (
        <div className="text-center py-10">
          <Search className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-30" />
          <h5 className="text-lg font-medium text-text-primary mb-2">No notes found</h5>
          <p className="text-sm text-text-muted">
            No notes available in {languages[selectedLanguage]?.display || 'the selected language'} for this subject.
          </p>
        </div>
      );
    }

    return (
      <Grid cols={2} gap={4} className="mt-4">
        {filteredNotes.map(([noteKey, note]) => (
          <div key={noteKey} className="col-span-1 h-full">
            {note.driveLink || note.url ? (
              <ModernResourceCard
                resource={{ ...note, driveLink: note.driveLink || note.url || note.path }}
                title={formatChapterName(note.chapter || noteKey)}
                description={note.filename}
                showViewButton={true}
                showDownloadButton={true}
                onEdit={onEdit}
                className="h-full"
              />
            ) : (
              <Card className="h-full flex flex-col p-5 border-border hover:border-primary/40 transition-all shadow-sm">
                 <div className="flex-1 mb-4">
                   <h6 className="font-bold text-text-primary mb-1.5">{formatChapterName(note.chapter || noteKey)}</h6>
                   <p className="text-xs text-text-muted line-clamp-2">{note.filename}</p>
                 </div>
                 <a 
                   href={`/${note.path}`} 
                   download 
                   className="inline-flex items-center justify-center gap-2 w-full py-2 px-4 rounded-md text-sm font-medium border border-border bg-bg-secondary text-text-primary hover:bg-bg-tertiary transition-colors"
                 >
                    <Download className="w-4 h-4" /> Download Notes
                 </a>
              </Card>
            )}
          </div>
        ))}
      </Grid>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      {/* Header */}
      <header className="bg-bg-secondary border-b border-border py-12">
        <Container className="text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight mb-3">{grade.display} Study Notes</h1>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">Chapter-wise summaries and study materials</p>
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
            <span className="text-text-primary font-semibold">{getResourceTypeName('notes', selectedLanguage)}</span>
          </nav>
        </Container>
      </div>

      <Container className="mt-6">
        <AdSenseComponent slot="NOTES_HEADER_AD_SLOT" />
      </Container>

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
            const notes = subject.resources.notes || {};
            
            if (selectedSubjectId && subjectId !== selectedSubjectId) return null;
            if (!Object.values(notes).some(note => shouldShowResource(note))) return null;

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
                        <p className="text-sm text-text-muted mt-1">Chapter-wise short notes</p>
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
                    <NotesGrid notes={notes} onEdit={setEditingResource} subjectData={subject} />

                    {isManageMode && (
                      <Button 
                        variant="outline" 
                        className="w-full mt-6 border-dashed border-2 hover:bg-success/5 hover:text-success hover:border-success h-12 rounded-xl"
                        onClick={() => {
                          setAddModalInitialData({ grade: gradeId, subject: subjectId, resourceType: 'notes', languages: ['sinhala', 'tamil', 'english'] });
                          setIsAddModalOpen(true);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" /> Add New Note
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
            <StickyNote className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-30" />
            <h4 className="text-xl font-bold text-text-primary mb-2">No notes available</h4>
            <p className="text-text-muted">Short notes for this grade haven't been added yet.</p>
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