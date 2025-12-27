import { getCurrentUser } from "@/actions/onboarding";
import { redirect } from "next/navigation";

export default async function DashboardRedirectPage() {
  const user = await getCurrentUser();

  // Not signed in or not in DB -> send to onboarding
  if (!user) {
    return redirect("/onboarding");
  }

  // Admins -> admin dashboard
  if (user.role === "ADMIN") {
    return redirect("/admin");
  }

  // Doctors -> doctor dashboard (if not verified, go to verification)
  if (user.role === "DOCTOR") {
    if (user.verificationStatus !== "VERIFIED") {
      return redirect("/doctor/verification");
    }

    return redirect("/doctor");
  }

  // Default: patients -> appointments (their personal dashboard)
  return redirect("/appointments");
}
