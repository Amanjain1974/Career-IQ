from django.urls import path
from .views import RegisterView, UserMeView, DataExportView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', UserMeView.as_view(), name='user_me'),
    path('export/', DataExportView.as_view(), name='data_export'),
]
