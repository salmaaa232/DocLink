import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Star, User } from "lucide-react";
import Link from "next/link";

export function DoctorCard({ doctor }) {
  const initials = (doctor?.name || "Doctor")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="p-0">
        {/* Top area */}
        <div className="relative">
          {/* fixed height banner (prevents huge blocks) */}
          <div className="h-20 w-full bg-slate-50" />

          {/* Verified badge */}
          <div className="absolute right-4 top-4">
            <Badge className="gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-teal-700">
              <Star className="h-3.5 w-3.5 text-teal-700" />
              Verified
            </Badge>
          </div>

          {/* Avatar */}
          <div className="absolute left-5 top-10">
            <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-full ring-1 ring-slate-100 bg-slate-50">
              {doctor.imageUrl ? (
                // if you want Next/Image later, we can switch, but this is fine
                <img
                  src={doctor.imageUrl}
                  alt={doctor.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center bg-teal-900/30 text-teal-100">
                  <span className="text-lg font-extrabold">{initials}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-4">
          <h3 className="text-lg font-semibold tracking-tight text-slate-900 line-clamp-1">
            {doctor.name}
          </h3>

          <p className="mt-1 text-sm text-slate-600">
            <span className="text-teal-600">{doctor.specialty}</span>{" "}
            <span className="text-slate-400">•</span>{" "}
            {doctor.experience} years experience
          </p>

          {/* <p className="mt-3 text-sm text-slate-600 line-clamp-2">
            {doctor.description || "Experienced doctor ready to help you."}
          </p> */}
          <p className="text-slate-600 break-words whitespace-pre-wrap mt-3 text-sm text-slate-600 line-clamp-2">
          {doctor.description || "Experienced doctor ready to help you."}
         </p>

          <Button
            asChild
            className="mt-4 w-full rounded-md bg-teal-800 text-white hover:bg-teal-700 py-2"
          >
            <Link href={`/doctors/${encodeURIComponent(doctor.specialty)}/${doctor.id}`}>
              <Calendar className="mr-2 h-4 w-4" />
              View Profile & Book
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
