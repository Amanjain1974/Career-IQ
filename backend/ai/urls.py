from django.urls import path
from .views import tailor_resume, generate_cover_letter

urlpatterns = [
    path('tailor-resume/', tailor_resume, name='tailor_resume'),
    path('cover-letter/', generate_cover_letter, name='generate_cover_letter'),
]
