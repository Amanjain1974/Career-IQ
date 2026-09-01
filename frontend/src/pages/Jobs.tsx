import { useEffect, useState } from 'react';
import { getJobs } from '../api';
import AddJobModal from '../components/AddJobModal';

export default function Jobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchJobs = () => {
    getJobs().then(data => setJobs(data));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Recommended Jobs</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Add Job Description
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {jobs.map((job) => (
            <li key={job.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-indigo-600 truncate">{job.title || job.role}</p>
                  <div className="ml-2 flex-shrink-0 flex space-x-2">
                    {job.risk_score && job.risk_score !== 'LOW RISK' && (
                      <span title={job.risk_reason || 'Potential Scam'} className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 cursor-help">
                        {job.risk_score}
                      </span>
                    )}
                    {job.risk_score === 'LOW RISK' && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Safe
                      </span>
                    )}
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {job.match || (job.match_score ? `${job.match_score}%` : '90%')} Match
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      {job.company} - {job.location || 'Unknown'} {job.work_mode && `(${job.work_mode})`}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      Added {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Recently'}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
          {jobs.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-500">No jobs found. Add some!</div>
          )}
        </ul>
      </div>

      {showAddModal && (
        <AddJobModal 
          onClose={() => setShowAddModal(false)} 
          onSuccess={() => {
            setShowAddModal(false);
            fetchJobs();
          }} 
        />
      )}
    </div>
  );
}
