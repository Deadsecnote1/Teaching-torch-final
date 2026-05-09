import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { grades, gradesLoading } = useData();
  const { currentUser: user, logout, isManageMode, toggleManageMode } = useAuth();
  const location = useLocation();

  const [showGradesDropdown, setShowGradesDropdown] = useState(false);

  const gradesDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (gradesDropdownRef.current && !gradesDropdownRef.current.contains(event.target)) {
        setShowGradesDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Check if link is active
  const isActive = React.useCallback((path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  }, [location.pathname]);

  // Memoize sorted grades
  const sortedGrades = React.useMemo(() => {
    return Object.entries(grades)
      .sort((a, b) => {
        const orderA = a[1].order !== undefined ? a[1].order : 999;
        const orderB = b[1].order !== undefined ? b[1].order : 999;
        return orderA - orderB;
      });
  }, [grades]);



  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top py-2" style={{ background: 'var(--primary-gradient)' }}>
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center h-100" to="/">
          <img
            src="/logo192.png"
            alt="Teaching Torch Logo"
            className=""
            loading="lazy"
            style={{ width: 'clamp(40px, 8vw, 60px)', height: 'clamp(40px, 8vw, 60px)', objectFit: 'contain' }}
          />
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Content */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-mobile-container d-lg-flex w-100 justify-content-between align-items-center">
            {/* Main Navigation */}
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link
                  className={`nav-link text-white ${isActive('/') ? 'active fw-bold' : ''}`}
                  to="/"
                >
                  <i className="bi bi-house-fill me-1"></i>Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link text-white ${isActive('/about') ? 'active fw-bold' : ''}`}
                  to="/about"
                >
                  <i className="bi bi-info-circle-fill me-1"></i>About
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link text-white ${isActive('/contact') ? 'active fw-bold' : ''}`}
                  to="/contact"
                >
                  <i className="bi bi-envelope-fill me-1"></i>Contact
                </Link>
              </li>
  
              {/* Grades Dropdown */}
              <li className="nav-item dropdown" ref={gradesDropdownRef}>
                <button
                  className="nav-link dropdown-toggle text-white btn btn-link border-0"
                  type="button"
                  onClick={() => {
                    setShowGradesDropdown(!showGradesDropdown);
                  }}
                  aria-expanded={showGradesDropdown}
                  style={{ background: 'none', padding: '0.5rem 0.75rem' }}
                >
                  <i className="bi bi-book-fill me-1"></i>Grades
                </button>
                <ul className={`dropdown-menu ${showGradesDropdown ? 'show' : ''}`}>
                  {gradesLoading ? (
                    <li><span className="dropdown-item text-muted">Loading grades...</span></li>
                  ) : (
                    sortedGrades.map(([key, gradeData]) => (
                      <li key={key}>
                        <Link
                          className="dropdown-item fw-bold"
                          to={`/grade/${key}`}
                          onClick={() => setShowGradesDropdown(false)}
                        >
                          <i className="bi bi-chevron-right me-2 text-primary" style={{ fontSize: '0.8rem' }}></i>
                          {gradeData.display}
                        </Link>
                      </li>
                    ))
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link
                      className="dropdown-item fw-bold text-success"
                      to="/al"
                      onClick={() => setShowGradesDropdown(false)}
                    >
                      <i className="bi bi-mortarboard-fill me-2"></i>
                      Advanced Level (A/L)
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
  
            {/* Right Side Controls */}
            <ul className="navbar-nav">
              {/* Admin Link (Only visible when logged in) */}
              {user && (
                <li className="nav-item">
                  <div className="dropdown">
                    <button 
                      className="nav-link btn btn-link text-white border-0 dropdown-toggle" 
                      type="button" 
                      data-bs-toggle="dropdown"
                    >
                      <i className="bi bi-person-circle me-1"></i> Admin
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li><Link className="dropdown-item" to="/admin"><i className="bi bi-speedometer2 me-2"></i>Dashboard</Link></li>
                      <li>
                        <button 
                          className="dropdown-item d-flex align-items-center justify-content-between"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleManageMode();
                          }}
                        >
                          <span>
                            <i className={`bi ${isManageMode ? 'bi-toggle-on' : 'bi-toggle-off'} me-2 ${isManageMode ? 'text-success' : ''}`}></i>
                            Manage Mode
                          </span>
                          <span className={`badge ${isManageMode ? 'bg-success' : 'bg-secondary'} ms-2`}>
                            {isManageMode ? 'ON' : 'OFF'}
                          </span>
                        </button>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><button className="dropdown-item text-danger" onClick={logout}><i className="bi bi-box-arrow-right me-2"></i>Logout</button></li>
                    </ul>
                  </div>
                </li>
              )}
  
              {/* Theme Toggle */}
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link border-0"
                  id="themeToggle"
                  title="Toggle Dark Mode"
                  onClick={toggleTheme}
                  style={{ background: 'none', padding: '0.5rem 0.75rem' }}
                >
                  <i className={`bi ${theme === 'dark' ? 'bi-sun-fill' : 'bi-moon-fill'}`}
                    id="themeIcon"></i>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Custom Navbar Styles */}
      <style>{`
        .navbar {
          background-color: var(--primary) !important;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          z-index: 1030;
        }
        
        .navbar-brand .brand-text {
          font-size: 1.25rem;
          font-weight: 700;
        }
        
        .nav-link {
          color: rgba(255,255,255,0.9) !important;
          font-weight: 500;
          transition: all 0.3s ease;
          border-radius: 5px;
          margin: 0 2px;
        }
        
        .nav-link:hover {
          color: white !important;
          background-color: rgba(255,255,255,0.1);
        }
        
        .nav-link.active {
          color: white !important;
          background-color: rgba(255,255,255,0.2);
        }
        
        .dropdown-menu {
          border: none;
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
          border-radius: 8px;
          margin-top: 0.5rem;
          background-color: var(--card-bg);
          min-width: 200px;
        }
        
        .dropdown-menu.show {
          display: block;
        }
        
        .dropdown-item {
          padding: 0.75rem 1rem;
          transition: all 0.2s ease;
          color: var(--text-primary);
        }
        
        .dropdown-item:hover, .dropdown-item:focus {
          background-color: var(--primary);
          color: white;
        }
        
        .dropdown-item.active {
          background-color: var(--primary);
          color: white;
        }
        
        .dropdown-divider {
          border-color: var(--border-color);
        }
        
        .navbar-toggler {
          border: 1px solid rgba(255,255,255,0.3);
        }
        
        .navbar-toggler:focus {
          box-shadow: 0 0 0 0.25rem rgba(255,255,255,0.25);
        }
        
        @media (max-width: 991.98px) {
          .navbar-mobile-container {
            background-color: var(--card-bg, white);
            border-radius: 8px;
            padding: 0.5rem;
            margin-top: 0.5rem;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          }
          
          .navbar-nav {
            background-color: transparent !important;
            padding: 0;
            margin-top: 0;
          }
          
          .dropdown-menu {
            position: static !important;
            float: none;
            width: 100%;
            margin-top: 0;
            background-color: transparent !important;
            box-shadow: none !important;
            border: none !important;
          }
          
          .nav-link {
            color: var(--text-primary) !important;
          }
          
          .nav-link:hover {
            background-color: var(--bg-secondary) !important;
            color: var(--primary) !important;
          }
          
          [data-theme='dark'] .nav-link {
            color: rgba(255,255,255,0.9) !important;
          }

          [data-theme='dark'] .nav-link:hover {
            background-color: rgba(255,255,255,0.1) !important;
            color: white !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;