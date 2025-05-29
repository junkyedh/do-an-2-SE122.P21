import Navbar from "@/layouts/Navbar/Navbar";
import { List } from "antd";
import { Link, Outlet } from 'react-router-dom';

const AdminPage = () => {
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <div style={{
          width: 250,
          boxShadow: '2px 0 5px rgba(0, 0, 0, 0.2)',
          position: 'relative',
          zIndex: 10
        }}>
          <Navbar />
        </div>
        <div style={{
          flex: 1, backgroundColor: '#fdfdfd',
        }}>
          <Outlet />
        </div>
      </div>
    </div >
  );
};

export default AdminPage;
