'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import SemesterSetup from '../../components/attendance/SemesterSetup';
import CourseManager from '../../components/attendance/CourseManager';
import WeeklyScheduleSetup from '../../components/attendance/WeeklyScheduleSetup';
import AttendanceTabs from '../../components/attendance/AttendanceTabs';
import { motion, AnimatePresence } from 'framer-motion';

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const stepComponents = {
    'branch-setup': {
      component: SemesterSetup,
      title: 'Semester Setup',
      subtitle: 'Configure your branch and semester details'
    },
    'course-setup': {
      component: CourseManager,
      title: 'Course Management',
      subtitle: 'Add and manage your courses'
    },
    'schedule-setup': {
      component: WeeklyScheduleSetup,
      title: 'Weekly Schedule',
      subtitle: 'Set up your weekly class schedule'
    },
    'attendance': {
      component: AttendanceTabs,
      title: 'Attendance Management',
      subtitle: 'Track and manage attendance'
    }
  };

  const CurrentComponent = stepComponents[step]?.component;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step !== 'attendance' ? (
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <motion.h1 
                    className="text-4xl font-bold text-white mb-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {stepComponents[step]?.title}
                  </motion.h1>
                  <motion.p 
                    className="text-gray-300 text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {stepComponents[step]?.subtitle}
                  </motion.p>
                </div>

                <motion.div 
                  className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50 shadow-lg"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {step === 'branch-setup' && (
                    <CurrentComponent
                      onComplete={(data) => {
                        handleSetupUpdate(data);
                        setStep('course-setup');
                      }}
                    />
                  )}
                  {step === 'course-setup' && (
                    <CurrentComponent
                      onComplete={(courses) => {
                        handleSetupUpdate({ courses });
                        setStep('schedule-setup');
                      }}
                    />
                  )}
                  {step === 'schedule-setup' && (
                    <CurrentComponent
                      courses={setupData.courses}
                      onComplete={(schedule) => {
                        handleSetupUpdate({ schedule });
                        setStep('attendance');
                      }}
                    />
                  )}
                </motion.div>
              </div>
            ) : (
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-lg p-6">
                <CurrentComponent
                  courses={setupData.courses}
                  schedule={setupData.schedule}
                  branch={setupData.branch}
                  semester={setupData.semester}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
