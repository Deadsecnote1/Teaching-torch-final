import React from 'react';
import LoadingSpinner from '../common/LoadingSpinner';

const AdminFileManager = ({ 
  searchQuery, 
  setSearchQuery, 
  filteredFiles, 
  editingResource, 
  editResourceData, 
  setEditResourceData,
  handleSaveEditResource,
  handleCancelEditResource,
  setEditingResource,
  handleDeleteResource,
  handleDeleteSelected,
  handleRefresh,
  isSubmitting,
  grades,
  getSubjectsForGrade,
  // Pagination props
  fetchResourcesPaginated,
  hasMore,
  isLoadingMore
}) => {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-header bg-secondary text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <i className="bi bi-folder me-2"></i>
          File Manager
        </h5>
      </div>
      <div className="card-body">
        {/* Search Bar */}
        <div className="input-group mb-3">
          <span className="input-group-text bg-white border-end-0">
            <i className="bi bi-search text-muted"></i>
          </span>
          <input
            type="text"
            className="form-control border-start-0 ps-0"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="file-list" style={{ minHeight: '350px' }}>
          {filteredFiles.length > 0 ? (
            <div>
              {filteredFiles.map((file) => (
                <div key={file.id} className="p-2 border-bottom">
                  {editingResource === file.id ? (
                    <div className="edit-resource-form">
                      <div className="mb-2">
                        <label className="form-label small mb-0">Title</label>
                        <input type="text" className="form-control form-control-sm mb-2" value={editResourceData.title} onChange={e => setEditResourceData({ ...editResourceData, title: e.target.value })} />
                        
                        <label className="form-label small mb-0">URL (Drive / YouTube)</label>
                        <input type="text" className="form-control form-control-sm mb-2" value={editResourceData.url} onChange={e => setEditResourceData({ ...editResourceData, url: e.target.value })} />
                        
                        <label className="form-label small mb-0">Description</label>
                        <textarea className="form-control form-control-sm mb-2" rows="2" value={editResourceData.description} onChange={e => setEditResourceData({ ...editResourceData, description: e.target.value })} />
                        
                        <div className="row g-2 mb-2">
                          <div className="col-6">
                            <label className="form-label small mb-0">Grade</label>
                            <select className="form-select form-select-sm" value={editResourceData.grade} onChange={e => {
                              const newGrade = e.target.value;
                              const availableSubjects = getSubjectsForGrade(newGrade);
                              const subjectKeys = Object.keys(availableSubjects);
                              setEditResourceData(prev => ({ 
                                ...prev, 
                                grade: newGrade, 
                                subject: subjectKeys.includes(prev.subject) ? prev.subject : (subjectKeys[0] || '') 
                              }));
                            }}>
                              {Object.entries(grades).map(([key, g]) => (
                                <option key={key} value={key}>{g.display}</option>
                              ))}
                            </select>
                          </div>
                          <div className="col-6">
                            <label className="form-label small mb-0">Subject</label>
                            <select className="form-select form-select-sm" value={editResourceData.subject} onChange={e => setEditResourceData({ ...editResourceData, subject: e.target.value })}>
                              {Object.entries(getSubjectsForGrade(editResourceData.grade)).map(([key, s]) => (
                                <option key={key} value={key}>{s.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="row g-2">
                          <div className="col-6">
                            <label className="form-label small mb-0">Languages</label>
                            <div className="border rounded px-2 py-1 bg-white form-control-sm" style={{ maxHeight: '80px', overflowY: 'auto' }}>
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
                            <label className="form-label small mb-0">Order</label>
                            <input type="number" className="form-control form-control-sm" placeholder="e.g 1" value={editResourceData.order} onChange={e => setEditResourceData({ ...editResourceData, order: e.target.value })} />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex justify-content-end gap-2 mt-2">
                        <button className="btn btn-sm btn-success" onClick={handleSaveEditResource} disabled={isSubmitting}>
                          <i className="bi bi-check2"></i> Save
                        </button>
                        <button className="btn btn-sm btn-secondary" onClick={handleCancelEditResource} disabled={isSubmitting}>
                          <i className="bi bi-x"></i> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="flex-grow-1" style={{ minWidth: 0 }}>
                        <div className="d-flex align-items-center">
                          <i className={`bi ${file.resourceType === 'textbook' ? 'bi-book' :
                            file.resourceType === 'papers' ? 'bi-file-text' :
                              file.resourceType === 'notes' ? 'bi-sticky' :
                                'bi-play-circle'
                            } me-2 text-primary`}></i>
                          <small className="text-truncate" style={{ maxWidth: '200px' }} title={file.title || file.name}>
                            {file.title || file.name}
                          </small>
                        </div>
                        <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
                          {file.grade} / {file.subject} <span className="ms-1 px-1 bg-light rounded shadow-sm">{file.languages?.join(', ') || 'en'}</span>
                          {file.order !== undefined && file.order !== 999 && <span className="ms-1">(Order: {file.order})</span>}
                        </small>
                      </div>
                      <div className="d-flex gap-1 ms-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setEditingResource(file)}
                          title="Edit resource"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteResource(file.id)}
                          title="Delete resource"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Pagination Controls - Firestore style */}
              <div className="mt-4 text-center">
                {hasMore && (
                  <button 
                    className="btn btn-outline-primary btn-sm" 
                    onClick={() => fetchResourcesPaginated(false)}
                    disabled={isLoadingMore}
                  >
                    {isLoadingMore ? (
                      <LoadingSpinner size="small" />
                    ) : (
                      <>
                        <i className="bi bi-arrow-down-circle me-2"></i>
                        Load More
                      </>
                    )}
                  </button>
                )}
                {!hasMore && filteredFiles.length > 0 && searchQuery === '' && (
                  <small className="text-muted italic">All resources loaded</small>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-muted py-5">
              <i className="bi bi-folder-x" style={{ fontSize: '3rem' }}></i>
              <p className="mt-2">No files found</p>
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-top d-grid gap-2">
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleDeleteSelected}
            disabled={filteredFiles.length === 0}
          >
            <i className="bi bi-trash me-2"></i>
            Delete All Files
          </button>
          <button className="btn btn-outline-info btn-sm" onClick={handleRefresh}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            Refresh List
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminFileManager;
