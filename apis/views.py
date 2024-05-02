from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from .models import User, ShipmentStatus, CLRModel, PortStatus, CityWiseTracker, Addcity, ExpiringToken
from .serializers import UserSerializer, ClrSerializer, ShipmentSerializer, PortSerializer, CityWiseTrackerSerializer, AddcitySerializer
from rest_framework import status
from .permissions import IsAdmin, IsStaff,IsCustomer, ExpiringTokenAuthentication
from rest_framework.views import APIView
from django.db import connection  # Import connection
from django.http import JsonResponse
from django.utils import timezone
from django.db.models import Q

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)

class UserLoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        # print(serializer.validated_data)
        token, created = Token.objects.get_or_create(user=user)
        if not created:
            token.created = timezone.now()
            token.save()

        # Retrieve additional user data such as username and role
        user_serializer = UserSerializer(user)
        user_data = user_serializer.data

        # Set token expiration to 10 minutes
        expiration_time = token.created + timezone.timedelta(minutes=5)
        # token = ExpiringToken.objects.create(expiration=expiration_time)
        token.expiration = expiration_time
        token.save()

        # Include username, role, and token in the response
        response_data = {
            'token': token.key,
            'username': user_data['username'],
            'role': user_data['role'],
        }
        return Response(response_data)
    
        # return Response({'token': token.key , "username": user})

