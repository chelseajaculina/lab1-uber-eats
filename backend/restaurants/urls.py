from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup, name='restaurant_signup'),
    path('signin/', views.signin, name='restaurant_signin'),
    path('dashboard/', views.dashboard, name='restaurant_dashboard'),
    path('profile/', views.profile_management, name='profile_management'),
    path('add-dish/', views.add_dish, name='add_dish'),
    path('orders/', views.manage_orders, name='manage_orders'),
]
