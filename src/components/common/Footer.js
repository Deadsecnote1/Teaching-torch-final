import React from 'react';
import { useData } from '../../context/DataContext';

const Footer = () => {
  const { settings } = useData();
  return (
    <footer className="footer-section py-3 mt-auto">
      <div className="container">
        <div className="row justify-content-center text-center">
          {/* Brand Column */}
          <div className="col-12 mb-3">
            <h5 className="footer-title text-white">Teaching Torch</h5>
            <p className="footer-text mx-auto text-white-50" style={{ maxWidth: '400px' }}>
              Free educational resources for Sri Lankan students from Grade 6 to Advanced Level.
            </p>
            <div className="social-links mt-3">
              {settings?.facebook && (
                <a href={settings.facebook} className="footer-link text-white me-3" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-facebook"></i>
                </a>
              )}
              {settings?.whatsapp && (
                <a href={`https://wa.me/${settings.whatsapp}`} className="footer-link text-white me-3" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-whatsapp"></i>
                </a>
              )}
              {settings?.email && (
                <a href={`mailto:${settings.email}`} className="footer-link text-white" aria-label="Email">
                  <i className="bi bi-envelope"></i>
                </a>
              )}
            </div>
          </div>
        </div>

        <hr className="footer-divider my-2 border-white opacity-25" />

        {/* Bottom Row */}
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="footer-copyright text-white-50 mb-0"><small>&copy; 2025 Teaching Torch. All rights reserved.</small></p>
          </div>
          <div className="col-md-6 text-md-end">
            <small className="footer-made-with">
              Made with ❤️ for Sri Lankan Education 🇱🇰
            </small>
          </div>
        </div>
      </div>

      <style>{`
        .footer-section {
          background: var(--primary-gradient) !important;
          color: white !important;
          margin-top: auto;
        }

        .footer-link:hover {
          color: rgba(255,255,255,0.7) !important;
          transform: translateY(-2px);
        }

      `}</style>
    </footer>
  );
};

export default Footer;