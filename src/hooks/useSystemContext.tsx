// useSystemContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
interface ContextValue {
  isLoggedIn: boolean;
  token: string;
  role: string;
  branchId?: string;
  isInitialized: boolean;
  setAuth: (token: string, role: string) => void;
  logout: () => void;
}
const AppContext = createContext<ContextValue | undefined>(undefined);

interface TokenPayload {
  id?: number;
  phone?: string;
  role?: string;
  branchId?: string;
  type?: 'staff' | 'customer';
}

export const useSystemContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useSystemContext must be used within AppSystemProvider');
  return ctx;
}

export const AppSystemProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [token, setToken] = useState('');
  const [role, setRole] = useState('');
  const [branchId, setBranchId] = useState<string | undefined>(undefined);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const setAuth = (newToken: string, newRole: string) => {
    const decoded: TokenPayload = jwtDecode(newToken);
    setToken(newToken);
    setRole(newRole);
    setIsLoggedIn(true);
    if (decoded.branchId) {
      setBranchId(decoded.branchId);
    } else {
      setBranchId(undefined); // hoặc null
    }
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', newRole);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setToken('');
    setRole('');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  // Khởi tạo từ localStorage
  useEffect(() => {
    const t = localStorage.getItem('token');
    const r = localStorage.getItem('role');
    if (t && r) {
      const decoded: TokenPayload = jwtDecode(t);
      setToken(t);
      setRole(r);
      setBranchId(decoded.branchId);
      setIsLoggedIn(true);
    }
    setIsInitialized(true);
  }, []);

  return (
    <AppContext.Provider value={{ isLoggedIn, token, role, branchId, setAuth, logout, isInitialized }}>
      {children}
    </AppContext.Provider>
  );
};
