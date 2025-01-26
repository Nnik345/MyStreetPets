import React, { useEffect, useState } from "react";
import { fetchAnimals } from "../../Utils/fetchStreetAnimals";
import { useNavigate } from "react-router-dom";
import L from "leaflet"; // For OpenStreetMap integration
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const StreetAnimals = () => {
  const [animals, setAnimals] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [species, setSpecies] = useState(""); // Species filter state
  const [location, setLocation] = useState(null); // User location
  const [isLocationAvailable, setIsLocationAvailable] = useState(false); // Location permission state
  const [mapVisible, setMapVisible] = useState(false); // Map visibility for manual location
  const [filterVisible, setFilterVisible] = useState(false); // Filter options visibility
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]); // Default map center (change as needed)
  const [mapMarker, setMapMarker] = useState([51.505, -0.09]); // Marker for selected location

  const navigate = useNavigate();

  useEffect(() => {
    const getAnimals = async () => {
      const data = await fetchAnimals();
      setAnimals(data);
      setFilteredAnimals(data); // Initially, show all animals
    };
    getAnimals();

    // Request location permission when the page loads
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
          setIsLocationAvailable(true);
          setMapCenter([latitude, longitude]);
          setMapMarker([latitude, longitude]);
          filterAnimalsByLocation(latitude, longitude);
        },
        () => {
          setMapVisible(true); // Show map if location is denied
        }
      );
    }
  }, []);

  const handleCardClick = (animal) => {
    navigate(`/streetAnimal/${animal._id}`, { state: { animal } });
  };

  const handleSpeciesChange = (e) => {
    const selectedSpecies = e.target.value;
    setSpecies(selectedSpecies);

    // Filter animals by species and location
    const filtered = animals.filter(
      (animal) =>
        (selectedSpecies === "" || animal.species === selectedSpecies) &&
        (isLocationAvailable
          ? isWithin1km(animal.coordinates, location)
          : true)
    );
    setFilteredAnimals(filtered);
  };

  const handleLocationPermission = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
          setIsLocationAvailable(true);
          filterAnimalsByLocation(latitude, longitude);
        },
        () => {
          setMapVisible(true); // Show map if location is denied
        }
      );
    }
  };

  const filterAnimalsByLocation = (latitude, longitude) => {
    const filtered = animals.filter((animal) =>
      isWithin1km(animal.coordinates, { lat: latitude, lon: longitude })
    );
    setFilteredAnimals(filtered);
  };

  const isWithin1km = (animalCoords, userCoords) => {
    const distance = calculateDistance(
      animalCoords.lat,
      animalCoords.lon,
      userCoords.lat,
      userCoords.lon
    );
    return distance <= 1; // 1km radius
  };

  // Haversine formula for calculating distance
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  const handleMapLocationSelection = (lat, lon) => {
    setLocation({ lat, lon });
    setMapMarker([lat, lon]);
    filterAnimalsByLocation(lat, lon);
    setMapVisible(false); // Hide the map after selection
  };

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        handleMapLocationSelection(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Street Animals</h2>

      {/* Filter Button */}
      <button
        className="btn btn-primary mb-3"
        onClick={() => setFilterVisible(!filterVisible)}
      >
        {filterVisible ? "Hide Filters" : "Show Filters"}
      </button>

      {/* Filter Options */}
      {filterVisible && (
        <div className="mb-3">
          <div className="mb-2">
            <label>Species</label>
            <select
              value={species}
              onChange={handleSpeciesChange}
              className="form-select"
            >
              <option value="">Select Species</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              {/* Add other species options here */}
            </select>
          </div>

          {!isLocationAvailable && !mapVisible && (
            <div className="mb-2">
              <button
                className="btn btn-secondary"
                onClick={handleLocationPermission}
              >
                Allow Location Access
              </button>
            </div>
          )}

          {mapVisible && (
            <div className="mb-2">
              <h5>Select your location on the map:</h5>
              <MapContainer center={mapCenter} zoom={13} style={{ height: "300px" }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapClickHandler />
                <Marker position={mapMarker}>
                  <Popup>Your selected location</Popup>
                </Marker>
              </MapContainer>
              <button
                className="btn btn-success mt-3"
                onClick={() => handleMapLocationSelection(mapMarker[0], mapMarker[1])}
              >
                Confirm Location
              </button>
            </div>
          )}
        </div>
      )}

      {/* Animal Cards */}
      <div className="row g-3">
        {filteredAnimals.length === 0
          ? animals.slice(0, 30).map((animal) => (
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
            ))
          : filteredAnimals.map((animal) => (
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
