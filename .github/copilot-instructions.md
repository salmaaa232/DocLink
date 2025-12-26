# Copilot / AI Agent Instructions for DocLink

Quick reference for AI agents working on this repository. Keep answers short and make code edits that follow the patterns below.

## Project snapshot
- Next.js (App Router) app in `app/` (server components by default, interactive UI components use `"use client"`).
- Database: PostgreSQL with Prisma (`prisma/schema.prisma`). Migrations live in `prisma/migrations/`.
- Auth: Clerk (`@clerk/nextjs`) for auth & billing plans.
- Real-time/Video: Vonage Video API (server-side tokens in `actions/appointments.js`).
- UI: Tailwind, Radix primitives, and Sonner for toasts.

## Common commands
- Development: `npm run dev` (Next dev — uses Turbopack)
- Build: `npm run build`
- Run production: `npm run start`
- Lint: `npm run lint`
- Prisma client generation (run automatically on `postinstall`): `npm run postinstall` or `npx prisma generate`
- Apply migrations locally: `npx prisma migrate dev --name <desc>` (or `npx prisma db push` for quick sync)

## Environment & secrets (important)
- Primary env file: `.env`. Key vars used in the repo:
  - `DATABASE_URL` (Postgres, e.g., Neon). Ensure SSL flags present for Neon.
  - `NEXT_PUBLIC_CLERK_*` and `CLERK_SECRET_KEY` for Clerk auth.
  - `NEXT_PUBLIC_VONAGE_APPLICATION_ID` and `VONAGE_PRIVATE_KEY` (path to the private key file, often `lib/private.key`).
- Do NOT commit private keys. If you add files (like Vonage private key) ensure they are added to `.gitignore` or stored in platform secrets.

## Architecture & important patterns (read before you change things)
- App Router + Server Components:
  - Routes are in `app/` and layouts are in `layout.js(x)` files.
  - Where interactive UI is required, files contain `"use client"` (see `components/*` and `app/**/_components/*`).
- Server actions:
  - Server-side actions are under `actions/` and use `"use server"` at the top of the file.
  - Client components import the action and call it (usually via a wrapper `useFetch` hook that accepts the action and uses `FormData` when sending params).
  - Example: `import { bookAppointment } from '@/actions/appointments'` — client uses `FormData` and `useFetch(bookAppointment)`.
- Prisma usage:
  - Single Prisma client instance is exported from `lib/prisma.js` and reused for dev hot reload safety.
  - Update `prisma/schema.prisma` then run `npx prisma migrate dev` and `npx prisma generate`.
- Revalidation:
  - Server actions call `revalidatePath('/some-path')` after mutating data — prefer this pattern over manual cache clearing.
- Authorization:
  - Use `auth()` from `@clerk/nextjs/server` in server actions to get `userId`. Admin checks use a DB lookup (see `actions/admin.js -> verifyAdmin`).
- Credits/Payments:
  - Appointment cost = 2 credits (constant in `actions/credits.js` — `APPOINTMENT_CREDIT_COST`).
  - Credits are stored on the `User` model and transactions recorded in `CreditTransaction`.
  - Payouts are tracked via the `Payout` model (PayPal email stored on model).

## Code conventions & examples
- Error handling: server actions throw meaningful `Error` messages and also `console.error` on failure. Client uses `useFetch` which shows toast via `sonner`.
- Transactions: Use `db.$transaction` to group related DB writes (see `deductCreditsForAppointment`, `cancelAppointment`, `approvePayout`).
- Video calls: create Vonage sessions server-side (`actions/appointments.js -> createVideoSession`) and later generate tokens with expiration via `vonage.video.generateClientToken`.

## PR / editing checklist for AI changes
- If editing database schema: update `prisma/schema.prisma` and include a migration (`npx prisma migrate dev --name <desc>`), update `prisma/migrations/` and run `npx prisma generate`.
- If changing an action that mutates data, ensure `revalidatePath()` is called for affected routes or document why not.
- If adding or changing env var usage, update `.env.example` (repository doesn't currently include one — consider adding it) and document required secrets in PR description.
- Keep server/client boundaries clear: prefer server actions for any server-only logic (auth checks, third-party keys, DB mutations), and keep UI components (`"use client"`) purely presentational/interactive.

## Where to look when debugging
- Dev server console for server action errors and Prisma logs.
- Database state: `psql` or Prisma Studio (`npx prisma studio`) to inspect data models.
- For runtime token/key issues: ensure the key file path in `VONAGE_PRIVATE_KEY` exists and has correct permissions.

---
If anything here is unclear or missing details you rely on (CI, deploy steps, secret names, or additional conventions) tell me what to add and I will iterate. ✅
