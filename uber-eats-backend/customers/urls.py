from django.urls import path
from .views import CustomerSignUpView, LogoutView, CustomerProfileView, UploadProfilePictureView, GetCustomerDataView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', CustomerSignUpView.as_view(), name='customer-register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('update/', CustomerProfileView.as_view(), name='customer-update'),
    path('upload-profile-picture/', UploadProfilePictureView.as_view(), name='upload-profile-picture'),
    path('me/', GetCustomerDataView.as_view(), name='customer-profile'),
]