
from django.contrib import admin
from django.urls import path, include
from apis.views import UserRegistrationView, UserLoginView, \
    UserLogoutView, ClrInfo, UpdatePortInfo,UpdateTrackerInfo, \
    GetUser, ShipmentInfo, PortInfo, TrackerInfo,UpdateCLRAPIView,\
     UpdateShipmentInfo, CityInfo

urlpatterns = [
    path('api/auth/register/', UserRegistrationView.as_view(), name='user-registration'),
    path('api/auth/login/', UserLoginView.as_view(), name='user-login'),
    path('api/auth/logout/', UserLogoutView.as_view(), name='user-logout'),
    path('api/clr', ClrInfo.as_view(), name='add-clr'),
    path('api/clr/update/<str:pk>/', UpdateCLRAPIView.as_view(), name='clr-update'),
    path('api/shipment', ShipmentInfo.as_view(), name='shipment'),
    path('api/shipment/update', UpdateShipmentInfo.as_view(), name='shipment-update'),
    path('api/port', PortInfo.as_view(), name='container'),
    path('api/port/update', UpdatePortInfo.as_view(), name='container'),
    path('api/tracker', TrackerInfo.as_view(), name='tracker'),
    path('api/tracker/update', UpdateTrackerInfo.as_view(), name='tracker-update'),
    path('api/cities', CityInfo.as_view(), name='get-city'),
    path('api/users', GetUser.as_view(), name='users'),
    path("admin/", admin.site.urls),
    
    
]
