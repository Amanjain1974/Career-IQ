import React, { useState } from 'react';
import { negotiateSalary } from '../api';

interface NegotiateModalProps {
  applicationId: number;
  jobId: number;
  companyName: string;
  roleTitle: string;
  onClose: () => void;
}

const NegotiateModal: React.FC<NegotiateModalProps> = ({ jobId, companyName, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [currentOffer, setCurrentOffer] = useState('');
  const [targetSalary, setTargetSalary] = useState('');
  const [tone, setTone] = useState('appreciative');
  const [emailBody, setEmailBody] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await negotiateSalary({ job_id: jobId, current_offer: currentOffer, target_salary: targetSalary, tone });
      setEmailBody(data.negotiation_email);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold dark:text-white">Negotiate Offer: {companyName}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            &times;
          </button>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Offer (e.g. $100k)</label>
              <input 
                type="text" 
                value={currentOffer} 
                onChange={e => setCurrentOffer(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Target Salary (e.g. $120k)</label>
              <input 
                type="text" 
                value={targetSalary} 
                onChange={e => setTargetSalary(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tone</label>
              <select 
                value={tone} 
                onChange={(e) => setTone(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none"
              >
                <option value="appreciative">Appreciative but firm</option>
                <option value="direct">Direct & Assertive</option>
                <option value="curious">Curious & Exploring options</option>
              </select>
            </div>
            <div className="col-span-2">
              <button 
                onClick={handleGenerate}
                disabled={loading || !currentOffer || !targetSalary}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Negotiation Email'}
              </button>
            </div>
          </div>

          {emailBody && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Draft:</label>
              <textarea 
                className="w-full h-64 p-3 border rounded-md font-sans text-gray-800 dark:text-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
              />
            </div>
          )}
        </div>
        
        <div className="p-4 border-t dark:border-gray-700 flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 border rounded text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Close
          </button>
          {emailBody && (
            <button 
              onClick={() => {
                navigator.clipboard.writeText(emailBody);
                alert("Copied to clipboard!");
              }}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Copy
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NegotiateModal;
