from django.urls import path
from .views import RestaurantSignUpView, GetRestaurantDataView, DishListCreateView, DishDetailView, UpdateRestaurantProfileView, UploadRestaurantProfilePictureView, RestaurantLoginView
from .views import RestaurantSignUpView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # Restaurant sign-up and login
    path('signup/', RestaurantSignUpView.as_view(), name='restaurant-signup'),
    path('login/', RestaurantLoginView.as_view(), name='restaurant_token_obtain_pair'),

    # Restaurant profile management
    path('profile/', GetRestaurantDataView.as_view(), name='restaurant-profile'),

    # Dish management
    path('dishes/', DishListCreateView.as_view(), name='dish-list-create'),
    path('dishes/<int:dish_id>/', DishDetailView.as_view(), name='dish-detail'),

    path('update/', UpdateRestaurantProfileView.as_view(), name='restaurant-profile-update'),
    path('restaurants/profile/upload/', UploadRestaurantProfilePictureView.as_view(), name='restaurant-profile-upload'),

    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

]
