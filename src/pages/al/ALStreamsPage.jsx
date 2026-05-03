import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useALData } from '../../context/ALContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const ALStreamsPage = () => {
  useDocumentTitle('Advanced Level Streams');
  const { alStreams, alSubjects, loading, updateDocument, deleteDocument } = useALData();
  const { isManageMode, currentUser } = useAuth();
  const [activeStreamId, setActiveStreamId] = useState(null);

  // Editor States
  const [editingStream, setEditingStream] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({});

  const handleUpdateStream = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('Admin authentication required. Please login at /admin');
      return;
    }
    try {
      const sanitizedData = {
        ...formData,
        description: formData.description || ''
      };
      await updateDocument('al_streams', editingStream.id, sanitizedData);
      setEditingStream(null);
      toast.success('Stream updated');
    } catch (err) { 
      console.error(err);
      toast.error('Update failed: ' + err.message); 
    }
  };

  const handleUpdateSubject = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('Admin authentication required. Please login at /admin');
      return;
    }
    try {
      const sanitizedData = {
        ...formData,
        description: formData.description || '',
        icon: formData.icon || 'bi-book'
      };
      await updateDocument('al_subjects', editingSubject.id, sanitizedData);
      setEditingSubject(null);
      toast.success('Subject updated');
    } catch (err) { 
      console.error(err);
      toast.error('Update failed: ' + err.message); 
    }
  };

  const handleDelete = async (e, collection, id, name) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Delete ${name}?`)) {
      try {
        await deleteDocument(collection, id);
        toast.success('Deleted successfully');
      } catch (err) { toast.error('Delete failed'); }
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="al-page min-vh-100 pb-5">
      {/* Header */}
      <header className="grade-header text-center py-5" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white' }}>
        <div className="container mt-5">
          <h1 className="display-4 fw-bold">Advanced Level</h1>
          <p className="lead">Select your specialization stream to continue</p>
          {isManageMode && (
            <Link to="/admin" className="btn btn-sm btn-outline-light mt-2">
              <i className="bi bi-pencil-square me-2"></i>Edit in Admin
            </Link>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="container mt-5">
        <div className="row justify-content-center g-4">
          {alStreams.map((stream) => {
            const streamSubjects = alSubjects.filter(sub => sub.streamId === stream.id);
            const isActive = activeStreamId === stream.id;

            return (
              <div key={stream.id} className="col-md-4">
                <div 
                  className={`card h-100 shadow-sm border-0 stream-card ${isActive ? 'active' : ''}`}
                  onMouseEnter={() => setActiveStreamId(stream.id)}
                  onMouseLeave={() => setActiveStreamId(null)}
                  onClick={() => setActiveStreamId(isActive ? null : stream.id)}
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease', overflow: 'hidden' }}
                >
                  <div className="card-body text-center p-5 position-relative z-1">
                    <div className="mb-4" style={{ color: stream.color || 'var(--primary)' }}>
                      <i className={`bi ${stream.icon || 'bi-layers'} display-1`}></i>
                    </div>
                    <h3 className="fw-bold">{stream.name}</h3>
                    <p className="text-muted">{stream.description || 'Access specialized resources'}</p>
                    
                    {isManageMode && (
                      <div className="mt-2 d-flex justify-content-center gap-2">
                        <button className="btn btn-sm btn-outline-info" onClick={(e) => {
                          e.stopPropagation();
                          setEditingStream(stream);
                          setFormData(stream);
                        }}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={(e) => handleDelete(e, 'al_streams', stream.id, stream.name)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    )}
                    
                    {/* Subjects Dropdown / Menu */}
                    <div className={`subjects-menu mt-4 ${isActive ? 'd-block' : 'd-none'}`} style={{ animation: 'fadeIn 0.3s ease' }}>
                      <hr />
                      <h6 className="text-muted mb-3 text-uppercase small fw-bold">Select Subject</h6>
                      <div className="d-flex flex-column gap-2">
                        {streamSubjects.map(subject => (
                          <div key={subject.id} className="d-flex gap-2">
                            <Link 
                              to={`/al/${stream.id}/${subject.id}`}
                              className="btn btn-outline-primary flex-grow-1 text-start d-flex justify-content-between align-items-center"
                            >
                              <span><i className={`bi ${subject.icon || 'bi-book'} me-2`}></i>{subject.name}</span>
                              <i className="bi bi-chevron-right small"></i>
                            </Link>
                            {isManageMode && (
                              <div className="d-flex flex-column gap-1">
                                <button className="btn btn-sm btn-info text-white px-2 py-1" onClick={(e) => {
                                  e.preventDefault();
                                  setEditingSubject(subject);
                                  setFormData(subject);
                                }}>
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button className="btn btn-sm btn-danger px-2 py-1" onClick={(e) => handleDelete(e, 'al_subjects', subject.id, subject.name)}>
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                        {streamSubjects.length === 0 && (
                          <div className="text-muted small">No subjects available yet.</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {alStreams.length === 0 && (
            <div className="col-12 text-center text-muted py-5">
              <h4>No Streams Available</h4>
              <p>Please contact the administrator to set up Advanced Level streams.</p>
            </div>
          )}
        </div>
      </div>

      {/* Stream Edit Modal */}
      {editingStream && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ backgroundColor: 'var(--card-bg)' }}>
              <div className="modal-header border-secondary">
                <h5 className="modal-title">Edit Stream: {editingStream.name}</h5>
                <button type="button" className="btn-close" onClick={() => setEditingStream(null)}></button>
              </div>
              <form onSubmit={handleUpdateStream}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Stream Name</label>
                    <input type="text" className="form-control" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <input type="text" className="form-control" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Order (Priority)</label>
                    <input type="number" className="form-control" value={formData.order || 0} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} />
                  </div>
                </div>
                <div className="modal-footer border-secondary">
                  <button type="button" className="btn btn-secondary" onClick={() => setEditingStream(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Subject Edit Modal */}
      {editingSubject && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ backgroundColor: 'var(--card-bg)' }}>
              <div className="modal-header border-secondary">
                <h5 className="modal-title">Edit Subject: {editingSubject.name}</h5>
                <button type="button" className="btn-close" onClick={() => setEditingSubject(null)}></button>
              </div>
              <form onSubmit={handleUpdateSubject}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Subject Name</label>
                    <input type="text" className="form-control" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Icon (Bootstrap class)</label>
                    <input type="text" className="form-control" value={formData.icon || ''} onChange={e => setFormData({...formData, icon: e.target.value})} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Order (Priority)</label>
                    <input type="number" className="form-control" value={formData.order || 0} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} />
                  </div>
                </div>
                <div className="modal-footer border-secondary">
                  <button type="button" className="btn btn-secondary" onClick={() => setEditingSubject(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .stream-card {
          border-radius: 20px;
        }
        .stream-card:hover, .stream-card.active {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ALStreamsPage;
