from django.urls import path
from .views import tailor_resume, generate_cover_letter, generate_interview_prep, negotiate_salary

urlpatterns = [
    path('tailor-resume/', tailor_resume, name='tailor_resume'),
    path('cover-letter/', generate_cover_letter, name='generate_cover_letter'),
    path('interview-prep/', generate_interview_prep, name='generate_interview_prep'),
    path('negotiate/', negotiate_salary, name='negotiate_salary'),
]
