from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CandidateProfileViewSet, ResumeViewSet, EducationViewSet, ExperienceViewSet

router = DefaultRouter()
router.register(r'profiles', CandidateProfileViewSet, basename='profile')
router.register(r'resumes', ResumeViewSet, basename='resume')
router.register(r'education', EducationViewSet, basename='education')
router.register(r'experience', ExperienceViewSet, basename='experience')

urlpatterns = [
    path('', include(router.urls)),
]
