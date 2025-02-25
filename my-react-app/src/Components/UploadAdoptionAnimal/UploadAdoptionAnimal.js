import React, { useState, useEffect } from "react";
import { csv } from "d3";
import { uploadAdoptionAnimal } from "../../Utils/uploadAdoptionAnimal";
import { uploadAdoptionAnimalMongo } from "../../Utils/uploadAdoptionAnimalToMongo.js";
import { uploadAdoptionAnimalForReview } from "../../Utils/uploadAdoptionAnimalForReview.js";
import { useAuth } from "react-oidc-context";
import { fetchAnimals } from "../../Utils/fetchAdoptionAnimals";
import { useNavigate } from "react-router-dom";

const UploadAdoptionAnimal = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [about, setAbout] = useState("");
  const [regionCode, setRegionCode] = useState("+91");
  const [contact, setContact] = useState("");
  const [gender, setGender] = useState("");
  const [regionCodes, setRegionCodes] = useState([]);
  const [neuterStatus, setNeuterStatus] = useState("");
  const [vaccinationStatus, setVaccinationStatus] = useState("");
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const countriesCsvPath =
    "https://my-street-pets.s3.ap-south-1.amazonaws.com/customDatabases/countries.csv";
  const statesCsvPath =
    "https://my-street-pets.s3.ap-south-1.amazonaws.com/customDatabases/states.csv";
  const citiesCsvPath =
    "https://my-street-pets.s3.ap-south-1.amazonaws.com/customDatabases/cities.csv";
  const countryCodesCsvPath =
    "https://my-street-pets.s3.ap-south-1.amazonaws.com/customDatabases/country-codes.csv";

  useEffect(() => {
    // Load and parse the country codes CSV
    const loadRegionCodes = async () => {
      try {
        const regionCodesData = await csv(countryCodesCsvPath);
        const filteredRegionCodes = regionCodesData.filter(
          (row) => row.Dial && row.official_name_en && row["ISO3166-1-Alpha-3"] // Filter out rows with empty values
        );
        setRegionCodes(
          filteredRegionCodes.map((row) => ({
            iso3: row["ISO3166-1-Alpha-3"],
            code: row.Dial,
            country: row.official_name_en,
          }))
        );
      } catch (error) {
        console.error("Error loading region codes:", error);
      }
    };
    loadRegionCodes();
  }, []);

  useEffect(() => {
    // Load and parse the countries.csv
    const loadCountries = async () => {
      try {
        const countriesData = await csv(countriesCsvPath);
        const filterCountries = countriesData.filter(
          (row) => row.iso2 && row.name
        );
        setCountries(
          filterCountries.map((country) => ({
            value: country.iso2,
            label: country.name,
          }))
        );
      } catch (error) {
        console.error("Error loading countries:", error);
      }
    };
    loadCountries();
  }, []);

  useEffect(() => {
    // Load and filter states.csv when the country changes
    const loadStates = async () => {
      if (country) {
        try {
          const statesData = await csv(statesCsvPath);
          const filteredStates = statesData.filter(
            (state) =>
              state.country_code === country && state.state_code && state.name
          );
          setStates(
            filteredStates.map((state) => ({
              value: state.state_code, // Use state_code here
              label: state.name,
            }))
          );
          setState(""); // Reset state and city
          setCity("");
          setCities([]);
        } catch (error) {
          console.error("Error loading states:", error);
        }
      }
    };
    loadStates();
  }, [country]);

  useEffect(() => {
    // Load and filter cities.csv when the state changes
    const loadCities = async () => {
      if (country && state) {
        try {
          const citiesData = await csv(citiesCsvPath);
          const filteredCities = citiesData.filter(
            (city) => city.country_code === country && city.state_code === state
          );
          setCities(
            filteredCities.map((city) => ({
              value: city.name,
              label: city.name,
            }))
          );
          setCity(""); // Reset city on state change
        } catch (error) {
          console.error("Error loading cities:", error);
        }
      }
    };
    loadCities();
  }, [country, state]);

  const auth = useAuth();
  const isAdmin = auth.user?.profile?.["cognito:groups"]?.includes("Admin");

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (auth.isAuthenticated) {
      console.log(auth);
      alert("Access not allowed. Please sign in to upload animals.");
      return;
    }

    if (
      name &&
      image &&
      breed &&
      species &&
      contact &&
      gender &&
      neuterStatus &&
      vaccinationStatus &&
      age &&
      country &&
      state &&
      city
    ) {
      setLoading(true); // Set loading to true when upload starts
      try {
        const imageurl = await uploadAdoptionAnimal(image);
        const selectedCountry = countries.find(
          (c) => c.value === country
        ).label;
        const selectedState = states.find((c) => c.value === state).label;
        const animalData = {
          name,
          image: imageurl,
          species,
          breed,
          about,
          contactDetails: `${regionCode} ${contact}`,
          gender,
          neuterStatus: neuterStatus === "true",
          vaccinationStatus: vaccinationStatus === "true",
          age,
          country: selectedCountry,
          state: selectedState,
          city,
          username: auth.user.username,
        };

        if (isAdmin) {
          const response = await uploadAdoptionAnimalMongo(animalData);
          const mongoId = response.insertedId;
          const data = await fetchAnimals();
          const animal = data.find((animal) => animal._id === mongoId);
          if (animal) {
            alert("Animal uploaded successfully! Navigating to details page");
            navigate(`/adoption-animal/${animal._id}`, {
              state: { animal },
            });
          } else {
            alert("Upload successful, could not navigate to the animal page.");
          }
        }
        else {
          await uploadAdoptionAnimalForReview(animalData);
          alert("Animal uploaded for review successfully!");
        }
      } catch (error) {
        console.error("Error uploading animal:", error);
        alert("Failed to upload animal. Please try again.");
      } finally {
        setLoading(false); // Reset loading state after upload is complete
      }
    } else {
      const missingFields = [];
      if (!name) missingFields.push("Name");
      if (!image) missingFields.push("Image");
      if (!breed) missingFields.push("Breed");
      if (!about) missingFields.push("About");
      if (!species) missingFields.push("Species");
      if (!contact) missingFields.push("Contact");
      if (!gender) missingFields.push("Gender");
      if (!neuterStatus) missingFields.push("Neuter Status");
      if (!vaccinationStatus) missingFields.push("Vaccination Status");
      if (!age) missingFields.push("Age");
      if (!country) missingFields.push("Country");
      if (!state) missingFields.push("State");
      if (!city) missingFields.push("City");

      alert(
        `Please fill out the following fields: ${missingFields.join(", ")}`
      );
    }
  };

  if (!auth.isAuthenticated) {
    return (
      <div className="container mt-5">
        <h2 className="text-center text-danger">Access Not Allowed</h2>
        <p className="text-center">Please sign in to access this page.</p>
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
          disabled={loading} // Disable inputs when uploading
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
          disabled={loading} // Disable inputs when uploading
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
        <label htmlFor="breed" className="form-label">
          Breed:
        </label>
        <input
          type="text"
          className="form-control"
          id="breed"
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
          placeholder="Enter animal breed"
          disabled={loading}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="about" className="form-label">
          About:
        </label>
        <textarea
          className="form-control"
          id="about"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          placeholder="Write something about the animal (e.g., temperament, behavior, special traits)"
          disabled={loading}
          rows={4}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="contact" className="form-label">
          Contact Details:
        </label>
        <div className="d-flex">
          <select
            className="form-select me-2"
            style={{ width: "20%" }}
            value={regionCode}
            onChange={(e) => setRegionCode(e.target.value)}
            disabled={loading}
          >
            {regionCodes.map((region) => (
              <option key={region.iso3} value={region.code}>
                {region.country} (+{region.code})
              </option>
            ))}
          </select>
          <input
            type="tel"
            className="form-control flex-grow-1"
            id="contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Enter phone number"
            disabled={loading}
          />
        </div>
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

      <div className="mb-3">
        <label htmlFor="age" className="form-label">
          Age:
        </label>
        <input
          type="text"
          className="form-control"
          id="age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Enter animal age (e.g., 2 years)"
          disabled={loading}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="country" className="form-label">
          Country:
        </label>
        <select
          className="form-select"
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="state" className="form-label">
          State:
        </label>
        <select
          className="form-select"
          id="state"
          value={state}
          onChange={(e) => setState(e.target.value)}
          disabled={!country}
        >
          <option value="">Select State</option>
          {states.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="city" className="form-label">
          City:
        </label>
        <select
          className="form-select"
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={!state}
        >
          <option value="">Select City</option>
          {cities.map((ci) => (
            <option key={ci.value} value={ci.value}>
              {ci.label}
            </option>
          ))}
        </select>
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

export default UploadAdoptionAnimal;
