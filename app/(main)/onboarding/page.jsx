"use client";

import { setUserRole } from "@/actions/onboarding";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { doctorFormSchema } from "@/lib/schema";
import { SPECIALTIES } from "@/lib/specialities";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Stethoscope, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function OnboardingPage() {
  const [step, setStep] = useState("choose-role");
  const router = useRouter();

  // Custom hook for user role server action
  const { loading, data, fn: submitUserRole } = useFetch(setUserRole);

  // React Hook Form setup with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      specialty: "",
      experience: undefined,
      credentialUrl: "",
      description: "",
    },
  });

  // Watch specialty value for controlled select component
  const specialtyValue = watch("specialty");

  // Handle patient role selection
  const handlePatientSelection = async () => {
    if (loading) return;

    const formData = new FormData();
    formData.append("role", "PATIENT");

    await submitUserRole(formData);
  };

  useEffect(() => {
    if (data && data?.success) {
      router.push(data.redirect);
    }
  }, [data]);

  // Added missing onDoctorSubmit function
  const onDoctorSubmit = async (data) => {
    if (loading) return;

    const formData = new FormData();
    formData.append("role", "DOCTOR");
    formData.append("specialty", data.specialty);
    formData.append("experience", data.experience.toString());
    formData.append("credentialUrl", data.credentialUrl);
    formData.append("description", data.description);

    await submitUserRole(formData);
  };

  // Role selection screen
  if (step === "choose-role") {
    return (
      <div className="mx-auto w-full max-w-5xl">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            className="group relative cursor-pointer overflow-hidden border-border/60 bg-background/70 shadow-sm transition hover:shadow-md hover:border-emerald-200"
            onClick={() => !loading && handlePatientSelection()}
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-50/70 via-transparent to-transparent dark:from-emerald-950/25" />
            <CardContent className="relative pt-7 pb-6 flex flex-col items-center text-center">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-100 dark:bg-emerald-950/40 dark:ring-emerald-900/40">
                <User className="h-7 w-7 text-emerald-700 dark:text-emerald-300" />
              </div>

              <CardTitle className="text-xl font-semibold text-foreground mb-2">
                Join as a Patient
              </CardTitle>
              <CardDescription className="mb-5 max-w-sm text-muted-foreground">
                Book appointments, consult with doctors, and manage your
                healthcare journey.
              </CardDescription>

              <Button
                className="w-full mt-1 bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Continue as Patient"
                )}
              </Button>

              <div className="mt-3 text-xs text-muted-foreground">
                No extra details required
              </div>
            </CardContent>
          </Card>

          <Card
            className="group relative cursor-pointer overflow-hidden border-border/60 bg-background/70 shadow-sm transition hover:shadow-md hover:border-emerald-200"
            onClick={() => !loading && setStep("doctor-form")}
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-50/70 via-transparent to-transparent dark:from-emerald-950/25" />
            <CardContent className="relative pt-7 pb-6 flex flex-col items-center text-center">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-100 dark:bg-emerald-950/40 dark:ring-emerald-900/40">
                <Stethoscope className="h-7 w-7 text-emerald-700 dark:text-emerald-300" />
              </div>

              <CardTitle className="text-xl font-semibold text-foreground mb-2">
                Join as a Doctor
              </CardTitle>
              <CardDescription className="mb-5 max-w-sm text-muted-foreground">
                Create your professional profile, set your availability, and
                provide consultations.
              </CardDescription>

              <Button
                className="w-full mt-1 bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                disabled={loading}
              >
                Continue as Doctor
              </Button>

              <div className="mt-3 text-xs text-muted-foreground">
                Verification required
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Doctor registration form
  if (step === "doctor-form") {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <Card className="border-border/60 bg-background/70 shadow-sm">
          <CardContent className="pt-7 pb-7">
            <div className="mb-7">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-100 dark:bg-emerald-950/40 dark:ring-emerald-900/40">
                  <Stethoscope className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-semibold tracking-tight text-foreground">
                    Complete Your Doctor Profile
                  </CardTitle>
                  <CardDescription className="mt-1 text-muted-foreground">
                    Provide your professional details for verification.
                  </CardDescription>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onDoctorSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="specialty" className="text-foreground">
                  Medical Specialty
                </Label>

                <Select
                  value={specialtyValue}
                  onValueChange={(value) => setValue("specialty", value)}
                >
                  <SelectTrigger
                    id="specialty"
                    className="h-11 bg-background border-border/70 focus:ring-2 focus:ring-emerald-500/30"
                  >
                    <SelectValue placeholder="Select your specialty" />
                  </SelectTrigger>

                  <SelectContent className="border-border/70">
                    {SPECIALTIES.map((spec) => (
                      <SelectItem
                        key={spec.name}
                        value={spec.name}
                        className="flex items-center gap-2"
                      >
                        <span className="text-emerald-600 dark:text-emerald-400">
                          {spec.icon}
                        </span>
                        {spec.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {errors.specialty && (
                  <p className="text-sm font-medium text-red-600 mt-1">
                    {errors.specialty.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience" className="text-foreground">
                  Years of Experience
                </Label>
                <Input
                  id="experience"
                  type="number"
                  placeholder="e.g. 5"
                  className="h-11 bg-background border-border/70 focus-visible:ring-2 focus-visible:ring-emerald-500/30"
                  {...register("experience", { valueAsNumber: true })}
                />
                {errors.experience && (
                  <p className="text-sm font-medium text-red-600 mt-1">
                    {errors.experience.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="credentialUrl" className="text-foreground">
                  Link to Credential Document
                </Label>
                <Input
                  id="credentialUrl"
                  type="url"
                  placeholder="https://example.com/my-medical-degree.pdf"
                  className="h-11 bg-background border-border/70 focus-visible:ring-2 focus-visible:ring-emerald-500/30"
                  {...register("credentialUrl")}
                />
                {errors.credentialUrl && (
                  <p className="text-sm font-medium text-red-600 mt-1">
                    {errors.credentialUrl.message}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Add a link to your medical degree, license, or certification.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground">
                  Description of Your Services
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your expertise, services, and approach to patient care..."
                  rows="4"
                  className="min-h-[110px] bg-background border-border/70 focus-visible:ring-2 focus-visible:ring-emerald-500/30"
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm font-medium text-red-600 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="pt-1 flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("choose-role")}
                  className="border-border/70 bg-background hover:bg-muted"
                  disabled={loading}
                >
                  Back
                </Button>

                <Button
                  type="submit"
                  className="bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit for Verification"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="mt-4 text-xs text-muted-foreground">
          By submitting, you confirm your details are accurate and may be
          reviewed for verification.
        </p>
      </div>
    );
  }
}
