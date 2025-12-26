import { checkAndAllocateCredits } from "@/actions/credits";
import { checkUser } from "@/lib/checkUser";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {
    Calendar,
    CreditCard,
    ShieldCheck,
    Stethoscope,
    User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export default async function Header() {
  const user = await checkUser();

  if (user?.role === "PATIENT") {
    await checkAndAllocateCredits(user);
  }

  return (
    <header
      className="
        fixed top-0 w-full z-10 border-b
        bg-background/95 dark:bg-background/80
        backdrop-blur-md
        supports-[backdrop-filter]:bg-background/80
      "
    >
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <Image
            src="/Logo.png"
            alt="DocLink Logo"
            width={200}
            height={60}
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          <SignedIn>
            {/* Admin */}
            {user?.role === "ADMIN" && (
              <Link href="/admin">
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Admin Dashboard
                </Button>
                <Button
                  variant="ghost"
                  className="md:hidden w-10 h-10 p-0"
                >
                  <ShieldCheck className="h-4 w-4" />
                </Button>
              </Link>
            )}

            {/* Doctor */}
            {user?.role === "DOCTOR" && (
              <Link href="/doctor">
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2"
                >
                  <Stethoscope className="h-4 w-4" />
                  Doctor Dashboard
                </Button>
                <Button
                  variant="ghost"
                  className="md:hidden w-10 h-10 p-0"
                >
                  <Stethoscope className="h-4 w-4" />
                </Button>
              </Link>
            )}

            {/* Patient */}
            {user?.role === "PATIENT" && (
              <Link href="/appointments">
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  My Appointments
                </Button>
                <Button
                  variant="ghost"
                  className="md:hidden w-10 h-10 p-0"
                >
                  <Calendar className="h-4 w-4" />
                </Button>
              </Link>
            )}

            {/* Unassigned */}
            {user?.role === "UNASSIGNED" && (
              <Link href="/onboarding">
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Complete Profile
                </Button>
                <Button
                  variant="ghost"
                  className="md:hidden w-10 h-10 p-0"
                >
                  <User className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </SignedIn>

          {/* Credits / Pricing Badge */}
          {(!user || user?.role !== "ADMIN") && (
            <div href={user?.role === "PATIENT" ? "/pricing" : "/doctor"} >
              <Badge
                variant="outline"
                className="
                  h-9 px-3 py-1 flex items-center gap-2
                  bg-emerald-50 text-emerald-700 border-emerald-200
                  dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-700/30
                "
              >
                <CreditCard className="h-3.5 w-3.5" />
                <span>
                  {user && user.role !== "ADMIN" ? (
                    <>
                      {user.credits}{" "}
                      <span className="hidden md:inline">
                        {user?.role === "PATIENT"
                          ? "Credits"
                          : "Earned Credits"}
                      </span>
                    </>
                  ) : (
                    <>Pricing</>
                  )}
                </span>
              </Badge>
            </div>
          )}

          {/* Auth */}
          <SignedOut>
            <SignInButton>
              <Button variant="secondary">Sign In</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold",
                },
              }}
              afterSignOutUrl="/"
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}
