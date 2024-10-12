from rest_framework import serializers
from .models import Customer

class CustomerSignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Customer
        fields = ['id', 'username', 'name', 'email', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password')
        customer = Customer(**validated_data)
        customer.set_password(password)
        customer.save()
        return customer
    
# customers/serializers.py
class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def validate(self, attrs):
        refresh = attrs.get('refresh')
        if not refresh:
            raise serializers.ValidationError('Refresh token is required.')
        return attrs

