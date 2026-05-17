import React, { useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
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
import { ChevronRight, ArrowLeft, Edit, Trash2, Plus, Search, Calendar, BookOpen, FileText } from 'lucide-react';
import { Container, Section, Grid } from '../../../components/ui/Layout';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { cn } from '../../../utils/cn';

const PapersPage = () => {
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
        <p className="mt-4 text-text-muted">Loading papers...</p>
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

  const formatTermName = (termKey) => {
    const termNames = {
      'term1': '1st Term',
      'term2': '2nd Term',
      'term3': '3rd Term'
    };
    return termNames[termKey] || termKey.charAt(0).toUpperCase() + termKey.slice(1);
  };

  const formatChapterName = (chapterKey) => {
    if (chapterKey.startsWith('ch')) {
      return `Chapter ${chapterKey.replace('ch', '')}`;
    }
    return chapterKey.charAt(0).toUpperCase() + chapterKey.slice(1).replace('-', ' ');
  };

  const TermPapers = ({ termPapers, onEdit }) => {
    if (!termPapers || Object.keys(termPapers).length === 0) {
      return (
        <div className="text-center py-6">
          <FileText className="w-10 h-10 text-text-muted mx-auto mb-2 opacity-30" />
          <p className="text-sm text-text-muted">No term papers available</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-6">
        {Object.entries(termPapers).map(([termKey, papers]) => {
          if (!Array.isArray(papers) || papers.length === 0) return null;
          const filteredPapers = papers.filter(paper => shouldShowResource(paper));
          if (filteredPapers.length === 0) return null;

          return (
            <div key={termKey}>
              <h6 className="text-primary font-bold mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                <Calendar className="w-4 h-4" /> {formatTermName(termKey)}
              </h6>
              <div className="flex flex-col gap-3">
                {filteredPapers.map((paper, index) => (
                  <ModernResourceCard
                    key={paper.id || index}
                    resource={paper}
                    title={paper.filename || paper.title || paper.name}
                    description={paper.school ? `School: ${paper.school}` : ''}
                    language={paper.language}
                    showLanguageLabel={true}
                    showViewButton={true}
                    showDownloadButton={true}
                    onEdit={onEdit}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const ChapterPapers = ({ chapterPapers, onEdit }) => {
    if (!chapterPapers || Object.keys(chapterPapers).length === 0) {
      return (
        <div className="text-center py-6">
          <FileText className="w-10 h-10 text-text-muted mx-auto mb-2 opacity-30" />
          <p className="text-sm text-text-muted">No chapter papers available</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-6">
        {Object.entries(chapterPapers).map(([chapterKey, papers]) => {
          if (!Array.isArray(papers) || papers.length === 0) return null;
          const filteredPapers = papers.filter(paper => shouldShowResource(paper));
          if (filteredPapers.length === 0) return null;

          return (
            <div key={chapterKey}>
              <h6 className="text-success font-bold mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                <BookOpen className="w-4 h-4" /> {formatChapterName(chapterKey)}
              </h6>
              <div className="flex flex-col gap-3">
                {filteredPapers.map((paper, index) => (
                  <ModernResourceCard
                    key={paper.id || index}
                    resource={paper}
                    title={paper.filename || paper.title || paper.name}
                    description={paper.school ? `School: ${paper.school}` : ''}
                    language={paper.language}
                    showLanguageLabel={true}
                    showViewButton={true}
                    showDownloadButton={true}
                    onEdit={onEdit}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      {/* Header */}
      <header className="bg-bg-secondary border-b border-border py-12">
        <Container className="text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight mb-3">{grade.display} Past Papers</h1>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">Practice with real examination papers</p>
          </motion.div>
        </Container>
      </header>

      {/* Language Switcher */}
      <div className="bg-bg-primary border-b border-border">
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
            <span className="text-text-primary font-semibold">{getResourceTypeName('papers', selectedLanguage)}</span>
          </nav>
        </Container>
      </div>

      <Container className="mt-6">
        <AdSenseComponent slot="PAPERS_HEADER_AD_SLOT" />
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
            const papers = subject.resources.papers || {};

            const mergedPapers = {
              terms: {
                term1: papers.terms?.term1 || [],
                term2: papers.terms?.term2 || [],
                term3: papers.terms?.term3 || []
              },
              chapters: papers.chapters || {}
            };

            const hasTermPapers = mergedPapers.terms && Object.values(mergedPapers.terms).some(termPapers =>
              Array.isArray(termPapers) && termPapers.some(paper => shouldShowResource(paper))
            );
            const hasChapterPapers = mergedPapers.chapters && Object.values(mergedPapers.chapters).some(chapterPapers =>
              Array.isArray(chapterPapers) && chapterPapers.some(paper => shouldShowResource(paper))
            );

            if (selectedSubjectId && subjectId !== selectedSubjectId) return null;
            if (!hasTermPapers && !hasChapterPapers) return null;

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
                        <p className="text-sm text-text-muted mt-1">Past examination papers</p>
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
                    <Grid cols={2} gap={6}>
                      {/* Term Papers */}
                      <div className="col-span-1">
                        <div className="border border-primary/20 rounded-xl overflow-hidden bg-bg-secondary shadow-sm h-full flex flex-col">
                          <div className="bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider py-2.5 px-4 flex items-center justify-between border-b border-primary/10">
                            <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Term Papers</div>
                            {isManageMode && (
                              <button 
                                className="text-primary hover:text-primary-dark transition-colors"
                                onClick={() => {
                                  setAddModalInitialData({ grade: gradeId, subject: subjectId, resourceType: 'papers', languages: ['sinhala', 'tamil', 'english'] });
                                  setIsAddModalOpen(true);
                                }}
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <div className="p-4 flex-1 bg-card">
                            <TermPapers termPapers={mergedPapers.terms} onEdit={setEditingResource} />
                          </div>
                        </div>
                      </div>

                      {/* Chapter Papers */}
                      <div className="col-span-1">
                        <div className="border border-success/20 rounded-xl overflow-hidden bg-bg-secondary shadow-sm h-full flex flex-col">
                          <div className="bg-success/10 text-success text-xs font-bold uppercase tracking-wider py-2.5 px-4 flex items-center justify-between border-b border-success/10">
                            <div className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> Chapter Papers</div>
                            {isManageMode && (
                              <button 
                                className="text-success hover:text-success-dark transition-colors"
                                onClick={() => {
                                  setAddModalInitialData({ grade: gradeId, subject: subjectId, resourceType: 'papers', languages: ['sinhala', 'tamil', 'english'] });
                                  setIsAddModalOpen(true);
                                }}
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <div className="p-4 flex-1 bg-card">
                            <ChapterPapers chapterPapers={mergedPapers.chapters} onEdit={setEditingResource} />
                          </div>
                        </div>
                      </div>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {Object.keys(subjects).length === 0 && (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-30" />
            <h4 className="text-xl font-bold text-text-primary mb-2">No exam papers available</h4>
            <p className="text-text-muted">Past papers for this grade haven't been added yet.</p>
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

export default PapersPage;