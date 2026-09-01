import React, { useState, useEffect } from 'react';
import { getMe, updateMe, exportData } from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getMe()
      .then(data => {
        setUser(data);
        setEmail(data.email || '');
      })
      .catch(err => console.error("Error fetching user", err));
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMe({ email });
      setMessage('Account updated successfully.');
    } catch (err) {
      setMessage('Failed to update account.');
    }
  };

  const handleExport = async () => {
    try {
      const data = await exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'careeriq_data.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert("Failed to export data");
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return <div>Loading settings...</div>;

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Account Settings</h1>
      
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Profile Details</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Personal details and preferences.</p>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
          <form onSubmit={handleUpdate} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
              <input 
                type="text" 
                value={user.username} 
                disabled 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-500 cursor-not-allowed" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
              />
            </div>
            {message && <p className="text-sm text-green-600">{message}</p>}
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
              Save Changes
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Data Portability</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Download all your career data.</p>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
          <button 
            onClick={handleExport}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Export My Data (.json)
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-red-200 dark:border-red-800">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-red-600 dark:text-red-400">Danger Zone</h3>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
          <button 
            onClick={handleLogout}
            className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100 px-4 py-2 rounded-md hover:bg-red-200 dark:hover:bg-red-800"
          >
            Log Out
          </button>
        </div>
      </div>

    </div>
  );
}
