'use client';
import { useState } from 'react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function CourseScheduleSetup({ courses = [], onComplete }) {
  const [currentDay, setCurrentDay] = useState('Monday');
  const [schedule, setSchedule] = useState({});

  // Ensure courses is always an array
  const coursesList = Array.isArray(courses) ? courses : [];

  const addCourseToDay = (courseCode) => {
    setSchedule(prev => ({
      ...prev,
      [currentDay]: [...(prev[currentDay] || []), courseCode]
    }));
  };

  const removeCourseFromDay = (courseCode) => {
    setSchedule(prev => ({
      ...prev,
      [currentDay]: (prev[currentDay] || []).filter(code => code !== courseCode)
    }));
  };

  const handleSubmit = () => {
    // Validate schedule before completing
    const hasSchedule = Object.keys(schedule).length > 0;
    if (!hasSchedule) {
      alert('Please add at least one course to your schedule');
      return;
    }
    onComplete(schedule);
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Set Up Weekly Schedule</h2>

      {/* Day Selection Tabs */}
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

      {/* Course Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-white mb-4">Select Courses for {currentDay}</h3>
        {coursesList.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {coursesList.map(course => {
              const isSelected = (schedule[currentDay] || []).includes(course.code);
              return (
                <button
                  key={course.code}
                  onClick={() => isSelected ? 
                    removeCourseFromDay(course.code) : 
                    addCourseToDay(course.code)
                  }
                  className={`p-4 rounded-lg text-left transition-colors ${
                    isSelected
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <div className="font-medium">{course.name}</div>
                  <div className="text-sm opacity-80">{course.type}</div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-700 rounded-lg">
            <p className="text-gray-400">No courses available. Please add courses first.</p>
          </div>
        )}
      </div>

      {/* Schedule Preview */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-white mb-3">Schedule Preview</h3>
        <div className="grid gap-4">
          {DAYS.map(day => (
            <div key={day} className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">{day}</h4>
              {(schedule[day] || []).length > 0 ? (
                <div className="space-y-2">
                  {(schedule[day] || []).map(courseCode => {
                    const course = coursesList.find(c => c.code === courseCode);
                    return course ? (
                      <div key={courseCode} className="text-gray-300">
                        {course.name}
                      </div>
                    ) : null;
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