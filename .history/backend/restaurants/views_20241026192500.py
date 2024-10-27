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
from customers.models import Customer
from .serializers import RestaurantSerializer, DishSerializer, RestaurantSignUpSerializer
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

# Restaurant Sign-Up View
class RestaurantSignUpView(generics.CreateAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSignUpSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = RestaurantSignUpSerializer(data=request.data, context={'request': request})  # Pass request context
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get_serializer_class(self):
        if settings.LOGIN_TYPE == 'customer':
            from customers.serializers import CustomerSignUpSerializer
            return CustomerSignUpSerializer
        return RestaurantSignUpSerializer

    def get_queryset(self):
        if settings.LOGIN_TYPE == 'customer':
            from customers.models import Customer
            return Customer.objects.all()
        return Restaurant.objects.all()

# Restaurant Login View
class RestaurantLoginView(TokenObtainPairView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        logger.info(f"Request data: {request.data}")  # Debugging information

                # Select user model based on LOGIN_TYPE
        #user_model = Restaurant if settings.LOGIN_TYPE == 'restaurant' else Customer
        username = request.data.get('username')


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


# backend/restaurants/views.py

from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Restaurant
from .serializers import RestaurantSerializer
import logging

logger = logging.getLogger(__name__)

from rest_framework.parsers import MultiPartParser, FormParser

class RestaurantProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def patch(self, request, *args, **kwargs):
        try:
            restaurant = Restaurant.objects.get(pk=request.user.pk)
            serializer = RestaurantSerializer(restaurant, data=request.data, partial=True, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                data = serializer.data
                if restaurant.profile_picture:
                    data['profile_picture'] = request.build_absolute_uri(restaurant.profile_picture.url)
                return Response(data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Restaurant.DoesNotExist:
            return Response({'error': 'Restaurant not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    def get_object(self):
        if settings.LOGIN_TYPE == 'customer':
            from customers.models import Customer
            return Customer.objects.get(pk=self.request.user.pk)
        return Restaurant.objects.get(pk=self.request.user.pk)

    def get_serializer_class(self):
        if settings.LOGIN_TYPE == 'customer':
            from customers.serializers import CustomerSerializer
            return CustomerSerializer
        return RestaurantSerializer



# Upload Restaurant Profile Picture View
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Restaurant

class UploadRestaurantProfilePictureView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            if settings.LOGIN_TYPE == 'customer':
                from customers.models import Customer
                user_instance = Customer.objects.get(pk=request.user.pk)
            else:
                user_instance = Restaurant.objects.get(pk=request.user.pk)

            restaurant = request.user # Ensure that the User model has a linked Restaurant object.
            
            file = request.data.get('profile_picture')
            if not file:
                return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

            # Update profile picture
            restaurant.profile_picture = file
            restaurant.save()

            profile_picture_url = restaurant.profile_picture.url

            return Response({'profilePicture': profile_picture_url}, status=status.HTTP_200_OK)
        
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
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from .models import Dish, Restaurant
from .serializers import DishSerializer
from rest_framework.permissions import IsAuthenticated

from rest_framework.parsers import MultiPartParser, FormParser

class DishListCreateView(APIView):
    parser_classes = [MultiPartParser, FormParser]  # Handle file uploads
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get dishes related to the authenticated restaurant
        if request.user.user_type == 'restaurant':  # Assuming 'user_type' distinguishes restaurant users
            dishes = Dish.objects.filter(restaurant=request.user)
            serializer = DishSerializer(dishes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"detail": "You are not authorized to view this resource."}, status=status.HTTP_403_FORBIDDEN)


    def post(self, request):

        # Copy the request data to modify it
        data = request.data.copy()
        data['restaurant'] = request.user.id  # Automatically assign the authenticated restaurant
        
        # Pass the request context to the serializer
        serializer = DishSerializer(data=data, context={'request': request})
        
        if serializer.is_valid():
            serializer.save(restaurant=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)  # Log the errors for debugging
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
            else:
                print(serializer.errors)  # Log errors to debug
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


from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Restaurant, Dish
from .serializers import RestaurantSerializer, DishSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Restaurant, Dish
from .serializers import RestaurantSerializer, DishSerializer

class RestaurantDetailView(APIView):
    def get(self, request, restaurant_name):
        # Convert restaurant_name to lowercase to match in the database (if you are storing names in lowercase)
        restaurant_name = restaurant_name.lower()

        # Fetch the restaurant object by name (case-insensitive search)
        restaurant = get_object_or_404(Restaurant, restaurant_name__iexact=restaurant_name)

        # Serialize the restaurant data
        restaurant_serializer = RestaurantSerializer(restaurant)

        # Fetch all dishes related to this restaurant
        dishes = Dish.objects.filter(restaurant=restaurant)
        dish_serializer = DishSerializer(dishes, many=True)

        # Return the serialized restaurant data along with the list of dishes
        return Response({
            'restaurant': restaurant_serializer.data,
            'dishes': dish_serializer.data
        }, status=status.HTTP_200_OK)


from rest_framework import generics
from .models import Restaurant
from .serializers import RestaurantSerializer

class RestaurantListView(generics.ListAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer


from customers.serializers import CustomerSignUpSerializer
from customers.models import Customer

class SignUpView(generics.CreateAPIView):
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        user_type = self.request.data.get('user_type')
        if user_type == 'restaurant':
            return RestaurantSignUpSerializer
        return CustomerSignUpSerializer

    def get_queryset(self):
        user_type = self.request.data.get('user_type')
        if user_type == 'restaurant':
            return Restaurant.objects.all()
        return Customer.objects.all()

    def create(self, request, *args, **kwargs):
        user_type = request.data.get('user_type')
        if not user_type or user_type not in ['customer', 'restaurant']:
            return Response({'error': 'user_type must be either "customer" or "restaurant".'},
                            status=status.HTTP_400_BAD_REQUEST)
        
        return super().create(request, *args, **kwargs)
    

class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        user_type = request.data.get('user_type')

        user_model = Restaurant if user_type == 'restaurant' else Customer
        username = request.data.get('username')
        password = request.data.get('password')

        # Authenticate based on user model
        try:
            user = user_model.objects.get(username=username)
            if not user.is_active:
                return Response({'error': 'User account is inactive.'}, status=status.HTTP_401_UNAUTHORIZED)
        except user_model.DoesNotExist:
            return Response({'error': 'No active account found with the given credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

        # Blacklist existing tokens
        tokens = OutstandingToken.objects.filter(user=user)
        for token in tokens:
            BlacklistedToken.objects.get_or_create(token=token)

        response = super().post(request, *args, **kwargs)
        response.data['message'] = 'You are now logged in successfully.'
        return response



# customers/views.py

from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Customer
from restaurants.models import Restaurant
from .serializers import CustomerFavoritesSerializer

class CustomerFavoritesView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    #GET: Returns a list of the customer's favorite restaurants.
    def get(self, request):
        customer = request.user
        serializer = CustomerFavoritesSerializer(customer)
        return Response(serializer.data)
    # POST: Adds a restaurant to the customer's favorites.
    def post(self, request):
        customer = request.user
        restaurant_id = request.data.get('restaurant_id')
        try:
            restaurant = Restaurant.objects.get(id=restaurant_id)
            customer.favorites.add(restaurant)  # Add to favorites
            return Response({"status": "Restaurant added to favorites"}, status=status.HTTP_201_CREATED)
        except Restaurant.DoesNotExist:
            return Response({"error": "Restaurant not found"}, status=status.HTTP_404_NOT_FOUND)
    # DELETE: Removes a restaurant from the customer's favorites.
    def delete(self, request, restaurant_id):
        customer = request.user
        try:
            restaurant = Restaurant.objects.get(id=restaurant_id)
            customer.favorites.remove(restaurant)  # Remove from favorites
            return Response({"status": "Restaurant removed from favorites"}, status=status.HTTP_204_NO_CONTENT)
        except Restaurant.DoesNotExist:
            return Response({"error": "Restaurant not found"}, status=status.HTTP_404_NOT_FOUND)
