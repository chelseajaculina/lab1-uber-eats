from django.conf import settings
from django.urls import path


from . import views


# Step 12: Update URL Patterns: In customer/urls.py, add the following:

urlpatterns = [
    path('signup/', views.customer_signup, name='customer_signup'),
    path('profile/', views.profile, name='profile'),

    path('home/', views.home_page, name='home'),  # home page route
    path('dashboard/', views.landing_page, name='dashboard'),# post log in
    path('add-to-favorites/<int:restaurant_id>/', views.add_to_favorites, name='add_to_favorites'),
    
    path('cart/', views.cart_view, name='cart'),
    path('place-order/', views.place_order, name='place_order'),

]