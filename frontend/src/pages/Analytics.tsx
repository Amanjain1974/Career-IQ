import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { getDashboardStats } from '../api';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

export default function Analytics() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    getDashboardStats().then(data => setStats(data));
  }, []);

  if (!stats) return <div>Loading Analytics...</div>;

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
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Career Insights</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Application Funnel Chart */}
        <div className="bg-white p-6 shadow sm:rounded-lg">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Application Funnel</h2>
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

        {/* Status Distribution Pie Chart */}
        <div className="bg-white p-6 shadow sm:rounded-lg">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Status Distribution</h2>
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
                  {pieData.map((entry, index) => (
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
    </div>
  );
}
