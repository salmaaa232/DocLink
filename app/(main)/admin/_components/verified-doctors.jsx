"use client";

import { updateDoctorActiveStatus } from "@/actions/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/use-fetch";
import { Ban, Check, Loader2, Search, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function VerifiedDoctors({ doctors }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [targetDoctor, setTargetDoctor] = useState(null);
  const [actionType, setActionType] = useState(null);

  const {
    loading,
    data,
    fn: submitStatusUpdate,
  } = useFetch(updateDoctorActiveStatus);

  const filteredDoctors = doctors.filter((doctor) => {
    const query = searchTerm.toLowerCase();
    return (
      doctor.name.toLowerCase().includes(query) ||
      doctor.specialty.toLowerCase().includes(query) ||
      doctor.email.toLowerCase().includes(query)
    );
  });

  const handleStatusChange = async (doctor, suspend) => {
    const confirmed = window.confirm(
      `Are you sure you want to ${suspend ? "suspend" : "reinstate"} ${
        doctor.name
      }?`
    );
    if (!confirmed || loading) return;

    const formData = new FormData();
    formData.append("doctorId", doctor.id);
    formData.append("suspend", suspend ? "true" : "false");

    setTargetDoctor(doctor);
    setActionType(suspend ? "SUSPEND" : "REINSTATE");

    await submitStatusUpdate(formData);
  };

  useEffect(() => {
    if (data?.success && targetDoctor && actionType) {
      const actionVerb = actionType === "SUSPEND" ? "Suspended" : "Reinstated";
      toast.success(`${actionVerb} ${targetDoctor.name} successfully!`);
      setTargetDoctor(null);
      setActionType(null);
    }
  }, [data]);

  return (
  <div className="space-y-6">
    {/* Header */}
    <div className="rounded-3xl border border-slate-200 bg-[#dff1f1] px-6 py-8 shadow-sm">
      <span className="inline-flex rounded-full bg-teal-100 px-4 py-2 text-xs font-semibold text-teal-800 ring-1 ring-teal-200">
        Admin • Doctors
      </span>

      <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
        Manage Doctors
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
        View and manage all verified doctors. You can suspend or reinstate accounts.
      </p>

      {/* Search */}
      <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <Search className="h-4 w-4 text-slate-500" />
        <Input
          className="border-0 bg-transparent p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Search by name, specialty, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>

    {/* List container */}
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">Doctors</p>
          <p className="text-xs text-slate-500">
            {filteredDoctors.length} result{filteredDoctors.length === 1 ? "" : "s"}
          </p>
        </div>

        <Badge
          variant="outline"
          className="border-slate-200 bg-slate-50 text-slate-700"
        >
          Verified list
        </Badge>
      </div>

      <div className="h-px w-full bg-slate-100" />

      {filteredDoctors.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <p className="text-sm font-semibold text-slate-900">
            {searchTerm ? "No doctors match your search." : "No verified doctors available."}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Try a different keyword or check back later.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {filteredDoctors.map((doctor) => {
            const isSuspended = doctor.verificationStatus === "REJECTED";
            const isRowLoading = loading && targetDoctor?.id === doctor.id;

            return (
              <li key={doctor.id} className="px-6 py-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Left info */}
                  <div className="flex items-start gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 ring-1 ring-slate-200">
                      <User className="h-5 w-5 text-slate-600" />
                    </div>

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

                        {isSuspended ? (
                          <Badge className="bg-rose-50 text-rose-700 ring-1 ring-rose-200">
                            Suspended
                          </Badge>
                        ) : (
                          <Badge className="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                            Active
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-slate-600">
                        {doctor.experience} years experience
                      </p>

                      <p className="text-xs text-slate-500">{doctor.email}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    {isSuspended ? (
                      <Button
                        variant="outline"
                        className="h-10 rounded-xl border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                        onClick={() => handleStatusChange(doctor, false)}
                        disabled={loading}
                      >
                        {isRowLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="mr-2 h-4 w-4" />
                        )}
                        Reinstate
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="h-10 rounded-xl border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                        onClick={() => handleStatusChange(doctor, true)}
                        disabled={loading}
                      >
                        {isRowLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Ban className="mr-2 h-4 w-4" />
                        )}
                        Suspend
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  </div>
);

}