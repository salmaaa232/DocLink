import { getDoctorsBySpecialty } from "@/actions/doctors-listing";
import { DoctorCard } from "@/components/ui/doctor-card";
import { PageHeader } from "@/components/ui/page-header";

export default async function DoctorSpecialtyPage({ params }) {
  const { speciality }=  params;


const { doctors, error } = await getDoctorsBySpecialty(speciality);

  if (error) {
    console.error("Error fetching doctors:", error);
  }

  return (
    <div className="space-y-5">
<PageHeader title={speciality} backLink="/doctors" backLabel="All Specialties" />

      {doctors && doctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-blaack mb-2">No doctors available</h3>
          <p className="text-muted-foreground">
            There are currently no verified doctors in this specialty. Please check back later or choose another specialty.
          </p>
        </div>
      )}
    </div>
  );
}
