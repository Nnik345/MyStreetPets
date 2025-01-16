import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import Header from "./Components/Header/Header"; // Import Header component
import Footer from "./Components/Footer/Footer"; // Import Footer component
import Home from "./Components/Home/Home"; // Import Home component
import StreetDogs from "./Components/StreetDogs/StreetDogs";
import AdoptionDogs from "./Components/AdoptionDogs/AdoptionDogs";

const App = () => {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header /> {/* Render the Header */}
        
        {/* Main content */}
        <div className="flex-grow-1">
          <Routes>
            {/* Homepage Route */}
            <Route path="/" element={<Home />} />
            <Route path="/street-dogs" element={<StreetDogs />} />
            <Route path="/adoption-dogs" element={<AdoptionDogs />} />
            {/* Add more routes here as you add pages */}
          </Routes>
        </div>

        <Footer /> {/* Render the Footer */}
      </div>
    </Router>
  );
};

export default App;
