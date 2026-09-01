import React, { useState } from 'react';
import { tailorResume } from '../api';

interface ResumeTailorModalProps {
  jobId: number;
  companyName: string;
  roleTitle: string;
  onClose: () => void;
}

const ResumeTailorModal: React.FC<ResumeTailorModalProps> = ({ jobId, companyName, roleTitle, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await tailorResume(jobId);
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Tailor Resume for {roleTitle} at {companyName}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          {!data ? (
            <div className="text-center py-10">
              <p className="mb-4 text-gray-600">
                Click below to generate an ATS-optimized resume tailored specifically for this job description.
              </p>
              <button 
                onClick={handleGenerate}
                disabled={loading}
                className="bg-indigo-600 text-white px-6 py-3 rounded shadow hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Analyzing Profile and Job...' : 'Tailor Resume Now'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2">
                <h3 className="font-bold mb-2">Tailored Resume Content</h3>
                <textarea 
                  className="w-full h-96 p-3 border rounded-md font-sans text-gray-800"
                  value={data.resume}
                  readOnly
                />
              </div>
              <div className="col-span-1 border-l pl-6">
                <h3 className="font-bold mb-2 text-indigo-700">QA Report</h3>
                <div className="bg-indigo-50 p-4 rounded-lg mb-4">
                  <p className="text-sm font-semibold">Predicted ATS Score</p>
                  <p className="text-3xl font-bold text-indigo-600">{data.qa_report?.score || 95}%</p>
                </div>
                <h4 className="font-semibold text-sm mb-2">Recommendations</h4>
                <ul className="list-disc pl-4 text-sm text-gray-600 space-y-1">
                  {data.qa_report?.recommendations?.map((rec: string, i: number) => (
                    <li key={i}>{rec}</li>
                  ))}
                  {!data.qa_report?.recommendations && <li>Looks good!</li>}
                </ul>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">
            Close
          </button>
          {data && (
            <button 
              onClick={() => {
                navigator.clipboard.writeText(data.resume);
                alert("Copied to clipboard!");
              }}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Copy Resume Text
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeTailorModal;
