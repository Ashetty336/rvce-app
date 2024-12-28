'use client';
import { useState } from 'react';

export default function SemesterSetup({ onComplete, initialData = {} }) {
  const [formData, setFormData] = useState({
    branch: initialData.branch || '',
    semester: initialData.semester || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-white mb-6">Academic Setup</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-white mb-2">Branch</label>
          <input
            type="text"
            value={formData.branch}
            onChange={(e) => setFormData(prev => ({ ...prev, branch: e.target.value }))}
            className="w-full bg-gray-700 text-white rounded-lg p-3"
            required
          />
        </div>
        <div>
          <label className="block text-white mb-2">Semester</label>
          <select
            value={formData.semester}
            onChange={(e) => setFormData(prev => ({ ...prev, semester: e.target.value }))}
            className="w-full bg-gray-700 text-white rounded-lg p-3"
            required
          >
            <option value="">Select Semester</option>
            {[1,2,3,4,5,6,7,8].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg"
        >
          Continue
        </button>
      </form>
    </div>
  );
} 