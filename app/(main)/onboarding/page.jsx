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

  const { loading, data, fn: submitUserRole } = useFetch(setUserRole);

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

  const specialtyValue = watch("specialty");

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
  }, [data, router]);

  const onDoctorSubmit = async (form) => {
    if (loading) return;

    const formData = new FormData();
    formData.append("role", "DOCTOR");
    formData.append("specialty", form.specialty);
    formData.append("experience", form.experience.toString());
    formData.append("credentialUrl", form.credentialUrl);
    formData.append("description", form.description);

    await submitUserRole(formData);
  };

  // Role selection screen
  if (step === "choose-role") {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Patient */}
          <Card
            className="
              group relative cursor-pointer overflow-hidden
              rounded-3xl border border-slate-200 bg-white/70 shadow-sm
              transition hover:shadow-md hover:border-teal-200
            "
            onClick={() => !loading && handlePatientSelection()}
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-teal-50/70 via-transparent to-transparent" />
            <CardContent className="relative flex flex-col items-center px-8 pb-7 pt-8 text-center">
              <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 ring-1 ring-teal-200">
                <User className="h-8 w-8 text-teal-800" />
              </div>

              <CardTitle className="mb-2 text-2xl font-extrabold tracking-tight text-slate-900">
                Join as a Patient
              </CardTitle>

              <CardDescription className="mb-6 max-w-sm text-sm leading-6 text-slate-600">
                Book appointments, consult with doctors, and manage your
                healthcare journey.
              </CardDescription>

              <Button
                className="w-full rounded-xl bg-teal-800 py-6 text-sm font-semibold text-white hover:bg-teal-700 shadow-sm"
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

              <div className="mt-4 text-xs text-slate-500">
                No extra details required
              </div>
            </CardContent>
          </Card>

          {/* Doctor */}
          <Card
            className="
              group relative cursor-pointer overflow-hidden
              rounded-3xl border border-slate-200 bg-white/70 shadow-sm
              transition hover:shadow-md hover:border-teal-200
            "
            onClick={() => !loading && setStep("doctor-form")}
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-teal-50/70 via-transparent to-transparent" />
            <CardContent className="relative flex flex-col items-center px-8 pb-7 pt-8 text-center">
              <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 ring-1 ring-teal-200">
                <Stethoscope className="h-8 w-8 text-teal-800" />
              </div>

              <CardTitle className="mb-2 text-2xl font-extrabold tracking-tight text-slate-900">
                Join as a Doctor
              </CardTitle>

              <CardDescription className="mb-6 max-w-sm text-sm leading-6 text-slate-600">
                Create your professional profile, set your availability, and
                provide consultations.
                and earn credits.
              </CardDescription>

              <Button
                className="w-full rounded-xl bg-teal-800 py-6 text-sm font-semibold text-white hover:bg-teal-700 shadow-sm"
                disabled={loading}
              >
                Continue as Doctor
              </Button>

              <div className="mt-4 text-xs text-slate-500">
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
        <Card className="rounded-3xl border border-slate-200 bg-white/70 shadow-sm">
          <CardContent className="px-7 pb-8 pt-8 sm:px-10">
            <div className="mb-8">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-teal-100 ring-1 ring-teal-200">
                  <Stethoscope className="h-5 w-5 text-teal-800" />
                </div>

                <div>
                  <CardTitle className="text-2xl font-extrabold tracking-tight text-slate-900">
                    Complete Your Doctor Profile
                  </CardTitle>
                  <CardDescription className="mt-1 text-sm text-slate-600">
                    Provide your professional details for verification.
                  </CardDescription>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onDoctorSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="specialty" className="text-slate-900">
                  Medical Specialty
                </Label>

                <Select
                  value={specialtyValue}
                  onValueChange={(value) => setValue("specialty", value)}
                >
                  <SelectTrigger
                    id="specialty"
                    className="h-11 border-slate-200 bg-white focus:ring-2 focus:ring-teal-500/20"
                  >
                    <SelectValue placeholder="Select your specialty" />
                  </SelectTrigger>

                  <SelectContent className="border-slate-200">
                    {SPECIALTIES.map((spec) => (
                      <SelectItem
                        key={spec.name}
                        value={spec.name}
                        className="flex items-center gap-2"
                      >
                        <span className="text-teal-800">{spec.icon}</span>
                        {spec.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {errors.specialty && (
                  <p className="mt-1 text-sm font-medium text-red-600">
                    {errors.specialty.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience" className="text-slate-900">
                  Years of Experience
                </Label>
                <Input
                  id="experience"
                  type="number"
                  placeholder="e.g. 5"
                  className="h-11 border-slate-200 bg-white focus-visible:ring-2 focus-visible:ring-teal-500/20"
                  {...register("experience", { valueAsNumber: true })}
                />
                {errors.experience && (
                  <p className="mt-1 text-sm font-medium text-red-600">
                    {errors.experience.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="credentialUrl" className="text-slate-900">
                  Link to Credential Document
                </Label>
                <Input
                  id="credentialUrl"
                  type="url"
                  placeholder="https://example.com/my-medical-degree.pdf"
                  className="h-11 border-slate-200 bg-white focus-visible:ring-2 focus-visible:ring-teal-500/20"
                  {...register("credentialUrl")}
                />
                {errors.credentialUrl && (
                  <p className="mt-1 text-sm font-medium text-red-600">
                    {errors.credentialUrl.message}
                  </p>
                )}
                <p className="text-sm text-slate-500">
                  Add a link to your medical degree, license, or certification.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-900">
                  Description of Your Services
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your expertise, services, and approach to patient care..."
                  rows={4}
                  className="min-h-[110px] border-slate-200 bg-white focus-visible:ring-2 focus-visible:ring-teal-500/20"
                  {...register("description")}
                />
                {errors.description && (
                  <p className="mt-1 text-sm font-medium text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("choose-role")}
                  className="border-slate-200 bg-white hover:bg-slate-50"
                  disabled={loading}
                >
                  Back
                </Button>

                <Button
                  type="submit"
                  className="bg-teal-800 text-white hover:bg-teal-700 shadow-sm"
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

        <p className="mt-4 text-xs text-slate-500">
          By submitting, you confirm your details are accurate and may be
          reviewed for verification.
        </p>
      </div>
    );
  }

  return null;
}
