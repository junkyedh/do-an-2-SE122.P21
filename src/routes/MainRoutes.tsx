import "@/App.scss";
import { Route, Routes, useLocation } from "react-router-dom";
import PageNotFound from "@/layouts/PageNotFound";

// Pages
import Login from "@/pages/Login/Login";
import Register from "@/pages/customer/Register/Register";
import Home from "@/pages/customer/Home/Home";
import About from "@/pages/customer/About/About";
import Contact from "@/pages/customer/Contact/Contact";
import Rooms from "@/pages/customer/Rooms/Rooms";
import RoomDetails from "@/pages/customer/Rooms/RoomDetails";
import Booking from "@/pages/customer/Booking/Booking";
import HistoryBooking from "@/pages/customer/HistoryBooking/HistoryBooking";
import Payment from "@/pages/customer/Payment/Payment";
import ProfileUser from "@/pages/brands/ProfileUser/ProfileUser";

import TableOrder from "@/pages/brands/TableOrder/TableOrder";
import CustomerList from "@/pages/brands/CustomerList/CustomerList";
import MaterialList from "@/pages/brands/MaterialList/MaterialList";
import ProductList from "@/pages/brands/ProductList/ProductList";
import StaffList from "@/pages/brands/StaffList/StaffList";
import Statistic from "@/pages/brands/Statistic/Statistic";


import { Rating } from "@mui/material";
import OrderList from "@/pages/brands/OrderList/OrderList";
import AdminStaffList from "@/pages/admin/AdminStaffList/AdminStaffList";
import AdminCustomerList from "@/pages/admin/AdminCustomerList/AdminCustomerList";
import AdminPromotion from "@/pages/admin/AdminPromotion/AdminPromotion";
import AdminOrderList from "@/pages/admin/AdminOrderList/AdminOrderList";
import AdminProductList from "@/pages/admin/AdminProduct/AdminProduct";
import Promote from "@/pages/brands/Promote/Promote";
import AdminBrandList from "@/pages/admin/AdminBrandList/AdminBrandList";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Layout from "@/layouts/Layout/Layout";

export default function MainRoutes() {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/admin/login";

  const isAdminPage = location.pathname.includes("admin");

  return (
    <>
      {/* Hiện Header/Footer ở các trang public */}
      {!isAuthPage && !isAdminPage && <Header />}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="about-us" element={<About />} />
        <Route path="contact-us" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Admin System routes */}
        <Route path="/admin" element={<Layout />}>
          <Route path="dashboard" element={<Statistic />} />
          <Route path="orderlist" element={<AdminOrderList />} />
          <Route path="stafflist" element={<AdminStaffList />} />
          <Route path="customerlist" element={<AdminCustomerList />} />
          <Route path="promote" element={<AdminPromotion />} />
          <Route path="productlist" element={<AdminProductList />} />
          <Route path="brandlist" element={<AdminBrandList />} />
          <Route path="rating" element={<Rating />} />
        </Route>

        {/* Admin Brand routes */}
        <Route path="admin/statistics" element={<Statistic />} />
        <Route path="admin/staff-list" element={<StaffList />} />
        <Route path="admin/customer-list" element={<CustomerList />} />
        <Route path="admin/product-list" element={<ProductList />} />
        <Route path="admin/material-list" element={<MaterialList />} />
        <Route path="admin/promotion" element={<Promote />} />
        <Route path="admin/order-list" element={<OrderList />} />

        {/* Staff Brand routes */}
        <Route path="staff/order/choose-table" element={<TableOrder />} />
        <Route path="staff/order/place-order" element={<OrderList />} />
        <Route path="staff/order/order-list" element={<OrderList />} />
        <Route path="staff/customer-list" element={<CustomerList />} />
        <Route path="staff/info" element={<ProfileUser />} />


        {/* Customer routes */}
        <Route path="rooms" element={<Rooms />} />
        <Route path="room/:id" element={<RoomDetails />} />
        <Route path="booking" element={<Booking />} />
        <Route path="history" element={<HistoryBooking />} />
        <Route path="payment" element={<Payment />} />
        <Route path="profile-user" element={<ProfileUser />} />


        <Route path="*" element={<PageNotFound />} />
      </Routes>

      {!isAuthPage && !isAdminPage && <Footer />}
    </>
  );
}
