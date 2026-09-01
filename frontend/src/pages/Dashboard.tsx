import { useEffect, useState } from 'react';
import { getDashboardStats, getReminders } from '../api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [reminders, setReminders] = useState<any[]>([]);

  useEffect(() => {
    getDashboardStats().then(data => setStats(data));
    getReminders().then(data => setReminders(data));
  }, []);

  if (!stats) return <div>Loading...</div>;

  const funnelData = [
    { name: 'Applied', count: stats.total_applications },
    { name: 'Interview', count: stats.interviews },
    { name: 'Offer', count: stats.offers },
    { name: 'Rejected', count: stats.rejections }
  ];

  const pieData = [
    { name: 'In Progress', value: stats.total_applications - stats.interviews - stats.rejections },
    { name: 'Interviewing', value: stats.interviews },
    { name: 'Offers', value: stats.offers },
    { name: 'Rejected', value: stats.rejections },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
      
      {/* Weekly Goal Progress */}
      <div className="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg p-5">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Weekly Application Goal</h2>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {stats.apps_this_week} / {stats.weekly_goal}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full" 
            style={{ width: `${Math.min((stats.apps_this_week / stats.weekly_goal) * 100, 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Applications</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{stats.total_applications}</dd>
        </div>
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Job Fit Average</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{stats.average_fit_score}%</dd>
        </div>
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Interview Rate</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{stats.interview_rate}%</dd>
        </div>
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Common Skill Gaps</dt>
          <dd className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{stats.most_common_skill_gaps.join(', ')}</dd>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 shadow sm:rounded-lg">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Application Funnel</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 shadow sm:rounded-lg">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Status Distribution</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">Follow-up Reminders</h2>
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {reminders.map((reminder) => (
              <li key={reminder.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">{reminder.role} at {reminder.company}</p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
                        Follow-up Due: {reminder.follow_up_date}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
            {reminders.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">You are all caught up on follow-ups!</div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
