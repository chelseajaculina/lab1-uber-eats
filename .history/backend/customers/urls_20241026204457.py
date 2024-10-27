from django.urls import path, include
from .views import (
    CustomerSignUpView, 
    LogoutView, 
    CustomerProfileView, 
    UploadProfilePictureView, 
    GetCustomerDataView, 
    GetProfilePictureView, 
    CustomerLoginView, 
    TokenRefreshView, 
    CustomerFavoritesView,
    AddFavoriteView,
    RemoveFavoriteView,
)

urlpatterns = [
    path('signup/', CustomerSignUpView.as_view(), name='customer-signup'),
    path('login/', CustomerLoginView.as_view(), name='token_obtain_pair'),
    
    path('me/', GetCustomerDataView.as_view(), name='customer-profile'),

    path('update/', CustomerProfileView.as_view(), name='customer-update'),
    path('upload-profile-picture/', UploadProfilePictureView.as_view(), name='upload-profile-picture'),
    
    path('profile-picture/', GetProfilePictureView.as_view(), name='get-profile-picture'),

    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('list/', CustomerFavoritesView.as_view(), name='customer-list'),  # URL to list all customers


    path('favorites/all/', CustomerFavoritesView.as_view(), name='customer-list'),  # URL to list all customers
    path('favorites/add/', AddFavoriteView.as_view(), name='add-favorite'),
    path('favorites/remove/<int:restaurant_id>/', RemoveFavoriteView.as_view(), name='remove-favorite'),

    path('favorites/<int:restaurant_id>/', CustomerFavoritesView.as_view(), name='remove-favorite'),
    
    path('favorites/remove/<int:restaurant_id>/', RemoveFavoriteView.as_view(), name='remove-favorite'),


   
]