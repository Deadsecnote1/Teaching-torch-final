import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import useDocumentTitle from '../hooks/useDocumentTitle';
import AdSenseComponent from '../components/common/AdSenseComponent';

const SubjectHubPage = () => {
  const { gradeId, streamId, subjectId } = useParams();
  const { selectedLanguage: language } = useLanguage();
  const { grades, subjects, resourceTypes } = useData();

  const grade = grades[gradeId];
  const stream = grades[streamId];
  const subject = subjects[subjectId];

  const pageTitle = subject ? `${subject.display} - ${stream?.display || ''}` : 'Subject Hub';
  useDocumentTitle(pageTitle);

  if (!subject || !grade || !stream) {
    return (
      <div className="container py-5 text-center">
        <h2>Content Not Found</h2>
        <p>We couldn't find the requested subject information.</p>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    );
  }

  // Determine resource type order for this subject
  // Default order if not specified
  const defaultOrder = ['textbooks', 'papers', 'notes', 'videos'];
  const subjectOrder = subject.resourceTypeOrder || defaultOrder;

  // Filter and sort resource types based on subject-specific priority
  const visibleTypes = resourceTypes
    .filter(rt => rt.active !== false)
    .filter(rt => subjectOrder.includes(rt.id))
    .sort((a, b) => {
      const indexA = subjectOrder.indexOf(a.id);
      const indexB = subjectOrder.indexOf(b.id);
      return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
    });

  return (
    <div className="subject-hub-page" style={{ 
      backgroundImage: `url('${process.env.PUBLIC_URL}/bg3.jpg')`, 
      backgroundAttachment: 'fixed', 
      backgroundSize: 'cover', 
      minHeight: '100vh' 
    }}>
      {/* Subject Header */}
      <header className="subject-header py-5 text-white" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}>
        <div className="container text-center">
          <div className="badge bg-primary mb-2 px-3 py-2 rounded-pill">{stream.display}</div>
          <h1 className="display-3 fw-bold mb-2">{subject.display}</h1>
          <p className="lead opacity-75">All specialized resources for {subject.display} in one place.</p>
        </div>
      </header>

      {/* Ad Unit */}
      <AdSenseComponent slot="SUBJECT_HUB_HEADER_AD" />

      {/* Breadcrumb */}
      <section className="py-3 bg-dark bg-opacity-25">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/" className="text-white">Home</Link></li>
              <li className="breadcrumb-item"><Link to={`/grade/${gradeId}`} className="text-white">{grade.display}</Link></li>
              <li className="breadcrumb-item"><Link to={`/grade/${gradeId}/${streamId}`} className="text-white">{stream.display}</Link></li>
              <li className="breadcrumb-item active text-info" aria-current="page">{subject.display}</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Hub Grid */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-white mb-3">Explore Resources</h2>
            <p className="text-white-50">Select a category below to view specific materials</p>
          </div>

          <div className="row g-4 justify-content-center">
            {visibleTypes.map((rt) => (
              <div key={rt.id} className="col-md-4 col-lg-3">
                <Link 
                  to={`/grade/${gradeId}/${streamId}/${subjectId}/${rt.id}`} 
                  className="hub-card text-decoration-none h-100 d-block"
                >
                  <div className="card h-100 border-0 shadow-lg text-center overflow-hidden">
                    <div className="card-body p-4 d-flex flex-column align-items-center">
                      <div className={`hub-icon-wrapper mb-3 ${rt.color || 'text-primary'}`}>
                        <i className={`bi ${rt.icon || 'bi-archive'} display-4`}></i>
                      </div>
                      <h4 className="card-title fw-bold mb-2" style={{ color: '#1e293b' }}>
                        {rt.name?.[language] || rt.name?.english || rt.id}
                      </h4>
                      <p className="card-text text-muted small">
                        {rt.description?.[language] || rt.description?.english || ''}
                      </p>
                      <div className="mt-auto pt-3">
                        <span className="btn btn-sm btn-outline-primary rounded-pill px-4">Browse</span>
                      </div>
                    </div>
                    <div className="card-footer bg-transparent border-0 pb-3">
                       <small className="text-primary fw-bold">Free Access</small>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .hub-card {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .hub-card:hover {
          transform: translateY(-12px) scale(1.02);
        }
        .hub-card .card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
        }
        .hub-icon-wrapper {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.03);
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        .hub-card:hover .hub-icon-wrapper {
          background: rgba(0,0,0,0.07);
          transform: rotate(10deg);
        }
        .breadcrumb-item + .breadcrumb-item::before {
          color: white;
        }
      `}</style>
    </div>
  );
};

export default SubjectHubPage;
