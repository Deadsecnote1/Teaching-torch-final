import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import toast from 'react-hot-toast';

const ResourceEditorModal = ({ resource, isOpen, onClose }) => {
  const { 
    grades, 
    getSubjectsForGrade, 
    updateResource, 
    addTextbook,
    addPaper,
    addVideo,
    addNote,
    isSubmitting: globalSubmitting,
    fetchAllResources
  } = useData();
  const [formData, setFormData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (resource) {
        setFormData({
          id: resource.id,
          title: resource.title || resource.name || '',
          description: resource.description || '',
          url: resource.url || resource.driveLink || resource.youtubeUrl || '',
          languages: resource.languages || (resource.language ? [resource.language] : ['english']),
          order: resource.order || '',
          subject: resource.subject || '',
          grade: resource.grade || '',
          resourceType: resource.resourceType || 'textbook'
        });
      } else {
        // Initial state for NEW resource
        setFormData({
          title: '',
          description: '',
          url: '',
          languages: ['sinhala', 'tamil', 'english'],
          order: '',
          subject: '',
          grade: '',
          resourceType: 'textbook'
        });
      }
    }
  }, [resource, isOpen]);

  if (!isOpen || !formData) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (formData.id) {
        await updateResource(formData.id, formData);
        toast.success('Resource updated successfully!');
      } else {
        // Handle ADD based on type
        const type = formData.resourceType;
        if (type === 'textbook') await addTextbook(formData);
        else if (type === 'papers') await addPaper(formData);
        else if (type === 'videos') await addVideo(formData);
        else if (type === 'notes') await addNote(formData);
        
        toast.success('Resource added successfully!');
        if (fetchAllResources) await fetchAllResources(true);
      }
      onClose();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const subjects = getSubjectsForGrade(formData.grade) || {};

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1060, backdropFilter: 'blur(4px)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow-2xl rounded-4 overflow-hidden" style={{ backgroundColor: '#1e293b' }}>
          {/* Enhanced Header - Deep Slate Gradient */}
          <div className="modal-header py-3 px-4 border-0" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
            <h5 className="modal-title d-flex align-items-center gap-3">
              <div className="p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', boxShadow: 'inset 0 0 10px rgba(56, 189, 248, 0.2)' }}>
                <i className={`bi ${formData.id ? 'bi-pencil-fill' : 'bi-plus-lg'} fs-5`}></i>
              </div>
              <div>
                <span className="d-block h5 mb-0 fw-bold text-white tracking-wide">{formData.id ? 'Edit' : 'Add New'} Resource</span>
                <small style={{ fontSize: '0.75rem', color: '#94a3b8', letterSpacing: '0.05em' }}>Management Mode Active</small>
              </div>
            </h5>
            <button type="button" className="btn-close btn-close-white shadow-none opacity-75 custom-close" onClick={onClose} disabled={isSubmitting}></button>
          </div>

          <form onSubmit={handleSubmit} style={{ backgroundColor: '#0f172a' }}>
            <div className="modal-body p-4" style={{ maxHeight: '78vh', overflowY: 'auto' }}>
              
              {/* Grid Layout */}
              <div className="row g-4">
                
                {/* Main Content Area */}
                <div className="col-lg-7">
                  <div className="section-container p-4 rounded-4 h-100 dark-panel border-glow">
                    <h6 className="section-title text-uppercase mb-4"><i className="bi bi-info-circle me-2 text-info"></i>Resource Details</h6>
                    
                    <div className="mb-4 custom-form-group">
                      <label className="form-label ms-1">Resource Title</label>
                      <input 
                        type="text" 
                        className="form-control form-control-lg dark-input" 
                        placeholder="e.g. Combined Maths - Integration"
                        value={formData.title} 
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        required 
                      />
                    </div>
                    
                    <div className="mb-4 custom-form-group">
                      <label className="form-label ms-1">Resource Link</label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text dark-input-group-text"><i className="bi bi-link-45deg fs-5"></i></span>
                        <input 
                          type="text" 
                          className="form-control dark-input" 
                          placeholder="Google Drive or YouTube URL"
                          value={formData.url} 
                          onChange={e => setFormData({ ...formData, url: e.target.value })}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="mb-0 custom-form-group">
                      <label className="form-label ms-1">Short Description <span className="text-secondary fw-normal">(Optional)</span></label>
                      <textarea 
                        className="form-control dark-input slim-scroll" 
                        rows="3" 
                        placeholder="Tell students about this resource..."
                        value={formData.description} 
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Sidebar Configuration Area */}
                <div className="col-lg-5">
                  <div className="d-flex flex-column gap-4 h-100">
                    
                    <div className="section-container p-4 rounded-4 dark-panel border-glow">
                      <h6 className="section-title text-uppercase mb-4"><i className="bi bi-tags me-2" style={{ color: '#34d399' }}></i>Categorization</h6>
                      
                      <div className="mb-3 custom-form-group">
                        <label className="form-label ms-1">Grade Level</label>
                        <select 
                          className="form-select dark-select" 
                          value={formData.grade} 
                          onChange={e => {
                            const newGrade = e.target.value;
                            const availableSubjects = getSubjectsForGrade(newGrade);
                            const subjectKeys = Object.keys(availableSubjects);
                            setFormData({ 
                              ...formData, 
                              grade: newGrade,
                              subject: subjectKeys.length > 0 ? subjectKeys[0] : ''
                            });
                          }}
                        >
                          <option value="">Select Grade</option>
                          {Object.entries(grades).map(([key, g]) => (
                            <option key={key} value={key}>{g.display}</option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-3 custom-form-group">
                        <label className="form-label ms-1">Subject</label>
                        <select 
                          className="form-select dark-select" 
                          value={formData.subject} 
                          onChange={e => setFormData({ ...formData, subject: e.target.value })}
                        >
                          <option value="">Select Subject</option>
                          {Object.entries(subjects).map(([key, s]) => (
                            <option key={key} value={key}>{s.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-0 custom-form-group">
                        <label className="form-label ms-1">Type</label>
                        <select 
                          className="form-select dark-select" 
                          value={formData.resourceType} 
                          onChange={e => setFormData({ ...formData, resourceType: e.target.value })}
                        >
                          <option value="textbook">Textbook</option>
                          <option value="papers">Past Paper / Model Paper</option>
                          <option value="notes">Short Note</option>
                          <option value="videos">Video Lesson</option>
                        </select>
                      </div>
                    </div>

                    <div className="section-container p-4 rounded-4 dark-panel border-glow flex-grow-1">
                      <h6 className="section-title text-uppercase mb-4"><i className="bi bi-sliders me-2 text-warning"></i>Parameters</h6>
                      
                      <div className="mb-4">
                        <label className="form-label ms-1 d-block">Language Availability</label>
                        <div className="d-flex flex-wrap gap-2">
                          {['sinhala', 'tamil', 'english'].map(lang => {
                            const isChecked = formData.languages.includes(lang);
                            return (
                              <div 
                                key={lang}
                                className={`lang-pill ${isChecked ? 'active' : ''}`}
                                onClick={() => {
                                  if (!isChecked) {
                                    setFormData(prev => ({ ...prev, languages: [...prev.languages, lang] }));
                                  } else {
                                    // Don't let them uncheck the last language
                                    if (formData.languages.length > 1) {
                                      setFormData(prev => ({ ...prev, languages: prev.languages.filter(l => l !== lang) }));
                                    }
                                  }
                                }}
                              >
                                {isChecked && <i className="bi bi-check2 me-1"></i>}
                                {lang.charAt(0).toUpperCase() + lang.slice(1)}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mb-0 custom-form-group">
                        <label className="form-label ms-1">Priority Sort Order <i className="bi bi-question-circle small ms-1 text-secondary" title="Lower numbers appear first"></i></label>
                        <input 
                          type="number" 
                          className="form-control dark-input text-center font-monospace fs-5" 
                          value={formData.order} 
                          onChange={e => setFormData({ ...formData, order: e.target.value })} 
                          placeholder="0"
                          style={{ maxWidth: '100px' }}
                        />
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* Premium Footer */}
            <div className="modal-footer border-0 p-4 pt-3 flex-nowrap" style={{ backgroundColor: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.05) !important' }}>
              <button type="button" className="btn btn-outline-secondary btn-lg px-4 fw-bold rounded-3 me-auto border-2 btn-cancel" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-lg px-5 fw-bold rounded-3 btn-glow position-relative overflow-hidden" disabled={isSubmitting || globalSubmitting}>
                {isSubmitting ? (
                  <><span className="spinner-border spinner-border-sm me-2 text-white"></span>Updating...</>
                ) : (
                  <span className="d-flex align-items-center gap-2">
                    {formData.id ? 'Save Changes' : 'Initialize Resource'} 
                    <i className="bi bi-arrow-right-short fs-4"></i>
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .modal-lg {
          max-width: 900px;
          width: 95%;
        }
        
        .shadow-2xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(56, 189, 248, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }

        .dark-panel {
          background-color: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
        }

        .section-title {
          font-size: 0.8rem;
          letter-spacing: 0.1em;
          color: #94a3b8;
          font-weight: 700;
        }

        .dark-input, .dark-select {
          background-color: rgba(15, 23, 42, 0.6) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: #f8fafc !important;
          transition: all 0.2s ease;
        }
        
        .dark-select {
          cursor: pointer;
        }

        .dark-input:focus, .dark-select:focus {
          border-color: #38bdf8 !important;
          box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15) !important;
          background-color: rgba(15, 23, 42, 0.9) !important;
        }
        
        .dark-input::placeholder {
          color: #64748b;
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
        }

        /* Language Pills */
        .lang-pill {
          padding: 8px 16px;
          border-radius: 20px;
          background-color: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94a3b8;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
        }

        .lang-pill:hover {
          background-color: rgba(30, 41, 59, 0.8);
          color: #f8fafc;
        }

        .lang-pill.active {
          background-color: rgba(56, 189, 248, 0.1);
          border-color: #38bdf8;
          color: #38bdf8;
          box-shadow: inset 0 0 10px rgba(56, 189, 248, 0.1);
        }

        /* Buttons */
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

        /* Scrollbar */
        .modal-body::-webkit-scrollbar {
          width: 6px;
        }
        .modal-body::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 4px;
        }
        .modal-body::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.2);
          border-radius: 4px;
        }
        .modal-body::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.4);
        }
        
        .slim-scroll::-webkit-scrollbar { width: 4px; }
        .slim-scroll::-webkit-scrollbar-track { background: transparent; }
        .slim-scroll::-webkit-scrollbar-thumb { background: rgba(148, 163, 184, 0.3); border-radius: 4px; }
      `}</style>
    </div>
  );
};

export default ResourceEditorModal;
