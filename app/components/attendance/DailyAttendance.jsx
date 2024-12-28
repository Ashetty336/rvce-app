'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DailyAttendance({ courses = [], schedule = {}, onEditCourses, onEditSchedule }) {
  const [todayCourses, setTodayCourses] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch('/api/attendance/stats');
        const data = await response.json();
        const initialAttendance = courses.reduce((acc, course) => ({
          ...acc,
          [course.name]: data.attendance?.[course.name] || {
            totalClasses: 0,
            attendedClasses: 0
          }
        }), {});
        setAttendance(initialAttendance);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching attendance:', error);
        setLoading(false);
      }
    };

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todaySchedule = schedule[today] || [];
    const todaysCourseDetails = todaySchedule
      .map(courseName => courses.find(c => c.name === courseName))
      .filter(Boolean);
    
    setTodayCourses(todaysCourseDetails);
    fetchAttendance();
  }, [courses, schedule]);

  const calculatePercentage = (courseName) => {
    const stats = attendance[courseName] || { totalClasses: 0, attendedClasses: 0 };
    if (stats.totalClasses === 0) return 0;
    return Math.round((stats.attendedClasses / stats.totalClasses) * 100);
  };

  const handleAttendanceUpdate = async (courseName, status) => {
    try {
      const response = await fetch('/api/attendance/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseName,
          date: new Date().toISOString(),
          status
        }),
      });

      if (response.ok) {
        setAttendance(prev => ({
          ...prev,
          [courseName]: {
            ...prev[courseName],
            totalClasses: (prev[courseName]?.totalClasses || 0) + 1,
            attendedClasses: status === 'present' ? 
              (prev[courseName]?.attendedClasses || 0) + 1 : 
              (prev[courseName]?.attendedClasses || 0)
          }
        }));
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Today's Classes</h2>
        <div className="space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEditCourses}
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            Edit Courses
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEditSchedule}
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            Edit Schedule
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {todayCourses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-700 rounded-lg p-6 text-center"
          >
            <p className="text-gray-300">No classes scheduled for today</p>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {todayCourses.map(course => (
              <motion.div
                key={course.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gray-700 rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="text-lg font-medium text-white">{course.name}</h3>
                    <p className="text-gray-400">{course.type}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-medium text-white">
                      {calculatePercentage(course.name)}%
                    </div>
                    <p className="text-gray-400">Attendance</p>
                  </div>
                </div>
                
                <div className="flex space-x-4 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAttendanceUpdate(course.name, 'present')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors"
                  >
                    Present
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAttendanceUpdate(course.name, 'absent')}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors"
                  >
                    Absent
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAttendanceUpdate(course.name, 'cancelled')}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                  >
                    Cancelled
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="mt-8">
        <h3 className="text-xl font-bold text-white mb-4">All Courses</h3>
        <div className="grid gap-4">
          {courses.map((course, index) => (
            <motion.div
              key={`${course.name}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-700 rounded-lg p-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-white">{course.name}</h4>
                  <p className="text-sm text-gray-400">
                    {attendance[course.name]?.attendedClasses || 0} / {attendance[course.name]?.totalClasses || 0} classes
                  </p>
                </div>
                <div className={`text-lg font-medium ${
                  calculatePercentage(course.name) >= 75 ? 'text-green-400' : 
                  calculatePercentage(course.name) >= 65 ? 'text-yellow-400' : 
                  'text-red-400'
                }`}>
                  {calculatePercentage(course.name)}%
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 