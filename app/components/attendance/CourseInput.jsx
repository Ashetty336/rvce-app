'use client';
import { useState } from 'react';

export default function CourseInput({ existingCourses = [], onComplete }) {
  const [courses, setCourses] = useState(existingCourses);
  const [newCourseName, setNewCourseName] = useState('');

  const addCourse = () => {
    if (newCourseName.trim()) {
      setCourses([...courses, { 
        id: Date.now(),
        name: newCourseName.trim() 
      }]);
      setNewCourseName('');
    }
  };

  const removeCourse = (courseId) => {
    setCourses(courses.filter(course => course.id !== courseId));
  };

  const handleSubmit = () => {
    const courseNames = courses.map(course => ({ name: course.name }));
    onComplete(courseNames);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-white mb-6">Add Courses</h2>
      
      <div className="space-y-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Course Name"
            value={newCourseName}
            onChange={(e) => setNewCourseName(e.target.value)}
            className="flex-1 bg-gray-700 text-white rounded-lg p-3"
          />
          <button
            onClick={addCourse}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 rounded-lg"
          >
            Add
          </button>
        </div>

        <div className="space-y-3">
          {courses.map(course => (
            <div 
              key={course.id}
              className="flex justify-between items-center bg-gray-700 p-4 rounded-lg"
            >
              <h3 className="text-white font-medium">{course.name}</h3>
              <button
                onClick={() => removeCourse(course.id)}
                className="text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {courses.length > 0 && (
          <button
            onClick={handleSubmit}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
} 