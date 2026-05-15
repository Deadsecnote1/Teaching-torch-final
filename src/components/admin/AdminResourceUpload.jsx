import React from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import { getResourceTypeName } from '../../utils/resourceTranslations';
import { isYouTubeLink, extractYouTubeId } from '../../utils/youtube';
import { isGoogleDriveLink } from '../../utils/googleDrive';
import { CloudUpload, Link as LinkIcon, Type, FileText, SortAsc, PlaySquare, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const AdminResourceUpload = ({
  selectedGrade,
  setSelectedGrade,
  grades,
  selectedSubject,
  setSelectedSubject,
  getSubjectsForGrade,
  selectedResourceType,
  setSelectedResourceType,
  selectedLanguage,
  selectedPaperType,
  setSelectedPaperType,
  selectedPaperCategory,
  setSelectedPaperCategory,
  schoolName,
  setSchoolName,
  selectedLanguages,
  setSelectedLanguages,
  driveLink,
  setDriveLink,
  resourceTitle,
  setResourceTitle,
  resourceDescription,
  setResourceDescription,
  resourceOrder,
  setResourceOrder,
  handleAddDriveLink,
  isSubmitting
}) => {
  return (
    <div className="flex justify-center p-6">
      <div className="w-full max-w-4xl">
        <div className="bg-bg-primary rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="bg-primary px-6 py-4 flex items-center">
            <div className="bg-white/20 p-1.5 rounded-lg mr-3 backdrop-blur-sm">
              <CloudUpload className="w-5 h-5 text-white" />
            </div>
            <h5 className="mb-0 text-white font-bold text-lg">Upload New Resource</h5>
          </div>
          
          <div className="p-6 sm:p-8 space-y-8">
            {/* Selection Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">Select Grade</label>
                <select
                  className="w-full px-3 py-2.5 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow appearance-none"
                  value={selectedGrade}
                  onChange={(e) => {
                    setSelectedGrade(e.target.value);
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
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">Select Subject</label>
                <select
                  className="w-full px-3 py-2.5 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow appearance-none disabled:opacity-50"
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
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">Resource Type</label>
                <select
                  className="w-full px-3 py-2.5 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow appearance-none"
                  value={selectedResourceType}
                  onChange={(e) => {
                    setSelectedResourceType(e.target.value);
                    if (e.target.value !== 'papers') {
                      setSelectedPaperType('term');
                      setSelectedPaperCategory('term1');
                      setSchoolName('');
                    }
                  }}
                >
                  <option value="textbook">{getResourceTypeName('textbooks', selectedLanguage)}</option>
                  <option value="notes">{getResourceTypeName('notes', selectedLanguage)}</option>
                  <option value="papers">{getResourceTypeName('papers', selectedLanguage)}</option>
                  <option value="videos">{getResourceTypeName('videos', selectedLanguage)}</option>
                </select>
              </div>
            </div>

            {/* Paper Type Selection (only for papers) */}
            {selectedResourceType === 'papers' && (
              <div className="bg-bg-secondary/50 p-5 rounded-xl border border-border space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Paper Type</label>
                    <select
                      className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                      value={selectedPaperType}
                      onChange={(e) => {
                        setSelectedPaperType(e.target.value);
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
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">
                      {selectedPaperType === 'term' ? 'Term' : 'Chapter'}
                    </label>
                    {selectedPaperType === 'term' ? (
                      <select
                        className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
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
                        className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="e.g., Chapter 1, Chapter 2, etc."
                        value={selectedPaperCategory}
                        onChange={(e) => setSelectedPaperCategory(e.target.value)}
                      />
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">School Name (Optional)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="e.g., Royal College, Ananda College"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="h-px bg-border my-6"></div>

            {/* Language Selection */}
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Select Language(s)</label>
              <div className="flex flex-wrap gap-4">
                {['english', 'sinhala', 'tamil'].map(lang => (
                  <label key={lang} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-border text-primary focus:ring-primary transition-colors cursor-pointer"
                      checked={selectedLanguages.includes(lang)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLanguages(prev => [...prev, lang]);
                        } else {
                          setSelectedLanguages(prev => prev.filter(l => l !== lang));
                        }
                      }}
                    />
                    <span className="text-sm font-medium text-text-primary capitalize group-hover:text-primary transition-colors">
                      {lang === 'sinhala' ? 'සිංහල (Sinhala)' : lang === 'tamil' ? 'தமிழ் (Tamil)' : lang}
                    </span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-text-muted mt-2">Select all languages that this resource applies to.</p>
            </div>

            {/* Link Input (Google Drive or YouTube) */}
            <div>
              <label className="flex items-center text-sm font-semibold text-text-primary mb-1.5">
                <LinkIcon className="w-4 h-4 mr-1.5 text-primary" />
                {selectedResourceType === 'videos' ? 'YouTube URL or Google Drive Link' : 'Google Drive Link'} 
                <span className="text-danger ml-1">*</span>
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                placeholder={selectedResourceType === 'videos'
                  ? "https://www.youtube.com/watch?v=VIDEO_ID or Google Drive link"
                  : "https://drive.google.com/file/d/FILE_ID/view"}
                value={driveLink}
                onChange={(e) => setDriveLink(e.target.value)}
              />
              <div className="mt-2 text-xs text-text-muted flex items-start">
                <Info className="w-3.5 h-3.5 mr-1 mt-0.5 flex-shrink-0" />
                <span>
                  {selectedResourceType === 'videos'
                    ? 'Paste YouTube URL or Google Drive link. For YouTube: Use the full watch URL.'
                    : 'Paste the Google Drive share link here. Make sure the file is set to "Anyone with the link can view"'}
                </span>
              </div>
              
              {/* Validation Feedback */}
              <div className="mt-2 space-y-2">
                {driveLink && selectedResourceType === 'videos' && isYouTubeLink(driveLink) && (
                  <div className="flex items-center text-xs text-success bg-success/10 px-3 py-2 rounded-md border border-success/20">
                    <PlaySquare className="w-4 h-4 mr-1.5" />
                    Valid YouTube URL detected! Video ID: {extractYouTubeId(driveLink)}
                  </div>
                )}
                {driveLink && (selectedResourceType === 'videos' ? !isYouTubeLink(driveLink) && !isGoogleDriveLink(driveLink) : !isGoogleDriveLink(driveLink)) && (
                  <div className="flex items-center text-xs text-warning bg-warning/10 px-3 py-2 rounded-md border border-warning/20">
                    <AlertTriangle className="w-4 h-4 mr-1.5" />
                    Please enter a valid link
                  </div>
                )}
                {driveLink && isGoogleDriveLink(driveLink) && (
                  <div className="flex items-center text-xs text-success bg-success/10 px-3 py-2 rounded-md border border-success/20">
                    <CheckCircle className="w-4 h-4 mr-1.5" />
                    Valid Google Drive link detected!
                  </div>
                )}
              </div>
            </div>

            {/* Resource Title */}
            <div>
              <label className="flex items-center text-sm font-semibold text-text-primary mb-1.5">
                <Type className="w-4 h-4 mr-1.5 text-primary" />
                Resource Title <span className="text-danger ml-1">*</span>
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                placeholder="e.g., Grade 6 Mathematics Textbook - Sinhala"
                value={resourceTitle}
                onChange={(e) => setResourceTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Resource Description (Optional) */}
              <div className="md:col-span-2">
                <label className="flex items-center text-sm font-semibold text-text-primary mb-1.5">
                  <FileText className="w-4 h-4 mr-1.5 text-primary" />
                  Description <span className="text-text-muted font-normal ml-1">(Optional)</span>
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow resize-none"
                  rows="3"
                  placeholder="Additional information about this resource..."
                  value={resourceDescription}
                  onChange={(e) => setResourceDescription(e.target.value)}
                />
              </div>

              {/* Resource Order (Optional) */}
              <div>
                <label className="flex items-center text-sm font-semibold text-text-primary mb-1.5">
                  <SortAsc className="w-4 h-4 mr-1.5 text-primary" />
                  Display Order <span className="text-text-muted font-normal ml-1">(Opt)</span>
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                  placeholder="e.g., 1"
                  value={resourceOrder}
                  onChange={(e) => setResourceOrder(e.target.value)}
                  min="1"
                />
                <p className="text-xs text-text-muted mt-1.5">Lower numbers appear first</p>
              </div>
            </div>

            <div className="h-px bg-border my-6"></div>

            {/* Add Resource Button */}
            <div className="flex justify-end">
              <button
                className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center w-full sm:w-auto"
                onClick={handleAddDriveLink}
                disabled={!driveLink.trim() || !resourceTitle.trim() || selectedLanguages.length === 0 || isSubmitting}
              >
                {isSubmitting ? (
                  <LoadingSpinner size="small" color="light" text="Adding..." />
                ) : (
                  <>
                    <CloudUpload className="w-5 h-5 mr-2" />
                    Add Resource
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminResourceUpload;
