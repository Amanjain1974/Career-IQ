import React, { useState } from 'react';
import { updateApplication } from '../api';

interface NotesModalProps {
  applicationId: number;
  initialNotes: string;
  initialReferralName?: string;
  initialReferralEmail?: string;
  companyName: string;
  roleTitle: string;
  onClose: () => void;
  onSaved: (newNotes: string, refName: string, refEmail: string) => void;
}

const NotesModal: React.FC<NotesModalProps> = ({ applicationId, initialNotes, initialReferralName, initialReferralEmail, companyName, roleTitle, onClose, onSaved }) => {
  const [notes, setNotes] = useState(initialNotes || '');
  const [referralName, setReferralName] = useState(initialReferralName || '');
  const [referralEmail, setReferralEmail] = useState(initialReferralEmail || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateApplication(applicationId, { notes, referral_name: referralName, referral_email: referralEmail });
      onSaved(notes, referralName, referralEmail);
      onClose();
    } catch (e) {
      alert("Failed to save notes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold dark:text-white">Journal & Referrals: {roleTitle} at {companyName}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">&times;</button>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4 mb-4 border-b dark:border-gray-700 pb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Referral Name (if any)</label>
              <input 
                type="text" 
                value={referralName} 
                onChange={e => setReferralName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Referral Email</label>
              <input 
                type="email" 
                value={referralEmail} 
                onChange={e => setReferralEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none"
              />
            </div>
          </div>
          
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Application Notes</label>
          <textarea
            className="w-full h-64 p-3 border rounded-md font-sans text-gray-800 dark:text-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Log interview questions, names of interviewers, pros/cons, and follow-up tasks here..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>
        
        <div className="p-4 border-t dark:border-gray-700 flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 border rounded text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Notes & Referrals'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotesModal;
