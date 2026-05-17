import React, { useMemo, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import { useGradePage } from '../hooks/useGradePage';
import { useLanguage } from '../../../context/LanguageContext';
import { useAuth } from '../../../context/AuthContext';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import ModernResourceCard from '../../../components/common/ModernResourceCard';
import ResourceEditorModal from '../../../components/admin/ResourceEditorModal';
import MetadataEditorModal from '../../../components/admin/MetadataEditorModal';
import { subjectTranslations } from '../../../utils/subjectTranslations';
import { getResourceTypeName } from '../../../utils/resourceTranslations';
import AdSenseComponent from '../../../components/common/AdSenseComponent';
import { getLucideIcon } from '../../../utils/iconUtils';
import toast from 'react-hot-toast';
import { ChevronRight, ArrowLeft, Edit, Plus, Archive, FolderOpen } from 'lucide-react';
import { Container, Section, Grid } from '../../../components/ui/Layout';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { cn } from '../../../utils/cn';

const ResourcesPage = () => {
  const { gradeId, streamId, subjectId: paramSubjectId, resourceType } = useParams();
  const [searchParams] = useSearchParams();
  const selectedSubjectId = paramSubjectId || searchParams.get('subject');
  const { grade: rawGrade, subjects, isLoading, isGradeMissing } = useGradePage(streamId || gradeId);
  const { updateSubject, resourceTypes = [], grades } = useData();

  const grade = rawGrade;
  const parentGrade = streamId ? grades[gradeId] : null;
  const subject = selectedSubjectId ? subjects[selectedSubjectId] : null;
  const { selectedLanguage, setLanguage, shouldShowResource, languages } = useLanguage();
  const { isManageMode } = useAuth();

  const typeName = resourceTypes.find(t => t.id === resourceType)?.name?.[selectedLanguage] || getResourceTypeName(resourceType, selectedLanguage) || resourceType;
  const gradeName = grade?.display || 'Grade';
  useDocumentTitle(`${typeName} - ${gradeName}`);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalInitialData, setAddModalInitialData] = useState(null);
  const [editingResource, setEditingResource] = useState(null);
  const [metadataModal, setMetadataModal] = useState({ isOpen: false, initialData: null, type: 'subject', key: null });

  const typeMetadata = useMemo(() => {
    const found = resourceTypes.find(t => t.id === resourceType);
    if (found) {
      return {
        ...found,
        displayName: typeof found.name === 'object' ? (found.name[selectedLanguage] || found.name.english || resourceType) : (found.name || resourceType),
        displayDescription: typeof found.description === 'object' ? (found.description[selectedLanguage] || found.description.english || '') : (found.description || '')
      };
    }
    const fallbackLabel = resourceType
      ? resourceType.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      : 'Resources';
    return {
      id: resourceType,
      displayName: getResourceTypeName(resourceType, selectedLanguage) || fallbackLabel,
      icon: 'archive',
      color: 'text-primary',
      displayDescription: 'Educational resources'
    };
  }, [resourceType, resourceTypes, selectedLanguage]);

  const ResourceList = ({ resources, onEdit }) => {
    const safeResources = resources || [];
    const hasSubCategories = typeMetadata.subCategories && typeMetadata.subCategories.length > 0;

    // Filter resources based on current language
    const filteredResources = safeResources.filter(res => shouldShowResource(res));

    const renderGrid = (items) => {
      if (items.length === 0) {
        return (
          <div className="text-center py-6">
            <Archive className="w-10 h-10 text-text-muted mx-auto mb-2 opacity-30" />
            <p className="text-sm text-text-muted">No resources available in {languages[selectedLanguage]?.display}</p>
          </div>
        );
      }
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((file, index) => (
            <ModernResourceCard
              key={file.id || index}
              resource={file}
              title={file.title || file.name || file.originalName}
              description={file.description}
              language={file.language}
              showViewButton={true}
              showDownloadButton={true}
              showLanguageLabel={false}
              onEdit={onEdit}
            />
          ))}
        </div>
      );
    };

    if (hasSubCategories) {
      const subCats = [...(typeMetadata.subCategories || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
      const slugify = (text) => text?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const others = filteredResources.filter(r => {
        const rSub = r.subCategory || '';
        if (!rSub) return true;
        return !subCats.some(sc => {
          const scId = sc.id || sc;
          const scName = typeof sc === 'object' ? (sc.name?.english || '') : sc;
          return rSub === scId || slugify(rSub) === scId || rSub === scName || slugify(rSub) === slugify(scName);
        });
      });

      return (
        <div className="flex flex-col gap-6 mt-4">
          {subCats.map((subCatObj) => {
            const subCatId = subCatObj.id || subCatObj;
            const subCatDisplayName = subCatObj.name ? (subCatObj.name[selectedLanguage] || subCatObj.name.english) : subCatObj;

            const items = filteredResources.filter(r => {
              const rSub = r.subCategory || '';
              return rSub === subCatId || slugify(rSub) === subCatId || rSub === subCatDisplayName || slugify(rSub) === slugify(subCatDisplayName);
            });
            
            return (
              <div key={subCatId} className="border border-border bg-bg-secondary rounded-xl overflow-hidden shadow-sm">
                <div className="bg-bg-tertiary px-4 py-3 border-b border-border flex items-center justify-between">
                  <h6 className="font-bold text-text-primary flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-primary" /> {subCatDisplayName}
                  </h6>
                  {isManageMode && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-primary hover:bg-primary/10 h-8"
                      onClick={() => {
                        setAddModalInitialData({
                          grade: gradeId,
                          subject: typeMetadata.isStandalone ? 'standalone' : (selectedSubjectId || ''),
                          resourceType: resourceType,
                          subCategory: subCatId,
                          languages: ['sinhala', 'tamil', 'english']
                        });
                        setIsAddModalOpen(true);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add
                    </Button>
                  )}
                </div>
                <div className="p-4 bg-card">
                  {renderGrid(items)}
                </div>
              </div>
            );
          })}
          {others.length > 0 && (
            <div className="border border-border bg-bg-secondary rounded-xl overflow-hidden shadow-sm">
              <div className="bg-bg-tertiary px-4 py-3 border-b border-border">
                <h6 className="font-bold text-text-muted flex items-center gap-2">
                  <FolderOpen className="w-4 h-4" /> Other
                </h6>
              </div>
              <div className="p-4 bg-card">
                {renderGrid(others)}
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="mt-4">
        {renderGrid(filteredResources)}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Container className="py-20 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-text-muted">Loading {typeMetadata.displayName}...</p>
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

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      {/* Header */}
      <header className="bg-bg-secondary border-b border-border py-12">
        <Container className="text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight">
                {grade.display} {typeMetadata.displayName}
              </h1>
            </div>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">{typeMetadata.displayDescription}</p>
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
            <span className="text-text-primary font-semibold flex items-center gap-2">
              {typeMetadata.displayName}
            </span>
          </nav>
        </Container>
      </div>

      <Container className="mt-6">
        <AdSenseComponent slot="RESOURCES_HEADER_AD_SLOT" />
      </Container>

      {/* Content */}
      <Section className="flex-1 pt-8">
        <div className="flex flex-col gap-8">
          {typeMetadata.isStandalone ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-border shadow-sm">
                <CardContent className="p-6">
                  <ResourceList resources={subjects['standalone']?.resources?.extras?.[resourceType] || []} onEdit={setEditingResource} />
                  {isManageMode && (
                    <Button 
                      variant="outline" 
                      className="w-full mt-6 border-dashed border-2 hover:bg-success/5 hover:text-success hover:border-success h-14 rounded-xl text-base"
                      onClick={() => {
                        setAddModalInitialData({ grade: gradeId, subject: 'standalone', resourceType: resourceType, languages: ['sinhala', 'tamil', 'english'] });
                        setIsAddModalOpen(true);
                      }}
                    >
                      <Plus className="w-5 h-5 mr-2" /> Upload to {typeMetadata.displayName} Hub
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Grid cols={2} gap={8}>
              {Object.keys(subjects).filter(subjectId => {
                if (subjectId === 'standalone') return false;
                const subject = subjects[subjectId];
                if (selectedSubjectId && subjectId !== selectedSubjectId) return false;
                if (subject.languages && subject.languages.length > 0) return subject.languages.includes(selectedLanguage);
                return true;
              }).map((subjectId, index) => {
                const subject = subjects[subjectId];
                
                let typeResources = [];
                if (resourceType === 'textbooks') {
                  Object.values(subject.resources.textbooks || {}).forEach(arr => { typeResources = [...typeResources, ...arr]; });
                } else if (resourceType === 'notes') {
                  typeResources = Object.values(subject.resources.notes || {});
                } else if (resourceType === 'videos') {
                  typeResources = subject.videos || [];
                } else if (resourceType === 'papers') {
                  return null;
                } else {
                  typeResources = subject.resources.extras?.[resourceType] || [];
                }

                const hasFilteredResources = typeResources.some(res => shouldShowResource(res));
                if (!hasFilteredResources && !isManageMode) return null;

                return (
                  <motion.div key={subjectId} className="col-span-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                    <Card className="h-full flex flex-col border-border shadow-sm">
                      <CardHeader className="border-b border-border bg-bg-secondary/40 pb-4 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-bg-primary shadow-sm border border-border flex items-center justify-center">
                            {getLucideIcon(subject.icon, "text-2xl text-primary")}
                          </div>
                          <CardTitle className="text-xl">
                            {subjectTranslations.getTranslatedName(subjectId, subject, selectedLanguage)}
                          </CardTitle>
                        </div>

                        {isManageMode && (
                          <Button size="icon" variant="ghost" onClick={() => setMetadataModal({ isOpen: true, initialData: subject, type: 'subject', key: subjectId })} className="h-8 w-8 text-info hover:bg-info/10">
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                      </CardHeader>
                      <CardContent className="p-5 flex-1 flex flex-col">
                        <ResourceList resources={typeResources} onEdit={setEditingResource} />

                        {isManageMode && (
                          <div className="mt-auto pt-6">
                            <Button 
                              variant="outline" 
                              className="w-full border-dashed border-2 hover:bg-success/5 hover:text-success hover:border-success h-12 rounded-xl"
                              onClick={() => {
                                setAddModalInitialData({ grade: gradeId, subject: subjectId, resourceType: resourceType, languages: ['sinhala', 'tamil', 'english'] });
                                setIsAddModalOpen(true);
                              }}
                            >
                              <Plus className="w-4 h-4 mr-2" /> Add New {typeMetadata.displayName}
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </Grid>
          )}
        </div>
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
          } catch (err) {
            console.error(err);
            toast.error(err.message || 'Subject update failed');
          }
        }}
        title="Edit Subject"
        initialData={metadataModal.initialData}
        type={metadataModal.type}
      />
    </div>
  );
};

export default ResourcesPage;
