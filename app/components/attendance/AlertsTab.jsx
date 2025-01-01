'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AlertsTab({ courses = [], attendanceStats = {} }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processAlerts = () => {
      // Transform the data into alerts format
      const newAlerts = Object.entries(attendanceStats)
        .map(([courseName, stats]) => {
          const totalClasses = parseInt(stats.totalClasses) || 0;
          const attendedClasses = parseInt(stats.attendedClasses) || 0;
          
          const percentage = totalClasses === 0 ? 0 :
            Math.round((attendedClasses / totalClasses) * 100);
          
          return {
            courseName,
            percentage,
            attendedClasses,
            totalClasses
          };
        })
        .filter(course => course.percentage < 75 && course.totalClasses > 0)
        .sort((a, b) => a.percentage - b.percentage);

      setAlerts(newAlerts);
      setLoading(false);
    };

    processAlerts();
  }, [attendanceStats]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Attendance Alerts</h2>
      
      <AnimatePresence>
        {alerts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-500/10 text-green-400 p-6 rounded-lg text-center"
          >
            <span className="text-xl">🎉</span>
            <p className="mt-2 font-medium">All courses have attendance above 75%!</p>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {alerts.map(alert => (
              <motion.div
                key={alert.courseName}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 p-6 rounded-lg"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-white">{alert.courseName}</h3>
                    <p className="text-red-400 mt-1">
                      Current attendance: {alert.percentage}%
                    </p>
                    <p className="text-gray-400 mt-2">
                      Classes attended: {alert.attendedClasses} / {alert.totalClasses}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
} 