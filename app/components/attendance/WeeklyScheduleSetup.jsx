'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function WeeklyScheduleSetup({ courses = [], onComplete = () => {}, existingSchedule = {} }) {
  const [currentDay, setCurrentDay] = useState('Monday');
  const [schedule, setSchedule] = useState(existingSchedule);
  const [error, setError] = useState('');

  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const addCourseToDay = (courseName) => {
    if (schedule[currentDay]?.includes(courseName)) {
      return;
    }

    setSchedule(prev => ({
      ...prev,
      [currentDay]: [...(prev[currentDay] || []), courseName]
    }));
    setError(''); // Clear any existing errors
  };

  const removeCourseFromDay = (courseName, day) => {
    setSchedule(prev => ({
      ...prev,
      [day]: (prev[day] || []).filter(name => name !== courseName)
    }));
  };

  const handleSubmit = async () => {
    try {
      const hasSchedule = Object.values(schedule).some(day => day.length > 0);
      if (!hasSchedule) {
        setError('Please add at least one course to your schedule');
        return;
      }

      // Save schedule to backend with the expected format
      const response = await fetch('/api/attendance/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schedule: schedule,
          type: 'schedule-setup'
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to save schedule');
      }

      // Call onComplete with the schedule data
      if (typeof onComplete === 'function') {
        onComplete(schedule);
      }

    } catch (error) {
      console.error('Error saving schedule:', error);
      setError(error.message || 'Failed to save schedule. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Set Up Weekly Schedule</h2>
      
      {error && (
        <div className="bg-red-500/10 text-red-400 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Day Selection */}
      <div className="flex space-x-1 bg-gray-700 p-1 rounded-lg mb-6">
        {DAYS.map(day => (
          <button
            key={day}
            onClick={() => setCurrentDay(day)}
            className={`flex-1 py-2 rounded-md transition-colors ${
              currentDay === day
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-600'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Available Courses */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-white mb-4">Available Courses</h3>
        <div className="grid gap-4">
          {courses.map(course => {
            const isAdded = schedule[currentDay]?.includes(course.name);
            return (
              <div 
                key={course.name}
                className="bg-gray-700 p-4 rounded-lg flex justify-between items-center"
              >
                <div>
                  <h4 className="text-white font-medium">{course.name}</h4>
                  <p className="text-sm text-gray-400">{course.type}</p>
                </div>
                <button
                  onClick={() => addCourseToDay(course.name)}
                  disabled={isAdded}
                  className={`px-4 py-2 rounded-lg ${
                    isAdded 
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'text-purple-400 hover:text-purple-300'
                  }`}
                >
                  {isAdded ? 'Added' : `Add to ${currentDay}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Overview */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-white mb-4">Weekly Overview</h3>
        <div className="grid gap-4">
          {DAYS.map(day => (
            <div
              key={day}
              className={`bg-gray-700 rounded-lg p-4 ${
                currentDay === day ? 'ring-2 ring-purple-500' : ''
              }`}
            >
              <h4 className="font-medium text-white mb-2">{day}</h4>
              {(schedule[day] || []).length > 0 ? (
                <div className="space-y-2">
                  {schedule[day].map(courseName => {
                    const course = courses.find(c => c.name === courseName);
                    return course && (
                      <div
                        key={`${day}-${courseName}`}
                        className="flex justify-between items-center text-gray-300"
                      >
                        <div>
                          <span className="text-white">{course.name}</span>
                          <span className="text-sm text-gray-400 ml-2">({course.type})</span>
                        </div>
                        <button
                          onClick={() => removeCourseFromDay(courseName, day)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-400">No classes scheduled</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Save Schedule
        </button>
      </div>
    </div>
  );
}