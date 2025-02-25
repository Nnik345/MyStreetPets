import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteStreetAnimal } from "../../Utils/deleteStreetAnimal"; // Import delete function
import { useAuth } from "react-oidc-context";

const DetailStreetAnimal = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { animal } = state;
  const auth = useAuth();
  const isAdmin = auth.user?.profile?.["cognito:groups"]?.includes("Admin");

  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!isAdmin) {
      alert("You are not authorized to delete this animal.");
      setShowModal(false);
      return;
    }

    setIsDeleting(true);
    const response = await deleteStreetAnimal(animal.image, animal._id);

    if (!response.error) {
      alert("Animal successfully deleted!");
      navigate("/street-animals");
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

          {/* Delete Button (Only for Admins) */}
          {isAdmin && (
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

      <div className="row mb-4">
        {/* Image Section */}
        <div className="col-md-6">
          <img
            src={animal.image}
            alt={animal.name}
            className="img-fluid"
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        </div>

        {/* Name and Address */}
        <div className="col-md-6 d-flex flex-column justify-content-center">
          <h2>{animal.name}</h2>
          <p>
            <strong>Gender:</strong> {animal.gender} <br />
            <strong>Address:</strong> {animal.address}
          </p>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <h5>Vaccination Status</h5>
          <p>{animal.vaccinationStatus ? "Vaccinated" : "Not Vaccinated"}</p>
        </div>

        <div className="col-12">
          <h5>Neuter Status</h5>
          <p>{animal.neuterStatus ? "Neutered" : "Not Neutered"}</p>
        </div>

        {/* Caretaker */}
        {animal.caretaker && (
          <div className="col-12">
            <h5>Caretaker</h5>
            <p>{animal.caretaker}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailStreetAnimal;
