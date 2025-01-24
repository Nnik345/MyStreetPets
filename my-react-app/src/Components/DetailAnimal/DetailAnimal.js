import React from "react";
import { useLocation } from "react-router-dom";

const DetailAnimal = () => {
  const { state } = useLocation(); // Access route state
  const { animal } = state; // Destructure animal data

  // Generate the "About" section text
  const aboutText = `
    Meet ${animal.name}, a beautiful ${animal.breed}. 
    ${animal.gender === "Male" ? "He" : "She"} is ${
    animal.vaccinationStatus ? "fully vaccinated" : "not yet vaccinated"
  } and ${
    animal.neuterStatus ? "neutered" : "not neutered"
  }. A perfect companion for a loving home!`;

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        {/* Image Section */}
        <div className="col-md-6">
          <img
            src={animal.image}
            alt={animal.name}
            className="img-fluid"
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        </div>

        {/* Name, Age, and Location */}
        <div className="col-md-6 d-flex flex-column justify-content-center">
          <h2>{animal.name}</h2>
          <p>
            <strong>Age:</strong> {animal.age} <br />
            <strong>Location:</strong> {`${animal.city}, ${animal.state}, ${animal.city}`}
          </p>
        </div>
      </div>

      <div className="row">
        {/* About Section */}
        <div className="col-12 mb-4">
          <h4>About {animal.name}</h4>
          <p>{aboutText}</p>
        </div>

        {/* Contact Details */}
        <div className="col-12">
          <h5>Contact Details</h5>
          <p>{animal.contactDetails}</p>
        </div>
      </div>
    </div>
  );
};

export default DetailAnimal;
