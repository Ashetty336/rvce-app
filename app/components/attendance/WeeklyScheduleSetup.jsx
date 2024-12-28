'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WeeklyScheduleSetup({ courses = [], existingSchedule = {}, onComplete }) {
  const [currentDay, setCurrentDay] = useState('Monday');
  const [schedule, setSchedule] = useState(existingSchedule);

  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    if (existingSchedule && Object.keys(existingSchedule).length > 0) {
      setSchedule(existingSchedule);
    }
  }, [existingSchedule]);

  const addCourseToDay = (courseName) => {
    // Check if the day exists in schedule and if the course is already added
    const daySchedule = schedule[currentDay] || [];
    if (daySchedule.includes(courseName)) {
      return; // Don't add if already exists
    }

    setSchedule(prev => ({
      ...prev,
      [currentDay]: [...(prev[currentDay] || []), courseName]
    }));
  };

  const removeCourseFromDay = (courseName, day) => {
    setSchedule(prev => ({
      ...prev,
      [day]: (prev[day] || []).filter(name => name !== courseName)
    }));
  };

  const handleSubmit = () => {
    const hasSchedule = Object.values(schedule).some(day => day.length > 0);
    if (!hasSchedule) {
      alert('Please add at least one course to your schedule');
      return;
    }
    onComplete(schedule);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Set Up Weekly Schedule</h2>

      <div className="flex space-x-1 bg-gray-700 p-1 rounded-lg mb-6 overflow-x-auto">
        {DAYS.map((day, index) => (
          <motion.button
            key={`day-tab-${day}-${index}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentDay(day)}
            className={`flex-1 py-2 px-4 rounded-md transition-colors whitespace-nowrap ${
              currentDay === day
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-600'
            }`}
          >
            {day}
          </motion.button>
        ))}
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-white mb-4">Available Courses</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {courses.map((course, index) => {
            const isAdded = (schedule[currentDay] || []).includes(course.name);
            return (
              <motion.div
                key={`available-${course.name}-${index}`}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-700 p-4 rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-white">{course.name}</h4>
                    <p className="text-sm text-gray-400">{course.type}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => !isAdded && addCourseToDay(course.name)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      isAdded
                        ? 'bg-green-600/20 text-green-400 cursor-not-allowed'
                        : 'text-purple-400 hover:text-purple-300'
                    }`}
                    disabled={isAdded}
                  >
                    {isAdded ? 'Added' : `Add to ${currentDay}`}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-white mb-4">Weekly Overview</h3>
        <div className="grid gap-4">
          {DAYS.map((day, dayIndex) => (
            <motion.div
              key={`overview-${day}-${dayIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-gray-700 rounded-lg p-4 ${
                currentDay === day ? 'ring-2 ring-purple-500' : ''
              }`}
            >
              <h4 className="font-medium text-white mb-2">{day}</h4>
              {(schedule[day] || []).length > 0 ? (
                <div className="space-y-2">
                  {schedule[day].map((courseName, courseIndex) => {
                    const course = courses.find(c => c.name === courseName);
                    return course && (
                      <motion.div
                        key={`scheduled-${day}-${courseName}-${courseIndex}`}
                        className="flex justify-between items-center text-gray-300"
                      >
                        <div>
                          <span className="text-white">{course.name}</span>
                          <span className="text-sm text-gray-400 ml-2">({course.type})</span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => removeCourseFromDay(courseName, day)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          Remove
                        </motion.button>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-400">No classes scheduled</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg transition-colors"
      >
        Complete Setup
      </motion.button>
    </motion.div>
  );
} 