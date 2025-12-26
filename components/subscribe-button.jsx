"use client";

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { CheckoutButton } from "@clerk/nextjs/experimental";

export default function SubscribeButton({ planId, planPeriod = "month" }) {
  return (
    <>
      <SignedIn>
        <CheckoutButton
          planId={planId}
          planPeriod={planPeriod}
          newSubscriptionRedirectUrl="/pricing"
        >
          <button className="mt-6 block w-full rounded-lg bg-white px-4 py-2 text-center text-sm font-semibold text-slate-900 hover:bg-slate-50">
            Subscribe
          </button>
        </CheckoutButton>
      </SignedIn>

      <SignedOut>
        <SignInButton mode="modal" forceRedirectUrl="/pricing">
          <button className="mt-6 block w-full rounded-lg bg-white px-4 py-2 text-center text-sm font-semibold text-slate-900 hover:bg-slate-50">
            Sign in to subscribe
          </button>
        </SignInButton>
      </SignedOut>
    </>
  );
}
