from django.urls import path
from .views import (
    tailor_resume, generate_cover_letter, generate_interview_prep, 
    negotiate_salary, summarize_job, match_job, generate_follow_up
)

urlpatterns = [
    path('tailor-resume/', tailor_resume, name='tailor_resume'),
    path('cover-letter/', generate_cover_letter, name='generate_cover_letter'),
    path('interview-prep/', generate_interview_prep, name='generate_interview_prep'),
    path('negotiate/', negotiate_salary, name='negotiate_salary'),
    path('summarize-job/', summarize_job, name='summarize_job'),
    path('match-job/', match_job, name='match_job'),
    path('follow-up/', generate_follow_up, name='generate_follow_up'),
]
