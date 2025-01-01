'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

const BRANCHES = [
  { value: 'AI', label: 'Artificial Intelligence and Machine Learning' },
  { value: 'AS', label: 'Aerospace Engineering' },
  { value: 'BT', label: 'Biotechnology' },
  { value: 'CH', label: 'Chemical Engineering' },
  { value: 'CS', label: 'Computer Science & Engineering' },
  { value: 'CD', label: 'Computer Science & Engineering (Data Science)' },
  { value: 'CY', label: 'Computer Science & Engineering (Cyber Security)' },
  { value: 'CV', label: 'Civil Engineering' },
  { value: 'EC', label: 'Electronics & Communication Engineering' },
  { value: 'EE', label: 'Electrical & Electronics Engineering' },
  { value: 'EI', label: 'Electronics & Instrumentation Engineering' },
  { value: 'ET', label: 'Electronics & Telecommunication Engineering' },
  { value: 'IM', label: 'Industrial Engineering & Management' },
  { value: 'IS', label: 'Information Science & Engineering' },
  { value: 'ME', label: 'Mechanical Engineering' }
];

export default function SemesterSetup({ onComplete, existingData = {} }) {
  const [formData, setFormData] = useState({
    branch: existingData.branch || '',
    semester: existingData.semester || '',
    section: existingData.section || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="branch" className="block text-sm font-medium text-gray-300 mb-2">
            Branch
          </label>
          <select
            id="branch"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            required
            className="w-full bg-gray-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select Branch</option>
            {BRANCHES.map(branch => (
              <option key={branch.value} value={branch.value}>
                {branch.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="semester" className="block text-sm font-medium text-gray-300 mb-2">
            Semester
          </label>
          <select
            id="semester"
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            required
            className="w-full bg-gray-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select Semester</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>
        </div>

    

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Continue
        </button>
      </form>
    </motion.div>
  );
}