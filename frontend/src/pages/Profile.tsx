import { useState } from 'react';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('master');

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Candidate Profile</h1>
      
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('master')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'master' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Master Profile
          </button>
          <button
            onClick={() => setActiveTab('resumes')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'resumes' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Resumes
          </button>
        </nav>
      </div>

      {activeTab === 'master' ? (
        <div className="bg-white shadow sm:rounded-lg p-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Personal Information</h2>
          {/* Profile form placeholder */}
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Your single source of truth for all applications.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow sm:rounded-lg p-6 flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="mt-4 flex text-sm text-gray-600">
            <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
              <span>Upload a resume (PDF/DOCX)</span>
              <input type="file" className="sr-only" />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
