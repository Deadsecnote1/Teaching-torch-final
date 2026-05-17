import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, LogOut, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

/**
 * Shared chrome for O/L and A/L admin areas.
 */
const AdminLayout = ({ title, subtitle, children, navLinks = [] }) => {
  const { logout, isManageMode, toggleManageMode, firebaseProjectId } = useAuth();
  const isStagingEnv =
    import.meta.env.MODE === 'staging' ||
    (firebaseProjectId && firebaseProjectId.toLowerCase().includes('staging'));

  return (
    <div className="min-h-screen py-10 bg-bg-secondary text-text-primary">
      <div
        className={
          isStagingEnv
            ? 'text-center text-sm font-semibold py-2 px-4 bg-amber-500/15 text-amber-800 dark:text-amber-200 border-b border-amber-500/30'
            : 'text-center text-sm font-semibold py-2 px-4 bg-danger/10 text-danger border-b border-danger/30'
        }
        role="status"
      >
        {isStagingEnv ? 'STAGING' : 'PRODUCTION'} — Firebase project: {firebaseProjectId || 'unknown'}
        {isStagingEnv ? ' (safe for admin testing)' : ' — changes affect live users'}
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold flex items-center text-text-primary">
              <LayoutDashboard className="w-8 h-8 mr-3 text-primary" />
              {title}
            </h2>
            {subtitle && <p className="text-text-muted mt-1 text-sm">{subtitle}</p>}
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors shadow-sm border ${isManageMode ? 'bg-success text-white border-success hover:bg-success/90' : 'bg-transparent text-success border-success hover:bg-success/10'}`}
              onClick={toggleManageMode}
            >
              {isManageMode ? <ToggleRight className="w-5 h-5 mr-2" /> : <ToggleLeft className="w-5 h-5 mr-2" />}
              Manage Mode: {isManageMode ? 'ON' : 'OFF'}
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors border border-danger text-danger hover:bg-danger/10"
              onClick={logout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>

        {navLinks.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {navLinks.map(({ to, label, active }) => (
              <Link
                key={to}
                to={to}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${active ? 'bg-primary text-white border-primary' : 'border-border text-text-primary hover:bg-bg-tertiary'}`}
              >
                {label}
              </Link>
            ))}
          </div>
        )}

        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
