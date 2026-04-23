import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useALData } from '../../context/ALContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const ALResourceTypesPage = () => {
  const { streamId, subjectId } = useParams();
  const { alStreams, alSubjects, alResourceTypes, loading, updateDocument, deleteDocument } = useALData();
  const { isManageMode } = useAuth();
  
  const [editingType, setEditingType] = React.useState(null);
  const [editFormData, setEditFormData] = React.useState({});

  const stream = alStreams.find(s => s.id === streamId);
  const subject = alSubjects.find(s => s.id === subjectId);

  const filteredResourceTypes = alResourceTypes.filter(rt => 
    !rt.subjectIds || rt.subjectIds.length === 0 || rt.subjectIds.includes(subjectId)
  );

  useDocumentTitle(subject ? `${subject.name} Resources` : 'Subject Hub');

  const handleDeleteType = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this resource type? This will not delete the files inside.')) {
      try {
        await deleteDocument('al_resource_types', id);
        toast.success('Resource type deleted');
      } catch (err) {
        toast.error('Failed to delete');
      }
    }
  };

  const handleEditClick = (e, rt) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingType(rt);
    setEditFormData(rt);
  };

  const handleUpdateType = async (e) => {
    e.preventDefault();
    try {
      const sanitizedData = {
        ...editFormData,
        description: editFormData.description || '',
        icon: editFormData.icon || 'bi-archive'
      };
      await updateDocument('al_resource_types', editingType.id, sanitizedData);
      setEditingType(null);
      toast.success('Updated successfully');
    } catch (err) {
      toast.error('Update failed');
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

  if (!stream || !subject) {
    return (
      <div className="container py-5 text-center min-vh-100 mt-5">
        <h2>Subject Not Found</h2>
        <Link to="/al" className="btn btn-primary mt-3">Back to Streams</Link>
      </div>
    );
  }

  return (
    <div className="al-page min-vh-100 pb-5">
      {/* Header */}
      <header className="grade-header text-center py-5" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white' }}>
        <div className="container mt-5">
          <h1 className="display-4 fw-bold">{subject.name}</h1>
          <p className="lead">{stream.name} Stream</p>
          {isManageMode && (
            <Link to="/admin" className="btn btn-sm btn-outline-light mt-2">
              <i className="bi bi-pencil-square me-2"></i>Edit in Admin
            </Link>
          )}
        </div>
      </header>

      {/* Breadcrumb */}
      <section className="py-3 border-bottom">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/al">Advanced Level</Link></li>
              <li className="breadcrumb-item active" aria-current="page">{subject.name}</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Content */}
      <div className="container mt-5">
        <div className="row justify-content-center g-4">
          {filteredResourceTypes.map((rt) => (
            <div key={rt.id} className="col-md-6 col-lg-3">
              <Link 
                to={`/al/${stream.id}/${subject.id}/${rt.id}`} 
                className="card h-100 shadow-sm border-0 text-decoration-none resource-type-card"
              >
                <div className="card-body text-center p-4">
                  <div className="mb-3 bg-light rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px', color: rt.color || 'var(--primary)' }}>
                    <i className={`bi ${rt.icon || 'bi-archive'} fs-1`}></i>
                  </div>
                  <h4 className="fw-bold mb-2">{rt.name}</h4>
                  <p className="text-muted small mb-0">{rt.description || 'Access materials'}</p>
                  
                  {isManageMode && (
                    <div className="mt-3 d-flex justify-content-center gap-2">
                      <button 
                        className="btn btn-sm btn-outline-info" 
                        onClick={(e) => handleEditClick(e, rt)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger" 
                        onClick={(e) => handleDeleteType(e, rt.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))}

          {alResourceTypes.length === 0 && (
            <div className="col-12 text-center text-muted py-5">
              <h4>No Resource Types Available</h4>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingType && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>
              <div className="modal-header border-secondary">
                <h5 className="modal-title">Edit Resource Type</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setEditingType(null)}></button>
              </div>
              <form onSubmit={handleUpdateType}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Type Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={editFormData.name || ''} 
                      onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Icon (Bootstrap class)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={editFormData.icon || ''} 
                      onChange={(e) => setEditFormData({...editFormData, icon: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Order</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={editFormData.order || 0} 
                      onChange={(e) => setEditFormData({...editFormData, order: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="modal-footer border-secondary">
                  <button type="button" className="btn btn-secondary" onClick={() => setEditingType(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .resource-type-card {
          border-radius: 15px;
          transition: all 0.3s ease;
        }
        .resource-type-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default ALResourceTypesPage;
