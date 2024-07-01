import React from "react";
import "./HowItWorks.css";
import LeafletHospitalMap from "../GoogleHospitalMap/LeafletHospitalMap";

const HowItWorks = () => {
  return (
    <div className="how-it-works" id="how-it-works">
      <h1 className="how-it-works-title">How It Works</h1>
      <div className="steps-container">
        <div className="step">
          <h2>1. Register</h2>
          <p>
            Sign up on our platform using your email and fill in your details.
          </p>
        </div>
        <div className="step">
          <h2>2. Check Eligibility</h2>
          <p>
            Answer a few questions to check if you are eligible to donate blood.
          </p>
        </div>
        <div className="step">
          <h2>3. Find a Hospital</h2>
          <p>
            Locate a nearby hospital or blood donation center to donate blood.
          </p>
        </div>
        <div className="step">
          <h2>4. Donate</h2>
          <p>Visit the hospital and donate blood to save lives.</p>
        </div>
      </div>
      <LeafletHospitalMap />
    </div>
  );
};

export default HowItWorks;
