import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteReviewAdoptionAnimal } from "../../Utils/deleteReviewAdoptionAnimal";
import { useAuth } from "react-oidc-context";
import { uploadAdoptionAnimalMongo } from "../../Utils/uploadAdoptionAnimalToMongo";
import { deleteReviewAdoptionAnimalMongo } from "../../Utils/deleteReviewAdoptionAnimalMongo";

const DetailAdoptionAnimalReview = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { animal } = state;
  const auth = useAuth();
  const isAdmin = auth.user?.profile?.["cognito:groups"]?.includes("Admin");

  const [showModal, setShowModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

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
    setIsApproving(true);
    const animalData = {
      name: animal.name,
      image: animal.image,
      species: animal.species,
      breed: animal.breed,
      about: animal.about,
      contactDetails: animal.contactDetails,
      gender: animal.gender,
      neuterStatus: animal.neuterStatus,
      vaccinationStatus: animal.vaccinationStatus,
      age: animal.age,
      country: animal.country,
      state: animal.state,
      city: animal.city,
      username: auth.user.username,
    };
    const response = await uploadAdoptionAnimalMongo(animalData);

    await deleteReviewAdoptionAnimalMongo(animal._id);

    if (!response.error) {
      alert(`Animal has been approved!`);
      navigate("/approve-adoption-animals");
    } else {
      alert("Failed to approve the animal. Please try again.");
    }

    setIsApproving(false);
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
      {/* Buttons Row */}
      <div className="row mb-3">
        <div className="col-12 d-flex justify-content-between">
          <button className="btn btn-secondary" onClick={() => navigate(-1)} disabled={isDeleting || isApproving}>
            ← Back
          </button>

          <div>
            <button
              className="btn btn-success me-2"
              onClick={() => setShowApproveModal(true)}
              disabled={isDeleting || isApproving}
            >
              {isApproving ? <span className="spinner-border spinner-border-sm"></span> : "Approve"}
            </button>

            <button
              className="btn btn-danger"
              onClick={() => setShowModal(true)}
              disabled={isDeleting || isApproving}
            >
              {isDeleting ? <span className="spinner-border spinner-border-sm"></span> : "Delete"}
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
                  disabled={isApproving}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to approve {animal.name}?</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowApproveModal(false)}
                  disabled={isApproving}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  onClick={confirmApprove}
                  disabled={isApproving}
                >
                  {isApproving ? (
                    <>
                      <span className="spinner-border spinner-border-sm"></span> Approving...
                    </>
                  ) : (
                    "Approve"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay */}
      {(showModal || showApproveModal) && <div className="modal-backdrop fade show"></div>}

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
    </div>
  );
};

export default DetailAdoptionAnimalReview;
