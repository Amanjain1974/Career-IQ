import React, { useState } from 'react';
import { generateCoverLetter, updateApplication } from '../api';

interface CoverLetterGeneratorProps {
  applicationId: number;
  jobId: number;
  initialCoverLetter?: string;
  companyName: string;
  roleTitle: string;
  onClose: () => void;
  onSaved: (letter: string) => void;
}

const CoverLetterGenerator: React.FC<CoverLetterGeneratorProps> = ({ applicationId, jobId, initialCoverLetter, companyName, roleTitle, onClose, onSaved }) => {
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState<string | null>(initialCoverLetter || null);
  const [style, setStyle] = useState('professional');
  const [saving, setSaving] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await generateCoverLetter(jobId, style);
      setCoverLetter(data.cover_letter);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!coverLetter) return;
    setSaving(true);
    try {
      await updateApplication(applicationId, { cover_letter: coverLetter });
      onSaved(coverLetter);
      alert("Cover Letter saved to application!");
    } catch (e) {
      alert("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold dark:text-white">Cover Letter: {roleTitle} at {companyName}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            &times;
          </button>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="mb-4 flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tone/Style:</label>
            <select 
              value={style} 
              onChange={(e) => setStyle(e.target.value)}
              className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="professional">Professional</option>
              <option value="enthusiastic">Enthusiastic</option>
              <option value="concise">Concise</option>
              <option value="creative">Creative</option>
            </select>
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Generating...' : (coverLetter ? 'Regenerate' : 'Generate with AI')}
            </button>
          </div>

          {coverLetter && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Edit your Cover Letter:</label>
              <textarea 
                className="w-full h-64 p-3 border rounded-md font-sans text-gray-800 dark:text-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </div>
          )}
        </div>
        
        <div className="p-4 border-t dark:border-gray-700 flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 border rounded text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Close
          </button>
          {coverLetter && (
            <>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(coverLetter);
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

export default CoverLetterGenerator;
