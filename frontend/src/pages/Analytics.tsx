import { useEffect, useState } from 'react';
import { getDashboardStats } from '../api';

export default function Analytics() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    getDashboardStats().then(data => setStats(data));
  }, []);

  if (!stats) return <div>Loading Analytics...</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Career Insights</h1>
      <p className="text-gray-500 dark:text-gray-400">
        Advanced analytics and reporting are coming in v2.0. For now, check your Dashboard for the most important metrics!
      </p>
    </div>
  );
}
