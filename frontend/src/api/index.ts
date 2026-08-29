import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email: string, password: string) => {
  const response = await api.post('/token/', { email, password });
  localStorage.setItem('access_token', response.data.access);
  localStorage.setItem('refresh_token', response.data.refresh);
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

export const getJobs = async () => {
  try {
    const response = await api.get('/jobs/jobs/');
    return response.data;
  } catch (error) {
    console.error("Error fetching jobs", error);
    return [
      { id: 1, title: 'Data Engineer (Mock)', company: 'TechCorp', match: '94%', location: 'Remote' },
      { id: 2, title: 'ML Engineer (Mock)', company: 'AI Inc', match: '91%', location: 'SF' },
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

export const getApplications = async () => {
  try {
    const response = await api.get('/jobs/applications/');
    return response.data;
  } catch (error) {
    console.error("Error fetching applications", error);
    return [
      { id: 1, company: 'TechCorp', role: 'Data Engineer', status: 'Applied', applied_date: '2026-08-28' },
      { id: 2, company: 'AI Inc', role: 'ML Engineer', status: 'Interview', applied_date: '2026-08-29' }
    ];
  }
};
