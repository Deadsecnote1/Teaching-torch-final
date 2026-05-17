import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useALData } from '../context/ALContext';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import { Pencil, Trash2, BookOpen, Layers, ChevronRight, Settings, Plus, X } from 'lucide-react';
import { getLucideIcon } from '../../../utils/iconUtils';
import { Container, Section } from '../../../components/ui/Layout';
import { Card, CardContent } from '../../../components/ui/Card';

const ALStreamsPage = () => {
  useDocumentTitle('Advanced Level Streams');
  const { alStreams, alSubjects, loading, initializeALData, updateDocument, deleteDocument } = useALData();
  const { isManageMode, currentUser } = useAuth();
  const [activeStreamId, setActiveStreamId] = useState(null);

  React.useEffect(() => {
    initializeALData();
  }, [initializeALData]);



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
        icon: formData.icon || 'book'
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
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12 bg-bg-primary flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 text-center py-16 text-white border-b border-slate-800">
        <Container>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Advanced Level</h1>
          <p className="text-lg mt-3 text-slate-300 max-w-2xl mx-auto">Select your specialization stream to continue</p>
          {isManageMode && (
            <Link to="/admin" className="mt-6 inline-flex items-center px-4 py-2 border border-slate-600 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
              <Settings className="w-4 h-4 mr-2" /> Edit in Admin
            </Link>
          )}
        </Container>
      </header>

      {/* Content */}
      <Section className="flex-1 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {alStreams.map((stream) => {
            const streamSubjects = alSubjects.filter(sub => sub.streamId === stream.id);
            const isActive = activeStreamId === stream.id;

            return (
              <div key={stream.id} className="flex justify-center w-full min-w-0">
                <Card 
                  className={`w-full max-w-md transition-all duration-300 border-border overflow-hidden cursor-pointer ${isActive ? 'ring-2 ring-primary shadow-lg -translate-y-1' : 'hover:shadow-md hover:border-primary/50'}`}
                  onMouseEnter={() => setActiveStreamId(stream.id)}
                  onMouseLeave={() => setActiveStreamId(null)}
                  onClick={() => setActiveStreamId(isActive ? null : stream.id)}
                >
                  <CardContent className="p-6 sm:p-8 flex flex-col items-center text-center relative z-10 h-full min-w-0 w-full">
                    <div className="w-20 h-20 shrink-0 rounded-2xl flex items-center justify-center mb-6 bg-bg-secondary border border-border shadow-sm transition-transform duration-300" style={{ color: stream.color || 'var(--primary)' }}>
                      {getLucideIcon(stream.icon, "w-12 h-12")}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-text-primary text-center leading-snug break-normal text-pretty w-full min-w-0">{stream.name}</h3>
                    <p className="text-text-muted mt-2 text-sm">{stream.description || 'Access specialized resources'}</p>

                    {isManageMode && (
                      <div className="mt-4 flex gap-2">
                        <button className="p-2 text-info hover:bg-info/10 rounded-lg border border-info/30 transition-colors" onClick={(e) => {
                          e.stopPropagation();
                          setEditingStream(stream);
                          setFormData(stream);
                        }}>
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-danger hover:bg-danger/10 rounded-lg border border-danger/30 transition-colors" onClick={(e) => handleDelete(e, 'al_streams', stream.id, stream.name)}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* Subjects Dropdown / Menu */}
                    <div className={`w-full mt-6 transition-all duration-300 ${isActive ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                      <div className="h-px bg-border w-full mb-4"></div>
                      <h6 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Select Subject</h6>
                      <div className="flex flex-col gap-2 overflow-y-auto max-h-[350px] pr-1 custom-scrollbar">
                        {streamSubjects.map(subject => (
                          <div key={subject.id} className="flex gap-2 w-full items-center">
                            <Link
                              to={`/al/${stream.id}/${subject.id}`}
                              className="flex-1 flex justify-between items-center px-4 py-2.5 border border-primary/20 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors text-sm font-semibold bg-primary/5"
                            >
                              <span className="flex items-center">
                                {getLucideIcon(subject.icon, "w-5 h-5 mr-2.5 opacity-80")}
                                {subject.name}
                              </span>
                              <ChevronRight className="w-4 h-4 opacity-70" />
                            </Link>
                            {isManageMode && (
                              <div className="flex flex-col gap-1">
                                <button className="p-1.5 bg-info/10 text-info hover:bg-info hover:text-white rounded-md transition-colors" onClick={(e) => {
                                  e.preventDefault();
                                  setEditingSubject(subject);
                                  setFormData(subject);
                                }}>
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button className="p-1.5 bg-danger/10 text-danger hover:bg-danger hover:text-white rounded-md transition-colors" onClick={(e) => handleDelete(e, 'al_subjects', subject.id, subject.name)}>
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                        {streamSubjects.length === 0 && (
                          <div className="text-text-muted text-sm py-2">No subjects available yet.</div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}

          {alStreams.length === 0 && (
            <div className="lg:col-span-2 text-center text-text-muted py-16 bg-card rounded-2xl border border-border">
              <Layers className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <h4 className="text-xl font-bold text-text-primary mb-2">No Streams Available</h4>
              <p>Please contact the administrator to set up Advanced Level streams.</p>
            </div>
          )}
        </div>
      </Section>

      {/* Tailwind Modals */}
      {(editingStream || editingSubject) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-border animate-fade-in">
            <div className="flex justify-between items-center px-6 py-4 border-b border-border bg-bg-secondary/50">
              <h5 className="text-lg font-bold text-text-primary">
                {editingStream ? `Edit Stream: ${editingStream.name}` : `Edit Subject: ${editingSubject.name}`}
              </h5>
              <button 
                type="button" 
                className="text-text-muted hover:text-text-primary transition-colors" 
                onClick={() => { setEditingStream(null); setEditingSubject(null); }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={editingStream ? handleUpdateStream : handleUpdateSubject}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">
                    {editingStream ? 'Stream Name' : 'Subject Name'}
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50" 
                    value={formData.name || ''} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })} 
                    required 
                  />
                </div>
                {editingStream && (
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Description</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50" 
                      value={formData.description || ''} 
                      onChange={e => setFormData({ ...formData, description: e.target.value })} 
                    />
                  </div>
                )}
                {editingStream && (
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Icon (Lucide name, e.g. layers, book)</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50" 
                      value={formData.icon || ''} 
                      onChange={e => setFormData({ ...formData, icon: e.target.value })} 
                    />
                  </div>
                )}
                {editingSubject && (
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Icon (Lucide name, e.g. book, calculator)</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50" 
                      value={formData.icon || ''} 
                      onChange={e => setFormData({ ...formData, icon: e.target.value })} 
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">Order (Priority)</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50" 
                    value={formData.order || 0} 
                    onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })} 
                  />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-border bg-bg-secondary/50 flex justify-end gap-3">
                <button 
                  type="button" 
                  className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-primary bg-bg-primary border border-border rounded-lg hover:bg-bg-secondary transition-colors" 
                  onClick={() => { setEditingStream(null); setEditingSubject(null); }}
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

export default ALStreamsPage;
