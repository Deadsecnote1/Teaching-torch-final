import React, { memo } from 'react';

const AdminResourceItem = ({ 
  file, 
  editingResource, 
  editResourceData, 
  setEditResourceData,
  handleSaveEditResource,
  handleCancelEditResource,
  setEditingResource,
  handleDeleteResource,
  isSubmitting,
  grades,
  getSubjectsForGrade
}) => {
  const isEditing = editingResource === file.id;

  if (isEditing) {
    return (
      <div className="p-3 border rounded bg-light mb-2 animate-fade-in shadow-sm">
        <div className="edit-resource-form">
          <div className="mb-2">
            <label className="form-label small mb-0 fw-bold">Title</label>
            <input 
              type="text" 
              className="form-control form-control-sm mb-2" 
              value={editResourceData.title} 
              onChange={e => setEditResourceData({ ...editResourceData, title: e.target.value })} 
            />
            
            <label className="form-label small mb-0 fw-bold">URL (Drive / YouTube)</label>
            <input 
              type="text" 
              className="form-control form-control-sm mb-2" 
              value={editResourceData.url} 
              onChange={e => setEditResourceData({ ...editResourceData, url: e.target.value })} 
            />
            
            <label className="form-label small mb-0 fw-bold">Description</label>
            <textarea 
              className="form-control form-control-sm mb-2" 
              rows="2" 
              value={editResourceData.description} 
              onChange={e => setEditResourceData({ ...editResourceData, description: e.target.value })} 
            />
            
            <div className="row g-2 mb-2">
              <div className="col-6">
                <label className="form-label small mb-0 fw-bold">Grade</label>
                <select 
                  className="form-select form-select-sm" 
                  value={editResourceData.grade} 
                  onChange={e => {
                    const newGrade = e.target.value;
                    const availableSubjects = getSubjectsForGrade(newGrade);
                    const subjectKeys = Object.keys(availableSubjects);
                    setEditResourceData(prev => ({ 
                      ...prev, 
                      grade: newGrade, 
                      subject: subjectKeys.includes(prev.subject) ? prev.subject : (subjectKeys[0] || '') 
                    }));
                  }}
                >
                  {Object.entries(grades).map(([key, g]) => (
                    <option key={key} value={key}>{g.display}</option>
                  ))}
                </select>
              </div>
              <div className="col-6">
                <label className="form-label small mb-0 fw-bold">Subject</label>
                <select 
                  className="form-select form-select-sm" 
                  value={editResourceData.subject} 
                  onChange={e => setEditResourceData({ ...editResourceData, subject: e.target.value })}
                >
                  {Object.entries(getSubjectsForGrade(editResourceData.grade)).map(([key, s]) => (
                    <option key={key} value={key}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="row g-2">
              <div className="col-6">
                <label className="form-label small mb-0 fw-bold">Languages</label>
                <div className="border rounded px-2 py-1 bg-white" style={{ maxHeight: '80px', overflowY: 'auto' }}>
                  {['english', 'sinhala', 'tamil'].map(lang => (
                    <div className="form-check mb-0" style={{ fontSize: '0.8rem' }} key={`edit-rlang-${lang}`}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`edit-rlang-${lang}`}
                        checked={editResourceData.languages.includes(lang)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEditResourceData(prev => ({ ...prev, languages: [...prev.languages, lang] }));
                          } else {
                            setEditResourceData(prev => ({ ...prev, languages: prev.languages.filter(l => l !== lang) }));
                          }
                        }}
                      />
                      <label className="form-check-label text-capitalize" htmlFor={`edit-rlang-${lang}`}>
                        {lang}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-6">
                <label className="form-label small mb-0 fw-bold">Order</label>
                <input 
                  type="number" 
                  className="form-control form-control-sm" 
                  placeholder="e.g 1" 
                  value={editResourceData.order} 
                  onChange={e => setEditResourceData({ ...editResourceData, order: e.target.value })} 
                />
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end gap-2 mt-3 pt-2 border-top">
            <button 
              className="btn btn-sm btn-success px-3" 
              onClick={handleSaveEditResource} 
              disabled={isSubmitting}
            >
              <i className="bi bi-check2 me-1"></i> Save Changes
            </button>
            <button 
              className="btn btn-sm btn-outline-secondary" 
              onClick={handleCancelEditResource} 
              disabled={isSubmitting}
            >
              <i className="bi bi-x"></i> Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-resource-item p-2 border-bottom hover-bg">
      <div className="d-flex justify-content-between align-items-center">
        <div className="flex-grow-1" style={{ minWidth: 0 }}>
          <div className="d-flex align-items-center">
            <i className={`bi ${
              file.resourceType === 'textbook' ? 'bi-book' :
              file.resourceType === 'papers' ? 'bi-file-text' :
              file.resourceType === 'notes' ? 'bi-sticky' :
              'bi-play-circle'
            } me-2 text-primary`} style={{ fontSize: '1.1rem' }}></i>
            <h6 className="mb-0 text-truncate" style={{ fontSize: '0.9rem' }} title={file.title || file.name}>
              {file.title || file.name}
            </h6>
          </div>
          <div className="mt-1">
            <span className="badge bg-light text-dark border me-1" style={{ fontSize: '0.7rem' }}>
              {grades[file.grade]?.display || file.grade}
            </span>
            <span className="badge bg-light text-primary border me-1" style={{ fontSize: '0.7rem' }}>
              {file.subject}
            </span>
            <span className="text-muted" style={{ fontSize: '0.75rem' }}>
              <i className="bi bi-globe2 me-1"></i>
              {file.languages?.join(', ') || 'en'}
              {file.order !== undefined && file.order !== 999 && (
                <span className="ms-2 border-start ps-2">
                  <i className="bi bi-sort-numeric-down me-1"></i>
                  {file.order}
                </span>
              )}
            </span>
          </div>
        </div>
        <div className="d-flex gap-1 ms-2">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => setEditingResource(file)}
            title="Edit resource"
            style={{ padding: '0.25rem 0.5rem' }}
          >
            <i className="bi bi-pencil" style={{ fontSize: '0.8rem' }}></i>
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => handleDeleteResource(file.id)}
            title="Delete resource"
            style={{ padding: '0.25rem 0.5rem' }}
          >
            <i className="bi bi-trash" style={{ fontSize: '0.8rem' }}></i>
          </button>
        </div>
      </div>
      <style>{`
        .admin-resource-item { transition: background-color 0.2s; }
        .admin-resource-item:hover { background-color: rgba(0,0,0,0.02); }
        .animate-fade-in { animation: fadeIn 0.3s ease-in; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default memo(AdminResourceItem);
