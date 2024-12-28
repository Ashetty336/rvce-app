'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function SemesterSetup({ onComplete }) {
  const [formData, setFormData] = useState({
    branch: '',
    semester: ''
  });

  const branches = [
    { id: 'CSE', name: 'Computer Science' },
    { id: 'ISE', name: 'Information Science' },
    { id: 'ECE', name: 'Electronics & Communication' },
    { id: 'EEE', name: 'Electrical & Electronics' },
    { id: 'ME', name: 'Mechanical' },
    { id: 'CV', name: 'Civil' },
    { id: 'AIML', name: 'Artificial Intelligence & ML' },
    { id: 'IE', name: 'Industrial Engineering' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.semester || !formData.branch) {
      alert('Please select both semester and branch');
      return;
    }
    onComplete({
      semester: parseInt(formData.semester),
      branch: formData.branch
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto bg-gray-800 rounded-xl shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Setup Your Semester</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Branch
          </label>
          <select
            value={formData.branch}
            onChange={(e) => setFormData(prev => ({ ...prev, branch: e.target.value }))}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          >
            <option value="">Select your branch</option>
            {branches.map(branch => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Semester
          </label>
          <select
            value={formData.semester}
            onChange={(e) => setFormData(prev => ({ ...prev, semester: e.target.value }))}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          >
            <option value="">Select semester</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          Continue to Course Selection
        </motion.button>
      </form>
    </motion.div>
  );
} 