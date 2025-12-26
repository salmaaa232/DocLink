import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Star, User } from "lucide-react";
import Link from "next/link";

export function DoctorCard({ doctor }) {
  return (
    <Card>
  <CardContent>
    <div>
      <div>
        {doctor.imageUrl ? (
          <img
            src={doctor.imageUrl}
            alt={doctor.name}
          />
        ) : (
          <User />
        )}
      </div>

      <div>
        <div>
          <h3>{doctor.name}</h3>

          <Badge variant="outline">
            <Star />
            Verified
          </Badge>
        </div>

        <p>
          {doctor.specialty} • {doctor.experience} years experience
        </p>

        <div>
          {doctor.description}
        </div>

        <Button asChild>
          <Link href={`/doctors/${doctor.specialty}/${doctor.id}`}>
            <Calendar />
            View Profile & Book
          </Link>
        </Button>
      </div>
    </div>
  </CardContent>
</Card>

  );
}