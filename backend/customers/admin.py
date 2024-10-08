from django.contrib import admin

from .models import Customer, Restaurant

# Register your models here.
admin.site.register(Restaurant)

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Customer

class CustomerAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('nickname', 'date_of_birth', 'city', 'state', 'country', 'phone', 'profile_picture')}),
    )

admin.site.register(Customer, CustomerAdmin)
