import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-3 mt-5">
      <div className="container">
        <div className="row">
          {/* Contact Details on the Left */}
          <div className="col text-start">
            <p className="mb-1">📞 Phone: +91 9962221877</p>
            <p className="mb-0">✉️ Email: nikhilsivakumar123@gmail.com</p>
          </div>

          {/* Copyright and Additional Links in the Center */}
          {/*
          <div className="col text-center">
            <p className="mb-0">&copy; 2025 My Street Pets. All Rights Reserved.</p>
          </div>
          */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
