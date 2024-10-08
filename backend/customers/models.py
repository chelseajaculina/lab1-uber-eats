from django.db import models
from django.contrib.auth.models import AbstractUser

# Step 2: Create Customer Model: In customer/models.py, define a Customer model. Use Django's AbstractUser class to extend default user functionality for the customer. 
from django.contrib.auth.models import AbstractUser
from django.db import models
from django_countries.fields import CountryField  # If using django-countries for country dropdown


class Customer(AbstractUser):
    nickname = models.CharField(max_length=50, blank=True, null=True)
    date_of_birth = models.DateField(null=True, blank=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    country = CountryField(blank=True, null=True)  # Using django-countries for country dropdown
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    favorites = models.ManyToManyField('Restaurant', related_name='favorite_customers', blank=True)

    def __str__(self):
        return self.username

    # Add unique related_name for groups and user_permissions to avoid conflicts with auth.User
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customer_users',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customer_users',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )


# Step 3: Create Restaurant Model: You'll need a Restaurant model that customers can mark as favorites. You can define it in the same models.py file:
class Restaurant(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    contact_info = models.CharField(max_length=255, blank=True)
    logo = models.ImageField(upload_to='restaurant_logos/', null=True, blank=True)

    # Add more fields as needed.
    
    def __str__(self):
        return self.name

from django.db import models
from django.contrib.auth.models import User

from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_picture = models.ImageField(upload_to='profile_pics/', default='default.jpg')
    nickname = models.CharField(max_length=100, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    phone_number = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f'{self.user.username} Profile'

from django import forms
from .models import Profile

class ProfileUpdateForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ['profile_picture']
