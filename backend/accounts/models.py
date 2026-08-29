from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    is_candidate = models.BooleanField(default=True)
    is_employer = models.BooleanField(default=False)
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.email

