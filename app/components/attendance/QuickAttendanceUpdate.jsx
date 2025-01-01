'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function QuickAttendanceUpdate({ courses = [], onUpdate, onClose, branch, semester }) {
  const [courseData, setCourseData] = useState(
    courses.reduce((acc, course) => ({
      ...acc,
      [course.name]: { 
        totalClasses: 0,
        attendedClasses: 0,
        lastUpdated: new Date().toISOString().split('T')[0]
      }
    }), {})
  );

  const handleInputChange = (courseName, field, value) => {
    const numValue = parseInt(value) || 0;
    setCourseData(prev => ({
      ...prev,
      [courseName]: {
        ...prev[courseName],
        [field]: field === 'lastUpdated' ? value : Math.max(0, numValue)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    for (const [courseName, data] of Object.entries(courseData)) {
      if (data.attendedClasses > data.totalClasses) {
        alert(`${courseName}: Attended classes cannot be more than total classes`);
        return;
      }
    }

    try {
      const response = await fetch('/api/attendance/bulk-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          courseData,
          branch,
          semester
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update attendance');
      }
      
      // Pass the courseData directly to onUpdate
      if (typeof onUpdate === 'function') {
        onUpdate(courseData);
      }
      onClose();
    } catch (error) {
      console.error('Error updating attendance:', error);
      alert('Failed to update attendance. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Quick Setup Attendance</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">
              Update attendance until date
            </label>
            <input
              type="date"
              className="w-full bg-gray-600 text-white rounded px-3 py-2"
              onChange={(e) => {
                Object.keys(courseData).forEach(courseName => {
                  handleInputChange(courseName, 'lastUpdated', e.target.value);
                });
              }}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          {courses.map(course => (
            <div key={course.name} className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-white mb-4">{course.name}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Total Classes
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={courseData[course.name].totalClasses}
                    onChange={(e) => handleInputChange(course.name, 'totalClasses', e.target.value)}
                    className="w-full bg-gray-600 text-white rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Classes Attended
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={courseData[course.name].totalClasses}
                    value={courseData[course.name].attendedClasses}
                    onChange={(e) => handleInputChange(course.name, 'attendedClasses', e.target.value)}
                    className="w-full bg-gray-600 text-white rounded px-3 py-2"
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              Update Attendance
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
} 