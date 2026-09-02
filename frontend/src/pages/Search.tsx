import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getJobs, getApplications, searchRealtimeJobs } from '../api';
import { BriefcaseIcon, BuildingOfficeIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [jobs, setJobs] = useState<any[]>([]);
  const [apps, setApps] = useState<any[]>([]);
  const [realtimeJobs, setRealtimeJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([
      getJobs({ search: query }),
      getApplications({ search: query, archived: true }),
      searchRealtimeJobs(query)
    ]).then(([jobsData, appsData, realtimeData]) => {
      setJobs(jobsData);
      setApps(appsData);
      setRealtimeJobs(realtimeData);
    }).finally(() => {
      setLoading(false);
    });
  }, [query]);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Search Results for "{query}"</h1>

      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="space-y-10">
          
          {/* Real-time Jobs Section */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-5">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Live Job Market ({realtimeJobs.length})
              </h2>
              <span className="text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 px-2 py-1 rounded-full">
                Powered by Aggregator API
              </span>
            </div>
            
            {realtimeJobs.length === 0 ? (
              <p className="text-slate-500 text-sm">No live jobs found. Try adjusting your search query.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {realtimeJobs.map((job, i) => (
                  <div key={job.id || i} className="p-5 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">{job.role}</h3>
                        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-2 space-x-3">
                          <span className="flex items-center"><BuildingOfficeIcon className="w-4 h-4 mr-1"/> {job.company}</span>
                          <span className="flex items-center"><MapPinIcon className="w-4 h-4 mr-1"/> {job.location || job.work_mode}</span>
                        </div>
                      </div>
                    </div>
                    {job.salary_range && (
                       <div className="mt-3 inline-flex text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 px-2 py-1 rounded-full">
                         {job.salary_range}
                       </div>
                    )}
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                      {job.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Via {job.source}</span>
                      {job.url && (
                        <a href={job.url} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium">
                          View & Apply ?
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Applications Section */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="text-xl font-semibold mb-4 border-b border-slate-200 dark:border-slate-800 pb-2 text-slate-900 dark:text-white">
              Your Applications ({apps.length})
            </h2>
            {apps.length === 0 ? (
              <p className="text-slate-500 text-sm">No applications found in your tracker.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {apps.map(app => (
                  <div key={app.id} className="p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">{app.role}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{app.company}</p>
                      </div>
                      <span className="text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 px-2 py-1 rounded-full">
                        {app.status}
                      </span>
                    </div>
                    {app.notes && (
                      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 truncate">?? {app.notes}</p>
                    )}
                    <div className="mt-4">
                      <Link to="/applications" className="text-indigo-600 hover:underline text-sm font-medium">View in Tracker ?</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Saved Jobs Section */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-xl font-semibold mb-4 border-b border-slate-200 dark:border-slate-800 pb-2 text-slate-900 dark:text-white">
              Saved Jobs ({jobs.length})
            </h2>
            {jobs.length === 0 ? (
              <p className="text-slate-500 text-sm">No saved jobs found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map(job => (
                  <div key={job.id} className="p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{job.role}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{job.company}</p>
                    <Link to="/jobs" className="text-indigo-600 hover:underline text-sm font-medium">View in Jobs ?</Link>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
          
        </div>
      )}
    </div>
  );
}

