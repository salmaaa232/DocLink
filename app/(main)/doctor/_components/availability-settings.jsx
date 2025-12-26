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
import { AlertCircle, Clock, Loader2, Plus } from "lucide-react";
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
    const date = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes
    );
    return date;
  }

  // Handle slot submission
  const onSubmit = async (data) => {
    if (loading) return;

    const formData = new FormData();

    const today = new Date().toISOString().split("T")[0];

    // Create date objects
    const startDate = createLocalDateFromTime(data.startTime);
    const endDate = createLocalDateFromTime(data.endTime);

    if (startDate >= endDate) {
      toast.error("End time must be after start time");
      return;
    }

    // Add to form data
    formData.append("startTime", startDate.toISOString());
    formData.append("endTime", endDate.toISOString());

    await submitSlots(formData);
  };

  useEffect(() => {
    if (data && data?.success) {
      setShowForm(false);
      toast.success("Availability slots updated successfully");
    }
  }, [data]);

  // Format time string for display
  const formatTimeString = (dateString) => {
    try {
      return format(new Date(dateString), "h:mm a");
    } catch (e) {
      return "Invalid time";
    }
  };

  return (
<Card>
  <CardHeader>
    <CardTitle>
      <Clock /> Availability Settings
    </CardTitle>
    <CardDescription>
      Set your daily availability for patient appointments
    </CardDescription>
  </CardHeader>

  <CardContent>
    {/* Current Availability Display */}
    {!showForm ? (
      <>
        <div>
          <h3>Current Availability</h3>

          {slots.length === 0 ? (
            <p>You haven't set any availability slots yet. Add your availability to start accepting appointments.</p>
          ) : (
            <div>
              {slots.map((slot) => (
                <div key={slot.id}>
                  <div>
                    <Clock />
                  </div>
                  <div>
                    <p>{formatTimeString(slot.startTime)} - {formatTimeString(slot.endTime)}</p>
                    <p>{slot.appointment ? "Booked" : "Available"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button onClick={() => setShowForm(true)}>
          <Plus /> Set Availability Time
        </Button>
      </>
    ) : (
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>Set Daily Availability</h3>

        <div>
          <div>
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="time"
              {...register("startTime", { required: "Start time is required" })}
            />
            {errors.startTime && <p>{errors.startTime.message}</p>}
          </div>

          <div>
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="time"
              {...register("endTime", { required: "End time is required" })}
            />
            {errors.endTime && <p>{errors.endTime.message}</p>}
          </div>
        </div>

        <div>
          <Button type="button" onClick={() => setShowForm(false)} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 /> Saving...
              </>
            ) : (
              "Save Availability"
            )}
          </Button>
        </div>
      </form>
    )}

    <div>
      <h4>
        <AlertCircle /> How Availability Works
      </h4>
      <p>
        Setting your daily availability allows patients to book appointments during those hours.
        The same availability applies to all days. You can update your availability at any time,
        but existing booked appointments will not be affected.
      </p>
    </div>
  </CardContent>
</Card>

  );
}