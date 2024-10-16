from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken
from .serializers import CustomerSignUpSerializer, CustomerSerializer
from .models import Customer
from rest_framework.views import APIView
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import permissions, status

class CustomerSignUpView(generics.CreateAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSignUpSerializer
    permission_classes = [AllowAny]

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.parsers import JSONParser

class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

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

from rest_framework import generics, permissions
from .models import Customer
from .serializers import CustomerSerializer

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
import logging

logger = logging.getLogger(__name__)

class CustomerProfileView(APIView):
    def post(self, request):
        return self._handle_request(request)

    def patch(self, request):
        return self._handle_request(request)

    def _handle_request(self, request):
        try:
            logger.info(f"Received request data: {request.data}")
            customer = Customer.objects.get(pk=request.user.pk)
            serializer = CustomerSerializer(customer, data=request.data, partial=True)
            if serializer.is_valid():
                logger.info(f"Serializer is valid: {serializer.validated_data}")
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                logger.error(f"Serializer is not valid: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error handling request: {str(e)}")
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

from django.http import JsonResponse
from rest_framework.decorators import permission_classes

# @permission_classes([IsAuthenticated])
# class UploadProfilePictureView(APIView):
#     parser_classes = [MultiPartParser, FormParser]
#     permission_classes = [permissions.IsAuthenticated]

#     def post(self, request, *args, **kwargs):
#         # Debugging: Check user and headers
#         print(f"User: {request.user}, Authenticated: {request.user.is_authenticated}")
#         print(f"Headers: {request.headers}")

#         if not request.user.is_authenticated:
#             return Response({'error': 'User not authenticated'}, status=status.HTTP_403_FORBIDDEN)

#         file = request.data.get('profile_picture')
#         if not file:
#             return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

#         request.user.profile_picture = file
#         request.user.save()
        
#         return Response({'profilePicture': request.user.profile_picture.url})

from rest_framework import permissions, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView

class UploadProfilePictureView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # Debugging: Check user and headers
        print(f"User: {request.user}, Authenticated: {request.user.is_authenticated}")
        print(f"Headers: {request.headers}")

        if not request.user.is_authenticated:
            return Response({'error': 'User not authenticated'}, status=status.HTTP_403_FORBIDDEN)

        file = request.data.get('profile_picture')
        if not file:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

        # Update profile picture for the authenticated user
        request.user.profile_picture = file
        request.user.save()

        # Return the profile picture URL (make sure your User model has profile_picture defined correctly)
        profile_picture_url = request.user.profile_picture.url

        return Response({'profilePicture': profile_picture_url}, status=status.HTTP_200_OK)


class GetCustomerDataView(generics.RetrieveAPIView):
    serializer_class = CustomerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user