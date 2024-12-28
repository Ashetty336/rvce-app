'use client';
import { useState } from 'react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function WeeklySchedule({ courses = [], schedule = {} }) {
  if (!courses.length || !Object.keys(schedule).length) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Weekly Schedule</h2>
        <p className="text-gray-400">No schedule available. Please complete course registration first.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Weekly Schedule</h2>
      
      <div className="grid gap-4">
        {DAYS.map(day => (
          <div key={day} className="bg-gray-700 p-4 rounded">
            <h3 className="text-lg font-medium text-white mb-3">{day}</h3>
            <div className="space-y-2">
              {schedule[day] && Object.entries(schedule[day]).map(([time, courseCode]) => {
                const course = courses.find(c => c.code === courseCode);
                return (
                  <div key={`${day}-${time}`} className="flex justify-between items-center">
                    <span className="text-gray-400">{time}</span>
                    <span className="text-white">{course?.title || courseCode}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 