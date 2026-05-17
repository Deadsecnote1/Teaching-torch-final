import React from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import AdminResourceItem from './AdminResourceItem';
import { Folder, Search, ArrowDownCircle, CheckCircle, FolderX, Trash2, RefreshCw } from 'lucide-react';

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
    <div className="flex justify-center p-6">
      <div className="w-full max-w-5xl">
        <div className="bg-bg-primary rounded-xl border border-border shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          <div className="bg-bg-secondary/80 px-6 py-4 flex items-center border-b border-border">
            <div className="bg-bg-tertiary p-1.5 rounded-lg mr-3">
              <Folder className="w-5 h-5 text-text-primary" />
            </div>
            <h5 className="mb-0 text-text-primary font-bold text-lg">File Manager</h5>
          </div>
          
          <div className="p-6 flex-1 flex flex-col">
            {/* Search Bar */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-text-muted" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-3 py-3 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                placeholder="Search resources by title, grade, or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex-1 flex flex-col min-h-[350px]">
              {filteredFiles.length > 0 ? (
                <div className="flex flex-col h-full">
                  <div className="space-y-4 flex-1">
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
                  </div>
                  
                  {/* Pagination Controls - Firestore style */}
                  <div className="mt-8 text-center pb-4 border-b border-border/50">
                    {hasMore && (
                      <button 
                        className="inline-flex items-center px-6 py-2.5 border border-primary text-primary font-medium rounded-lg hover:bg-primary hover:text-white transition-colors disabled:opacity-50 shadow-sm" 
                        onClick={() => fetchResourcesPaginated(false)}
                        disabled={isLoadingMore}
                      >
                        {isLoadingMore ? (
                          <LoadingSpinner size="small" />
                        ) : (
                          <>
                            <ArrowDownCircle className="w-5 h-5 mr-2" />
                            Load More Resources
                          </>
                        )}
                      </button>
                    )}
                    
                    {!hasMore && filteredFiles.length > 0 && searchQuery === '' && (
                      <div className="inline-flex items-center mt-3 px-4 py-2 bg-success/10 text-success rounded-full border border-success/20">
                        <CheckCircle className="w-4 h-4 mr-1.5" />
                        <span className="text-sm font-medium">All resources loaded</span>
                      </div>
                    )}
                    
                    {searchQuery !== '' && hasMore && (
                      <div className="mt-4 bg-info/5 border border-info/20 p-4 rounded-lg inline-block text-left">
                        <span className="text-sm text-info font-medium block mb-2">Searching only currently loaded files. Need to find older ones?</span>
                        <button 
                          className="text-sm font-semibold text-primary hover:text-primary-dark underline decoration-primary/30 underline-offset-4 transition-colors"
                          onClick={() => fetchResourcesPaginated(false)}
                          disabled={isLoadingMore}
                        >
                          Load Next Page to Search Deeper
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-text-muted py-12 bg-bg-secondary/30 rounded-xl border border-border border-dashed">
                  <FolderX className="w-16 h-16 mb-4 opacity-30" />
                  <p className="text-lg font-medium text-text-primary mb-1">No files found</p>
                  <p className="text-sm">Try adjusting your search query.</p>
                  
                  {searchQuery !== '' && hasMore && (
                    <button 
                      className="mt-6 px-4 py-2 bg-primary/10 text-primary font-medium rounded-lg hover:bg-primary hover:text-white transition-colors text-sm"
                      onClick={() => fetchResourcesPaginated(false)}
                    >
                      Search deeper in next page
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-danger text-danger font-medium rounded-lg hover:bg-danger/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleDeleteSelected}
                disabled={filteredFiles.length === 0}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete All Listed Files
              </button>
              <button 
                className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-info text-info font-medium rounded-lg hover:bg-info/10 transition-colors" 
                onClick={handleRefresh}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFileManager;
