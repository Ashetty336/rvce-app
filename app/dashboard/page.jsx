'use client';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import DashboardLayout from '../components/DashboardLayout';
import Link from 'next/link';
import { motion } from 'framer-motion';
import LoadingScreen from '../components/LoadingScreen';

function Background() {
  return (
    <div className="fixed inset-0 -z-10 bg-black">
      {/* Black background */}
    </div>
  );
}

function FeatureCard({ title, description, icon, href }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={href}>
        <div className="p-6 rounded-lg bg-gray-900/50 backdrop-blur-sm hover:bg-gray-800/50 transition-all duration-300 border border-gray-700/50">
          <div className="text-3xl mb-4 text-white">
            {icon}
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
          <p className="text-gray-300">{description}</p>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <LoadingScreen />;
  }

  if (!session) {
    redirect('/');
  }

  return (
    <DashboardLayout>
      <Background />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-6 max-w-7xl mx-auto relative z-10"
      >
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 text-center"
        >
          <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
            Welcome, {session.user.username}
          </h1>
          <p className="text-gray-300 text-xl">Access your student portal features below</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      </motion.div>
    </DashboardLayout>
  );
}