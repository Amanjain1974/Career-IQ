import React, { useState } from 'react';
import { generateCoverLetter } from '../api';

interface CoverLetterGeneratorProps {
  jobId: number;
  companyName: string;
  roleTitle: string;
  onClose: () => void;
}

const CoverLetterGenerator: React.FC<CoverLetterGeneratorProps> = ({ jobId, companyName, roleTitle, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [style, setStyle] = useState('professional');

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Generate Cover Letter</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="mb-4">
            <p className="text-gray-600 mb-2">
              Generating for: <strong>{roleTitle}</strong> at <strong>{companyName}</strong>
            </p>
            
            <div className="flex items-center space-x-4 mb-4">
              <label className="text-sm font-medium text-gray-700">Tone/Style:</label>
              <select 
                value={style} 
                onChange={(e) => setStyle(e.target.value)}
                className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
              >
                <option value="professional">Professional</option>
                <option value="enthusiastic">Enthusiastic</option>
                <option value="concise">Concise</option>
                <option value="creative">Creative</option>
              </select>
              <button 
                onClick={handleGenerate}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate with AI'}
              </button>
            </div>
          </div>

          {coverLetter && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Generated Cover Letter:</label>
              <textarea 
                className="w-full h-64 p-3 border rounded-md font-sans text-gray-800"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </div>
          )}
        </div>
        
        <div className="p-4 border-t flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
          {coverLetter && (
            <button 
              onClick={() => {
                navigator.clipboard.writeText(coverLetter);
                alert("Copied to clipboard!");
              }}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Copy to Clipboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoverLetterGenerator;
