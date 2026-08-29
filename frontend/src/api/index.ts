import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

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
