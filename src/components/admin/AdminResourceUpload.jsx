import React from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import { getResourceTypeName } from '../../utils/resourceTranslations';
import { isYouTubeLink, extractYouTubeId } from '../../utils/youtube';
import { isGoogleDriveLink } from '../../utils/googleDrive';

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
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">
              <i className="bi bi-cloud-upload me-2"></i>
              Upload New Resource
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
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label">Paper Type</label>
                  <select
                    className="form-select"
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
              <label className="form-label d-block">Select Language(s)</label>
              <div className="d-flex gap-3 flex-wrap">
                {['english', 'sinhala', 'tamil'].map(lang => (
                  <div className="form-check" key={lang}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`lang-${lang}`}
                      checked={selectedLanguages.includes(lang)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLanguages(prev => [...prev, lang]);
                        } else {
                          setSelectedLanguages(prev => prev.filter(l => l !== lang));
                        }
                      }}
                    />
                    <label className="form-check-label text-capitalize" htmlFor={`lang-${lang}`}>
                      {lang === 'sinhala' ? 'සිංහල' : lang === 'tamil' ? 'தமிழ்' : lang}
                    </label>
                  </div>
                ))}
              </div>
              <small className="text-muted d-block mt-1">Select all languages that this resource applies to.</small>
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
              {driveLink && (selectedResourceType === 'videos' ? !isYouTubeLink(driveLink) && !isGoogleDriveLink(driveLink) : !isGoogleDriveLink(driveLink)) && (
                <div className="alert alert-warning mt-2 mb-0">
                  <small>
                    <i className="bi bi-exclamation-triangle me-1"></i>
                    Please enter a valid link
                  </small>
                </div>
              )}
              {driveLink && isGoogleDriveLink(driveLink) && (
                <div className="alert alert-success mt-2 mb-0">
                  <small>
                    <i className="bi bi-check-circle me-1"></i>
                    Valid Google Drive link detected!
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

            {/* Resource Order (Optional) */}
            <div className="mb-4">
              <label className="form-label">
                <i className="bi bi-sort-numeric-down me-2"></i>
                Display Order (Optional)
              </label>
              <input
                type="number"
                className="form-control"
                placeholder="e.g., 1, 2, 3 (Lower numbers appear first)"
                value={resourceOrder}
                onChange={(e) => setResourceOrder(e.target.value)}
                min="1"
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
                  <LoadingSpinner size="small" color="light" text="Adding..." />
                ) : (
                  <>
                    <i className="bi bi-plus-circle me-2"></i>
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
