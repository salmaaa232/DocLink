"use server";

import { deductCreditsForAppointment } from "@/actions/credits";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Auth } from "@vonage/auth";
import { Vonage } from "@vonage/server-sdk";
import fs from "fs";
import path from "path";
import { addDays, addMinutes, endOfDay, format, isBefore } from "date-fns";
import { revalidatePath } from "next/cache";

// --- Vonage init (fixed: reads private key from file path) ---
function loadVonagePrivateKey() {
  const value = process.env.VONAGE_PRIVATE_KEY || "";

  // Case 1: user stored PEM directly in env
  if (value.includes("BEGIN PRIVATE KEY") || value.includes("BEGIN RSA PRIVATE KEY")) {
    return value.includes("\\n") ? value.replace(/\\n/g, "\n") : value;
  }

  // Case 2: user stored a file path in env (recommended)
  if (value) {
    const resolvedPath = path.resolve(process.cwd(), value);
    try {
      return fs.readFileSync(resolvedPath, "utf8");
    } catch (e) {
      console.error(
        `Failed to read Vonage private key file at "${resolvedPath}". Check that the file exists and the path is correct.`,
        e
      );
      return "";
    }
  }

  return "";
}

const privateKey = loadVonagePrivateKey();
const applicationId = process.env.VONAGE_APPLICATION_ID || "";

if (!privateKey || !applicationId) {
  console.warn(
    "Vonage credentials missing or incomplete. Ensure VONAGE_APPLICATION_ID and VONAGE_PRIVATE_KEY are set."
  );
}

let vonage = null;
try {
  if (privateKey && applicationId) {
    const credentials = new Auth({
      applicationId,
      privateKey,
    });

    vonage = new Vonage(credentials, {});
  }
} catch (err) {
  console.error(
    "Failed to initialize Vonage client. Check VONAGE_PRIVATE_KEY format (PEM) or file path.",
    err
  );
  vonage = null;
}

/**
 * Book a new appointment with a doctor
 */
export async function bookAppointment(formData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Get the patient user
    const patient = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "PATIENT",
      },
    });

    if (!patient) {
      throw new Error("Patient not found");
    }

    // Parse form data
    const doctorId = formData.get("doctorId");
    const startTime = new Date(formData.get("startTime"));
    const endTime = new Date(formData.get("endTime"));
    const patientDescription = formData.get("description") || null;

    // Validate input
    if (!doctorId || !startTime || !endTime) {
      throw new Error("Doctor, start time, and end time are required");
    }

    // Check if the doctor exists and is verified
    const doctor = await db.user.findUnique({
      where: {
        id: doctorId,
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
      },
    });

    if (!doctor) {
      throw new Error("Doctor not found or not verified");
    }

    // Check if the patient has enough credits (2 credits per appointment)
    if (patient.credits < 2) {
      throw new Error("Insufficient credits to book an appointment");
    }

    // ✅ Simpler + correct overlap logic
    const overlappingAppointment = await db.appointment.findFirst({
      where: {
        doctorId,
        status: "SCHEDULED",
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
    });

    if (overlappingAppointment) {
      throw new Error("This time slot is already booked");
    }

    // Create a new Vonage Video API session
    const sessionId = await createVideoSession();

    // Deduct credits from patient and add to doctor
    const { success, error } = await deductCreditsForAppointment(patient.id, doctor.id);

    if (!success) {
      throw new Error(error || "Failed to deduct credits");
    }

    // Create the appointment with the video session ID
    const appointment = await db.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: doctor.id,
        startTime,
        endTime,
        patientDescription,
        status: "SCHEDULED",
        videoSessionId: sessionId,
      },
    });

    revalidatePath("/appointments");
    return { success: true, appointment };
  } catch (error) {
    console.error("Failed to book appointment:", error);
    throw new Error("Failed to book appointment: " + (error?.message || String(error)));
  }
}

/**
 * Generate a Vonage Video API session
 */
async function createVideoSession() {
  if (!vonage) {
    throw new Error(
      "Vonage client not initialized. Check VONAGE_APPLICATION_ID and VONAGE_PRIVATE_KEY."
    );
  }

  try {
    const session = await vonage.video.createSession({ mediaMode: "routed" });
    return session.sessionId;
  } catch (error) {
    console.error("Vonage createSession failed:", error);

    const msg = error?.message || String(error);
    if (msg.includes("secretOrPrivateKey must be an asymmetric key")) {
      throw new Error(
        "Failed to create video session: Invalid private key. Ensure VONAGE_PRIVATE_KEY points to a PEM private key file (recommended) OR contains the PEM text with -----BEGIN PRIVATE KEY-----."
      );
    }

    throw new Error("Failed to create video session: " + msg);
  }
}

/**
 * Generate a token for a video session
 */
