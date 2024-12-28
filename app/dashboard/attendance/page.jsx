'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardLayout from '../../components/DashboardLayout';
import SemesterSetup from '../../components/attendance/SemesterSetup';
import CourseInput from '../../components/attendance/CourseInput';
import WeeklyScheduleSetup from '../../components/attendance/WeeklyScheduleSetup';
import DailyAttendance from '../../components/attendance/DailyAttendance';
import AttendanceTabs from '../../components/attendance/AttendanceTabs';

export default function AttendancePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [setupData, setSetupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState('checking');
  const [currentTab, setCurrentTab] = useState('semester');

  useEffect(() => {
    const fetchSetup = async () => {
      try {
        const response = await fetch('/api/attendance/setup');
        const data = await response.json();
        
        if (data.setup) {
          setSetupData(data.setup);
          setStep('attendance');
        } else {
          setStep('semester');
        }
      } catch (error) {
        console.error('Error fetching setup:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchSetup();
    }
  }, [session]);

  const handleSemesterComplete = async (semesterData) => {
    try {
      const response = await fetch('/api/attendance/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...setupData,
          ...semesterData
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSetupData(data.setup);
        setStep('courses');
      }
    } catch (error) {
      console.error('Error saving semester data:', error);
    }
  };

  const handleCoursesComplete = async (courses) => {
    try {
      const response = await fetch('/api/attendance/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...setupData,
          courses
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSetupData(data.setup);
        setStep('schedule');
      }
    } catch (error) {
      console.error('Error saving courses:', error);
    }
  };

  const handleScheduleComplete = async (schedule) => {
    try {
      const response = await fetch('/api/attendance/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...setupData,
          schedule,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSetupData(data.setup);
        setStep('attendance');
        router.refresh();
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white mb-6">
          Attendance Management
        </h1>

        <AttendanceTabs currentTab={currentTab} onTabChange={setCurrentTab} />

        {step === 'semester' && (
          <SemesterSetup 
            onComplete={handleSemesterComplete}
            initialData={setupData}
          />
        )}
        
        {step === 'courses' && (
          <CourseInput 
            existingCourses={setupData?.courses} 
            onComplete={handleCoursesComplete}
          />
        )}
        
        {step === 'schedule' && (
          <WeeklyScheduleSetup 
            courses={setupData?.courses || []}
            existingSchedule={setupData?.schedule}
            onComplete={handleScheduleComplete}
          />
        )}
        
        {step === 'attendance' && (
          <DailyAttendance 
            courses={setupData?.courses || []}
            schedule={setupData?.schedule || {}}
            onEditCourses={() => setStep('courses')}
            onEditSchedule={() => setStep('schedule')}
          />
        )}
      </div>
    </DashboardLayout>
  );
} 
