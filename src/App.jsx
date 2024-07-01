import React, { useRef } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Components/Header/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import Landing from "./Components/Landing/Landing";
import Footer from "./Components/Footer/Footer";
import MyCarousel from "./Components/Carousel/MyCarousel";
import ContactForm from "./Components/ContactForm/ContactForm";
import Testimonials from "./Components/Testimonials/Testimonials";
import Signup from "./Components/SignUp/Signup";
import Login from "./Components/Login/Login";
import Hospitals from "./Components/Hospitals/Hospitals";
import UserDashboard from "./Components/Dash/UserDashboard";

function App() {
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);
  const isAuthenticated = true; 

  return (
    <Router>
      <div>
        <Header homeRef={homeRef} aboutRef={aboutRef} contactRef={contactRef} isAuthenticated={isAuthenticated} />
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/hospitals" element={<Hospitals />} />
          {isAuthenticated && <Route path="/dashboard" element={<UserDashboard />} />}
          <Route
            path="/"
            element={
              <>
                <Landing ref={homeRef} />
                <MyCarousel />
                <Testimonials ref={aboutRef} />
                <ContactForm ref={contactRef} />
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
