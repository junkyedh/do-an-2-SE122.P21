// useSystemContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
interface ContextValue {
  isLoggedIn: boolean;
  token: string;
  role: string;
  setAuth: (token: string, role: string) => void;
  logout: () => void;
}
const AppContext = createContext<ContextValue | undefined>(undefined);

export const useSystemContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useSystemContext must be used within AppSystemProvider');
  return ctx;
}

export const AppSystemProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [token, setToken] = useState('');
  const [role, setRole] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const setAuth = (newToken: string, newRole: string) => {
    setToken(newToken);
    setRole(newRole);
    setIsLoggedIn(true);
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
      setToken(t);
      setRole(r);
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <AppContext.Provider value={{ isLoggedIn, token, role, setAuth, logout }}>
      {children}
    </AppContext.Provider>
  );
};
