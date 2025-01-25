// src/Home.js
import React from "react";
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
            <img src={Image1} className="d-block w-100" alt="First Slide" />
            <div className="carousel-caption d-none d-md-block">
              <h5>Welcome to Our Website</h5>
              <p>Your perfect place to explore amazing things.</p>
            </div>
          </div>
          {/* Slide 2 */}
          <div className="carousel-item">
            <img src={Image2} className="d-block w-100" alt="Second Slide" />
            <div className="carousel-caption d-none d-md-block">
              <h5>Explore New Horizons</h5>
              <p>Discover the world like never before.</p>
            </div>
          </div>
          {/* Slide 3 */}
          <div className="carousel-item">
            <img src={Image3} className="d-block w-100" alt="Third Slide" />
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

      {/* About Us Section */}
      <div className="container mt-5">
        <div className="row">
          <div className="col-12">
            <h2 className="display-5 display-md-4 display-lg-3">About Us</h2>
            <p className="fs-5">
              Welcome to MyStreetPets, a platform dedicated to
              improving the lives of street animals. Our mission is twofold:
              helping animals find loving homes through adoption and connecting
              volunteers with street animals that need care, such as food and
              water.
            </p>
            <p className="fs-5">
              We showcase animals available for adoption, making it easy for
              you to find your perfect companion. Additionally, we highlight
              street animals that remain in their local areas and rely on the
              kindness of volunteers for their well-being.
            </p>
            <p className="fs-5">
              At MyStreetPets, we believe in creating a
              community that stands together to provide love, care, and support
              to animals in need. Whether you’re looking to adopt or simply lend
              a helping hand, you can make a difference with us—one act of
              kindness at a time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
