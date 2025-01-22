import React, { useState } from 'react';
import { uploadAdoptionAnimal } from '../../Utils/uploadAdoptionAnimal';
import { uploadAdoptionAnimalMongo } from '../../Utils/uploadAdoptionAnimalToMongo.js';

const UploadAdoptionAnimal = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [species, setSpecies] = useState('');
  const [breed, setBreed] = useState('');
  const [regionCode, setRegionCode] = useState('+91');
  const [contact, setContact] = useState('');
  const [gender, setGender] = useState('');
  const [neuterStatus, setNeuterStatus] = useState('');
  const [vaccinationStatus, setVaccinationStatus] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false); // New loading state

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (name && image && breed && species && contact && gender && neuterStatus && vaccinationStatus && age && location) {
      setLoading(true); // Set loading to true when upload starts
      try {
        const imageurl = await uploadAdoptionAnimal(image);
        const animalData = {
          name,
          image: imageurl,
          species,
          breed,
          contactDetails: `${regionCode} ${contact}`,
          gender,
          neuterStatus: neuterStatus === 'true',
          vaccinationStatus: vaccinationStatus === 'true',
          age,
          location,
        };

        await uploadAdoptionAnimalMongo(animalData);
        alert('Animal uploaded successfully!');
      } catch (error) {
        console.error('Error uploading animal:', error);
        alert('Failed to upload animal. Please try again.');
      } finally {
        setLoading(false); // Reset loading state after upload is complete
      }
    } else {
      alert('Please fill out all fields.');
    }
  };

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
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-secondary opacity-50" style={{ zIndex: -1 }}></div>
      )}

      <div className="mb-3">
        <label htmlFor="name" className="form-label">Name:</label>
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
        <label htmlFor="image" className="form-label">Image:</label>
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
        <label htmlFor="species" className="form-label">Species:</label>
        <input
          type="text"
          className="form-control"
          id="species"
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          placeholder="Enter animal species"
          disabled={loading}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="breed" className="form-label">Breed:</label>
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
        <label htmlFor="contact" className="form-label">Contact Details:</label>
        <div className="d-flex">
          <select
            className="form-select me-2"
            style={{ width: 'auto' }}
            value={regionCode}
            onChange={(e) => setRegionCode(e.target.value)}
            disabled={loading}
          >
            <option value="+91">India (+91)</option>
            <option value="+1">USA (+1)</option>
            <option value="+44">UK (+44)</option>
            <option value="+61">Australia (+61)</option>
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
        <label htmlFor="age" className="form-label">Age:</label>
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
        <label htmlFor="location" className="form-label">Location (City):</label>
        <select
          className="form-select"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          disabled={loading}
        >
          <option value="">Select City</option>
          <option value="Chennai">Chennai</option>
          <option value="Madurai">Madurai</option>
          <option value="Salem">Salem</option>
        </select>
      </div>

      <button className="btn btn-primary w-100" onClick={handleUpload} disabled={loading}>
        Upload
      </button>
    </div>
  );
};

export default UploadAdoptionAnimal;
