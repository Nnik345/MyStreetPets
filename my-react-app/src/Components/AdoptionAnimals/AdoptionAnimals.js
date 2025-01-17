import React, { useEffect, useState } from "react";
import { fetchAnimals } from "../../Utils/fetchAdoptionAnimals";

const AdoptionAnimals = () => {
  const [animals, setAnimals] = useState([]);

  useEffect(() => {
    // Fetch data on component mount
    const getAnimals = async () => {
      const data = await fetchAnimals();
      setAnimals(data);
    };
    getAnimals();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center">Animals Up For Adoption</h2>
      <div className="row g-3">
        {animals.map((animals) => (
          <div
            key={animals._id}
            className="col-sm-6 col-md-4 col-lg-3"
            onClick={() => alert(`You clicked on ${animals.name}`)}
            style={{ cursor: "pointer" }}
          >
            <div className="card">
              <img
                src={animals.image}
                alt={animals.name}
                className="card-img-top"
                style={{ objectFit: "cover", height: "200px" }}
              />
              <div className="card-body text-center">
                <h5 className="card-title">{animals.name}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdoptionAnimals;
