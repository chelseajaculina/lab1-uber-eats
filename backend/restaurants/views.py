from django.shortcuts import render, redirect
from .models import Restaurant, Dish, Order
from django.contrib.auth.hashers import make_password, check_password

def signup(request):
    if request.method == 'POST':
        # Handle restaurant signup form submission
        name = request.POST['name']
        email = request.POST['email']
        password = make_password(request.POST['password'])
        location = request.POST['location']
        
        restaurant = Restaurant(name=name, email=email, password=password, location=location)
        restaurant.save()
        return redirect('restaurant_signin')
    return render(request, 'restaurant/signup.html')

def signin(request):
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']
        
        restaurant = Restaurant.objects.get(email=email)
        if check_password(password, restaurant.password):
            # Store restaurant in session and redirect to dashboard
            request.session['restaurant_id'] = restaurant.id
            return redirect('restaurant_dashboard')
        else:
            # Show error
            pass
    return render(request, 'restaurant/signin.html')

def dashboard(request):
    # Restaurant dashboard with profile, dishes, and orders
    return render(request, 'restaurant/dashboard.html')

def profile_management(request):
    # Handle viewing and updating restaurant profile
    return render(request, 'restaurant/profile.html')

def add_dish(request):
    if request.method == 'POST':
        # Add new dish
        name = request.POST['name']
        ingredients = request.POST['ingredients']
        image = request.FILES['image']
        price = request.POST['price']
        category = request.POST['category']
        
        restaurant = Restaurant.objects.get(id=request.session['restaurant_id'])
        dish = Dish(restaurant=restaurant, name=name, ingredients=ingredients, image=image, price=price, category=category)
        dish.save()
    return render(request, 'restaurant/add_dish.html')

def manage_orders(request):
    restaurant = Restaurant.objects.get(id=request.session['restaurant_id'])
    orders = Order.objects.filter(restaurant=restaurant)
    return render(request, 'restaurant/orders.html', {'orders': orders})
