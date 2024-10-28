# customers/admin.py

from django.contrib import admin
from .models import Customer

class CustomerAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'get_favorites']  # Customize fields shown in the list view
    search_fields = ['username', 'email']
    list_filter = ['favorites']  # Allow filtering by favorites

    # Custom method to display favorites in admin
    def get_favorites(self, obj):
        return ", ".join([restaurant.restaurant_name for restaurant in obj.favorites.all()])
    get_favorites.short_description = 'Favorites'  # Column header name in the admin panel

# Register the model with the customized admin
admin.site.register(Customer, CustomerAdmin)
