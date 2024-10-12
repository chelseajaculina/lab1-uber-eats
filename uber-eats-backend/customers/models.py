from django.contrib.auth.models import AbstractUser
from django.db import models

class Customer(AbstractUser):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    REQUIRED_FIELDS = ['name', 'email']  # Fields required when creating a superuser
    USERNAME_FIELD = 'username'  # Or 'email' if you want email-based login

    def __str__(self):
        return f"{self.username} - {self.email}"

