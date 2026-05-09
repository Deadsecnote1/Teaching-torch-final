import React from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import AdminResourceItem from './AdminResourceItem';

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
                <AdminResourceItem 
                  key={file.id}
                  file={file}
                  editingResource={editingResource}
                  editResourceData={editResourceData}
                  setEditResourceData={setEditResourceData}
                  handleSaveEditResource={handleSaveEditResource}
                  handleCancelEditResource={handleCancelEditResource}
                  setEditingResource={setEditingResource}
                  handleDeleteResource={handleDeleteResource}
                  isSubmitting={isSubmitting}
                  grades={grades}
                  getSubjectsForGrade={getSubjectsForGrade}
                />
              ))}
              
              {/* Pagination Controls - Firestore style */}
              <div className="mt-4 text-center">
                {hasMore && (
                  <button 
                    className="btn btn-outline-primary btn-sm px-4" 
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
                  <div className="mt-3 p-2 bg-light rounded-pill d-inline-block px-3">
                    <small className="text-muted"><i className="bi bi-check-circle me-1"></i>All resources loaded</small>
                  </div>
                )}
                
                {searchQuery !== '' && hasMore && (
                  <div className="mt-3">
                    <small className="text-muted d-block mb-2">Searching only loaded files. Need to find more?</small>
                    <button 
                      className="btn btn-sm btn-link text-decoration-none"
                      onClick={() => fetchResourcesPaginated(false)}
                      disabled={isLoadingMore}
                    >
                      Search Next Page
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-muted py-5">
              <i className="bi bi-folder-x" style={{ fontSize: '3rem' }}></i>
              <p className="mt-2">No files found</p>
              {searchQuery !== '' && hasMore && (
                <button 
                  className="btn btn-outline-primary btn-sm mt-2"
                  onClick={() => fetchResourcesPaginated(false)}
                >
                  Check Next Page
                </button>
              )}
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
