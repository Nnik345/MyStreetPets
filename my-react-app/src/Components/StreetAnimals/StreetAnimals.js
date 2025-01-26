import React, { useEffect, useState } from "react";
import { fetchAnimals } from "../../Utils/fetchStreetAnimals";
import { useNavigate } from "react-router-dom";

const StreetAnimals = () => {
  const [animals, setAnimals] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data on component mount
    const getAnimals = async () => {
      const data = await fetchAnimals();
      setAnimals(data);
    };
    getAnimals();
  }, []);

  const handleCardClick = (animal) => {
    navigate(`/streetAnimal/${animal._id}`, { state: { animal } });
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center">Street Animals</h2>
      <div className="row g-3">
        {animals.map((animal) => (
          <div
            key={animal._id}
            className="col-sm-6 col-md-4 col-lg-3"
            onClick={() => handleCardClick(animal)}
            style={{ cursor: "pointer" }}
          >
            <div className="card">
              <img
                src={animal.image}
                alt={animal.name}
                className="card-img-top"
                style={{ objectFit: "cover", height: "200px" }}
              />
              <div className="card-body text-center">
                <h5 className="card-title">{animal.name}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StreetAnimals;

/*
  + Location as Coords
  + Caretaker

  - Age
  - Contact Details
*/