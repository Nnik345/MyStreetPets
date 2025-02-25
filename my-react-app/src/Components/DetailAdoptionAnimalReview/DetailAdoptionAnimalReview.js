import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteReviewAdoptionAnimal } from "../../Utils/deleteReviewAdoptionAnimal"; // Import delete function
import { useAuth } from "react-oidc-context";
import { uploadAdoptionAnimalToMongo } from "../../Utils/uploadAdoptionAnimalToMongo"; // Import approve function
import { deleteReviewAdoptionAnimalMongo } from "../../Utils/deleteReviewAdoptionAnimalMongo"; // Import delete function

const DetailAdoptionAnimalReview = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { animal } = state;
  const auth = useAuth();
  const isAdmin = auth.user?.profile?.["cognito:groups"]?.includes("Admin");

  const [showModal, setShowModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const response = await deleteReviewAdoptionAnimal(animal.image, animal._id);

    if (!response.error) {
      alert("Animal successfully deleted!");
      navigate("/approve-adoption-animals");
    } else {
      alert("Failed to delete the animal. Please try again.");
    }

    setIsDeleting(false);
    setShowModal(false);
  };

  const confirmApprove = async () => {
    setShowApproveModal(true);
    const response = await uploadAdoptionAnimalToMongo(animal);

    if (!response.error) {
      alert(`Animal has been approved!`);
      navigate("/approve-adoption-animals");
    } else {
      alert("Failed to approve the animal. Please try again.");
    }

    await deleteReviewAdoptionAnimalMongo(animal._id);

    setShowApproveModal(false);
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
    <div className="container mt-4">
      {/* Buttons Row - Back, Approve, and Delete */}
      <div className="row mb-3">
        <div className="col-12 d-flex justify-content-between">
          {/* Back Button */}
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            ← Back
          </button>

          <div>
            {/* Approve Button */}
            <button
              className="btn btn-success me-2"
              onClick={() => setShowApproveModal(true)}
            >
              Approve
            </button>

            {/* Delete Button */}
            <button
              className="btn btn-danger"
              onClick={() => setShowModal(true)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
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
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approve Confirmation Modal */}
      {showApproveModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Approval</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowApproveModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to approve {animal.name}?</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowApproveModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-success" onClick={confirmApprove}>
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for modals */}
      {(showModal || showApproveModal) && (
        <div className="modal-backdrop fade show"></div>
      )}

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

export default DetailAdoptionAnimalReview;
