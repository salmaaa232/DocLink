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
  <div className="space-y-6">
    {/* Header */}
    <div className="rounded-3xl border border-slate-200 bg-[#dff1f1] px-6 py-8 shadow-sm">
      <span className="inline-flex rounded-full bg-teal-100 px-4 py-2 text-xs font-semibold text-teal-800 ring-1 ring-teal-200">
        Admin • Verification
      </span>

      <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
        Pending Doctor Verifications
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
        Review applications and verify doctors before they appear to patients.
      </p>
    </div>

    {/* List */}
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">Applications</p>
          <p className="text-xs text-slate-500">
            {doctors.length} pending request{doctors.length === 1 ? "" : "s"}
          </p>
        </div>

        <Badge
          variant="outline"
          className="border-amber-200 bg-amber-50 text-amber-900"
        >
          Pending
        </Badge>
      </div>

      <Separator />

      {doctors.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <p className="text-sm font-semibold text-slate-900">
            No pending verification requests
          </p>
          <p className="mt-2 text-sm text-slate-600">
            New doctor applications will show up here.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {doctors.map((doctor) => (
            <li key={doctor.id} className="px-6 py-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Left */}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-slate-900">
                      {doctor.name}
                    </p>

                    <Badge
                      variant="outline"
                      className="border-slate-200 bg-slate-50 text-slate-700"
                    >
                      {doctor.specialty}
                    </Badge>

                    <Badge
                      variant="outline"
                      className="border-amber-200 bg-amber-50 text-amber-900"
                    >
                      Pending
                    </Badge>
                  </div>

                  <p className="text-sm text-slate-600">
                    {doctor.experience} years experience
                  </p>

                  <p className="text-xs text-slate-500">
                    Applied:{" "}
                    <span className="font-medium">
                      {format(new Date(doctor.createdAt), "PPP")}
                    </span>
                  </p>
                </div>

                {/* Right */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <button
                    onClick={() => handleViewDetails(doctor)}
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
                  >
                    View details
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>

    {/* DETAILS DIALOG */}
    <Dialog open={!!selectedDoctor} onOpenChange={(open) => !open && handleCloseDialog()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Doctor Verification Details</DialogTitle>
          <DialogDescription>
            Review the information before approving or rejecting.
          </DialogDescription>
        </DialogHeader>

        {selectedDoctor && (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Basic information</p>
              <div className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                <p>
                  <span className="text-slate-500">Name:</span>{" "}
                  {selectedDoctor.name}
                </p>
                <p>
                  <span className="text-slate-500">Email:</span>{" "}
                  {selectedDoctor.email}
                </p>
                <p className="sm:col-span-2">
                  <span className="text-slate-500">Application date:</span>{" "}
                  {format(new Date(selectedDoctor.createdAt), "PPP")}
                </p>
              </div>
            </div>

            {/* Professional Info */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-900">
                Professional information
              </p>
              <div className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                <p>
                  <span className="text-slate-500">Specialty:</span>{" "}
                  {selectedDoctor.specialty}
                </p>
                <p>
                  <span className="text-slate-500">Experience:</span>{" "}
                  {selectedDoctor.experience} years
                </p>

                <p className="sm:col-span-2">
                  <span className="text-slate-500">Credentials:</span>{" "}
                  <a
                    href={selectedDoctor.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-teal-800 underline underline-offset-2 hover:text-teal-700"
                  >
                    View credentials
                  </a>
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-900">Service description</p>
              <p className="mt-2 text-sm leading-6 text-slate-700 whitespace-pre-wrap break-words">
                {selectedDoctor.description}
              </p>
            </div>

            {loading && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                Processing...
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                onClick={handleCloseDialog}
                disabled={loading}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Close
              </button>

              <button
                onClick={() => handleUpdateStatus(selectedDoctor.id, "REJECTED")}
                disabled={loading}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-4 text-sm font-semibold text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Reject
              </button>

              <button
                onClick={() => handleUpdateStatus(selectedDoctor.id, "VERIFIED")}
                disabled={loading}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-teal-800 px-4 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Approve
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  </div>
);

}