import { useEffect, useState } from 'react';
import { getDashboardStats } from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    getDashboardStats().then(data => setStats(data));
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
    </div>
  );
}
