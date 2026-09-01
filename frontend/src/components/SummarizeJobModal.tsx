import React, { useState } from 'react';
import { summarizeJob } from '../api';

interface SummarizeJobModalProps {
  jobId: number;
  companyName: string;
  roleTitle: string;
  onClose: () => void;
}

const SummarizeJobModal: React.FC<SummarizeJobModalProps> = ({ jobId, companyName, roleTitle, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string[] | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await summarizeJob(jobId);
      setSummary(data.summary);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold dark:text-white">AI Summary: {roleTitle} at {companyName}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            &times;
          </button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto">
          {!summary ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300 mb-4">Too long to read? Let AI extract the 3 key takeaways from this job description.</p>
              <button 
                onClick={handleGenerate}
                disabled={loading}
                className="bg-indigo-600 text-white px-6 py-2 rounded-md shadow hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Analyzing...' : 'Summarize Job Description'}
              </button>
            </div>
          ) : (
            <div>
              <h3 className="font-semibold text-lg mb-4 dark:text-white">Key Takeaways</h3>
              <ul className="list-disc pl-5 space-y-3">
                {summary.map((point, i) => (
                  <li key={i} className="text-gray-700 dark:text-gray-300">{point}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t dark:border-gray-700 flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummarizeJobModal;
