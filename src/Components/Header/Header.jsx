import React, { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
} from "reactstrap";
import "./Header.css";
import logo from "../../assets/blood-donor-logo.png";
import { Link } from "react-scroll";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState("");
  const { isAuthenticated, logout } = useAuth();

  const toggle = () => setIsOpen(!isOpen);

  const handleSetActive = (link) => {
    setActiveLink(link);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/donation-history";
  const isRestrictedPage =
    location.pathname === "/dashboard" ||
    location.pathname === "/donation-form" ||
    location.pathname === "/timeslots";

  return (
    <div>
      <Navbar
        color="dark"
        dark
        expand="md"
        fixed="top"
        className="custom-navbar"
      >
        <NavbarBrand href="/">
          <img src={logo} className="blood-donor-logo" alt="Blood Donor Logo" />
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="/" className="nav-link">
                Home
              </NavLink>
            </NavItem>
            {isAuthenticated ? (
              <>
                <NavItem>
                  <NavLink href="/dashboard" className="nav-link">
                    Dashboard
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/donation-history" className="nav-link">
                    History
                  </NavLink>
                </NavItem>
                <NavItem>
                  <Button
                    color="danger"
                    className="nav-button mx-4 px-4"
                    onClick={handleLogout}
                  >
                    Log Out
                  </Button>
                </NavItem>
              </>
            ) : (
              !isRestrictedPage &&
              !isAuthPage && (
                <>
                  <NavItem>
                    <Link
                      to="about-us"
                      spy={true}
                      smooth={true}
                      offset={-70}
                      duration={500}
                      className={`nav-link ${
                        activeLink === "about-us" ? "active" : ""
                      }`}
                      onSetActive={() => handleSetActive("about-us")}
                    >
                      About Us
                    </Link>
                  </NavItem>
                  <NavItem>
                    <Link
                      to="how-it-works"
                      spy={true}
                      smooth={true}
                      offset={-70}
                      duration={500}
                      className={`nav-link ${
                        activeLink === "how-it-works" ? "active" : ""
                      }`}
                      onSetActive={() => handleSetActive("how-it-works")}
                    >
                      How It Works
                    </Link>
                  </NavItem>
                  <NavItem>
                    <Button
                      color="danger"
                      href="/signup"
                      className="nav-button mx-4 px-4"
                    >
                      Sign Up
                    </Button>
                  </NavItem>
                </>
              )
            )}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default Header;
