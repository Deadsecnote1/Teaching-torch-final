import React from 'react';
import { Link } from 'react-router-dom';

const AdminOverview = ({ stats, uploadedFilesCount, exportData, setActiveTab, fileGroupsCount }) => {
  return (
    <>
      {/* Statistics Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <i className="bi bi-book text-primary" style={{ fontSize: '3rem' }}></i>
              <h3 className="mt-3">{stats.totalGrades}</h3>
              <p className="text-muted">Grade Levels</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <i className="bi bi-translate text-success" style={{ fontSize: '3rem' }}></i>
              <h3 className="mt-3">{stats.totalLanguages}</h3>
              <p className="text-muted">Languages</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <i className="bi bi-file-earmark text-info" style={{ fontSize: '3rem' }}></i>
              <h3 className="mt-3">{uploadedFilesCount}</h3>
              <p className="text-muted">Uploaded Files</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <i className="bi bi-clock text-warning" style={{ fontSize: '3rem' }}></i>
              <h3 className="mt-3">24/7</h3>
              <p className="text-muted">Access</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <h5>Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button
                  onClick={exportData}
                  className="btn btn-outline-primary"
                >
                  <i className="bi bi-download me-2"></i>
                  Export All Data
                </button>
                <Link to="/" className="btn btn-secondary">
                  <i className="bi bi-house me-2"></i>
                  View Website
                </Link>
                <button
                  className="btn btn-success"
                  onClick={() => setActiveTab('upload')}
                >
                  <i className="bi bi-folder-plus me-2"></i>
                  Upload Resources
                </button>
                <button
                  className="btn btn-info text-white mt-2"
                  onClick={() => setActiveTab('files')}
                >
                  <i className="bi bi-files me-2"></i>
                  Manage Files ({uploadedFilesCount})
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <h5>Upload Summary</h5>
            </div>
            <div className="card-body">
              {uploadedFilesCount > 0 ? (
                <div>
                  <p>Total files uploaded: <strong>{uploadedFilesCount}</strong></p>
                  <p>Storage locations: <strong>{fileGroupsCount}</strong></p>
                </div>
              ) : (
                <p className="text-muted">No files uploaded yet. Use the Manage Resources tab to upload files.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminOverview;
