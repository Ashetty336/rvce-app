'use client';
import { useState } from 'react';

export default function QuickUpdate({ courses, onUpdate, onClose }) {
  const [updates, setUpdates] = useState(
    courses.reduce((acc, course) => ({
      ...acc,
      [course.code]: {
        totalClasses: course.totalClasses || 0,
        attendedClasses: course.attendedClasses || 0
      }
    }), {})
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/attendance/bulk-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      });

      if (response.ok) {
        onUpdate(updates);
        onClose();
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
      alert('Failed to update attendance. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Quick Update Attendance</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {courses.map(course => (
            <div key={course.code} className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-white font-medium mb-4">{course.name}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Total Classes
                  </label>
                  <input
                    type="number"
                    value={updates[course.code].totalClasses}
                    onChange={(e) => setUpdates(prev => ({
                      ...prev,
                      [course.code]: {
                        ...prev[course.code],
                        totalClasses: parseInt(e.target.value)
                      }
                    }))}
                    className="w-full bg-gray-600 border border-gray-500 text-white rounded-lg p-2.5"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Classes Attended
                  </label>
                  <input
                    type="number"
                    value={updates[course.code].attendedClasses}
                    onChange={(e) => setUpdates(prev => ({
                      ...prev,
                      [course.code]: {
                        ...prev[course.code],
                        attendedClasses: parseInt(e.target.value)
                      }
                    }))}
                    className="w-full bg-gray-600 border border-gray-500 text-white rounded-lg p-2.5"
                    min="0"
                    max={updates[course.code].totalClasses}
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
            >
              Save Updates
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 