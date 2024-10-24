from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from django.contrib.auth import authenticate
from .models import Restaurant, Dish
from .serializers import RestaurantSerializer, DishSerializer, RestaurantSignUpSerializer
import logging

logger = logging.getLogger(__name__)

# Restaurant Sign-Up View
class RestaurantSignUpView(generics.CreateAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSignUpSerializer
    permission_classes = [AllowAny]

# Restaurant Login View
class RestaurantLoginView(TokenObtainPairView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        logger.info(f"Request data: {request.data}")  # Debugging information

        # Blacklist any existing tokens for the user
        tokens = OutstandingToken.objects.filter(user__username=request.data.get('username'))
        for token in tokens:
            try:
                _, _ = BlacklistedToken.objects.get_or_create(token=token)
            except Exception as e:
                logger.error(f"Error blacklisting token: {e}")

        response = super().post(request, *args, **kwargs)
        response.data['message'] = 'You are now logged in successfully.'
        return response

# Restaurant Logout View
class RestaurantLogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            logger.error(f"Error during logout: {str(e)}")
            return Response(status=status.HTTP_400_BAD_REQUEST)

# Restaurant Profile Viewfrom rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Restaurant
from .serializers import RestaurantSerializer
import logging

logger = logging.getLogger(__name__)

class RestaurantProfileView(APIView):
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def patch(self, request):
        try:
            # Fetch the restaurant instance
            restaurant = Restaurant.objects.get(pk=request.user.pk)

            # Serialize and validate data
            serializer = RestaurantSerializer(restaurant, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()

                # Return response with profile picture URL
                data = serializer.data
                data['profile_picture'] = request.build_absolute_uri(restaurant.profile_picture.url) if restaurant.profile_picture else None
                return Response(data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Restaurant.DoesNotExist:
            return Response({'error': 'Restaurant not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# Upload Restaurant Profile Picture View
class UploadRestaurantProfilePictureView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            restaurant = Restaurant.objects.get(pk=request.user.pk)
            file = request.data.get('profile_picture')
            if not file:
                return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

            restaurant.profile_picture = file
            restaurant.save()

            profile_picture_url = request.build_absolute_uri(restaurant.profile_picture.url)
            return Response({'profilePicture': profile_picture_url}, status=status.HTTP_200_OK)
        except Restaurant.DoesNotExist:
            return Response({'error': 'Restaurant not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Get Restaurant Data View
class GetRestaurantDataView(APIView):
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):
        restaurant = request.user
        serializer = RestaurantSerializer(restaurant)
        return Response(serializer.data)

# Get Profile Picture View for Restaurant
class GetProfilePictureView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response({'error': 'User not authenticated'}, status=status.HTTP_403_FORBIDDEN)

        profile_picture_url = request.restaurant.profile_picture.url if request.restaurant.profile_picture else None

        if not profile_picture_url:
            return Response({'error': 'No profile picture found'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'profilePicture': profile_picture_url}, status=status.HTTP_200_OK)

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

# Custom Token Refresh View for Restaurant
class CustomTokenRefreshView(TokenRefreshView):
    permission_classes = [IsAuthenticated]

# User Profile View (Customer or Restaurant)
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = RestaurantSerializer(user)  # Assuming the serializer is adaptable for both Customer and Restaurant
        return Response(serializer.data)


# views.py
from rest_framework import viewsets
from rest_framework.response import Response
from .models import Restaurant, Dish
from .serializers import RestaurantSerializer, DishSerializer

class RestaurantViewSet(viewsets.ModelViewSet):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer

class DishViewSet(viewsets.ModelViewSet):
    queryset = Dish.objects.all()
    serializer_class = DishSerializer