class UserLogoutView(generics.DestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Token.objects.all()


    def delete(self, request, *args, **kwargs):
        request.user.auth_token.delete()
        return Response({'message': 'Logout successful'}, status=status.HTTP_204_NO_CONTENT)

class GetUser(generics.ListAPIView):
    # authentication_classes = [ExpiringTokenAuthentication]
    # queryset = User.objects.filter(role='staff')
    permission_classes = (permissions.IsAuthenticated,IsAdmin)
    queryset = User.objects.filter()
    serializer_class = UserSerializer
    http_method_names = ['get'] 

class ClrInfo(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ClrSerializer
    allowed_methods = ['get','post']
    
    def get(self, request):
        page_number = int(request.query_params.get('page', 1))
        limit = int(request.query_params.get('limit', 10))
        # Calculate the offset based on the page number and limit
        offset = (page_number - 1) * limit

        # Execute the raw SQL query to fetch the first N records with pagination
        with connection.cursor() as cursor:
            cursor.execute(f"SELECT * FROM {CLRModel._meta.db_table} LIMIT %s OFFSET %s", [limit, offset])
            rows = cursor.fetchall()
            serialized_data = [dict(zip([col[0] for col in cursor.description], row)) for row in rows]

            # Execute query to fetch total count of records
            cursor.execute(f"SELECT COUNT(*) FROM {CLRModel._meta.db_table}")
            total_count = cursor.fetchone()[0]

            return JsonResponse({'total_count': total_count,'clrs': serialized_data}, status=status.HTTP_200_OK)
        
class UpdateCLRAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ClrSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CLRModel.objects.filter(pk=self.request.data["uid"])


class CLRSearchView(generics.ListAPIView):
    serializer_class = ClrSerializer

    
    def get_queryset(self):
        queryset = CLRModel.objects.all()
        conditions = []

        # Retrieve query parameters
        params = {
            'shipper_reference': self.request.query_params.getlist('shipper_reference'),
            'shipper': self.request.query_params.getlist('shipper'),
            'consignee': self.request.query_params.getlist('consignee'),
        }

        # Construct filter conditions based on query parameters
        for field, values in params.items():
            if values:
                conditions.append(Q(**{f'{field}__in': values}))

        if conditions:
            queryset = queryset.filter(*conditions)

        return queryset
    
class ShipmentInfo(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    # queryset = ShipmentStatus.objects.all()
    serializer_class = ShipmentSerializer
    http_method_names = ['get','post']


    def get(self, request):
        page_number = int(request.query_params.get('page', 1))
        limit = int(request.query_params.get('limit', 10))
        # Calculate the offset based on the page number and limit
        offset = (page_number - 1) * limit

        # Execute the raw SQL query to fetch the first N records with pagination
        with connection.cursor() as cursor:
            cursor.execute(f"SELECT * FROM {ShipmentStatus._meta.db_table} LIMIT %s OFFSET %s", [limit, offset])
            rows = cursor.fetchall()
            serialized_data = [dict(zip([col[0] for col in cursor.description], row)) for row in rows]
            
            # Execute query to fetch total count of records
            cursor.execute(f"SELECT COUNT(*) FROM {ShipmentStatus._meta.db_table}")
            total_count = cursor.fetchone()[0]
            
            return JsonResponse({'total_count': total_count,'shipments': serialized_data}, status=status.HTTP_200_OK)

class UpdateShipmentInfo(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, IsStaff, IsAdmin]
    serializer_class = ShipmentSerializer

    def get_queryset(self):
        return ShipmentStatus.objects.filter(pk=self.request.data["uid"])


class PortInfo(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PortSerializer
    queryset = PortStatus.objects.all()
    http_method_names = ['get','post']

    def get(self, request):
        page_number = int(request.query_params.get('page', 1))
        limit = int(request.query_params.get('limit', 10))
        offset = (page_number - 1) * limit

        with connection.cursor() as cursor:
            cursor.execute(f"SELECT * FROM {PortStatus._meta.db_table} LIMIT %s OFFSET %s", [limit, offset])
            rows = cursor.fetchall()
            serialized_data = [dict(zip([col[0] for col in cursor.description], row)) for row in rows]

            # Execute query to fetch total count of records
            cursor.execute(f"SELECT COUNT(*) FROM {PortStatus._meta.db_table}")
            total_count = cursor.fetchone()[0]
            
            return JsonResponse({'total_count': total_count,'ports': serialized_data}, status=status.HTTP_200_OK)


class UpdatePortInfo(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, IsStaff, IsAdmin]
    serializer_class = PortSerializer

    def get_queryset(self):
        return PortStatus.objects.filter(pk=self.request.data["uid"])


class TrackerInfo(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CityWiseTrackerSerializer
    http_method_names = ['get','post']
    
    def get(self, request):
        page_number = int(request.query_params.get('page', 1))
        limit = int(request.query_params.get('limit', 10))
        offset = (page_number - 1) * limit

        with connection.cursor() as cursor:
            cursor.execute(f"SELECT * FROM {CityWiseTracker._meta.db_table} LIMIT %s OFFSET %s", [limit, offset])
            rows = cursor.fetchall()
            serialized_data = [dict(zip([col[0] for col in cursor.description], row)) for row in rows]

            # Execute query to fetch total count of records
            cursor.execute(f"SELECT COUNT(*) FROM {CityWiseTracker._meta.db_table}")
            total_count = cursor.fetchone()[0]
            
            return JsonResponse({'total_count': total_count,'trackers': serialized_data}, status=status.HTTP_200_OK)

class AddcityInfo(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AddcitySerializer
    http_method_names = ['get','post']
    
    def get(self, request):
        page_number = int(request.query_params.get('page', 1))
        limit = int(request.query_params.get('limit', 10))
        offset = (page_number - 1) * limit

        with connection.cursor() as cursor:
            cursor.execute(f"SELECT * FROM {Addcity._meta.db_table} LIMIT %s OFFSET %s", [limit, offset])
            rows = cursor.fetchall()
            serialized_data = [dict(zip([col[0] for col in cursor.description], row)) for row in rows]

            # Execute query to fetch total count of records
            cursor.execute(f"SELECT COUNT(*) FROM {Addcity._meta.db_table}")
            total_count = cursor.fetchone()[0]
            
            return JsonResponse({'total_count': total_count,'trackers': serialized_data}, status=status.HTTP_200_OK)
       

class UpdateTrackerInfo(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, IsStaff, IsAdmin]
    serializer_class = CityWiseTrackerSerializer

    def get_queryset(self):
        return CityWiseTracker.objects.filter(pk=self.request.data["uid"])

class CityInfo(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    # serializer_class = CityWiseTrackerSerializer
    http_method_names = ['get']
    
    
    def get(self, request):
        trackers = CityWiseTracker.objects.all()
        trackers = list(trackers.values())

        cities = ["Karachi","Lasbella","Wadh","Khuzdar","Quetta","ChamanYard","Hyderabad","Moro","Sukkur","Kashmore","Ramak","Khyber","Mardab","Torkham","Ghulam khan","Salang","Hairtan","Torkham","Jalal abad","Kabul","Salang","Hairtan","Chaman","Spin Boldak","Kandahar","Ghazni","Salang","Hairtan"]
        return Response({'cities': cities}, status=status.HTTP_200_OK) 
