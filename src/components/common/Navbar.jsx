import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Home, Info, Mail, Book, GraduationCap, LayoutDashboard, Settings2, LogOut, Moon, Sun, Menu, X, ChevronRight, User } from 'lucide-react';
import { Container } from '../ui/Layout';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { grades, gradesLoading } = useData();
  const { currentUser: user, logout, isManageMode, toggleManageMode } = useAuth();
  const location = useLocation();

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showGradesDropdown, setShowGradesDropdown] = useState(false);
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);

  const gradesDropdownRef = useRef(null);
  const adminDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (gradesDropdownRef.current && !gradesDropdownRef.current.contains(event.target)) {
        setShowGradesDropdown(false);
      }
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target)) {
        setShowAdminDropdown(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('button[aria-label="Toggle Menu"]')) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setShowMobileMenu(false);
    setShowGradesDropdown(false);
    setShowAdminDropdown(false);
  }, [location.pathname]);

  const isActive = useCallback((path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  }, [location.pathname]);

  const sortedGrades = useMemo(() => {
    return Object.entries(grades).sort((a, b) => {
      const orderA = a[1].order !== undefined ? a[1].order : 999;
      const orderB = b[1].order !== undefined ? b[1].order : 999;
      return orderA - orderB;
    });
  }, [grades]);

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-r from-primary to-primary-dark shadow-md">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors p-1">
              <img src="/logo192.png" alt="Teaching Torch" className="w-full h-full object-contain" loading="lazy" />
            </div>
            <span className="font-extrabold text-xl text-white tracking-tight hidden sm:block">Teaching Torch</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link to="/" className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center transition-colors ${isActive('/') ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
              <Home className="w-4 h-4 mr-2" /> Home
            </Link>
            <Link to="/about" className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center transition-colors ${isActive('/about') ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
              <Info className="w-4 h-4 mr-2" /> About
            </Link>
            <Link to="/contact" className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center transition-colors ${isActive('/contact') ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
              <Mail className="w-4 h-4 mr-2" /> Contact
            </Link>

            {/* Grades Dropdown */}
            <div className="relative" ref={gradesDropdownRef}>
              <button 
                onClick={() => setShowGradesDropdown(!showGradesDropdown)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center transition-colors ${showGradesDropdown || isActive('/grade') || isActive('/al') ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
              >
                <Book className="w-4 h-4 mr-2" /> Grades
              </button>
              
              {showGradesDropdown && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-bg-secondary border border-border rounded-xl shadow-xl py-2 overflow-hidden animate-fade-in-down origin-top">
                  {gradesLoading ? (
                    <div className="px-4 py-3 text-sm text-text-muted">Loading grades...</div>
                  ) : (
                    <>
                      {sortedGrades.map(([key, gradeData]) => (
                        <Link key={key} to={`/grade/${key}`} className="flex items-center px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-bg-tertiary transition-colors">
                          <ChevronRight className="w-4 h-4 mr-2 text-primary opacity-50" /> {gradeData.display}
                        </Link>
                      ))}
                      <div className="h-px bg-border my-2 mx-4"></div>
                      <Link to="/al" className="flex items-center px-4 py-2.5 text-sm font-bold text-success hover:bg-success/10 transition-colors mx-2 rounded-lg">
                        <GraduationCap className="w-5 h-5 mr-2" /> Advanced Level (A/L)
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Side Controls (Desktop & Mobile) */}
          <div className="flex items-center space-x-2">
            
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme} 
              className="p-2 text-white/80 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Admin Controls (Desktop) */}
            {user && (
              <div className="hidden lg:block relative" ref={adminDropdownRef}>
                <button 
                  onClick={() => setShowAdminDropdown(!showAdminDropdown)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center transition-colors ${showAdminDropdown || isActive('/admin') ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
                >
                  <User className="w-5 h-5 sm:mr-2" /> <span className="hidden sm:inline">Admin</span>
                </button>
                
                {showAdminDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-bg-secondary border border-border rounded-xl shadow-xl py-2 overflow-hidden animate-fade-in-down origin-top-right">
                    <div className="px-4 py-3 border-b border-border bg-bg-tertiary/50">
                      <p className="text-sm font-medium text-text-primary truncate">{user.email}</p>
                      <p className="text-xs text-text-muted mt-0.5">Administrator</p>
                    </div>
                    <div className="p-2">
                      <Link to="/admin" className="flex items-center px-3 py-2.5 text-sm font-medium text-text-primary hover:bg-primary hover:text-white rounded-lg transition-colors">
                        <LayoutDashboard className="w-4 h-4 mr-3" /> Dashboard
                      </Link>
                      <button 
                        onClick={() => toggleManageMode()}
                        className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors"
                      >
                        <span className="flex items-center">
                          <Settings2 className="w-4 h-4 mr-3 text-text-muted" /> Manage Mode
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isManageMode ? 'bg-success text-white' : 'bg-bg-tertiary border border-border text-text-muted'}`}>
                          {isManageMode ? 'ON' : 'OFF'}
                        </span>
                      </button>
                    </div>
                    <div className="p-2 border-t border-border">
                      <button 
                        onClick={logout}
                        className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-danger hover:bg-danger/10 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2 text-white/80 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-label="Toggle Menu"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Menu */}
      <div 
        ref={mobileMenuRef}
        className={`lg:hidden absolute top-full left-0 w-full bg-bg-secondary border-b border-border shadow-xl transition-all duration-300 overflow-hidden ${showMobileMenu ? 'max-h-[calc(100vh-4rem)] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-4rem)]">
          <Link to="/" className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${isActive('/') ? 'bg-primary/10 text-primary' : 'text-text-primary hover:bg-bg-tertiary'}`}>
            <Home className="w-5 h-5 mr-3 opacity-70" /> Home
          </Link>
          <Link to="/about" className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${isActive('/about') ? 'bg-primary/10 text-primary' : 'text-text-primary hover:bg-bg-tertiary'}`}>
            <Info className="w-5 h-5 mr-3 opacity-70" /> About
          </Link>
          <Link to="/contact" className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${isActive('/contact') ? 'bg-primary/10 text-primary' : 'text-text-primary hover:bg-bg-tertiary'}`}>
            <Mail className="w-5 h-5 mr-3 opacity-70" /> Contact
          </Link>

          <div className="pt-4 mt-2 border-t border-border">
            <p className="px-4 text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Grades</p>
            {gradesLoading ? (
              <div className="px-4 py-2 text-sm text-text-muted">Loading grades...</div>
            ) : (
              <>
                {sortedGrades.map(([key, gradeData]) => (
                  <Link key={key} to={`/grade/${key}`} className="flex items-center px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors">
                    <ChevronRight className="w-4 h-4 mr-3 text-primary opacity-50" /> {gradeData.display}
                  </Link>
                ))}
                <Link to="/al" className="flex items-center px-4 py-3 mt-2 text-sm font-bold bg-success/10 text-success rounded-xl hover:bg-success/20 transition-colors border border-success/20">
                  <GraduationCap className="w-5 h-5 mr-3" /> Advanced Level (A/L)
                </Link>
              </>
            )}
          </div>

          {user && (
            <div className="pt-4 mt-2 border-t border-border">
              <p className="px-4 text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Admin</p>
              <Link to="/admin" className="flex items-center px-4 py-3 rounded-xl text-sm font-semibold text-text-primary hover:bg-bg-tertiary transition-colors">
                <LayoutDashboard className="w-5 h-5 mr-3 opacity-70" /> Dashboard
              </Link>
              <button 
                onClick={() => toggleManageMode()}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-text-primary hover:bg-bg-tertiary transition-colors"
              >
                <span className="flex items-center">
                  <Settings2 className="w-5 h-5 mr-3 opacity-70" /> Manage Mode
                </span>
                <span className={`px-2 py-1 rounded text-[10px] font-bold ${isManageMode ? 'bg-success text-white' : 'bg-bg-tertiary border border-border text-text-muted'}`}>
                  {isManageMode ? 'ON' : 'OFF'}
                </span>
              </button>
              <button 
                onClick={logout}
                className="w-full flex items-center px-4 py-3 mt-2 rounded-xl text-sm font-semibold text-danger hover:bg-danger/10 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-3 opacity-70" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;