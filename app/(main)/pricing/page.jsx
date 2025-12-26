// app/pricing/page.jsx
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PricingTable } from "@clerk/nextjs";

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="flex justify-start mb-2">
        <Link
          href="/"
          className="flex items-center text-muted-foreground hover:text-black transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>

      <div className="max-w-full mx-auto mb-12 text-center">
        <Badge
          variant="outline"
          className="bg-emerald-400/30 border-emerald-700/30 px-4 py-1 text-emerald-900 text-sm font-medium mb-4"
        >
          Affordable Healthcare
        </Badge>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Clear & Flexible Plans
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Select the consultation package tailored to your healthcare needs — no hidden costs, no binding contracts.
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <PricingTable newSubscriptionRedirectUrl="/pricing?subscribed=1" />
      </div>

      <div className="max-w-3xl mx-auto mt-16 text-center">
        <h2 className="text-2xl font-bold text-black mb-2">
          If you have any questions
        </h2>
        <p className="text-muted-foreground mb-4">
          Contact our support team at EJUST HeadQuarters,<br /> we're here to help!
        </p>
      </div>
    </div>
  );
}
