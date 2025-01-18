import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { fetchAnimals } from "../../Utils/fetchAdoptionAnimals";

const AdoptionAnimals = () => {
  const [animals, setAnimals] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Fetch data on component mount
    const getAnimals = async () => {
      const data = await fetchAnimals();
      setAnimals(data);
    };
    getAnimals();
  }, []);

  const handleCardClick = (animal) => {
    navigate(`/animal/${animal._id}`, { state: { animal } }); // Navigate with state
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Animals Up For Adoption</h2>
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

export default AdoptionAnimals;
