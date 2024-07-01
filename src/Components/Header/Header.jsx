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
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function Header({ homeRef, aboutRef, contactRef }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(true); 

  const toggle = () => setIsOpen(!isOpen);

  const handleSetActive = (link) => {
    setActiveLink(link);
  };

  const handleNavigateAndScroll = () => {
    navigate("/");
  };

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/SignUp";

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
          <img src={logo} className="blood-donor-logo" />
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <Link
                to="home"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                className={`nav-link ${activeLink === "home" ? "active" : ""}`}
                onSetActive={() => handleSetActive("home")}
                onClick={() => handleNavigateAndScroll(homeRef)}
              >
                Home
              </Link>
            </NavItem>
            {!isAuthPage && (
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
              </>
            )}

            <NavItem>
              <NavLink href="/hospitals" className="nav-link">
                Hospitals
              </NavLink>
            </NavItem>
            {!isAuthPage && (
              <NavItem>
                <Link
                  to="contact-us"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  className={`nav-link ${
                    activeLink === "contact-us" ? "active" : ""
                  }`}
                  onSetActive={() => handleSetActive("contact-us")}
                  onClick={() => handleNavigateAndScroll(contactRef)}
                >
                  Contact Us
                </Link>
              </NavItem>
            )}
            {isAuthenticated && (
              <NavItem>
                <NavLink href="/dashboard" className="nav-link">
                  User Dashboard
                </NavLink>
              </NavItem>
            )}
            <NavItem>
              <Button
                color="danger"
                href="/SignUp"
                className="nav-button mx-4 px-4"
              >
                Sign Up
              </Button>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default Header;
