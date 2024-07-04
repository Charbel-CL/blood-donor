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
import Statistics from "./Components/Statistics/Statistics";
import DonationForm from "./Components/DonationForm/DonationForm";
import TimeSlotSelection from "./Components/TimeSlotSelection/TimeSlotSelection";
import DonationHistory from "./Components/DonationHistory/DonationHistory";
import AdminPage from "./Components/Admin/AdminPage";
import { AuthProvider } from "./Context/AuthContext";

function App() {
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  return (
    <AuthProvider> 
      <Router>
        <div>
          <Header />
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<UserDashboard />} />
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
            <Route path="/timeslots" element={<TimeSlotSelection />} />
            <Route path="/donation-history" element={<DonationHistory />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
