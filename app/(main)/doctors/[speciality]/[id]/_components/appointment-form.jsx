"use client";

import { bookAppointment } from "@/actions/appointments";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { format } from "date-fns";
import {
    ArrowLeft,
    Calendar,
    Clock,
    CreditCard,
    Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function AppointmentForm({ doctorId, slot, onBack, onComplete }) {
  const [description, setDescription] = useState("");

  const { loading, data, fn: submitBooking } = useFetch(bookAppointment);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("doctorId", doctorId);
    formData.append("startTime", slot.startTime);
    formData.append("endTime", slot.endTime);
    formData.append("description", description);

    await submitBooking(formData);
  };

  useEffect(() => {
    if (data?.success) {
      toast.success("Appointment booked successfully!");
      onComplete();
    }
  }, [data, onComplete]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Appointment summary */}
      <div className="rounded-lg border border-border/60 bg-muted/30 p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="font-medium text-foreground">
            {format(new Date(slot.startTime), "EEEE, MMMM d, yyyy")}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">{slot.formatted}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <CreditCard className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">
            Cost: <span className="font-medium text-foreground">2 credits</span>
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">
          Describe your medical concern (optional)
        </Label>
        <Textarea
          id="description"
          placeholder="Share any details that may help the doctor prepare for your consultation..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[120px]"
        />
        <p className="text-xs text-muted-foreground">
          This information will be shared privately with the doctor.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={loading}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Change time slot
        </Button>

        <Button type="submit" disabled={loading} className="gap-2">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Booking…
            </>
          ) : (
            "Confirm booking"
          )}
        </Button>
      </div>
    </form>
  );
}
