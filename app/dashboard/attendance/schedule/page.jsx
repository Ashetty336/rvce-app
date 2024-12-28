'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function Schedule() {
  const { data: session } = useSession();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch('/api/attendance/setup');
        const data = await response.json();
        setSchedule(data.setup?.schedule || null);
      } catch (error) {
        console.error('Error fetching schedule:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchSchedule();
    }
  }, [session]);

  if (loading) return <div>Loading schedule...</div>;

  if (!schedule) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 mb-4">No schedule set up yet</p>
        <a
          href="/dashboard/attendance/registration"
          className="inline-block px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Set Up Schedule
        </a>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-white mb-6">Weekly Schedule</h2>
      
      <div className="grid gap-6">
        {Object.entries(schedule).map(([day, slots]) => (
          <div key={day} className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-white mb-3">{day}</h3>
            <div className="space-y-2">
              {Object.entries(slots).map(([time, courseCode]) => (
                <div key={`${day}-${time}`} className="flex justify-between items-center">
                  <span className="text-gray-400">{time}</span>
                  <span className="text-white">{courseCode}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 