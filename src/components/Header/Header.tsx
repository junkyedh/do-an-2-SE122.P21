import React, { useEffect, useState } from "react";
import {
  Container,
  Navbar,
  Offcanvas,
  Nav,
  NavDropdown,
} from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import "./Header.scss";
import { useSystemContext } from "@/hooks/useSystemContext";
import { MainApiRequest } from "@/services/MainApiRequest";
import CartDrawer from "../customer/CartDrawer/CartDrawer";

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { token, logout } = useSystemContext();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);

  const toggleMenu = () => setOpen(!open);
  const isSticky = (e: any) => {
    const header = document.querySelector('.header-section');
    if (!header) return;
    const scrollTop = window.scrollY;
    scrollTop >= 120 ? header.classList.add('is-sticky') : header.classList.remove('is-sticky');
  };

  // Sticky header
  useEffect(() => {
    window.addEventListener("scroll", isSticky);
    return () => {
      window.removeEventListener("scroll", isSticky);
    };

  }, []);

  const closeMenu = () => {
    if (window.innerWidth <= 991) {
      setOpen(false);
    }
  };
  
  const fetchUserInfo = async () => {
    try {
      const res = await MainApiRequest.get("/auth/callback", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserInfo(res.data.data); // Giả định API trả về thông tin người dùng
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      logout(); // Nếu có lỗi, đăng xuất người dùng
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  // Fetch user
  useEffect(() => {
    if (token) {
      fetchUserInfo();
    }
  }, [token]);

  const handleLogout = () => {
    // Clear token or any session-related info
    logout();  // Call logout function from context
    localStorage.removeItem("token");  // Remove token from localStorage
    navigate("/");  // Redirect to home page or login page
  };



  return (
    <header className="header-section d-flex align-items-center">
      <Container>
        <Navbar expand="lg" className="justify-content-between w-100">
          {/* Logo */}
          <Navbar.Brand className="logo">
            <NavLink to="/">Café w Fen</NavLink>
          </Navbar.Brand>

          {/* Toggle button (mobile) */}
          <button
            className="toggle-btn d-lg-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <i className={open ? "bi bi-x-lg" : "bi bi-list"} />
          </button>

          {/* Offcanvas slide-out menu (chỉ mobile) */}
          <Navbar.Offcanvas
            show={open}
            onHide={toggleMenu}
            className="offcanvas-menu-panel d-lg-none"
            placement="start"
            id="offcanvas-menu"
            backdrop={true}
          >
            <Offcanvas.Header className="offcanvas-menu-header">
              <Offcanvas.Title className="offcanvas-logo">
                <i className="bi bi-cup-hot-fill me-2"></i>
                Café w Fen
              </Offcanvas.Title>
              <button
                className="offcanvas-close-btn"
                onClick={toggleMenu}
                aria-label="Close menu"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </Offcanvas.Header>

            <Offcanvas.Body className="offcanvas-menu-body">
              <Nav className="offcanvas-nav-list">
                {[
                  { to: "/", icon: "house-door-fill", label: "Home" },
                  { to: "/about-us", icon: "info-circle-fill", label: "About Us" },
                  { to: "/menu", icon: "card-list", label: "Menu" },
                  { to: "/contact-us", icon: "envelope-fill", label: "Contact" },
                ].map(({ to, icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className="offcanvas-nav-item"
                    onClick={closeMenu}
                  >
                    <i className={`bi bi-${icon} offcanvas-nav-icon`}></i>
                    {label}
                  </NavLink>
                ))}
              </Nav>

              <div className="offcanvas-user-section mt-4">
                {userInfo ? (
                  <NavDropdown
                    title={<><i className="bi bi-person-circle me-2"></i>{userInfo.name}</>}
                    id="offcanvas-user-dropdown"
                    className="offcanvas-user-dropdown"
                  >
                    <NavDropdown.Item onClick={() => { closeMenu(); navigate("/profile-user"); }}>
                      <i className="bi bi-gear-fill me-2"></i> My Profile
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={() => { closeMenu(); navigate("/history"); }}>
                      <i className="bi bi-clock-history me-2"></i> My Orders
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={() => { handleLogout(); }}>
                      <i className="bi bi-box-arrow-right me-2"></i> Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <NavLink
                    to="/login"
                    className="offcanvas-login-btn d-block text-center"
                    onClick={closeMenu}
                  >
                    <i className="bi bi-box-arrow-in-right me-2"></i> Login
                  </NavLink>
                )}
              </div>

              <div className="offcanvas-cart-section mt-4">
                <CartDrawer/>
              </div>
            </Offcanvas.Body>
          </Navbar.Offcanvas>


          {/* Desktop nav + user + cart */}
          <div className=" right-column d-none d-lg-flex align-items-center">
            <Nav className="desktop-nav">
              <NavLink className="nav-link" to="/">
                HOME
              </NavLink>
              <NavLink className="nav-link" to="/about-us">
                ABOUT US
              </NavLink>
              <NavLink className="nav-link" to="/menu">
                MENU
              </NavLink>
              <NavLink className="nav-link" to="/contact-us">
                CONTACT
              </NavLink>
            <Nav>
              {userInfo ? (
                <NavDropdown
                  title={userInfo.name}
                  id="user-dropdown"
                  className="user-dropdown"
                >
                  <NavDropdown.Item onClick={() => navigate("/profile-user")}>
                    My Profile
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={() => navigate("/history")}>
                    My Orders
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <NavLink className="login-btn" to="/login">
                  Login
                </NavLink>
              )}
            </Nav>
            </Nav>

            <CartDrawer />

          </div>
        </Navbar>
      </Container>
    </header>
  );
};

export default Header;
