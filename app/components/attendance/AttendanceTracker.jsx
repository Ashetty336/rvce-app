'use client';
import { useState, useEffect } from 'react';

export default function AttendanceTracker({ courses, schedule }) {
  const [todayClasses, setTodayClasses] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodayClasses = () => {
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      const classesForToday = schedule[today] || [];
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

  const handleAttendanceUpdate = async (courseName, status) => {
    try {
      await fetch('/api/attendance/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseName,
          date: new Date().toISOString(),
          status
        }),
      });

      // Update local attendance data
      setAttendanceData(prev => ({
        ...prev,
        [courseName]: {
          ...prev[courseName],
          totalClasses: (prev[courseName]?.totalClasses || 0) + 1,
          attendedClasses: status === 'present' ? 
            (prev[courseName]?.attendedClasses || 0) + 1 : 
            (prev[courseName]?.attendedClasses || 0)
        }
      }));

    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Attendance Alerts */}
      <div className="mb-6">
        {Object.entries(attendanceData).map(([courseName, data]) => {
          const percentage = (data.attendedClasses / data.totalClasses) * 100;
          if (percentage < 75) {
            return (
              <div key={courseName} className="bg-red-500/10 text-red-400 p-4 rounded mb-2">
                Low attendance alert: {courseName} - {percentage.toFixed(1)}%
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
          {todayClasses.map((courseName, index) => (
            <div key={`${courseName}-${index}`} className="bg-gray-700 p-4 rounded flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{courseName}</p>
                <p className="text-gray-400">
                  Attendance: {
                    ((attendanceData[courseName]?.attendedClasses || 0) / 
                    (attendanceData[courseName]?.totalClasses || 1) * 100).toFixed(1)
                  }%
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAttendanceUpdate(courseName, 'present')}
                  className="px-4 py-2 bg-green-600/20 text-green-400 rounded hover:bg-green-600/30"
                >
                  Present
                </button>
                <button
                  onClick={() => handleAttendanceUpdate(courseName, 'absent')}
                  className="px-4 py-2 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30"
                >
                  Absent
                </button>
                <button
                  onClick={() => handleAttendanceUpdate(courseName, 'cancelled')}
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