export async function generateVideoToken(formData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const appointmentId = formData.get("appointmentId");
    if (!appointmentId) throw new Error("Appointment ID is required");

    const appointment = await db.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) throw new Error("Appointment not found");

    if (appointment.doctorId !== user.id && appointment.patientId !== user.id) {
      throw new Error("You are not authorized to join this call");
    }

    if (appointment.status !== "SCHEDULED") {
      throw new Error("This appointment is not currently scheduled");
    }

    const now = new Date();
    const appointmentStart = new Date(appointment.startTime);
    const timeDifference = (appointmentStart - now) / (1000 * 60);

    if (timeDifference > 30) {
      throw new Error("The call will be available 30 minutes before the scheduled time");
    }

    if (!vonage) {
      throw new Error("Vonage client not initialized. Check server env vars.");
    }

    const appointmentEnd = new Date(appointment.endTime);
    const expirationTime = Math.floor(appointmentEnd.getTime() / 1000) + 60 * 60; // 1 hour after end

    const connectionData = JSON.stringify({
      name: user.name,
      role: user.role,
      userId: user.id,
    });

    const token = vonage.video.generateClientToken(appointment.videoSessionId, {
      role: "publisher",
      expireTime: expirationTime,
      data: connectionData,
    });

    await db.appointment.update({
      where: { id: appointmentId },
      data: { videoSessionToken: token },
    });

    return {
      success: true,
      videoSessionId: appointment.videoSessionId,
      token,
    };
  } catch (error) {
    console.error("Failed to generate video token:", error);
    throw new Error("Failed to generate video token: " + (error?.message || String(error)));
  }
}

/**
 * Get doctor by ID
 */
export async function getDoctorById(doctorId) {
  try {
    const doctor = await db.user.findUnique({
      where: {
        id: doctorId,
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
      },
    });

    if (!doctor) throw new Error("Doctor not found");

    return { doctor };
  } catch (error) {
    console.error("Failed to fetch doctor:", error);
    throw new Error("Failed to fetch doctor details");
  }
}

/**
 * Get available time slots for booking for the next 4 days
 */
export async function getAvailableTimeSlots(doctorId) {
  try {
    const doctor = await db.user.findUnique({
      where: {
        id: doctorId,
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
      },
    });

    if (!doctor) {
      throw new Error("Doctor not found or not verified");
    }

    const availability = await db.availability.findFirst({
      where: {
        doctorId: doctor.id,
        status: "AVAILABLE",
      },
    });

    const now = new Date();
    const days = [now, addDays(now, 1), addDays(now, 2), addDays(now, 3)];

    if (!availability) {
      return {
        days: days.map((date) => ({
          date: format(date, "yyyy-MM-dd"),
          displayDate: format(date, "EEEE, MMMM d"),
          slots: [],
        })),
      };
    }

    const lastDay = endOfDay(days[3]);
    const existingAppointments = await db.appointment.findMany({
      where: {
        doctorId: doctor.id,
        status: "SCHEDULED",
        startTime: { lte: lastDay },
      },
    });

    const availableSlotsByDay = {};

    for (const day of days) {
      const dayString = format(day, "yyyy-MM-dd");
      availableSlotsByDay[dayString] = [];

      const availabilityStart = new Date(availability.startTime);
      const availabilityEnd = new Date(availability.endTime);

      availabilityStart.setFullYear(day.getFullYear(), day.getMonth(), day.getDate());
      availabilityEnd.setFullYear(day.getFullYear(), day.getMonth(), day.getDate());

      let current = new Date(availabilityStart);
      const end = new Date(availabilityEnd);

      while (isBefore(addMinutes(current, 30), end) || +addMinutes(current, 30) === +end) {
        const next = addMinutes(current, 30);

        if (isBefore(current, now)) {
          current = next;
          continue;
        }

        const overlaps = existingAppointments.some((appointment) => {
          const aStart = new Date(appointment.startTime);
          const aEnd = new Date(appointment.endTime);
          return current < aEnd && next > aStart;
        });

        if (!overlaps) {
          availableSlotsByDay[dayString].push({
            startTime: current.toISOString(),
            endTime: next.toISOString(),
            formatted: `${format(current, "h:mm a")} - ${format(next, "h:mm a")}`,
            day: format(current, "EEEE, MMMM d"),
          });
        }

        current = next;
      }
    }

    const result = Object.entries(availableSlotsByDay).map(([date, slots]) => ({
      date,
      displayDate: slots.length > 0 ? slots[0].day : format(new Date(date), "EEEE, MMMM d"),
      slots,
    }));

    return { days: result };
  } catch (error) {
    console.error("Failed to fetch available slots:", error);
    throw new Error("Failed to fetch available time slots: " + (error?.message || String(error)));
  }
}
