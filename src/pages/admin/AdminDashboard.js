import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { isGoogleDriveLink, extractFileId } from '../../utils/googleDrive';
import { isYouTubeLink, extractYouTubeId } from '../../utils/youtube';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
  const navigate = useNavigate();
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
    deleteGrade,
    deleteSubject,
    updateSubject,
    grades,
    subjects,
    settings,
    updateSettings
  } = useData();
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // overview, resources, grades, subjects
  const [selectedGrade, setSelectedGrade] = useState('grade6');
  const [selectedSubject, setSelectedSubject] = useState('mathematics');
  const [selectedResourceType, setSelectedResourceType] = useState('textbook');
  const [selectedPaperType, setSelectedPaperType] = useState('term'); // 'term' or 'chapter'
  const [selectedPaperCategory, setSelectedPaperCategory] = useState('term1'); // For term papers: term1, term2, term3. For chapter papers: chapter name
  const [selectedLanguages, setSelectedLanguages] = useState(['english']);
  // const [fileList, setFileList] = useState([]); // Removed file upload state as we use links
  // const [uploadProgress, setUploadProgress] = useState(0); 
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [driveLink, setDriveLink] = useState('');
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceDescription, setResourceDescription] = useState('');
  const [schoolName, setSchoolName] = useState('');

  // Add Grade State
  const [newGradeName, setNewGradeName] = useState('');
  const [newGradeCode, setNewGradeCode] = useState('');

  // Add Subject State
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectNameSinhala, setNewSubjectNameSinhala] = useState('');
  const [newSubjectNameTamil, setNewSubjectNameTamil] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('');
  const [newSubjectIcon, setNewSubjectIcon] = useState('bi-book');
  const [newSubjectGrades, setNewSubjectGrades] = useState([]);

  // Edit Subject State
  const [editingSubjectPrefix, setEditingSubjectPrefix] = useState(null);
  const [editSubjectData, setEditSubjectData] = useState({
    name: '',
    nameSinhala: '',
    nameTamil: '',
    icon: '',
    grades: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Settings State
  const [settingsData, setSettingsData] = useState({
    whatsapp: '',
    email: '',
    phone: '',
    facebook: ''
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  useEffect(() => {
    if (settings) {
      setSettingsData({
        whatsapp: settings.whatsapp || '',
        email: settings.email || '',
        phone: settings.phone || '',
        facebook: settings.facebook || ''
      });
    }
  }, [settings]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      await updateSettings(settingsData);
      toast.success('Settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const stats = getStats();

  // Sync uploadedFiles with allResources from Context
  useEffect(() => {
    if (allResources) {
      setUploadedFiles(allResources);
    }
  }, [allResources]);

  // Check if admin is logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/admin/login');
    }
  }, [currentUser, navigate]);

  // Auto-correct selected subject when grade changes
  useEffect(() => {
    const availableSubjects = getSubjectsForGrade(selectedGrade);
    const subjectKeys = Object.keys(availableSubjects);
    if (subjectKeys.length > 0 && !subjectKeys.includes(selectedSubject)) {
      setSelectedSubject(subjectKeys[0]);
    } else if (subjectKeys.length === 0 && selectedSubject !== '') {
      setSelectedSubject('');
    }
  }, [selectedGrade, getSubjectsForGrade, selectedSubject]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const handleLanguageToggle = (language) => {
    setSelectedLanguages(prev =>
      prev.includes(language)
        ? prev.filter(lang => lang !== language)
        : [...prev, language]
    );
  };

  const handleAddDriveLink = async () => {
    if (!driveLink.trim()) {
      toast.error('Please enter a Google Drive link or YouTube URL');
      return;
    }

    // Check if it's a video resource type
    if (selectedResourceType === 'videos') {
      // Allow YouTube links for videos
      if (!isYouTubeLink(driveLink) && !isGoogleDriveLink(driveLink)) {
        toast.error('Please enter a valid YouTube URL or Google Drive link.\n\nYouTube: https://www.youtube.com/watch?v=VIDEO_ID\nGoogle Drive: https://drive.google.com/file/d/FILE_ID/view');
        return;
      }
    } else {
      // For other resources, only Google Drive
      if (!isGoogleDriveLink(driveLink)) {
        toast.error('Please enter a valid Google Drive link.\n\nExample: https://drive.google.com/file/d/FILE_ID/view');
        return;
      }
    }

    if (selectedLanguages.length === 0) {
      toast.error('Please select at least one language');
      return;
    }

    if (!resourceTitle.trim()) {
      toast.error('Please enter a title for this resource');
      return;
    }

    setIsSubmitting(true);

    try {
      // Common file data
      const fileData = {
        title: resourceTitle.trim(),
        description: resourceDescription.trim() || '',
        name: resourceTitle.trim(),
        url: driveLink.trim(),
        addedBy: currentUser ? currentUser.email : 'admin'
      };

      // Specific handling based on link type
      if (selectedResourceType === 'videos' && isYouTubeLink(driveLink)) {
        fileData.youtubeUrl = driveLink.trim();
        fileData.fileId = extractYouTubeId(driveLink);
      } else {
        fileData.driveLink = driveLink.trim();
        fileData.fileId = extractFileId(driveLink);
      }

      // Call DataContext actions based on type
      if (selectedResourceType === 'textbook') {
        // Add for each selected language (though usually one)
        for (const lang of selectedLanguages) {
          await addTextbook(selectedGrade, selectedSubject, lang, fileData);
        }
      } else if (selectedResourceType === 'papers') {
        // Default to first language if multiple selected (papers usually one lang per PDF)
        const lang = selectedLanguages[0];
        await addPaper(selectedGrade, selectedSubject, selectedPaperType, selectedPaperCategory, fileData, schoolName, lang);
      } else if (selectedResourceType === 'videos') {
        const lang = selectedLanguages[0];
        await addVideo(selectedGrade, selectedSubject, { ...fileData, language: lang });
      } else if (selectedResourceType === 'notes') {
        const lang = selectedLanguages[0];
        await addNote(selectedGrade, selectedSubject, fileData, lang);
      } else {
        toast.error('Unsupported resource type.');
        setIsSubmitting(false);
        return;
      }

      // Success notification
      toast.success(`Successfully added resource!`);

      // Reset form
      setDriveLink('');
      setResourceTitle('');
      setResourceDescription('');
      setSelectedLanguages(['english']);
      setSchoolName('');
      if (selectedResourceType === 'papers') {
        setSelectedPaperType('term');
        setSelectedPaperCategory('term1');
      }

    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Error adding document: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSelected = () => {
    toast.error("Bulk delete is disabled in Firestore mode for safety.");
  };

  const handleEditSubjectClick = (key, subject) => {
    setEditingSubjectPrefix(key);
    setEditSubjectData({
      name: subject.name || '',
      nameSinhala: subject.nameSinhala || '',
      nameTamil: subject.nameTamil || '',
      icon: subject.icon || '',
      grades: subject.grades || []
    });
  };

  const handleCancelEditSubject = () => {
    setEditingSubjectPrefix(null);
  };

  const handleSaveEditSubject = async () => {
    if (!editSubjectData.name.trim()) {
      toast.error('Subject English name is required');
      return;
    }
    if (editSubjectData.grades.length === 0) {
      toast.error('Please select at least one grade');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateSubject(editingSubjectPrefix, {
        name: editSubjectData.name.trim(),
        nameSinhala: editSubjectData.nameSinhala.trim() || null,
        nameTamil: editSubjectData.nameTamil.trim() || null,
        icon: editSubjectData.icon.trim() || 'bi-book',
        grades: editSubjectData.grades
      });
      toast.success('Subject updated successfully!');
      setEditingSubjectPrefix(null);
    } catch (error) {
      toast.error('Failed to update subject: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteResource = async (resourceId) => {
    if (window.confirm('Are you sure you want to delete this resource? This action cannot be undone.')) {
      try {
        await deleteResource(resourceId);
        // UI updates automatically via onSnapshot in DataContext
        toast.success('Resource deleted successfully!');
      } catch (error) {
        console.error("Error deleting resource: ", error);
        toast.error("Failed to delete resource: " + error.message);
      }
    }
  };

  const handleRefresh = () => {
    // No op - Firestore listens in real-time
    toast.success('Data is automatically synced with Firestore!');
  };

  // Filter files based on search query
  const filteredFiles = uploadedFiles.filter(file => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (file.title || file.name || '').toLowerCase().includes(searchLower) ||
      (file.grade || '').toLowerCase().includes(searchLower) ||
      (file.subject || '').toLowerCase().includes(searchLower)
    );
  });

  // Group uploaded files by grade/subject/type
  const getFileGroups = () => {
    const groups = {};
    uploadedFiles.forEach(file => {
      const key = `${file.grade}/${file.subject}/${file.resourceType}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(file);
    });
    return groups;
  };

  const fileGroups = getFileGroups();

  // Handlers for dynamic grades and subjects
  const handleAddGrade = async () => {
    if (!newGradeName.trim() || !newGradeCode.trim()) {
      toast.error('Please enter both grade code and display name');
      return;
    }
    try {
      setIsSubmitting(true);
      await addGrade(newGradeCode.trim().toLowerCase(), {
        name: newGradeName.trim(),
        display: newGradeName.trim(),
        active: true
      });
      toast.success('Grade created successfully!');
      setNewGradeName('');
      setNewGradeCode('');
    } catch (e) {
      toast.error('Failed to create grade');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSubject = async () => {
    if (!newSubjectName.trim() || !newSubjectCode.trim()) {
      toast.error('Please enter both subject code and display name');
      return;
    }
    if (newSubjectGrades.length === 0) {
      toast.error('Please select at least one grade for this subject');
      return;
    }
    try {
      setIsSubmitting(true);
      await addSubject(newSubjectCode.trim().toLowerCase(), {
        name: newSubjectName.trim(),
        nameSinhala: newSubjectNameSinhala.trim(),
        nameTamil: newSubjectNameTamil.trim(),
        icon: newSubjectIcon.trim(),
        grades: newSubjectGrades
      });
      toast.success('Subject created successfully!');
      setNewSubjectName('');
      setNewSubjectNameSinhala('');
      setNewSubjectNameTamil('');
      setNewSubjectCode('');
      setNewSubjectGrades([]);
    } catch (e) {
      toast.error('Failed to create subject');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGrade = async (gradeId) => {
    if (window.confirm(`Are you sure you want to delete this grade? This action cannot be undone.`)) {
      try {
        await deleteGrade(gradeId);
        toast.success('Grade deleted successfully!');
      } catch (error) {
        console.error("Error deleting grade: ", error);
        toast.error("Failed to delete grade: " + error.message);
      }
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    if (window.confirm(`Are you sure you want to delete this subject? This action cannot be undone.`)) {
      try {
        await deleteSubject(subjectId);
        toast.success('Subject deleted successfully!');
      } catch (error) {
        console.error("Error deleting subject: ", error);
        toast.error("Failed to delete subject: " + error.message);
      }
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Admin Header */}
      <header className="page-header">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div className="flex-grow-1 text-center">
              <h1 className="display-4 fw-bold">Admin Dashboard</h1>
              <p className="lead">Teaching Torch Administration Panel</p>
            </div>
            <button onClick={handleLogout} className="btn btn-outline-light">
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <section className="py-3">
        <div className="container">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <i className="bi bi-speedometer2 me-2"></i>
                Overview
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'resources' ? 'active' : ''}`}
                onClick={() => setActiveTab('resources')}
              >
                <i className="bi bi-folder me-2"></i>
                Manage Resources
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'grades' ? 'active' : ''}`}
                onClick={() => setActiveTab('grades')}
              >
                <i className="bi bi-mortarboard me-2"></i>
                Grades & Subjects
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <i className="bi bi-gear me-2"></i>
                Settings
              </button>
            </li>
          </ul>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-5">
        <div className="container">
          {activeTab === 'overview' && (
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
                      <h3 className="mt-3">{uploadedFiles.length}</h3>
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
                          className="btn btn-primary"
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
                          onClick={() => setActiveTab('resources')}
                        >
                          <i className="bi bi-folder-plus me-2"></i>
                          Manage Resources ({uploadedFiles.length} files)
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
                      {uploadedFiles.length > 0 ? (
                        <div>
                          <p>Total files uploaded: <strong>{uploadedFiles.length}</strong></p>
                          <p>Storage locations: <strong>{Object.keys(fileGroups).length}</strong></p>
                        </div>
                      ) : (
                        <p className="text-muted">No files uploaded yet. Use the Manage Resources tab to upload files.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'resources' && (
            <div className="row g-4">
              {/* Upload Files Section */}
              <div className="col-md-8">
                <div className="card">
                  <div className="card-header">
                    <h5>
                      <i className="bi bi-cloud-upload me-2"></i>
                      Upload Files
                    </h5>
                  </div>
                  <div className="card-body">
                    {/* Selection Controls */}
                    <div className="row g-3 mb-4">
                      <div className="col-md-4">
                        <label className="form-label">Select Grade</label>
                        <select
                          className="form-select"
                          value={selectedGrade}
                          onChange={(e) => {
                            setSelectedGrade(e.target.value);
                            // When grade changes, potentially reset subject if old subject isn't in new grade
                            const availableSubjects = getSubjectsForGrade(e.target.value);
                            const availableKeys = Object.keys(availableSubjects);
                            if (availableKeys.length > 0 && !availableKeys.includes(selectedSubject)) {
                              setSelectedSubject(availableKeys[0]);
                            } else if (availableKeys.length === 0) {
                              setSelectedSubject('');
                            }
                          }}
                        >
                          {Object.entries(grades).map(([key, g]) => (
                            <option key={key} value={key}>{g.display}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Select Subject</label>
                        <select
                          className="form-select"
                          value={selectedSubject}
                          onChange={(e) => setSelectedSubject(e.target.value)}
                          disabled={Object.keys(getSubjectsForGrade(selectedGrade)).length === 0}
                        >
                          {Object.entries(getSubjectsForGrade(selectedGrade)).length > 0 ? (
                            Object.entries(getSubjectsForGrade(selectedGrade)).map(([key, s]) => (
                              <option key={key} value={key}>{s.name}</option>
                            ))
                          ) : (
                            <option value="">No subjects available</option>
                          )}
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Resource Type</label>
                        <select
                          className="form-select"
                          value={selectedResourceType}
                          onChange={(e) => {
                            setSelectedResourceType(e.target.value);
                            // Reset paper-specific fields when changing resource type
                            if (e.target.value !== 'papers') {
                              setSelectedPaperType('term');
                              setSelectedPaperCategory('term1');
                              setSchoolName('');
                            }
                          }}
                        >
                          <option value="textbook">Textbook</option>
                          <option value="notes">Notes</option>
                          <option value="papers">Past Papers</option>
                          <option value="videos">Videos</option>
                        </select>
                      </div>
                    </div>

                    {/* Paper Type Selection (only for papers) */}
                    {selectedResourceType === 'papers' && (
                      <div className="row g-3 mb-4">
                        <div className="col-md-6">
                          <label className="form-label">Paper Type</label>
                          <select
                            className="form-select"
                            value={selectedPaperType}
                            onChange={(e) => {
                              setSelectedPaperType(e.target.value);
                              // Reset category when changing paper type
                              if (e.target.value === 'term') {
                                setSelectedPaperCategory('term1');
                              } else {
                                setSelectedPaperCategory('chapter1');
                              }
                            }}
                          >
                            <option value="term">Term Papers</option>
                            <option value="chapter">Chapter Papers</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            {selectedPaperType === 'term' ? 'Term' : 'Chapter'}
                          </label>
                          {selectedPaperType === 'term' ? (
                            <select
                              className="form-select"
                              value={selectedPaperCategory}
                              onChange={(e) => setSelectedPaperCategory(e.target.value)}
                            >
                              <option value="term1">1st Term</option>
                              <option value="term2">2nd Term</option>
                              <option value="term3">3rd Term</option>
                            </select>
                          ) : (
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g., Chapter 1, Chapter 2, etc."
                              value={selectedPaperCategory}
                              onChange={(e) => setSelectedPaperCategory(e.target.value)}
                            />
                          )}
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">School Name (Optional)</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="e.g., Royal College, Ananda College"
                            value={schoolName}
                            onChange={(e) => setSchoolName(e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    {/* Language Selection */}
                    <div className="mb-4">
                      <label className="form-label">Select Language(s)</label>
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className={`btn ${selectedLanguages.includes('sinhala') ? 'btn-danger' : 'btn-outline-danger'}`}
                          onClick={() => handleLanguageToggle('sinhala')}
                        >
                          සිංහල
                        </button>
                        <button
                          type="button"
                          className={`btn ${selectedLanguages.includes('tamil') ? 'btn-success' : 'btn-outline-success'}`}
                          onClick={() => handleLanguageToggle('tamil')}
                        >
                          தமிழ்
                        </button>
                        <button
                          type="button"
                          className={`btn ${selectedLanguages.includes('english') ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => handleLanguageToggle('english')}
                        >
                          English
                        </button>
                      </div>
                    </div>

                    {/* Link Input (Google Drive or YouTube) */}
                    <div className="mb-4">
                      <label className="form-label">
                        <i className="bi bi-link-45deg me-2"></i>
                        {selectedResourceType === 'videos' ? 'YouTube URL or Google Drive Link' : 'Google Drive Link'} <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={selectedResourceType === 'videos'
                          ? "https://www.youtube.com/watch?v=VIDEO_ID or Google Drive link"
                          : "https://drive.google.com/file/d/FILE_ID/view"}
                        value={driveLink}
                        onChange={(e) => setDriveLink(e.target.value)}
                      />
                      <div className="form-text">
                        <small>
                          <i className="bi bi-info-circle me-1"></i>
                          {selectedResourceType === 'videos'
                            ? 'Paste YouTube URL or Google Drive link. For YouTube: Use the full watch URL.'
                            : 'Paste the Google Drive share link here. Make sure the file is set to "Anyone with the link can view"'}
                        </small>
                      </div>
                      {driveLink && selectedResourceType === 'videos' && isYouTubeLink(driveLink) && (
                        <div className="alert alert-success mt-2 mb-0">
                          <small>
                            <i className="bi bi-youtube me-1"></i>
                            Valid YouTube URL detected! Video ID: {extractYouTubeId(driveLink)}
                          </small>
                        </div>
                      )}
                      {driveLink && selectedResourceType === 'videos' && !isYouTubeLink(driveLink) && !isGoogleDriveLink(driveLink) && (
                        <div className="alert alert-warning mt-2 mb-0">
                          <small>
                            <i className="bi bi-exclamation-triangle me-1"></i>
                            Please enter a valid YouTube URL or Google Drive link
                          </small>
                        </div>
                      )}
                      {driveLink && selectedResourceType !== 'videos' && !isGoogleDriveLink(driveLink) && (
                        <div className="alert alert-warning mt-2 mb-0">
                          <small>
                            <i className="bi bi-exclamation-triangle me-1"></i>
                            This doesn't look like a valid Google Drive link
                          </small>
                        </div>
                      )}
                      {driveLink && selectedResourceType !== 'videos' && isGoogleDriveLink(driveLink) && (
                        <div className="alert alert-success mt-2 mb-0">
                          <small>
                            <i className="bi bi-check-circle me-1"></i>
                            Valid Google Drive link detected! File ID: {extractFileId(driveLink)}
                          </small>
                        </div>
                      )}
                    </div>

                    {/* Resource Title */}
                    <div className="mb-4">
                      <label className="form-label">
                        <i className="bi bi-type me-2"></i>
                        Resource Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., Grade 6 Mathematics Textbook - Sinhala"
                        value={resourceTitle}
                        onChange={(e) => setResourceTitle(e.target.value)}
                      />
                    </div>

                    {/* Resource Description (Optional) */}
                    <div className="mb-4">
                      <label className="form-label">
                        <i className="bi bi-card-text me-2"></i>
                        Description (Optional)
                      </label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Additional information about this resource..."
                        value={resourceDescription}
                        onChange={(e) => setResourceDescription(e.target.value)}
                      />
                    </div>

                    {/* Add Resource Button */}
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-primary"
                        onClick={handleAddDriveLink}
                        disabled={!driveLink.trim() || !resourceTitle.trim() || selectedLanguages.length === 0 || isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="me-2" style={{ display: 'inline-block' }}>
                              <LoadingSpinner size="small" color="light" />
                            </div>
                            Adding...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-plus-circle me-2"></i>
                            Add Resource
                          </>
                        )}
                      </button>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          setDriveLink('');
                          setResourceTitle('');
                          setResourceDescription('');
                          setSelectedLanguages(['english']);
                          setSchoolName('');
                          if (selectedResourceType === 'papers') {
                            setSelectedPaperType('term');
                            setSelectedPaperCategory('term1');
                          }
                        }}
                      >
                        <i className="bi bi-x-circle me-2"></i>
                        Clear
                      </button>
                    </div>

                    {/* Instructions */}
                    <div className="alert alert-info mt-4">
                      <h6 className="mb-2">
                        <i className="bi bi-question-circle me-2"></i>
                        How to Add Resources:
                      </h6>
                      {selectedResourceType === 'videos' ? (
                        <ol className="mb-0 small">
                          <li><strong>For YouTube:</strong> Copy the video URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID)</li>
                          <li><strong>For Google Drive:</strong> Upload video, share as "Anyone with the link", copy link</li>
                          <li>Paste the URL in the field above</li>
                          <li>Fill in title, description, and select language(s)</li>
                          <li>Click "Add Resource"</li>
                        </ol>
                      ) : (
                        <ol className="mb-0 small">
                          <li>Upload your PDF to Google Drive</li>
                          <li>Right-click the file → Share → Change to "Anyone with the link"</li>
                          <li>Copy the share link</li>
                          <li>Paste it in the field above</li>
                          <li>Fill in the title and select language(s)</li>
                          <li>Click "Add Resource"</li>
                        </ol>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* File Manager Section */}
              <div className="col-md-4">
                <div className="card h-100">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5>
                      <i className="bi bi-folder me-2"></i>
                      File Manager
                    </h5>
                  </div>
                  <div className="card-body">
                    {/* Search Bar */}
                    <div className="input-group mb-3">
                      <span className="input-group-text bg-white border-end-0">
                        <i className="bi bi-search text-muted"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0 ps-0"
                        placeholder="Search resources..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <div className="file-list" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                      {filteredFiles.length > 0 ? (
                        <div>
                          {filteredFiles.slice().reverse().map((file) => (
                            <div key={file.id} className="d-flex justify-content-between align-items-center p-2 border-bottom">
                              <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                <div className="d-flex align-items-center">
                                  <i className={`bi ${file.resourceType === 'textbook' ? 'bi-book' :
                                    file.resourceType === 'papers' ? 'bi-file-text' :
                                      file.resourceType === 'notes' ? 'bi-sticky' :
                                        'bi-play-circle'
                                    } me-2 text-primary`}></i>
                                  <small className="text-truncate" style={{ maxWidth: '150px' }} title={file.title || file.name}>
                                    {file.title || file.name}
                                  </small>
                                </div>
                                <small className="text-muted d-block">
                                  {file.grade} / {file.subject}
                                </small>
                              </div>
                              <button
                                className="btn btn-sm btn-outline-danger ms-2"
                                onClick={() => handleDeleteResource(file.id)}
                                title="Delete resource"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-muted">
                          <i className="bi bi-folder-x" style={{ fontSize: '2rem' }}></i>
                          <p>No files uploaded yet</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 d-grid gap-2">
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={handleDeleteSelected}
                        disabled={uploadedFiles.length === 0}
                      >
                        <i className="bi bi-trash me-2"></i>
                        Delete All Files
                      </button>
                      <button className="btn btn-outline-info btn-sm" onClick={handleRefresh}>
                        <i className="bi bi-arrow-clockwise me-2"></i>
                        Refresh
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'grades' && (
            <div className="row g-4">
              {/* Create Grade */}
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-header">
                    <h5><i className="bi bi-plus-circle me-2"></i>Create New Grade</h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label">Grade URL Code (e.g. 'law', 'university')</label>
                      <input type="text" className="form-control" value={newGradeCode} onChange={e => setNewGradeCode(e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Display Name (e.g. 'Law Degree')</label>
                      <input type="text" className="form-control" value={newGradeName} onChange={e => setNewGradeName(e.target.value)} />
                    </div>
                    <button className="btn btn-primary" onClick={handleAddGrade} disabled={isSubmitting}>
                      Create Grade
                    </button>
                  </div>
                </div>
              </div>

              {/* Create Subject */}
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-header">
                    <h5><i className="bi bi-book me-2"></i>Create New Subject</h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label">Subject Code (e.g. 'civil-law')</label>
                      <input type="text" className="form-control" value={newSubjectCode} onChange={e => setNewSubjectCode(e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Display Name (English) (e.g. 'Civil Law')</label>
                      <input type="text" className="form-control" value={newSubjectName} onChange={e => setNewSubjectName(e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Display Name (Sinhala) (Optional)</label>
                      <input type="text" className="form-control" value={newSubjectNameSinhala} onChange={e => setNewSubjectNameSinhala(e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Display Name (Tamil) (Optional)</label>
                      <input type="text" className="form-control" value={newSubjectNameTamil} onChange={e => setNewSubjectNameTamil(e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Bootstrap Icon Class (e.g. 'bi-book')</label>
                      <input type="text" className="form-control" value={newSubjectIcon} onChange={e => setNewSubjectIcon(e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Available for Grades:</label>
                      <select multiple className="form-select" value={newSubjectGrades} onChange={e => setNewSubjectGrades(Array.from(e.target.selectedOptions, option => option.value))}>
                        {Object.entries(grades).map(([key, g]) => (
                          <option key={key} value={key}>{g.display}</option>
                        ))}
                      </select>
                      <small className="text-muted">Hold CTRL or CMD to select multiple grades.</small>
                    </div>
                    <button className="btn btn-primary" onClick={handleAddSubject} disabled={isSubmitting}>
                      Create Subject
                    </button>
                  </div>
                </div>
              </div>

              {/* Manage Existing Grades & Subjects */}
              <div className="col-12 mt-4">
                <div className="card">
                  <div className="card-header">
                    <h5><i className="bi bi-gear me-2"></i>Manage Existing Categories</h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6 border-end">
                        <h6 className="mb-3">Grades</h6>
                        <ul className="list-group list-group-flush">
                          {Object.entries(grades).map(([key, g]) => (
                            <li key={key} className="list-group-item d-flex justify-content-between align-items-center">
                              <div>
                                <strong>{g.display}</strong> ({key})
                              </div>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteGrade(key)}
                                title="Delete Grade"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <h6 className="mb-3">Subjects</h6>
                        <ul className="list-group list-group-flush">
                          {Object.entries(subjects).map(([key, s]) => (
                            <li key={key} className="list-group-item">
                              {editingSubjectPrefix === key ? (
                                <div className="edit-subject-form">
                                  <div className="mb-2">
                                    <input type="text" className="form-control form-control-sm mb-1" placeholder="English Name" value={editSubjectData.name} onChange={e => setEditSubjectData({ ...editSubjectData, name: e.target.value })} />
                                    <input type="text" className="form-control form-control-sm mb-1" placeholder="Sinhala Name" value={editSubjectData.nameSinhala} onChange={e => setEditSubjectData({ ...editSubjectData, nameSinhala: e.target.value })} />
                                    <input type="text" className="form-control form-control-sm mb-1" placeholder="Tamil Name" value={editSubjectData.nameTamil} onChange={e => setEditSubjectData({ ...editSubjectData, nameTamil: e.target.value })} />
                                    <input type="text" className="form-control form-control-sm mb-1" placeholder="Icon (e.g. bi-book)" value={editSubjectData.icon} onChange={e => setEditSubjectData({ ...editSubjectData, icon: e.target.value })} />
                                  </div>
                                  <div className="mb-2">
                                    <select multiple className="form-select form-select-sm" value={editSubjectData.grades} onChange={e => setEditSubjectData({ ...editSubjectData, grades: Array.from(e.target.selectedOptions, option => option.value) })}>
                                      {Object.entries(grades).map(([gKey, g]) => (
                                        <option key={gKey} value={gKey}>{g.display}</option>
                                      ))}
                                    </select>
                                    <small className="text-muted" style={{ fontSize: '0.7rem' }}>Hold CTRL/CMD to multi-select grades.</small>
                                  </div>
                                  <div className="d-flex gap-2">
                                    <button className="btn btn-sm btn-success flex-grow-1" onClick={handleSaveEditSubject} disabled={isSubmitting}>Save</button>
                                    <button className="btn btn-sm btn-secondary flex-grow-1" onClick={handleCancelEditSubject} disabled={isSubmitting}>Cancel</button>
                                  </div>
                                </div>
                              ) : (
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <strong>{s.name}</strong> ({key})
                                    <div className="small text-muted">
                                      In: {s.grades?.join(', ') || 'None'}
                                    </div>
                                  </div>
                                  <div className="btn-group">
                                    <button
                                      className="btn btn-sm btn-outline-primary"
                                      onClick={() => handleEditSubjectClick(key, s)}
                                      title="Edit Subject"
                                    >
                                      <i className="bi bi-pencil"></i>
                                    </button>
                                    <button
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() => handleDeleteSubject(key)}
                                      title="Delete Subject"
                                    >
                                      <i className="bi bi-trash"></i>
                                    </button>
                                  </div>
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'settings' && (
            <div className="row justify-content-center">
              <div className="col-md-8">
                <div className="card shadow-sm border-0 mb-4">
                  <div className="card-header bg-primary text-white d-flex align-items-center">
                    <i className="bi bi-gear-fill me-2 bg-white text-primary rounded-circle p-1"></i>
                    <h5 className="mb-0 text-white">Contact & Social Settings</h5>
                  </div>
                  <div className="card-body p-4">
                    <form onSubmit={handleSaveSettings}>
                      <div className="mb-3">
                        <label className="form-label">Support Email</label>
                        <div className="input-group">
                          <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="e.g. contact@teachingtorch.com"
                            value={settingsData.email}
                            onChange={(e) => setSettingsData({ ...settingsData, email: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Phone Number</label>
                        <div className="input-group">
                          <span className="input-group-text"><i className="bi bi-telephone"></i></span>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. +94 77 123 4567"
                            value={settingsData.phone}
                            onChange={(e) => setSettingsData({ ...settingsData, phone: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">WhatsApp Number</label>
                        <div className="input-group">
                          <span className="input-group-text"><i className="bi bi-whatsapp text-success"></i></span>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. 94771234567"
                            value={settingsData.whatsapp}
                            onChange={(e) => setSettingsData({ ...settingsData, whatsapp: e.target.value })}
                          />
                        </div>
                        <div className="form-text">For direct link generation, use format like 94771234567 (include country code, without spaces or +)</div>
                      </div>

                      <div className="mb-4">
                        <label className="form-label">Facebook Page Link</label>
                        <div className="input-group">
                          <span className="input-group-text"><i className="bi bi-facebook" style={{ color: '#1877F2' }}></i></span>
                          <input
                            type="url"
                            className="form-control"
                            placeholder="e.g. https://facebook.com/teachingtorch"
                            value={settingsData.facebook}
                            onChange={(e) => setSettingsData({ ...settingsData, facebook: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="d-grid pt-3 border-top">
                        <button type="submit" className="btn btn-primary btn-lg" disabled={isSavingSettings}>
                          {isSavingSettings ? (
                            <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Saving...</>
                          ) : (
                            <><i className="bi bi-save me-2"></i> Save Settings</>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Info Section */}
          <div className="alert alert-info mt-4">
            <h5><i className="bi bi-info-circle me-2"></i>Google Drive Integration</h5>
            <p className="mb-0">
              {activeTab === 'overview' ?
                'This dashboard provides an overview of resources and platform statistics. Resources are stored as Google Drive links.' :
                '🔹 Resources are stored as Google Drive share links in localStorage.\n🔹 Users can view PDFs directly in the browser or download them.\n🔹 Make sure all Google Drive files are set to "Anyone with the link can view" for public access.\n🔹 No backend server needed - everything works client-side!'
              }
            </p>
          </div>
        </div>
      </section>

      <style>{`
        .upload-area {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .upload-area:hover {
          background-color: rgba(25, 135, 84, 0.05);
          border-color: var(--success) !important;
        }
        
        .nav-tabs .nav-link {
          color: #212529 !important;
          border: none;
          background: none;
        }
        
        .nav-tabs .nav-link.active {
          color: var(--primary) !important;
          background-color: var(--card-bg);
          border-bottom: 2px solid var(--primary);
          font-weight: 600;
        }
        
        .nav-tabs .nav-link:hover {
          color: var(--primary) !important;
          background-color: rgba(59, 130, 246, 0.08);
        }


      `}</style>
    </div>
  );
};

export default AdminDashboard;