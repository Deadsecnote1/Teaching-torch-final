import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useALData } from '../context/ALContext';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import { Pencil, Trash2, Settings, ChevronRight, FolderX, X, Archive } from 'lucide-react';
import { getLucideIcon } from '../../../utils/iconUtils';
import { Container, Section, Grid } from '../../../components/ui/Layout';
import { Card, CardContent } from '../../../components/ui/Card';

const ALResourceTypesPage = () => {
  const { streamId, subjectId } = useParams();
  const { alStreams, alSubjects, alResourceTypes, loading, updateDocument, deleteDocument } = useALData();
  const { isManageMode } = useAuth();
  
  const [editingType, setEditingType] = React.useState(null);
  const [editFormData, setEditFormData] = React.useState({});

  const stream = alStreams.find(s => s.id === streamId);
  const subject = alSubjects.find(s => s.id === subjectId);

  const filteredResourceTypes = alResourceTypes.filter(rt => 
    rt.subjectIds && rt.subjectIds.includes(subjectId)
  );

  useDocumentTitle(subject ? `${subject.name} Resources` : 'Subject Hub');

  const handleDeleteType = async (e, rt) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Hide "${rt.name}" from ${subject.name}? This will not delete the resources inside.`)) {
      try {
        const newSubjectIds = rt.subjectIds.filter(id => id !== subjectId);
        await updateDocument('al_resource_types', rt.id, { ...rt, subjectIds: newSubjectIds });
        toast.success(`Hidden from ${subject.name}`);
      } catch (err) {
        toast.error('Failed to update');
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
        icon: editFormData.icon || 'archive'
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
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!stream || !subject) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-3xl font-bold text-text-primary mb-4">Subject Not Found</h2>
        <Link to="/al" className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium">Back to Streams</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12 bg-bg-primary flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 text-center py-16 text-white border-b border-slate-800">
        <Container>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{subject.name}</h1>
          <p className="text-lg mt-3 text-slate-300 max-w-2xl mx-auto">{stream.name.endsWith('Stream') ? stream.name : `${stream.name} Stream`}</p>
          {isManageMode && (
            <Link to="/admin" className="mt-6 inline-flex items-center px-4 py-2 border border-slate-600 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
              <Settings className="w-4 h-4 mr-2" /> Edit in Admin
            </Link>
          )}
        </Container>
      </header>

      {/* Breadcrumb */}
      <div className="py-4 border-b border-border bg-bg-secondary/30">
        <Container>
          <nav aria-label="breadcrumb" className="flex items-center space-x-1 sm:space-x-2 text-sm text-text-muted overflow-x-auto whitespace-nowrap pb-1">
            <Link to="/" className="hover:text-primary transition-colors flex items-center">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0 opacity-40" />
            <Link to="/al" className="hover:text-primary transition-colors flex items-center">Advanced Level</Link>
            <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0 opacity-40" />
            <span className="text-text-primary font-medium">{subject.name}</span>
          </nav>
        </Container>
      </div>

      {/* Content */}
      <Section className="flex-1 py-12">
        <Grid cols={4} gap={6}>
          {filteredResourceTypes.map((rt) => (
            <div key={rt.id} className="col-span-1 sm:col-span-2 lg:col-span-1 flex justify-center w-full">
              <Link 
                to={`/al/${stream.id}/${subject.id}/${rt.id}`} 
                className="w-full block group"
              >
                <Card className="h-full transition-all duration-300 border-border overflow-hidden hover:shadow-lg hover:-translate-y-1 hover:border-primary/30 flex flex-col">
                  <CardContent className="p-6 flex flex-col items-center text-center flex-1">
                    <div 
                      className={`w-20 h-20 rounded-full flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 overflow-hidden ${rt.name && rt.name.trim() === 'Physics Chamber' ? '' : 'bg-bg-secondary border border-border/50 shadow-sm'}`} 
                      style={{ 
                        color: rt.color || 'var(--primary)',
                      }}
                    >
                      {rt.name && rt.name.trim() === 'Physics Chamber' ? (
                        <img 
                          src="/assets/logos/physics-chamber.jpg" 
                          alt="Physics Chamber" 
                          loading="lazy"
                          className="w-full h-full object-contain scale-110"
                        />
                      ) : (
                        getLucideIcon(rt.icon, "w-8 h-8")
                      )}
                    </div>
                    <h4 className="text-xl font-bold text-text-primary mb-2">{rt.name}</h4>
                    <p className="text-text-muted text-sm mb-0">{rt.description || 'Access materials'}</p>
                    
                    {isManageMode && (
                      <div className="mt-4 flex gap-2 w-full justify-center">
                        <button 
                          className="p-1.5 text-info hover:bg-info/10 rounded-lg border border-info/30 transition-colors" 
                          onClick={(e) => handleEditClick(e, rt)}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1.5 text-danger hover:bg-danger/10 rounded-lg border border-danger/30 transition-colors" 
                          onClick={(e) => handleDeleteType(e, rt)}
                          title={`Hide from ${subject.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}

          {filteredResourceTypes.length === 0 && (
            <div className="col-span-1 sm:col-span-2 lg:col-span-4 text-center text-text-muted py-16 bg-card rounded-2xl border border-border w-full">
              <FolderX className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <h4 className="text-xl font-bold text-text-primary mb-2">No Resource Types Available</h4>
              <p>There are no resource types configured for this subject yet.</p>
            </div>
          )}
        </Grid>
      </Section>

      {/* Edit Modal */}
      {editingType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-border animate-fade-in">
            <div className="flex justify-between items-center px-6 py-4 border-b border-border bg-bg-secondary/50">
              <h5 className="text-lg font-bold text-text-primary">Edit Resource Type</h5>
              <button 
                type="button" 
                className="text-text-muted hover:text-text-primary transition-colors" 
                onClick={() => setEditingType(null)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateType}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">Type Name</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50" 
                    value={editFormData.name || ''} 
                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">Icon (Lucide name)</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50" 
                    value={editFormData.icon || ''} 
                    onChange={(e) => setEditFormData({...editFormData, icon: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">Order</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50" 
                    value={editFormData.order || 0} 
                    onChange={(e) => setEditFormData({...editFormData, order: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-border bg-bg-secondary/50 flex justify-end gap-3">
                <button 
                  type="button" 
                  className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-primary bg-bg-primary border border-border rounded-lg hover:bg-bg-secondary transition-colors" 
                  onClick={() => setEditingType(null)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ALResourceTypesPage;
