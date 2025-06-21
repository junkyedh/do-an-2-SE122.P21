// useSystemContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import { useCart } from './cartContext';
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
  const { clearCart, clearSessionId, fetchCart } = useCart();

  const setAuth = (newToken: string, newRole: string, isNewUser = false) => {
    const decoded: TokenPayload = jwtDecode(newToken);
    setToken(newToken);
    setRole(newRole);
    setIsLoggedIn(true);

    if (isNewUser) {
      clearSessionId(); // Xóa sessionId nếu là người dùng mới
      clearCart(); // Xóa giỏ hàng nếu là người dùng mới
    }

    fetchCart(); // Lấy giỏ hàng mới nếu có
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
    clearSessionId(); // Xóa sessionId khi đăng xuất
    clearCart(); // Xóa giỏ hàng khi đăng xuất
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('sessionId'); // Xóa sessionId khi đăng xuất
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
