import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';

/**
 * A specialized modal for editing Metadata (Grades and Subjects)
 * Replaces the basic window.prompt with a premium UI.
 */
const MetadataEditorModal = ({ isOpen, onClose, onSave, title, initialData, type = 'grade' }) => {
  const { resourceTypes, grades } = useData();
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

  if (!isOpen) return null;

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

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1070, backdropFilter: 'blur(10px)' }}>
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '480px' }}>
        <div className="modal-content border-0 shadow-2xl rounded-4 overflow-hidden" style={{ backgroundColor: '#1e293b' }}>
          {/* Header - Matching ResourceEditorModal */}
          <div className="modal-header py-3 px-4 border-0" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
            <h5 className="modal-title d-flex align-items-center gap-3">
              <div className="p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', boxShadow: 'inset 0 0 10px rgba(56, 189, 248, 0.2)' }}>
                <i className="bi bi-pencil-square fs-5"></i>
              </div>
              <div>
                <span className="d-block h6 mb-0 fw-bold text-white tracking-wide">{title || 'Edit Management'}</span>
                <small style={{ fontSize: '0.7rem', color: '#94a3b8', letterSpacing: '0.05em' }}>Quick Metadata Edit</small>
              </div>
            </h5>
            <button type="button" className="btn-close btn-close-white shadow-none opacity-75 custom-close" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit} style={{ backgroundColor: '#0f172a' }}>
            <div className="modal-body p-4">
              <div className="section-container p-4 rounded-4 dark-panel border-glow mb-4">
                <div className="mb-4 custom-form-group">
                  <label className="form-label ms-1">
                    {type === 'grade' ? 'Grade Name' : type === 'resourceType' ? 'Module Name' : 'Subject Name'}
                  </label>
                  <input 
                    type="text" 
                    className="form-control form-control-lg dark-input" 
                    placeholder={type === 'grade' ? 'e.g. Grade 11' : type === 'resourceType' ? 'e.g. Physics Chamber' : 'e.g. Mathematics'}
                    value={formData.display} 
                    onChange={e => setFormData({ ...formData, display: e.target.value })}
                    required 
                    autoFocus
                  />
                </div>

                {type === 'resourceType' && (
                  <>
                    <div className="row g-3 mb-4">
                      <div className="col-6">
                        <label className="form-label ms-1">Icon Class</label>
                        <input type="text" className="form-control dark-input" placeholder="bi-archive" value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} />
                      </div>
                      <div className="col-6">
                        <label className="form-label ms-1">Color Class</label>
                        <input type="text" className="form-control dark-input" placeholder="text-primary" value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} />
                      </div>
                    </div>
                    <div className="mb-4 custom-form-group">
                      <label className="form-label ms-1">Description</label>
                      <input type="text" className="form-control dark-input" placeholder="Quick description for cards" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                    </div>
                    <div className="mb-4 custom-form-group">
                      <label className="form-label ms-1">Sub-Categories <span className="text-secondary fw-normal">(Optional)</span></label>
                      <input type="text" className="form-control dark-input" placeholder="e.g. Audio, Video, Theory" value={formData.subCategories} onChange={e => setFormData({ ...formData, subCategories: e.target.value })} />
                      <small className="text-muted mt-2 d-block ms-1" style={{ fontSize: '0.75rem', color: '#64748b !important' }}>Comma-separated list</small>
                    </div>
                    <div className="mb-4 custom-form-group">
                      <div className="form-check form-switch pt-1 ms-1">
                        <input className="form-check-input" type="checkbox" id="modalSwitchStandalone" checked={formData.isStandalone} onChange={e => setFormData({ ...formData, isStandalone: e.target.checked })} />
                        <label className="form-check-label text-white" htmlFor="modalSwitchStandalone">Is Standalone Module?</label>
                      </div>
                    </div>
                  </>
                )}

                {type === 'grade' && (
                  <div className="mb-4 custom-form-group">
                    <label className="form-label ms-1">Parent Grade <span className="text-secondary fw-normal">(Optional)</span></label>
                    <select 
                      className="form-select dark-input" 
                      value={formData.parentGradeId || ''} 
                      onChange={e => setFormData({ ...formData, parentGradeId: e.target.value })}
                    >
                      <option value="">None (Top Level)</option>
                      {Object.values(grades).filter(g => g.id !== initialData?.id && !g.parentGradeId).map(g => (
                        <option key={g.id} value={g.id}>{g.display}</option>
                      ))}
                    </select>
                    <small className="text-muted mt-2 d-block ms-1" style={{ fontSize: '0.75rem', color: '#64748b !important' }}>
                      <i className="bi bi-info-circle me-1"></i>
                      Select a parent to nest this grade (e.g. Science Stream under A/L).
                    </small>
                  </div>
                )}

                {type === 'subject' && (
                  <div className="mb-4 custom-form-group">
                    <label className="form-label ms-1">Module Priority / Order</label>
                    <input 
                      type="text" 
                      className="form-control dark-input" 
                      placeholder="e.g. textbooks, papers, physics_chamber"
                      value={formData.resourceTypeOrder || ''} 
                      onChange={e => setFormData({ ...formData, resourceTypeOrder: e.target.value })}
                    />
                    <small className="text-muted mt-2 d-block ms-1" style={{ fontSize: '0.75rem', color: '#64748b !important' }}>
                      <i className="bi bi-info-circle me-1"></i>
                      Comma-separated IDs to define priority and visibility for this subject.
                    </small>
                  </div>
                )}

                {type === 'grade' && (
                  <div className="mb-4 custom-form-group">
                    <label className="form-label ms-1">Short Name / Initials <span className="text-secondary fw-normal">(Optional)</span></label>
                    <input 
                      type="text" 
                      className="form-control dark-input" 
                      placeholder="e.g. AL or SC"
                      value={formData.shortName || ''} 
                      onChange={e => setFormData({ ...formData, shortName: e.target.value })}
                    />
                    <small className="text-muted mt-2 d-block ms-1" style={{ fontSize: '0.75rem', color: '#64748b !important' }}>
                      <i className="bi bi-info-circle me-1"></i>
                      This appears in the colored box on the Home page. Leaves blank to auto-generate.
                    </small>
                  </div>
                )}

                {type === 'grade' && (
                  <div className="mb-4 custom-form-group">
                    <label className="form-label ms-1 d-block mb-3">Visible Resource Types</label>
                    <div className="row g-2">
                      {resourceTypes.map(rt => (
                        <div key={rt.id} className="col-6">
                          <div className="form-check form-switch p-2 rounded bg-dark border-secondary border opacity-75">
                            <input 
                              className="form-check-input ms-0" 
                              type="checkbox" 
                              id={`check_rt_${rt.id}`} 
                              checked={!formData.visibleResourceTypes || formData.visibleResourceTypes.length === 0 || formData.visibleResourceTypes.includes(rt.id)}
                              onChange={e => {
                                let newVisible = formData.visibleResourceTypes || [];
                                // If it was "all" (empty array), populate it first
                                if (newVisible.length === 0) {
                                  newVisible = resourceTypes.map(t => t.id);
                                }
                                
                                if (e.target.checked) {
                                  newVisible = [...newVisible, rt.id];
                                } else {
                                  newVisible = newVisible.filter(id => id !== rt.id);
                                }
                                setFormData({ ...formData, visibleResourceTypes: newVisible });
                              }}
                            />
                            <label className="form-check-label text-white small ms-2" htmlFor={`check_rt_${rt.id}`}>
                              {rt.name?.english || rt.id}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                    <small className="text-muted mt-2 d-block ms-1" style={{ fontSize: '0.7rem' }}>
                      <i className="bi bi-info-circle me-1"></i>
                      Uncheck types you want to hide from this specific grade.
                    </small>
                  </div>
                )}

                <div className="mb-0 custom-form-group">
                  <label className="form-label ms-1">Display Order</label>
                  <div className="input-group input-group-lg">
                    <span className="input-group-text dark-input-group-text"><i className="bi bi-sort-numeric-down fs-5"></i></span>
                    <input 
                      type="number" 
                      className="form-control dark-input" 
                      placeholder="e.g. 1"
                      value={formData.order} 
                      onChange={e => setFormData({ ...formData, order: e.target.value })}
                    />
                  </div>
                  <small className="text-muted mt-2 d-block ms-1" style={{ fontSize: '0.75rem', color: '#64748b !important' }}>
                    <i className="bi bi-info-circle me-1"></i>
                    Lower numbers appear first in the navigation.
                  </small>
                </div>
              </div>
            </div>

            <div className="modal-footer border-0 p-4 pt-1 flex-nowrap" style={{ backgroundColor: '#0f172a' }}>
              <button type="button" className="btn btn-outline-secondary btn-lg px-4 fw-bold rounded-3 me-auto border-2 btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-lg px-5 fw-bold rounded-3 btn-glow position-relative overflow-hidden">
                <span className="d-flex align-items-center gap-2">
                  Save Changes <i className="bi bi-check-lg fs-5"></i>
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .shadow-2xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(56, 189, 248, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }

        .dark-panel {
          background-color: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
        }

        .dark-input {
          background-color: rgba(15, 23, 42, 0.6) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: #f8fafc !important;
          transition: all 0.2s ease;
        }

        .dark-input:focus {
          border-color: #38bdf8 !important;
          box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15) !important;
          background-color: rgba(15, 23, 42, 0.9) !important;
        }

        .dark-input-group-text {
          background-color: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-right: none;
          color: #94a3b8;
        }

        .custom-form-group .form-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #cbd5e1;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .btn-cancel {
          color: #94a3b8;
          border-color: rgba(255,255,255,0.1);
        }
        
        .btn-cancel:hover {
          background-color: rgba(255,255,255,0.05);
          color: #f8fafc;
          border-color: rgba(255,255,255,0.2);
        }

        .btn-glow {
          box-shadow: 0 4px 15px rgba(13, 110, 253, 0.3);
          transition: all 0.3s ease;
        }

        .btn-glow:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(13, 110, 253, 0.4);
        }

        .tracking-wide { letter-spacing: 0.025em; }
        
        .modal-header {
           user-select: none;
        }
      `}</style>
    </div>
  );
};

export default MetadataEditorModal;
