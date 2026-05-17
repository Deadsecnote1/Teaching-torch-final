import React, { useState } from 'react';
import { useALData } from '../../features/al';
import toast from 'react-hot-toast';
import { isValidHttpsUrl } from '../../utils/validation';
import { Layers, Book, Archive, FolderTree, UploadCloud, Pencil, Trash2, CheckCircle } from 'lucide-react';
import { getLucideIcon } from '../../utils/iconUtils';

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
        icon: formData.icon || 'layers',
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
        icon: formData.icon || 'book',
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
        icon: formData.icon || 'archive',
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
      if (formData.fileUrl && !isValidHttpsUrl(formData.fileUrl.trim())) {
        toast.error('Please enter a valid secure URL starting with https://');
        return;
      }
      const data = {
        title: formData.title,
        description: formData.description || '',
        fileUrl: formData.fileUrl,
        alStreamId: formData.alStreamId,
        alSubjectId: formData.alSubjectId,
        alResourceTypeId: formData.alResourceTypeId,
        alSubCategoryId: formData.alSubCategoryId,
        mediaType: formData.mediaType || '', // Empty means auto-detect
        languages: [formData.language], // Support single language selection for now
        order: parseInt(formData.order) || 0,
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

  const handleSelectAllSubjects = (checked) => {
    if (checked) {
      setFormData({ ...formData, subjectIds: alSubjects.map(s => s.id) });
    } else {
      setFormData({ ...formData, subjectIds: [] });
    }
  };

  const handleDeleteResource = async (id) => {
    if(window.confirm('Delete resource?')) {
      await deleteDocument('al_resources', id);
      toast.success('Resource deleted');
    }
  };

  const tabs = [
    { id: 'streams', label: 'Streams', icon: <Layers className="w-4 h-4 mr-2" /> },
    { id: 'subjects', label: 'Subjects', icon: <Book className="w-4 h-4 mr-2" /> },
    { id: 'types', label: 'Resource Types', icon: <Archive className="w-4 h-4 mr-2" /> },
    { id: 'subcats', label: 'Sub Categories', icon: <FolderTree className="w-4 h-4 mr-2" /> },
    { id: 'resources', label: 'Upload Resources', icon: <UploadCloud className="w-4 h-4 mr-2" /> },
  ];

  return (
    <div className="bg-bg-primary rounded-xl border border-border shadow-sm overflow-hidden min-h-[600px] flex flex-col">
      <div className="border-b border-border bg-bg-secondary/50 px-2 sm:px-6 pt-4 flex overflow-x-auto scrollbar-hide">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            className={`flex items-center whitespace-nowrap py-3 px-4 font-medium text-sm border-b-2 transition-colors ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-primary hover:border-border'}`} 
            onClick={() => {setActiveTab(tab.id); setFormData({}); setEditingId(null);}}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="p-6 flex-1 bg-bg-primary">
        
        {/* STREAMS TAB */}
        {activeTab === 'streams' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-border pb-8 lg:pb-0 lg:pr-8">
              <h4 className="text-xl font-bold text-text-primary mb-6">{editingId ? 'Edit Stream' : 'Add Stream'}</h4>
              <form onSubmit={handleAddStream} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1">Stream Name</label>
                  <input type="text" className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" name="name" value={formData.name || ''} onChange={handleInputChange} required placeholder="e.g. Science" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1">Description</label>
                  <input type="text" className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" name="description" value={formData.description || ''} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1">Icon (Lucide name)</label>
                  <input type="text" className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" name="icon" value={formData.icon || ''} onChange={handleInputChange} placeholder="layers" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1">Color (CSS var name)</label>
                  <input type="text" className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" name="color" value={formData.color || ''} onChange={handleInputChange} placeholder="primary" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1">Order</label>
                  <input type="number" className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" name="order" value={formData.order || 0} onChange={handleInputChange} />
                </div>
                <div className="pt-2">
                  <button type="submit" className="w-full py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors">{editingId ? 'Update Stream' : 'Add Stream'}</button>
                  {editingId && <button type="button" className="w-full mt-2 py-2.5 bg-bg-secondary text-text-primary border border-border font-medium rounded-lg hover:bg-border transition-colors" onClick={() => {setEditingId(null); setFormData({});}}>Cancel Edit</button>}
                </div>
              </form>
            </div>
            <div className="lg:col-span-7">
              <h4 className="text-xl font-bold text-text-primary mb-6">Current Streams</h4>
              <div className="space-y-3">
                {alStreams.map(s => (
                  <div key={s.id} className="flex justify-between items-center p-4 bg-bg-secondary border border-border rounded-lg hover:border-primary/30 transition-colors">
                    <div>
                      <strong className="text-text-primary block">{s.name}</strong>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-bg-tertiary border border-border rounded text-xs font-medium text-text-muted">Order: {s.order}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-info hover:bg-info/10 rounded-md transition-colors" onClick={() => {setEditingId(s.id); setFormData(s);}}><Pencil className="w-4 h-4" /></button>
                      <button className="p-2 text-danger hover:bg-danger/10 rounded-md transition-colors" onClick={() => handleDeleteStream(s.id)}><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUBJECTS TAB */}
        {activeTab === 'subjects' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-border pb-8 lg:pb-0 lg:pr-8">
              <h4 className="text-xl font-bold text-text-primary mb-6">{editingId ? 'Edit Subject' : 'Add Subject'}</h4>
              <form onSubmit={handleAddSubject} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1">Select Stream</label>
                  <select className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none" name="streamId" value={formData.streamId || ''} onChange={handleInputChange} required>
                    <option value="">-- Choose Stream --</option>
                    {alStreams.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1">Subject Name</label>
                  <input type="text" className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" name="name" value={formData.name || ''} onChange={handleInputChange} required placeholder="e.g. Physics" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1">Icon (Lucide name)</label>
                  <input type="text" className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" name="icon" value={formData.icon || ''} onChange={handleInputChange} placeholder="book" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1">Order</label>
                  <input type="number" className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" name="order" value={formData.order || 0} onChange={handleInputChange} />
                </div>
                <div className="pt-2">
                  <button type="submit" className="w-full py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors">{editingId ? 'Update Subject' : 'Add Subject'}</button>
                  {editingId && <button type="button" className="w-full mt-2 py-2.5 bg-bg-secondary text-text-primary border border-border font-medium rounded-lg hover:bg-border transition-colors" onClick={() => {setEditingId(null); setFormData({});}}>Cancel Edit</button>}
                </div>
              </form>
            </div>
            <div className="lg:col-span-7">
              <h4 className="text-xl font-bold text-text-primary mb-6">Current Subjects</h4>
              <div className="space-y-3">
                {alSubjects.filter(s => alStreams.some(st => st.id === s.streamId)).map(s => {
                  const stream = alStreams.find(st => st.id === s.streamId);
                  return (
                    <div key={s.id} className="flex justify-between items-center p-4 bg-bg-secondary border border-border rounded-lg hover:border-primary/30 transition-colors">
                      <div>
                        <strong className="text-text-primary block">{s.name}</strong>
                        <span className="inline-block mt-1 text-xs text-text-muted bg-bg-tertiary px-2 py-0.5 rounded border border-border">{stream?.name || 'Unknown Stream'}</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-info hover:bg-info/10 rounded-md transition-colors" onClick={() => {setEditingId(s.id); setFormData(s);}}><Pencil className="w-4 h-4" /></button>
                        <button className="p-2 text-danger hover:bg-danger/10 rounded-md transition-colors" onClick={() => handleDeleteSubject(s.id)}><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* RESOURCE TYPES TAB */}
        {activeTab === 'types' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-border pb-8 lg:pb-0 lg:pr-8">
              <h4 className="text-xl font-bold text-text-primary mb-6">{editingId ? 'Edit Resource Type' : 'Add Resource Type'}</h4>
              <form onSubmit={handleAddResourceType} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1">Type Name</label>
                  <input type="text" className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" name="name" value={formData.name || ''} onChange={handleInputChange} required placeholder="e.g. Text Books" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1">Description</label>
                  <input type="text" className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" name="description" value={formData.description || ''} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1">Icon (Lucide name)</label>
                  <input type="text" className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" name="icon" value={formData.icon || ''} onChange={handleInputChange} placeholder="archive" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1">Order</label>
                  <input type="number" className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" name="order" value={formData.order || 0} onChange={handleInputChange} />
                </div>
                {/* Inline Checklist */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-text-primary">Applicable Subjects</label>
                    <label className="flex items-center cursor-pointer group">
                      <input 
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer" 
                        type="checkbox" 
                        checked={formData.subjectIds?.length === alSubjects.length && alSubjects.length > 0}
                        onChange={(e) => handleSelectAllSubjects(e.target.checked)}
                      />
                      <span className="ml-2 text-xs font-medium text-text-primary group-hover:text-primary transition-colors">Select All (Global)</span>
                    </label>
                  </div>
                  <div className="border border-border rounded-lg p-3 bg-bg-secondary max-h-[200px] overflow-y-auto space-y-2">
                    {alSubjects.filter(s => alStreams.some(st => st.id === s.streamId)).map(sub => (
                      <label key={sub.id} className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer" 
                          type="checkbox" 
                          checked={(formData.subjectIds || []).includes(sub.id)}
                          onChange={() => handleSubjectToggle(sub.id)}
                        />
                        <span className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">{sub.name}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-text-muted mt-1.5">If none selected, it will show for ALL subjects.</p>
                </div>
                <div className="pt-2">
                  <button type="submit" className="w-full py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors">{editingId ? 'Update Resource Type' : 'Add Resource Type'}</button>
                  {editingId && <button type="button" className="w-full mt-2 py-2.5 bg-bg-secondary text-text-primary border border-border font-medium rounded-lg hover:bg-border transition-colors" onClick={() => {setEditingId(null); setFormData({});}}>Cancel Edit</button>}
                </div>
              </form>
            </div>
            <div className="lg:col-span-7">
              <h4 className="text-xl font-bold text-text-primary mb-6">Current Types</h4>
              <div className="space-y-3">
                {alResourceTypes.map(rt => (
                  <div key={rt.id} className="flex justify-between items-center p-4 bg-bg-secondary border border-border rounded-lg hover:border-primary/30 transition-colors">
                    <div><strong className="text-text-primary">{rt.name}</strong></div>
                    <div className="flex gap-2">
                      <button className="p-2 text-info hover:bg-info/10 rounded-md transition-colors" onClick={() => {setEditingId(rt.id); setFormData(rt);}}><Pencil className="w-4 h-4" /></button>
                      <button className="p-2 text-danger hover:bg-danger/10 rounded-md transition-colors" onClick={() => handleDeleteResourceType(rt.id)}><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUB CATEGORIES TAB */}
        {activeTab === 'subcats' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-border pb-8 lg:pb-0 lg:pr-8">
              <h4 className="text-xl font-bold text-text-primary mb-6">{editingId ? 'Edit Sub Category' : 'Add Sub Category'}</h4>
              <form onSubmit={handleAddSubCategory} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1">Select Resource Type</label>
                  <select className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none" name="resourceTypeId" value={formData.resourceTypeId || ''} onChange={handleInputChange} required>
                    <option value="">-- Choose Type --</option>
                    {alResourceTypes.map(rt => <option key={rt.id} value={rt.id}>{rt.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1">Sub Category Name</label>
                  <input type="text" className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" name="name" value={formData.name || ''} onChange={handleInputChange} required placeholder="e.g. Resource Books" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1">Order</label>
                  <input type="number" className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" name="order" value={formData.order || 0} onChange={handleInputChange} />
                </div>
                {/* Inline Checklist */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-text-primary">Applicable Subjects</label>
                    <label className="flex items-center cursor-pointer group">
                      <input 
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer" 
                        type="checkbox" 
                        checked={formData.subjectIds?.length === alSubjects.length && alSubjects.length > 0}
                        onChange={(e) => handleSelectAllSubjects(e.target.checked)}
                      />
                      <span className="ml-2 text-xs font-medium text-text-primary group-hover:text-primary transition-colors">Select All (Global)</span>
                    </label>
                  </div>
                  <div className="border border-border rounded-lg p-3 bg-bg-secondary max-h-[200px] overflow-y-auto space-y-2">
                    {alSubjects.filter(s => alStreams.some(st => st.id === s.streamId)).map(sub => (
                      <label key={sub.id} className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer" 
                          type="checkbox" 
                          checked={(formData.subjectIds || []).includes(sub.id)}
                          onChange={() => handleSubjectToggle(sub.id)}
                        />
                        <span className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">{sub.name}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-text-muted mt-1.5">If none selected, it will show for ALL subjects.</p>
                </div>
                <div className="pt-2">
                  <button type="submit" className="w-full py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors">{editingId ? 'Update Sub Category' : 'Add Sub Category'}</button>
                  {editingId && <button type="button" className="w-full mt-2 py-2.5 bg-bg-secondary text-text-primary border border-border font-medium rounded-lg hover:bg-border transition-colors" onClick={() => {setEditingId(null); setFormData({});}}>Cancel Edit</button>}
                </div>
              </form>
            </div>
            <div className="lg:col-span-7">
              <h4 className="text-xl font-bold text-text-primary mb-6">Current Sub Categories</h4>
              <div className="space-y-3">
                {alSubCategories.map(sc => {
                  const rt = alResourceTypes.find(t => t.id === sc.resourceTypeId);
                  return (
                    <div key={sc.id} className="flex justify-between items-center p-4 bg-bg-secondary border border-border rounded-lg hover:border-primary/30 transition-colors">
                      <div>
                        <strong className="text-text-primary block">{sc.name}</strong>
                        <span className="inline-block mt-1 text-xs text-text-muted bg-bg-tertiary px-2 py-0.5 rounded border border-border">{rt?.name || 'Unknown Type'}</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-info hover:bg-info/10 rounded-md transition-colors" onClick={() => {setEditingId(sc.id); setFormData(sc);}}><Pencil className="w-4 h-4" /></button>
                        <button className="p-2 text-danger hover:bg-danger/10 rounded-md transition-colors" onClick={() => handleDeleteSubCategory(sc.id)}><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* RESOURCES UPLOAD TAB */}
        {activeTab === 'resources' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 border-b lg:border-b-0 lg:border-r border-border pb-8 lg:pb-0 lg:pr-8">
              <h4 className="text-xl font-bold text-text-primary mb-6">{editingId ? 'Edit Resource' : 'Upload A/L Resource'}</h4>
              <form onSubmit={handleAddResource} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1">Select Stream</label>
                    <select className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none" name="alStreamId" value={formData.alStreamId || ''} onChange={handleInputChange} required>
                      <option value="">-- Choose --</option>
                      {alStreams.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1">Select Subject</label>
                    <select className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none disabled:opacity-50" name="alSubjectId" value={formData.alSubjectId || ''} onChange={handleInputChange} required disabled={!formData.alStreamId}>
                      <option value="">-- Choose --</option>
                      {alSubjects
                        .filter(s => s.streamId === formData.alStreamId)
                        .map(s => <option key={s.id} value={s.id}>{s.name}</option>)
                      }
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1">Resource Type</label>
                    <select className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none" name="alResourceTypeId" value={formData.alResourceTypeId || ''} onChange={handleInputChange} required>
                      <option value="">-- Choose --</option>
                      {alResourceTypes.map(rt => <option key={rt.id} value={rt.id}>{rt.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1">Sub Category</label>
                    <select className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none disabled:opacity-50" name="alSubCategoryId" value={formData.alSubCategoryId || ''} onChange={handleInputChange} required disabled={!formData.alResourceTypeId}>
                      <option value="">-- Choose --</option>
                      {alSubCategories
                        .filter(sc => sc.resourceTypeId === formData.alResourceTypeId)
                        .filter(sc => !sc.subjectIds || sc.subjectIds.length === 0 || (formData.alSubjectId && sc.subjectIds.includes(formData.alSubjectId)))
                        .map(sc => <option key={sc.id} value={sc.id}>{sc.name}</option>)
                      }
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1">Resource Title</label>
                  <input type="text" className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" name="title" value={formData.title || ''} onChange={handleInputChange} required placeholder="e.g. Unit 1 Physics Note" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1">Language Medium</label>
                  <select className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none" name="language" value={formData.language || ''} onChange={handleInputChange} required>
                    <option value="">-- Choose --</option>
                    <option value="sinhala">Sinhala</option>
                    <option value="tamil">Tamil</option>
                    <option value="english">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1">File/Google Drive URL</label>
                  <input type="url" className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" name="fileUrl" value={formData.fileUrl || ''} onChange={handleInputChange} required placeholder="https://..." />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1">Media Type (Optional)</label>
                    <select 
                      className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none" 
                      name="mediaType" 
                      value={formData.mediaType || ''} 
                      onChange={handleInputChange}
                    >
                      <option value="">Auto Detect</option>
                      <option value="document">Document (PDF/Word)</option>
                      <option value="video">Video (YouTube/MP4)</option>
                      <option value="audio">Audio (MP3/WAV)</option>
                      <option value="image">Image</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1">Priority / Order</label>
                    <input type="number" className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" name="order" value={formData.order || 0} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="pt-2">
                  <button type="submit" className="w-full py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors flex justify-center items-center">
                    {editingId ? <><CheckCircle className="w-5 h-5 mr-2" /> Update Resource</> : <><UploadCloud className="w-5 h-5 mr-2" /> Upload Resource</>}
                  </button>
                  {editingId && <button type="button" className="w-full mt-2 py-2.5 bg-bg-secondary text-text-primary border border-border font-medium rounded-lg hover:bg-border transition-colors" onClick={() => {setEditingId(null); setFormData({});}}>Cancel Edit</button>}
                </div>
              </form>
            </div>
            <div className="lg:col-span-6">
              <h4 className="text-xl font-bold text-text-primary mb-6">Recently Uploaded</h4>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {alResources.slice().sort((a,b) => new Date(b.uploadDate) - new Date(a.uploadDate)).map(r => {
                  const subject = alSubjects.find(s => s.id === r.alSubjectId);
                  return (
                    <div key={r.id} className="flex justify-between items-center p-4 bg-bg-secondary border border-border rounded-lg hover:border-primary/30 transition-colors">
                      <div className="truncate mr-4 flex-1">
                        <strong className="text-text-primary text-sm block truncate">{r.title}</strong>
                        <div className="text-text-muted text-xs mt-1">{subject?.name || 'Unknown'} - <span className="capitalize">{r.languages?.[0]}</span></div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button className="p-2 text-info hover:bg-info/10 rounded-md transition-colors" onClick={() => {setEditingId(r.id); setFormData({...r, language: r.languages?.[0]});}}><Pencil className="w-4 h-4" /></button>
                        <button className="p-2 text-danger hover:bg-danger/10 rounded-md transition-colors" onClick={() => handleDeleteResource(r.id)}><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ALAdminTab;
