import React, { useState } from 'react';
import { generateInterviewPrep } from '../api';

interface InterviewPrepModalProps {
  jobId: number;
  companyName: string;
  roleTitle: string;
  onClose: () => void;
}

const InterviewPrepModal: React.FC<InterviewPrepModalProps> = ({ jobId, companyName, roleTitle, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateInterviewPrep(jobId);
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold dark:text-white">Interview Prep: {roleTitle} at {companyName}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">&times;</button>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          {!data ? (
            <div className="text-center py-10">
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                Generate custom interview questions and tips based on this specific job description.
              </p>
              <button 
                onClick={handleGenerate}
                disabled={loading}
                className="bg-indigo-600 text-white px-6 py-3 rounded shadow hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Interview Prep'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="font-bold text-lg dark:text-white">Predicted Interview Questions</h3>
              {data.questions.map((q: any, i: number) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-700 p-4 rounded border border-gray-200 dark:border-gray-600">
                  <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 text-xs font-semibold rounded mb-2">
                    {q.type}
                  </span>
                  <p className="font-semibold text-gray-900 dark:text-white mb-2">{q.question}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300"><span className="font-semibold text-gray-700 dark:text-gray-200">Tip:</span> {q.tips}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t dark:border-gray-700 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 border rounded text-gray-600 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewPrepModal;
