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


from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import OTPVerification
from .services.sms import send_otp_sms

class LoginStep1View(APIView):
    permission_classes = (AllowAny,)
    
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        
        user = authenticate(username=username, password=password)
        if not user:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
            
        # Invalidate previous OTPs
        OTPVerification.objects.filter(user=user, is_used=False).update(is_used=True)
        
        # Generate new OTP
        otp_entry = OTPVerification.objects.create(user=user)
        otp_entry.generate_otp()
        
        phone = user.phone_number or "NOT_SET"
        
        # Send SMS (or print to console)
        if phone != "NOT_SET":
            send_otp_sms(phone, otp_entry.otp_code)
        else:
            # For demonstration if phone is not set, we still generate it
            send_otp_sms("NO_PHONE_NUMBER_SET", otp_entry.otp_code)
            
        return Response({
            "message": "OTP sent", 
            "username": user.username,
            "has_phone": phone != "NOT_SET"
        })

class LoginStep2View(APIView):
    permission_classes = (AllowAny,)
    
    def post(self, request):
        username = request.data.get("username")
        otp_code = request.data.get("otp")
        phone_number = request.data.get("phone_number") # Optional, to save if not set
        
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
            
        otp_entry = OTPVerification.objects.filter(user=user, otp_code=otp_code, is_used=False).last()
        if not otp_entry or not otp_entry.is_valid():
            return Response({"error": "Invalid or expired OTP"}, status=status.HTTP_400_BAD_REQUEST)
            
        # Mark used
        otp_entry.is_used = True
        otp_entry.save()
        
        # Save phone if provided during this step
        if phone_number and not user.phone_number:
            user.phone_number = phone_number
            user.is_phone_verified = True
            user.save()
            
        # Generate JWT
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        })

