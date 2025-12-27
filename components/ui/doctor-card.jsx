import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Star, User } from "lucide-react";
import Link from "next/link";

export function DoctorCard({ doctor }) {
  return (
    <Card className="h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      {/* Top media area (fixed height) */}
      <div className="relative h-48 w-full bg-[#dff1f1]">
        {doctor.imageUrl ? (
          <img
            src={doctor.imageUrl}
            alt={doctor.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/70 ring-1 ring-slate-200">
              <User className="h-8 w-8 text-teal-800" />
            </div>
          </div>
        )}

        {/* Verified badge (top-left) */}
        <div className="absolute left-4 top-4">
          <Badge className="gap-1 rounded-full bg-white/80 text-slate-900 ring-1 ring-slate-200">
            <Star className="h-3.5 w-3.5 text-teal-700" />
            Verified
          </Badge>
        </div>
      </div>

      <CardContent className="flex h-[240px] flex-col p-5">
        {/* Title */}
        <h3 className="text-lg font-extrabold tracking-tight text-slate-900">
          {doctor.name}
        </h3>

        {/* Meta */}
        <p className="mt-1 text-sm text-slate-600">
          <span className="font-semibold text-teal-800">{doctor.specialty}</span>{" "}
          • {doctor.experience} years experience
        </p>

        {/* Description (clamped so it won’t explode the card) */}
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-700">
          {doctor.description || "No description provided yet."}
        </p>

        {/* Push button to bottom */}
        <div className="mt-auto pt-4">
          <Button
            asChild
            className="w-full rounded-xl bg-slate-900 text-white hover:bg-slate-800"
          >
            <Link href={`/doctors/${doctor.specialty}/${doctor.id}`}>
              <Calendar className="mr-2 h-4 w-4" />
              View Profile &amp; Book
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
