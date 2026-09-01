from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Job, Application
from candidates.models import CandidateProfile
from datetime import date

User = get_user_model()

class JobAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword')
        self.client.force_authenticate(user=self.user)
        self.job = Job.objects.create(
            company="Tech Corp",
            role="Software Engineer",
            description="A great job."
        )
        self.profile = CandidateProfile.objects.create(user=self.user)

    def test_get_jobs(self):
        url = '/api/jobs/jobs/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['company'], 'Tech Corp')

    def test_create_job(self):
        url = '/api/jobs/jobs/'
        data = {
            "company": "New Corp",
            "role": "Data Scientist",
            "description": "Another great job."
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Job.objects.count(), 2)

    def test_create_application(self):
        url = '/api/jobs/applications/'
        data = {
            "job": self.job.id,
            "status": "Applied"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Application.objects.count(), 1)
        
    def test_reminders_endpoint(self):
        app = Application.objects.create(
            candidate=self.profile,
            job=self.job,
            status="Applied",
            follow_up_date=date.today()
        )
        url = '/api/jobs/applications/reminders/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], app.id)

    def test_unauthenticated_access(self):
        self.client.force_authenticate(user=None)
        url = '/api/jobs/jobs/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
