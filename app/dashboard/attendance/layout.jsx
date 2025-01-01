'use client';
import DashboardLayout from '../../components/DashboardLayout';

export default function AttendanceLayout({ children }) {
  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {children}
      </div>
    </DashboardLayout>
  );
} 