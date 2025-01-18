import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import Header from "./Components/Header/Header"; // Import Header component
import Footer from "./Components/Footer/Footer"; // Import Footer component
import Home from "./Components/Home/Home"; // Import Home component
import StreetAnimals from "./Components/StreetAnimals/StreetAnimals"; // Import StreetAnimals component
import AdoptionAnimals from "./Components/AdoptionAnimals/AdoptionAnimals"; // Import AdoptionAnimals component
import DetailAnimal from "./Components/DetailAnimal/DetailAnimal"; // Import DetailAnimal component

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
            {/* Street Animals Page */}
            <Route path="/street-animals" element={<StreetAnimals />} />
            {/* Adoption Animals Page */}
            <Route path="/adoption-animals" element={<AdoptionAnimals />} />
            {/* Detail Animal Page */}
            <Route path="/animal/:id" element={<DetailAnimal />} />
          </Routes>
        </div>

        <Footer /> {/* Render the Footer */}
      </div>
    </Router>
  );
};

export default App;
