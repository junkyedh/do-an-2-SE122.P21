import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../pages/customer/Home/Home';
import About from '../pages/customer/About/About';
import Contact from '../pages/customer/Contact/Contact';
import Login from '../pages/customer/Home/Login/Login';
import AdminLogin from '../pages/AdminLogin/AdminLogin';
import { AppSystemProvider } from '../hooks/useSystemContext';
import ProtectedRoute from './ProtectedRoute';
import AdminLayout from '../layouts/Layout/AdminLayout';
import ManagerLayout from '../layouts/Layout/ManagerLayout';
import StaffLayout from '../layouts/Layout/StaffLayout';
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
const MainRoutes: React.FC = () => {
  return (
    <AppSystemProvider>
        <Routes>
          {/* Customer routes */}
          
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/menu" element={<Menu />} />

  {/* if (role === "ROLE_ADMIN"){
      routes = [
        {title: "THỐNG KÊ", link: "/admin/dashboard", icon: "fa-solid fa-chart-line", roles: ["ROLE_ADMIN"]},
        {title: "DANH SÁCH CHI NHÁNH", link: "/admin/branchlist", icon: "fa-solid fa-building", roles: ["ROLE_ADMIN"]},
        {title: "DANH SÁCH NGUYÊN LIỆU", link: "/admin/materiallist", icon: "fa-solid fa-boxes-stacked", roles: ["ROLE_ADMIN"]},
        {title: "DANH SÁCH SẢN PHẨM", link: "/admin/productlist", icon: "fa-solid fa-box", roles: ["ROLE_ADMIN"]},
        {title: "DANH SÁCH ĐƠN HÀNG", link: "/admin/orderlist", icon: "fa-solid fa-receipt", roles: ["ROLE_ADMIN"]},
        {title: "DANH SÁCH NHÂN VIÊN", link: "/admin/stafflist", icon: "fa-solid fa-users", roles: ["ROLE_ADMIN"]},
        {title: "DANH SÁCH KHÁCH HÀNG", link: "/admin/customerlist", icon: "fa-solid fa-user", roles: ["ROLE_ADMIN"]},
        {title: "DANH SÁCH KHUYẾN MÃI", link: "/admin/promote", icon: "fa-solid fa-ticket", roles: ["ROLE_ADMIN"]},
        {title: "ĐÁNH GIÁ", link: "/admin/rating", icon: "fa-solid fa-star", roles: ["ROLE_ADMIN"]},
      ];
    } else if (role === "ROLE_MANAGER") {
    routes = [
      { title: "Thống kê", link: "/manager/dashboard", icon: "fa-solid fa-chart-line", roles: ["ROLE_MANAGER"] },
      { title: "Nguyên liệu", link: "/manager/materiallist", icon: "fa-solid fa-boxes-stacked", roles: ["ROLE_MANAGER"] },
      { title: "Sản phẩm", link: "/manager/productlist", icon: "fa-solid fa-box", roles: ["ROLE_MANAGER"] },
      { title: "Đơn hàng", link: "/manager/orderlist", icon: "fa-solid fa-receipt", roles: ["ROLE_MANAGER"] },
      { title: "Nhân viên", link: "/manager/stafflist", icon: "fa-solid fa-users", roles: ["ROLE_MANAGER"] },
      { title: "Khách hàng", link: "/manager/customerlist", icon: "fa-solid fa-user", roles: ["ROLE_MANAGER"] },
      { title: "Khuyến mãi", link: "/manager/promote", icon: "fa-solid fa-ticket", roles: ["ROLE_MANAGER"] },
      { title: "Đánh giá", link: "/manager/rating", icon: "fa-solid fa-star", roles: ["ROLE_MANAGER"] },
      { title: "Thông tin quán", link: "/manager/info", icon: "fa-solid fa-building", roles: ["ROLE_MANAGER"] },
    ];
  } else if (role === "ROLE_STAFF") {
      routes = [
        {title: "ĐẶT HÀNG", link: "/staff/order", icon: "fa-solid fa-cart-plus", roles: ["ROLE_STAFF"], 
          children: [
            {title: "Chọn bàn", link: "choose-table", icon: "fa-solid fa-mug-saucer", roles: ["ROLE_STAFF"]},
            {title: "Gọi món", link: "place-order", icon: "fa-solid fa-cart-plus", roles: ["ROLE_STAFF"]},
            {title: "Danh sách đơn hàng", link: "order-list", icon: "fa-solid fa-receipt", roles: ["ROLE_STAFF"]},
        ]},
        {title: "Danh sách khách hàng", link: "/staff/customer-list", icon: "fa-solid fa-users", roles: ["ROLE_STAFF"]},
        {title: "Thông tin nhân viên", link: "/staff/info", icon: "fa-solid fa-user", roles: ["ROLE_STAFF"]},
      ];
    } else if (role === "ROLE_CUSTOMER") {
        routes = [
          { title: "Trang chủ", link: "/", icon: "fa-solid fa-house", roles: ["ROLE_CUSTOMER"] },
          { title: "Giới thiệu", link: "/about-us", icon: "fa-solid fa-circle-info", roles: ["ROLE_CUSTOMER"] },
          { title: "Liên hệ", link: "/contact-us", icon: "fa-solid fa-phone", roles: ["ROLE_CUSTOMER"] },
          { title: "Đặt phòng", link: "/booking", icon: "fa-solid fa-calendar", roles: ["ROLE_CUSTOMER"] },
          { title: "Lịch sử", link: "/history", icon: "fa-solid fa-clock-rotate-left", roles: ["ROLE_CUSTOMER"] },
          { title: "Thông tin cá nhân", link: "/profile-user", icon: "fa-solid fa-user", roles: ["ROLE_CUSTOMER"] },
        ];
      } */}

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Statistic />} />
            {/* Thêm các route cho Admin */}
            <Route path="branchlist" element={<AdminBranchList />} />
            <Route path="materiallist" element={<AdminMaterialList />} />
            <Route path="productlist" element={<AdminProductList />} />
            <Route path="orderlist" element={<AdminOrderList />} />
            <Route path="stafflist" element={<AdminStaffList />} />
            <Route path="customerlist" element={<AdminCustomerList />} />
            <Route path="promote" element={<AdminPromotion />} />
            <Route path="rating" element={<Rating />} />
          </Route>

          {/* Manager routes */}
          <Route
            path="/manager"
            element={
              <ProtectedRoute allowedRoles={['ROLE_MANAGER']}>
                <ManagerLayout />
              </ProtectedRoute>
            }
          >
            {/* Thêm các route cho Manager */}
            <Route path="dashboard" element={<Statistic />} />
            <Route path="materiallist" element={<AdminMaterialList />} />
            <Route path="productlist" element={<AdminProductList />} />
            <Route path="orderlist" element={<AdminOrderList />} />
            <Route path="stafflist" element={<AdminStaffList />} />
            <Route path="customerlist" element={<AdminCustomerList />} />
            <Route path="promote" element={<AdminPromotion />} />
            <Route path="rating" element={<Rating />} />
            <Route path="statistic" element={<Statistic />} />
          </Route>

          {/* Staff routes */}
          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRoles={['ROLE_STAFF']}>
                <StaffLayout />
              </ProtectedRoute>
            }
          >
            {/* Thêm các route cho Staff */}
            <Route path="order" element={<Statistic />} />
            <Route path="choose-table" element={<Statistic />} />
            <Route path="place-order" element={<Statistic />} />
            <Route path="order-list" element={<Statistic />} />
          </Route>

          {/* Authentication route */}
          <Route path="/admin-login" element={<AdminLogin />} />
        </Routes>
    </AppSystemProvider>
  );
};

export default MainRoutes;