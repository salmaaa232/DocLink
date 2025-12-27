// app/page.tsx
import Image from "next/image";
import Link from "next/link";
import SubscribeButton from "@/components/subscribe-button";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Pricing from "@/components/pricing";

/**
 * ✅ Replace these with your REAL Clerk plan IDs (cplan_...)
 * NOT the "Plan Key" (premium/standard)
 */
const plans = [
  { id: "cplan_FREE_ID_HERE", name: "Free", price: "$0" },
  { id: "cplan_STANDARD_ID_HERE", name: "Standard", price: "$100 / month" },
  { id: "cplan_PREMIUM_ID_HERE", name: "Premium", price: "$200 / month" },
];


const howItWorks = [
  {
    title: "Create Your Profile",
    desc: "Sign up and complete your profile to get personalized healthcare recommendations and services.",
    icon: <UserIcon />,
  },
  {
    title: "Book Appointments",
    desc: "Browse doctor profiles, check availability, and book appointments that fit your schedule.",
    icon: <CalendarIcon />,
  },
  {
    title: "Video Consultation",
    desc: "Connect with doctors through secure high-quality video consultations from the comfort of your home.",
    icon: <VideoIcon />,
  },
  {
    title: "Consultation Credits",
    desc: "Purchase credit packages that fit your healthcare needs with our simple subscription model.",
    icon: <CardIcon />,
  },
  {
    title: "Verified Doctors",
    desc: "All healthcare providers are carefully vetted and verified to ensure quality care.",
    icon: <ShieldIcon />,
  },
  {
    title: "Medical Documentation",
    desc: "Access and manage your appointment history, doctor's notes, and medical recommendations.",
    icon: <DocIcon />,
  },
];

const creditRules = [
  { bold: "2 credits", text: "Each consultation requires 2 credits regardless of duration" },
  { bold: "never expire", text: "Credits never expire — use them whenever you need" },
  { bold: "fresh credits every month", text: "Monthly subscriptions give you fresh credits every month" },
  { bold: "anytime", text: "Cancel or change your subscription anytime without penalties" },
];

