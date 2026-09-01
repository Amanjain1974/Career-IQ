import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { getApplications, updateApplicationStatus } from '../api';
import CoverLetterGenerator from '../components/CoverLetterGenerator';
import ResumeTailorModal from '../components/ResumeTailorModal';
import InterviewPrepModal from '../components/InterviewPrepModal';
import NotesModal from '../components/NotesModal';

const COLUMNS = ['Saved', 'Applied', 'Interview', 'Offer', 'Rejected'];

export default function Applications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [activeModal, setActiveModal] = useState<'cover' | 'resume' | 'interview' | 'notes' | null>(null);

  useEffect(() => {
    getApplications().then(data => setApplications(data));
  }, []);

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId;
    const appId = parseInt(draggableId);

    // Optimistic UI update
    setApplications(prev => 
      prev.map(app => app.id === appId ? { ...app, status: newStatus } : app)
    );

    try {
      await updateApplicationStatus(appId, newStatus);
    } catch (e) {
      // Revert on failure
      getApplications().then(data => setApplications(data));
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Applied': return 'bg-blue-100 text-blue-800';
      case 'Interview': return 'bg-purple-100 text-purple-800';
      case 'Offer': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const openModal = (app: any, type: 'cover' | 'resume' | 'interview' | 'notes') => {
    setSelectedApp(app);
    setActiveModal(type);
  };

  const closeModal = () => {
    setSelectedApp(null);
    setActiveModal(null);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Application Tracker</h1>
        <div className="bg-white shadow rounded-lg p-1 flex space-x-1">
          <button 
            onClick={() => setViewMode('board')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${viewMode === 'board' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Board
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
          >
            List
          </button>
        </div>
      </div>

      {viewMode === 'board' ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex space-x-4 overflow-x-auto pb-4 flex-1">
            {COLUMNS.map(columnId => (
              <div key={columnId} className="bg-gray-100 rounded-lg p-4 w-80 flex-shrink-0 flex flex-col">
                <h2 className="font-semibold text-gray-700 mb-4">{columnId}</h2>
                <Droppable droppableId={columnId}>
                  {(provided) => (
                    <div 
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex-1 min-h-[200px]"
                    >
                      {applications.filter(app => (app.status || 'Saved') === columnId).map((app, index) => (
                        <Draggable key={app.id} draggableId={app.id.toString()} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white p-4 rounded-lg shadow mb-3 border border-gray-200"
                            >
                              <h3 className="font-medium text-gray-900">{app.role}</h3>
                              <p className="text-sm text-gray-500 mb-3">{app.company}</p>
                              <div className="flex flex-wrap gap-2">
                                <button 
                                  onClick={() => openModal(app, 'cover')}
                                  className="text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-1 rounded"
                                >
                                  Cover Letter
                                </button>
                                <button 
                                  onClick={() => openModal(app, 'resume')}
                                  className="text-xs font-medium text-green-600 hover:text-green-800 bg-green-50 px-2 py-1 rounded"
                                >
                                  Tailor Resume
                                </button>
                                <button 
                                  onClick={() => openModal(app, 'interview')}
                                  className="text-xs font-medium text-purple-600 hover:text-purple-800 bg-purple-50 px-2 py-1 rounded"
                                >
                                  Prep Interview
                                </button>
                                <button 
                                  onClick={() => openModal(app, 'notes')}
                                  className="text-xs font-medium text-gray-600 hover:text-gray-800 bg-gray-100 px-2 py-1 rounded"
                                >
                                  Journal Notes
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map(app => (
                <tr key={app.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(app.status)}`}>
                      {app.status || 'Saved'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-3">
                    <button 
                      onClick={() => openModal(app, 'cover')}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Cover Letter
                    </button>
                    <button 
                      onClick={() => openModal(app, 'resume')}
                      className="text-green-600 hover:text-green-900"
                    >
                      Tailor Resume
                    </button>
                    <button 
                      onClick={() => openModal(app, 'interview')}
                      className="text-purple-600 hover:text-purple-900"
                    >
                      Prep Interview
                    </button>
                    <button 
                      onClick={() => openModal(app, 'notes')}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Journal
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedApp && activeModal === 'cover' && (
        <CoverLetterGenerator 
          applicationId={selectedApp.id}
          jobId={selectedApp.job}
          initialCoverLetter={selectedApp.cover_letter}
          companyName={selectedApp.company}
          roleTitle={selectedApp.role}
          onClose={closeModal}
          onSaved={(newLetter) => {
            setApplications(prev => prev.map(a => a.id === selectedApp.id ? { ...a, cover_letter: newLetter } : a));
          }}
        />
      )}

      {selectedApp && activeModal === 'resume' && (
        <ResumeTailorModal 
          applicationId={selectedApp.id}
          jobId={selectedApp.job}
          initialResume={selectedApp.tailored_resume}
          companyName={selectedApp.company}
          roleTitle={selectedApp.role}
          onClose={closeModal}
          onSaved={(newResume) => {
            setApplications(prev => prev.map(a => a.id === selectedApp.id ? { ...a, tailored_resume: newResume } : a));
          }}
        />
      )}

      {selectedApp && activeModal === 'interview' && (
        <InterviewPrepModal 
          jobId={selectedApp.job}
          companyName={selectedApp.company}
          roleTitle={selectedApp.role}
          onClose={closeModal}
        />
      )}

      {selectedApp && activeModal === 'notes' && (
        <NotesModal 
          applicationId={selectedApp.id}
          initialNotes={selectedApp.notes}
          companyName={selectedApp.company}
          roleTitle={selectedApp.role}
          onClose={closeModal}
          onSaved={(newNotes) => {
            setApplications(prev => prev.map(a => a.id === selectedApp.id ? { ...a, notes: newNotes } : a));
          }}
        />
      )}
    </div>
  );
}
