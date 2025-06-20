import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../pages/customer/Home/Home';
import About from '../pages/customer/About/About';
import Contact from '../pages/customer/Contact/Contact';
import AdminLogin from '../pages/AdminLogin/AdminLogin';
import ProtectedRoute from './ProtectedRoute';
import AdminBranchList from '@/pages/admin/AdminBranchList/AdminBranchList';
import AdminMaterialList from '@/pages/admin/AdminMaterialList/AdminMaterialList';
import AdminProductList from '@/pages/admin/AdminProduct/AdminProduct';
import AdminOrderList from '@/pages/admin/AdminOrderList/AdminOrderList';
import AdminStaffList from '@/pages/admin/AdminStaffList/AdminStaffList';
import AdminCustomerList from '@/pages/admin/AdminCustomerList/AdminCustomerList';
import AdminPromotion from '@/pages/admin/AdminPromotion/AdminPromotion';
import { Rating } from '@mui/material';
import Statistic from '@/pages/brands/Statistic/Statistic';
import "@/App.scss";
import ProductDetail from '@/pages/customer/ProductDetail/ProductDetail';
import Menu from '@/pages/customer/Menu/Menu';
import PublicLayout from '@/layouts/Layout/PublicLayout';
import Layout from '@/layouts/Layout/Layout';
import ManagerCustomerList from '@/pages/brands/ManagerCustomerList/ManagerCustomerList';
import ManagerProductList from '@/pages/brands/ManagerProduct/ManagerProduct';
import ManagerMaterialList from '@/pages/brands/ManagerMaterialList/ManagerMaterialList';
import ManagerOrderList from '@/pages/brands/ManagerOrderList/ManagerOrderList';
import ManagerPromotion from '@/pages/brands/ManagerPromotion/ManagerPromotion';
import ManagerStaffList from '@/pages/brands/ManagerStaffList/ManagerStaffList';
import { Checkout } from '@/pages/customer/Checkout/Checkout';
import { TrackingOrder } from '@/pages/customer/TrackingOrder/TrackingOrder';
import ProfileUser from '@/pages/customer/ProfileUser/ProfileUser';
import HistoryOrder from '@/pages/customer/HistoryOrder/HistoryOrder';


const MainRoutes: React.FC = () => {
  return (
      <Routes>
          {/* Customer routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/about-us" element={<About />} />
            <Route path="/contact-us" element={<Contact />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/profile-user" element={<ProfileUser />}/>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="tracking-order/:id" element={<TrackingOrder />} />
            <Route path="/history" element={<HistoryOrder />} />
          </Route>

      <Route element=
        {<ProtectedRoute
          allowedRoles={['ADMIN_SYSTEM', 'ADMIN_BRAND', 'STAFF']}>
          <Layout />
        </ProtectedRoute>
        }
      >
        {/* Các route chung cho Admin, Manager, Staff */}
        <Route path="/admin/dashboard" element={<AdminBranchList />} />
        <Route path="/admin/branchlist" element={<AdminBranchList />} />
        <Route path="/admin/materiallist" element={<AdminMaterialList />} />
        <Route path="/admin/productlist" element={<AdminProductList />} />
        <Route path="/admin/orderlist" element={<AdminOrderList />} />
        <Route path="/admin/stafflist" element={<AdminStaffList />} />
        <Route path="/admin/customerlist" element={<AdminCustomerList />} />
        <Route path="/admin/promote" element={<AdminPromotion />} />

        <Route path="/manager/dashboard" element={<ManagerCustomerList />} />
        <Route path="/manager/productlist" element={<ManagerProductList />} />
        <Route path="/manager/materiallist" element={<ManagerMaterialList />} />
        <Route path="/manager/stafflist" element={<ManagerStaffList />} />
        <Route path="/manager/customerlist" element={<ManagerCustomerList />} />
        <Route path="/manager/orderlist" element={<ManagerOrderList />} />
        <Route path="/manager/promote" element={<ManagerPromotion />} />
      </Route>
      <Route path="/404" element={<h1>Page Not Found</h1>} />
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
};

export default MainRoutes;