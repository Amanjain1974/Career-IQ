import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const login = async (credentials: any) => {
  const response = await axios.post('http://localhost:8000/api/token/', credentials);
  return response.data;
};

export const register = async (userData: any) => {
  const response = await axios.post('http://localhost:8000/api/accounts/register/', userData);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const getDashboardStats = async () => {
  try {
    const response = await api.get('/analytics/dashboard/');
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard stats", error);
    // Return mock data if backend is not running yet
    return {
      total_applications: 12,
      interviews: 3,
      rejections: 2,
      offers: 1,
      interview_rate: 25,
      most_common_skill_gaps: ['Airflow', 'Kafka'],
      average_fit_score: 84.5
    };
  }
};

export const getJobs = async (params: any = {}) => {
  try {
    const response = await api.get('/jobs/jobs/', { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching jobs", error);
    return [
      { id: 1, title: 'Data Engineer (Mock)', company: 'TechCorp', match: '94%', location: 'Remote', risk_score: 'LOW RISK', is_applied: true },
      { id: 2, title: 'ML Engineer (Mock)', company: 'AI Inc', match: '91%', location: 'SF', risk_score: 'LOW RISK', is_applied: false },
      { id: 3, title: 'Data Entry (Mock)', company: 'Unknown', match: '40%', location: 'Remote', risk_score: 'HIGH RISK', risk_reason: 'Asks for banking details upfront.', is_applied: false },
    ];
  }
};

export const uploadResume = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const response = await api.post('/candidates/resumes/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading resume", error);
    throw error;
  }
};

export const getApplications = async (params: any = {}) => {
  try {
    const response = await api.get('/jobs/applications/', { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching applications", error);
    return [
      { id: 1, company: 'TechCorp', role: 'Data Engineer', status: 'Applied', applied_date: '2026-08-28' },
      { id: 2, company: 'AI Inc', role: 'ML Engineer', status: 'Interview', applied_date: '2026-08-29' }
    ];
  }
};

export const updateApplicationStatus = async (id: number, status: string) => {
  try {
    const response = await api.patch(`/jobs/applications/${id}/`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating application ${id}`, error);
    throw error;
  }
};

export const updateApplication = async (id: number, data: any) => {
  try {
    const response = await api.patch(`/jobs/applications/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating application ${id}`, error);
    throw error;
  }
};

export const generateCoverLetter = async (jobId: number, style: string = 'professional') => {
  try {
    const response = await api.post('/ai/cover-letter/', { job_id: jobId, style });
    return response.data;
  } catch (error) {
    console.error("Error generating cover letter", error);
    // Mock response if backend fails
    return {
      cover_letter: `Dear Hiring Manager,\n\nI am writing to express my interest in the position. With my background in data engineering and machine learning, I am confident I would be a great fit for this role.\n\nThank you for your consideration.\n\nSincerely,\nCandidate`
    };
  }
};

export const createJob = async (jobData: any) => {
  try {
    const response = await api.post('/jobs/jobs/', jobData);
    return response.data;
  } catch (error) {
    console.error("Error creating job", error);
    throw error;
  }
};

export const createApplication = async (applicationData: any) => {
  try {
    const response = await api.post('/jobs/applications/', applicationData);
    return response.data;
  } catch (error) {
    console.error("Error creating application", error);
    throw error;
  }
};

export const getCandidateProfile = async () => {
  try {
    const response = await api.get('/candidates/profiles/');
    return response.data;
  } catch (error) {
    return [];
  }
};

export const updateCandidateProfile = async (id: number, data: any) => {
  const response = await api.patch(`/candidates/profiles/${id}/`, data);
  return response.data;
};

export const getExperiences = async () => {
  try {
    const response = await api.get('/candidates/experiences/');
    return response.data;
  } catch (error) {
    return [];
  }
};

export const addExperience = async (data: any) => {
  const response = await api.post('/candidates/experiences/', data);
  return response.data;
};

export const getEducations = async () => {
  try {
    const response = await api.get('/candidates/educations/');
    return response.data;
  } catch (error) {
    return [];
  }
};

export const addEducation = async (data: any) => {
  const response = await api.post('/candidates/educations/', data);
  return response.data;
};

export const tailorResume = async (jobId: number) => {
  try {
    const response = await api.post('/ai/tailor-resume/', { job_id: jobId });
    return response.data;
  } catch (error) {
    console.error("Error tailoring resume", error);
    // Mock response if backend fails
    return {
      resume: "Mock Tailored Resume:\n- Highlights of data engineering.\n- Relevant ML skills.",
      qa_report: { score: 92, recommendations: ["Add more keywords about distributed systems"] }
    };
  }
};

export const generateInterviewPrep = async (jobId: number) => {
  try {
    const response = await api.post('/ai/interview-prep/', { job_id: jobId });
    return response.data;
  } catch (error) {
    console.error("Error generating interview prep", error);
    return {
      questions: [
        {"type": "Behavioral", "question": "Tell me about a time you failed.", "tips": "Be honest and focus on learnings."},
        {"type": "Technical", "question": "How does React rendering work?", "tips": "Discuss Virtual DOM and reconciliation."}
      ]
    };
  }
};

export const negotiateSalary = async (data: { job_id: number, current_offer: string, target_salary: string, tone: string }) => {
  try {
    const response = await api.post('/ai/negotiate/', data);
    return response.data;
  } catch (error) {
    console.error("Error negotiating", error);
    return {
      negotiation_email: "Mock email: I would like to negotiate for a higher salary."
    };
  }
};

export const summarizeJob = async (jobId: number) => {
  try {
    const response = await api.post('/ai/summarize-job/', { job_id: jobId });
    return response.data;
  } catch (error) {
    console.error("Error summarizing job", error);
    return {
      summary: [
        "Responsible for building scalable data pipelines using Python and Airflow.",
        "Requires 3+ years of experience with distributed systems and SQL optimization.",
        "Tech Stack: Python, Kafka, Airflow, PostgreSQL, AWS."
      ]
    };
  }
};

export const getReminders = async () => {
  try {
    const response = await api.get('/jobs/applications/reminders/');
    return response.data;
  } catch (error) {
    console.error("Error fetching reminders", error);
    return [
      { id: 99, company: 'Stark Industries', role: 'Avenger Engineer', follow_up_date: '2026-09-01' }
    ];
  }
};

export const getMe = async () => {
  const response = await api.get('/accounts/me/');
  return response.data;
};

export const updateMe = async (data: any) => {
  const response = await api.patch('/accounts/me/', data);
  return response.data;
};

export const exportData = async () => {
  const response = await api.get('/accounts/export/');
  return response.data;
};







