from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import CandidateProfile, Resume, Education, Experience
from .serializers import CandidateProfileSerializer, ResumeSerializer, EducationSerializer, ExperienceSerializer

class CandidateProfileViewSet(viewsets.ModelViewSet):
    serializer_class = CandidateProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CandidateProfile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ResumeViewSet(viewsets.ModelViewSet):
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Resume.objects.filter(candidate__user=self.request.user)

    def perform_create(self, serializer):
        profile, created = CandidateProfile.objects.get_or_create(user=self.request.user)
        serializer.save(candidate=profile)
        
    @action(detail=True, methods=['post'])
    def parse(self, request, pk=None):
        resume = self.get_object()
        # Mocking parsing logic for now
        resume.extracted_text = "Parsed content of resume..."
        resume.save()
        return Response({"status": "parsed", "text": resume.extracted_text})

class EducationViewSet(viewsets.ModelViewSet):
    serializer_class = EducationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Education.objects.filter(profile__user=self.request.user)

class ExperienceViewSet(viewsets.ModelViewSet):
    serializer_class = ExperienceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Experience.objects.filter(profile__user=self.request.user)
