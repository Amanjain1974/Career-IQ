import React, { useState } from 'react';
import { tailorResume, updateApplication } from '../api';

interface ResumeTailorModalProps {
  applicationId: number;
  jobId: number;
  initialResume?: string;
  companyName: string;
  roleTitle: string;
  onClose: () => void;
  onSaved: (resume: string) => void;
}

const ResumeTailorModal: React.FC<ResumeTailorModalProps> = ({ applicationId, jobId, initialResume, companyName, roleTitle, onClose, onSaved }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [resumeText, setResumeText] = useState<string>(initialResume || '');
  const [saving, setSaving] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await tailorResume(jobId); 
      setResult(data);
      setResumeText(data.resume || '');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!resumeText) return;
    setSaving(true);
    try {
      await updateApplication(applicationId, { tailored_resume: resumeText });
      onSaved(resumeText);
      alert("Tailored Resume saved to application!");
    } catch (e) {
      alert("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold dark:text-white">Tailored Resume: {roleTitle} at {companyName}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            &times;
          </button>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          {!result && !resumeText && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300 mb-4">Click below to generate a resume explicitly tailored for {companyName}.</p>
              <button 
                onClick={handleGenerate}
                disabled={loading}
                className="bg-green-600 text-white px-6 py-2 rounded-md shadow hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Analyzing & Tailoring...' : 'Generate Tailored Resume'}
              </button>
            </div>
          )}

          {(resumeText || result) && (
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg dark:text-white">Generated Resume</h3>
                  {!loading && (
                    <button 
                      onClick={handleGenerate}
                      className="text-sm text-green-600 dark:text-green-400 hover:underline"
                    >
                      Regenerate
                    </button>
                  )}
                </div>
                <textarea 
                  className="w-full h-96 p-4 border rounded-md font-mono text-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={resumeText}
                  onChange={e => setResumeText(e.target.value)}
                />
              </div>

              {result?.qa_report && (
                <div className="md:w-1/3">
                  <h3 className="font-semibold text-lg mb-2 dark:text-white">QA Report</h3>
                  <div className="bg-blue-50 dark:bg-blue-900 border border-blue-100 dark:border-blue-800 rounded-lg p-4">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-300 mb-2">
                      {result.qa_report.score}/100
                    </div>
                    <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-2">ATS Match Score</p>
                    
                    <h4 className="text-sm font-semibold mt-4 mb-2 dark:text-white">Recommendations:</h4>
                    <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300 list-disc pl-4">
                      {result.qa_report.recommendations.map((rec: string, i: number) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t dark:border-gray-700 flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 border rounded text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Close
          </button>
          {resumeText && (
            <>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(resumeText);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500"
              >
                Copy
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save to DB'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeTailorModal;
