import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import logo from "../../Assets/Logo/Logo.jpg";

const Header = () => {
  return (
    <header className="bg-dark text-white pt-0">
      <div className="container-fluid">
        <div className="row align-items-center w-100">
          <div className="col-auto p-0">
            <img
              src={logo}
              alt="Logo"
              className="rounded-circle"
              style={{ height: "50px", objectFit: "contain" }}
            />
          </div>
          <div className="col text-center">
            <h1>My Street Pets</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <nav>
              <ul className="nav d-flex justify-content-between">
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="#">About</a>
                </li>
                <li className="nav-item">
                <Link className="nav-link text-white" to="/street-dogs">Street Dogs</Link>
                </li>
                <li className="nav-item">
                <Link className="nav-link text-white" to="/adoption-dogs">Adoption</Link>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="#">Contact</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
