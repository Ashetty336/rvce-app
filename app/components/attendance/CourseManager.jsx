import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CourseManager({ 
  existingCourses = [], 
  onComplete, 
  onClose,
  isModal = false 
}) {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ name: '', type: 'theory' });

  useEffect(() => {
    if (existingCourses?.length > 0 && !courses.length) {
      setCourses(existingCourses);
    }
  }, [existingCourses]);

  const handleAddCourse = (e) => {
    e?.preventDefault();
    if (!newCourse.name.trim()) {
      alert('Please enter a course name');
      return;
    }

    // Check for duplicates
    if (courses.some(course => course.name.toLowerCase() === newCourse.name.toLowerCase())) {
      alert('This course already exists');
      return;
    }

    setCourses(prev => [...prev, { ...newCourse }]);
    setNewCourse({ name: '', type: 'theory' });
  };

  const handleRemoveCourse = (courseName) => {
    setCourses(prev => prev.filter(course => course.name !== courseName));
  };

  const handleSave = async () => {
    if (courses.length === 0) {
      alert('Please add at least one course');
      return;
    }

    try {
      const response = await fetch('/api/attendance/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courses })
      });

      if (!response.ok) throw new Error('Failed to update courses');
      
      if (onComplete) {
        onComplete(courses);
      }
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error updating courses:', error);
      alert('Failed to save courses. Please try again.');
    }
  };

  const content = (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Manage Courses</h2>
      
      <form onSubmit={handleAddCourse} className="space-y-4 mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={newCourse.name}
            onChange={(e) => setNewCourse(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Course name"
            className="flex-1 bg-gray-700 text-white rounded px-4 py-2"
          />
          <select
            value={newCourse.type}
            onChange={(e) => setNewCourse(prev => ({ ...prev, type: e.target.value }))}
            className="bg-gray-700 text-white rounded px-4 py-2"
          >
            <option value="theory">Theory</option>
            <option value="lab">Lab</option>
          </select>
          <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
          >
            Add
          </button>
        </div>
      </form>

      <div className="space-y-4 max-h-[40vh] overflow-y-auto">
        {courses.map((course, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex justify-between items-center bg-gray-700 rounded p-4"
          >
            <div>
              <span className="text-white">{course.name}</span>
              <span className="text-sm text-gray-400 ml-2">({course.type})</span>
            </div>
            <button
              onClick={() => handleRemoveCourse(course.name)}
              className="text-red-400 hover:text-red-300"
            >
              Remove
            </button>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-end gap-4">
        {isModal && (
          <button
            onClick={onClose}
            className="px-6 py-2 rounded bg-gray-700 text-white hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSave}
          className="bg-purple-600 text-white px-8 py-2 rounded hover:bg-purple-700"
        >
          {isModal ? 'Save Changes' : 'Continue'}
        </button>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
      >
        <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
          {content}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl shadow-lg p-6">
      {content}
    </div>
  );
} 