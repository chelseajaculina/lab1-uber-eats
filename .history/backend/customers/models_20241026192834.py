from django.contrib.auth.models import AbstractUser
from django.db import models
from restaurants.models import Restaurant  # Import the Restaurant model


def upload_path(instance, filename):
    # Extract the file extension
    extension = filename.split('.')[-1]
    
    # Format the new filename with the user's username and original extension
    new_filename = f"{instance.username}_profile_picture.{extension}"
    
    # Define the full path to save the file
    return '/'.join(['profile_pictures', str(instance.username), new_filename])

class Customer(AbstractUser):
    # Custom fields for the Customer model
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    date_of_birth = models.DateField(null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=100, null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)
    nickname = models.CharField(max_length=100, null=True, blank=True)
    phone = models.CharField(max_length=15, null=True, blank=True)
    profile_picture = models.ImageField(upload_to=upload_path, null=True, blank=True)
    favorites = models.ManyToManyField(Restaurant, related_name='favorited_customers', blank=True)

  

    # Fields required by AbstractUser
    REQUIRED_FIELDS = ['email']
    USERNAME_FIELD = 'username'

    def __str__(self):
        return f"{self.username} - {self.email}"

    def get_profile_picture_url(self):
        if self.profile_picture and hasattr(self.profile_picture, 'url'):
            return self.profile_picture.url
        return '/static/images/default_profile_picture.png'  # Path to a default placeholder image

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customer_user_set',
        blank=True,
        help_text='The groups this customer belongs to.',
        verbose_name='groups'
    )

    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customer_user_permissions',
        blank=True,
        help_text='Specific permissions for this customer.',
        verbose_name='user permissions'
    )

# models.py

from django.db import models
from django.conf import settings  # Import settings to access AUTH_USER_MODEL
from restaurants.models import Restaurant

class Favorite(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='user_favorites'  # Unique related_name for the user field
    )
    restaurant = models.ForeignKey(
        Restaurant,
        on_delete=models.CASCADE,
        related_name='favorite_entries'  # Unique related_name for the restaurant field
    )

    class Meta:
        unique_together = ('user', 'restaurant')  # Each restaurant can be favorited once per user

    def __str__(self):
        return f"{self.user.username} - {self.restaurant.name}"
    
class CustomerFavoritesSerializer(serializers.ModelSerializer):
    favorites = FavoriteRestaurantSerializer(many=True, read_only=True)

    class Meta:
        model = Customer
        fields = ['id', 'username', 'favorites']