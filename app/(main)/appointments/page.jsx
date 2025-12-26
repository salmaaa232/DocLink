import { getCurrentUser } from "@/actions/onboarding";
import { getPatientAppointments } from "@/actions/patient";
import { AppointmentCard } from "@/components/appointment-card";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Calendar } from "lucide-react";
import { redirect } from "next/navigation";

export default async function PatientAppointmentsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "PATIENT") {
    redirect("/onboarding");
  }

  const { appointments, error } = await getPatientAppointments();

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      <PageHeader
        icon={<Calendar className="h-5 w-5" />}
        title="My Appointments"
        backLink="/doctors"
        backLabel="Find Doctors"
      />

      <Card className="mt-6 border border-border/60 bg-background shadow-sm">
        <CardHeader className="border-b bg-muted/30">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Calendar className="h-5 w-5 text-primary" />
            Your Appointments
          </CardTitle>
        </CardHeader>

        <CardContent className="py-6">
          {error ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-center">
              <p className="text-sm text-destructive">
                Something went wrong: {error}
              </p>
            </div>
          ) : appointments?.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  userRole="PATIENT"
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <Calendar className="h-7 w-7 text-muted-foreground" />
              </div>

              <h3 className="text-lg font-semibold text-foreground">
                No appointments yet
              </h3>

              <p className="max-w-sm text-sm text-muted-foreground">
                You don’t have any appointments scheduled. Browse doctors and
                book your first consultation.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
