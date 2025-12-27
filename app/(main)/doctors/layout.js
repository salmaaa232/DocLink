export const metadata = {
  title: "Find Doctors - MediMeet",
  description: "Browse and book appointments with top healthcare providers",
};

export default async function DoctorsLayout({ children }) {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-10 sm:py-14">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </div>
    </div>
  );
}
