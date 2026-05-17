import React, { memo } from 'react';
import { Book, FileText, StickyNote, PlayCircle, Globe, Hash, Pencil, Trash2, Check, X } from 'lucide-react';

const AdminResourceItem = ({ 
  file, 
  editingResource, 
  editResourceData, 
  setEditResourceData,
  handleSaveEditResource,
  handleCancelEditResource,
  setEditingResource,
  handleDeleteResource,
  isSubmitting,
  grades,
  getSubjectsForGrade
}) => {
  const isEditing = editingResource === file.id;

  if (isEditing) {
    return (
      <div className="p-4 border border-primary/30 rounded-xl bg-bg-secondary/50 mb-3 animate-fade-in shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-text-primary mb-1">Title</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 bg-bg-primary border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50" 
              value={editResourceData.title} 
              onChange={e => setEditResourceData({ ...editResourceData, title: e.target.value })} 
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-text-primary mb-1">URL (Drive / YouTube)</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 bg-bg-primary border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50" 
              value={editResourceData.url} 
              onChange={e => setEditResourceData({ ...editResourceData, url: e.target.value })} 
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-text-primary mb-1">Description</label>
            <textarea 
              className="w-full px-3 py-2 bg-bg-primary border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" 
              rows="2" 
              value={editResourceData.description} 
              onChange={e => setEditResourceData({ ...editResourceData, description: e.target.value })} 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">Grade</label>
              <select 
                className="w-full px-3 py-2 bg-bg-primary border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none" 
                value={editResourceData.grade} 
                onChange={e => {
                  const newGrade = e.target.value;
                  const availableSubjects = getSubjectsForGrade(newGrade);
                  const subjectKeys = Object.keys(availableSubjects);
                  setEditResourceData(prev => ({ 
                    ...prev, 
                    grade: newGrade, 
                    subject: subjectKeys.includes(prev.subject) ? prev.subject : (subjectKeys[0] || '') 
                  }));
                }}
              >
                {Object.entries(grades).map(([key, g]) => (
                  <option key={key} value={key}>{g.display}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">Subject</label>
              <select 
                className="w-full px-3 py-2 bg-bg-primary border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none" 
                value={editResourceData.subject} 
                onChange={e => setEditResourceData({ ...editResourceData, subject: e.target.value })}
              >
                {Object.entries(getSubjectsForGrade(editResourceData.grade)).map(([key, s]) => (
                  <option key={key} value={key}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">Languages</label>
              <div className="border border-border rounded-md px-3 py-2 bg-bg-primary max-h-24 overflow-y-auto space-y-1.5">
                {['english', 'sinhala', 'tamil'].map(lang => (
                  <label key={`edit-rlang-${lang}`} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      className="w-3.5 h-3.5 rounded border-border text-primary focus:ring-primary"
                      type="checkbox"
                      checked={editResourceData.languages.includes(lang)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setEditResourceData(prev => ({ ...prev, languages: [...prev.languages, lang] }));
                        } else {
                          setEditResourceData(prev => ({ ...prev, languages: prev.languages.filter(l => l !== lang) }));
                        }
                      }}
                    />
                    <span className="text-xs font-medium text-text-primary capitalize group-hover:text-primary transition-colors">
                      {lang}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">Order</label>
              <input 
                type="number" 
                className="w-full px-3 py-2 bg-bg-primary border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50" 
                placeholder="e.g 1" 
                value={editResourceData.order} 
                onChange={e => setEditResourceData({ ...editResourceData, order: e.target.value })} 
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
          <button 
            className="px-4 py-1.5 bg-bg-primary text-text-primary border border-border rounded-md text-sm font-medium hover:bg-bg-secondary transition-colors" 
            onClick={handleCancelEditResource} 
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-1.5 bg-success text-white rounded-md text-sm font-medium hover:bg-success/90 transition-colors flex items-center shadow-sm disabled:opacity-50" 
            onClick={handleSaveEditResource} 
            disabled={isSubmitting}
          >
            <Check className="w-4 h-4 mr-1.5" /> Save Changes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 border-b border-border hover:bg-bg-secondary/30 transition-colors rounded-lg">
      <div className="flex justify-between items-center">
        <div className="flex-grow min-w-0 pr-4">
          <div className="flex items-center mb-1">
            {file.resourceType === 'textbook' ? <Book className="w-4 h-4 mr-2 text-primary flex-shrink-0" /> :
             file.resourceType === 'papers' ? <FileText className="w-4 h-4 mr-2 text-primary flex-shrink-0" /> :
             file.resourceType === 'notes' ? <StickyNote className="w-4 h-4 mr-2 text-primary flex-shrink-0" /> :
             <PlayCircle className="w-4 h-4 mr-2 text-primary flex-shrink-0" />}
            <h6 className="mb-0 text-sm font-semibold text-text-primary truncate" title={file.title || file.name}>
              {file.title || file.name}
            </h6>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-bg-tertiary text-text-primary border border-border">
              {grades[file.grade]?.display || file.grade}
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
              {file.subject}
            </span>
            <span className="inline-flex items-center text-xs text-text-muted ml-1">
              <Globe className="w-3 h-3 mr-1" />
              {file.languages?.join(', ') || 'en'}
            </span>
            {file.order !== undefined && file.order !== 999 && (
              <span className="inline-flex items-center text-xs text-text-muted ml-1 pl-2 border-l border-border">
                <Hash className="w-3 h-3 mr-1" />
                {file.order}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-1.5 flex-shrink-0">
          <button
            className="p-1.5 text-info hover:bg-info/10 rounded-md border border-info/30 transition-colors"
            onClick={() => setEditingResource(file)}
            title="Edit resource"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            className="p-1.5 text-danger hover:bg-danger/10 rounded-md border border-danger/30 transition-colors"
            onClick={() => handleDeleteResource(file.id)}
            title="Delete resource"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(AdminResourceItem);
