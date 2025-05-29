import "@/App.scss";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "@/layouts/Header/Header";
import Footer from "@/layouts/Footer/Footer";
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
import Promote from "@/pages/brands/Promote/Promote";
import StaffList from "@/pages/brands/StaffList/StaffList";
import Statistic from "@/pages/brands/Statistic/Statistic";

import AdminPage from "@/pages/admin/Admin/admin";
import AdminBooking, { AdminOrderList } from "@/pages/admin/AdminOrderList/AdminOrderList";
import AdminPromote from "@/pages/admin/Promote/AdminPromote";
import AdminStaff from "@/pages/admin/Staff/AdminStaff";
import PaymentHistory from "@/pages/admin/PaymentHistory/PaymentHistory";
import { Rating } from "@mui/material";
import OrderList from "@/pages/brands/OrderList/OrderList";
import AdminStaffList from "@/pages/admin/AdminStaffList/AdminStaffList";
import AdminCustomerList from "@/pages/admin/AdminCustomerList/AdminCustomerList";

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

        {/* Customer routes */}
        <Route path="rooms" element={<Rooms />} />
        <Route path="room/:id" element={<RoomDetails />} />
        <Route path="booking" element={<Booking />} />
        <Route path="history" element={<HistoryBooking />} />
        <Route path="payment" element={<Payment />} />
        <Route path="profile-user" element={<ProfileUser />} />

        {/* Staff Brand routes */}
        <Route path="staff/order/choose-table" element={<TableOrder />} />
        <Route path="staff/order/place-order" element={<OrderList />} />
        <Route path="staff/order/order-list" element={<OrderList />} />
        <Route path="staff/customer-list" element={<CustomerList />} />
        <Route path="staff/info" element={<ProfileUser />} />

        {/* Admin Brand routes */}
        <Route path="admin/statistics" element={<Statistic />} />
        <Route path="admin/staff-list" element={<StaffList />} />
        <Route path="admin/customer-list" element={<CustomerList />} />
        <Route path="admin/product-list" element={<ProductList />} />
        <Route path="admin/material-list" element={<MaterialList />} />
        <Route path="admin/promote" element={<Promote />} />
        <Route path="admin/order-list" element={<OrderList />} />

        {/* Admin System routes */}
        <Route path="admin/login" element={<AdminPage />} />
        <Route path="admin/orderlist" element={<AdminOrderList />} />
        <Route path="admin/stafflist" element={<AdminStaffList />} />
        <Route path="admin/customerlist" element={<AdminCustomerList />} />
        <Route path="admin/rating" element={<Rating />} />
        <Route path="admin/paymenthistory" element={<PaymentHistory />} />

        <Route path="*" element={<PageNotFound />} />
      </Routes>

      {!isAuthPage && !isAdminPage && <Footer />}
    </>
  );
}
