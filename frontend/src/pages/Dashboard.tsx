import { useEffect, useState } from 'react';
import { getDashboardStats, getReminders } from '../api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { BriefcaseIcon, CheckCircleIcon, ChartBarIcon, ArrowTrendingUpIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e']; // Indigo, Emerald, Amber, Rose

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [reminders, setReminders] = useState<any[]>([]);

  useEffect(() => {
    getDashboardStats().then(data => setStats(data));
    getReminders().then(data => setReminders(data));
  }, []);

  if (!stats) return (
    <div className="flex h-64 items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  );

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
  
  const greetingTime = new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Good {greetingTime}! ??</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Here's what's happening with your job applications today.</p>
      </div>
      
      {/* Weekly Goal Progress */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm"
      >
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg mr-3">
              <ChartBarIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Weekly Application Goal</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Keep up the momentum!</p>
            </div>
          </div>
          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 rounded-full">
            {stats.apps_this_week} / {stats.weekly_goal}
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((stats.apps_this_week / stats.weekly_goal) * 100, 100)}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full" 
          />
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Applications', value: stats.total_applications, icon: BriefcaseIcon, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10' },
          { label: 'Job Fit Average', value: `${stats.average_fit_score}%`, icon: ArrowTrendingUpIcon, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
          { label: 'Interview Rate', value: `${stats.interview_rate}%`, icon: CheckCircleIcon, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-500/10' },
          { label: 'Common Skill Gaps', value: stats.most_common_skill_gaps[0] || 'None', icon: ChartBarIcon, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-500/10' }
        ].map((item, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-xl ${item.bg}`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{item.label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{item.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm rounded-xl"
        >
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Application Funnel</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm rounded-xl"
        >
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Status Distribution</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '14px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="pt-2"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Follow-up Reminders</h2>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden rounded-xl">
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {reminders.map((reminder) => (
              <li key={reminder.id}>
                <div className="px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between group">
                  <div className="flex items-center">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg mr-4">
                      <CalendarIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{reminder.role}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{reminder.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20">
                      Due: {reminder.follow_up_date}
                    </span>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                      Action
                    </button>
                  </div>
                </div>
              </li>
            ))}
            {reminders.length === 0 && (
              <div className="px-5 py-10 flex flex-col items-center justify-center text-center">
                <CheckCircleIcon className="w-10 h-10 text-emerald-500 mb-3" />
                <p className="text-sm font-medium text-slate-900 dark:text-white">You're all caught up!</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">No follow-ups pending right now.</p>
              </div>
            )}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

