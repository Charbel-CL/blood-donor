import React from "react";
import "./Footer.css";
import { Link } from "react-scroll";

function Footer() {
  return (
    <footer className="custom-footer">
      <div className="footer-container">
        <h1 className="footer-title py-3 text-3xl font-bold">Blood Donor</h1>
        <div className="footer-links">
          <Link to="home" spy={true} smooth={true} offset={-70} duration={500}>
            Home
          </Link>
          <Link
            to="about-us"
            spy={true}
            smooth={true}
            offset={-70}
            duration={500}
          >
            About Us
          </Link>
          <Link
            to="contact-us"
            spy={true}
            smooth={true}
            offset={-70}
            duration={500}
          >
            Contact Us
          </Link>
        </div>
        <div className="footer-copy">
          © {new Date().getFullYear()} Blood Donor. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
