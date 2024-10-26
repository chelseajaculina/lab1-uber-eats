from rest_framework import status, generics, permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate
from .models import Restaurant, Dish
from .serializers import (
    RestaurantSerializer, 
    DishSerializer, 
    RestaurantSignUpSerializer
)
import logging

logger = logging.getLogger(__name__)

# Restaurant Sign-Up View
class RestaurantSignUpView(generics.CreateAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSignUpSerializer
    permission_classes = [permissions.AllowAny]

# Restaurant Login View
class RestaurantLoginView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        logger.info(f"Request data: {request.data}")
        
        # Blacklist any existing tokens for the user
        tokens = OutstandingToken.objects.filter(user__username=request.data.get('username'))
        for token in tokens:
            try:
                BlacklistedToken.objects.get_or_create(token=token)
            except Exception as e:
                logger.error(f"Error blacklisting token: {e}")
        
        response = super().post(request, *args, **kwargs)
        response.data['message'] = 'You are now logged in successfully.'
        return response

# Restaurant Logout View
class RestaurantLogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            logger.error(f"Error during logout: {str(e)}")
            return Response(status=status.HTTP_400_BAD_REQUEST)

# Restaurant Profile View
class RestaurantProfileView(APIView):
    serializer_class = RestaurantSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def patch(self, request):
        try:
            restaurant = Restaurant.objects.get(pk=request.user.pk)
            serializer = RestaurantSerializer(restaurant, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                data = serializer.data
                data['profile_picture'] = request.build_absolute_uri(restaurant.profile_picture.url) if restaurant.profile_picture else None
                return Response(data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Restaurant.DoesNotExist:
            return Response({'error': 'Restaurant not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Upload Restaurant Profile Picture View
class UploadRestaurantProfilePictureView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            restaurant = Restaurant.objects.get(pk=request.user.pk)
            if 'profile_picture' in request.data and request.data['profile_picture'] is None:
                restaurant.profile_picture.delete(save=False)
                restaurant.profile_picture = None
                restaurant.save()
                return Response({'profilePicture': None}, status=status.HTTP_200_OK)

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
            logger.error(f"Error: {e}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Get Restaurant Data View
class GetRestaurantDataView(APIView):
    serializer_class = RestaurantSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = RestaurantSerializer(request.user)
        return Response(serializer.data)

# Dish Management Views
class DishListCreateView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.user_type == 'restaurant':
            dishes = Dish.objects.filter(restaurant=request.user)
            serializer = DishSerializer(dishes, many=True)
            return Response(serializer.data)
        return Response({"detail": "You are not authorized to view this resource."}, status=status.HTTP_403_FORBIDDEN)

    def post(self, request):
        if request.user.user_type == 'restaurant':
            data = request.data.copy()
            data['restaurant'] = request.user.id
            serializer = DishSerializer(data=data)
            if serializer.is_valid():
                serializer.save(restaurant=request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "You are not authorized to add a dish."}, status=status.HTTP_403_FORBIDDEN)

class DishDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

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

# Restaurant Detail View with Dishes
class RestaurantDetailView(APIView):
    def get(self, request, restaurant_name):
        restaurant = get_object_or_404(Restaurant, restaurant_name__iexact=restaurant_name)
        restaurant_serializer = RestaurantSerializer(restaurant)
        dishes = Dish.objects.filter(restaurant=restaurant)
        dish_serializer = DishSerializer(dishes, many=True)
        return Response({
            'restaurant': restaurant_serializer.data,
            'dishes': dish_serializer.data
        }, status=status.HTTP_200_OK)
