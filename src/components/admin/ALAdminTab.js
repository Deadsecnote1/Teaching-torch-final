import React, { useState } from 'react';
import { useALData } from '../../context/ALContext';
import toast from 'react-hot-toast';

const ALAdminTab = () => {
  const { 
    alStreams, alSubjects, alResourceTypes, alSubCategories, alResources,
    addDocument, updateDocument, deleteDocument 
  } = useALData();

  const [activeTab, setActiveTab] = useState('streams');
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // --- Handlers for Streams ---
  const handleAddStream = async (e) => {
    e.preventDefault();
    try {
      const data = {
        name: formData.name,
        description: formData.description || '',
        color: formData.color || 'primary',
        icon: formData.icon || 'bi-layers',
        order: parseInt(formData.order) || 0
      };
      
      if (editingId) {
        await updateDocument('al_streams', editingId, data);
        toast.success('Stream updated');
      } else {
        const id = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        await addDocument('al_streams', data, id);
        toast.success('Stream added');
      }
      setFormData({});
      setEditingId(null);
    } catch (err) { toast.error('Failed to save stream'); }
  };

  const handleDeleteStream = async (id) => {
    if(window.confirm('Delete stream?')) {
      await deleteDocument('al_streams', id);
      toast.success('Stream deleted');
    }
  };

  // --- Handlers for Subjects ---
  const handleAddSubject = async (e) => {
    e.preventDefault();
    try {
      const data = {
        name: formData.name,
        streamId: formData.streamId,
        icon: formData.icon || 'bi-book',
        order: parseInt(formData.order) || 0
      };
      
      if (editingId) {
        await updateDocument('al_subjects', editingId, data);
        toast.success('Subject updated');
      } else {
        const id = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        await addDocument('al_subjects', data, id);
        toast.success('Subject added');
      }
      setFormData({});
      setEditingId(null);
    } catch (err) { toast.error('Failed to save subject'); }
  };

  const handleDeleteSubject = async (id) => {
    if(window.confirm('Delete subject?')) {
      await deleteDocument('al_subjects', id);
      toast.success('Subject deleted');
    }
  };

  // --- Handlers for Resource Types ---
  const handleAddResourceType = async (e) => {
    e.preventDefault();
    try {
      const data = {
        name: formData.name,
        description: formData.description || '',
        icon: formData.icon || 'bi-archive',
        order: parseInt(formData.order) || 0,
        subjectIds: formData.subjectIds || []
      };
      
      if (editingId) {
        await updateDocument('al_resource_types', editingId, data);
        toast.success('Resource Type updated');
      } else {
        const id = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        await addDocument('al_resource_types', data, id);
        toast.success('Resource Type added');
      }
      setFormData({});
      setEditingId(null);
    } catch (err) { toast.error('Failed to save resource type'); }
  };

  const handleDeleteResourceType = async (id) => {
    if(window.confirm('Delete resource type?')) {
      await deleteDocument('al_resource_types', id);
      toast.success('Resource type deleted');
    }
  };

  // --- Handlers for Sub Categories ---
  const handleAddSubCategory = async (e) => {
    e.preventDefault();
    try {
      const data = {
        name: formData.name,
        resourceTypeId: formData.resourceTypeId,
        order: parseInt(formData.order) || 0,
        subjectIds: formData.subjectIds || []
      };
      
      if (editingId) {
        await updateDocument('al_sub_categories', editingId, data);
        toast.success('Sub Category updated');
      } else {
        const id = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        await addDocument('al_sub_categories', data, id);
        toast.success('Sub Category added');
      }
      setFormData({});
      setEditingId(null);
    } catch (err) { toast.error('Failed to save sub category'); }
  };

  const handleDeleteSubCategory = async (id) => {
    if(window.confirm('Delete sub category?')) {
      await deleteDocument('al_sub_categories', id);
      toast.success('Sub category deleted');
    }
  };

  // --- Handlers for Resources ---
  const handleAddResource = async (e) => {
    e.preventDefault();
    try {
      const data = {
        title: formData.title,
        description: formData.description || '',
        fileUrl: formData.fileUrl,
        alStreamId: formData.alStreamId,
        alSubjectId: formData.alSubjectId,
        alResourceTypeId: formData.alResourceTypeId,
        alSubCategoryId: formData.alSubCategoryId,
        languages: [formData.language], // Support single language selection for now
        uploadDate: new Date().toISOString()
      };
      
      if (editingId) {
        await updateDocument('al_resources', editingId, data);
        toast.success('Resource updated');
      } else {
        await addDocument('al_resources', data);
        toast.success('Resource uploaded');
      }
      setFormData({});
      setEditingId(null);
    } catch (err) { toast.error('Failed to save resource'); }
  };

  const handleSubjectToggle = (subjectId) => {
    const currentIds = formData.subjectIds || [];
    if (currentIds.includes(subjectId)) {
      setFormData({ ...formData, subjectIds: currentIds.filter(id => id !== subjectId) });
    } else {
      setFormData({ ...formData, subjectIds: [...currentIds, subjectId] });
    }
  };

  const handleDeleteResource = async (id) => {
    if(window.confirm('Delete resource?')) {
      await deleteDocument('al_resources', id);
      toast.success('Resource deleted');
    }
  };

  return (
        <div className="card shadow-sm border-0">
          <div className="card-header border-bottom-0 pt-4 pb-0 px-4">
            <ul className="nav nav-tabs card-header-tabs" role="tablist">
              <li className="nav-item">
                <button className={`nav-link ${activeTab === 'streams' ? 'active' : ''}`} onClick={() => {setActiveTab('streams'); setFormData({}); setEditingId(null);}}>Streams</button>
              </li>
              <li className="nav-item">
                <button className={`nav-link ${activeTab === 'subjects' ? 'active' : ''}`} onClick={() => {setActiveTab('subjects'); setFormData({}); setEditingId(null);}}>Subjects</button>
              </li>
              <li className="nav-item">
                <button className={`nav-link ${activeTab === 'types' ? 'active' : ''}`} onClick={() => {setActiveTab('types'); setFormData({}); setEditingId(null);}}>Resource Types</button>
              </li>
              <li className="nav-item">
                <button className={`nav-link ${activeTab === 'subcats' ? 'active' : ''}`} onClick={() => {setActiveTab('subcats'); setFormData({}); setEditingId(null);}}>Sub Categories</button>
              </li>
              <li className="nav-item">
                <button className={`nav-link ${activeTab === 'resources' ? 'active' : ''}`} onClick={() => {setActiveTab('resources'); setFormData({}); setEditingId(null);}}>Upload Resources</button>
              </li>
            </ul>
          </div>
          
          <div className="card-body p-4">
            
            {/* STREAMS TAB */}
            {activeTab === 'streams' && (
              <div className="row">
                <div className="col-md-5">
                  <h4 className="mb-4">Add Stream</h4>
                  <form onSubmit={handleAddStream}>
                    <div className="mb-3">
                      <label className="form-label">Stream Name</label>
                      <input type="text" className="form-control" name="name" value={formData.name || ''} onChange={handleInputChange} required placeholder="e.g. Science" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <input type="text" className="form-control" name="description" value={formData.description || ''} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Icon (Bootstrap class)</label>
                      <input type="text" className="form-control" name="icon" value={formData.icon || ''} onChange={handleInputChange} placeholder="bi-layers" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Color (CSS var name)</label>
                      <input type="text" className="form-control" name="color" value={formData.color || ''} onChange={handleInputChange} placeholder="primary" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Order</label>
                      <input type="number" className="form-control" name="order" value={formData.order || 0} onChange={handleInputChange} />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">{editingId ? 'Update Stream' : 'Add Stream'}</button>
                    {editingId && <button type="button" className="btn btn-outline-secondary w-100 mt-2" onClick={() => {setEditingId(null); setFormData({});}}>Cancel Edit</button>}
                  </form>
                </div>
                <div className="col-md-7">
                  <h4 className="mb-4">Current Streams</h4>
                  <ul className="list-group">
                    {alStreams.map(s => (
                      <li key={s.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{s.name}</strong> <span className="badge bg-secondary ms-2">Order: {s.order}</span>
                        </div>
                        <div>
                          <button className="btn btn-sm btn-info text-white me-2" onClick={() => {setEditingId(s.id); setFormData(s);}}><i className="bi bi-pencil"></i></button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDeleteStream(s.id)}><i className="bi bi-trash"></i></button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* SUBJECTS TAB */}
            {activeTab === 'subjects' && (
              <div className="row">
                <div className="col-md-5">
                  <h4 className="mb-4">Add Subject</h4>
                  <form onSubmit={handleAddSubject}>
                    <div className="mb-3">
                      <label className="form-label">Select Stream</label>
                      <select className="form-select" name="streamId" value={formData.streamId || ''} onChange={handleInputChange} required>
                        <option value="">-- Choose Stream --</option>
                        {alStreams.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Subject Name</label>
                      <input type="text" className="form-control" name="name" value={formData.name || ''} onChange={handleInputChange} required placeholder="e.g. Physics" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Icon (Bootstrap class)</label>
                      <input type="text" className="form-control" name="icon" value={formData.icon || ''} onChange={handleInputChange} placeholder="bi-book" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Order</label>
                      <input type="number" className="form-control" name="order" value={formData.order || 0} onChange={handleInputChange} />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">{editingId ? 'Update Subject' : 'Add Subject'}</button>
                    {editingId && <button type="button" className="btn btn-outline-secondary w-100 mt-2" onClick={() => {setEditingId(null); setFormData({});}}>Cancel Edit</button>}
                  </form>
                </div>
                <div className="col-md-7">
                  <h4 className="mb-4">Current Subjects</h4>
                  <ul className="list-group">
                    {alSubjects.map(s => {
                      const stream = alStreams.find(st => st.id === s.streamId);
                      return (
                        <li key={s.id} className="list-group-item d-flex justify-content-between align-items-center">
                          <div>
                            <strong>{s.name}</strong> <span className="text-muted small ms-2">({stream?.name || 'Unknown Stream'})</span>
                          </div>
                          <div>
                            <button className="btn btn-sm btn-info text-white me-2" onClick={() => {setEditingId(s.id); setFormData(s);}}><i className="bi bi-pencil"></i></button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDeleteSubject(s.id)}><i className="bi bi-trash"></i></button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}

            {/* RESOURCE TYPES TAB */}
            {activeTab === 'types' && (
              <div className="row">
                <div className="col-md-5">
                  <h4 className="mb-4">Add Resource Type (Global)</h4>
                  <form onSubmit={handleAddResourceType}>
                    <div className="mb-3">
                      <label className="form-label">Type Name</label>
                      <input type="text" className="form-control" name="name" value={formData.name || ''} onChange={handleInputChange} required placeholder="e.g. Text Books" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <input type="text" className="form-control" name="description" value={formData.description || ''} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Icon (Bootstrap class)</label>
                      <input type="text" className="form-control" name="icon" value={formData.icon || ''} onChange={handleInputChange} placeholder="bi-archive" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Order</label>
                      <input type="number" className="form-control" name="order" value={formData.order || 0} onChange={handleInputChange} />
                    </div>
                    {/* Inline Checklist to avoid focus loss */}
                    <div className="mb-3">
                      <label className="form-label d-block">Applicable Subjects</label>
                      <div className="border rounded p-3 bg-light" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {alSubjects.map(sub => (
                          <div key={sub.id} className="form-check">
                            <input 
                              className="form-check-input" 
                              type="checkbox" 
                              id={`check-type-${sub.id}`}
                              checked={(formData.subjectIds || []).includes(sub.id)}
                              onChange={() => handleSubjectToggle(sub.id)}
                            />
                            <label className="form-check-label" htmlFor={`check-type-${sub.id}`}>
                              {sub.name}
                            </label>
                          </div>
                        ))}
                      </div>
                      <small className="text-muted">If none selected, it will show for ALL subjects.</small>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">{editingId ? 'Update Resource Type' : 'Add Resource Type'}</button>
                    {editingId && <button type="button" className="btn btn-outline-secondary w-100 mt-2" onClick={() => {setEditingId(null); setFormData({});}}>Cancel Edit</button>}
                  </form>
                </div>
                <div className="col-md-7">
                  <h4 className="mb-4">Current Types</h4>
                  <ul className="list-group">
                    {alResourceTypes.map(rt => (
                      <li key={rt.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div><strong>{rt.name}</strong></div>
                        <div>
                          <button className="btn btn-sm btn-info text-white me-2" onClick={() => {setEditingId(rt.id); setFormData(rt);}}><i className="bi bi-pencil"></i></button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDeleteResourceType(rt.id)}><i className="bi bi-trash"></i></button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* SUB CATEGORIES TAB */}
            {activeTab === 'subcats' && (
              <div className="row">
                <div className="col-md-5">
                  <h4 className="mb-4">Add Sub Category</h4>
                  <form onSubmit={handleAddSubCategory}>
                    <div className="mb-3">
                      <label className="form-label">Select Resource Type</label>
                      <select className="form-select" name="resourceTypeId" value={formData.resourceTypeId || ''} onChange={handleInputChange} required>
                        <option value="">-- Choose Type --</option>
                        {alResourceTypes.map(rt => <option key={rt.id} value={rt.id}>{rt.name}</option>)}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Sub Category Name</label>
                      <input type="text" className="form-control" name="name" value={formData.name || ''} onChange={handleInputChange} required placeholder="e.g. Resource Books" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Order</label>
                      <input type="number" className="form-control" name="order" value={formData.order || 0} onChange={handleInputChange} />
                    </div>
                    {/* Inline Checklist to avoid focus loss */}
                    <div className="mb-3">
                      <label className="form-label d-block">Applicable Subjects</label>
                      <div className="border rounded p-3 bg-light" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {alSubjects.map(sub => (
                          <div key={sub.id} className="form-check">
                            <input 
                              className="form-check-input" 
                              type="checkbox" 
                              id={`check-sub-${sub.id}`}
                              checked={(formData.subjectIds || []).includes(sub.id)}
                              onChange={() => handleSubjectToggle(sub.id)}
                            />
                            <label className="form-check-label" htmlFor={`check-sub-${sub.id}`}>
                              {sub.name}
                            </label>
                          </div>
                        ))}
                      </div>
                      <small className="text-muted">If none selected, it will show for ALL subjects.</small>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">{editingId ? 'Update Sub Category' : 'Add Sub Category'}</button>
                    {editingId && <button type="button" className="btn btn-outline-secondary w-100 mt-2" onClick={() => {setEditingId(null); setFormData({});}}>Cancel Edit</button>}
                  </form>
                </div>
                <div className="col-md-7">
                  <h4 className="mb-4">Current Sub Categories</h4>
                  <ul className="list-group">
                    {alSubCategories.map(sc => {
                      const rt = alResourceTypes.find(t => t.id === sc.resourceTypeId);
                      return (
                        <li key={sc.id} className="list-group-item d-flex justify-content-between align-items-center">
                          <div>
                            <strong>{sc.name}</strong> <span className="text-muted small ms-2">({rt?.name || 'Unknown Type'})</span>
                          </div>
                          <div>
                            <button className="btn btn-sm btn-info text-white me-2" onClick={() => {setEditingId(sc.id); setFormData(sc);}}><i className="bi bi-pencil"></i></button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDeleteSubCategory(sc.id)}><i className="bi bi-trash"></i></button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}

            {/* RESOURCES UPLOAD TAB */}
            {activeTab === 'resources' && (
              <div className="row">
                <div className="col-md-6 border-end">
                  <h4 className="mb-4">Upload A/L Resource</h4>
                  <form onSubmit={handleAddResource}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Select Stream</label>
                        <select className="form-select" name="alStreamId" value={formData.alStreamId || ''} onChange={handleInputChange} required>
                          <option value="">-- Choose --</option>
                          {alStreams.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Select Subject</label>
                        <select className="form-select" name="alSubjectId" value={formData.alSubjectId || ''} onChange={handleInputChange} required disabled={!formData.alStreamId}>
                          <option value="">-- Choose --</option>
                          {alSubjects.filter(s => s.streamId === formData.alStreamId).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>
                    </div>
                    
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Resource Type</label>
                        <select className="form-select" name="alResourceTypeId" value={formData.alResourceTypeId || ''} onChange={handleInputChange} required>
                          <option value="">-- Choose --</option>
                          {alResourceTypes.map(rt => <option key={rt.id} value={rt.id}>{rt.name}</option>)}
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Sub Category</label>
                        <select className="form-select" name="alSubCategoryId" value={formData.alSubCategoryId || ''} onChange={handleInputChange} required disabled={!formData.alResourceTypeId}>
                          <option value="">-- Choose --</option>
                          {alSubCategories.filter(sc => sc.resourceTypeId === formData.alResourceTypeId).map(sc => <option key={sc.id} value={sc.id}>{sc.name}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Resource Title</label>
                      <input type="text" className="form-control" name="title" value={formData.title || ''} onChange={handleInputChange} required placeholder="e.g. Unit 1 Physics Note" />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Language Medium</label>
                      <select className="form-select" name="language" value={formData.language || ''} onChange={handleInputChange} required>
                        <option value="">-- Choose --</option>
                        <option value="sinhala">Sinhala</option>
                        <option value="tamil">Tamil</option>
                        <option value="english">English</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">File/Google Drive URL</label>
                      <input type="url" className="form-control" name="fileUrl" value={formData.fileUrl || ''} onChange={handleInputChange} required placeholder="https://..." />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">{editingId ? 'Update Resource' : 'Upload Resource'}</button>
                    {editingId && <button type="button" className="btn btn-outline-secondary w-100 mt-2" onClick={() => {setEditingId(null); setFormData({});}}>Cancel Edit</button>}
                  </form>
                </div>
                <div className="col-md-6">
                  <h4 className="mb-4">Recently Uploaded</h4>
                  <ul className="list-group" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    {alResources.slice().sort((a,b) => new Date(b.uploadDate) - new Date(a.uploadDate)).map(r => {
                      const subject = alSubjects.find(s => s.id === r.alSubjectId);
                      return (
                        <li key={r.id} className="list-group-item d-flex justify-content-between align-items-center">
                          <div className="text-truncate me-3">
                            <strong>{r.title}</strong>
                            <div className="text-muted small">{subject?.name || 'Unknown'} - {r.languages?.[0]}</div>
                          </div>
                          <div>
                            <button className="btn btn-sm btn-info text-white me-2" onClick={() => {setEditingId(r.id); setFormData({...r, language: r.languages?.[0]});}}><i className="bi bi-pencil"></i></button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDeleteResource(r.id)}><i className="bi bi-trash"></i></button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}

          </div>
        </div>
  );
};

export default ALAdminTab;
