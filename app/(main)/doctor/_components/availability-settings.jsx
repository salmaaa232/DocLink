"use client";

import { setAvailabilitySlots } from "@/actions/doctor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useFetch from "@/hooks/use-fetch";
import { format } from "date-fns";
import { AlertCircle, Clock, Loader2, Plus, CalendarDays, CheckCircle2, Ban } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function AvailabilitySettings({ slots }) {
  const [showForm, setShowForm] = useState(false);

  // Custom hook for server action
  const { loading, fn: submitSlots, data } = useFetch(setAvailabilitySlots);

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      startTime: "",
      endTime: "",
    },
  });

  function createLocalDateFromTime(timeStr) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const now = new Date();
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes
    );
  }

  const onSubmit = async (formDataJson) => {
    if (loading) return;

    const startDate = createLocalDateFromTime(formDataJson.startTime);
    const endDate = createLocalDateFromTime(formDataJson.endTime);

    if (startDate >= endDate) {
      toast.error("End time must be after start time");
      return;
    }

    const formData = new FormData();
    formData.append("startTime", startDate.toISOString());
    formData.append("endTime", endDate.toISOString());

    await submitSlots(formData);
  };

  useEffect(() => {
    if (data && data?.success) {
      setShowForm(false);
      reset(); // تصفير الفورم بعد النجاح
      toast.success("Availability slots updated successfully");
    }
  }, [data, reset]);

  const formatTimeString = (dateString) => {
    try {
      return format(new Date(dateString), "h:mm a");
    } catch (e) {
      return "Invalid time";
    }
  };

  return (
    <Card className="border-none shadow-xl bg-white overflow-hidden">
      {/* Header بلمسة جمالية */}
      <div className="h-2 bg-teal-900" /> 
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold text-teal-900 flex items-center gap-2">
              <Clock className="text-teal-900 w-6 h-6" />
              Availability Settings
            </CardTitle>
            <CardDescription className="text-slate-500">
              Set your daily working hours for patients
            </CardDescription>
          </div>
          {!showForm && (
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-teal-900 hover:bg-teal-800 text-white shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Slot
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {!showForm ? (
          <div className="animate-in fade-in duration-500">
            <h3 className="text-sm font-bold text-teal-900/40 uppercase tracking-widest mb-4">
              Your Current Schedule
            </h3>

            {slots.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <CalendarDays className="w-12 h-12 text-slate-300 mb-4" />
                <p className="text-slate-500 font-medium">No availability slots set yet.</p>
                <p className="text-slate-400 text-sm">Patients cannot book until you add slots.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {slots.map((slot) => (
                  <div
                    key={slot.id}
                    className="relative group p-4 rounded-2xl border border-slate-100 bg-white shadow-sm hover:border-teal-200 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="p-2 bg-teal-50 rounded-lg">
                        <Clock className="w-4 h-4 text-teal-900" />
                      </div>
                      {slot.appointment ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 bg-rose-50 text-rose-600 rounded-full">
                           <Ban className="w-3 h-3" /> BOOKED
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full">
                           <CheckCircle2 className="w-3 h-3" /> AVAILABLE
                        </span>
                      )}
                    </div>
                    <p className="text-lg font-semibold text-slate-700 tracking-tight">
                      {formatTimeString(slot.startTime)} - {formatTimeString(slot.endTime)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Form Section */
          <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="space-y-6 p-6 rounded-2xl border border-teal-100 bg-teal-50/30 animate-in zoom-in-95 duration-300"
          >
            <div className="flex items-center gap-2 border-b border-teal-100 pb-4 mb-4">
               <Plus className="w-5 h-5 text-teal-900" />
               <h3 className="font-bold text-teal-900">New Availability Slot</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startTime" className="text-slate-700 font-medium">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  className="h-11 bg-white border-slate-200 focus:ring-teal-900 focus:border-teal-900 shadow-sm"
                  {...register("startTime", { required: "Start time is required" })}
                />
                {errors.startTime && <p className="text-rose-500 text-xs mt-1">{errors.startTime.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime" className="text-slate-700 font-medium">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  className="h-11 bg-white border-slate-200 focus:ring-teal-900 focus:border-teal-900 shadow-sm"
                  {...register("endTime", { required: "End time is required" })}
                />
                {errors.endTime && <p className="text-rose-500 text-xs mt-1">{errors.endTime.message}</p>}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setShowForm(false)} 
                disabled={loading}
                className="text-slate-500 hover:text-slate-700"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-teal-900 hover:bg-teal-800 text-white min-w-[140px] shadow-lg shadow-teal-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Availability"
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Footer Info Box */}
        <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="p-2 bg-white rounded-full shadow-sm">
            <AlertCircle className="w-5 h-5 text-teal-900" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-800">Important Note</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Updates will apply to all future days. Existing booked appointments 
              will remain unchanged to avoid scheduling conflicts.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
  
}