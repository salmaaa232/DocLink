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
  CalendarDays,
  Clock,
  Loader2,
  Stethoscope,
  User,
  Video,
  FileText,
  Mail,
  MapPin
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

  // Hooks for server actions
  const { loading: cancelLoading, fn: submitCancel, data: cancelData } = useFetch(cancelAppointment);
  const { loading: notesLoading, fn: submitNotes, data: notesData } = useFetch(addAppointmentNotes);
  const { loading: tokenLoading, fn: submitTokenRequest, data: tokenData } = useFetch(generateVideoToken);
  const { loading: completeLoading, fn: submitMarkCompleted, data: completeData } = useFetch(markAppointmentCompleted);

  const formatDateTime = (dateString) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy 'at' h:mm a");
    } catch (e) {
      return "Invalid date";
    }
  };

  const formatTime = (dateString) => {
    try {
      return format(new Date(dateString), "h:mm a");
    } catch (e) {
      return "Invalid time";
    }
  };

  const canMarkCompleted = () => {
    if (userRole !== "DOCTOR" || appointment.status !== "SCHEDULED") return false;
    const now = new Date();
    const appointmentEndTime = new Date(appointment.endTime);
    return now >= appointmentEndTime;
  };

  const handleCancelAppointment = async () => {
    if (cancelLoading) return;
    if (window.confirm("Are you sure you want to cancel this appointment? This action cannot be undone.")) {
      const formData = new FormData();
      formData.append("appointmentId", appointment.id);
      await submitCancel(formData);
    }
  };

  const handleMarkCompleted = async () => {
    if (completeLoading) return;
    const now = new Date();
    const appointmentEndTime = new Date(appointment.endTime);
    if (now < appointmentEndTime) {
      toast.error("Cannot mark as completed before the scheduled end time.");
      return;
    }
    if (window.confirm("Mark this appointment as completed?")) {
      const formData = new FormData();
      formData.append("appointmentId", appointment.id);
      await submitMarkCompleted(formData);
    }
  };

  const handleSaveNotes = async () => {
    if (notesLoading || userRole !== "DOCTOR") return;
    const formData = new FormData();
    formData.append("appointmentId", appointment.id);
    formData.append("notes", notes);
    await submitNotes(formData);
  };

  const handleJoinVideoCall = async () => {
    if (tokenLoading) return;
    setAction("video");
    const formData = new FormData();
    formData.append("appointmentId", appointment.id);
    await submitTokenRequest(formData);
  };

  // Effect Handlers
  useEffect(() => {
    if (cancelData?.success) {
      toast.success("Appointment cancelled successfully");
      setOpen(false);
      refetchAppointments ? refetchAppointments() : router.refresh();
    }
  }, [cancelData, refetchAppointments, router]);

  useEffect(() => {
    if (completeData?.success) {
      toast.success("Appointment marked as completed");
      setOpen(false);
      refetchAppointments ? refetchAppointments() : router.refresh();
    }
  }, [completeData, refetchAppointments, router]);

  useEffect(() => {
    if (notesData?.success) {
      toast.success("Notes saved successfully");
      setAction(null);
      refetchAppointments ? refetchAppointments() : router.refresh();
    }
  }, [notesData, refetchAppointments, router]);

  useEffect(() => {
    if (tokenData?.success) {
      router.push(`/video-call?sessionId=${tokenData.videoSessionId}&token=${tokenData.token}&appointmentId=${appointment.id}`);
    } else if (tokenData?.error) {
      setAction(null);
    }
  }, [tokenData, appointment.id, router]);

  const isAppointmentActive = () => {
    const now = new Date();
    const appointmentTime = new Date(appointment.startTime);
    const appointmentEndTime = new Date(appointment.endTime);
    return (appointmentTime.getTime() - now.getTime() <= 30 * 60 * 1000 && now < appointmentTime) || (now >= appointmentTime && now <= appointmentEndTime);
  };

  const otherParty = userRole === "DOCTOR" ? appointment.patient : appointment.doctor;
  const otherPartyLabel = userRole === "DOCTOR" ? "Patient" : "Doctor";

  return (
    <>
      <Card className="group border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white rounded-2xl overflow-hidden mb-5 border-l-4 border-l-teal-600">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            
            {/* الجزء الأيسر: أيقونة التقويم وتاريخ اليوم */}
            <div className="bg-teal-50/30 p-6 flex flex-col items-center justify-center border-r border-slate-50 md:min-w-[140px]">
              <div className="bg-white p-3 rounded-xl shadow-sm mb-2">
                <CalendarDays className="w-7 h-7 text-teal-600" />
              </div>
              <span className="text-sm font-bold text-teal-900 uppercase">
                {format(new Date(appointment.startTime), "MMM dd")}
              </span>
            </div>

            {/* الجزء الأوسط: تفاصيل الموعد */}
            <div className="flex-1 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-2 bg-slate-100 rounded-full text-teal-700">
                    {userRole === "DOCTOR" ? <User size={20} /> : <Stethoscope size={20} />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 leading-tight">
                      {userRole === "DOCTOR" ? otherParty.name : `Dr. ${otherParty.name}`}
                    </h3>
                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                      {userRole === "DOCTOR" ? (
                        <><Mail size={14} /> {otherParty.email}</>
                      ) : (
                        <><MapPin size={14} /> {otherParty.specialty}</>
                      )}
                    </p>
                  </div>
                </div>
                <Badge className={`${
                  appointment.status === 'SCHEDULED' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 
                  appointment.status === 'CANCELLED' ? 'bg-rose-100 text-rose-700 hover:bg-rose-100' : 
                  'bg-slate-100 text-slate-700'
                } border-none px-3 py-1 rounded-full text-[11px] font-bold tracking-wider`}>
                  {appointment.status}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-600" />
                  <span className="font-medium">{formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}</span>
                </div>
                <div className="text-xs text-slate-400">
                  ID: #{appointment.id.slice(-6).toUpperCase()}
                </div>
              </div>
            </div>

            {/* الجزء الأيمن: أزرار التحكم */}
            <div className="p-6 bg-slate-50/50 flex flex-col justify-center gap-3 md:min-w-[200px] border-t md:border-t-0">
              {canMarkCompleted() && (
                <Button className="w-full bg-teal-700 hover:bg-teal-800 text-white rounded-lg shadow-sm" onClick={handleMarkCompleted} disabled={completeLoading}>
                  {completeLoading ? <Loader2 className="animate-spin w-4 h-4" /> : "Mark Complete"}
                </Button>
              )}
              <Button variant="outline" className="w-full border-slate-200 text-slate-700 hover:bg-white hover:border-teal-600 hover:text-teal-700 rounded-lg" onClick={() => setOpen(true)}>
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* مودال التفاصيل */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-teal-900 p-6 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Appointment Details</DialogTitle>
              <DialogDescription className="text-teal-100/80">
                Detailed information regarding the session on {formatDateTime(appointment.startTime)}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-6 space-y-6">
            {/* قسم معلومات الطرف الآخر */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
               <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm text-teal-700">
                  {userRole === "DOCTOR" ? <User size={24} /> : <Stethoscope size={24} />}
               </div>
               <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{otherPartyLabel}</p>
                  <p className="text-lg font-bold text-slate-800">{userRole === "DOCTOR" ? otherParty.name : `Dr. ${otherParty.name}`}</p>
               </div>
            </div>

            {/* زر مكالمة الفيديو */}
            {appointment.status === "SCHEDULED" && (
              <div className="space-y-3">
                <Button 
                  className={`w-full h-14 rounded-xl text-lg font-bold transition-all ${isAppointmentActive() ? 'bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-100' : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'}`}
                  disabled={!isAppointmentActive() || action === "video" || tokenLoading}
                  onClick={handleJoinVideoCall}
                >
                  {tokenLoading ? <Loader2 className="animate-spin mr-2" /> : <Video className="mr-2 h-6 w-6" />}
                  {isAppointmentActive() ? "Join Video Consultation" : "Call Not Available Yet"}
                </Button>
                {!isAppointmentActive() && (
                  <p className="text-[11px] text-center text-slate-400 italic">
                    The join button will be active 30 minutes before the scheduled time.
                  </p>
                )}
              </div>
            )}

            {/* قسم الملاحظات */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-slate-800 flex items-center gap-2"><FileText className="w-4 h-4 text-teal-600" /> Clinical Notes</h4>
                {userRole === "DOCTOR" && action !== "notes" && appointment.status !== "CANCELLED" && (
                  <Button variant="ghost" size="sm" className="text-teal-700 font-bold hover:bg-teal-50" onClick={() => setAction("notes")}>
                    {appointment.notes ? "Edit Notes" : "+ Add Notes"}
                  </Button>
                )}
              </div>
              
              {userRole === "DOCTOR" && action === "notes" ? (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                  <Textarea 
                    className="min-h-[120px] rounded-xl border-slate-200 focus:ring-teal-500 focus:border-teal-500" 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)} 
                    placeholder="Describe the patient's condition, diagnosis, and prescription..." 
                  />
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="sm" onClick={() => setAction(null)}>Discard</Button>
                    <Button size="sm" className="bg-teal-700" onClick={handleSaveNotes} disabled={notesLoading}>
                      {notesLoading ? "Saving..." : "Save Clinical Notes"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-600 leading-relaxed italic">
                  {appointment.notes || "No clinical notes have been added for this session yet."}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 flex-col sm:flex-row gap-3">
            {appointment.status === "SCHEDULED" && (
              <Button variant="ghost" className="text-rose-600 hover:bg-rose-50 font-bold" onClick={handleCancelAppointment} disabled={cancelLoading}>
                Cancel Appointment
              </Button>
            )}
            <Button className="bg-slate-900 text-white px-8 rounded-lg" onClick={() => setOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}