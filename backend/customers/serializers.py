from rest_framework import serializers
from .models import CustomerProfile

class CustomerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerProfile
        fields = ['username', 'email', 'nickname', 'date_of_birth', 'city', 'state', 'country', 'phone_number', 'profile_picture', 'favorites']
