import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSystemContext } from '../hooks/useSystemContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isLoggedIn, role, isInitialized } = useSystemContext();
  console.log('role:', role);
  console.log('Allowed roles:', allowedRoles);

  if (!isInitialized) {
    return null; // hoặc <LoadingSpinner />
  }

  if (!isLoggedIn) {
    return <Navigate to="/admin-login" />; // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />; // Chuyển hướng nếu không có quyền
  }

  return <>{children}</>;
};

export default ProtectedRoute;