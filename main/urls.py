
from django.contrib import admin
from django.urls import path, include
from apis.views import UserRegistrationView, UserLoginView, \
    UserLogoutView, ClrInfo,\
    GetUser, ShipmentInfo, PortInfo, TrackerInfo,UpdateCLRAPIView

urlpatterns = [
    path('api/auth/register/', UserRegistrationView.as_view(), name='user-registration'),
    path('api/auth/login/', UserLoginView.as_view(), name='user-login'),
    path('api/auth/logout/', UserLogoutView.as_view(), name='user-logout'),
    path('api/clr/create', ClrInfo.as_view(), name='add-clr'),
    path('api/clr/update', UpdateCLRAPIView.as_view(), name='update-clr'),
    path('api/shipment/create', ShipmentInfo.as_view(), name='shipment'),
    path('api/container/create', PortInfo.as_view(), name='container'),
    path('api/tracker/create', TrackerInfo.as_view(), name='tracker'),
    path('api/uses', GetUser.as_view(), name='users'),
    path("admin/", admin.site.urls),
    # Add other URLs here
]
