import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { getResourceTypeName } from '../utils/resourceTranslations';

const GradePage = () => {
  const { gradeId } = useParams();
  const { generateGradePageData, language } = useData();

  // Generate page data
  const pageData = useMemo(() => {
    return generateGradePageData(gradeId);
  }, [gradeId, generateGradePageData]);

  if (!pageData.grade) {
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

  const { grade } = pageData;

  const resourceTypes = [
    { type: 'textbooks', icon: 'bi-book', color: 'text-primary', title: getResourceTypeName('textbooks', language), desc: 'Downloadable PDF textbooks' },
    { type: 'papers', icon: 'bi-file-earmark-text', color: 'text-info', title: getResourceTypeName('papers', language), desc: 'Term & chapter papers' },
    { type: 'notes', icon: 'bi-sticky', color: 'text-warning', title: getResourceTypeName('notes', language), desc: 'Chapter-wise summaries' },
    { type: 'videos', icon: 'bi-play-circle', color: 'text-danger', title: getResourceTypeName('videos', language), desc: 'Educational videos' }
  ];

  return (
    <div className="grade-page" style={{ backgroundImage: `url('${process.env.PUBLIC_URL}/bg3.jpg')`, backgroundAttachment: 'fixed', backgroundSize: 'cover', minHeight: '100vh' }}>
      {/* Grade Header */}
      <header className="grade-header">
        <div className="container text-center">
          <h1 className="display-4 fw-bold">{grade.display} Resources</h1>
          <p className="lead">Quick access to textbooks, papers, notes, and videos.</p>
        </div>
      </header>

      {/* Breadcrumb */}
      <section className="py-3 bg-light">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {grade.display}
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Resource Type Cards */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4 mb-5">
            {resourceTypes.map((rt) => (
              <div key={rt.type} className="col-md-3 col-sm-6">
                <Link to={`/grade/${gradeId}/${rt.type}`} className="resource-type-card h-100 d-block text-decoration-none">
                  <div className="card h-100 text-center hover-card">
                    <div className="card-body d-flex flex-column justify-content-center">
                      <div className="resource-type-icon mb-3">
                        <i className={`bi ${rt.icon} ${rt.color}`} style={{ fontSize: '3rem' }}></i>
                      </div>
                      <h5 className="card-title" style={{ color: 'var(--text-primary)' }}>{rt.title}</h5>
                      <p className="card-text text-muted">{rt.desc}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>


        </div>
      </section>

      {/* Call to Action */}
      <section className="py-4 bg-light">
        <div className="container text-center">
          <h4 className="mb-3">Need More Resources?</h4>
          <p className="text-muted mb-4">
            Can't find what you're looking for? Contact our admin team to request additional materials.
          </p>
          <Link to="/contact" className="btn btn-primary">
            <i className="bi bi-envelope me-2"></i>Contact Us
          </Link>
        </div>
      </section>

      <style>{`
        .hover-card {
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          border-color: var(--primary);
        }
      `}</style>
    </div>
  );
};

export default GradePage;