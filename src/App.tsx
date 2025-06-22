import { ToastContainer } from "react-toastify";
import MainRoutes from "./routes/MainRoutes";
import React from "react";
import { CartProvider } from "./hooks/cartContext";
import { ToastProvider } from "./components/littleComponent/Toast/Toast";
export default function App() {
  return (
    <>
      <MainRoutes />;
    </>
  );
}