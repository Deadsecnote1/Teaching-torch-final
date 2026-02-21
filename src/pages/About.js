import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="about-page">
      {/* Page Header */}
      <header className="page-header">
        <div className="container text-center">
          <h1 className="display-4 fw-bold">About Teaching Torch</h1>
          <p className="lead">Empowering Sri Lankan students with free educational resources</p>
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
                About
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="text-center mb-5">
                <h2 className="mb-4">Our Mission</h2>
                <p className="lead text-muted">
                  To provide free, accessible, and comprehensive educational resources for all Sri Lankan students,
                  breaking down barriers to quality education and fostering academic excellence across the nation.
                </p>
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="mission-card text-center">
                <div className="mission-icon mb-3">
                  <i className="bi bi-heart-fill text-danger" style={{ fontSize: '3rem' }}></i>
                </div>
                <h4>Free Education</h4>
                <p>
                  We believe education should be accessible to everyone. All our resources are completely free
                  to download and use, ensuring no student is left behind due to financial constraints.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="mission-card text-center">
                <div className="mission-icon mb-3">
                  <i className="bi bi-translate text-primary" style={{ fontSize: '3rem' }}></i>
                </div>
                <h4>Multi-Language Support</h4>
                <p>
                  Recognizing Sri Lanka's linguistic diversity, we provide resources in Sinhala, Tamil, and English,
                  ensuring every student can learn in their preferred language.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="mission-card text-center">
                <div className="mission-icon mb-3">
                  <i className="bi bi-laptop text-success" style={{ fontSize: '3rem' }}></i>
                </div>
                <h4>Digital Innovation</h4>
                <p>
                  Leveraging modern technology to create an intuitive, mobile-friendly platform that makes
                  learning resources available 24/7 to students across the island.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="mb-4">Our Vision</h2>
              <p className="mb-4">
                To become the leading digital educational platform in Sri Lanka, serving as the primary
                resource hub for students from Grade 6 to Advanced Level. We envision a future where
                every student has equal access to quality educational materials, regardless of their location or background.
              </p>
              <p className="mb-4">
                Through technology and community collaboration, we aim to bridge the educational gap
                and create equal opportunities for all students across the country.
              </p>
              <h3 className="h5 mb-3">What We Offer:</h3>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Complete textbook collections in all three languages
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Past examination papers for practice
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Concise chapter-wise study notes
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Educational video lessons and tutorials
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Mobile-friendly access anytime, anywhere
                </li>
              </ul>
            </div>
            <div className="col-lg-6">
              <div className="vision-graphic text-center">
                <div className="icon-stack">
                  <i className="bi bi-mortarboard-fill text-primary" style={{ fontSize: '6rem' }}></i>
                  <div className="mt-3">
                    <h4 className="text-primary">Education for All</h4>
                    <p className="text-muted">Building a brighter future for Sri Lankan students</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2>Our Commitment</h2>
            <p className="text-muted">Dedicated to excellence in educational support</p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="commitment-card text-center">
                <i className="bi bi-shield-check text-success mb-3" style={{ fontSize: '3rem' }}></i>
                <h5>Quality Assurance</h5>
                <p className="text-muted">
                  All resources are carefully reviewed and aligned with the Sri Lankan curriculum
                  to ensure accuracy and relevance.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="commitment-card text-center">
                <i className="bi bi-clock text-info mb-3" style={{ fontSize: '3rem' }}></i>
                <h5>Regular Updates</h5>
                <p className="text-muted">
                  We continuously add new resources and update existing content to keep pace
                  with curriculum changes and student needs.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="commitment-card text-center">
                <i className="bi bi-people text-warning mb-3" style={{ fontSize: '3rem' }}></i>
                <h5>Community Driven</h5>
                <p className="text-muted">
                  Built by educators and students for the educational community, fostering
                  collaboration and shared learning experiences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2>Our Values</h2>
            <p className="text-muted">The principles that guide everything we do</p>
          </div>

          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <div className="value-card text-center h-100">
                <div className="value-icon mb-3">
                  <i className="bi bi-unlock-fill text-primary" style={{ fontSize: '2.5rem' }}></i>
                </div>
                <h5>Accessibility</h5>
                <p className="text-muted small">
                  Making quality education accessible to every student, regardless of economic background.
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="value-card text-center h-100">
                <div className="value-icon mb-3">
                  <i className="bi bi-star-fill text-warning" style={{ fontSize: '2.5rem' }}></i>
                </div>
                <h5>Excellence</h5>
                <p className="text-muted small">
                  Striving for the highest quality in all our educational resources and services.
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="value-card text-center h-100">
                <div className="value-icon mb-3">
                  <i className="bi bi-globe text-info" style={{ fontSize: '2.5rem' }}></i>
                </div>
                <h5>Inclusivity</h5>
                <p className="text-muted small">
                  Embracing linguistic and cultural diversity to serve all Sri Lankan students.
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="value-card text-center h-100">
                <div className="value-icon mb-3">
                  <i className="bi bi-lightbulb-fill text-success" style={{ fontSize: '2.5rem' }}></i>
                </div>
                <h5>Innovation</h5>
                <p className="text-muted small">
                  Leveraging technology to create better learning experiences for modern students.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-5">
        <div className="container">
          <div className="cta-section text-center">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <h2 className="mb-4">Join Our Educational Journey</h2>
                <p className="lead mb-4">
                  Whether you're a student seeking quality resources or an educator looking to support
                  your students, Teaching Torch is here to help you succeed.
                </p>
                <div className="cta-buttons">
                  <Link to="/" className="btn btn-primary btn-lg me-3">
                    <i className="bi bi-book me-2"></i>Explore Resources
                  </Link>
                  <Link to="/contact" className="btn btn-outline-primary btn-lg">
                    <i className="bi bi-envelope me-2"></i>Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .mission-card,
        .commitment-card,
        .value-card {
          background: var(--card-bg);
          border-radius: 15px;
          padding: 2rem;
          box-shadow: 0 5px 20px var(--card-shadow);
          transition: all 0.3s ease;
          border: 2px solid transparent;
          height: 100%;
        }

        .mission-card:hover,
        .commitment-card:hover,
        .value-card:hover {
          transform: translateY(-5px);
          border-color: var(--primary);
          box-shadow: 0 10px 30px var(--card-shadow);
        }

        .mission-icon,
        .value-icon {
          transition: transform 0.3s ease;
        }

        .mission-card:hover .mission-icon,
        .value-card:hover .value-icon {
          transform: scale(1.1);
        }

        .cta-section {
          background: var(--hero-gradient);
          border-radius: 20px;
          padding: 3rem 2rem;
          color: white;
        }

        .cta-section h2 {
          color: white;
        }

        .cta-section .lead {
          color: rgba(255, 255, 255, 0.9);
        }

        .cta-buttons .btn {
          margin: 0.5rem;
        }

        .icon-stack {
          position: relative;
        }

        .vision-graphic::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 200px;
          height: 200px;
          background: linear-gradient(45deg, var(--primary), transparent);
          border-radius: 50%;
          opacity: 0.1;
          z-index: -1;
        }
      `}</style>
    </div>
  );
};

export default About;