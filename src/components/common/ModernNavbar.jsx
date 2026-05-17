import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun, ChevronDown, UserCircle, LogOut, Settings, BookOpen, GraduationCap } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';

export default function ModernNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showGradesDropdown, setShowGradesDropdown] = useState(false);
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  
  const { theme, toggleTheme } = useTheme();
  const { grades, gradesLoading } = useData();
  const { currentUser: user, isAdmin, logout, isManageMode, toggleManageMode } = useAuth();
  const location = useLocation();

  const gradesDropdownRef = useRef(null);
  const adminDropdownRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (gradesDropdownRef.current && !gradesDropdownRef.current.contains(event.target)) {
        setShowGradesDropdown(false);
      }
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target)) {
        setShowAdminDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = useCallback((path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  }, [location.pathname]);

  const sortedGrades = useMemo(() => {
    return Object.entries(grades)
      .sort((a, b) => {
        const orderA = a[1].order !== undefined ? a[1].order : 999;
        const orderB = b[1].order !== undefined ? b[1].order : 999;
        return orderA - orderB;
      });
  }, [grades]);

  // Framer motion variants
  const mobileMenuVariants = {
    closed: { opacity: 0, height: 0, transition: { duration: 0.3, ease: "easeInOut" } },
    open: { opacity: 1, height: 'auto', transition: { duration: 0.3, ease: "easeInOut" } }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95, pointerEvents: "none" },
    visible: { opacity: 1, y: 0, scale: 1, pointerEvents: "auto", transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-bg-primary/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container-modern">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/20 bg-primary/5 flex items-center justify-center p-0.5 transition-transform group-hover:scale-105">
                <img
                  src="/logo192.png"
                  alt="Teaching Torch Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="font-bold text-xl text-primary hidden sm:block">Teaching Torch</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "h-10 px-4 rounded-md text-sm font-medium flex items-center transition-colors hover:bg-bg-secondary",
                    isActive(link.path) ? "text-primary bg-primary/10" : "text-text-primary"
                  )}
                >
                  {link.name}
                </Link>
              ))}

              {/* Grades Dropdown */}
              <div className="relative h-10 flex items-center" ref={gradesDropdownRef}>
                <button
                  onClick={() => setShowGradesDropdown(!showGradesDropdown)}
                  className={cn(
                    "h-10 flex items-center gap-1 px-4 rounded-md text-sm font-medium transition-colors hover:bg-bg-secondary",
                    location.pathname.includes('/grade') || location.pathname.includes('/al') ? "text-primary bg-primary/10" : "text-text-primary"
                  )}
                >
                  Grades <ChevronDown className="w-4 h-4" />
                </button>
                
                <AnimatePresence>
                  {showGradesDropdown && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={dropdownVariants}
                      className="absolute left-0 mt-2 w-56 rounded-xl bg-card border border-border shadow-lg py-2 overflow-hidden z-50"
                    >
                      {gradesLoading ? (
                        <div className="px-4 py-2 text-sm text-text-muted">Loading grades...</div>
                      ) : (
                        sortedGrades.map(([key, gradeData]) => (
                          <Link
                            key={key}
                            to={`/grade/${key}`}
                            onClick={() => setShowGradesDropdown(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            <BookOpen className="w-4 h-4 text-primary" />
                            {gradeData.display}
                          </Link>
                        ))
                      )}
                      <div className="h-px bg-border my-1" />
                      <Link
                        to="/al"
                        onClick={() => setShowGradesDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-success hover:bg-success/10 transition-colors"
                      >
                        <GraduationCap className="w-4 h-4" />
                        Advanced Level (A/L)
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-2">
              
              {/* Theme Toggle (desktop only — mobile uses menu item below) */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="hidden lg:inline-flex rounded-full"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>

              {/* Admin Dropdown (allowlisted admins only) */}
              {isAdmin && user && (
                <div className="relative" ref={adminDropdownRef}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAdminDropdown(!showAdminDropdown)}
                    className="flex items-center gap-2 rounded-full px-3"
                  >
                    <UserCircle className="w-5 h-5 text-primary" />
                    <span className="hidden sm:inline text-sm">Admin</span>
                  </Button>
                  
                  <AnimatePresence>
                    {showAdminDropdown && (
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={dropdownVariants}
                        className="absolute right-0 mt-2 w-48 rounded-xl bg-card border border-border shadow-lg py-2 z-50"
                      >
                        <Link
                          to="/admin"
                          onClick={() => setShowAdminDropdown(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-bg-secondary"
                        >
                          <Settings className="w-4 h-4" /> Dashboard
                        </Link>
                        <button
                          onClick={() => { toggleManageMode(); setShowAdminDropdown(false); }}
                          className="w-full flex items-center justify-between px-4 py-2 text-sm text-text-primary hover:bg-bg-secondary"
                        >
                          <span className="flex items-center gap-2">
                            <div className={cn("w-2 h-2 rounded-full", isManageMode ? "bg-success" : "bg-text-muted")} />
                            Manage Mode
                          </span>
                          <span className={cn("text-xs font-semibold px-1.5 py-0.5 rounded", isManageMode ? "bg-success/20 text-success" : "bg-bg-tertiary text-text-muted")}>
                            {isManageMode ? 'ON' : 'OFF'}
                          </span>
                        </button>
                        <div className="h-px bg-border my-1" />
                        <button
                          onClick={() => { logout(); setShowAdminDropdown(false); }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-danger/10"
                        >
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden rounded-full"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>

            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
              className="lg:hidden overflow-hidden bg-bg-primary border-b border-border shadow-md absolute w-full"
            >
              <div className="px-4 py-4 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "block px-4 py-3 rounded-lg text-base font-medium transition-colors",
                      isActive(link.path) ? "bg-primary/10 text-primary" : "text-text-primary hover:bg-bg-secondary"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
                
                <div className="h-px bg-border my-2" />
                <div className="px-4 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">Grades</div>
                
                {gradesLoading ? (
                  <div className="px-4 py-2 text-sm text-text-muted">Loading...</div>
                ) : (
                  sortedGrades.map(([key, gradeData]) => (
                    <Link
                      key={key}
                      to={`/grade/${key}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-text-primary hover:bg-bg-secondary transition-colors"
                    >
                      <BookOpen className="w-4 h-4 text-primary" /> {gradeData.display}
                    </Link>
                  ))
                )}
                <Link
                  to="/al"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-success bg-success/5 hover:bg-success/10 mt-2 transition-colors"
                >
                  <GraduationCap className="w-4 h-4 text-success" /> Advanced Level
                </Link>

                <div className="h-px bg-border my-2" />
                <button
                  type="button"
                  onClick={() => {
                    toggleTheme();
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-text-primary hover:bg-bg-secondary transition-colors tap-target"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-5 h-5 text-primary" />
                      Light mode
                    </>
                  ) : (
                    <>
                      <Moon className="w-5 h-5 text-primary" />
                      Dark mode
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
