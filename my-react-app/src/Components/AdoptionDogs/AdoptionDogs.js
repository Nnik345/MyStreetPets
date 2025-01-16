import React, { useEffect, useState } from "react";
import { fetchDogs } from "../../Utils/fetchAdoptionDogs";

const StreetDogs = () => {
  const [dogs, setDogs] = useState([]);

  useEffect(() => {
    // Fetch data on component mount
    const getDogs = async () => {
      const data = await fetchDogs();
      setDogs(data);
    };
    getDogs();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center">Dogs Up For Adoption</h2>
      <div className="row g-3">
        {dogs.map((dog) => (
          <div
            key={dog.id}
            className="col-sm-6 col-md-4 col-lg-3"
            onClick={() => alert(`You clicked on ${dog.name}`)}
            style={{ cursor: "pointer" }}
          >
            <div className="card">
              <img
                src={dog.image}
                alt={dog.name}
                className="card-img-top"
                style={{ objectFit: "cover", height: "200px" }}
              />
              <div className="card-body text-center">
                <h5 className="card-title">{dog.name}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StreetDogs;
