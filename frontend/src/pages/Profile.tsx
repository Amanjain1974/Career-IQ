import { useState, useEffect } from 'react';
import { uploadResume, getCandidateProfile, getExperiences, getEducations, updateCandidateProfile, addExperience, addEducation } from '../api';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('master');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  
  // Master Profile State
  const [profile, setProfile] = useState<any>(null);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [educations, setEducations] = useState<any[]>([]);
  const [summary, setSummary] = useState('');

  // New item state
  const [newExp, setNewExp] = useState({ company: '', job_title: '', responsibilities: '' });
  const [newEdu, setNewEdu] = useState({ institution: '', degree: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const profs = await getCandidateProfile();
    if (profs.length > 0) {
      setProfile(profs[0]);
      setSummary(profs[0].summary || '');
    }
    const exps = await getExperiences();
    setExperiences(exps);
    const edus = await getEducations();
    setEducations(edus);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadMessage('');
    try {
      await uploadResume(file);
      setUploadMessage('Resume uploaded and parsed successfully!');
      fetchData(); // Refresh data as parsing might have updated it
    } catch (error) {
      setUploadMessage('Failed to upload resume. Make sure the backend is running.');
    } finally {
      setIsUploading(false);
    }
  };

  const saveSummary = async () => {
    if (profile) {
      await updateCandidateProfile(profile.id, { summary });
      alert('Summary saved');
    }
  };

  const handleAddExperience = async () => {
    if (profile && newExp.company) {
      await addExperience({ profile: profile.id, ...newExp });
      setNewExp({ company: '', job_title: '', responsibilities: '' });
      fetchData();
    }
  };

  const handleAddEducation = async () => {
    if (profile && newEdu.institution) {
      await addEducation({ profile: profile.id, ...newEdu });
      setNewEdu({ institution: '', degree: '' });
      fetchData();
    }
  };

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
        <div className="space-y-6">
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Professional Summary</h2>
            <textarea 
              rows={4}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="A brief summary of your career..."
            />
            <button onClick={saveSummary} className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded">Save Summary</button>
          </div>

          <div className="bg-white shadow sm:rounded-lg p-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Experience</h2>
            <div className="space-y-4 mb-4">
              {experiences.map(exp => (
                <div key={exp.id} className="p-4 border rounded bg-gray-50">
                  <h3 className="font-bold">{exp.job_title} at {exp.company}</h3>
                  <p className="text-sm text-gray-600">{exp.responsibilities}</p>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 grid grid-cols-2 gap-4">
              <input type="text" placeholder="Company" value={newExp.company} onChange={(e) => setNewExp({...newExp, company: e.target.value})} className="p-2 border rounded" />
              <input type="text" placeholder="Job Title" value={newExp.job_title} onChange={(e) => setNewExp({...newExp, job_title: e.target.value})} className="p-2 border rounded" />
              <textarea placeholder="Responsibilities" value={newExp.responsibilities} onChange={(e) => setNewExp({...newExp, responsibilities: e.target.value})} className="col-span-2 p-2 border rounded" />
              <button onClick={handleAddExperience} className="bg-green-600 text-white px-4 py-2 rounded w-48">Add Experience</button>
            </div>
          </div>

          <div className="bg-white shadow sm:rounded-lg p-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Education</h2>
            <div className="space-y-4 mb-4">
              {educations.map(edu => (
                <div key={edu.id} className="p-4 border rounded bg-gray-50">
                  <h3 className="font-bold">{edu.degree}</h3>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 grid grid-cols-2 gap-4">
              <input type="text" placeholder="Institution" value={newEdu.institution} onChange={(e) => setNewEdu({...newEdu, institution: e.target.value})} className="p-2 border rounded" />
              <input type="text" placeholder="Degree" value={newEdu.degree} onChange={(e) => setNewEdu({...newEdu, degree: e.target.value})} className="p-2 border rounded" />
              <button onClick={handleAddEducation} className="bg-green-600 text-white px-4 py-2 rounded w-48">Add Education</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow sm:rounded-lg p-6 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 relative">
          {isUploading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
              <span className="text-indigo-600 font-medium">Uploading...</span>
            </div>
          )}
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="mt-4 flex text-sm text-gray-600">
            <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
              <span>Upload a resume (PDF/DOCX)</span>
              <input type="file" className="sr-only" accept=".pdf,.docx" onChange={handleFileUpload} />
            </label>
          </div>
          {uploadMessage && <p className="mt-2 text-sm text-gray-700">{uploadMessage}</p>}
        </div>
      )}
    </div>
  );
}
