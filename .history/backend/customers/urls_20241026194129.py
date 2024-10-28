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
    TokenObtainPairView,
    CustomerFavoritesView,
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

    path('favorites/', CustomerFavoritesView.as_view(), name='customer-favorites'),
    path('favorites/<int:restaurant_id>/', CustomerFavoritesView.as_view(), name='remove-favorite'),
   
]