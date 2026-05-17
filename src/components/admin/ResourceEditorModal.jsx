import React, { useState, useEffect } from 'react';
import { useData } from '../../features/ol';
import toast from 'react-hot-toast';
import { isValidHttpsUrl } from '../../utils/validation';
import { Pencil, Plus, Info, Link as LinkIcon, Tags, Sliders, Check, X, ArrowRight } from 'lucide-react';

const ResourceEditorModal = ({ resource, isOpen, onClose }) => {
  const { 
    grades, 
    getSubjectsForGrade, 
    updateResource, 
    addTextbook,
    addPaper,
    addVideo,
    addNote,
    isSubmitting: globalSubmitting,
    fetchAllResources
  } = useData();
  const [formData, setFormData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (resource) {
        setFormData({
          id: resource.id,
          title: resource.title || resource.name || '',
          description: resource.description || '',
          url: resource.url || resource.driveLink || resource.youtubeUrl || '',
          languages: resource.languages || (resource.language ? [resource.language] : ['english']),
          order: resource.order || '',
          subject: resource.subject || '',
          grade: resource.grade || '',
          resourceType: resource.resourceType || 'textbook'
        });
      } else {
        // Initial state for NEW resource
        setFormData({
          title: '',
          description: '',
          url: '',
          languages: ['sinhala', 'tamil', 'english'],
          order: '',
          subject: '',
          grade: '',
          resourceType: 'textbook'
        });
      }
    }
  }, [resource, isOpen]);

  if (!isOpen || !formData) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (formData.url && !isValidHttpsUrl(formData.url.trim())) {
        toast.error('Please enter a valid secure URL starting with https://');
        setIsSubmitting(false);
        return;
      }
      if (formData.id) {
        await updateResource(formData.id, formData);
        toast.success('Resource updated successfully!');
      } else {
        // Handle ADD based on type
        const type = formData.resourceType;
        if (type === 'textbook') await addTextbook(formData);
        else if (type === 'papers') await addPaper(formData);
        else if (type === 'videos') await addVideo(formData);
        else if (type === 'notes') await addNote(formData);
        
        toast.success('Resource added successfully!');
        if (fetchAllResources) await fetchAllResources(true);
      }
      onClose();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const subjects = getSubjectsForGrade(formData.grade) || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-4xl bg-[#1e293b] rounded-2xl shadow-2xl overflow-hidden border border-white/10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex justify-between items-center border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#38bdf8]/10 text-[#38bdf8] flex items-center justify-center shadow-[inset_0_0_10px_rgba(56,189,248,0.2)]">
              {formData.id ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide m-0 leading-tight">
                {formData.id ? 'Edit' : 'Add New'} Resource
              </h2>
              <span className="text-xs text-[#94a3b8] tracking-widest uppercase">Management Mode Active</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            disabled={isSubmitting}
            className="text-[#94a3b8] hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col bg-[#0f172a]">
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Main Content Area */}
              <div className="lg:col-span-7">
                <div className="p-5 rounded-2xl bg-[#1e293b]/50 border border-white/5 backdrop-blur-md h-full">
                  <h6 className="flex items-center text-xs font-bold text-[#94a3b8] uppercase tracking-widest mb-5">
                    <Info className="w-4 h-4 mr-2 text-info" />
                    Resource Details
                  </h6>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-[#cbd5e1] mb-2 pl-1">Resource Title</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 bg-[#0f172a]/60 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/20 transition-all placeholder:text-[#64748b]" 
                        placeholder="e.g. Combined Maths - Integration"
                        value={formData.title} 
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        required 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-[#cbd5e1] mb-2 pl-1">Resource Link</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r border-white/10 pr-3 bg-[#1e293b]/80 rounded-l-xl">
                          <LinkIcon className="w-5 h-5 text-[#94a3b8]" />
                        </div>
                        <input 
                          type="text" 
                          className="w-full pl-[3.5rem] pr-4 py-3 bg-[#0f172a]/60 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/20 transition-all placeholder:text-[#64748b]" 
                          placeholder="Google Drive or YouTube URL"
                          value={formData.url} 
                          onChange={e => setFormData({ ...formData, url: e.target.value })}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-[#cbd5e1] mb-2 pl-1">
                        Short Description <span className="text-[#64748b] font-normal ml-1">(Optional)</span>
                      </label>
                      <textarea 
                        className="w-full px-4 py-3 bg-[#0f172a]/60 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/20 transition-all placeholder:text-[#64748b] resize-none" 
                        rows="4" 
                        placeholder="Tell students about this resource..."
                        value={formData.description} 
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Configuration Area */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                
                <div className="p-5 rounded-2xl bg-[#1e293b]/50 border border-white/5 backdrop-blur-md">
                  <h6 className="flex items-center text-xs font-bold text-[#94a3b8] uppercase tracking-widest mb-5">
                    <Tags className="w-4 h-4 mr-2 text-[#34d399]" />
                    Categorization
                  </h6>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#cbd5e1] mb-2 pl-1">Grade Level</label>
                      <select 
                        className="w-full px-4 py-2.5 bg-[#0f172a]/60 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/20 transition-all appearance-none cursor-pointer" 
                        value={formData.grade} 
                        onChange={e => {
                          const newGrade = e.target.value;
                          const availableSubjects = getSubjectsForGrade(newGrade);
                          const subjectKeys = Object.keys(availableSubjects);
                          setFormData({ 
                            ...formData, 
                            grade: newGrade,
                            subject: subjectKeys.length > 0 ? subjectKeys[0] : ''
                          });
                        }}
                      >
                        <option value="">Select Grade</option>
                        {Object.entries(grades).map(([key, g]) => (
                          <option key={key} value={key}>{g.display}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#cbd5e1] mb-2 pl-1">Subject</label>
                      <select 
                        className="w-full px-4 py-2.5 bg-[#0f172a]/60 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/20 transition-all appearance-none cursor-pointer" 
                        value={formData.subject} 
                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      >
                        <option value="">Select Subject</option>
                        {Object.entries(subjects).map(([key, s]) => (
                          <option key={key} value={key}>{s.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#cbd5e1] mb-2 pl-1">Type</label>
                      <select 
                        className="w-full px-4 py-2.5 bg-[#0f172a]/60 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/20 transition-all appearance-none cursor-pointer" 
                        value={formData.resourceType} 
                        onChange={e => setFormData({ ...formData, resourceType: e.target.value })}
                      >
                        <option value="textbook">Textbook</option>
                        <option value="papers">Past Paper / Model Paper</option>
                        <option value="notes">Short Note</option>
                        <option value="videos">Video Lesson</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#1e293b]/50 border border-white/5 backdrop-blur-md flex-1">
                  <h6 className="flex items-center text-xs font-bold text-[#94a3b8] uppercase tracking-widest mb-5">
                    <Sliders className="w-4 h-4 mr-2 text-warning" />
                    Parameters
                  </h6>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-[#cbd5e1] mb-2 pl-1">Language Availability</label>
                      <div className="flex flex-wrap gap-2">
                        {['sinhala', 'tamil', 'english'].map(lang => {
                          const isChecked = formData.languages.includes(lang);
                          return (
                            <button
                              type="button"
                              key={lang}
                              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all select-none border flex items-center ${
                                isChecked 
                                  ? 'bg-[#38bdf8]/10 border-[#38bdf8] text-[#38bdf8] shadow-[inset_0_0_10px_rgba(56,189,248,0.1)]' 
                                  : 'bg-[#0f172a]/60 border-white/10 text-[#94a3b8] hover:bg-[#1e293b]/80 hover:text-white'
                              }`}
                              onClick={() => {
                                if (!isChecked) {
                                  setFormData(prev => ({ ...prev, languages: [...prev.languages, lang] }));
                                } else {
                                  if (formData.languages.length > 1) {
                                    setFormData(prev => ({ ...prev, languages: prev.languages.filter(l => l !== lang) }));
                                  }
                                }
                              }}
                            >
                              {isChecked && <Check className="w-3.5 h-3.5 mr-1.5" />}
                              {lang.charAt(0).toUpperCase() + lang.slice(1)}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-semibold text-[#cbd5e1] mb-2 pl-1">
                        Priority Sort Order
                        <div className="relative group ml-1.5">
                          <Info className="w-3.5 h-3.5 text-[#64748b] cursor-help" />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max px-2 py-1 bg-black/80 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            Lower numbers appear first
                          </div>
                        </div>
                      </label>
                      <input 
                        type="number" 
                        className="w-24 px-3 py-2.5 text-center bg-[#0f172a]/60 border border-white/10 rounded-xl text-white font-mono text-lg focus:outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/20 transition-all" 
                        value={formData.order} 
                        onChange={e => setFormData({ ...formData, order: e.target.value })} 
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-[#0f172a] border-t border-white/5 flex justify-between items-center">
            <button 
              type="button" 
              className="px-6 py-2.5 rounded-xl border border-white/10 text-[#94a3b8] font-bold hover:bg-white/5 hover:text-white hover:border-white/20 transition-colors" 
              onClick={onClose} 
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-8 py-2.5 rounded-xl bg-primary text-white font-bold shadow-[0_4px_15px_rgba(13,110,253,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(13,110,253,0.4)] transition-all flex items-center disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-[0_4px_15px_rgba(13,110,253,0.3)]" 
              disabled={isSubmitting || globalSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  {formData.id ? 'Save Changes' : 'Initialize Resource'} 
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceEditorModal;
