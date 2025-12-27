import { getCurrentUser } from "@/actions/onboarding";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Onboarding - DocLink",
  description: "Complete your profile to get started with DocLink",
};

export default async function OnboardingLayout({ children }) {
  const user = await getCurrentUser();

  // Redirect users who have already completed onboarding
  if (user) {
    if (user.role === "PATIENT") {
      redirect("/doctors");
    } else if (user.role === "DOCTOR") {
      if (user.verificationStatus === "VERIFIED") {
        redirect("/doctor");
      } else {
        redirect("/doctor/verification");
      }
    } else if (user.role === "ADMIN") {
      redirect("/admin");
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto w-full max-w-6xl px-4 py-28 sm:py-32">
        {/* Themed hero card like Home */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-[#dff1f1] px-6 py-10 shadow-sm sm:px-10 sm:py-14">
          {/* decorative circles (same feel as home) */}
          <div className="pointer-events-none absolute right-8 top-10 h-7 w-7 rounded-full bg-teal-900/20" />
          <div className="pointer-events-none absolute right-24 top-16 h-14 w-14 rounded-full bg-teal-900/18" />
          <div className="pointer-events-none absolute right-10 bottom-16 h-32 w-32 rounded-full bg-teal-900/14" />
          <div className="pointer-events-none absolute right-28 bottom-24 h-64 w-64 rounded-full bg-teal-900/10" />

          <div className="relative z-10 mx-auto max-w-3xl">
            <div className="text-center">
              {/* <span className="inline-flex items-center rounded-full bg-teal-800 px-3 py-1 text-xs font-semibold text-white">
                Get started
              </span> */}

              <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Welcome to <span className="text-teal-800">DocLink</span>
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-700 sm:text-base">
                Complete your profile to get started.
              </p>
            </div>

            {/* Content area card */}
            <div className="mt-10 rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur sm:p-8">
              {children}
            </div>
          </div>
        </div>

        {/* Optional: small helper footer text (matches style) */}
        <p className="mx-auto mt-6 max-w-3xl text-center text-xs text-slate-500">
          Your information helps us personalize your experience and connect you with the right care.
        </p>
      </div>
    </div>
  );
}
