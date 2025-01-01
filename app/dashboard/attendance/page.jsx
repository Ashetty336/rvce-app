'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import SemesterSetup from '../../components/attendance/SemesterSetup';
import CourseManager from '../../components/attendance/CourseManager';
import WeeklyScheduleSetup from '../../components/attendance/WeeklyScheduleSetup';
import AttendanceTabs from '../../components/attendance/AttendanceTabs';

export default function AttendancePage() {
  const [step, setStep] = useState('initial-setup');
  const [setupData, setSetupData] = useState({
    branch: '',
    semester: '',
    courses: [],
    schedule: {}
  });
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  // Check if user has existing setup
  useEffect(() => {
    if (status !== 'authenticated') return;
    
    const fetchSetupData = async () => {
      try {
        const response = await fetch('/api/attendance/setup');
        const data = await response.json();

        if (data.setup) {
          setSetupData(data.setup);
          setStep('attendance');
        } else {
          setStep('branch-setup');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSetupData();
  }, [status]);

  const handleSetupUpdate = async (data) => {
    try {
      const response = await fetch('/api/attendance/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...setupData,
          ...data
        })
      });
      
      if (!response.ok) throw new Error('Setup failed');
      
      const result = await response.json();
      setSetupData(prev => ({
        ...prev,
        ...result.setup
      }));
    } catch (error) {
      console.error('Error:', error);
      alert('Setup failed. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Only render the setup steps or attendance tabs, not both
    // Only render the setup steps or attendance tabs, not both
    return (
      <div className="container mx-auto px-4 py-8">
        {step !== 'attendance' ? (
          <>
            {step === 'branch-setup' && (
              <SemesterSetup
                onComplete={(data) => {
                  handleSetupUpdate(data);
                  setStep('course-setup');
                }}
              />
            )}
            {step === 'course-setup' && (
              <CourseManager
                onComplete={(courses) => {
                  handleSetupUpdate({ courses });
                  setStep('schedule-setup');
                }}
              />
            )}
            {step === 'schedule-setup' && (
              <WeeklyScheduleSetup
                courses={setupData.courses}
                onComplete={(schedule) => {
                  handleSetupUpdate({ schedule });
                  setStep('attendance');
                }}
              />
            )}
          </>
        ) : (
          <AttendanceTabs
            courses={setupData.courses}
            schedule={setupData.schedule}
            branch={setupData.branch}
            semester={setupData.semester}
          />
        )}
      </div>
    );
}
