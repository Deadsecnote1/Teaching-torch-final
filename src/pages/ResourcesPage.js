import React, { useMemo, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useGradePage } from '../hooks/useGradePage';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import useDocumentTitle from '../hooks/useDocumentTitle';
import ResourceCard from '../components/common/ResourceCard';
import ResourceEditorModal from '../components/admin/ResourceEditorModal';
import MetadataEditorModal from '../components/admin/MetadataEditorModal';
import { subjectTranslations } from '../utils/subjectTranslations';
import { getResourceTypeName } from '../utils/resourceTranslations';
import AdSenseComponent from '../components/common/AdSenseComponent';
import toast from 'react-hot-toast';

const ResourcesPage = () => {
  const { gradeId, streamId, subjectId: paramSubjectId, resourceType } = useParams();
  const [searchParams] = useSearchParams();
  const selectedSubjectId = paramSubjectId || searchParams.get('subject');
  const { grade: rawGrade, subjects, isLoading, isGradeMissing } = useGradePage(streamId || gradeId);
  const {
    updateSubject,
    updateResourceType,
    resourceTypes,
    grades
  } = useData();

  const grade = rawGrade;
  const parentGrade = streamId ? grades[gradeId] : null;
  const subject = selectedSubjectId ? subjects[selectedSubjectId] : null;
  const { selectedLanguage, setLanguage, shouldShowResource, languages } = useLanguage();
  const { isManageMode } = useAuth();

  const typeName = resourceTypes.find(t => t.id === resourceType)?.name?.[selectedLanguage] || getResourceTypeName(resourceType, selectedLanguage) || resourceType;
  const gradeName = grade?.display || 'Grade';
  useDocumentTitle(`${typeName} - ${gradeName}`);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalInitialData, setAddModalInitialData] = useState(null);
  const [editingResource, setEditingResource] = useState(null);
  const [metadataModal, setMetadataModal] = useState({
    isOpen: false,
    initialData: null,
    type: 'subject',
    key: null
  });

  const typeMetadata = useMemo(() => {
    const found = resourceTypes.find(t => t.id === resourceType);
    if (found) {
      return {
        ...found,
        displayName: typeof found.name === 'object' ? (found.name[selectedLanguage] || found.name.english || resourceType) : (found.name || resourceType),
        displayDescription: typeof found.description === 'object' ? (found.description[selectedLanguage] || found.description.english || '') : (found.description || '')
      };
    }
    return {
      id: resourceType,
      displayName: getResourceTypeName(resourceType, selectedLanguage),
      icon: 'bi-archive',
      color: 'text-primary',
      displayDescription: 'Educational resources'
    };
  }, [resourceType, resourceTypes, selectedLanguage]);



  // Generic List Component
  const ResourceList = ({ resources, onEdit }) => {
    const safeResources = resources || [];
    const hasSubCategories = typeMetadata.subCategories && typeMetadata.subCategories.length > 0;

    const LanguageColumn = ({ langId, title, bgClass, files }) => {
      if (!shouldShowResource(langId)) return null;

      return (
        <div className="col-12 mb-3">
          <div className="textbook-medium-card h-100 w-100">
            <div className="card h-100 w-100 d-flex flex-column">
              <div
                className={`card-header text-center py-2 ${bgClass}`}
                style={langId === 'tamil' ? { backgroundColor: 'var(--tamil)' } : {}}
              >
                <h6 className="mb-0">
                  <i className="bi bi-download me-2"></i>
                </h6>
              </div>
              <div className="card-body p-2 flex-grow-1 overflow-auto">
                {files && files.length > 0 ? (
                  <div className="uploaded-textbooks">
                    {files.map((file, index) => (
                      <ResourceCard
                        key={file.id || index}
                        resource={file}
                        title={file.title || file.name || file.originalName}
                        description={file.description}
                        language={langId}
                        showViewButton={true}
                        showDownloadButton={true}
                        className="mb-3"
                        showLanguageLabel={false}
                        onEdit={onEdit}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-3">
                    <i className="bi bi-dash-circle text-muted" style={{ fontSize: '1.5rem' }}></i>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    };

    const renderGrid = (items) => {
      const grouped = {
        sinhala: items.filter(res => shouldShowResource('sinhala') && (res.language === 'sinhala' || res.languages?.includes('sinhala'))),
        tamil: items.filter(res => shouldShowResource('tamil') && (res.language === 'tamil' || res.languages?.includes('tamil'))),
        english: items.filter(res => shouldShowResource('english') && (res.language === 'english' || res.languages?.includes('english')))
      };
      return (
        <div className="row g-3">
          <LanguageColumn langId="sinhala" bgClass="bg-danger text-white" files={grouped.sinhala} />
          <LanguageColumn langId="tamil" bgClass="text-white" files={grouped.tamil} />
          <LanguageColumn langId="english" bgClass="bg-primary text-white" files={grouped.english} />
        </div>
      );
    };

    if (hasSubCategories) {
      const subCats = [...(typeMetadata.subCategories || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
      const slugify = (text) => text?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const others = safeResources.filter(r => {
        const rSub = r.subCategory || '';
        if (!rSub) return true;

        return !subCats.some(sc => {
          const scId = sc.id || sc;
          const scName = typeof sc === 'object' ? (sc.name?.english || '') : sc;
          return rSub === scId ||
            slugify(rSub) === scId ||
            rSub === scName ||
            slugify(rSub) === slugify(scName);
        });
      });

      return (
        <div className="row g-4 mt-3">
          {subCats.map((subCatObj, idx) => {
            const subCatId = subCatObj.id || subCatObj;
            const subCatDisplayName = subCatObj.name ? (subCatObj.name[selectedLanguage] || subCatObj.name.english) : subCatObj;
            const subCatIcon = subCatObj.icon || 'bi-folder2-open';

            const items = safeResources.filter(r => {
              const rSub = r.subCategory || '';
              return rSub === subCatId ||
                slugify(rSub) === subCatId ||
                rSub === subCatDisplayName ||
                slugify(rSub) === slugify(subCatDisplayName);
            });
            return (
              <div key={subCatId} className="col-lg-6">
                <div className="subject-section h-100 p-4 border rounded shadow-sm" style={{ backgroundColor: 'var(--card-bg)' }}>
                  <h6 className="mb-3 text-info fw-bold border-bottom border-secondary pb-2 d-flex align-items-center">
                    <i className={`bi ${subCatIcon} me-2 fs-4`}></i>
                    <span>{subCatDisplayName}</span>
                  </h6>
                  {renderGrid(items)}
                  {isManageMode && (
                    <div className="text-center mt-3">
                      <button
                        className="btn btn-sm btn-outline-info py-1 px-3 shadow-sm"
                        style={{ fontSize: '0.8rem', borderRadius: '20px' }}
                        onClick={() => {
                          setAddModalInitialData({
                            grade: gradeId,
                            subject: typeMetadata.isStandalone ? 'standalone' : (selectedSubjectId || ''),
                            resourceType: resourceType,
                            subCategory: subCatId,
                            languages: ['sinhala', 'tamil', 'english']
                          });
                          setIsAddModalOpen(true);
                        }}
                      >
                        <i className="bi bi-plus-lg me-1"></i>Add Resource to {subCatDisplayName}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {others.length > 0 && (
            <div className="col-lg-6">
              <div className="subject-section h-100 p-4 border rounded shadow-sm" style={{ backgroundColor: 'var(--card-bg)' }}>
                <h6 className="mb-3 text-muted border-bottom border-secondary pb-2">
                  <i className="bi bi-folder2-open me-2"></i>Other
                </h6>
                {renderGrid(others)}
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="resources-grid mt-3">
        {renderGrid(safeResources)}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (isGradeMissing) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2>Grade Not Found</h2>
          <p>The requested grade does not exist.</p>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="resources-page">
      {/* Page Header */}
      <header className="grade-header">
        <div className="container text-center">
          <div className="d-inline-flex align-items-center justify-content-center position-relative">
            <h1 className="display-4 fw-bold mb-0">{grade.display} {typeMetadata.displayName}</h1>
            {isManageMode && (
              <button
                className="btn btn-sm btn-outline-light ms-3 rounded-circle"
                style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={() => {
                  setMetadataModal({
                    isOpen: true,
                    initialData: typeMetadata,
                    type: 'resourceType',
                    key: resourceType
                  });
                }}
                title="Edit Module Settings"
              >
                <i className="bi bi-pencil"></i>
              </button>
            )}
          </div>
          <p className="lead mt-2">{typeMetadata.displayDescription}</p>
        </div>
      </header>

      {/* Language Switcher Section */}
      <section className="py-4 switcher-container border-bottom">
        <div className="container">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-3">
            <span className="fw-bold text-uppercase tracking-wider small opacity-75">Select Content Medium:</span>
            <div className="btn-group shadow-sm" role="group">
              {['sinhala', 'tamil', 'english'].map(lang => (
                <button
                  key={lang}
                  type="button"
                  className={`btn px-4 py-2 content-medium-btn ${selectedLanguage === lang ? 'btn-primary active' : 'btn-outline-custom'}`}
                  onClick={() => setLanguage(lang)}
                  style={{ minWidth: '120px' }}
                >
                  <i className={`bi bi-circle-fill me-2`} style={{ color: languages[lang].color, fontSize: '0.7rem' }}></i>
                  {languages[lang].display}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Header Ad Unit */}
      <AdSenseComponent slot="RESOURCES_HEADER_AD_SLOT" />

      {/* Breadcrumb */}
      <section className="py-3 bg-light">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              {parentGrade && (
                <li className="breadcrumb-item">
                  <Link to={`/grade/${gradeId}`}>{parentGrade.display}</Link>
                </li>
              )}
              <li className="breadcrumb-item">
                <Link to={streamId ? `/grade/${gradeId}/${streamId}` : `/grade/${gradeId}`}>{grade.display}</Link>
              </li>
              {subject && (
                <li className="breadcrumb-item">
                  <Link to={`/grade/${gradeId}/${streamId}/${selectedSubjectId}`}>{subject.display}</Link>
                </li>
              )}
              <li className="breadcrumb-item active d-flex align-items-center" aria-current="page">
                {typeMetadata.displayName}
                {isManageMode && (
                  <button
                    className="btn btn-sm btn-link p-0 ms-2 text-primary"
                    onClick={() => {
                      setMetadataModal({
                        isOpen: true,
                        initialData: typeMetadata,
                        type: 'resourceType',
                        key: resourceType
                      });
                    }}
                    title="Edit Module Settings"
                  >
                    <i className="bi bi-pencil-fill" style={{ fontSize: '0.8rem' }}></i>
                  </button>
                )}
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Content */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            {typeMetadata.isStandalone ? (
              <div className="col-lg-12 mb-4">
                <div className="subject-section h-100 p-4 border rounded shadow-sm" style={{ backgroundColor: 'var(--card-bg)', minHeight: '400px' }}>
                  <ResourceList
                    resources={subjects['standalone']?.resources?.extras?.[resourceType] || []}
                    onEdit={(r) => setEditingResource(r)}
                  />

                  {isManageMode && (
                    <div className="mt-5 pt-4 border-top">
                      <button
                        className="btn btn-outline-success w-100 py-3 fs-5"
                        style={{ borderStyle: 'dashed', borderWidth: '2px' }}
                        onClick={() => {
                          setAddModalInitialData({
                            grade: gradeId,
                            subject: 'standalone',
                            resourceType: resourceType,
                            languages: ['sinhala', 'tamil', 'english']
                          });
                          setIsAddModalOpen(true);
                        }}
                      >
                        <i className="bi bi-plus-circle-fill me-3"></i>
                        Upload to {typeMetadata.displayName} Hub
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              Object.keys(subjects).filter(subjectId => {
                if (subjectId === 'standalone') return false;
                const subject = subjects[subjectId];
                if (selectedSubjectId && subjectId !== selectedSubjectId) return false;
                if (subject.languages && subject.languages.length > 0) {
                  return subject.languages.includes(selectedLanguage);
                }
                return true;
              }).map(subjectId => {
                const subject = subjects[subjectId];

                // Extract resources for the current type
                let typeResources = [];
                if (resourceType === 'textbooks') {
                  // Textbooks are stored by language in structure
                  Object.values(subject.resources.textbooks || {}).forEach(arr => {
                    typeResources = [...typeResources, ...arr];
                  });
                } else if (resourceType === 'notes') {
                  typeResources = Object.values(subject.resources.notes || {});
                } else if (resourceType === 'videos') {
                  typeResources = subject.videos || [];
                } else if (resourceType === 'papers') {
                  return null;
                } else {
                  // Custom types from 'extras'
                  typeResources = subject.resources.extras?.[resourceType] || [];
                }

                // Check if any resources match the language filter
                const hasFilteredResources = typeResources.some(res =>
                  shouldShowResource(res)
                );

                if (!hasFilteredResources && !isManageMode) return null;

                return (
                  <div key={subjectId} className="col-lg-6 mb-4">
                    <div className="subject-section h-100 p-4 border rounded shadow-sm" style={{ backgroundColor: 'var(--card-bg)' }}>
                      <div className="subject-header mb-4 border-bottom pb-2 d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <div className="subject-icon-large me-3">
                            <i className={subject.icon} style={{ fontSize: '2rem', color: 'var(--primary)' }}></i>
                          </div>
                          <div>
                            <h3 className="mb-0">
                              {subjectTranslations.getTranslatedName(subjectId, subject, selectedLanguage)}
                            </h3>
                          </div>
                        </div>

                        {isManageMode && (
                          <div className="admin-subject-actions d-flex gap-2">
                            <button
                              className="btn btn-sm btn-outline-info"
                              onClick={() => {
                                setMetadataModal({
                                  isOpen: true,
                                  initialData: subject,
                                  type: 'subject',
                                  key: subjectId
                                });
                              }}
                              title="Edit Subject"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                          </div>
                        )}
                      </div>

                      <ResourceList resources={typeResources} onEdit={(r) => setEditingResource(r)} />

                      {isManageMode && (
                        <div className="mt-4 pt-3 border-top mt-auto">
                          <button
                            className="btn btn-outline-success w-100 py-2"
                            style={{ borderStyle: 'dashed', borderWidth: '2px' }}
                            onClick={() => {
                              setAddModalInitialData({
                                grade: gradeId,
                                subject: subjectId,
                                resourceType: resourceType,
                                languages: ['sinhala', 'tamil', 'english']
                              });
                              setIsAddModalOpen(true);
                            }}
                          >
                            <i className="bi bi-plus-lg me-2"></i>
                            Add New {typeMetadata.displayName}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Modals */}
      <ResourceEditorModal
        resource={editingResource || addModalInitialData}
        isOpen={!!editingResource || isAddModalOpen}
        onClose={() => {
          setEditingResource(null);
          setIsAddModalOpen(false);
          setAddModalInitialData(null);
        }}
      />

      <MetadataEditorModal
        isOpen={metadataModal.isOpen}
        onClose={() => setMetadataModal({ ...metadataModal, isOpen: false })}
        onSave={async (updatedData) => {
          if (metadataModal.type === 'resourceType') {
            await updateResourceType(metadataModal.key, updatedData);
            toast.success('Module Updated');
          } else {
            await updateSubject(metadataModal.key, updatedData);
            toast.success('Subject Updated');
          }
        }}
        title={metadataModal.type === 'resourceType' ? "Edit Module" : "Edit Subject"}
        initialData={metadataModal.initialData}
        type={metadataModal.type}
      />

      <style>{`
        .textbook-medium-card .card {
          transition: all 0.3s ease;
          border-color: #eee;
          background-color: var(--bg-tertiary) !important;
        }

        .textbook-medium-card .card:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          border-color: var(--primary);
        }

        .uploaded-textbooks {
          max-height: 250px;
          overflow-y: auto;
        }

        .subject-section {
          background-color: var(--card-bg);
          padding: 1.5rem;
          border-radius: 0.5rem;
          border: 1px solid var(--border-color);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .subject-section:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px var(--card-shadow) !important;
        }

        .grade-header {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          padding: 120px 0 4rem 0;
          color: white;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .grade-header h1 {
          letter-spacing: -0.02em;
        }

        .grade-header .btn-outline-light:hover {
          background-color: rgba(255,255,255,0.1);
        }
      `}</style>
    </div>
  );
};

export default ResourcesPage;
