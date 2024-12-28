'use client';
import { useState } from 'react';
import SemesterSetup from '../../../components/attendance/SemesterSetup';
import CourseScheduleSetup from '../../../components/attendance/CourseScheduleSetup';

export default function Registration() {
  const [step, setStep] = useState('semester'); // 'semester' or 'schedule'
  const [selectedCourses, setSelectedCourses] = useState(null);

  const handleSemesterSetupComplete = (courses) => {
    setSelectedCourses(courses);
    setStep('schedule');
  };

  const handleScheduleComplete = async (schedule) => {
    try {
      // Save the complete setup
      const response = await fetch('/api/attendance/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courses: selectedCourses,
          schedule
        }),
      });

      if (response.ok) {
        // Redirect to attendance page
        window.location.href = '/dashboard/attendance';
      }
    } catch (error) {
      console.error('Error saving setup:', error);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-white mb-6">Course Registration</h2>
      
      {step === 'semester' ? (
        <SemesterSetup onComplete={handleSemesterSetupComplete} />
      ) : (
        <CourseScheduleSetup 
          courses={selectedCourses}
          onComplete={handleScheduleComplete}
        />
      )}
    </div>
  );
} 