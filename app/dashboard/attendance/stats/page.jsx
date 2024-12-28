'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function AttendanceStats() {
  const { data: session } = useSession();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/attendance/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchStats();
    }
  }, [session]);

  if (loading) return <div>Loading statistics...</div>;

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-white mb-6">Attendance Statistics</h2>
      
      <div className="grid gap-4">
        {Object.entries(stats || {}).map(([courseCode, data]) => {
          const percentage = (data.attendedClasses / data.totalClasses) * 100 || 0;
          
          return (
            <div key={courseCode} className="bg-gray-700 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-medium text-white">{courseCode}</h3>
                  <p className="text-gray-400">
                    {data.attendedClasses} / {data.totalClasses} classes attended
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  percentage >= 75 
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-red-500/10 text-red-400'
                }`}>
                  {percentage.toFixed(1)}%
                </span>
              </div>
              
              <div className="w-full bg-gray-600 rounded-full h-2">
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
  );
} 