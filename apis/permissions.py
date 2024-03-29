from rest_framework.permissions import BasePermission

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