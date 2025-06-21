import { ToastContainer } from "react-toastify";
import MainRoutes from "./routes/MainRoutes";
import React from "react";
import { CartProvider } from "./hooks/cartContext";
export default function App() {
  return (
    <>
      <MainRoutes />;
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}