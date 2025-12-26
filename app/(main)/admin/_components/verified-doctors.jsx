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
<div>
  <Card>
    <CardHeader>
      <div>
        <div>
          <CardTitle>Manage Doctors</CardTitle>
          <CardDescription>
            View and manage all verified doctors
          </CardDescription>
        </div>

        <div>
          <Search />
          <Input
            placeholder="Search doctors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    </CardHeader>

    <CardContent>
      {filteredDoctors.length === 0 ? (
        <div>
          {searchTerm
            ? "No doctors match your search criteria."
            : "No verified doctors available."}
        </div>
      ) : (
        <div>
          {filteredDoctors.map((doctor) => {
            const isSuspended =
              doctor.verificationStatus === "REJECTED";

            return (
              <Card key={doctor.id}>
                <CardContent>
                  <div>
                    <div>
                      <div>
                        <User />
                      </div>

                      <div>
                        <h3>{doctor.name}</h3>
                        <p>
                          {doctor.specialty} • {doctor.experience} years
                          experience
                        </p>
                        <p>{doctor.email}</p>
                      </div>
                    </div>

                    <div>
                      {isSuspended ? (
                        <>
                          <Badge variant="outline">Suspended</Badge>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleStatusChange(doctor, false)
                            }
                            disabled={loading}
                          >
                            {loading &&
                            targetDoctor?.id === doctor.id ? (
                              <Loader2 />
                            ) : (
                              <Check />
                            )}
                            Reinstate
                          </Button>
                        </>
                      ) : (
                        <>
                          <Badge variant="outline">Active</Badge>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleStatusChange(doctor, true)
                            }
                            disabled={loading}
                          >
                            {loading &&
                            targetDoctor?.id === doctor.id ? (
                              <Loader2 />
                            ) : (
                              <Ban />
                            )}
                            Suspend
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </CardContent>
  </Card>
</div>

  );
}