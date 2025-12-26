"use client";

import { approvePayout } from "@/actions/admin";
import useFetch from "@/hooks/use-fetch";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function PendingPayouts({ payouts }) {
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);

  // Custom hook for approve payout server action
  const { loading, data, fn: submitApproval } = useFetch(approvePayout);

  // Handle view details
  const handleViewDetails = (payout) => {
    setSelectedPayout(payout);
  };

  // Handle approve payout
  const handleApprovePayout = (payout) => {
    setSelectedPayout(payout);
    setShowApproveDialog(true);
  };

  // Confirm approval
  const confirmApproval = async () => {
    if (!selectedPayout || loading) return;

    const formData = new FormData();
    formData.append("payoutId", selectedPayout.id);

    await submitApproval(formData);
  };

  useEffect(() => {
    if (data?.success) {
      setShowApproveDialog(false);
      setSelectedPayout(null);
      toast.success("Payout approved successfully!");
    }
  }, [data]);

  const closeDialogs = () => {
    setSelectedPayout(null);
    setShowApproveDialog(false);
  };

  return (
   <div>
  <h2>Pending Payouts</h2>
  <p>Review and approve doctor payout requests</p>

  {payouts.length === 0 ? (
    <p>No pending payout requests.</p>
  ) : (
    <ul>
      {payouts.map((payout) => (
        <li key={payout.id}>
          <strong>Dr. {payout.doctor.name}</strong>
          <p>{payout.doctor.specialty}</p>
          <p>
            Credits: {payout.credits} — Net Amount: $
            {payout.netAmount.toFixed(2)}
          </p>
          <p>PayPal: {payout.paypalEmail}</p>

          <button onClick={() => handleViewDetails(payout)}>
            View Details
          </button>

          <button onClick={() => handleApprovePayout(payout)}>
            Approve
          </button>
        </li>
      ))}
    </ul>
  )}

  {/* DETAILS DIALOG */}
  {selectedPayout && !showApproveDialog && (
    <div>
      <h3>Payout Details</h3>

      <h4>Doctor Information</h4>
      <p>Name: Dr. {selectedPayout.doctor.name}</p>
      <p>Email: {selectedPayout.doctor.email}</p>
      <p>Specialty: {selectedPayout.doctor.specialty}</p>
      <p>Current Credits: {selectedPayout.doctor.credits}</p>

      <h4>Payout Information</h4>
      <p>Credits Requested: {selectedPayout.credits}</p>
      <p>Gross Amount: ${selectedPayout.amount.toFixed(2)}</p>
      <p>Platform Fee: ${selectedPayout.platformFee.toFixed(2)}</p>
      <p>Net Amount: ${selectedPayout.netAmount.toFixed(2)}</p>
      <p>PayPal Email: {selectedPayout.paypalEmail}</p>

      {selectedPayout.doctor.credits < selectedPayout.credits && (
        <p>
          ⚠ Doctor does not have enough credits to process this payout.
        </p>
      )}

      <button onClick={closeDialogs}>Close</button>
      <button
        onClick={() => handleApprovePayout(selectedPayout)}
        disabled={
          selectedPayout.doctor.credits < selectedPayout.credits
        }
      >
        Approve Payout
      </button>
    </div>
  )}

  {/* CONFIRMATION DIALOG */}
  {showApproveDialog && selectedPayout && (
    <div>
      <h3>Confirm Approval</h3>
      <p>
        This will deduct {selectedPayout.credits} credits from Dr.{" "}
        {selectedPayout.doctor.name}.
      </p>

      <p>Amount: ${selectedPayout.netAmount.toFixed(2)}</p>
      <p>PayPal: {selectedPayout.paypalEmail}</p>

      {loading && <p>Processing...</p>}

      <button onClick={() => setShowApproveDialog(false)}>
        Cancel
      </button>

      <button onClick={confirmApproval} disabled={loading}>
        Confirm Approval
      </button>
    </div>
  )}
</div>

  );
}