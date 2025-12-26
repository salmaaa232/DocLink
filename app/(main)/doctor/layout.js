import { PageHeader } from '@/components/ui/page-header';
import { Stethoscope } from 'lucide-react';

export const metadata = {
    title: "Doctor Dahboard",
    description: 'Manage your appointments and availabitliy'
};

const DoctorDashboardLayout = ({ children }) => {
  return (
    <div className="container mx-auto px-4 py-8">
        <PageHeader icon={<Stethoscope />} title="Doctor Dashboard" className="text-blue"/>
      {children}
    </div>
  );
};

export default DoctorDashboardLayout;

