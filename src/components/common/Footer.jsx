import React from 'react';
import { useData } from '../../context/DataContext';

const Footer = () => {
  const { settings } = useData();
  return (
    <footer className="footer-section py-4 mt-auto">
      <div className="container">
        <div className="row align-items-center">
          {/* Brand & Socials */}
          <div className="col-md-4 text-center text-md-start mb-3 mb-md-0">
            <h5 className="footer-title text-white fw-bold mb-2">Teaching Torch</h5>
            <div className="social-links">
              {settings?.facebook && (
                <a href={settings.facebook} className="footer-link text-white me-3" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-facebook fs-5"></i>
                </a>
              )}
              {settings?.whatsapp && (
                <a href={`https://wa.me/${settings.whatsapp}`} className="footer-link text-white me-3" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-whatsapp fs-5"></i>
                </a>
              )}
              {settings?.email && (
                <a href={`mailto:${settings.email}`} className="footer-link text-white" aria-label="Email">
                  <i className="bi bi-envelope fs-5"></i>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 text-center mb-3 mb-md-0">
            <div className="d-flex justify-content-center flex-wrap gap-3">
              <a href="/about" className="footer-nav-link text-white small">About Us</a>
              <a href="/contact" className="footer-nav-link text-white small">Contact Us</a>
              <a href="/privacy-policy" className="footer-nav-link text-white small">Privacy Policy</a>
            </div>
          </div>

          {/* Copyright */}
          <div className="col-md-4 text-center text-md-end">
            <p className="footer-copyright text-white mb-0 small opacity-75">
              &copy; {new Date().getFullYear()} Teaching Torch.
            </p>
            <p className="footer-made-with text-white mb-0 x-small opacity-50">
              Made with ❤️ for Sri Lankan Education
            </p>
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