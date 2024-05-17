from rest_framework.permissions import BasePermission
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed
# from .models import ExpiringToken
from django.utils import timezone
class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'admin'

class IsStaff(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'staff'
    
class IsCustomer(BasePermission):
    def has_permission(self, request, view):
        print(request.user.role)
        return request.user.role == 'customer'


# class ExpiringTokenAuthentication(TokenAuthentication):
#     def authenticate_credentials(self, key):
#         try:
#             token = ExpiringToken.objects.get(key=key)
#         except ExpiringToken.DoesNotExist:
#             raise AuthenticationFailed('Invalid token')

#         if token.expiration < timezone.now():
#             # Token has expired, delete it
#             token.delete()
#             raise AuthenticationFailed('Token has expired')

#         return token.user, token