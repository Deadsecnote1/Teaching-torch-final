import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import toast from 'react-hot-toast';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import ALAdminTab from '../../components/admin/ALAdminTab';
import { LayoutDashboard, LogOut, ToggleRight, ToggleLeft } from 'lucide-react';

// Refactored Components
import AdminOverview from '../../components/admin/AdminOverview';
import AdminResourceUpload from '../../components/admin/AdminResourceUpload';
import AdminFileManager from '../../components/admin/AdminFileManager';
import AdminGradeManager from '../../components/admin/AdminGradeManager';
import AdminSettingsManager from '../../components/admin/AdminSettingsManager';

import { isGoogleDriveLink, extractFileId } from '../../utils/googleDrive';
import { isYouTubeLink, extractYouTubeId } from '../../utils/youtube';
import { isValidHttpsUrl } from '../../utils/validation';

const AdminDashboard = () => {
  useDocumentTitle('Admin Dashboard');
  const navigate = useNavigate();
  const { currentUser, logout, isManageMode, toggleManageMode } = useAuth();
  const { selectedLanguage } = useLanguage();
  const {
    getStats,
    exportData,
    allResources,
    addTextbook,
    addPaper,
    addVideo,
    addNote,
    addGrade,
    getSubjectsForGrade,
    addSubject,
    deleteResource,
    updateResource,
    deleteGrade,
    deleteSubject,
    updateGrade,
    updateSubject,
    fetchResourcesPaginated,
    hasMore,
    grades,
    subjects,
    settings,
    updateSettings
  } = useData();

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedGrade, setSelectedGrade] = useState('grade6');
  const [selectedSubject, setSelectedSubject] = useState('mathematics');
  const [selectedResourceType, setSelectedResourceType] = useState('textbook');
  const [selectedPaperType, setSelectedPaperType] = useState('term');
  const [selectedPaperCategory, setSelectedPaperCategory] = useState('term1');
  const [selectedLanguages, setSelectedLanguages] = useState(['english']);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [driveLink, setDriveLink] = useState('');
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceDescription, setResourceDescription] = useState('');
  const [resourceOrder, setResourceOrder] = useState('');
  const [schoolName, setSchoolName] = useState('');

  // Add Grade/Subject State
  const [newGradeName, setNewGradeName] = useState('');
  const [newGradeCode, setNewGradeCode] = useState('');
  const [newGradeOrder, setNewGradeOrder] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectSinhala, setNewSubjectSinhala] = useState('');
  const [newSubjectTamil, setNewSubjectTamil] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('');
  const [newSubjectIcon, setNewSubjectIcon] = useState('book');
  const [newSubjectOrder, setNewSubjectOrder] = useState('');
  const [selectedGradesForSubject, setSelectedGradesForSubject] = useState([]);

  // Edit State
  const [editingGradeId, setEditingGradeId] = useState(null);
  const [editGradeData, setEditGradeData] = useState({ name: '', order: '' });
  const [editingSubjectPrefix, setEditingSubjectPrefix] = useState(null);
  const [editSubjectData, setEditSubjectData] = useState({ name: '', nameSinhala: '', nameTamil: '', icon: '', order: '', grades: [], languages: [] });
  const [editingResource, setEditingResource] = useState(null);
  const [editResourceData, setEditResourceData] = useState({ title: '', description: '', url: '', languages: ['english'], order: '', subject: '', grade: '' });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Settings State
  const [settingsData, setSettingsData] = useState({
    whatsapp: '', email: '', phone: '', facebook: '',
    adsenseClientId: '', slotHomeHero: '', slotHomeFooter: '',
    slotGradeHeader: '', slotTextbooksHeader: '', slotPapersHeader: '', slotNotesHeader: ''
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  useEffect(() => {
    if (settings) {
      setSettingsData({
        whatsapp: settings.whatsapp || '',
        email: settings.email || '',
        phone: settings.phone || '',
        facebook: settings.facebook || '',
        adsenseClientId: settings.adsenseClientId || '',
        slotHomeHero: settings.slotHomeHero || '',
        slotHomeFooter: settings.slotHomeFooter || '',
        slotGradeHeader: settings.slotGradeHeader || '',
        slotTextbooksHeader: settings.slotTextbooksHeader || '',
        slotPapersHeader: settings.slotPapersHeader || '',
        slotNotesHeader: settings.slotNotesHeader || ''
      });
    }
  }, [settings]);

  useEffect(() => {
    // Only fetch if we are on the files tab AND we haven't loaded any resources yet
    if (activeTab === 'files' && allResources.length === 0) {
      fetchResourcesPaginated(true);
    }
  }, [activeTab, fetchResourcesPaginated, allResources.length]);

  useEffect(() => {
    if (allResources) {
      setUploadedFiles(allResources);
    }
  }, [allResources]);

  useEffect(() => {
    if (!currentUser) navigate('/admin/login');
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleAddDriveLink = async () => {
    if (!driveLink.trim() || !resourceTitle.trim() || selectedLanguages.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!isValidHttpsUrl(driveLink.trim())) {
      toast.error('Please enter a valid secure URL starting with https://');
      return;
    }

    setIsSubmitting(true);
    try {
      const fileData = {
        title: resourceTitle.trim(),
        description: resourceDescription.trim(),
        name: resourceTitle.trim(),
        url: driveLink.trim(),
        order: resourceOrder !== '' ? parseInt(resourceOrder, 10) : 999,
        addedBy: currentUser ? currentUser.email : 'admin'
      };

      if (selectedResourceType === 'videos' && isYouTubeLink(driveLink)) {
        fileData.youtubeUrl = driveLink.trim();
        fileData.fileId = extractYouTubeId(driveLink);
      } else {
        fileData.driveLink = driveLink.trim();
        fileData.fileId = extractFileId(driveLink);
      }

      let result;
      if (selectedResourceType === 'textbook') {
        result = await addTextbook(selectedGrade, selectedSubject, selectedLanguages, fileData);
      } else if (selectedResourceType === 'papers') {
        result = await addPaper(selectedGrade, selectedSubject, selectedPaperType, selectedPaperCategory, fileData, schoolName, selectedLanguages);
      } else if (selectedResourceType === 'videos') {
        result = await addVideo(selectedGrade, selectedSubject, { ...fileData, languages: selectedLanguages });
      } else if (selectedResourceType === 'notes') {
        result = await addNote(selectedGrade, selectedSubject, fileData, selectedLanguages);
      }

      // OPTIMISTIC UPDATE: Add to local state immediately
      if (result && result.id) {
        setUploadedFiles(prev => [{ id: result.id, ...fileData, languages: selectedLanguages, grade: selectedGrade, subject: selectedSubject, resourceType: selectedResourceType, paperType: selectedPaperType, paperCategory: selectedPaperCategory, schoolName }, ...prev]);
      }
      
      setDriveLink('');
      setResourceTitle('');
      setResourceDescription('');
      setResourceOrder('');
      toast.success('Resource added successfully!');
    } catch (error) {
      toast.error('Failed to add resource: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEditResource = async () => {
    setIsSubmitting(true);
    try {
      const updateData = {
        title: editResourceData.title.trim(),
        name: editResourceData.title.trim(),
        description: editResourceData.description.trim(),
        order: editResourceData.order !== '' ? parseInt(editResourceData.order, 10) : 999,
        languages: editResourceData.languages,
        subject: editResourceData.subject,
        grade: editResourceData.grade,
        url: editResourceData.url.trim()
      };

      if (!isValidHttpsUrl(updateData.url)) {
        toast.error('Please enter a valid secure URL starting with https://');
        setIsSubmitting(false);
        return;
      }

      if (isYouTubeLink(editResourceData.url)) {
        updateData.youtubeUrl = editResourceData.url.trim();
        updateData.fileId = extractYouTubeId(editResourceData.url);
      } else if (isGoogleDriveLink(editResourceData.url)) {
        updateData.driveLink = editResourceData.url.trim();
        updateData.fileId = extractFileId(editResourceData.url);
      }

      await updateResource(editingResource, updateData);
      
      // OPTIMISTIC UPDATE: Update local state
      setUploadedFiles(prev => prev.map(f => f.id === editingResource ? { ...f, ...updateData } : f));
      
      toast.success('Resource updated!');
      setEditingResource(null);
    } catch (error) {
      toast.error('Failed to update: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteResource = async (id) => {
    if (window.confirm('Delete this resource?')) {
      try {
        await deleteResource(id);
        
        // OPTIMISTIC UPDATE: Remove from local state
        setUploadedFiles(prev => prev.filter(f => f.id !== id));
        
        toast.success('Deleted!');
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      await updateSettings(settingsData);
      toast.success('Settings saved!');
    } catch (error) {
      toast.error('Save failed');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleAddGrade = async () => {
    if (!newGradeName.trim() || !newGradeCode.trim()) return;
    setIsSubmitting(true);
    try {
      await addGrade(newGradeCode.trim(), { display: newGradeName.trim(), order: newGradeOrder !== '' ? parseInt(newGradeOrder, 10) : 999 });
      toast.success('Grade added!');
      setNewGradeName(''); setNewGradeCode(''); setNewGradeOrder('');
    } catch (error) { toast.error('Add grade failed'); } finally { setIsSubmitting(false); }
  };

  const handleAddSubject = async () => {
    if (!newSubjectName.trim() || !newSubjectCode.trim()) return;
    setIsSubmitting(true);
    try {
      await addSubject(newSubjectCode.trim(), {
        name: newSubjectName.trim(),
        nameSinhala: newSubjectSinhala.trim(),
        nameTamil: newSubjectTamil.trim(),
        icon: newSubjectIcon.trim(),
        order: newSubjectOrder !== '' ? parseInt(newSubjectOrder, 10) : 999,
        grades: selectedGradesForSubject
      });
      toast.success('Subject added!');
      setNewSubjectName(''); setNewSubjectCode(''); setSelectedGradesForSubject([]);
    } catch (error) { toast.error('Add subject failed'); } finally { setIsSubmitting(false); }
  };

  const filteredFiles = uploadedFiles.filter(file => {
    const s = searchQuery.toLowerCase();
    return (file.title || file.name || '').toLowerCase().includes(s) || (file.grade || '').toLowerCase().includes(s) || (file.subject || '').toLowerCase().includes(s);
  });

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    await fetchResourcesPaginated(false);
    setIsLoadingMore(false);
  };

  return (
    <div className="min-h-screen py-10 bg-bg-secondary text-text-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-3xl font-extrabold flex items-center text-text-primary">
            <LayoutDashboard className="w-8 h-8 mr-3 text-primary" />
            Admin Dashboard
          </h2>
          <div className="flex flex-wrap gap-3">
            <button 
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors shadow-sm border ${isManageMode ? 'bg-success text-white border-success hover:bg-success/90' : 'bg-transparent text-success border-success hover:bg-success/10'}`} 
              onClick={toggleManageMode}
            >
              {isManageMode ? <ToggleRight className="w-5 h-5 mr-2" /> : <ToggleLeft className="w-5 h-5 mr-2" />}
              Manage Mode: {isManageMode ? 'ON' : 'OFF'}
            </button>
            <button 
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors border border-danger text-danger hover:bg-danger/10" 
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>

        {/* Custom Tabs */}
        <div className="flex overflow-x-auto border-b border-border mb-8 scrollbar-hide">
          {['overview', 'upload', 'files', 'grades', 'al', 'settings'].map(tab => (
            <button 
              key={tab}
              className={`whitespace-nowrap py-4 px-6 font-medium text-sm border-b-2 transition-colors ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-primary hover:border-border'}`} 
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'al' ? 'A/L Admin' : tab === 'files' ? 'File Manager' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          {activeTab === 'overview' && (
            <AdminOverview 
              stats={getStats()} 
              uploadedFilesCount={uploadedFiles.length} 
              exportData={exportData} 
              setActiveTab={setActiveTab} 
              fileGroupsCount={0} 
            />
          )}

          {activeTab === 'upload' && (
            <AdminResourceUpload 
              {...{ selectedGrade, setSelectedGrade, grades, selectedSubject, setSelectedSubject, getSubjectsForGrade, selectedResourceType, setSelectedResourceType, selectedLanguage, selectedPaperType, setSelectedPaperType, selectedPaperCategory, setSelectedPaperCategory, schoolName, setSchoolName, selectedLanguages, setSelectedLanguages, driveLink, setDriveLink, resourceTitle, setResourceTitle, resourceDescription, setResourceDescription, resourceOrder, setResourceOrder, handleAddDriveLink, isSubmitting }}
            />
          )}

          {activeTab === 'files' && (
            <AdminFileManager 
              {...{ searchQuery, setSearchQuery, filteredFiles, editingResource, editResourceData, setEditResourceData, handleSaveEditResource, handleCancelEditResource: () => setEditingResource(null), setEditingResource: (f) => { setEditingResource(f.id); setEditResourceData({ ...f, url: f.url || f.driveLink || f.youtubeUrl || '' }); }, handleDeleteResource, handleDeleteSelected: () => toast.error('Bulk delete disabled'), handleRefresh: () => fetchResourcesPaginated(true), isSubmitting, grades, getSubjectsForGrade, fetchResourcesPaginated: handleLoadMore, hasMore, isLoadingMore }}
            />
          )}

          {activeTab === 'grades' && (
            <AdminGradeManager 
              {...{ grades, subjects, newGradeName, setNewGradeName, newGradeCode, setNewGradeCode, newGradeOrder, setNewGradeOrder, handleAddGrade, isSubmitting, editingGradeId, setEditingGradeId, editGradeData, setEditGradeData, handleSaveEditGrade: async () => { try { await updateGrade(editingGradeId, { display: editGradeData.name, order: parseInt(editGradeData.order) || 999 }); toast.success('Updated!'); setEditingGradeId(null); } catch(e){ toast.error('Update failed'); } }, handleDeleteGrade: async (id) => { if(window.confirm('Delete grade?')){ try { await deleteGrade(id); toast.success('Deleted!'); } catch(e){ toast.error('Delete failed'); } } }, newSubjectName, setNewSubjectName, newSubjectSinhala, setNewSubjectSinhala, newSubjectTamil, setNewSubjectTamil, newSubjectCode, setNewSubjectCode, newSubjectIcon, setNewSubjectIcon, newSubjectOrder, setNewSubjectOrder, selectedGradesForSubject, setSelectedGradesForSubject, handleAddSubject, editingSubjectPrefix, editSubjectData, setEditSubjectData, handleEditSubjectClick: (k, s) => { setEditingSubjectPrefix(k); setEditSubjectData({ ...s, nameSinhala: s.nameSinhala || '', nameTamil: s.nameTamil || '' }); }, handleCancelEditSubject: () => setEditingSubjectPrefix(null), handleSaveEditSubject: async () => { try { await updateSubject(editingSubjectPrefix, { ...editSubjectData, order: parseInt(editSubjectData.order) || 999 }); toast.success('Updated!'); setEditingSubjectPrefix(null); } catch(e){ toast.error('Update failed'); } }, handleDeleteSubject: async (id) => { if(window.confirm('Delete subject?')){ try { await deleteSubject(id); toast.success('Deleted!'); } catch(e){ toast.error('Delete failed'); } } } }}
            />
          )}

          {activeTab === 'al' && <ALAdminTab />}

          {activeTab === 'settings' && (
            <AdminSettingsManager {...{ settingsData, setSettingsData, handleSaveSettings, isSavingSettings }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;