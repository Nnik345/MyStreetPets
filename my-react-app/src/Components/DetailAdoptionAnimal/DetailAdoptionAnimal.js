import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteAdoptionAnimal } from "../../Utils/deleteAdoptionAnimal"; // Import delete function
import { useAuth } from "react-oidc-context";

const DetailAdoptionAnimal = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { animal } = state;
  const auth = useAuth();
  const isAdmin = auth.user?.profile?.["cognito:groups"]?.includes("Admin");

  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!isAdmin && auth.user.username !== animal.username) {
      alert("You are not authorized to delete this animal.");
      setShowModal(false);
      return;
    }

    setIsDeleting(true);
    const response = await deleteAdoptionAnimal(animal.image, animal._id);

    if (!response.error) {
      alert("Animal successfully deleted!");
      navigate("/adoption-animals");
    } else {
      alert("Failed to delete the animal. Please try again.");
    }

    setIsDeleting(false);
    setShowModal(false);
  };

  return (
    <div className="container mt-4">
      {/* Buttons Row - Back and Delete */}
      <div className="row mb-3">
        <div className="col-12 d-flex justify-content-between">
          {/* Back Button */}
          <button
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
            disabled={isDeleting}
          >
            ← Back
          </button>

          {/* Delete Button */}
          {(isAdmin || animal.username === auth.user.username) && (
            <button
              className="btn btn-danger"
              onClick={() => setShowModal(true)}
              disabled={isDeleting}
            >
              {isDeleting ? <span className="spinner-border spinner-border-sm"></span> : "Delete"}
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  disabled={isDeleting}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete {animal.name}?</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <span className="spinner-border spinner-border-sm"></span> Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for modal */}
      {showModal && <div className="modal-backdrop fade show"></div>}

      {/* Animal Details */}
      <div className="row mb-4">
        <div className="col-md-6">
          <img
            src={animal.image}
            alt={animal.name}
            className="img-fluid"
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        </div>
        <div className="col-md-6 d-flex flex-column justify-content-center">
          <h2>{animal.name}</h2>
          <p>
            <strong>Age:</strong> {animal.age} <br />
            <strong>Gender:</strong> {animal.gender} <br />
            <strong>Location:</strong>{" "}
            {`${animal.city}, ${animal.state}, ${animal.country}`}
          </p>
        </div>
      </div>

      <div className="row">
        <div className="col-12 mb-4">
          <h4>About {animal.name}</h4>
          <p style={{ whiteSpace: "pre-line" }}>{animal.about}</p>
        </div>
        <div className="col-12">
          <h5>Vaccination Status</h5>
          <p>{animal.vaccinationStatus ? "Vaccinated" : "Not Vaccinated"}</p>
        </div>
        <div className="col-12">
          <h5>Neuter Status</h5>
          <p>{animal.neuterStatus ? "Neutered" : "Not Neutered"}</p>
        </div>
        <div className="col-12">
          <h5>Contact Details</h5>
          <p>{animal.contactDetails}</p>
        </div>
      </div>
    </div>
  );
};

export default DetailAdoptionAnimal;
