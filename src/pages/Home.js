import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import AdSenseComponent from '../components/common/AdSenseComponent';
import MetadataEditorModal from '../components/admin/MetadataEditorModal';
import toast from 'react-hot-toast';
import useDocumentTitle from '../hooks/useDocumentTitle';

const Home = () => {
  useDocumentTitle('Home');
  const { grades, gradesLoading, updateGrade, deleteGrade } = useData();
  const { isManageMode } = useAuth();
  
  const [metadataModal, setMetadataModal] = useState({
    isOpen: false,
    initialData: null,
    type: 'grade',
    key: null
  });

  if (gradesLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading grades...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <header className="hero-section" style={{
        backgroundImage: `url('${process.env.PUBLIC_URL}/bg1.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="container text-center text-white">
          <div className="hero-content">
            <h1 className="display-4 fw-bold mb-3">Welcome to Teaching Torch</h1>
            <p className="lead mb-4">Free Educational Resources for Sri Lankan Students</p>
            <div className="hero-buttons">
              <a href="#grades" className="btn btn-light btn-lg me-3">Explore Grades</a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Ad Unit */}
      <AdSenseComponent slot="HOME_HERO_AD_SLOT" />

      {/* Grades Section */}
      <section className="py-5" id="grades">
        <div className="container">
          <h2 className="text-center mb-5">Choose Your Grade</h2>
          <div className="row g-4">
            {Object.entries(grades).sort((a, b) => {
              const orderA = a[1].order !== undefined && a[1].order !== '' ? parseInt(a[1].order, 10) : 999;
              const orderB = b[1].order !== undefined && b[1].order !== '' ? parseInt(b[1].order, 10) : 999;
              
              if (orderA !== orderB) return orderA - orderB;

              // Fallback to numeric extraction if orders are the same (e.g. both 999)
              const numA = parseInt(a[0].replace('grade', '')) || 999;
              const numB = parseInt(b[0].replace('grade', '')) || 999;
              return numA - numB;
            }).map(([key, gradeData], index) => {
              // Determine icon text
              let iconText = gradeData.display;
              if (key.startsWith('grade')) {
                iconText = key.replace('grade', '');
              } else if (key === 'al') {
                iconText = 'A/L';
              } else {
                // Format custom grades (like Law Degree) to initials
                const words = gradeData.display.split(' ');
                if (words.length > 1) {
                  iconText = words[0][0].toUpperCase() + words[1][0].toUpperCase();
                } else {
                  iconText = words[0].substring(0, 2).toUpperCase();
                }
              }

               return (
                <div key={key} className="col-md-4 col-sm-6 position-relative">
                  {isManageMode && (
                    <div className="admin-actions position-absolute top-0 end-0 m-3 z-3 d-flex gap-1">
                      <button 
                        className="btn btn-sm btn-info text-white shadow"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setMetadataModal({
                            isOpen: true,
                            initialData: gradeData,
                            type: 'grade',
                            key: key
                          });
                        }}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-danger shadow"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (window.confirm(`Are you sure you want to delete "${gradeData.display}" and ALL its resources? This cannot be undone.`)) {
                            deleteGrade(key);
                            toast.success('Deleted Grade');
                          }
                        }}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  )}
                  <Link to={`/grade/${key}`} className={`grade-card ${key === 'al' ? 'advanced-level' : ''}`}>
                    <div className="grade-icon" style={gradeData.color ? { backgroundColor: `var(--${gradeData.color})` } : {}}>
                      {iconText}
                    </div>
                    <h5>{gradeData.display}</h5>
                    <div className="btn btn-primary mt-2">View Resources</div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <h3 className="text-center mb-5">Why Choose Teaching Torch?</h3>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card text-center">
                <div className="feature-icon">
                  <i className="bi bi-download"></i>
                </div>
                <h5>Free Downloads</h5>
                <p>All resources are completely free to download and use for educational purposes.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card text-center">
                <div className="feature-icon">
                  <i className="bi bi-translate"></i>
                </div>
                <h5>Multi-Language</h5>
                <p>Resources available in Sinhala, Tamil, and English to serve all Sri Lankan students.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card text-center">
                <div className="feature-icon">
                  <i className="bi bi-phone"></i>
                </div>
                <h5>Mobile Friendly</h5>
                <p>Access your study materials anytime, anywhere on any device.</p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Statistics Section */}
      <section className="py-5">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-3">
              <div className="stat-item">
                <h3 className="text-primary">{Object.keys(grades).length}</h3>
                <span>Grade Levels</span>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-item">
                <h3 className="text-primary">3</h3>
                <span>Languages</span>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-item">
                <h3 className="text-primary">100%</h3>
                <span>Free Content</span>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-item">
                <h3 className="text-primary">24/7</h3>
                <span>Access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Ad Unit */}
      <AdSenseComponent slot="HOME_FOOTER_AD_SLOT" />

      {/* Metadata Editor Modal */}
      <MetadataEditorModal
        isOpen={metadataModal.isOpen}
        onClose={() => setMetadataModal({ ...metadataModal, isOpen: false })}
        onSave={(updatedData) => {
          updateGrade(metadataModal.key, updatedData);
          toast.success('Grade Updated');
        }}
        title="Edit Grade"
        initialData={metadataModal.initialData}
        type="grade"
      />
    </div>
  );
};

export default Home;