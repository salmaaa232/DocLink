import { getCurrentUser } from "@/actions/onboarding";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, ClipboardCheck, XCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const VerificationPage = async () => {
  const user = await getCurrentUser();

  if (user?.verificationStatus === "VERIFIED") {
    redirect("/doctor");
  }

  const isRejected = user?.verificationStatus === "REJECTED";

  return (
    <div className="container mx-auto px-4 mt-3 ">
      <Card className="mx-auto w-full max-w-xl border border-gray-200 shadow-sm bg-gray-50">
        <CardHeader className="text-center space-y-3 pb-4 px-4 sm:px-6">
          <div
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full border ${
              isRejected
                ? "bg-red-50 border-red-200"
                : "bg-amber-50 border-amber-200"
            }`}
          >
            {isRejected ? (
              <XCircle className="h-8 w-8 text-red-500" />
            ) : (
              <ClipboardCheck className="h-8 w-8 text-amber-500" />
            )}
          </div>

          <CardTitle className="text-2xl font-semibold text-gray-900">
            {isRejected ? "Verification Declined" : "Verification in Progress"}
          </CardTitle>

          <CardDescription className="text-sm text-gray-600 max-w-md mx-auto">
            {isRejected
              ? "Your application needs some revisions before approval."
              : "Thanks for submitting your information. Our team is reviewing it."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 text-center px-4 sm:px-6 pb-6">
          {isRejected ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-left">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-500 mt-1" />
                <div className="text-sm text-gray-700">
                  <p className="mb-2">
                    Our administrative team reviewed your application and found
                    that it doesn&apos;t meet our current requirements. Common
                    reasons include:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 mb-2">
                    <li>Unclear or missing credential documents</li>
                    <li>Professional experience requirements not met</li>
                    <li>Incomplete service details</li>
                  </ul>
                  <p>
                    You can update your profile and resubmit for verification.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-left">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500 mt-1" />
                <p className="text-sm text-gray-700">
                  Your profile is currently under review. This usually takes
                  1–2 business days. You&apos;ll receive an email once your
                  account is verified.
                </p>
              </div>
            </div>
          )}

          <p className="text-sm text-gray-600 max-w-md mx-auto">
            {isRejected
              ? "Update your doctor profile to improve your chances of approval."
              : "While you wait, feel free to explore the platform or contact support if you have any questions."}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button asChild variant="outline">
              <Link href="/">Return to Home</Link>
            </Button>

            {isRejected ? (
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/doctor/update-profile">Update Profile</Link>
              </Button>
            ) : (
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/contact-support">Contact Support</Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationPage;
