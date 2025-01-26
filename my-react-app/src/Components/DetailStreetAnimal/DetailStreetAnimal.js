import React from "react";
import { useLocation } from "react-router-dom";

const DetailAdoptionAnimal = () => {
  const { state } = useLocation(); // Access route state
  const { animal } = state; // Destructure animal data

  // Generate the "About" section text

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

        {/* Name, and Address */}
        <div className="col-md-6 d-flex flex-column justify-content-center">
          <h2>{animal.name}</h2>
          <p>
            <strong>Gender:</strong> {animal.gender} <br />
            <strong>Address:</strong> {animal.address}
          </p>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <h5>Vaccination Status</h5>
          <p>{animal.vaccinationStatus ? "Vaccinated" : "Not Vaccinated"}</p>
        </div>

        <div className="col-12">
          <h5>Neuter Status</h5>
          <p>{animal.neuterStatus ? "Neutered" : "Not Neutered"}</p>
        </div>

        {/* Caretaker */}
        {animal.caretaker && (
          <div className="col-12">
            <h5>Caretaker</h5>
            <p>{animal.caretaker}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailAdoptionAnimal;
