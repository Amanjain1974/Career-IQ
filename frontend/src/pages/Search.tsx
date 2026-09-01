import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getJobs, getApplications } from '../api';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [jobs, setJobs] = useState<any[]>([]);
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([
      getJobs({ search: query }),
      getApplications({ search: query, archived: true })
    ]).then(([jobsData, appsData]) => {
      setJobs(jobsData);
      setApps(appsData);
    }).finally(() => {
      setLoading(false);
    });
  }, [query]);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Search Results for "{query}"</h1>

      {loading ? (
        <div>Searching...</div>
      ) : (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Applications ({apps.length})</h2>
            {apps.length === 0 ? (
              <p className="text-gray-500">No applications found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {apps.map(app => (
                  <div key={app.id} className="p-4 bg-white dark:bg-gray-800 rounded shadow border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between">
                      <h3 className="font-bold text-lg">{app.role}</h3>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">{app.status}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{app.company}</p>
                    {app.notes && (
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-500 truncate">Notes: {app.notes}</p>
                    )}
                    <div className="mt-4">
                      <Link to="/applications" className="text-indigo-600 hover:underline text-sm">View in Tracker</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Saved Jobs ({jobs.length})</h2>
            {jobs.length === 0 ? (
              <p className="text-gray-500">No jobs found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map(job => (
                  <div key={job.id} className="p-4 bg-white dark:bg-gray-800 rounded shadow border border-gray-200 dark:border-gray-700">
                    <h3 className="font-bold text-lg">{job.role}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{job.company}</p>
                    <div className="mt-4">
                      <Link to="/jobs" className="text-indigo-600 hover:underline text-sm">View in Jobs</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
