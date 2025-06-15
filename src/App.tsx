import { ToastContainer } from "react-toastify";
import MainRoutes from "./routes/MainRoutes";
import React from "react";
export default function App() {
  return <>
    <MainRoutes />;
    <ToastContainer position="bottom-right" autoClose={3000} />

  </>
}