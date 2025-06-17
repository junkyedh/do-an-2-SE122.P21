import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../pages/customer/Home/Home';
import About from '../pages/customer/About/About';
import Contact from '../pages/customer/Contact/Contact';
import Login from '../pages/customer/Home/Login/Login';
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
import { Checkout } from '@/pages/customer/Checkout/Checkout';
import { TrackingOrder } from '@/pages/customer/TrackingOrder/TrackingOrder';


const MainRoutes: React.FC = () => {
  return (
      <Routes>
          {/* Customer routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about-us" element={<About />} />
            <Route path="/contact-us" element={<Contact />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/login" element={<Login />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="tracking-order/:id" element={<TrackingOrder />} />
          </Route>

          {/* ADMIN / MANGER / STAFF */}
          <Route path="/admin-login" element={<AdminLogin />} />

          <Route element=
            {<ProtectedRoute 
              allowedRoles={['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_STAFF']}>
              <Layout />
            </ProtectedRoute>
            }
          >
            {/* Các route chung cho Admin, Manager, Staff */}
            <Route path="/admin/dashboard" element={<AdminBranchList />} />
            <Route path="/admin/branches" element={<AdminBranchList />} />
            <Route path="/admin/materials" element={<AdminMaterialList />} />
            <Route path="/admin/products" element={<AdminProductList />} />
            <Route path="/admin/orders" element={<AdminOrderList />} />
            <Route path="/admin/staffs" element={<AdminStaffList />} />
            <Route path="/admin/customers" element={<AdminCustomerList />} />
            <Route path="/admin/promotions" element={<AdminPromotion />} />
            <Route path="/manager/dashboard" element={<ManagerCustomerList />} />
          </Route>
            <Route path="/404" element={<h1>Page Not Found</h1>} />
            <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
  );
};

export default MainRoutes;