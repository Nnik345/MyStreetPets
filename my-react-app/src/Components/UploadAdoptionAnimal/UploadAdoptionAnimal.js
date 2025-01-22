import React, { useState } from 'react';
import { uploadAdoptionAnimal } from '../../Utils/uploadAdoptionAnimal'; // Importing the uploadImage function

const UploadAdoptionAnimal = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = () => {
    if (name && image) {
      uploadAdoptionAnimal(image); // Call the uploadImage function with name and image
    } else {
      alert('Please provide both a name and an image.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Upload New Animal</h2>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">Name:</label>
        <input
          type="text"
          className="form-control"
          id="name"
          value={name}
          onChange={handleNameChange}
          placeholder="Enter animal name"
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
        />
      </div>
      <button className="btn btn-primary w-100" onClick={handleUpload}>
        Upload
      </button>
    </div>
  );
};

export default UploadAdoptionAnimal;
