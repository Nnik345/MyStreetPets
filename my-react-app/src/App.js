import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import Header from "./Components/Header/Header"; // Import Header component
import Footer from "./Components/Footer/Footer"; // Import Footer component
import Home from "./Components/Home/Home"; // Import Home component
import StreetAnimals from "./Components/StreetAnimals/StreetAnimals"; // Import StreetAnimals component
import AdoptionAnimals from "./Components/AdoptionAnimals/AdoptionAnimals"; // Import AdoptionAnimals component
import UploadAdoptionAnimal from "./Components/UploadAdoptionAnimal/UploadAdoptionAnimal";
import DetailAdoptionAnimal from "./Components/DetailAdoptionAnimal/DetailAdoptionAnimal"; // Import DetailAnimal component
import UploadStreetAnimal from "./Components/UploadStreetAnimal/UploadStreetAnimal";
import DetailStreetAnimal from "./Components/DetailStreetAnimal/DetailStreetAnimal";

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
            {/* Add Street Animals Page */}
            <Route path="/upload-street-animal" element={<UploadStreetAnimal/>} />
            {/* Detail Animal Page */}
            <Route path="/streetAnimal/:id" element={<DetailStreetAnimal />} />
            {/* Adoption Animals Page */}
            <Route path="/adoption-animals" element={<AdoptionAnimals />} />
            {/* Add Adoption Animals Page */}
            <Route path="/upload-adoption-animal" element={<UploadAdoptionAnimal/>} />
            {/* Detail Animal Page */}
            <Route path="/adoptionAnimal/:id" element={<DetailAdoptionAnimal />} />
          </Routes>
        </div>

        <Footer /> {/* Render the Footer */}
      </div>
    </Router>
  );
};

export default App;
