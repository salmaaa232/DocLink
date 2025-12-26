// /app/doctors/[id]/_components/doctor-profile.jsx
"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    AlertCircle,
    Calendar,
    ChevronDown,
    ChevronUp,
    Clock,
    FileText,
    Medal,
    User,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppointmentForm } from "./appointment-form";
import { SlotPicker } from "./slot-picker";

export function DoctorProfile({ doctor, availableDays }) {
  const [showBooking, setShowBooking] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const router = useRouter();

  const totalSlots = availableDays?.reduce(
    (total, day) => total + day.slots.length,
    0
  );

  const toggleBooking = () => {
    setShowBooking((prev) => !prev);
    if (!showBooking) {
      setTimeout(() => {
        document.getElementById("booking-section")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* Left column */}
      <div className="md:col-span-1">
        <div className="md:sticky md:top-24">
          <Card className="border border-border/60 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-4">
                {/* Avatar */}
                <div className="relative h-32 w-32 overflow-hidden rounded-full bg-muted">
                  {doctor.imageUrl ? (
                    <Image
                      src={doctor.imageUrl}
                      alt={doctor.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Dr. {doctor.name}
                  </h2>

                  <Badge variant="secondary" className="mt-2">
                    {doctor.specialty}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Medal className="h-4 w-4" />
                  {doctor.experience} years experience
                </div>

                <Button onClick={toggleBooking} className="w-full">
                  {showBooking ? (
                    <>
                      Hide Booking
                      <ChevronUp className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Book Appointment
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right column */}
      <div className="md:col-span-2 space-y-6">
        {/* About */}
        <Card className="border border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              About Dr. {doctor.name}
            </CardTitle>
            <CardDescription>
              Professional background and expertise
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <section className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="font-medium text-foreground">Description</h3>
              </div>

              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {doctor.description}
              </p>
            </section>

            <Separator />

            <section className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="font-medium text-foreground">Availability</h3>
              </div>

              {totalSlots > 0 ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {totalSlots} slots available over the next 4 days
                </div>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No available slots for the next 4 days.
                  </AlertDescription>
                </Alert>
              )}
            </section>
          </CardContent>
        </Card>

        {/* Booking section */}
        {showBooking && (
          <div id="booking-section">
            <Card className="border border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Book an Appointment
                </CardTitle>
                <CardDescription>
                  Choose a time slot and provide consultation details
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {totalSlots > 0 ? (
                  <>
                    {!selectedSlot && (
                      <SlotPicker
                        days={availableDays}
                        onSelectSlot={setSelectedSlot}
                      />
                    )}

                    {selectedSlot && (
                      <AppointmentForm
                        doctorId={doctor.id}
                        slot={selectedSlot}
                        onBack={() => setSelectedSlot(null)}
                        onComplete={() => router.push("/appointments")}
                      />
                    )}
                  </>
                ) : (
                  <div className="py-10 text-center">
                    <Calendar className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                    <h3 className="font-semibold text-foreground">
                      No available slots
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Please check back later or try another doctor.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
