'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuickAttendanceUpdate from './QuickAttendanceUpdate';

const getTodayInfo = () => ({
  iso: new Date().toISOString().split('T')[0],
  weekday: new Date().toLocaleDateString('en-US', { weekday: 'long' })
});

export default function DailyAttendance({ 
  courses = [], 
  schedule = {}, 
  onAttendanceUpdate,
  attendanceData = {},
  branch,
  semester
}) {
  const [todayCourses, setTodayCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todayStatus, setTodayStatus] = useState({});
  const [markedAttendance, setMarkedAttendance] = useState([]);
  const [removedCourses, setRemovedCourses] = useState([]);
  const [showQuickSetup, setShowQuickSetup] = useState(false);
  
  // Get today's info once when component mounts
  const today = useMemo(getTodayInfo, []);

  // Separate data fetching logic
  const fetchTodayData = useCallback(async () => {
    try {
      const response = await fetch(`/api/attendance/today?date=${today.iso}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching today data:', error);
      return { attendance: {} }; // Return a default structure
    }
  }, [today.iso]);

  useEffect(() => {
    let isSubscribed = true;

    const initializeData = async () => {
      if (!courses.length || !Object.keys(schedule).length) {
        setLoading(false);
        return;
      }

      try {
        const todayData = await fetchTodayData();
        
        if (!isSubscribed) return;

        const todaySchedule = schedule[today.weekday] || [];
        const todaysCourseDetails = todaySchedule
          .map(courseName => courses.find(c => c.name === courseName))
          .filter(Boolean)
          .filter(course => !todayData?.attendance?.[course.name])
          .filter(course => !removedCourses.includes(course.name));

        setTodayStatus(todayData?.attendance || {});
        setMarkedAttendance(Object.keys(todayData?.attendance || {}));
        setTodayCourses(todaysCourseDetails);
      } catch (error) {
        console.error('Error initializing data:', error);
        // Set default states in case of error
        setTodayStatus({});
        setMarkedAttendance([]);
        setTodayCourses([]);
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    initializeData();

    return () => {
      isSubscribed = false;
    };
  }, [courses, schedule, today.weekday, removedCourses, fetchTodayData]);

  const handleAttendanceUpdate = async (courseName, status) => {
    try {
      const todayDate = new Date().toISOString();
      
      const response = await fetch('/api/attendance/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseName,
          date: todayDate,
          status,
          branch,
          semester
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update attendance');
      }

      // Update local state
      setTodayStatus(prev => ({ ...prev, [courseName]: status }));
      setMarkedAttendance(prev => [...prev, courseName]);
      setTodayCourses(prev => prev.filter(course => course.name !== courseName));
      
      // Calculate new stats based on status
      const currentStats = attendanceData[courseName] || { totalClasses: 0, attendedClasses: 0 };
      let newStats = { ...currentStats };

      switch (status) {
        case 'present':
          newStats.attendedClasses += 1;
          newStats.totalClasses += 1;
          break;
        case 'absent':
          newStats.totalClasses += 1;
          break;
        case 'cancelled':
          // Don't update any counts for cancelled classes
          break;
      }

      // Calculate percentage
      const percentage = newStats.totalClasses === 0 ? 0 : 
        Math.round((newStats.attendedClasses / newStats.totalClasses) * 100);

      // Update attendance statistics in parent component
      if (typeof onAttendanceUpdate === 'function') {
        onAttendanceUpdate({
          [courseName]: {
            ...newStats,
            percentage
          }
        });
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
      alert('Failed to update attendance. Please try again.');
    }
  };

  const handleQuickSetupUpdate = async (updates) => {
    try {
      // Update attendance state with new stats directly from quick setup
      onAttendanceUpdate(updates);
      
      // Refresh today's courses
      const todayData = await fetchTodayData();
      
      // Update local state
      setTodayStatus(todayData?.attendance || {});
      setMarkedAttendance(Object.keys(todayData?.attendance || {}));
      
      const todaySchedule = schedule[today.weekday] || [];
      const todaysCourseDetails = todaySchedule
        .map(courseName => courses.find(c => c.name === courseName))
        .filter(Boolean)
        .filter(course => !todayData?.attendance?.[course.name])
        .filter(course => !removedCourses.includes(course.name));
      
      setTodayCourses(todaysCourseDetails);
      setShowQuickSetup(false);
    } catch (error) {
      console.error('Error updating stats after quick setup:', error);
    }
  };

  const handleCourseRemoval = (courseName) => {
    setRemovedCourses(prev => [...prev, courseName]);
  };

  const calculatePercentage = (courseName) => {
    const courseData = attendanceData[courseName];
    if (!courseData || courseData.totalClasses === 0) return 0;
    return Math.round((courseData.attendedClasses / courseData.totalClasses) * 100);
  };

  if (loading && courses.length > 0) {
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
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowQuickSetup(true)}
          className="text-purple-400 hover:text-purple-300 transition-colors"
        >
          Quick Setup
        </motion.button>
      </div>

      {/* Today's Classes Section */}
      {todayCourses.length > 0 ? (
        <div className="grid gap-4">
          {todayCourses.map(course => (
            <motion.div
              key={course.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-700 rounded-lg p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-medium text-white">{course.name}</h3>
                  <p className="text-gray-400 text-sm mt-1">{course.type}</p>
                </div>
                {attendanceData[course.name] && (
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Current Attendance</p>
                    <p className={`text-lg font-medium ${
                      calculatePercentage(course.name) >= 75 
                        ? 'text-green-400' 
                        : 'text-red-400'
                    }`}>
                      {calculatePercentage(course.name)}%
                    </p>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAttendanceUpdate(course.name, 'present')}
                  className="bg-green-500/20 hover:bg-green-500/30 text-green-400 py-3 rounded-lg transition-colors"
                >
                  Present
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAttendanceUpdate(course.name, 'absent')}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 py-3 rounded-lg transition-colors"
                >
                  Absent
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAttendanceUpdate(course.name, 'cancelled')}
                  className="bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 py-3 rounded-lg transition-colors"
                >
                  Cancelled
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-700 rounded-lg p-6 text-center"
        >
          <p className="text-gray-400">No classes scheduled for today</p>
        </motion.div>
      )}

      <AnimatePresence>
        {showQuickSetup && (
          <QuickAttendanceUpdate
            courses={courses}
            onClose={() => setShowQuickSetup(false)}
            onUpdate={handleQuickSetupUpdate}
            branch={branch}
            semester={semester}
          />
        )}
      </AnimatePresence>

      {/* Show today's marked attendance */}
      {markedAttendance.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-white mb-4">Today's Attendance</h3>
          <div className="grid gap-4">
            {markedAttendance.map(courseName => (
              <div key={courseName} className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-white">{courseName}</h4>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    todayStatus[courseName] === 'present' ? 'bg-green-500/10 text-green-400' :
                    todayStatus[courseName] === 'absent' ? 'bg-red-500/10 text-red-400' :
                    'bg-gray-500/10 text-gray-400'
                  }`}>
                    {todayStatus[courseName]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Show all courses with their attendance */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-white mb-4">Attendance Statistics</h3>
        <div className="grid gap-4">
          {courses.map(course => {
            const stats = attendanceData[course.name] || { totalClasses: 0, attendedClasses: 0 };
            const percentage = stats.totalClasses === 0 ? 0 :
              Math.round((stats.attendedClasses / stats.totalClasses) * 100);
            
            return (
              <div key={course.name} className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-white">{course.name}</h4>
                    <p className="text-sm text-gray-400 mt-1">
                      {stats.attendedClasses} / {stats.totalClasses} classes attended
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    percentage >= 75 
                      ? 'bg-green-500/10 text-green-400'
                      : 'bg-red-500/10 text-red-400'
                  }`}>
                    {percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                  <div 
                    className={`h-2 rounded-full ${
                      percentage >= 75 ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 