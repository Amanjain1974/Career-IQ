import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJobs, createApplication } from '../api';
import AddJobModal from '../components/AddJobModal';
import SummarizeJobModal from '../components/SummarizeJobModal';

export default function Jobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [summarizeJob, setSummarizeJob] = useState<any>(null);

  const fetchJobs = () => {
    getJobs().then(data => setJobs(data));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Saved Jobs</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Add Job Description
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {jobs.map((job) => (
            <li key={job.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">{job.title || job.role}</p>
                    {job.is_applied && (
                      <span className="px-2 inline-flex text-[10px] uppercase font-bold tracking-wide leading-5 rounded-full bg-green-100 text-green-800 border border-green-200">
                        Applied
                      </span>
                    )}
                  </div>
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
                    {job.source && (
                      <span className="px-2 inline-flex text-[10px] uppercase font-bold tracking-wide leading-5 rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                        {job.source}
                      </span>
                    )}
                    {job.salary_min && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        ${(job.salary_min / 1000).toFixed(0)}k {job.salary_max ? `- ${(job.salary_max / 1000).toFixed(0)}k` : '+'}
                      </span>
                    )}
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSummarizeJob(job); }}
                      className="px-2 inline-flex text-xs leading-5 font-semibold rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-700"
                    >
                      Summarize AI
                    </button>
                    {!job.is_applied && (
                      <button 
                        onClick={async (e) => { 
                          e.stopPropagation(); 
                          try {
                            await createApplication({ job: job.id, status: 'Saved' });
                            fetchJobs();
                            navigate('/applications');
                          } catch (err) {
                            alert('Failed to start application');
                          }
                        }}
                        className="px-2 inline-flex text-xs leading-5 font-semibold rounded bg-green-600 text-white hover:bg-green-700"
                      >
                        Start Application
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      {job.company} - {job.location || 'Unknown'} {job.work_mode && `(${job.work_mode})`}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                    <p>
                      Added {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Recently'}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
          {jobs.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">No jobs found. Add some!</div>
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

      {summarizeJob && (
        <SummarizeJobModal 
          jobId={summarizeJob.id}
          companyName={summarizeJob.company}
          roleTitle={summarizeJob.title || summarizeJob.role}
          onClose={() => setSummarizeJob(null)}
        />
      )}
    </div>
  );
}
