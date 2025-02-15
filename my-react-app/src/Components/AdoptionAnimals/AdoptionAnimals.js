import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { fetchAnimals } from "../../Utils/fetchAdoptionAnimals";
import * as d3 from "d3";
import { useAuth } from "react-oidc-context";

const AdoptionAnimals = () => {
  const auth = useAuth();
  const isAdmin = auth.user?.profile?.["cognito:groups"]?.includes("Admin");
  const [isLoading, setIsLoading] = useState(true);

  const [animals, setAnimals] = useState([]);

  const [location, setLocation] = useState({
    country: "",
    state: "",
    city: "",
  });

  const [countryName, setCountryName] = useState("");
  const [stateName, setStateName] = useState("");
  const [cityName, setCityName] = useState("");

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [isGeoLoaded, setIsGeoLoaded] = useState(false); // Track geolocation loading

  const [species, setSpecies] = useState("");

  const [showFilters, setShowFilters] = useState(false);

  const countriesCsvPath =
    "https://my-street-pets.s3.ap-south-1.amazonaws.com/customDatabases/countries.csv";
  const statesCsvPath =
    "https://my-street-pets.s3.ap-south-1.amazonaws.com/customDatabases/states.csv";
  const citiesCsvPath =
    "https://my-street-pets.s3.ap-south-1.amazonaws.com/customDatabases/cities.csv";

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const getAnimals = async () => {
      setIsLoading(true); // Start loading
      const data = await fetchAnimals();
      setAnimals(data);
      setIsLoading(false); // Stop loading
    };
    getAnimals();
  }, []);

  useEffect(() => {
    const cachedCountry = localStorage.getItem("country"); // Default to India
    const cachedState = localStorage.getItem("state") || "";
    const cachedCity = localStorage.getItem("city") || "";

    setLocation({
      country: cachedCountry,
      state: cachedState,
      city: cachedCity,
    });
  }, []);

  const handleCardClick = (animal) => {
    navigate(`/adoptionAnimal/${animal._id}`, { state: { animal } }); // Navigate with state
  };

  useEffect(() => {
    if (!isGeoLoaded) {
      const cachedCountry = localStorage.getItem("country");
      const cachedState = localStorage.getItem("state");
      const cachedCity = localStorage.getItem("city");

      if (cachedCountry && cachedState && cachedCity) {
        // If cached data exists, set location from cache
        setLocation({
          country: cachedCountry,
          state: cachedState,
          city: cachedCity,
        });
        setIsGeoLoaded(true); // Mark geolocation as loaded
        return; // Skip fetching geolocation data
      }

      if (cachedCountry && cachedState) {
        // If country and state exist, update them and leave city empty
        setLocation({
          country: cachedCountry,
          state: cachedState,
          city: "",
        });
        setIsGeoLoaded(true);
        return; // Skip geolocation if country and state are cached
      }

      if (cachedCountry) {
        // If only country exists, update country and leave state and city empty
        setLocation({
          country: cachedCountry,
          state: "",
          city: "",
        });
        setIsGeoLoaded(true);
        return; // Skip geolocation if country is cached
      }

      if (location.country === "") {
        setLocation({
          country: "IN", // India country code
          state: "",
          city: "",
        });
      }

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            // Use reverse geocoding API to fetch location details
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();

            const detectedCountry = data.countryName;
            const detectedState = data.principalSubdivision;
            const detectedCity = data.city;

            const country = countries.find((c) => c.name === detectedCountry);
            const state = states.find(
              (s) => s.name === detectedState && s.country_code === country.iso2
            );
            const city = cities.find(
              (c) =>
                c.name === detectedCity &&
                c.country_code === country.iso2 &&
                c.state_code === state.state_code
            );

            const newLocation = {
              country: country ? country.iso2 : "",
              state: state ? state.state_code : "",
              city: city ? city.name : "",
            };

            setLocation({
              country: country ? country.iso2 : "",
              state: state ? state.state_code : "",
              city: city ? city.name : "",
            });

            localStorage.setItem("country", newLocation.country);
            localStorage.setItem("state", newLocation.state);
            localStorage.setItem("city", newLocation.city);

            setIsGeoLoaded(true);
          },
          () => {
            setIsGeoLoaded(true);
          }
        );
      }
    }
  }, [countries, states, cities, isGeoLoaded, location]);

  useEffect(() => {
    const loadCsvData = async () => {
      const countriesData = await d3.csv(countriesCsvPath);
      const filteredCountriesData = countriesData.filter(
        (row) => row.iso2 && row.name
      );
      setCountries(filteredCountriesData);

      const statesData = await d3.csv(statesCsvPath);
      const filteredStatesData = statesData.filter(
        (row) => row.name && row.state_code
      );
      setStates(filteredStatesData);

      const citiesData = await d3.csv(citiesCsvPath);
      setCities(citiesData);
    };
    loadCsvData();
  }, []);

  useEffect(() => {
    if (location.country) {
      const country = countries.find((c) => c.iso2 === location.country);
      setCountryName(country ? country.name : "");
    }
  }, [location.country, countries]);

  useEffect(() => {
    if (location.state) {
      const state = states.find((s) => s.state_code === location.state);
      setStateName(state ? state.name : "");
    }
  }, [location.state, states]);

  useEffect(() => {
    if (location.city) {
      setCityName(location.city);
    }
  }, [location.city, cities]);

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setLocation({ ...location, country: selectedCountry, state: "", city: "" });
    if (selectedCountry) {
      localStorage.setItem("country", selectedCountry);
    } else {
      localStorage.removeItem("country");
    }
    localStorage.removeItem("state");
    localStorage.removeItem("city");
  };

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setLocation({ ...location, state: selectedState, city: "" });
    if (selectedState) {
      localStorage.setItem("state", selectedState);
    } else {
      localStorage.removeItem("state", selectedState);
    }
    localStorage.removeItem("city");
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setLocation({ ...location, city: selectedCity });
    if (selectedCity) {
      localStorage.setItem("city", selectedCity);
    }
  };

  const filteredStates = states.filter(
    (state) => state.country_code === location.country
  );
  const filteredCities = cities.filter(
    (city) =>
      city.country_code === location.country &&
      city.state_code === location.state
  );

  if (isLoading) {
    return (
      <div className="text-center mt-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading animals...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center">Animals Up For Adoption</h2>
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

      {showFilters && (
        <div className="mb-4">
          <div className="row mb-3">
            <div className="col-md-4">
              <label htmlFor="countrySelect" className="form-label">
                Country
              </label>
              <select
                id="countrySelect"
                className="form-select"
                value={location.country}
                onChange={handleCountryChange}
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.iso2} value={country.iso2}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label htmlFor="stateSelect" className="form-label">
                State
              </label>
              <select
                id="stateSelect"
                className="form-select"
                value={location.state}
                onChange={handleStateChange}
                disabled={!location.country}
              >
                <option value="">Select State</option>
                {filteredStates.map((state) => (
                  <option key={state.state_code} value={state.state_code}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label htmlFor="citySelect" className="form-label">
                City
              </label>
              <select
                id="citySelect"
                className="form-select"
                value={location.city}
                onChange={handleCityChange}
                disabled={!location.state}
              >
                <option value="">Select City</option>
                {filteredCities.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {showFilters && (
        <div className="col-md-4 mb-4">
          <label htmlFor="speciesSelect" className="form-label">
            Species
          </label>
          <select
            id="speciesSelect"
            className="form-select"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
          >
            <option value="">All Species</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Bird">Bird</option>
            <option value="Other">Other</option>
          </select>
        </div>
      )}

      <div className="row g-3">
        {location.country === "" ? (
          <div className="col-12 text-center">
            <div className="alert alert-info" role="alert">
              Select Your Location
            </div>
          </div>
        ) : animals.filter(
            (animal) =>
              (animal.country === countryName || location.country === "") &&
              (animal.state === stateName || location.state === "") &&
              (animal.city === cityName ||
                location.city === "" ||
                (animal.state === stateName && cityName === "") ||
                (animal.country === countryName &&
                  cityName === "" &&
                  stateName === "")) &&
              (animal.species === species || species === "")
          ).length === 0 ? (
          <div className="col-12 text-center">
            <div className="alert alert-info" role="alert">
              No animals found for the selected filters.
            </div>
          </div>
        ) : (
          animals
            .filter(
              (animal) =>
                (animal.country === countryName || location.country === "") &&
                (animal.state === stateName || location.state === "") &&
                (animal.city === cityName ||
                  location.city === "" ||
                  (animal.state === stateName && cityName === "") ||
                  (animal.country === countryName &&
                    cityName === "" &&
                    stateName === "")) &&
                (animal.species === species || species === "")
            )
            .map((animal) => (
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
        )}
      </div>
    </div>
  );
};

export default AdoptionAnimals;
