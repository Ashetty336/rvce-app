'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CourseInput({ existingCourses = [], onComplete }) {
  const [courses, setCourses] = useState([
    { id: Date.now(), name: '', type: '' }
  ]);

  useEffect(() => {
    if (existingCourses && existingCourses.length > 0) {
      setCourses(existingCourses.map(course => ({
        ...course,
        name: course.name || '',
        type: course.type || '',
        id: Date.now() + Math.random() // Ensure unique IDs
      })));
    }
  }, [existingCourses]);

  const handleInputChange = (id, field, value) => {
    setCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === id ? { ...course, [field]: value || '' } : course
      )
    );
  };

  const addCourse = () => {
    setCourses(prev => [
      ...prev,
      { id: Date.now(), name: '', type: '' }
    ]);
  };

  const removeCourse = (id) => {
    if (courses.length <= 1) {
      return; // Don't remove if it's the last course
    }
    setCourses(prev => prev.filter(course => course.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate courses with null checks
    const isValid = courses.every(course => {
      const name = course.name?.trim() || '';
      const type = course.type?.trim() || '';
      return name !== '' && type !== '';
    });

    if (!isValid) {
      alert('Please fill in all course details');
      return;
    }

    // Clean the data before submitting
    const cleanedCourses = courses.map(({ id, ...course }) => ({
      name: course.name?.trim() || '',
      type: course.type?.trim() || ''
    }));
    
    onComplete(cleanedCourses);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Add Your Courses</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {courses.map((course) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-700 p-4 rounded-lg space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Course Name
                </label>
                <input
                  type="text"
                  value={course.name || ''}
                  onChange={(e) => handleInputChange(course.id, 'name', e.target.value)}
                  className="w-full bg-gray-600 border border-gray-500 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g. Computer Science"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Course Type
                </label>
                <select
                  value={course.type || ''}
                  onChange={(e) => handleInputChange(course.id, 'type', e.target.value)}
                  className="w-full bg-gray-600 border border-gray-500 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Theory">Theory</option>
                  <option value="Lab">Lab</option>
                </select>
              </div>
            </div>
            
            {courses.length > 1 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => removeCourse(course.id)}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Remove Course
              </motion.button>
            )}
          </motion.div>
        ))}

        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={addCourse}
            className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            Add Another Course
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
          >
            Continue to Schedule
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
} 