"use server";

import { db } from "@/lib/prisma";

/**
 * Get doctors by specialty
 */
export async function getDoctorsBySpecialty(specialty) {
  try {
    const normalized = decodeURIComponent(String(specialty || "")).replace(/\s+/g, ' ').trim();

    if (!normalized) {
      return { doctors: [], error: "Missing specialty" };
    }

    // match exact specialty saved on the user record (case-sensitive as stored in DB)
    const doctors = await db.user.findMany({
      where: {
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
        specialty: normalized,
      },
      orderBy: {
        name: "asc",
      },
    });

    return { doctors };
  } catch (error) {
    console.error("Failed to fetch doctors by specialty:", error);
    return { error: "Failed to fetch doctors" };
  }
}


