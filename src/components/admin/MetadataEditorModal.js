import React, { useState, useEffect } from 'react';

/**
 * A specialized modal for editing Metadata (Grades and Subjects)
 * Replaces the basic window.prompt with a premium UI.
 */
const MetadataEditorModal = ({ isOpen, onClose, onSave, title, initialData, type = 'grade' }) => {
  const [formData, setFormData] = useState({
    display: '',
    order: ''
  });

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        display: initialData.display || initialData.name || '',
        order: initialData.order !== undefined ? initialData.order : ''
      });
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...initialData,
      display: formData.display,
      name: formData.display, // Keep both for safety
      order: formData.order
    });
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
                    {type === 'grade' ? 'Grade Name' : 'Subject Name'}
                  </label>
                  <input 
                    type="text" 
                    className="form-control form-control-lg dark-input" 
                    placeholder={type === 'grade' ? 'e.g. Grade 11' : 'e.g. Mathematics'}
                    value={formData.display} 
                    onChange={e => setFormData({ ...formData, display: e.target.value })}
                    required 
                    autoFocus
                  />
                </div>

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
