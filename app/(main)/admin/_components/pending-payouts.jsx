"use client";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  <div className="space-y-6">
    {/* Header */}
    <div className="rounded-3xl border border-slate-200 bg-[#dff1f1] px-6 py-8 shadow-sm">
      <span className="inline-flex rounded-full bg-teal-100 px-4 py-2 text-xs font-semibold text-teal-800 ring-1 ring-teal-200">
        Admin • Billing
      </span>

      <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
        Pending Payouts
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
        Review and approve doctor payout requests.
      </p>
    </div>

    {/* List */}
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">Requests</p>
          <p className="text-xs text-slate-500">
            {payouts.length} pending payout{payouts.length === 1 ? "" : "s"}
          </p>
        </div>

        <Badge
          variant="outline"
          className="border-teal-200 bg-teal-50 text-teal-800"
        >
          Awaiting approval
        </Badge>
      </div>

      <Separator />

      {payouts.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <p className="text-sm font-semibold text-slate-900">
            No pending payout requests
          </p>
          <p className="mt-2 text-sm text-slate-600">
            When doctors request payouts, they’ll show up here.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {payouts.map((payout) => (
            <li key={payout.id} className="px-6 py-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Left */}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-slate-900">
                      Dr. {payout.doctor.name}
                    </p>

                    <Badge
                      variant="outline"
                      className="border-slate-200 bg-slate-50 text-slate-700"
                    >
                      {payout.doctor.specialty}
                    </Badge>
                  </div>

                  <p className="text-sm text-slate-600">
                    Credits: <span className="font-semibold">{payout.credits}</span>{" "}
                    <span className="text-slate-400">—</span> Net Amount:{" "}
                    <span className="font-semibold">
                      ${payout.netAmount.toFixed(2)}
                    </span>
                  </p>

                  <p className="text-xs text-slate-500">
                    PayPal: <span className="font-medium">{payout.paypalEmail}</span>
                  </p>
                </div>

                {/* Right */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <button
                    onClick={() => handleViewDetails(payout)}
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
                  >
                    View details
                  </button>

                  <button
                    onClick={() => handleApprovePayout(payout)}
                    className="inline-flex h-10 items-center justify-center rounded-xl bg-teal-800 px-4 text-sm font-semibold text-white shadow-sm hover:bg-teal-700"
                  >
                    Approve
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>

    {/* DETAILS DIALOG */}
    <Dialog open={!!selectedPayout && !showApproveDialog} onOpenChange={(open) => !open && closeDialogs()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Payout Details</DialogTitle>
          <DialogDescription>
            Review doctor and payout info before approving.
          </DialogDescription>
        </DialogHeader>

        {selectedPayout && (
          <div className="space-y-6">
            {/* Doctor */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Doctor information</p>
              <div className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                <p><span className="text-slate-500">Name:</span> Dr. {selectedPayout.doctor.name}</p>
                <p><span className="text-slate-500">Email:</span> {selectedPayout.doctor.email}</p>
                <p><span className="text-slate-500">Specialty:</span> {selectedPayout.doctor.specialty}</p>
                <p><span className="text-slate-500">Current credits:</span> {selectedPayout.doctor.credits}</p>
              </div>
            </div>

            {/* Payout */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-900">Payout information</p>
              <div className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                <p><span className="text-slate-500">Credits requested:</span> {selectedPayout.credits}</p>
                <p><span className="text-slate-500">Gross amount:</span> ${selectedPayout.amount.toFixed(2)}</p>
                <p><span className="text-slate-500">Platform fee:</span> ${selectedPayout.platformFee.toFixed(2)}</p>
                <p><span className="text-slate-500">Net amount:</span> ${selectedPayout.netAmount.toFixed(2)}</p>
                <p className="sm:col-span-2">
                  <span className="text-slate-500">PayPal:</span>{" "}
                  {selectedPayout.paypalEmail}
                </p>
              </div>

              {selectedPayout.doctor.credits < selectedPayout.credits && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  ⚠ Doctor does not have enough credits to process this payout.
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                onClick={closeDialogs}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Close
              </button>

              <button
                onClick={() => handleApprovePayout(selectedPayout)}
                disabled={selectedPayout.doctor.credits < selectedPayout.credits}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-teal-800 px-4 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Approve payout
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>

    {/* CONFIRMATION DIALOG */}
    <Dialog open={showApproveDialog && !!selectedPayout} onOpenChange={(open) => !open && setShowApproveDialog(false)}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Confirm approval</DialogTitle>
          <DialogDescription>
            This will deduct credits and mark the payout as approved.
          </DialogDescription>
        </DialogHeader>

        {selectedPayout && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p>
                This will deduct{" "}
                <span className="font-semibold">{selectedPayout.credits}</span>{" "}
                credits from{" "}
                <span className="font-semibold">Dr. {selectedPayout.doctor.name}</span>.
              </p>
              <p className="mt-2">
                Amount:{" "}
                <span className="font-semibold">
                  ${selectedPayout.netAmount.toFixed(2)}
                </span>
              </p>
              <p className="mt-1">PayPal: {selectedPayout.paypalEmail}</p>
            </div>

            {loading && (
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                Processing...
              </div>
            )}

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                onClick={() => setShowApproveDialog(false)}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={confirmApproval}
                disabled={loading}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-teal-800 px-4 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Confirm approval
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  </div>
);
}