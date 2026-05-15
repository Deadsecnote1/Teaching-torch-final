import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Languages, FileText, Clock, Download, Home, FolderPlus, Files } from 'lucide-react';

const AdminOverview = ({ stats, uploadedFilesCount, exportData, setActiveTab, fileGroupsCount }) => {
  return (
    <div className="p-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-bg-primary rounded-xl p-6 border border-border shadow-sm flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1 hover:shadow-md">
          <BookOpen className="w-12 h-12 text-primary mb-4" />
          <h3 className="text-3xl font-bold text-text-primary mb-1">{stats.totalGrades}</h3>
          <p className="text-text-muted font-medium">Grade Levels</p>
        </div>

        <div className="bg-bg-primary rounded-xl p-6 border border-border shadow-sm flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1 hover:shadow-md">
          <Languages className="w-12 h-12 text-success mb-4" />
          <h3 className="text-3xl font-bold text-text-primary mb-1">{stats.totalLanguages}</h3>
          <p className="text-text-muted font-medium">Languages</p>
        </div>

        <div className="bg-bg-primary rounded-xl p-6 border border-border shadow-sm flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1 hover:shadow-md">
          <FileText className="w-12 h-12 text-info mb-4" />
          <h3 className="text-3xl font-bold text-text-primary mb-1">{uploadedFilesCount}</h3>
          <p className="text-text-muted font-medium">Uploaded Files</p>
        </div>

        <div className="bg-bg-primary rounded-xl p-6 border border-border shadow-sm flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1 hover:shadow-md">
          <Clock className="w-12 h-12 text-warning mb-4" />
          <h3 className="text-3xl font-bold text-text-primary mb-1">24/7</h3>
          <p className="text-text-muted font-medium">Access</p>
        </div>
      </div>

      {/* Quick Actions & Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-bg-primary rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-border bg-bg-secondary/50">
            <h5 className="font-bold text-lg text-text-primary">Quick Actions</h5>
          </div>
          <div className="p-6 flex-1 flex flex-col gap-3">
            <button
              onClick={exportData}
              className="w-full flex items-center justify-center px-4 py-3 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition-colors font-medium"
            >
              <Download className="w-5 h-5 mr-2" />
              Export All Data
            </button>
            <Link 
              to="/" 
              className="w-full flex items-center justify-center px-4 py-3 rounded-lg bg-bg-secondary text-text-primary hover:bg-border transition-colors font-medium"
            >
              <Home className="w-5 h-5 mr-2" />
              View Website
            </Link>
            <button
              className="w-full flex items-center justify-center px-4 py-3 rounded-lg bg-success text-white hover:bg-success/90 transition-colors font-medium mt-2"
              onClick={() => setActiveTab('upload')}
            >
              <FolderPlus className="w-5 h-5 mr-2" />
              Upload Resources
            </button>
            <button
              className="w-full flex items-center justify-center px-4 py-3 rounded-lg bg-info text-white hover:bg-info/90 transition-colors font-medium mt-2"
              onClick={() => setActiveTab('files')}
            >
              <Files className="w-5 h-5 mr-2" />
              Manage Files ({uploadedFilesCount})
            </button>
          </div>
        </div>

        {/* Upload Summary */}
        <div className="bg-bg-primary rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-border bg-bg-secondary/50">
            <h5 className="font-bold text-lg text-text-primary">Upload Summary</h5>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-center">
            {uploadedFilesCount > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-bg-secondary rounded-lg border border-border">
                  <span className="text-text-muted font-medium">Total files uploaded</span>
                  <span className="text-xl font-bold text-text-primary">{uploadedFilesCount}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-bg-secondary rounded-lg border border-border">
                  <span className="text-text-muted font-medium">Storage locations</span>
                  <span className="text-xl font-bold text-text-primary">{fileGroupsCount}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <FolderPlus className="w-16 h-16 text-text-muted opacity-30 mx-auto mb-4" />
                <p className="text-text-muted">No files uploaded yet. Use the Manage Resources tab to upload files.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
