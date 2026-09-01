import { useState } from 'react';
import { generateFollowUp } from '../api';

interface FollowUpModalProps {
  applicationId?: number;
  jobId: number;
  companyName: string;
  roleTitle: string;
  onClose: () => void;
}

export default function FollowUpModal({ jobId, companyName, roleTitle, onClose }: FollowUpModalProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    const data = await generateFollowUp(jobId);
    setEmail(data.follow_up_email);
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(email);
    alert('Copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Follow Up: {roleTitle} at {companyName}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 text-2xl font-bold leading-none">
            &times;
          </button>
        </div>

        {!email && (
          <div className="text-center py-10">
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
              Has it been a while since you heard back? Generate a polite follow-up email to check in.
            </p>
            <button 
              onClick={handleGenerate} 
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 disabled:opacity-50 font-medium transition-colors"
            >
              {loading ? 'Drafting...' : 'Generate Follow-Up'}
            </button>
          </div>
        )}

        {email && (
          <div>
            <textarea
              className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-md mb-4 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <div className="flex justify-end space-x-3">
              <button onClick={copyToClipboard} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                Copy
              </button>
              <button onClick={onClose} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
