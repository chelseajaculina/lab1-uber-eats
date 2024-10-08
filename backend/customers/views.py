from django import forms
from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from .models import Customer, Restaurant
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import AuthenticationForm
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from .forms import ProfileForm, SignupForm
from .models import Customer


# HOME PAGE 
def home_page(request):
    return render(request, 'customer/home.html')  # Update this with your actual landing page template

# DASHBOARD PAGE

@login_required
def landing_page(request):
    return render(request, 'customer/dashboard.html')  # Update this with your actual landing page template

# SIGN-UP

# views.py
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model
from .forms import SignupForm

CustomerUser = get_user_model()  # Get the custom user model

def customer_signup(request):
    if request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            try:
                # Save the user instance without committing to the database yet
                user = form.save(commit=False)
                
                # Ensure that this user is specifically created as a customer
                user.is_staff = False
                user.is_superuser = False
                
                # Save user to the database
                user.save()
                
                # Assign the user to the "Customers" group
                customer_group, created = Group.objects.get_or_create(name='Customers')
                user.groups.add(customer_group)

                messages.success(request, 'Account created successfully. Please log in.')
                return redirect('dashboard')  # Redirect to the dashboard or login page after signup
            except forms.ValidationError as e:
                # Catch validation errors from the form and display them
                form.add_error(None, e)  # Attach the error to the form itself
        else:
            messages.error(request, 'Error creating account. Please check the details and try again.')
    else:
        form = SignupForm()

    return render(request, 'customer/signup.html', {'form': form})


# SIGN IN
def customer_login(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        print(f"Form is valid: {form.is_valid()}")  # Check if the form is valid
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            print(f"User {user.username} has logged in.")  # Check if the user is authenticated
            return redirect('dashboard')
        else:
            print("Invalid login credentials.")  # Log if credentials are invalid
            messages.error(request, "Invalid login credentials. Please try again.")
    else:
        form = AuthenticationForm()

    return render(request, 'customer/signin.html', {'form': form})



# PROFILE


@login_required
def profile(request):
    customer = request.user # Assuming each user has one customer profile
    if request.method == 'POST':
        form = ProfilePictureForm(request.POST, request.FILES, instance=customer)
        if form.is_valid():
            form.save()
            messages.success(request, 'Your profile picture has been updated.')
            return redirect('profile')  # Redirect to the same profile page after saving
        else:
            messages.error(request, 'Error uploading profile picture.')
    else:
        form = ProfilePictureForm(instance=customer)

    return render(request, 'customer/profile.html', {'form': form})

# Step 9: Favorites View: Create a view to mark and display favorite restaurants:

from django.shortcuts import get_object_or_404

@login_required
def add_to_favorites(request, restaurant_id):
    restaurant = get_object_or_404(Restaurant, id=restaurant_id)
    request.user.favorites.add(restaurant)
    return redirect('profile')


# Step 10: Cart and Order Placement: Create a cart view where customers can add items and place an order:

@login_required
def cart_view(request):
    # Logic for displaying cart items goes here
    return render(request, 'customer/cart.html')

@login_required
def place_order(request):
    # Logic for placing order
    return render(request, 'customer/order_success.html', {'message': 'Order placed successfully'})


from django.shortcuts import redirect
from django.contrib.auth import logout


# SIGN OUT 
def customer_logout(request):
    logout(request)  # Logs out the user
    return redirect('home')  # Redirect to the landing page (or wherever you want)


from django.contrib.auth.models import Group
from django.contrib import messages
from django.shortcuts import redirect
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .forms import SignupForm

@api_view(['POST'])
def customer_signup(request):
    """
    API endpoint for customer signup
    """
    if request.method == 'POST':
        form = SignupForm(request.data)
        if form.is_valid():
            try:
                # Save the user instance without committing to the database yet
                user = form.save(commit=False)

                # Ensure that this user is specifically created as a customer
                user.is_staff = False
                user.is_superuser = False

                # Save user to the database
                user.save()

                # Assign the user to the "Customers" group
                customer_group, created = Group.objects.get_or_create(name='Customers')
                user.groups.add(customer_group)

                # Return a success response to the React frontend
                return Response({'message': 'Account created successfully. Please log in.'}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)

from django.shortcuts import render, redirect
from .forms import ProfileForm
from .models import Customer

from django.core.files.base import ContentFile

from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .forms import UpdateProfileForm, ProfileForm
from .models import Profile

@login_required
def update_profile(request):
    if request.method == 'POST':
        user_form = UpdateProfileForm(request.POST, instance=request.user)
        profile_form = ProfileForm(request.POST, request.FILES, instance=request.user.profile)
        if user_form.is_valid() and profile_form.is_valid():
            user_form.save()
            profile_form.save()
            return redirect('profile')
    else:
        user_form = UpdateProfileForm(instance=request.user)
        profile_form = ProfileForm(instance=request.user.profile)
    return render(request, 'update_profile.html', {'user_form': user_form, 'profile_form': profile_form})

from django.shortcuts import render, redirect
from .forms import ProfilePictureForm
from .models import Profile

@login_required
def update_profile_picture(request):
    if request.method == 'POST':
        form = ProfilePictureForm(request.POST, request.FILES, instance=request.user.profile)
        if form.is_valid():
            form.save()
            return redirect('profile')
    else:
        form = ProfilePictureForm(instance=request.user.profile)
    return render(request, 'update_profile_picture.html', {'form': form})

from django.shortcuts import render, redirect
from .forms import UpdateUserProfileForm

from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import UpdateUserProfileForm

def update_profile(request):
    if request.method == 'POST':
        form = UpdateUserProfileForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, 'Your profile has been updated successfully!')
            return redirect('profile')
    else:
        form = UpdateUserProfileForm(instance=request.user)
    return render(request, 'update_profile.html', {'form': form})