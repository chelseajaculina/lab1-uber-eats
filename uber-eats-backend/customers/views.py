from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken
from .serializers import CustomerSignUpSerializer
from .models import Customer
from rest_framework.views import APIView
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

class CustomerSignUpView(generics.CreateAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSignUpSerializer
    permission_classes = [AllowAny]

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.parsers import JSONParser


class LogoutView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                return Response({'detail': 'Refresh token is required.'}, status=400)
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'detail': 'Logout successful.'}, status=204)
        except Exception as e:
            return Response({'detail': str(e)}, status=400)


class CustomTokenRefreshView(TokenRefreshView):
    permission_classes = [IsAuthenticated]


from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from rest_framework_simplejwt.views import TokenObtainPairView

class CustomLoginView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        # Blacklist any existing tokens for the user to allow a new login
        tokens = OutstandingToken.objects.filter(user__username=request.data.get('username'))
        for token in tokens:
            try:
                _, _ = BlacklistedToken.objects.get_or_create(token=token)
            except Exception as e:
                pass
        
        response = super().post(request, *args, **kwargs)
        # Add message indicating successful login
        response.data['message'] = 'You are now logged in successfully.'
        return response
