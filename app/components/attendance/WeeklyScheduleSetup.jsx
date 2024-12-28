'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
    // Prevent adding if already in schedule for this day
    if (schedule[currentDay]?.includes(courseName)) {
      return;
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
    <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Set Up Weekly Schedule</h2>

      {/* Day Selection */}
      <div className="flex space-x-1 bg-gray-700 p-1 rounded-lg mb-6">
        {DAYS.map((day, index) => (
          <button
            key={`day-${index}-${day}`}
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
          {courses.map((course, index) => {
            const isAdded = schedule[currentDay]?.includes(course.name);
            return (
              <div 
                key={`course-${index}-${course.name}`}
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
          {DAYS.map((day, dayIndex) => (
            <div
              key={`overview-${dayIndex}-${day}`}
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
                      <div
                        key={`${day}-${courseName}-${courseIndex}`}
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

      <button
        onClick={handleSubmit}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg transition-colors"
      >
        Complete Setup
      </button>
    </div>
  );
}