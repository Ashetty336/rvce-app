'use client';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import DashboardLayout from '../components/DashboardLayout';
import Link from 'next/link';

function FeatureCard({ title, description, icon, href }) {
  return (
    <Link href={href}>
      <div className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer border border-gray-700 hover:border-purple-500">
        <div className="text-3xl mb-4">{icon}</div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </Link>
  );
}

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect('/');
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome, {session.user.username}</h1>
          <p className="text-gray-400">Access your student portal features below</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            title="Attendance & Registration"
            description="View attendance, register for courses, and check your schedule"
            icon="📊"
            href="/dashboard/attendance"
          />
          <FeatureCard 
            title="Email Updates"
            description="Stay informed with important announcements and notifications"
            icon="📧"
            href="/dashboard/updates"
          />
          <FeatureCard 
            title="EL Team Finder"
            description="Find and connect with team members for projects"
            icon="👥"
            href="/dashboard/team-finder"
          />
          <FeatureCard 
            title="Important Links"
            description="Quick access to essential RVCE resources and portals"
            icon="🔗"
            href="/dashboard/links"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

function QuickLink({ title, icon, href }) {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
    >
      <span className="text-xl mr-2">{icon}</span>
      <span className="text-sm text-gray-200">{title}</span>
    </a>
  );
} 