"use client";

import { updateDoctorStatus } from "@/actions/admin";
import useFetch from "@/hooks/use-fetch";
import { format } from "date-fns";
import { useEffect, useState } from "react";

export function PendingDoctors({ doctors }) {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Custom hook for approve/reject server action
  const {
    loading,
    data,
    fn: submitStatusUpdate,
  } = useFetch(updateDoctorStatus);

  // Open doctor details dialog
  const handleViewDetails = (doctor) => {
    setSelectedDoctor(doctor);
  };

  // Close doctor details dialog
  const handleCloseDialog = () => {
    setSelectedDoctor(null);
  };

  // Handle approve or reject doctor
  const handleUpdateStatus = async (doctorId, status) => {
    if (loading) return;

    const formData = new FormData();
    formData.append("doctorId", doctorId);
    formData.append("status", status);

    await submitStatusUpdate(formData);
  };

  useEffect(() => {
    if (data && data?.success) {
      handleCloseDialog();
    }
  }, [data]);

  return (
<div>
  <h2>Pending Doctor Verifications</h2>
  <p>Review and approve doctor applications</p>

  {doctors.length === 0 ? (
    <p>No pending verification requests.</p>
  ) : (
    <ul>
      {doctors.map((doctor) => (
        <li key={doctor.id}>
          <strong>{doctor.name}</strong>
          <p>
            {doctor.specialty} — {doctor.experience} years experience
          </p>

          <span>Status: Pending</span>

          <br />

          <button onClick={() => handleViewDetails(doctor)}>
            View Details
          </button>
        </li>
      ))}
    </ul>
  )}

  {/* DOCTOR DETAILS */}
  {selectedDoctor && (
    <div>
      <h3>Doctor Verification Details</h3>
      <p>Please review the information before making a decision.</p>

      <h4>Basic Information</h4>
      <p><strong>Name:</strong> {selectedDoctor.name}</p>
      <p><strong>Email:</strong> {selectedDoctor.email}</p>
      <p>
        <strong>Application Date:</strong>{" "}
        {format(new Date(selectedDoctor.createdAt), "PPP")}
      </p>

      <h4>Professional Information</h4>
      <p><strong>Specialty:</strong> {selectedDoctor.specialty}</p>
      <p>
        <strong>Experience:</strong> {selectedDoctor.experience} years
      </p>

      <p>
        <strong>Credentials:</strong>{" "}
        <a
          href={selectedDoctor.credentialUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Credentials
        </a>
      </p>

      <h4>Service Description</h4>
      <p>{selectedDoctor.description}</p>

      {loading && <p>Processing...</p>}

      <div>
        <button
          onClick={() =>
            handleUpdateStatus(selectedDoctor.id, "REJECTED")
          }
          disabled={loading}
        >
          Reject
        </button>

        <button
          onClick={() =>
            handleUpdateStatus(selectedDoctor.id, "VERIFIED")
          }
          disabled={loading}
        >
          Approve
        </button>

        <button onClick={handleCloseDialog}>
          Close
        </button>
      </div>
    </div>
  )}
</div>

  );
}