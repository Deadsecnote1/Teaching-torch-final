import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import { useAuth } from '../../../context/AuthContext';
import AdminLayout from '../../ol/admin/AdminLayout';
import ALAdminTab from '../../../components/admin/ALAdminTab';

const AlAdminDashboard = () => {
  useDocumentTitle('Admin — Advanced Level');
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) navigate('/admin/login');
  }, [currentUser, navigate]);

  const adminNav = [
    { to: '/admin', label: 'Grades 6–11', active: location.pathname === '/admin' },
    { to: '/admin/al', label: 'Advanced Level', active: location.pathname.startsWith('/admin/al') }
  ];

  return (
    <AdminLayout
      title="Advanced Level Admin"
      subtitle="Manage A/L streams, subjects, resource types, and files"
      navLinks={adminNav}
    >
      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <ALAdminTab />
      </div>
    </AdminLayout>
  );
};

export default AlAdminDashboard;
