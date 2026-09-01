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
    work_mode: 'Remote'
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
      
      // Also automatically track it for the user
      await createApplication({
        job: newJob.id,
        status: 'Saved',
        match_score: Math.floor(Math.random() * (99 - 75 + 1)) + 75 // Mock random match score
      });
      
      onSuccess();
    } catch (error) {
      console.error(error);
      alert('Error saving job. If backend is offline, this is expected.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Add Job Opportunity</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Company</label>
            <input 
              type="text" required name="company"
              value={formData.company} onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role / Title</label>
            <input 
              type="text" required name="role"
              value={formData.role} onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input 
                type="text" name="location"
                value={formData.location} onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Work Mode</label>
              <select 
                name="work_mode" value={formData.work_mode} onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Job Description (Paste full text)</label>
            <textarea 
              name="description" required rows={6}
              value={formData.description} onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="pt-4 flex justify-end space-x-2 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
            <button 
              type="submit" disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save & Analyze Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJobModal;
