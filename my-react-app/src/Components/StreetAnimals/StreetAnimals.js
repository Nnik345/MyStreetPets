import React, { useEffect, useState } from "react";
import { fetchAnimals } from "../../Utils/fetchStreetAnimals";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIconImg from "../../Assets/Map Marker/marker-icon.png";
import { useAuth } from "react-oidc-context";

// Helper function to calculate the distance between two points (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const StreetAnimals = () => {
  const [animals, setAnimals] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [species, setSpecies] = useState(""); // State to track selected species
  const [showFilters, setShowFilters] = useState(false); // Toggle filter section visibility
  const [selectedLocation, setSelectedLocation] = useState(null); // User-selected map location
  const [userLocation, setUserLocation] = useState(null); // User's geolocation
  const [radius, setRadius] = useState(5);

  const auth = useAuth();
  const isAdmin = auth.user?.profile?.["cognito:groups"]?.includes("Admin");

  const navigate = useNavigate();

  const customIcon = new L.Icon({
    iconUrl: markerIconImg, // Path to your custom image
    iconSize: [25, 25], // Size of the icon (adjust as needed)
    iconAnchor: [12, 41], // Point of the icon corresponding to the marker's location
    popupAnchor: [1, -34], // Adjust popup position if using popups
    shadowSize: [41, 41], // Size of the shadow (optional)
    shadowAnchor: [12, 41], // Anchor point of the shadow
  });

  useEffect(() => {
    // Fetch data on component mount
    const getAnimals = async () => {
      const data = await fetchAnimals();
      setAnimals(data);
      setFilteredAnimals(data); // Initialize filteredAnimals with all animals
    };
    getAnimals();
  }, []);

  useEffect(() => {
    // Ask for location permission and fetch user's geolocation
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.log("Error getting location: ", error.message);
          }
        );
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    };
    getUserLocation();
  }, []);

  useEffect(() => {
    // Apply species filter first
    let filtered = animals;

    if (species) {
      filtered = filtered.filter((animal) => animal.species === species);
    }

    // Location-based filtering
    const locationToUse = selectedLocation || userLocation; // Prioritize selectedLocation over userLocation
    if (locationToUse) {
      const { lat: userLat, lng: userLng } = locationToUse;
      filtered = filtered.filter((animal) => {
        const { lat, lng } = animal.coordinates || {};
        if (lat && lng) {
          const distance = calculateDistance(userLat, userLng, lat, lng);
          return distance <= radius; // Filter animals within 5 km
        }
        return false;
      });
    } else {
      // If no location is available, randomly pick 50 animals
      filtered = filtered.sort(() => Math.random() - 0.5).slice(0, 50);
    }

    setFilteredAnimals(filtered);
  }, [species, animals, userLocation, selectedLocation, radius]);

  const handleCardClick = (animal) => {
    navigate(`/streetAnimal/${animal._id}`, { state: { animal } });
  };

  const handleSpeciesChange = (e) => {
    setSpecies(e.target.value); // Update species state on dropdown change
  };

  // Custom Leaflet Map Component for selecting location
  const LocationSelector = () => {
    useMapEvents({
      click: (e) => {
        setSelectedLocation(e.latlng); // Update selected location when map is clicked
      },
    });

    return selectedLocation ? (
      <Marker position={selectedLocation} icon={customIcon}></Marker>
    ) : null;
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Street Animals</h2>

      {/* Filter Button */}
      <div className="d-flex justify-content-between mb-3">
        <button
          className="btn btn-primary"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>

        {isAdmin && (
          <button
            className="btn btn-success"
            onClick={() => navigate("/upload-adoption-animal")} // Navigate to Add Animal page
          >
            Add Animal
          </button>
        )}
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="mb-4">
          <label htmlFor="speciesSelect" className="form-label">
            Filter by Species
          </label>
          <select
            id="speciesSelect"
            className="form-select mb-3"
            value={species}
            onChange={handleSpeciesChange}
          >
            <option value="">All Species</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Bird">Bird</option>
            <option value="Other">Other</option>
          </select>

          {/* New filter for radius */}
          <label htmlFor="radiusSelect" className="form-label">
            Search Radius (in km)
          </label>
          <select
            id="radiusSelect"
            className="form-select mb-3"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
          >
            <option value={5}>5 km</option>
            <option value={10}>10 km</option>
            <option value={15}>15 km</option>
            <option value={20}>20 km</option>
          </select>

          <div>
            <h5>Select a location on the map:</h5>
            <MapContainer
              center={[20.5937, 78.9629]} // Default center is India
              zoom={5}
              style={{ height: "300px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationSelector />
            </MapContainer>
          </div>
        </div>
      )}

      {/* Animal Cards */}
      <div className="row g-3">
        {filteredAnimals.length > 0 ? (
          filteredAnimals.map((animal) => (
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
        ) : (
          <div className="col-12 text-center">
            <div className="alert alert-info" role="alert">
              No animals found for the selected filters.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StreetAnimals;
