
from django.contrib import admin
from django.urls import path, include
from apis.views import UserRegistrationView, UserLoginView, \
    UserLogoutView, ClrInfo,CreateClrInfo, CreateShipmentInfo, \
    GetUser, ShipmentInfo, PortInfo, TrackerInfo,UpdateCLRAPIView,\
    CreatePortInfo, CreateTrackerInfo

urlpatterns = [
    path('api/auth/register/', UserRegistrationView.as_view(), name='user-registration'),
    path('api/auth/login/', UserLoginView.as_view(), name='user-login'),
    path('api/auth/logout/', UserLogoutView.as_view(), name='user-logout'),
    path('api/clr/create', CreateClrInfo.as_view(), name='add-clr'),
    path('api/clr', ClrInfo.as_view(), name='add-clr'),
    path('api/clr/update', UpdateCLRAPIView.as_view(), name='update-clr'),
    path('api/shipment/create', CreateShipmentInfo.as_view(), name='shipment'),
    path('api/shipment', ShipmentInfo.as_view(), name='shipment'),
    path('api/port/create', CreatePortInfo.as_view(), name='container'),
    path('api/port', PortInfo.as_view(), name='container'),
    path('api/tracker/create', CreateTrackerInfo.as_view(), name='tracker'),
    path('api/tracker', TrackerInfo.as_view(), name='tracker'),
    path('api/users', GetUser.as_view(), name='users'),
    path("admin/", admin.site.urls),
]
