import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../pages/customer/Home/Home';
import About from '../pages/customer/About/About';
import Contact from '../pages/customer/Contact/Contact';
import AdminLogin from '../pages/AdminLogin/AdminLogin';
import ProtectedRoute from './ProtectedRoute';
import AdminProductList from '@/pages/admin/AdminProduct';
import AdminOrderList from '@/pages/admin/AdminOrderList';
import AdminStaffList from '@/pages/admin/AdminStaffList';
import AdminCustomerList from '@/pages/admin/AdminCustomerList';
import AdminPromotion from '@/pages/admin/AdminPromotion';
import Statistic from '@/pages/admin/AdminStatistic';
import "@/App.scss";
import ProductDetail from '@/pages/customer/ProductDetail/ProductDetail';
import Menu from '@/pages/customer/Menu/Menu';
import PublicLayout from '@/layouts/Layout/PublicLayout';
import Layout from '@/layouts/Layout/Layout';
import ManagerCustomerList from '@/pages/brands/ManagerCustomerList';
import ManagerProductList from '@/pages/brands/ManagerProduct';
import ManagerMaterialList from '@/pages/brands/ManagerMaterialList';
import ManagerOrderList from '@/pages/brands/ManagerOrderList';
import ManagerPromotion from '@/pages/brands/ManagerPromotion';
import ManagerStaffList from '@/pages/brands/ManagerStaffList';
import { Checkout } from '@/pages/customer/Checkout/Checkout';
import { TrackingOrder } from '@/pages/customer/TrackingOrder/TrackingOrder';
import ProfileUser from '@/pages/customer/ProfileUser/ProfileUser';
import HistoryOrder from '@/pages/customer/HistoryOrder/HistoryOrder';
import RegisterCustomer from '@/pages/AdminLogin/RegisterCustomer';
import BranchStatistic from '@/pages/brands/BranchStatistic';
import AdminCustomerRating from '@/pages/admin/Rating';
import ManagerBranchInfo from '@/pages/brands/ManagerBranchInfo';
import ManagerTableList from '@/pages/brands/ManagerTable';
import TableOrder from '@/pages/brands/staff/TableOrder/TableOrder';
import CustomerList from '@/pages/brands/staff/CustomerList';
import StaffProfile from '@/pages/brands/staff/StaffProfile/StaffProfile';
import OrderList from '@/pages/brands/staff/OrderList';
import FeedbackPage from '@/pages/customer/Feedback/FeedbackPage';
import AdminBranchList from '@/pages/admin/AdminBranchList';
import AdminMaterialList from '@/pages/admin/AdminMaterialList';
import StaffList from '@/pages/brands/staff/StaffList';
import AdminMenu from '@/pages/brands/staff/Menu/AdminMenu';

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
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/register" element={<RegisterCustomer />} />
          </Route>

      <Route element=
        {<ProtectedRoute
          allowedRoles={['ADMIN_SYSTEM', 'ADMIN_BRAND', 'STAFF']}>
          <Layout />
        </ProtectedRoute>
        }
      >
        {/* Các route chung cho Admin, Manager, Staff */}
        <Route path="/admin/dashboard" element={<Statistic />} />
        <Route path="/admin/branchlist" element={<AdminBranchList />} />
        <Route path="/admin/materiallist" element={<AdminMaterialList />} />
        <Route path="/admin/productlist" element={<AdminProductList />} />
        <Route path="/admin/orderlist" element={<AdminOrderList />} />
        <Route path="/admin/stafflist" element={<AdminStaffList />} />
        <Route path="/admin/customerlist" element={<AdminCustomerList />} />
        <Route path="/admin/promote" element={<AdminPromotion />} />
        <Route path="/admin/rating" element={<AdminCustomerRating />} />

        <Route path="/manager/dashboard" element={<BranchStatistic />} />
        <Route path="/manager/productlist" element={<ManagerProductList />} />
        <Route path="/manager/materiallist" element={<ManagerMaterialList />} />
        <Route path="/manager/stafflist" element={<ManagerStaffList />} />
        <Route path="/manager/table" element={<ManagerTableList />} />
        <Route path="/manager/customerlist" element={<ManagerCustomerList />} />
        <Route path="/manager/orderlist" element={<ManagerOrderList />} />
        <Route path="/manager/promote" element={<ManagerPromotion />} />
        <Route path="/manager/rating" element={<AdminCustomerRating />} />
        <Route path="/manager/info" element={<ManagerBranchInfo />} />

        <Route path="/staff/dashboard" element={<ManagerBranchInfo />} />
        <Route path="/staff/order/place-order" element={<AdminMenu />} />
        <Route path="/staff/order/choose-table" element={<TableOrder />} />
        <Route path="/staff/order/order-list" element={<OrderList />} />
        <Route path="/staff/customer-list" element={<CustomerList />} />
        <Route path="/staff/staff-list" element={<StaffList />} />
        <Route path="/staff/info" element={<StaffProfile />} />
      </Route>
      <Route path="/404" element={<h1>Page Not Found</h1>} />
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
};

export default MainRoutes;