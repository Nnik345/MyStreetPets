import React, { useState } from "react";
import { uploadStreetAnimal } from "../../Utils/uploadStreetAnimal";
import { uploadStreetAnimalMongo } from "../../Utils/uploadStreetAnimalToMongo.js";
import { useAuth } from "react-oidc-context";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIconImg from "../../Assets/Map Marker/marker-icon.png";

const UploadStreetAnimal = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [species, setSpecies] = useState("");
  const [caretaker, setCaretaker] = useState("");
  const [gender, setGender] = useState("");
  const [neuterStatus, setNeuterStatus] = useState("");
  const [vaccinationStatus, setVaccinationStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [address, setAddress] = useState("");

  const customMarkerIcon = L.icon({
    iconUrl: markerIconImg, // Path to your custom image
    iconSize: [25, 25], // Size of the icon (adjust as needed)
    iconAnchor: [12, 41], // Point of the icon corresponding to the marker's location
    popupAnchor: [1, -34], // Adjust popup position if using popups
    shadowSize: [41, 41], // Size of the shadow (optional)
    shadowAnchor: [12, 41], // Anchor point of the shadow
  });

  const auth = useAuth();
  const isAdmin = auth.user?.profile?.["cognito:groups"]?.includes("Admin");

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const LocationPicker = ({ setCoordinates }) => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setCoordinates({ lat, lng });
      },
    });
    return null;
  };

  const handleUpload = async () => {
    if (!isAdmin) {
      alert("Access not allowed. Only Admin users can upload animals.");
      return;
    }

    if (
      name &&
      image &&
      species &&
      gender &&
      neuterStatus &&
      vaccinationStatus &&
      address &&
      coordinates
    ) {
      setLoading(true);

      try {
        const imageurl = await uploadStreetAnimal(image);

        const animalData = {
          name,
          image: imageurl,
          species,
          caretaker,
          gender,
          neuterStatus: neuterStatus === "true",
          vaccinationStatus: vaccinationStatus === "true",
          address,
          coordinates,
        };

        console.log(animalData);

        await uploadStreetAnimalMongo(animalData);
        alert("Animal uploaded successfully!");
      } catch (error) {
        console.error("Error uploading animal:", error);
        alert("Failed to upload animal. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      const missingFields = [];
      if (!name) missingFields.push("Name");
      if (!image) missingFields.push("Image");
      if (!species) missingFields.push("Species");
      if (!gender) missingFields.push("Gender");
      if (!neuterStatus) missingFields.push("Neuter Status");
      if (!vaccinationStatus) missingFields.push("Vaccination Status");
      if (!address) missingFields.push("Address");
      if (!coordinates) missingFields.push("Location");

      alert(
        `Please fill out the following fields: ${missingFields.join(", ")}`
      );
    }
  };

  if (!isAdmin) {
    return (
      <div className="container mt-5">
        <h2 className="text-center text-danger">Access Not Allowed</h2>
        <p className="text-center">You must be an Admin to access this page.</p>
      </div>
    );
  }

  return (
    <div className="container mt-5 position-relative">
      <h2 className="text-center mb-4">Upload New Animal</h2>

      {/* Loading Circle */}
      {loading && (
        <div className="position-absolute top-50 start-50 translate-middle d-flex align-items-center justify-content-center">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      )}

      {/* Backdrop for grayed-out effect */}
      {loading && (
        <div
          className="position-absolute top-0 start-0 w-100 h-100 bg-secondary opacity-50"
          style={{ zIndex: -1 }}
        ></div>
      )}

      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Name:
        </label>
        <input
          type="text"
          className="form-control"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter animal name"
          disabled={loading}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="image" className="form-label">
          Image:
        </label>
        <input
          type="file"
          className="form-control"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
          disabled={loading}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="species" className="form-label">
          Species:
        </label>
        <select
          className="form-select"
          id="species"
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          disabled={loading}
        >
          <option value="">Select a species</option>
          <option value="Dog">Dog</option>
          <option value="Cat">Cat</option>
          <option value="Bird">Bird</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Gender:</label>
        <select
          className="form-select"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          disabled={loading}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="caretaker" className="form-label">
          Caretaker:
        </label>
        <input
          type="text"
          className="form-control"
          id="caretaker"
          value={caretaker}
          onChange={(e) => setCaretaker(e.target.value)}
          placeholder="Enter animal caretaker (Leave empty if not available)"
          disabled={loading}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Neuter Status:</label>
        <select
          className="form-select"
          value={neuterStatus}
          onChange={(e) => setNeuterStatus(e.target.value)}
          disabled={loading}
        >
          <option value="">Select Neuter Status</option>
          <option value="true">Neutered</option>
          <option value="false">Not Neutered</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Vaccination Status:</label>
        <select
          className="form-select"
          value={vaccinationStatus}
          onChange={(e) => setVaccinationStatus(e.target.value)}
          disabled={loading}
        >
          <option value="">Select Vaccination Status</option>
          <option value="true">Vaccinated</option>
          <option value="false">Not Vaccinated</option>
        </select>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-12">
            {/* Address Input */}
            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                Address:
              </label>
              <input
                type="text"
                className="form-control"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter address"
                disabled={loading}
              />
            </div>

            {/* Map for Location Selection */}
            <div className="mb-3">
              <label className="form-label">Select Location on Map:</label>
              <div
                className="border rounded"
                style={{ height: "300px", overflow: "hidden" }}
              >
                <MapContainer
                  center={
                    coordinates.lat
                      ? [coordinates.lat, coordinates.lng]
                      : [20.5937, 78.9629]
                  } // Default center
                  zoom={coordinates.lat ? 15 : 5} // Zoom in when coordinates are selected
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href='https://osm.org/copyright'>OpenStreetMap</a> contributors"
                  />
                  <LocationPicker setCoordinates={setCoordinates} />
                  {coordinates.lat && coordinates.lng && (
                    <Marker
                      position={[coordinates.lat, coordinates.lng]}
                      icon={customMarkerIcon}
                    />
                  )}
                </MapContainer>
              </div>
              <div className="mt-2">
                {coordinates.lat && coordinates.lng ? (
                  <small className="text-success">Location Selected</small>
                ) : (
                  <small className="text-danger">
                    Please select a location on the map.
                  </small>
                )}
              </div>
              <button
                className="btn btn-outline-secondary mt-2"
                onClick={() => setCoordinates({ lat: null, lng: null })}
                disabled={loading}
              >
                Reset Location
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        className="btn btn-primary w-100"
        onClick={handleUpload}
        disabled={loading}
      >
        Upload
      </button>
    </div>
  );
};

export default UploadStreetAnimal;
