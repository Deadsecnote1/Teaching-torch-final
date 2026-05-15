import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../context/DataContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Edit3, X, Save, Info } from 'lucide-react';
import { cn } from '../../utils/cn';

const MetadataEditorModal = ({ isOpen, onClose, onSave, title, initialData, type = 'grade' }) => {
  const { grades } = useData();
  
  const resourceTypes = [
    { id: 'textbooks', name: 'Textbooks' },
    { id: 'papers', name: 'Past Papers' },
    { id: 'notes', name: 'Short Notes' },
    { id: 'videos', name: 'Videos' }
  ];

  const [formData, setFormData] = useState({
    display: '',
    shortName: '',
    order: '',
    icon: '',
    color: '',
    description: '',
    subCategories: '',
    isStandalone: false,
    visibleResourceTypes: [],
    parentGradeId: '',
    resourceTypeOrder: ''
  });

  useEffect(() => {
    if (isOpen && initialData) {
      if (type === 'resourceType') {
        setFormData({
          display: initialData.name?.english || initialData.id || '',
          order: initialData.order !== undefined ? initialData.order : '',
          icon: initialData.icon || '',
          color: initialData.color || '',
          description: initialData.description?.english || '',
          subCategories: initialData.subCategories 
            ? initialData.subCategories.map(sc => typeof sc === 'string' ? sc : (sc.name?.english || sc.id)).join(', ') 
            : '',
          isStandalone: initialData.isStandalone || false
        });
      } else if (type === 'subject') {
        setFormData({
          display: initialData.display || initialData.name || '',
          order: initialData.order !== undefined ? initialData.order : '',
          icon: initialData.icon || '',
          resourceTypeOrder: initialData.resourceTypeOrder ? initialData.resourceTypeOrder.join(', ') : ''
        });
      } else {
        setFormData({
          display: initialData.display || initialData.name || '',
          shortName: initialData.shortName || '',
          order: initialData.order !== undefined ? initialData.order : '',
          visibleResourceTypes: initialData.visibleResourceTypes || [],
          parentGradeId: initialData.parentGradeId || ''
        });
      }
    }
  }, [isOpen, initialData, type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === 'resourceType') {
      const subCats = formData.subCategories
        ? formData.subCategories.split(',').map(s => s.trim()).filter(s => s)
        : [];
        
      onSave({
        ...initialData,
        name: { ...initialData.name, english: formData.display },
        icon: formData.icon,
        color: formData.color,
        description: { ...initialData.description, english: formData.description },
        subCategories: subCats.length > 0 ? subCats : null,
        isStandalone: formData.isStandalone,
        order: formData.order
      });
    } else if (type === 'subject') {
      const orderArray = formData.resourceTypeOrder
        ? formData.resourceTypeOrder.split(',').map(s => s.trim()).filter(s => s)
        : null;
      
      onSave({
        ...initialData,
        display: formData.display,
        name: formData.display,
        order: formData.order,
        icon: formData.icon,
        resourceTypeOrder: orderArray
      });
    } else {
      onSave({
        ...initialData,
        display: formData.display,
        name: formData.display, // Keep both for safety
        shortName: formData.shortName,
        order: formData.order,
        visibleResourceTypes: formData.visibleResourceTypes,
        parentGradeId: formData.parentGradeId || null
      });
    }
    onClose();
  };

  const gradeOptions = [
    { value: '', label: 'None (Top Level)' },
    ...Object.values(grades).filter(g => g.id !== initialData?.id && !g.parentGradeId).map(g => ({
      value: g.id,
      label: g.display
    }))
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1070] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-card w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-border flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border bg-bg-secondary/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-text-primary">{title || 'Edit Management'}</h3>
                  <p className="text-xs text-text-muted">Quick Metadata Edit</p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 rounded-full hover:bg-bg-tertiary text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto bg-bg-primary">
              <form id="metadataForm" onSubmit={handleSubmit} className="flex flex-col gap-5">
                
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
                    {type === 'grade' ? 'Grade Name' : type === 'resourceType' ? 'Module Name' : 'Subject Name'}
                  </label>
                  <Input 
                    placeholder={type === 'grade' ? 'e.g. Grade 11' : type === 'resourceType' ? 'e.g. Physics Chamber' : 'e.g. Mathematics'}
                    value={formData.display} 
                    onChange={e => setFormData({ ...formData, display: e.target.value })}
                    required 
                    autoFocus
                  />
                </div>

                {type === 'resourceType' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Icon Class</label>
                        <Input placeholder="bi-archive or lucide" value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Color Class</label>
                        <Input placeholder="text-primary" value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} />
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Description</label>
                      <Input placeholder="Quick description for cards" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center justify-between">
                        Sub-Categories <span className="normal-case font-normal opacity-70">(Optional)</span>
                      </label>
                      <Input placeholder="e.g. Audio, Video, Theory" value={formData.subCategories} onChange={e => setFormData({ ...formData, subCategories: e.target.value })} />
                      <p className="text-[10px] text-text-muted mt-1"><Info className="inline w-3 h-3 mr-1" />Comma-separated list</p>
                    </div>

                    <div className="flex items-center gap-3 bg-bg-secondary p-3 rounded-lg border border-border">
                      <input 
                        type="checkbox" 
                        id="modalSwitchStandalone" 
                        className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                        checked={formData.isStandalone} 
                        onChange={e => setFormData({ ...formData, isStandalone: e.target.checked })} 
                      />
                      <label htmlFor="modalSwitchStandalone" className="text-sm font-medium text-text-primary cursor-pointer select-none">
                        Is Standalone Module?
                      </label>
                    </div>
                  </>
                )}

                {type === 'grade' && (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center justify-between">
                      Parent Grade <span className="normal-case font-normal opacity-70">(Optional)</span>
                    </label>
                    <Select 
                      options={gradeOptions}
                      value={formData.parentGradeId || ''} 
                      onChange={e => setFormData({ ...formData, parentGradeId: e.target.value })}
                    />
                    <p className="text-[10px] text-text-muted mt-1"><Info className="inline w-3 h-3 mr-1" />Select a parent to nest this grade (e.g. Science Stream under A/L).</p>
                  </div>
                )}

                {type === 'subject' && (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Module Priority / Order</label>
                    <Input 
                      placeholder="e.g. textbooks, papers, physics_chamber"
                      value={formData.resourceTypeOrder || ''} 
                      onChange={e => setFormData({ ...formData, resourceTypeOrder: e.target.value })}
                    />
                    <p className="text-[10px] text-text-muted mt-1"><Info className="inline w-3 h-3 mr-1" />Comma-separated IDs to define priority and visibility for this subject.</p>
                  </div>
                )}

                {type === 'grade' && (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center justify-between">
                      Short Name / Initials <span className="normal-case font-normal opacity-70">(Optional)</span>
                    </label>
                    <Input 
                      placeholder="e.g. AL or SC"
                      value={formData.shortName || ''} 
                      onChange={e => setFormData({ ...formData, shortName: e.target.value })}
                    />
                    <p className="text-[10px] text-text-muted mt-1"><Info className="inline w-3 h-3 mr-1" />This appears in the colored box on the Home page. Leave blank to auto-generate.</p>
                  </div>
                )}

                {type === 'grade' && (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Visible Resource Types</label>
                    <div className="grid grid-cols-2 gap-3">
                      {resourceTypes.map(rt => (
                        <label key={rt.id} className="flex items-center gap-3 bg-bg-secondary border border-border p-3 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                          <input 
                            type="checkbox" 
                            className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                            checked={!formData.visibleResourceTypes || formData.visibleResourceTypes.length === 0 || formData.visibleResourceTypes.includes(rt.id)}
                            onChange={e => {
                              let newVisible = formData.visibleResourceTypes || [];
                              if (newVisible.length === 0) newVisible = resourceTypes.map(t => t.id);
                              
                              if (e.target.checked) newVisible = [...newVisible, rt.id];
                              else newVisible = newVisible.filter(id => id !== rt.id);
                              
                              setFormData({ ...formData, visibleResourceTypes: newVisible });
                            }}
                          />
                          <span className="text-sm font-medium text-text-primary select-none">{rt.name?.english || rt.id}</span>
                        </label>
                      ))}
                    </div>
                    <p className="text-[10px] text-text-muted mt-2"><Info className="inline w-3 h-3 mr-1" />Uncheck types you want to hide from this specific grade.</p>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Display Order</label>
                  <Input 
                    type="number" 
                    placeholder="e.g. 1"
                    value={formData.order} 
                    onChange={e => setFormData({ ...formData, order: e.target.value })}
                  />
                  <p className="text-[10px] text-text-muted mt-1"><Info className="inline w-3 h-3 mr-1" />Lower numbers appear first in the navigation.</p>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-border bg-bg-secondary/50 flex items-center justify-end gap-3">
              <Button variant="outline" onClick={onClose} className="px-6">
                Cancel
              </Button>
              <Button form="metadataForm" type="submit" className="px-6 bg-primary hover:bg-primary-dark text-white">
                <Save className="w-4 h-4 mr-2" /> Save Changes
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MetadataEditorModal;
