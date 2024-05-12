
from django.contrib import admin
from django.urls import path, include
from apis.views import UserRegistrationView, UserLoginView, \
    UserLogoutView, ClrInfo, UpdatePortInfo,UpdateTrackerInfo, UpdateUser, \
    GetUser, ShipmentInfo, PortInfo, TrackerInfo,UpdateCLRAPIView,\
     UpdateShipmentInfo, CityInfo, AddcityInfo, ClientView, ChartView

urlpatterns = [
    path('api/auth/register/', UserRegistrationView.as_view(), name='user-registration'),
    path('api/auth/login/', UserLoginView.as_view(), name='user-login'),
    path('api/auth/logout/', UserLogoutView.as_view(), name='user-logout'),
    path('api/auth/update/', UpdateUser.as_view(), name='user-update'),
    path("api/users", GetUser.as_view(), name='users-list'),
    path('api/clr', ClrInfo.as_view(), name='add-clr'),
    path('api/clr/update/<str:pk>/', UpdateCLRAPIView.as_view(), name='clr-update'),
    path('api/shipment', ShipmentInfo.as_view(), name='shipment'),
    path('api/shipment/update/<str:pk>/', UpdateShipmentInfo.as_view(), name='shipment-update'),
    path('api/port', PortInfo.as_view(), name='container'),
    path('api/port/update/<str:pk>/', UpdatePortInfo.as_view(), name='port-update'),
    path('api/tracker', TrackerInfo.as_view(), name='tracker'),
    path('api/tracker/update/<str:pk>/', UpdateTrackerInfo.as_view(), name='tracker-update'),
    path('api/cities', CityInfo.as_view(), name='get-city'),
    path('api/city', AddcityInfo.as_view(), name='add-city'),
    path('api/client', ClientView.as_view(), name='client-view'),
    path('api/chart', ChartView.as_view(), name='chart-view'),
    path("admin/", admin.site.urls),
    
]
