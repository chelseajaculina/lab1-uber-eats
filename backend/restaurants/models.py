from django.db import models

class Restaurant(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)  # Use hashed passwords in production
    location = models.CharField(max_length=255)
    description = models.TextField()
    contact_info = models.CharField(max_length=100)
    timings = models.CharField(max_length=100)

class Dish(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    ingredients = models.TextField()
    image = models.ImageField(upload_to='dishes/')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=50)  # Appetizer, Salad, etc.

class Order(models.Model):
    STATUS_CHOICES = [
        ('New', 'New'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
        ('Preparing', 'Preparing'),
        ('On the Way', 'On the Way'),
        ('Pickup Ready', 'Pickup Ready'),
    ]
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    customer = models.ForeignKey('customers.Customer', on_delete=models.CASCADE)
    # Add other relevant order details

