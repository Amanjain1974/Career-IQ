import React, { useState } from 'react';
import { createJob, createApplication } from '../api';

interface AddJobModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddJobModal: React.FC<AddJobModalProps> = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    location: '',
    description: '',
    work_mode: 'Remote',
    salary_min: '',
    salary_max: '',
    source: 'Manual'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Create job
      const newJob = await createJob(formData);
      
      // Get AI Match Score
      const { matchJob } = await import('../api');
      const matchData = await matchJob(newJob.id);
      
      // Also automatically track it for the user
      await createApplication({
        job: newJob.id,
        status: 'Saved',
        match_score: matchData.match_score
      });
      
      alert(`AI Match Score: ${matchData.match_score}%\n\n${matchData.reason}`);
      
      onSuccess();
    } catch (error) {
      console.error(error);
      alert('Error saving job. If backend is offline, this is expected.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold dark:text-white">Add Job Opportunity</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company</label>
              <input 
                type="text" required name="company"
                value={formData.company} onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Source</label>
              <select 
                name="source" value={formData.source} onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Manual">Manual</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Indeed">Indeed</option>
                <option value="Company Site">Company Site</option>
                <option value="Referral">Referral</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role / Title</label>
            <input 
              type="text" required name="role"
              value={formData.role} onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
              <input 
                type="text" name="location"
                value={formData.location} onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Work Mode</label>
              <select 
                name="work_mode" value={formData.work_mode} onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Min Salary (Optional)</label>
              <input 
                type="number" name="salary_min"
                value={formData.salary_min} onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Max Salary (Optional)</label>
              <input 
                type="number" name="salary_max"
                value={formData.salary_max} onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Job Description (Paste full text)</label>
            <textarea 
              name="description" required rows={6}
              value={formData.description} onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="pt-4 flex justify-end space-x-2 border-t dark:border-gray-700">
            <button type="button" onClick={onClose} className="px-4 py-2 border dark:border-gray-600 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              Cancel
            </button>
            <button 
              type="submit" disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save & Analyze'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJobModal;
