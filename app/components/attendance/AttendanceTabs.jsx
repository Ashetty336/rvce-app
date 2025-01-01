'use client';
import { useState, useEffect } from 'react';
import DailyAttendance from './DailyAttendance';
import CourseManager from './CourseManager';
import WeeklyScheduleSetup from './WeeklyScheduleSetup';
import AlertsTab from './AlertsTab';

export default function AttendanceTabs({ courses, schedule, branch, semester }) {
  const [activeTab, setActiveTab] = useState('daily');
  const [localCourses, setLocalCourses] = useState(courses);
  const [localSchedule, setLocalSchedule] = useState(schedule);
  const [attendanceStats, setAttendanceStats] = useState({});

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/attendance/stats');
      const data = await response.json();
      setAttendanceStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleAttendanceUpdate = (newStats) => {
    setAttendanceStats(prev => ({
      ...prev,
      ...newStats
    }));
    // Refresh stats from server
    fetchStats();
  };

  const handleSetupUpdate = async (data) => {
    try {
      const response = await fetch('/api/attendance/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branch,
          semester,
          courses: data.courses || localCourses,
          schedule: data.schedule || localSchedule,
          type: data.type
        })
      });
      
      if (!response.ok) throw new Error('Setup failed');
      
      const result = await response.json();
      if (data.courses) setLocalCourses(data.courses);
      if (data.schedule) setLocalSchedule(data.schedule);
    } catch (error) {
      console.error('Error:', error);
      alert('Setup failed. Please try again.');
    }
  };

  const tabs = [
    { id: 'daily', label: 'Daily Attendance' },
    { id: 'courses', label: 'Course Registration' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'alerts', label: 'Alerts' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Attendance Management</h2>
          <p className="text-gray-400">{branch} - Semester {semester}</p>
        </div>
      </div>

      <div className="flex space-x-1 bg-gray-700 p-1 rounded-lg">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === 'daily' && (
          <DailyAttendance 
            courses={localCourses} 
            schedule={localSchedule}
            branch={branch}
            semester={semester}
            attendanceData={attendanceStats}
            onAttendanceUpdate={handleAttendanceUpdate}
          />
        )}
        {activeTab === 'courses' && (
          <CourseManager 
            existingCourses={localCourses}
            isModal={false}
            onComplete={(updatedCourses) => {
              setLocalCourses(updatedCourses);
              handleSetupUpdate({ 
                courses: updatedCourses,
                type: 'course-setup'
              });
              setActiveTab('schedule');
            }}
          />
        )}
        {activeTab === 'schedule' && (
          <WeeklyScheduleSetup 
            courses={localCourses}
            existingSchedule={localSchedule}
            onComplete={(updatedSchedule) => {
              setLocalSchedule(updatedSchedule);
              handleSetupUpdate({ 
                schedule: updatedSchedule,
                type: 'schedule-setup'
              });
              setActiveTab('daily');
            }}
          />
        )}
        {activeTab === 'alerts' && (
          <AlertsTab 
            courses={localCourses}
            attendanceStats={attendanceStats}
          />
        )}
      </div>
    </div>
  );
}