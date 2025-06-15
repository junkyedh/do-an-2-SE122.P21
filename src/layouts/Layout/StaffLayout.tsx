import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSystemContext } from '@/hooks/useSystemContext';
import Sidebar from '../Sidebar/Sidebar'; // Import Sidebar

const AdminLayout: React.FC<{ children?: React.ReactNode }> = () => {
  const { role } = useSystemContext();

  if (role !== 'ROLE_STAFF') {
    return <Navigate to="/admin-login" />;
  }

  return (
    <div className="layout">
      <Sidebar /> {/* Hiển thị Sidebar */}
      <div className="content">
        <Outlet /> {/*  */}
      </div>
    </div>
  );
};

export default AdminLayout;