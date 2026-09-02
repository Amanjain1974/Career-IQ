from django.urls import path
from .views import RegisterView, UserMeView, DataExportView, LoginStep1View, LoginStep2View

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', UserMeView.as_view(), name='user_me'),
    path('export/', DataExportView.as_view(), name='data_export'),
    path('login/step1/', LoginStep1View.as_view(), name='login_step1'),
    path('login/step2/', LoginStep2View.as_view(), name='login_step2'),
]
