import React from "react";
import { Button } from "reactstrap";
import "./Landing.css";
import heartIcon from '../../assets/heart-icon.png'; 
function Landing() {
  return (
    <div className="landing-container" id="home">
      <div
        className="heart-image"
        style={{ backgroundImage: `url(${heartIcon})` }}
      ></div>
      <div className="text-container">
        <h1>Save Life Donate Blood</h1>
        <p>
          Donate blood and be a real hero - a generosity act can save lives.
          Join a passionate team that makes a difference for centuries.
          Volunteer and inspire today with a simple, lifesaving act.
        </p>
        <Button color="danger" className="donate-button">
          Donate Now
        </Button>
      </div>
    </div>
  );
}

export default Landing;
