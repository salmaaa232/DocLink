import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./button";

/**
 * Reusable page header component with back button and title
 *
 * @param {React.ReactNode} props.icon - Icon component to display next to the title
 * @param {string} props.title - Page title
 * @param {string} props.backLink - URL to navigate back to (defaults to home)
 * @param {string} props.backLabel - Text for the back link (defaults to "Back to Home")
 */
export function PageHeader({
  icon,
  title,
  backLink = "/",
  backLabel = "Back to Home",
}) {
  return (
    <div className="mb-0 mt-10">
      {/* Back button */}
      <div className="mb-0">
        <Link href={backLink}>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Button>
        </Link>
      </div>

      <div className="flex flex-col items-center text-center gap-4">
        {icon && (
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50">
            {React.cloneElement(icon, {
              className: "h-8 w-8 text-emerald-600",
            })}
          </div>
        )}

        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">
          {title}
        </h1>
      </div>
    </div>
  );
}
