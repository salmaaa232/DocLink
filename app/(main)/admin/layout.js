import { verifyAdmin } from "@/actions/admin";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CreditCard, ShieldCheck, Users } from "lucide-react";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin Settings - DocLink",
  descrpition: "Manage platform settings",
};

export default async function AdminLayout({ children }) {
  const isAdmin = await verifyAdmin();

  if (!isAdmin) {
    redirect("/onboarding");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader icon={<ShieldCheck />} title="Admin Settings" />

      {/* Horizontal tabs */}
      <Tabs defaultValue="pending" className="mt-6">
        <TabsList className="flex gap-2 bg-gray-100 border border-gray-200 rounded-md p-1">
          <TabsTrigger
            value="pending"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-200 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 rounded-md transition"
          >
            <AlertCircle className="h-4 w-4" />
            <span>Pending Verification</span>
          </TabsTrigger>
          <TabsTrigger
            value="doctors"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-200 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 rounded-md transition"
          >
            <Users className="h-4 w-4" />
            <span>Doctors</span>
          </TabsTrigger>
          <TabsTrigger
            value="payouts"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-200 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 rounded-md transition"
          >
            <CreditCard className="h-4 w-4" />
            <span>Payouts</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab content */}
        <div className="mt-4">{children}</div>
      </Tabs>
    </div>
  );
}
