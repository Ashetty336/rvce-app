'use client';
import { motion } from 'framer-motion';

export default function AttendanceTabs({ currentTab, onTabChange }) {
  const tabs = [
    { id: 'daily', label: 'Daily Attendance' },
    { id: 'courses', label: 'Course Registration' },
    { id: 'schedule', label: 'Schedule' }
  ];

  return (
    <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg mb-6">
      {tabs.map(tab => (
        <motion.button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex-1 py-2 rounded-md transition-colors ${
            currentTab === tab.id
              ? 'bg-purple-600 text-white'
              : 'text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          {tab.label}
        </motion.button>
      ))}
    </div>
  );
} 