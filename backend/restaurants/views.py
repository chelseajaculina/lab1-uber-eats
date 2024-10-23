from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from .models import Restaurant, Dish
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from .serializers import RestaurantSerializer, DishSerializer, RestaurantSignUpSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

# Restaurant Sign-Up View
class RestaurantSignUpView(generics.CreateAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSignUpSerializer
    permission_classes = [AllowAny]

# Dish Management Views
class DishListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        dishes = Dish.objects.filter(restaurant=request.user)
        serializer = DishSerializer(dishes, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = DishSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(restaurant=request.user)
            return Response({"message": "Dish added successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class DishDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, dish_id):
        try:
            dish = Dish.objects.get(id=dish_id, restaurant=request.user)
            serializer = DishSerializer(dish)
            return Response(serializer.data)
        except Dish.DoesNotExist:
            return Response({"error": "Dish not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, dish_id):
        try:
            dish = Dish.objects.get(id=dish_id, restaurant=request.user)
            serializer = DishSerializer(dish, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Dish updated successfully!"}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Dish.DoesNotExist:
            return Response({"error": "Dish not found"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, dish_id):
        try:
            dish = Dish.objects.get(id=dish_id, restaurant=request.user)
            dish.delete()
            return Response({"message": "Dish deleted successfully!"}, status=status.HTTP_200_OK)
        except Dish.DoesNotExist:
            return Response({"error": "Dish not found"}, status=status.HTTP_404_NOT_FOUND)

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class RestaurantLogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Restaurant
from .serializers import RestaurantSerializer
import logging

logger = logging.getLogger(__name__)

class UpdateRestaurantProfileView(APIView):
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]  # Ensure the view can handle multipart form data

    def patch(self, request):
        try:
            # Check that the request user is authenticated
            if not request.user.is_authenticated:
                return Response({'error': 'User is not authenticated.'}, status=status.HTTP_403_FORBIDDEN)

            logger.info(f"Request data: {request.data}")  # Debugging: See what data is received by the server

            # Fetch the restaurant instance
            restaurant = Restaurant.objects.get(pk=request.user.pk)

            # Serialize and validate data
            serializer = RestaurantSerializer(restaurant, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                logger.error(f"Serializer errors: {serializer.errors}")  # Debugging
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Restaurant.DoesNotExist:
            return Response({'error': 'Restaurant not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error: {str(e)}")  # Debugging
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Restaurant

class UploadRestaurantProfilePictureView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # Debugging: Check user and headers
        print(f"User: {request.user}, Authenticated: {request.user.is_authenticated}")
        print(f"Headers: {request.headers}")

        if not request.user.is_authenticated:
            return Response({'error': 'User not authenticated'}, status=status.HTTP_403_FORBIDDEN)

        try:
            # Fetch the restaurant instance associated with the authenticated user
            restaurant = Restaurant.objects.get(user=request.user)

            file = request.data.get('profile_picture')
            if not file:
                return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

            # Update profile picture for the authenticated restaurant
            restaurant.profile_picture = file
            restaurant.save()

            # Return the profile picture URL
            profile_picture_url = restaurant.profile_picture.url

            return Response({'profilePicture': profile_picture_url}, status=status.HTTP_200_OK)

        except Restaurant.DoesNotExist:
            return Response({'error': 'Restaurant not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Error: {str(e)}")  # Debugging
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import RestaurantSerializer  # You need to create this serializer

class GetRestaurantDataView(APIView):
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):
        restaurant = request.user  # Assumes the user is authenticated
        serializer = RestaurantSerializer(restaurant)
        return Response(serializer.data)

class GetProfilePictureView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response({'error': 'User not authenticated'}, status=status.HTTP_403_FORBIDDEN)

        profile_picture_url = request.user.profile_picture.url if request.user.profile_picture else None

        if not profile_picture_url:
            return Response({'error': 'No profile picture found'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'profilePicture': profile_picture_url}, status=status.HTTP_200_OK)




from rest_framework_simplejwt.tokens import OutstandingToken, BlacklistedToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .serializers import RestaurantTokenObtainPairSerializer
import logging
from rest_framework import permissions

logger = logging.getLogger(__name__)
class CustomTokenRefreshView(TokenRefreshView):
    permission_classes = [IsAuthenticated]

from rest_framework.permissions import AllowAny

class RestaurantLoginView(TokenObtainPairView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        print(f"Request data: {request.data}")  # Debugging information

        # Blacklist any existing tokens for the user to allow a new login
        tokens = OutstandingToken.objects.filter(user__username=request.data.get('username'))
        for token in tokens:
            try:
                _, _ = BlacklistedToken.objects.get_or_create(token=token)
            except Exception as e:
                pass

        response = super().post(request, *args, **kwargs)
        response.data['message'] = 'You are now logged in successfully.'
        return response

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        customer = request.user  # Assumes the user is authenticated
        serializer = RestaurantSerializer(customer)
        return Response(serializer.data)
    

# class UpdateProfileView(APIView):
#     permission_classes = [permissions.IsAuthenticated]
#     parser_classes = [MultiPartParser, FormParser]

#     def patch(self, request, *args, **kwargs):
#         user = request.user
#         serializer = RestaurantSerializer(user, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    