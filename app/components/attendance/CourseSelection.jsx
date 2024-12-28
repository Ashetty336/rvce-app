'use client';
import { useState, useEffect } from 'react';
import { fetchCourseData } from '@/utils/scraper';

export default function CourseSelection({ selectedCourses, onCoursesChange }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await fetchCourseData();
        setCourses(data);
      } catch (err) {
        setError('Failed to load course data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-white mb-4">Course Selection</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course) => (
          <div key={course.code} className="bg-gray-700 p-4 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-white">{course.name}</h3>
                <p className="text-gray-400">Code: {course.code}</p>
                <div className="mt-2">
                  <p className="text-sm text-gray-400">Faculty: {course.faculty}</p>
                  <p className="text-sm text-gray-400">Email: {course.email}</p>
                  <p className="text-sm text-gray-400">Phone: {course.phone}</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={selectedCourses.some(c => c.code === course.code)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onCoursesChange([...selectedCourses, course]);
                  } else {
                    onCoursesChange(selectedCourses.filter(c => c.code !== course.code));
                  }
                }}
                className="h-5 w-5 accent-purple-600"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 