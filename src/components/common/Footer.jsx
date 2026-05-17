import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Globe, MessageCircle, Mail } from 'lucide-react';

const Footer = () => {
  const { settings } = useData();
  return (
    <footer className="bg-gradient-to-r from-primary to-primary-dark py-6 mt-auto text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Socials */}
          <div className="w-full md:w-1/3 text-center md:text-left">
            <h5 className="text-lg font-bold mb-3 text-white">Teaching Torch</h5>
            <div className="flex items-center justify-center md:justify-start gap-4">
              {settings?.website && (
                <a href={settings.website} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-bg-secondary hover:bg-[#1877F2]/10 hover:text-[#1877F2] text-text-muted transition-colors" title="Website">
                  <Globe className="w-5 h-5" />
                </a>
              )}
              {settings?.whatsapp && (
                <a href={`https://wa.me/${settings.whatsapp}`} className="text-white hover:text-white/70 hover:-translate-y-0.5 transition-all" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5" />
                </a>
              )}
              {settings?.email && (
                <a href={`mailto:${settings.email}`} className="text-white hover:text-white/70 hover:-translate-y-0.5 transition-all" aria-label="Email">
                  <Mail className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="w-full md:w-1/3 text-center">
            <div className="flex justify-center flex-wrap gap-4">
              <Link to="/about" className="text-white text-sm hover:text-white/80 transition-colors tap-target inline-flex items-center px-2">About Us</Link>
              <Link to="/contact" className="text-white text-sm hover:text-white/80 transition-colors tap-target inline-flex items-center px-2">Contact Us</Link>
              <Link to="/privacy-policy" className="text-white text-sm hover:text-white/80 transition-colors tap-target inline-flex items-center px-2">Privacy Policy</Link>
            </div>
          </div>

          {/* Copyright */}
          <div className="w-full md:w-1/3 text-center md:text-right">
            <p className="text-white text-sm opacity-80 mb-1">
              &copy; {new Date().getFullYear()} Teaching Torch.
            </p>
            <p className="text-white text-xs opacity-60">
              Made with ❤️ for Sri Lankan Education
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;