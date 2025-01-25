import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { fetchAnimals } from "../../Utils/fetchAdoptionAnimals";
import * as d3 from "d3";

const AdoptionAnimals = () => {
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

  const countriesCsvPath = 'https://my-street-pets.s3.ap-south-1.amazonaws.com/customDatabases/countries.csv'
  const statesCsvPath = 'https://my-street-pets.s3.ap-south-1.amazonaws.com/customDatabases/states.csv';
  const citiesCsvPath = 'https://my-street-pets.s3.ap-south-1.amazonaws.com/customDatabases/cities.csv';
  
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

  useEffect(() => {
    if (!isGeoLoaded && "geolocation" in navigator) {
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

          const country = countries.find(c => c.name === detectedCountry);
          const state = states.find(s => s.name === detectedState && s.country_code === country.iso2)
          const city = cities.find(c => c.name === detectedCity && c.country_code === country.iso2 && c.state_code === state.state_code);

          setLocation({
            country: country ? country.iso2 : "",
            state: state ? state.state_code : "",
            city: city ? city.name : "",
          });
          setIsGeoLoaded(true);
        },
        () => {
          setIsGeoLoaded(true);
        }
      );
    }
  }, [countries, states, cities, isGeoLoaded]);

  useEffect(() => {
    const loadCsvData = async () => {
      const countriesData = await d3.csv(countriesCsvPath);
      const filteredCountriesData = countriesData.filter(
        (row) => row.iso2 && row.name
      );
      setCountries(filteredCountriesData);

      const statesData = await d3.csv(statesCsvPath)
      const filteredStatesData = statesData.filter(
        (row) => row.name && row.state_code
      )
      setStates(filteredStatesData);

      const citiesData = await d3.csv(citiesCsvPath);
      setCities(citiesData);
    };
    loadCsvData();
  }, []);

  useEffect(() => {
    if (location.country) {
      const country = countries.find(c => c.iso2 === location.country);
      setCountryName(country ? country.name : "");
    }
  }, [location.country, countries]);

  useEffect(() => {
    if (location.state) {
      const state = states.find(s => s.state_code === location.state);
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
  };

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setLocation({ ...location, state: selectedState, city: "" });
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setLocation({ ...location, city: selectedCity });
  };

  const filteredStates = states.filter(
    (state) => state.country_code === location.country
  );
  const filteredCities = cities.filter(
    (city) =>
      city.country_code === location.country &&
      city.state_code === location.state
  );

  return (
    <div className="container mt-4">
      <h2 className="text-center">Animals Up For Adoption</h2>
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
            <option value="">Select Species</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Bird">Bird</option>
            <option value="Other">Other</option>
          </select>
        </div>

      <div className="row g-3">
        {location.country === "" ? (
          <div className="col-12 text-center">
            <div className="alert alert-info" role="alert">
              Select Your Location
            </div>
          </div>
        ) : (animals.filter(animal => 
          (animal.country === countryName || location.country === "") &&
          (animal.state === stateName || location.state === "") &&
          (animal.city === cityName || location.city === "" ||
            (animal.state === stateName && cityName === "") || 
            (animal.country === countryName && cityName === "" && stateName === "")) &&
          (animal.species === species || species === ""))
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
        )))}
      </div>
    </div>
  );
};

export default AdoptionAnimals;
