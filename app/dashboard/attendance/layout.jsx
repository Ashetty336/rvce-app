'use client';
import { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../components/DashboardLayout';

export default function AttendanceLayout({ children }) {
  const [activeTab, setActiveTab] = useState('attendance');

  const tabs = [
    { id: 'attendance', label: 'Daily Attendance', path: '/dashboard/attendance' },
    { id: 'registration', label: 'Course Registration', path: '/dashboard/attendance/registration' },
    { id: 'schedule', label: 'Schedule', path: '/dashboard/attendance/schedule' },
    { id: 'stats', label: 'Statistics', path: '/dashboard/attendance/stats' }
  ];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-4">Attendance Management</h1>
          
          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
            {tabs.map(tab => (
              <a
                key={tab.id}
                href={tab.path}
                className={`flex-1 px-4 py-2 text-center rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </a>
            ))}
          </div>
        </div>
        
        {children}
      </div>
    </DashboardLayout>
  );
} 