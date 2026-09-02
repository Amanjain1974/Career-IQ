from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
import random

class User(AbstractUser):
    is_candidate = models.BooleanField(default=True)
    is_employer = models.BooleanField(default=False)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    is_phone_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.email

class OTPVerification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='otps')
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    def generate_otp(self):
        self.otp_code = str(random.randint(100000, 999999))
        self.save()

    def is_valid(self):
        # OTP valid for 10 minutes
        if self.is_used:
            return False
        expiry_time = self.created_at + timezone.timedelta(minutes=10)
        return timezone.now() <= expiry_time
