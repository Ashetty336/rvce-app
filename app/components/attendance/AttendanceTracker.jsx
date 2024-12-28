'use client';
import { useState, useEffect } from 'react';

export default function AttendanceTracker({ courses, schedule }) {
  const [todayClasses, setTodayClasses] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodayClasses = () => {
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      const classesForToday = Object.entries(schedule[today] || {})
        .map(([time, courseCode]) => ({
          time,
          course: courses.find(c => c.code === courseCode)
        }))
        .filter(slot => slot.course);

      setTodayClasses(classesForToday);
    };

    const fetchAttendanceData = async () => {
      try {
        const response = await fetch('/api/attendance/stats');
        const data = await response.json();
        setAttendanceData(data);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayClasses();
    fetchAttendanceData();
  }, [courses, schedule]);

  const handleAttendanceUpdate = async (courseCode, time, status) => {
    try {
      await fetch('/api/attendance/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseCode,
          date: new Date().toISOString(),
          time,
          status
        }),
      });

      // Update local attendance data
      setAttendanceData(prev => ({
        ...prev,
        [courseCode]: {
          ...prev[courseCode],
          totalClasses: prev[courseCode].totalClasses + 1,
          attendedClasses: status === 'present' ? 
            prev[courseCode].attendedClasses + 1 : 
            prev[courseCode].attendedClasses
        }
      }));

    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  if (loading) {
    return <div>Loading attendance data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Attendance Alerts */}
      <div className="mb-6">
        {Object.entries(attendanceData).map(([courseCode, data]) => {
          const percentage = (data.attendedClasses / data.totalClasses) * 100;
          if (percentage < 75) {
            return (
              <div key={courseCode} className="bg-red-500/10 text-red-400 p-4 rounded mb-2">
                Low attendance alert: {courseCode} - {percentage.toFixed(1)}%
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* Today's Classes */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Today's Classes</h3>
        <div className="space-y-4">
          {todayClasses.map(({ time, course }) => (
            <div key={`${course.code}-${time}`} className="bg-gray-700 p-4 rounded flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{course.code} - {course.title}</p>
                <p className="text-gray-400">{time}</p>
                <p className="text-gray-400">
                  Attendance: {
                    ((attendanceData[course.code]?.attendedClasses || 0) / 
                    (attendanceData[course.code]?.totalClasses || 1) * 100).toFixed(1)
                  }%
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAttendanceUpdate(course.code, time, 'present')}
                  className="px-4 py-2 bg-green-600/20 text-green-400 rounded hover:bg-green-600/30"
                >
                  Present
                </button>
                <button
                  onClick={() => handleAttendanceUpdate(course.code, time, 'absent')}
                  className="px-4 py-2 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30"
                >
                  Absent
                </button>
                <button
                  onClick={() => handleAttendanceUpdate(course.code, time, 'cancelled')}
                  className="px-4 py-2 bg-yellow-600/20 text-yellow-400 rounded hover:bg-yellow-600/30"
                >
                  Cancelled
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 