import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';


export default function PublicLayout() {
  const { pathname } = useLocation();

  // Ẩn header/footer với các page login, register
  const hideLayout =
    pathname === "/login" ||
    pathname === "/register";

  return (
    <>
      {!hideLayout && <Header />}
      <main><Outlet /></main>
      {!hideLayout && <Footer />}
    </>
  );
}