const testimonials = [
  {
    name: "Nour",
    role: "Patient",
    quote:
      "Booking was quick and the video consultation felt just like an in-clinic visit. Super smooth experience.",
  },
  {
    name: "Dr. Ahmed",
    role: "Doctor",
    quote:
      "The scheduling and documentation tools save me time, and patients love how easy it is to follow up.",
  },
  {
    name: "Mariam",
    role: "Patient",
    quote:
      "I love the credit system—no pressure to use them immediately, and the doctors are verified.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-14 pt-6">
        <div className="relative overflow-hidden rounded-3xl bg-[#dff1f1] px-6 py-10 sm:px-10 sm:py-14">
          {/* decorative circles */}
          <div className="pointer-events-none absolute right-8 top-10 h-7 w-7 rounded-full bg-teal-900/70" />
          <div className="pointer-events-none absolute right-24 top-16 h-14 w-14 rounded-full bg-teal-900/70" />
          <div className="pointer-events-none absolute right-10 bottom-16 h-32 w-32 rounded-full bg-teal-900/70" />
          <div className="pointer-events-none absolute right-28 bottom-24 h-64 w-64 rounded-full bg-teal-900/70" />

          <div className="grid items-center gap-10 lg:grid-cols-2">
            {/* Left */}
            <div className="relative z-10">
              <span className="inline-flex items-center rounded-full bg-teal-800 px-3 py-1 text-xs font-semibold text-white">
                Health care made easy
              </span>

              <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                Connect with
                <br />
                doctors <span className="text-teal-800">anytime, anywhere</span>
              </h1>

              <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
                Book appointments, consult via video, and manage your healthcare journey all in one secure platform.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
  <Link
    href="/doctors"
    className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
  >
    Find doctors
  </Link>

  <SignedOut>
  <Link
    href="/onboarding"
    className="group inline-flex items-center gap-2 rounded-full bg-teal-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
  >
    Get started
    <span className="transition-transform group-hover:translate-x-0.5">→</span>
  </Link>
</SignedOut>


  <SignedIn>
    {/* Logged in -> go to dashboard/next page */}
    <Link
      href="/onboarding"
      className="group inline-flex items-center gap-2 rounded-full bg-teal-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
    >
      Get started
      <span className="transition-transform group-hover:translate-x-0.5">→</span>
    </Link>
  </SignedIn>
</div>

            </div>

            {/* Right image */}
            <div className="relative z-10 flex justify-center lg:justify-end">
              <div className="relative h-[360px] w-[320px] sm:h-[420px] sm:w-[360px]">
                <Image src="/doctor.png" alt="Doctor" fill className="object-contain" priority />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white pb-16">
        <div className="mx-auto w-full max-w-6xl px-4">
          <h2 className="text-center text-3xl font-extrabold tracking-tight">How it works</h2>
          <p className="mt-2 text-center text-sm text-slate-500">
            our platform makes healthcare accessible with just a few clicks
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {howItWorks.map((item) => (
              <div key={item.title} className="rounded-xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200">
                  {item.icon}
                </div>
                <h3 className="text-sm font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


{/* ✅ Consultation packages (better UI, no grey placeholder) */}
<section
  id="consultation-packages"
  className="scroll-mt-24 bg-slate-900 py-12"
>
  <div className="mx-auto w-full max-w-6xl px-4">
    <div className="flex flex-col items-center text-center">
      <span className="rounded-full bg-slate-800 px-4 py-2 text-xs font-semibold text-white">
        Affordable Healthcare
      </span>

      <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
        Consultation packages
      </h2>

      <p className="mt-2 max-w-xl text-sm text-slate-300">
        Choose the perfect consultation package that fits your health care needs
      </p>
    </div>

    <div className="mt-10 rounded-3xl bg-slate-800/60 p-6 ring-1 ring-white/10">
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.id}
            className="rounded-3xl bg-slate-50 p-6 shadow-sm ring-1 ring-slate-200"
          >
            {/* Top */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {p.name}
                </h3>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {p.price}
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  {p.name === "Standard"
                    ? "Get 10 credits for up to 5 consultations"
                    : p.name === "Premium"
                    ? "Get 24 credits for up to 12 consultations"
                    : "1 free consultation using 2 free credits"}
                </p>
              </div>

              <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-800 ring-1 ring-teal-200">
                {p.name === "Standard"
                  ? "10 Credits"
                  : p.name === "Premium"
                  ? "24 Credits"
                  : "2 Credits"}
              </span>
            </div>

            {/* Divider */}
            <div className="my-5 h-px w-full bg-slate-200" />

            {/* Features */}
            <ul className="space-y-3">
              {(p.name === "Standard"
                ? ["Verified doctors", "Video consultations", "Appointment history"]
                : p.name === "Premium"
                ? ["Priority booking", "Verified doctors", "Medical documentation"]
                : ["Always free", "Verified doctors", "Video consultations"]
              ).map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-teal-800 ring-1 ring-teal-200">
                    <CheckIcon />
                  </span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            {/* Button */}
            <div className="mt-6">
              {p.name === "Free" ? (
                <Link
                  href="/sign-up"
                  className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-900 hover:bg-slate-50"
                >
                  Create free account
                </Link>
              ) : (
                <button className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-900 hover:bg-slate-50" > Subscribe </button>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  </div>
</section>

      
      {/* Credit system */}
      <section className="bg-white py-16">
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-10">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-100 text-teal-800">
                <StethoIcon />
              </div>
              <h3 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                How our credit system works
              </h3>
            </div>

            <ul className="mt-8 space-y-4">
              {creditRules.map((r) => (
                <li key={r.bold} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-teal-100 text-teal-800">
                    <CheckIcon />
                  </span>
                  <p className="text-sm leading-7 text-slate-700">
                    <span className="font-semibold text-teal-800">{r.bold}</span>{" "}
                    {r.text.replace(r.bold, "").trim()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-16">
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="flex flex-col items-center text-center">
            <span className="rounded-full bg-teal-100 px-4 py-2 text-xs font-semibold text-teal-800 ring-1 ring-teal-200">
              Success Stories
            </span>

            <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              What our users say
            </h2>

            <p className="mt-2 max-w-xl text-sm text-slate-600">
              Hear from patients and doctors who use our platform
            </p>
          </div>

          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
              >
                <p className="text-sm leading-7 text-slate-700">“{t.quote}”</p>

                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>

                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-800 ring-1 ring-teal-200">
                    <QuoteIcon />
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              href="/#consultation-packages"
              className="rounded-full bg-teal-800 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-700"
            >
              View plans
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-white pt-10 pb-16">
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-[#dff1f1] p-8 shadow-sm sm:p-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-teal-900/15" />
            <div className="pointer-events-none absolute -left-24 -bottom-24 h-80 w-80 rounded-full bg-teal-900/10" />

            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex rounded-full bg-teal-100 px-4 py-2 text-xs font-semibold text-teal-800 ring-1 ring-teal-200">
                Get Started
              </span>

              <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Ready to take control of your healthcare?
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-700 sm:text-base">
                Join thousands of users who have simplified their healthcare journey with our platform.
                Get started today and experience healthcare the way it should be.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/signup"
                  className="rounded-full bg-teal-800 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-700"
                >
                  Sign Up Now
                </Link>

                <Link
                  href="/#consultation-packages"
                  className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                >
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- tiny inline icons (no libs needed) ---------- */

function StethoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 3v7a6 6 0 0 0 12 0V3" />
      <path d="M6 8h12" />
      <path d="M11 21a4 4 0 0 1-4-4v-3" />
      <path d="M13 21a4 4 0 0 0 4-4v-3" />
      <circle cx="19" cy="14" r="2" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-teal-800" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-teal-800" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 2v3M16 2v3" />
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-teal-800" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="7" width="14" height="10" rx="2" />
      <path d="M17 10l4-2v8l-4-2v-4z" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-teal-800" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-teal-800" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" />
      <path d="M9 12l2 2 4-5" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-teal-800" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z" />
      <path d="M14 2v5h5" />
      <path d="M9 13h6M9 17h6M9 9h2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 11H6a3 3 0 0 1 3-3h1V6H9a5 5 0 0 0-5 5v7h6v-7Zm10 0h-4a3 3 0 0 1 3-3h1V6h-1a5 5 0 0 0-5 5v7h6v-7Z" />
    </svg>
  );
}
