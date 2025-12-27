export const metadata = {
  title: "Find Doctors - MediMeet",
  description: "Browse and book appointments with top healthcare providers",
};

export default async function DoctorsLayout({ children }) {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-10 sm:py-14">
        <div className="mx-auto w-full max-w-6xl">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-[#dff1f1] p-6 shadow-sm sm:p-10">
            {/* decorative circles (same vibe as home) */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-teal-900/10" />
            <div className="pointer-events-none absolute -left-24 -bottom-24 h-80 w-80 rounded-full bg-teal-900/10" />

            <div className="relative z-10">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
