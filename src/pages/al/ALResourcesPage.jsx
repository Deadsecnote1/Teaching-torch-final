import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useALData } from '../../context/ALContext';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import ResourceCard from '../../components/common/ResourceCard';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { extractYouTubeId } from '../../utils/youtube';
import { Pencil, Trash2, ChevronRight, FolderOpen, Plus, PlayCircle, X, Inbox } from 'lucide-react';
import { Container, Section, Grid } from '../../components/ui/Layout';

const ALResourcesPage = () => {
  const { streamId, subjectId, resourceTypeId } = useParams();
  const { alStreams, alSubjects, alResourceTypes, alSubCategories, alResources, loading, fetchALResources, deleteDocument, updateDocument, addDocument } = useALData();
  const { selectedLanguage, setLanguage, languages } = useLanguage();
  const { isManageMode } = useAuth();

  React.useEffect(() => {
    if (subjectId) {
      fetchALResources(subjectId);
    }
  }, [fetchALResources, subjectId]);
  
  // Manage Mode Editor State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  
  // Sub-Category Editor State
  const [editingSubCat, setEditingSubCat] = useState(null);
  const [subCatFormData, setSubCatFormData] = useState({});
  const [activeVideo, setActiveVideo] = useState(null);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingResource) {
        await updateDocument('al_resources', editingResource.id, editFormData);
      } else {
        await addDocument('al_resources', {
          title: editFormData.title,
          description: editFormData.description || '',
          fileUrl: editFormData.fileUrl,
          alStreamId: streamId,
          alSubjectId: subjectId,
          alResourceTypeId: resourceTypeId,
          alSubCategoryId: editFormData.alSubCategoryId,
          mediaType: editFormData.mediaType || '',
          languages: [selectedLanguage],
          order: parseInt(editFormData.order) || 0,
          uploadDate: new Date().toISOString()
        });
      }
      setEditingResource(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubCatSubmit = async (e) => {
    e.preventDefault();
    try {
      const sanitizedData = {
        ...subCatFormData,
        description: subCatFormData.description || ''
      };
      await updateDocument('al_sub_categories', editingSubCat.id, sanitizedData);
      setEditingSubCat(null);
      toast.success('Sub-category updated');
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  const handleDeleteSubCat = async (subCat) => {
    if (window.confirm(`Hide "${subCat.name}" from ${subject.name}? This will not delete the resources inside.`)) {
      try {
        const newSubjectIds = subCat.subjectIds.filter(id => id !== subjectId);
        await updateDocument('al_sub_categories', subCat.id, { ...subCat, subjectIds: newSubjectIds });
        toast.success(`Hidden from ${subject.name}`);
      } catch (err) {
        toast.error('Failed to hide');
      }
    }
  };

  const stream = alStreams.find(s => s.id === streamId);
  const subject = alSubjects.find(s => s.id === subjectId);
  const resourceType = alResourceTypes.find(rt => rt.id === resourceTypeId);

  useDocumentTitle(resourceType && subject ? `${resourceType.name} - ${subject.name}` : 'Resources');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!stream || !subject || !resourceType) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-3xl font-bold text-text-primary mb-4">Content Not Found</h2>
        <Link to="/al" className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium">Back to Streams</Link>
      </div>
    );
  }

  // Filter SubCategories for this Resource Type
  const relevantSubCats = alSubCategories
    .filter(sc => sc.resourceTypeId === resourceTypeId)
    .filter(sc => sc.subjectIds && sc.subjectIds.includes(subjectId))
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // Filter Resources for this specific context
  const contextResources = alResources.filter(r => 
    r.alStreamId === streamId &&
    r.alSubjectId === subjectId &&
    r.alResourceTypeId === resourceTypeId &&
    (r.languages ? r.languages.includes(selectedLanguage) : true)
  );

  return (
    <div className="min-h-screen pb-12 bg-bg-primary flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 text-center py-16 text-white border-b border-slate-800">
        <Container>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{resourceType.name}</h1>
          <p className="text-lg mt-3 text-slate-300 max-w-2xl mx-auto">{subject.name} - {stream.name.endsWith('Stream') ? stream.name : `${stream.name} Stream`}</p>
        </Container>
      </header>

      {/* Language Switcher Section */}
      <div className="py-4 border-b border-border bg-bg-secondary/50">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <span className="font-bold uppercase tracking-wider text-xs text-text-muted">Select Content Medium:</span>
            <div className="inline-flex rounded-lg shadow-sm p-1 bg-bg-primary border border-border" role="group">
              {['sinhala', 'tamil', 'english'].map(lang => (
                <button
                  key={lang}
                  type="button"
                  className={`flex items-center px-6 py-2.5 text-sm font-medium rounded-md transition-all ${
                    selectedLanguage === lang 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-text-primary hover:bg-bg-secondary hover:text-primary'
                  }`}
                  onClick={() => setLanguage(lang)}
                >
                  <span 
                    className="w-2 h-2 rounded-full mr-2.5" 
                    style={{ backgroundColor: selectedLanguage === lang ? 'white' : languages[lang].color }}
                  ></span>
                  {languages[lang].display}
                </button>
              ))}
            </div>
          </div>
        </Container>
      </div>

      {/* Breadcrumb */}
      <div className="py-4 border-b border-border bg-bg-secondary/30">
        <Container>
          <nav aria-label="breadcrumb" className="flex items-center space-x-1 sm:space-x-2 text-sm text-text-muted overflow-x-auto whitespace-nowrap pb-1">
            <Link to="/" className="hover:text-primary transition-colors flex items-center">Home</Link>
            <ChevronRight className="w-4 h-4 opacity-50 flex-shrink-0" />
            <Link to="/al" className="hover:text-primary transition-colors flex items-center">A/L</Link>
            <ChevronRight className="w-4 h-4 opacity-50 flex-shrink-0" />
            <Link to={`/al/${streamId}/${subjectId}`} className="hover:text-primary transition-colors flex items-center">{subject.name}</Link>
            <ChevronRight className="w-4 h-4 opacity-50 flex-shrink-0" />
            <span className="text-text-primary font-medium">{resourceType.name}</span>
          </nav>
        </Container>
      </div>

      {/* Content */}
      <Section className="flex-1 py-12">
        <Grid cols={2} gap={8}>
          {relevantSubCats.map(subCat => {
            const subCatResources = contextResources.filter(r => r.alSubCategoryId === subCat.id);
            
            // Hide if empty and not in manage mode
            if (subCatResources.length === 0 && !isManageMode) return null;

            return (
              <div key={subCat.id} className="col-span-1 sm:col-span-2 lg:col-span-1">
                <div className="bg-card h-full p-6 border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-primary/20">
                    <h5 className="text-xl font-bold text-primary flex items-center">
                      <FolderOpen className="w-6 h-6 mr-3 opacity-80" />
                      {subCat.name}
                    </h5>
                    {isManageMode && (
                      <div className="flex gap-1.5">
                        <button 
                          className="p-1.5 text-info hover:bg-info/10 rounded-md border border-info/30 transition-colors"
                          onClick={() => {
                            setEditingSubCat(subCat);
                            setSubCatFormData(subCat);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1.5 text-danger hover:bg-danger/10 rounded-md border border-danger/30 transition-colors" 
                          onClick={() => handleDeleteSubCat(subCat)}
                          title={`Hide from ${subject.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button 
                          className="ml-2 px-3 py-1.5 bg-success text-white text-sm font-medium rounded-md hover:bg-success/90 transition-colors flex items-center"
                          onClick={() => {
                            setEditingResource(null);
                            setEditFormData({ title: '', description: '', fileUrl: '', alSubCategoryId: subCat.id, order: 0, mediaType: '' });
                            setIsModalOpen(true);
                          }}
                        >
                          <Plus className="w-4 h-4 mr-1" /> Add
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 overflow-y-auto pr-2" style={{ maxHeight: '400px' }}>
                    {subCatResources.length > 0 ? (
                      <div className="space-y-4">
                        {subCatResources.map(resource => (
                          <ResourceCard
                            key={resource.id}
                            resource={resource}
                            title={resource.title}
                            description={resource.description}
                            language={selectedLanguage}
                            showViewButton={true}
                            showDownloadButton={true}
                            showLanguageLabel={false}
                            onEdit={(r) => {
                              setEditingResource(r);
                              setEditFormData({
                                title: r.title || '',
                                description: r.description || '',
                                fileUrl: r.fileUrl || '',
                                order: r.order || 0,
                                mediaType: r.mediaType || ''
                              });
                              setIsModalOpen(true);
                            }}
                            onDelete={(id) => deleteDocument('al_resources', id)}
                            onPlayVideo={(r) => setActiveVideo(r)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 text-text-muted bg-bg-secondary/30 rounded-xl border border-border border-dashed h-full flex flex-col items-center justify-center">
                        <Inbox className="w-12 h-12 mb-3 opacity-30" />
                        <p>No resources available in {selectedLanguage}.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {relevantSubCats.length === 0 ? (
            <div className="col-span-1 sm:col-span-2 text-center py-16 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-200 dark:border-blue-800/30">
              <FolderOpen className="w-16 h-16 mx-auto mb-4 text-blue-500/50" />
              <h4 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-2">No Categories Configured</h4>
              <p className="text-blue-600/80 dark:text-blue-400/80">There are no sub-categories defined for this resource type yet.</p>
            </div>
          ) : (
            (() => {
              const hasVisibleContent = relevantSubCats.some(subCat => {
                const subCatResources = contextResources.filter(r => r.alSubCategoryId === subCat.id);
                return subCatResources.length > 0 || isManageMode;
              });

              if (!hasVisibleContent) {
                return (
                  <div className="col-span-1 sm:col-span-2 text-center py-20 text-text-muted">
                    <Inbox className="w-20 h-20 mx-auto mb-6 opacity-20" />
                    <h4 className="text-2xl font-bold text-text-primary mb-2">No Resources Available</h4>
                    <p>There are no resources uploaded for {resourceType.name} in {selectedLanguage} yet.</p>
                    {isManageMode && (
                      <p className="text-sm mt-4 p-4 bg-bg-secondary rounded-lg inline-block">Tip: Use the Admin Dashboard to upload resources or add them directly here.</p>
                    )}
                  </div>
                );
              }
              return null;
            })()
          )}
        </Grid>
      </Section>

      {/* Inline Resource Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-border animate-fade-in max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-border bg-bg-secondary/50">
              <h5 className="text-lg font-bold text-text-primary">{editingResource ? 'Edit Resource' : 'Add New Resource'}</h5>
              <button type="button" className="text-text-muted hover:text-text-primary" onClick={() => { setIsModalOpen(false); setEditingResource(null); }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1">
              <form id="resourceForm" onSubmit={handleEditSubmit}>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Title</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50" 
                      value={editFormData.title} 
                      onChange={(e) => setEditFormData({...editFormData, title: e.target.value})} 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Description (Optional)</label>
                    <textarea 
                      className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50" 
                      value={editFormData.description} 
                      onChange={(e) => setEditFormData({...editFormData, description: e.target.value})} 
                      rows="3"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">File URL / Drive Link</label>
                    <input 
                      type="url" 
                      className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50" 
                      value={editFormData.fileUrl} 
                      onChange={(e) => setEditFormData({...editFormData, fileUrl: e.target.value})} 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Media Type (Optional Override)</label>
                    <select 
                      className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50" 
                      value={editFormData.mediaType || ''} 
                      onChange={(e) => setEditFormData({...editFormData, mediaType: e.target.value})}
                    >
                      <option value="">Auto Detect (Default)</option>
                      <option value="document">Document (PDF/Word)</option>
                      <option value="video">Video (YouTube/MP4)</option>
                      <option value="audio">Audio (MP3/WAV)</option>
                      <option value="image">Image</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Priority / Order</label>
                    <input 
                      type="number" 
                      className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50" 
                      value={editFormData.order || 0} 
                      onChange={(e) => setEditFormData({...editFormData, order: parseInt(e.target.value)})} 
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="px-6 py-4 border-t border-border bg-bg-secondary/50 flex justify-end gap-3">
              <button type="button" className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-primary bg-bg-primary border border-border rounded-lg hover:bg-bg-secondary transition-colors" onClick={() => { setIsModalOpen(false); setEditingResource(null); }}>Cancel</button>
              <button type="submit" form="resourceForm" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-50" disabled={isSaving}>
                {isSaving ? 'Saving...' : (editingResource ? 'Save Changes' : 'Add Resource')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Category Editor Modal */}
      {editingSubCat && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-border animate-fade-in">
            <div className="flex justify-between items-center px-6 py-4 border-b border-border bg-bg-secondary/50">
              <h5 className="text-lg font-bold text-text-primary">Edit Sub-Category</h5>
              <button type="button" className="text-text-muted hover:text-text-primary" onClick={() => setEditingSubCat(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubCatSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">Name</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50" 
                    value={subCatFormData.name || ''} 
                    onChange={(e) => setSubCatFormData({...subCatFormData, name: e.target.value})} 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">Order</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50" 
                    value={subCatFormData.order || 0} 
                    onChange={(e) => setSubCatFormData({...subCatFormData, order: parseInt(e.target.value)})} 
                  />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-border bg-bg-secondary/50 flex justify-end gap-3">
                <button type="button" className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-primary bg-bg-primary border border-border rounded-lg hover:bg-bg-secondary transition-colors" onClick={() => setEditingSubCat(null)}>Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors shadow-sm">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md transition-opacity" onClick={() => setActiveVideo(null)}>
          <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden border border-slate-700 animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800">
              <h5 className="text-lg font-bold text-white flex items-center">
                <PlayCircle className="w-6 h-6 text-red-500 mr-2" />
                {activeVideo.title}
              </h5>
              <button type="button" className="text-slate-400 hover:text-white transition-colors" onClick={() => setActiveVideo(null)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="w-full aspect-video bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${extractYouTubeId(activeVideo.fileUrl || activeVideo.url)}?autoplay=1`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 flex justify-end">
              <button className="px-6 py-2 text-sm font-medium text-white bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors" onClick={() => setActiveVideo(null)}>Close Player</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ALResourcesPage;
