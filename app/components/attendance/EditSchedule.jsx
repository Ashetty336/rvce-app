'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function EditSchedule({ courses = [], schedule = {}, onSave, onClose }) {
  const [editedSchedule, setEditedSchedule] = useState(schedule);
  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleToggleCourse = (day, courseName) => {
    setEditedSchedule(prev => {
      const dayCourses = prev[day] || [];
      const updatedCourses = dayCourses.includes(courseName)
        ? dayCourses.filter(name => name !== courseName)
        : [...dayCourses, courseName];
      
      return {
        ...prev,
        [day]: updatedCourses
      };
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/attendance/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schedule: editedSchedule })
      });

      if (!response.ok) throw new Error('Failed to update schedule');
      onSave(editedSchedule);
      onClose();
    } catch (error) {
      console.error('Error updating schedule:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
    >
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl">
        <h2 className="text-xl font-bold text-white mb-4">Edit Weekly Schedule</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DAYS.map(day => (
            <div key={day} className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-white mb-3">{day}</h3>
              <div className="space-y-2">
                {courses.map(course => (
                  <label key={course.name} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editedSchedule[day]?.includes(course.name)}
                      onChange={() => handleToggleCourse(day, course.name)}
                      className="form-checkbox h-5 w-5 text-purple-600 rounded"
                    />
                    <span className="text-white">{course.name}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </motion.div>
  );
} 