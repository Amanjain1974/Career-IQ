import { useEffect, useState } from 'react';
import { getDashboardStats, getReminders } from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [reminders, setReminders] = useState<any[]>([]);

  useEffect(() => {
    getDashboardStats().then(data => setStats(data));
    getReminders().then(data => setReminders(data));
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Total Applications</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.total_applications}</dd>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Job Fit Average</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.average_fit_score}%</dd>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Interview Rate</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.interview_rate}%</dd>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Common Skill Gaps</dt>
          <dd className="mt-1 text-sm font-semibold text-gray-900">{stats.most_common_skill_gaps.join(', ')}</dd>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Follow-up Reminders</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {reminders.map((reminder) => (
              <li key={reminder.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 truncate">{reminder.role} at {reminder.company}</p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Follow-up Due: {reminder.follow_up_date}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
            {reminders.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-500">You are all caught up on follow-ups!</div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
