import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useALData } from '../../context/ALContext';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import ResourceCard from '../../components/common/ResourceCard';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ALResourcesPage = () => {
  const { streamId, subjectId, resourceTypeId } = useParams();
  const { alStreams, alSubjects, alResourceTypes, alSubCategories, alResources, loading, deleteDocument, updateDocument, addDocument } = useALData();
  const { selectedLanguage, setLanguage, languages } = useLanguage();
  const { isManageMode } = useAuth();
  
  // Manage Mode Editor State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  
  // Sub-Category Editor State
  const [editingSubCat, setEditingSubCat] = useState(null);
  const [subCatFormData, setSubCatFormData] = useState({});

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
      <div className="container py-5 text-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!stream || !subject || !resourceType) {
    return (
      <div className="container py-5 text-center min-vh-100 mt-5">
        <h2>Content Not Found</h2>
        <Link to="/al" className="btn btn-primary mt-3">Back to Streams</Link>
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
    (r.languages ? r.languages.includes(selectedLanguage) : true) // Assuming AL resources have languages array
  );

  return (
    <div className="al-page min-vh-100 pb-5">
      {/* Header */}
      <header className="grade-header text-center py-5" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white' }}>
        <div className="container mt-5">
          <h1 className="display-4 fw-bold">{resourceType.name}</h1>
          <p className="lead">{subject.name} - {stream.name.endsWith('Stream') ? stream.name : `${stream.name} Stream`}</p>
        </div>
      </header>

      {/* Language Switcher Section (Reused from standard resources) */}
      <section className="py-4 switcher-container border-bottom">
        <div className="container">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-3">
            <span className="fw-bold text-uppercase tracking-wider small opacity-75">Select Content Medium:</span>
            <div className="btn-group shadow-sm" role="group">
              {['sinhala', 'tamil', 'english'].map(lang => (
                <button
                  key={lang}
                  type="button"
                  className={`btn px-4 py-2 content-medium-btn ${selectedLanguage === lang ? 'btn-primary active' : 'btn-outline-custom'}`}
                  onClick={() => setLanguage(lang)}
                  style={{ minWidth: '120px' }}
                >
                  <i className={`bi bi-circle-fill me-2`} style={{ color: languages[lang].color, fontSize: '0.7rem' }}></i>
                  {languages[lang].display}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="py-3 border-bottom">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/al">A/L</Link></li>
              <li className="breadcrumb-item"><Link to={`/al/${streamId}/${subjectId}`}>{subject.name}</Link></li>
              <li className="breadcrumb-item active" aria-current="page">{resourceType.name}</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Content */}
      <div className="container mt-5">
        <div className="row g-4">
          {relevantSubCats.map(subCat => {
            const subCatResources = contextResources.filter(r => r.alSubCategoryId === subCat.id);
            
            // Hide if empty and not in manage mode
            if (subCatResources.length === 0 && !isManageMode) return null;

            return (
              <div key={subCat.id} className="col-lg-6">
                <div className="subject-section h-100 p-4 border rounded shadow-sm">
                  <h5 className="mb-4 text-primary fw-bold border-bottom border-primary pb-2 d-flex justify-content-between align-items-center">
                    <div>
                      <i className="bi bi-folder2-open me-2"></i>
                      {subCat.name}
                    </div>
                    {isManageMode && (
                      <div className="d-flex gap-1">
                        <button 
                          className="btn btn-sm btn-outline-info"
                          onClick={() => {
                            setEditingSubCat(subCat);
                            setSubCatFormData(subCat);
                          }}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger" 
                          onClick={() => handleDeleteSubCat(subCat)}
                          title={`Hide from ${subject.name}`}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-success ms-2"
                          onClick={() => {
                            setEditingResource(null);
                            setEditFormData({ title: '', description: '', fileUrl: '', alSubCategoryId: subCat.id, order: 0 });
                            setIsModalOpen(true);
                          }}
                        >
                          <i className="bi bi-plus-lg me-1"></i> Add
                        </button>
                      </div>
                    )}
                  </h5>
                  
                  <div className="resources-list" style={{ maxHeight: '280px', overflowY: 'auto', paddingRight: '8px' }}>
                    {subCatResources.length > 0 ? (
                      subCatResources.map(resource => (
                        <ResourceCard
                          key={resource.id}
                          resource={resource}
                          title={resource.title}
                          description={resource.description}
                          language={selectedLanguage}
                          showViewButton={true}
                          showDownloadButton={true}
                          className="mb-3"
                          showLanguageLabel={false}
                          onEdit={(r) => {
                            setEditingResource(r);
                            setEditFormData({
                              title: r.title || '',
                              description: r.description || '',
                              fileUrl: r.fileUrl || '',
                              order: r.order || 0
                            });
                            setIsModalOpen(true);
                          }}
                          onDelete={(id) => deleteDocument('al_resources', id)}
                        />
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted border rounded" style={{ backgroundColor: 'var(--card-bg)' }}>
                        <i className="bi bi-inbox fs-2 d-block mb-2"></i>
                        No resources available in {selectedLanguage}.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {relevantSubCats.length === 0 ? (
            <div className="col-12">
              <div className="alert alert-info text-center py-5">
                <i className="bi bi-info-circle fs-1 d-block mb-3"></i>
                <h4 className="alert-heading">No Categories Configured</h4>
                <p>There are no sub-categories defined for this resource type yet.</p>
              </div>
            </div>
          ) : (
            // Check if any sub-category actually rendered something
            (() => {
              const hasVisibleContent = relevantSubCats.some(subCat => {
                const subCatResources = contextResources.filter(r => r.alSubCategoryId === subCat.id);
                return subCatResources.length > 0 || isManageMode;
              });

              if (!hasVisibleContent) {
                return (
                  <div className="col-12 text-center py-5 text-muted">
                    <i className="bi bi-inbox display-1 d-block mb-3 opacity-25"></i>
                    <h4>No Resources Available</h4>
                    <p>There are no resources uploaded for {resourceType.name} in {selectedLanguage} yet.</p>
                    {isManageMode && (
                      <p className="small">Tip: Use the Admin Dashboard to upload resources or add them directly here.</p>
                    )}
                  </div>
                );
              }
              return null;
            })()
          )}
        </div>
      </div>
      
      <style>{`
        .subject-section {
          background-color: var(--card-bg);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .subject-section:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.05) !important;
        }
        .resources-list::-webkit-scrollbar {
          width: 5px;
        }
        .resources-list::-webkit-scrollbar-track {
          background: transparent;
        }
        .resources-list::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .resources-list::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      {/* Inline Resource Editor Modal */}
      {isModalOpen && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ backgroundColor: 'var(--card-bg)' }}>
              <div className="modal-header border-bottom-0">
                <h5 className="modal-title">{editingResource ? 'Edit Resource' : 'Add New Resource'}</h5>
                <button type="button" className="btn-close" onClick={() => { setIsModalOpen(false); setEditingResource(null); }}></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={editFormData.title} 
                      onChange={(e) => setEditFormData({...editFormData, title: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description (Optional)</label>
                    <textarea 
                      className="form-control" 
                      value={editFormData.description} 
                      onChange={(e) => setEditFormData({...editFormData, description: e.target.value})} 
                      rows="2"
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">File URL / Drive Link</label>
                    <input 
                      type="url" 
                      className="form-control" 
                      value={editFormData.fileUrl} 
                      onChange={(e) => setEditFormData({...editFormData, fileUrl: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Priority / Order</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={editFormData.order || 0} 
                      onChange={(e) => setEditFormData({...editFormData, order: parseInt(e.target.value)})} 
                    />
                  </div>
                </div>
                <div className="modal-footer border-top-0">
                  <button type="button" className="btn btn-secondary" onClick={() => { setIsModalOpen(false); setEditingResource(null); }}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={isSaving}>
                    {isSaving ? 'Saving...' : (editingResource ? 'Save Changes' : 'Add Resource')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Category Editor Modal */}
      {editingSubCat && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ backgroundColor: 'var(--card-bg)' }}>
              <div className="modal-header border-bottom-0">
                <h5 className="modal-title">Edit Sub-Category</h5>
                <button type="button" className="btn-close" onClick={() => setEditingSubCat(null)}></button>
              </div>
              <form onSubmit={handleSubCatSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={subCatFormData.name || ''} 
                      onChange={(e) => setSubCatFormData({...subCatFormData, name: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Order</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={subCatFormData.order || 0} 
                      onChange={(e) => setSubCatFormData({...subCatFormData, order: parseInt(e.target.value)})} 
                    />
                  </div>
                </div>
                <div className="modal-footer border-top-0">
                  <button type="button" className="btn btn-secondary" onClick={() => setEditingSubCat(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ALResourcesPage;
