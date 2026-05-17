import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import { useGradePage } from '../hooks/useGradePage';
import { useLanguage } from '../../../context/LanguageContext';
import { useAuth } from '../../../context/AuthContext';
import ModernResourceCard from '../../../components/common/ModernResourceCard';
import ResourceEditorModal from '../../../components/admin/ResourceEditorModal';
import MetadataEditorModal from '../../../components/admin/MetadataEditorModal';
import { subjectTranslations } from '../../../utils/subjectTranslations';
import { getResourceTypeName } from '../../../utils/resourceTranslations';
import AdSenseComponent from '../../../components/common/AdSenseComponent';
import { getLucideIcon } from '../../../utils/iconUtils';
import toast from 'react-hot-toast';
import { ChevronRight, ArrowLeft, Cloud, Edit, Trash2, Download, MinusCircle, Plus, FileText, ArrowUp } from 'lucide-react';
import { Container, Section, Grid } from '../../../components/ui/Layout';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { cn } from '../../../utils/cn';

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

  const uploadedFiles = useMemo(() => {
    if (!subjects) return [];
    const allTextbooks = [];
    Object.values(subjects).forEach(subject => {
      if (subject.resources && subject.resources.textbooks) {
        Object.values(subject.resources.textbooks).forEach(tbArray => {
          if (Array.isArray(tbArray)) allTextbooks.push(...tbArray);
          else allTextbooks.push(tbArray);
        });
      }
    });
    return allTextbooks;
  }, [subjects]);

  const getTextbooksBySubject = () => {
    const groupedTextbooks = {};
    if (subjects) {
      Object.entries(subjects).forEach(([subjectId, subjectData]) => {
        if (subjectData.resources && subjectData.resources.textbooks) {
          const textbooksObj = subjectData.resources.textbooks;
          groupedTextbooks[subjectId] = {};
          Object.entries(textbooksObj).forEach(([lang, dataArray]) => {
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
      <Container className="py-20 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-text-muted">Loading textbooks...</p>
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

  const UploadedTextbookDownload = ({ files, language, onEdit }) => {
    if (!files || files.length === 0) {
      return (
        <div className="text-center py-8">
          <FileText className="w-10 h-10 text-text-muted mx-auto mb-3 opacity-30" />
          <p className="text-sm text-text-muted font-medium">No textbook available</p>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-3 p-2">
        {files.map((file, index) => (
          <ModernResourceCard
            key={file.id || index}
            resource={file}
            title={file.title || file.name || file.originalName}
            description={file.description}
            language={language}
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

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      {/* Header */}
      <header className="bg-bg-secondary border-b border-border py-12">
        <Container className="text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight mb-3">{grade.display} Textbooks</h1>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">Official Government textbooks in your preferred medium</p>
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
            
            <span className="text-text-primary font-semibold">{getResourceTypeName('textbooks', selectedLanguage)}</span>
          </nav>
        </Container>
      </div>

      <Container className="mt-6">
        <AdSenseComponent slot="TEXTBOOKS_HEADER_AD_SLOT" />
      </Container>

      {/* Upload Status */}
      {uploadedFiles.length > 0 && (
        <Container className="mt-6">
          <div className="bg-success/5 border border-success/20 rounded-xl p-3 text-center shadow-sm">
            <span className="text-success text-sm font-semibold flex items-center justify-center gap-2">
              <Cloud className="w-4 h-4" />
              <span>{uploadedFiles.length} uploaded textbook{uploadedFiles.length !== 1 ? 's' : ''} available for {grade.display}</span>
            </span>
          </div>
        </Container>
      )}

      {/* Content */}
      <Section className="flex-1 pt-8">
        <Grid cols={2} gap={8}>
          {Object.entries(allSubjects).map(([subjectId, subject], index) => {
            const uploadedSubjectTextbooks = uploadedTextbooks[subjectId] || {};

            return (
              <motion.div
                key={subjectId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="flex flex-col h-full border-border hover:border-primary/40 transition-colors shadow-sm overflow-hidden group">
                  <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-bg-secondary/40 pb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-bg-primary shadow-sm border border-border flex items-center justify-center group-hover:scale-105 transition-transform">
                        {getLucideIcon(subject.icon, "text-2xl text-primary")}
                      </div>
                      <CardTitle className="text-xl">
                        {subjectTranslations.getTranslatedName(subjectId, subject, selectedLanguage)}
                      </CardTitle>
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
                  
                  <CardContent className="flex-1 flex flex-col gap-5 p-5 bg-bg-primary">
                    {/* Sinhala */}
                    {shouldShowResource('sinhala') && (
                      <div className="border border-danger/20 rounded-xl overflow-hidden bg-bg-secondary shadow-sm">
                        <div className="bg-danger/10 text-danger text-xs font-bold uppercase tracking-wider py-2.5 px-4 flex items-center gap-2 border-b border-danger/10">
                          <Download className="w-4 h-4" /> Sinhala Medium
                        </div>
                        <div className="max-h-72 overflow-y-auto custom-scrollbar bg-card">
                          <UploadedTextbookDownload files={uploadedSubjectTextbooks.sinhala} language="sinhala" onEdit={setEditingResource} />
                        </div>
                      </div>
                    )}

                    {/* Tamil */}
                    {shouldShowResource('tamil') && (
                      <div className="border rounded-xl overflow-hidden bg-bg-secondary shadow-sm" style={{ borderColor: 'var(--tamil)' }}>
                        <div className="text-xs font-bold uppercase tracking-wider py-2.5 px-4 flex items-center gap-2 border-b" style={{ backgroundColor: 'rgba(230, 81, 0, 0.1)', color: 'var(--tamil)', borderColor: 'rgba(230, 81, 0, 0.1)' }}>
                          <Download className="w-4 h-4" /> Tamil Medium
                        </div>
                        <div className="max-h-72 overflow-y-auto custom-scrollbar bg-card">
                          <UploadedTextbookDownload files={uploadedSubjectTextbooks.tamil} language="tamil" onEdit={setEditingResource} />
                        </div>
                      </div>
                    )}

                    {/* English */}
                    {shouldShowResource('english') && (
                      <div className="border border-primary/20 rounded-xl overflow-hidden bg-bg-secondary shadow-sm">
                        <div className="bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider py-2.5 px-4 flex items-center gap-2 border-b border-primary/10">
                          <Download className="w-4 h-4" /> English Medium
                        </div>
                        <div className="max-h-72 overflow-y-auto custom-scrollbar bg-card">
                          <UploadedTextbookDownload files={uploadedSubjectTextbooks.english} language="english" onEdit={setEditingResource} />
                        </div>
                      </div>
                    )}

                    {isManageMode && (
                      <Button 
                        variant="outline" 
                        className="w-full mt-auto border-dashed border-2 hover:bg-success/5 hover:text-success hover:border-success h-12 rounded-xl"
                        onClick={() => {
                          setAddModalInitialData({ grade: gradeId, subject: subjectId, resourceType: 'textbooks', languages: ['sinhala', 'tamil', 'english'] });
                          setIsAddModalOpen(true);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" /> Add New Textbook
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </Grid>

        {gradeId === 'al' && (
          <div className="text-center py-24">
            <ArrowUp className="w-16 h-16 text-text-muted mx-auto mb-6 opacity-40 animate-bounce" />
            <h4 className="text-2xl font-bold text-text-primary mb-3">Select a Stream</h4>
            <p className="text-text-muted max-w-md mx-auto">Please select your A/L stream from the navigation above to view available textbooks.</p>
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

export default TextbooksPage;