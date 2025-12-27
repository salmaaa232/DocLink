import { Card, CardContent } from "@/components/ui/card";
import { SPECIALTIES } from "@/lib/specialities";
import Link from "next/link";

const SpecialitiesPage = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center mt-10 mb-10 text-center">
        <span className="inline-flex rounded-full bg-teal-100 px-4 py-2 text-xs font-semibold text-teal-800 ring-1 ring-teal-200">
          Browse Specialties
        </span>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Find your Doctor
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
          Browse by specialty or view all available healthcare providers
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {SPECIALTIES.map((speciality) => (
          <Link
            key={speciality.name}
            href={`/doctors/${encodeURIComponent(speciality.name)}`}
            className="group block"
          >
            <Card className="h-full rounded-2xl border border-slate-200 bg-slate-50 shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md">
              <CardContent className="flex h-full min-h-[160px] flex-col items-center justify-center p-5 text-center">
                {/* Icon bubble */}
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200 transition group-hover:ring-teal-200">
                  <span className="text-teal-800">{speciality.icon}</span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-slate-900">
                  {speciality.name}
                </h3>

                {/* Sub text */}
                <p className="mt-1 text-xs text-slate-500">View doctors</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
};

export default SpecialitiesPage;
