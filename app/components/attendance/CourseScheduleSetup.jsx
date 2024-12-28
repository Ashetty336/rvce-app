'use client';
import { useState, useEffect } from 'react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function CourseScheduleSetup({ courses = [], onComplete }) {
  const [currentDay, setCurrentDay] = useState('Monday');
  const [schedule, setSchedule] = useState({});
  const [availableCourses, setAvailableCourses] = useState([]);

  useEffect(() => {
    // Initialize available courses from props
    if (Array.isArray(courses)) {
      setAvailableCourses(courses);
    }
    console.log("Courses received:", courses); // Debug log
  }, [courses]);

  const addCourseToDay = (selectedCourse) => {
    setSchedule(prev => {
      const daySchedule = prev[currentDay] || [];
      if (!daySchedule.includes(selectedCourse.name)) {
        return {
          ...prev,
          [currentDay]: [...daySchedule, selectedCourse.name]
        };
      }
      return prev;
    });
  };

  const removeCourseFromDay = (courseName) => {
    setSchedule(prev => ({
      ...prev,
      [currentDay]: (prev[currentDay] || []).filter(name => name !== courseName)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Day Selection */}
      <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
        {DAYS.map(day => (
          <button
            key={day}
            onClick={() => setCurrentDay(day)}
            className={`flex-1 py-2 rounded-md transition-colors ${
              currentDay === day ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-600'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Available Courses */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Available Courses</h3>
        <div className="space-y-4">
          {availableCourses.map((course) => {
            const isAdded = (schedule[currentDay] || []).includes(course.name);
            return (
              <div
                key={course.name}
                className="bg-gray-700 rounded-lg p-4 flex justify-between items-center"
              >
                <div className="flex-1">
                  <h4 className="text-lg text-white font-medium">{course.name}</h4>
                </div>
                <button
                  onClick={() => addCourseToDay(course)}
                  disabled={isAdded}
                  className={`px-4 py-2 rounded-lg ml-4 ${
                    isAdded ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'
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
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Weekly Overview</h3>
        <div className="space-y-4">
          {DAYS.map(day => (
            <div
              key={day}
              className={`bg-gray-700 rounded-lg p-4 ${
                currentDay === day ? 'ring-2 ring-purple-500' : ''
              }`}
            >
              <h4 className="text-lg font-medium text-white mb-2">{day}</h4>
              {schedule[day]?.length > 0 ? (
                <div className="space-y-2">
                  {schedule[day].map((courseName) => {
                    const course = availableCourses.find(c => c.name === courseName);
                    return course && (
                      <div
                        key={`${day}-${courseName}`}
                        className="flex justify-between items-center bg-gray-600 rounded p-2"
                      >
                        <div>
                          <span className="text-white font-medium">{course.name}</span>
                        </div>
                        <button
                          onClick={() => removeCourseFromDay(courseName)}
                          className="text-red-400 hover:text-red-300 px-2 py-1"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-400">No courses scheduled</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          onClick={() => onComplete(schedule)}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          Save Schedule
        </button>
      </div>
    </div>
  );
}