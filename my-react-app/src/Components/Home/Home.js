// src/Home.js
import React from "react";
import { Link } from "react-router-dom";
import Image1 from "../../Assets/Hero Slide/Slide 1.jpg";
import Image2 from "../../Assets/Hero Slide/Slide 2.jpg";
import Image3 from "../../Assets/Hero Slide/Slide 3.jpg";

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div id="heroSlider" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {/* Slide 1 */}
          <div className="carousel-item active">
            <img
              src={Image1}
              className="d-block w-100"
              alt="First Slide"
            />
            <div className="carousel-caption d-none d-md-block">
              <h5>Welcome to Our Website</h5>
              <p>Your perfect place to explore amazing things.</p>
            </div>
          </div>
          {/* Slide 2 */}
          <div className="carousel-item">
            <img
              src={Image2}
              className="d-block w-100"
              alt="Second Slide"
            />
            <div className="carousel-caption d-none d-md-block">
              <h5>Explore New Horizons</h5>
              <p>Discover the world like never before.</p>
            </div>
          </div>
          {/* Slide 3 */}
          <div className="carousel-item">
            <img
              src={Image3}
              className="d-block w-100"
              alt="Third Slide"
            />
            <div className="carousel-caption d-none d-md-block">
              <h5>Your Journey Starts Here</h5>
              <p>Begin your adventure with us today.</p>
            </div>
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#heroSlider"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#heroSlider"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* Additional content for the homepage */}
    </div>
  );
};

export default Home;
