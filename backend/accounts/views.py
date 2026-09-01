from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer
from candidates.models import CandidateProfile, Experience, Education
from jobs.models import Application

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class UserMeView(generics.RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated,)
    
    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        from rest_framework import serializers
        class UserSerializer(serializers.ModelSerializer):
            class Meta:
                model = User
                fields = ('id', 'username', 'email')
                read_only_fields = ('id', 'username')
        return UserSerializer

class DataExportView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user
        data = {
            "user": {
                "username": user.username,
                "email": user.email,
            }
        }

        # Profile Data
        profile = CandidateProfile.objects.filter(user=user).first()
        if profile:
            data['profile'] = {
                "summary": profile.summary,
            }
            
            # Experiences
            experiences = Experience.objects.filter(profile=profile).values(
                'company', 'role', 'start_date', 'end_date', 'description'
            )
            data['experiences'] = list(experiences)
            
            # Educations
            educations = Education.objects.filter(profile=profile).values(
                'institution', 'degree', 'field_of_study', 'start_date', 'end_date'
            )
            data['educations'] = list(educations)
            
            # Applications
            applications = Application.objects.filter(candidate=profile).values(
                'job__company', 'job__role', 'status', 'applied_date', 'match_score'
            )
            data['applications'] = list(applications)

        if request.query_params.get('format') == 'csv':
            import csv
            from django.http import HttpResponse
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename="careeriq_applications.csv"'
            writer = csv.writer(response)
            writer.writerow(['Company', 'Role', 'Status', 'Applied Date', 'Match Score'])
            
            if profile:
                applications = Application.objects.filter(candidate=profile)
                for app in applications:
                    writer.writerow([app.job.company, app.job.role, app.status, app.applied_date, app.match_score])
            return response

        return Response(data)

