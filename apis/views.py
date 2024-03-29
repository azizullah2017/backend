from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from .models import User, ShipmentStatus, CLRModel, PortStatus, CityWiseTracker, ExpiringToken
from .serializers import UserSerializer, ClrSerializer, ShipmentSerializer, PortSerializer, CityWiseTrackerSerializer
from rest_framework import status
from .permissions import IsAdmin, IsStaff,IsCustomer, ExpiringTokenAuthentication
from rest_framework.views import APIView
from django.db import connection  # Import connection
from django.http import JsonResponse
from django.utils import timezone


class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)

class UserLoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        if not created:
            token.created = timezone.now()
            token.save()

        # Set token expiration to 10 minutes
        expiration_time = token.created + timezone.timedelta(minutes=5)
        # token = ExpiringToken.objects.create(expiration=expiration_time)
        token.expiration = expiration_time
        token.save()

        return Response({'token': token.key})

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


class CreateClrInfo(generics.CreateAPIView):

    # class MyModelListCreateAPIView(generics.ListCreateAPIView):
    # queryset = MyModel.objects.all()
    # serializer_class = MyModelSerializer

    # def post(self, request, *args, **kwargs):
    #     serializer = self.get_serializer(data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # class MyModelListCreateAPIView(generics.ListCreateAPIView):

    # post
    permission_classes = [permissions.IsAuthenticated, IsStaff]
    queryset = CLRModel.objects.all()
    serializer_class = ClrSerializer
    http_method_names = ['post']

class ClrInfo(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ClrSerializer
    http_method_names = ['get'] 
    
    def get(self, request):
        clrs = CLRModel.objects.all()
        clrs_list = list(clrs.values())  # Convert queryset to list of dictionaries
        return JsonResponse({'clrs': clrs_list})

class UpdateCLRAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, IsStaff]
    queryset = CLRModel.objects.all()
    serializer_class = ClrSerializer
    http_method_names = ['post']

    # def get(self, request):
    #     return Response({'data': "ClrInfo"}, status=status.HTTP_200_OK)
    
class CreateShipmentInfo(generics.CreateAPIView):
    permission_classes = [IsStaff]
    queryset = ShipmentStatus.objects.all()
    serializer_class = ShipmentSerializer
    http_method_names = ['post']


class ShipmentInfo(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ShipmentSerializer
    http_method_names = ['get']


    def get(self, request):
        shipments = ShipmentStatus.objects.all()
        shipments = list(shipments.values())
        return Response({'shipments': shipments}, status=status.HTTP_200_OK)

class CreatePortInfo(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsStaff]
    queryset = PortStatus.objects.all()
    serializer_class = PortSerializer
    http_method_names = ['post']

    
class PortInfo(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PortSerializer
    http_method_names = ['get']


    def get(self, request):
        ports = PortStatus.objects.all()
        ports = list(ports.values())
        return Response({'ports': ports}, status=status.HTTP_200_OK)

class CreateTrackerInfo(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsStaff]
    queryset = CityWiseTracker.objects.all()
    serializer_class = CityWiseTrackerSerializer
    http_method_names = ['post']

    

class TrackerInfo(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CityWiseTrackerSerializer
    http_method_names = ['get']
    
    def get(self, request):
        trackers = CityWiseTracker.objects.all()
        trackers = list(trackers.values())
        return Response({'trackers': trackers}, status=status.HTTP_200_OK) 


""""
#===========================================================================
class TeacherAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get(self, request):
        # if hasattr(request.user, 'role') and request.user.role in ['teacher', 'administrator']:
        #     # Your logic here
        #     dat = 'd3+312'
        return Response({'data': "dat"}, status=status.HTTP_200_OK)

class DataAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsStaff, IsAdmin]

    def post(self, request):
        serializer = DataSerializer(data=request.data)
        if serializer.is_valid():
            # Save the validated data to the database
            serializer.save()
            return Response({'message': 'Data inserted successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        # # Query all data from DataModel
        # data_objects = DataModel.objects.all()
        # # Serialize the queryset
        # serializer = DataSerializer(data_objects, many=True)
        # return Response(serializer.data)


        # # Retrieve data where n is equal to "uyt"
        # data_objects = DataModel.objects.filter(n="uyt")
        # # Serialize the queryset
        # serializer = DataSerializer(data_objects, many=True)
        # return Response(serializer.data)

        sql_query = "SELECT * FROM apis_datamodel WHERE name = 'aziz'"
        # Execute the SQL query
        with connection.cursor() as cursor:
            cursor.execute(sql_query)
            # Fetch all rows from the result
            rows = cursor.fetchall()

        # Serialize the rows
        data_objects = []
        for row in rows:
            data_objects.append({
                'name': row[0],
                'BL': row[1],
                'CL': row[2],
            })

        # Serialize the queryset
        serializer = DataSerializer(data_objects, many=True)
        return Response(serializer.data)
"""