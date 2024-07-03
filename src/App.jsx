import React, { useRef } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Components/Header/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import Landing from "./Components/Landing/Landing";
import Footer from "./Components/Footer/Footer";
import MyCarousel from "./Components/Carousel/MyCarousel";
import Testimonials from "./Components/Testimonials/Testimonials";
import Signup from "./Components/SignUp/Signup";
import Login from "./Components/Login/Login";
import UserDashboard from "./Components/DashBoard/UserDashboard";
import HowItWorks from "./Components/HowItWorks/HowItWorks";
import LeafletHospitalMap from "./Components/GoogleHospitalMap/LeafletHospitalMap";
import Statistics from "./Components/Statistics/Statistics";
import DonationForm from "./Components/DonationForm/DonationForm";

function App() {
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);
  const isAuthenticated = true;

  return (
    <Router>
      <div>
        <Header isAuthenticated={isAuthenticated} />
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          {isAuthenticated && (
            <Route path="/dashboard" element={<UserDashboard />} />
          )}
          <Route
            path="/"
            element={
              <>
                <Landing />
                <MyCarousel />
                <Testimonials />
                <HowItWorks />
                <Statistics />
                <Footer />
              </>
            }
          />
          <Route path="/donation-form" element={<DonationForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
