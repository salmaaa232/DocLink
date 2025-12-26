"use client";

import { generateVideoToken } from "@/actions/appointments";
import {
  addAppointmentNotes,
  cancelAppointment,
  markAppointmentCompleted,
} from "@/actions/doctor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  Loader2,
  Stethoscope,
  User
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function AppointmentCard({
  appointment,
  userRole,
  refetchAppointments,
}) {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState(null); // 'cancel', 'notes', 'video', or 'complete'
  const [notes, setNotes] = useState(appointment.notes || "");
  const router = useRouter();

  // UseFetch hooks for server actions
  const {
    loading: cancelLoading,
    fn: submitCancel,
    data: cancelData,
  } = useFetch(cancelAppointment);
  const {
    loading: notesLoading,
    fn: submitNotes,
    data: notesData,
  } = useFetch(addAppointmentNotes);
  const {
    loading: tokenLoading,
    fn: submitTokenRequest,
    data: tokenData,
  } = useFetch(generateVideoToken);
  const {
    loading: completeLoading,
    fn: submitMarkCompleted,
    data: completeData,
  } = useFetch(markAppointmentCompleted);

  // Format date and time
  const formatDateTime = (dateString) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy 'at' h:mm a");
    } catch (e) {
      return "Invalid date";
    }
  };

  // Format time only
  const formatTime = (dateString) => {
    try {
      return format(new Date(dateString), "h:mm a");
    } catch (e) {
      return "Invalid time";
    }
  };

  // Check if appointment can be marked as completed
  const canMarkCompleted = () => {
    if (userRole !== "DOCTOR" || appointment.status !== "SCHEDULED") {
      return false;
    }
    const now = new Date();
    const appointmentEndTime = new Date(appointment.endTime);
    return now >= appointmentEndTime;
  };

  // Handle cancel appointment
  const handleCancelAppointment = async () => {
    if (cancelLoading) return;

    if (
      window.confirm(
        "Are you sure you want to cancel this appointment? This action cannot be undone."
      )
    ) {
      const formData = new FormData();
      formData.append("appointmentId", appointment.id);
      await submitCancel(formData);
    }
  };

  // Handle mark as completed
  const handleMarkCompleted = async () => {
    if (completeLoading) return;

    // Check if appointment end time has passed
    const now = new Date();
    const appointmentEndTime = new Date(appointment.endTime);

    if (now < appointmentEndTime) {
      alert(
        "Cannot mark appointment as completed before the scheduled end time."
      );
      return;
    }

    if (
      window.confirm(
        "Are you sure you want to mark this appointment as completed? This action cannot be undone."
      )
    ) {
      const formData = new FormData();
      formData.append("appointmentId", appointment.id);
      await submitMarkCompleted(formData);
    }
  };

  // Handle save notes (doctor only)
  const handleSaveNotes = async () => {
    if (notesLoading || userRole !== "DOCTOR") return;

    const formData = new FormData();
    formData.append("appointmentId", appointment.id);
    formData.append("notes", notes);
    await submitNotes(formData);
  };

  // Handle join video call
  const handleJoinVideoCall = async () => {
    if (tokenLoading) return;

    setAction("video");

    const formData = new FormData();
    formData.append("appointmentId", appointment.id);
    await submitTokenRequest(formData);
  };

  // Handle successful operations
  useEffect(() => {
    if (cancelData?.success) {
      toast.success("Appointment cancelled successfully");
      setOpen(false);
      if (refetchAppointments) {
        refetchAppointments();
      } else {
        router.refresh();
      }
    }
  }, [cancelData, refetchAppointments, router]);

  useEffect(() => {
    if (completeData?.success) {
      toast.success("Appointment marked as completed");
      setOpen(false);
      if (refetchAppointments) {
        refetchAppointments();
      } else {
        router.refresh();
      }
    }
  }, [completeData, refetchAppointments, router]);

  useEffect(() => {
    if (notesData?.success) {
      toast.success("Notes saved successfully");
      setAction(null);
      if (refetchAppointments) {
        refetchAppointments();
      } else {
        router.refresh();
      }
    }
  }, [notesData, refetchAppointments, router]);

  useEffect(() => {
    if (tokenData?.success) {
      // Redirect to video call page with token and session ID
      router.push(
        `/video-call?sessionId=${tokenData.videoSessionId}&token=${tokenData.token}&appointmentId=${appointment.id}`
      );
    } else if (tokenData?.error) {
      setAction(null);
    }
  }, [tokenData, appointment.id, router]);

  // Determine if appointment is active (within 30 minutes of start time)
  const isAppointmentActive = () => {
    const now = new Date();
    const appointmentTime = new Date(appointment.startTime);
    const appointmentEndTime = new Date(appointment.endTime);

    // Can join 30 minutes before start until end time
    return (
      (appointmentTime.getTime() - now.getTime() <= 30 * 60 * 1000 &&
        now < appointmentTime) ||
      (now >= appointmentTime && now <= appointmentEndTime)
    );
  };

  // Determine other party information based on user role
  const otherParty =
    userRole === "DOCTOR" ? appointment.patient : appointment.doctor;

  const otherPartyLabel = userRole === "DOCTOR" ? "Patient" : "Doctor";
  const otherPartyIcon = userRole === "DOCTOR" ? <User /> : <Stethoscope />;

  return (
    <>
      <Card>
        <CardContent>
          <div>
            <div>
              <div>
                <div>{otherPartyIcon}</div>

                <div>
                  <h3>
                    {userRole === "DOCTOR"
                      ? otherParty.name
                      : `Dr. ${otherParty.name}`}
                  </h3>

                  {userRole === "DOCTOR" && <p>{otherParty.email}</p>}
                  {userRole === "PATIENT" && <p>{otherParty.specialty}</p>}

                  <div>
                    <Calendar />
                    <span>{formatDateTime(appointment.startTime)}</span>
                  </div>

                  <div>
                    <Clock />
                    <span>
                      {formatTime(appointment.startTime)} -{" "}
                      {formatTime(appointment.endTime)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <Badge variant="outline">{appointment.status}</Badge>

                <div>
                  {canMarkCompleted() && (
                    <Button
                      size="sm"
                      onClick={handleMarkCompleted}
                      disabled={completeLoading}
                    >
                      {completeLoading ? <Loader2 /> : "Complete"}
                    </Button>
                  )}

                  <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointment Details Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>
              {appointment.status === "SCHEDULED"
                ? "Manage your upcoming appointment"
                : "View appointment information"}
            </DialogDescription>
          </DialogHeader>

          <div>
            {/* Other Party */}
            <div>
              <h4>{otherPartyLabel}</h4>

              <div>
                <div>{otherPartyIcon}</div>

                <div>
                  <p>
                    {userRole === "DOCTOR"
                      ? otherParty.name
                      : `Dr. ${otherParty.name}`}
                  </p>

                  {userRole === "DOCTOR" && <p>{otherParty.email}</p>}
                  {userRole === "PATIENT" && <p>{otherParty.specialty}</p>}
                </div>
              </div>
            </div>

            {/* Time */}
            <div>
              <h4>Scheduled Time</h4>

              <div>
                <div>
                  <Calendar />
                  <p>{formatDateTime(appointment.startTime)}</p>
                </div>

                <div>
                  <Clock />
                  <p>
                    {formatTime(appointment.startTime)} -{" "}
                    {formatTime(appointment.endTime)}
                  </p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <h4>Status</h4>
              <Badge variant="outline">{appointment.status}</Badge>
            </div>

            {/* Patient Description */}
            {appointment.patientDescription && (
              <div>
                <h4>
                  {userRole === "DOCTOR"
                    ? "Patient Description"
                    : "Your Description"}
                </h4>
                <p>{appointment.patientDescription}</p>
              </div>
            )}

            {/* Video Call */}
            {appointment.status === "SCHEDULED" && (
              <div>
                <h4>Video Consultation</h4>
                <Button
                  disabled={
                    !isAppointmentActive() || action === "video" || tokenLoading
                  }
                  onClick={handleJoinVideoCall}
                >
                  {tokenLoading || action === "video"
                    ? "Preparing Video Call..."
                    : isAppointmentActive()
                    ? "Join Video Call"
                    : "Video call available 30 minutes before appointment"}
                </Button>
              </div>
            )}

            {/* Doctor Notes */}
            <div>
              <div>
                <h4>Doctor Notes</h4>

                {userRole === "DOCTOR" &&
                  action !== "notes" &&
                  appointment.status !== "CANCELLED" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAction("notes")}
                    >
                      {appointment.notes ? "Edit" : "Add"}
                    </Button>
                  )}
              </div>

              {userRole === "DOCTOR" && action === "notes" ? (
                <div>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />

                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAction(null);
                        setNotes(appointment.notes || "");
                      }}
                      disabled={notesLoading}
                    >
                      Cancel
                    </Button>

                    <Button
                      size="sm"
                      onClick={handleSaveNotes}
                      disabled={notesLoading}
                    >
                      {notesLoading ? "Saving..." : "Save Notes"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  {appointment.notes ? (
                    <p>{appointment.notes}</p>
                  ) : (
                    <p>No notes added yet</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <div>
              {canMarkCompleted() && (
                <Button
                  onClick={handleMarkCompleted}
                  disabled={completeLoading}
                >
                  {completeLoading ? "Completing..." : "Mark Complete"}
                </Button>
              )}

              {appointment.status === "SCHEDULED" && (
                <Button
                  variant="outline"
                  onClick={handleCancelAppointment}
                  disabled={cancelLoading}
                >
                  {cancelLoading ? "Cancelling..." : "Cancel Appointment"}
                </Button>
              )}
            </div>

            <Button onClick={() => setOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </>
  );
}