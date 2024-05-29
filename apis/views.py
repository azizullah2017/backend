from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from .models import User, ShipmentStatus, CLRModel, PortStatus, CityWiseTracker, Addcity
from .serializers import UserSerializer, ClrSerializer, ShipmentSerializer, PortSerializer, CityWiseTrackerSerializer, AddcitySerializer
from rest_framework import status
from .permissions import IsAdmin, IsStaff,IsCustomer
# , ExpiringTokenAuthentication
from rest_framework.views import APIView
from django.db import connection  # Import connection
from django.http import JsonResponse
from django.utils import timezone
from django.contrib.auth.hashers import make_password
import pandas as pd
from django.http import HttpResponse
from .models import ExpiringToken



class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    allowed_methods = ['get','post']


class UpdateUser(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    # queryset = User.objects.all()

    def perform_update(self, serializer):
        if 'password' in serializer.validated_data:
            serializer.validated_data['password'] = make_password(serializer.validated_data['password'])
        serializer.save()

    
    def get_queryset(self):
        return User.objects.filter(pk=self.kwargs.get('pk'))


class UserLoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):

        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        # Check for existing token and its expiration
        try:
            token = ExpiringToken.objects.get(user=user)
            if token.is_expired:
                token.delete()
                token = ExpiringToken.objects.create(user=user)
        except ExpiringToken.DoesNotExist:
            token = ExpiringToken.objects.create(user=user)

        # Retrieve additional user data such as username and role
        user_serializer = UserSerializer(user)
        user_data = user_serializer.data

        user_data["token"] = token.key
        return Response(user_data)

class UserLogoutView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Token.objects.all()


    def delete(self, request, *args, **kwargs):
        request.user.auth_token.delete()
        return Response({'message': 'Logout successful'}, status=status.HTTP_204_NO_CONTENT)

class GetUser(generics.ListAPIView):
    # authentication_classes = [ExpiringTokenAuthentication]
    # queryset = User.objects.filter(role='staff')
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer
    http_method_names = ['get']

    def get(self, request):
        page_number = int(request.query_params.get('page', 1))
        limit = int(request.query_params.get('limit', 10))
        offset = (page_number - 1) * limit

        if request.query_params.get('search'):
            with connection.cursor() as cursor:
                query =f"FROM {User._meta.db_table} \
                WHERE username LIKE '%{request.query_params.get('search')}%' \
                OR email LIKE '%{request.query_params.get('search')}%'\
                OR role LIKE '%{request.query_params.get('search')}%'\
                OR company_name LIKE '%{request.query_params.get('search')}%'\
                OR mobile_no LIKE '%{request.query_params.get('search')}%'"

                cursor.execute("SELECT uid, username, email, role, mobile_no, company_name "+query+f" LIMIT {limit} OFFSET {offset}")
                rows = cursor.fetchall()
                serialized_data = [dict(zip([col[0] for col in cursor.description], row)) for row in rows]

                cursor.execute(f"SELECT COUNT(*) "+query)
                total_count = cursor.fetchone()[0]

                return JsonResponse({'total_count': total_count,'users': serialized_data}, status=status.HTTP_200_OK)
        

        with connection.cursor() as cursor:
            query = f"FROM {User._meta.db_table}"

            cursor.execute("SELECT uid, username, email, role, mobile_no, company_name "+query+f" LIMIT {limit} OFFSET {offset}")
            rows = cursor.fetchall()
            serialized_data = [dict(zip([col[0] for col in cursor.description], row)) for row in rows]
            cursor.execute(f"SELECT COUNT(*) "+query)
            total_count = cursor.fetchone()[0]

            return JsonResponse({'total_count': total_count,'users': serialized_data}, status=status.HTTP_200_OK)
        

class ClrInfo(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ClrSerializer
    allowed_methods = ['get','post']
    
    def get(self, request):
        page_number = int(request.query_params.get('page', 1))
        limit = int(request.query_params.get('limit', 10))
        # Calculate the offset based on the page number and limit
        offset = (page_number - 1) * limit

        if request.query_params.get('search'):
            with connection.cursor() as cursor:
                query =f" FROM {CLRModel._meta.db_table} \
                WHERE (shipper LIKE '%{request.query_params.get('search')}%' \
                OR shipper_reference LIKE '%{request.query_params.get('search')}%' \
                OR consignee LIKE '%{request.query_params.get('search')}%' \
                OR book_no LIKE '%{request.query_params.get('search')}%')"
                if request.query_params.get('company_name') and request.query_params.get('company_name') != "Lachin":
                    query += f" AND consignee='{request.query_params.get('company_name')}'" 
                
                cursor.execute("SELECT * "+query+f" LIMIT {limit} OFFSET {offset}")
                rows = cursor.fetchall()
                serialized_data = [dict(zip([col[0] for col in cursor.description], row)) for row in rows]

                # Execute query to fetch total count of records
                cursor.execute(f"SELECT COUNT(*) "+query)
                total_count = cursor.fetchone()[0]

                return JsonResponse({'total_count': total_count,'clrs': serialized_data}, status=status.HTTP_200_OK)
        

        # Execute the raw SQL query to fetch the first N records with pagination
        with connection.cursor() as cursor:
            query = f"FROM {CLRModel._meta.db_table}"
            if request.query_params.get('company_name') and request.query_params.get('company_name') != "Lachin":
                query += f" WHERE consignee='{request.query_params.get('company_name')}'"
            
            print("query: ",query)
            cursor.execute("SELECT * "+query+f" LIMIT {limit} OFFSET {offset}")
            rows = cursor.fetchall()
            serialized_data = [dict(zip([col[0] for col in cursor.description], row)) for row in rows]
            # Execute query to fetch total count of records
            cursor.execute(f"SELECT COUNT(*) "+query)
            total_count = cursor.fetchone()[0]

            return JsonResponse({'total_count': total_count,'clrs': serialized_data}, status=status.HTTP_200_OK)
        
class UpdateCLRAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ClrSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # print(self.kwargs.get('pk'))
        return CLRModel.objects.filter(pk=self.kwargs.get('pk'))

    
class ShipmentInfo(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    # queryset = ShipmentStatus.objects.all()
    serializer_class = ShipmentSerializer
    http_method_names = ['get','post']

    def create(self, request, *args, **kwargs):
        data = self._convert_empty_strings_to_none(request.data)
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def _convert_empty_strings_to_none(self, data):
        return {key: (None if value == '' else value) for key, value in data.items()}

    def get(self, request):
        page_number = int(request.query_params.get('page', 1))
        limit = int(request.query_params.get('limit', 10))
        # Calculate the offset based on the page number and limit
        offset = (page_number - 1) * limit

        if request.query_params.get('query') == "booking_list":
            with connection.cursor() as cursor:
                cursor.execute(f"SELECT book_no FROM {CLRModel._meta.db_table} WHERE status = 'done'  AND book_no NOT IN (SELECT book_no FROM {ShipmentStatus._meta.db_table})")
                rows = cursor.fetchall()
                flat_list = [item for sublist in rows for item in sublist]
                return JsonResponse({'booking_list': flat_list}, status=status.HTTP_200_OK)
        
        elif request.query_params.get('query') == "bls_list":
            with connection.cursor() as cursor:
                cursor.execute(f"SELECT bls FROM {CLRModel._meta.db_table} WHERE status = 'done'  AND bls NOT IN (SELECT bls FROM {ShipmentStatus._meta.db_table})")
                rows = cursor.fetchall()
                flat_list = [item for sublist in rows for item in sublist]
                return JsonResponse({'bls_list': flat_list}, status=status.HTTP_200_OK)

        elif request.query_params.get('search'):
            with connection.cursor() as cursor:
                query =f" FROM {ShipmentStatus._meta.db_table} \
                WHERE bl LIKE '%{request.query_params.get('search')}%' \
                OR book_no LIKE '%{request.query_params.get('search')}%'"
                cursor.execute("SELECT * "+query+f" LIMIT {limit} OFFSET {offset}")
                rows = cursor.fetchall()
                serialized_data = [dict(zip([col[0] for col in cursor.description], row)) for row in rows]

                # Execute query to fetch total count of records
                cursor.execute(f"SELECT COUNT(*) "+query)
                total_count = cursor.fetchone()[0]

                return JsonResponse({'total_count': total_count,'shipments': serialized_data}, status=status.HTTP_200_OK)

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
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ShipmentSerializer

    def get_queryset(self):
        return ShipmentStatus.objects.filter(pk=self.kwargs.get('pk'))


class PortInfo(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PortSerializer
    queryset = PortStatus.objects.all()
    http_method_names = ['get','post']

    def get(self, request):
        page_number = int(request.query_params.get('page', 1))
        limit = int(request.query_params.get('limit', 10))
        offset = (page_number - 1) * limit

        if request.query_params.get('query') == "bl":
            with connection.cursor() as cursor:
                cursor.execute(f"SELECT bl FROM {ShipmentStatus._meta.db_table} as ship WHERE status = 'done'  AND bl NOT IN (SELECT bl FROM {PortStatus._meta.db_table} WHERE status='done' AND ship.containers = bl_containers);")
                rows = cursor.fetchall()
                flat_list = [item for sublist in rows for item in sublist]
                return JsonResponse({'bl_list': flat_list}, status=status.HTTP_200_OK)
        elif request.query_params.get('bl'):
            with connection.cursor() as cursor:
                cursor.execute(f"SELECT containers FROM {ShipmentStatus._meta.db_table} WHERE bl='{request.query_params.get('bl')}';")
                rows = cursor.fetchall()
                container_shipment = [it for item in rows for it in item for it in it.split(",")]

                cursor.execute(f"SELECT  bl_containers FROM {PortStatus._meta.db_table} WHERE bl='{request.query_params.get('bl')}';")
                rows = cursor.fetchall()
                port_shipment = [it for item in rows for it in item for it in it.split(",")]

                containers = list(set(container_shipment) - set(port_shipment))

                return JsonResponse({'containers': containers}, status=status.HTTP_200_OK)

        elif request.query_params.get('search'):
            with connection.cursor() as cursor:
                query =f" FROM {PortStatus._meta.db_table} \
                WHERE bl_containers LIKE '%{request.query_params.get('search')}%' \
                OR clearing_agent LIKE '%{request.query_params.get('search')}%' \
                OR delivery_at LIKE '%{request.query_params.get('search')}%' \
                OR gd_no LIKE '%{request.query_params.get('search')}%' \
                OR transporter LIKE '%{request.query_params.get('search')}%' \
                OR truck_no LIKE '%{request.query_params.get('search')}%' \
                OR driver_name LIKE '%{request.query_params.get('search')}%' \
                OR bl LIKE '%{request.query_params.get('search')}%'"

                cursor.execute("SELECT * "+query+f" LIMIT {limit} OFFSET {offset}")
                rows = cursor.fetchall()
                serialized_data = [dict(zip([col[0] for col in cursor.description], row)) for row in rows]

                # Execute query to fetch total count of records
                cursor.execute(f"SELECT COUNT(*) "+query)
                total_count = cursor.fetchone()[0]

                return JsonResponse({'total_count': total_count,'ports': serialized_data}, status=status.HTTP_200_OK)
            
        with connection.cursor() as cursor:
            cursor.execute(f"SELECT * FROM {PortStatus._meta.db_table} LIMIT %s OFFSET %s", [limit, offset])
            rows = cursor.fetchall()
            serialized_data = [dict(zip([col[0] for col in cursor.description], row)) for row in rows]

            # Execute query to fetch total count of records
            cursor.execute(f"SELECT COUNT(*) FROM {PortStatus._meta.db_table}")
            total_count = cursor.fetchone()[0]
            
            return JsonResponse({'total_count': total_count,'ports': serialized_data}, status=status.HTTP_200_OK)


class UpdatePortInfo(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PortSerializer

    def get_queryset(self):
        return PortStatus.objects.filter(pk=self.kwargs.get('pk'))


class TrackerInfo(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CityWiseTrackerSerializer
    http_method_names = ['get','post']
    
    def get(self, request):
        page_number = int(request.query_params.get('page', 1))
        limit = int(request.query_params.get('limit', 10))
        offset = (page_number - 1) * limit

        if request.query_params.get('query') == "truck":
            with connection.cursor() as cursor:
                cursor.execute(f"SELECT DISTINCT truck_no FROM {PortStatus._meta.db_table}")
                # cursor.execute(f"SELECT truck_no FROM {PortStatus._meta.db_table} WHERE status = 'done'  AND book_no NOT IN (SELECT book_no FROM {CityWiseTracker._meta.db_table})")
                rows = cursor.fetchall()
                flat_list = [item for sublist in rows for item in sublist]
                return JsonResponse({'truck_list': flat_list}, status=status.HTTP_200_OK)
        
        elif request.query_params.get('truck'):
            with connection.cursor() as cursor:
                cursor.execute(f"SELECT * FROM {CityWiseTracker._meta.db_table} WHERE truck_no='{request.query_params.get('truck')}';")
                rows = cursor.fetchall()

                if not rows:
                    cursor.execute(f"SELECT bl, bl_containers, truck_no FROM {PortStatus._meta.db_table} WHERE truck_no='{request.query_params.get('truck')}';")
                    rows = cursor.fetchall()
                serialized_data = [dict(zip([col[0] for col in cursor.description], row)) for row in rows]
                return JsonResponse({'truck_list': serialized_data}, status=status.HTTP_200_OK)
        
        elif request.query_params.get('search'):
            with connection.cursor() as cursor:
                query =f" FROM {CityWiseTracker._meta.db_table} \
                WHERE bl_containers LIKE '%{request.query_params.get('search')}%' \
                OR bl LIKE '%{request.query_params.get('search')}%' \
                OR truck_no LIKE '%{request.query_params.get('search')}%' \
                OR curent_location LIKE '%{request.query_params.get('search')}%' \
                OR status LIKE '%{request.query_params.get('search')}%'"

                cursor.execute("SELECT * "+query+f" LIMIT {limit} OFFSET {offset}")
                rows = cursor.fetchall()
                serialized_data = [dict(zip([col[0] for col in cursor.description], row)) for row in rows]

                # Execute query to fetch total count of records
                cursor.execute(f"SELECT COUNT(*) "+query)
                total_count = cursor.fetchone()[0]

                return JsonResponse({'total_count': total_count,'trackers': serialized_data}, status=status.HTTP_200_OK)

        with connection.cursor() as cursor:
            cursor.execute(f"SELECT uid,  bl, bl_containers, truck_no, MAX(date) as date, curent_location, status FROM {CityWiseTracker._meta.db_table} GROUP BY truck_no LIMIT %s OFFSET %s", [limit, offset])
            rows = cursor.fetchall()
            serialized_data = [dict(zip([col[0] for col in cursor.description], row)) for row in rows]

            # Execute query to fetch total count of records
            cursor.execute(f"SELECT COUNT(*) FROM (SELECT uid, curent_location,MAX(date), bl, bl_containers, status FROM {CityWiseTracker._meta.db_table} GROUP BY truck_no );")
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
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CityWiseTrackerSerializer

    def get_queryset(self):
        return CityWiseTracker.objects.filter(pk=self.kwargs.get('pk'))

class CityInfo(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    # serializer_class = CityWiseTrackerSerializer
    http_method_names = ['get']
    
    
    def get(self, request):
        # trackers = CityWiseTracker.objects.all()
        # trackers = list(trackers.values())
        # print(trackers)

        route_cities = {"chaman":["Karachi","Lasbella","Wadh","Khuzdar","Quetta","Kozak","Chaman","Spin Boldak" ,"Kandahar" ,"Ghazni","Salang","Hairtan"],
                  "torkham":["Karachi","Hyderabad","Moro","Sukkur","Kashmore","Ramak","Khyber","Landikotal","Torkham","Jalal abad","Kabul" ,"Salang","Hairtan"],
                  "ghulam khan":["Karachi","Hyderabad" ,"Moro","Sukkur","Kashmore","Ramak","Khyber","Landikotal","Ghulam khan","Kabul","Salang","Hairtan"]}
        # print(request.query_params.get('truck'))
        if request.query_params.get('truck'):
            try:
                with connection.cursor() as cursor:
                    cursor.execute(f"SELECT delivery_at, bl  FROM {PortStatus._meta.db_table} WHERE truck_no='{request.query_params.get('truck')}'")
                    rows = cursor.fetchall()
                    serialized_data = [dict(zip([col[0] for col in cursor.description], row)) for row in rows][0]
                    # delivery_at = serialized_data.get('delivery_at')
                    # cursor.execute(f"SELECT book_no  FROM {ShipmentStatus._meta.db_table} WHERE bl='{serialized_data.get('bl')}'")
                    # rows = cursor.fetchall()
                    # serialized_data = [dict(zip([col[0] for col in cursor.description], row)) for row in rows][0]
                    # print(serialized_data)
                    # cursor.execute(f"SELECT final_port_of_destination  FROM {CLRModel._meta.db_table} WHERE book_no='{serialized_data.get('book_no')}'")
                    # rows = cursor.fetchall()
                    # serialized_data = [dict(zip([col[0] for col in cursor.description], row)) for row in rows][0]
                    # print(serialized_data)
                    # FPOD = serialized_data.get('final_port_of_destination')
                    # print(delivery_at.lower()+" "+FPOD.lower())
                    cities = route_cities.get(serialized_data.get('delivery_at'))
            except Exception as e:
                print(e)

        all_cities = ["Karachi","Lasbella","Wadh","Khuzdar","Quetta","ChamanYard","Hyderabad","Moro","Sukkur","Kashmore","Ramak","Khyber","Mardab","Torkham","Ghulam khan","Salang","Hairtan","Torkham","Jalal abad","Kabul","Salang","Hairtan","Chaman","Spin Boldak","Kandahar","Ghazni","Salang","Hairtan"]
        if not cities:
            cities = list(set(all_cities))
        return Response({'cities': cities }, status=status.HTTP_200_OK) 



class ClientView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get']
    
    
    def get(self, request):

        page_number = int(request.query_params.get('page', 1))
        limit = int(request.query_params.get('limit', 10))
        offset = (page_number - 1) * limit

        
        
        if request.query_params.get('search'):
            with connection.cursor() as cursor:
                query = f"FROM apis_clrmodel clr JOIN apis_shipmentstatus ship ON clr.book_no = ship.book_no JOIN \
                    apis_portstatus port ON ship.bl=port.bl JOIN apis_citywisetracker city ON \
                    port.truck_no=city.truck_no WHERE city.date in ( SELECT MAX(date) FROM apis_citywisetracker \
                    GROUP BY truck_no) AND( ship.bl LIKE '%{request.query_params.get('search')}%' \
                    OR city.truck_no LIKE '%{request.query_params.get('search')}%' \
                    OR clr.consignee LIKE '%{request.query_params.get('search')}%' \
                    OR city.bl LIKE '%{request.query_params.get('search')}%' \
                    OR city.curent_location LIKE '%{request.query_params.get('search')}%' \
                    OR clr.book_no LIKE '%{request.query_params.get('search')}%' \
                    OR clr.shipper LIKE '%{request.query_params.get('search')}%')"
                
                if request.query_params.get('company_name') and request.query_params.get('company_name') != "Lachin":
                    query += f" AND clr.consignee='{request.query_params.get('company_name')}'"

                cursor.execute("SELECT * "+query+f" LIMIT {limit} OFFSET {offset}")
                rows = cursor.fetchall()
                serialized_data = [dict(zip([col[0] for col in cursor.description], row)) for row in rows]

                cursor.execute(f"SELECT COUNT(*) "+query)
                total_count = cursor.fetchone()[0]

                return JsonResponse({'total_count': total_count,'trackers': serialized_data}, status=status.HTTP_200_OK)
        elif request.query_params.get('export'):
            with connection.cursor() as cursor:
                query = "FROM apis_clrmodel clr JOIN apis_shipmentstatus ship ON clr.book_no = ship.book_no JOIN apis_portstatus port ON ship.bl=port.bl JOIN apis_citywisetracker city ON port.truck_no=city.truck_no WHERE city.date in ( SELECT MAX(date) FROM apis_citywisetracker GROUP BY truck_no)"
                
                if request.query_params.get('company_name') and request.query_params.get('company_name') != "Lachin":
                    query += f" AND consignee='{request.query_params.get('company_name')}'"
                cursor.execute("SELECT * "+query+f" LIMIT {limit} OFFSET {offset}")
                rows = cursor.fetchall()
                columns = [col[0] for col in cursor.description]
                df = pd.DataFrame(rows, columns=columns)

                df.drop(["attachment","uid"], axis=1,inplace=True) 
                # Create an Excel writer object and write the DataFrame to an Excel file
                response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                response['Content-Disposition'] = 'attachment; filename="data.xlsx"'

                with pd.ExcelWriter(response, engine='openpyxl') as writer:
                    df.to_excel(writer, index=False, sheet_name='tracker')

                return response
        with connection.cursor() as cursor:
            query = "FROM apis_clrmodel clr JOIN apis_shipmentstatus ship ON clr.book_no = ship.book_no JOIN apis_portstatus port ON ship.bl=port.bl JOIN apis_citywisetracker city ON port.truck_no=city.truck_no WHERE city.date in ( SELECT MAX(date) FROM apis_citywisetracker GROUP BY truck_no)"
            
            if request.query_params.get('company_name') and request.query_params.get('company_name') != "Lachin":
                query += f" AND clr.consignee='{request.query_params.get('company_name')}'"
            cursor.execute("SELECT * "+query+f" LIMIT {limit} OFFSET {offset}")
            rows = cursor.fetchall()
            serialized_data = [dict(zip([col[0] for col in cursor.description], row)) for row in rows]
            # print("serialized_data: ",serialized_data)
            cursor.execute(f"SELECT COUNT(*) "+query)
            total_count = cursor.fetchone()[0]
            
            return JsonResponse({'total_count': total_count,'trackers': serialized_data}, status=status.HTTP_200_OK)

class Track(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get']
    
    
    def get(self, request):
        print(request.query_params.get('get'))
        # bl
        # shipper_reference
        # book_no
        # vessel
        # consignee
        with connection.cursor() as cursor:
            query =f" SELECT book_no, vessel, eta_karachi, etd, shipper, consignee, no_container, product, port_of_loading,\
            port_of_departure, final_port_of_destination FROM {CLRModel._meta.db_table} \
            WHERE (shipper_reference = '{request.query_params.get('search')}' \
            OR book_no = '{request.query_params.get('search')}'\
            OR vessel = '{request.query_params.get('search')}' \
            OR consignee = '{request.query_params.get('search')}')"

            if request.query_params.get('company_name') and request.query_params.get('company_name') != "Lachin":
                query += f" AND consignee='{request.query_params.get('company_name')}'"
            cursor.execute(query)
            rows = cursor.fetchall()

            if not rows:
                query =f"SELECT book_no, bl, docs, surrender, containers FROM {ShipmentStatus._meta.db_table} \
                WHERE bl = '{request.query_params.get('search')}'"
                
                cursor.execute(query)
                rows = cursor.fetchall()
                if rows:
                    new = [dict(zip([col[0] for col in cursor.description], row)) for row in rows][0]
                else:
                    return JsonResponse({'track': {}}, status=status.HTTP_404_NOT_FOUND)
                query =f" SELECT vessel, shipper, consignee, no_container, product, port_of_loading,\
                port_of_departure,eta_karachi, etd, final_port_of_destination FROM {CLRModel._meta.db_table} \
                WHERE book_no = '{new.get('book_no')}'"
                
                if request.query_params.get('company_name') and request.query_params.get('company_name') != "Lachin":
                    query += f" AND consignee='{request.query_params.get('company_name')}'"
                cursor.execute(query)
                rows = cursor.fetchall()
                data = [dict(zip([col[0] for col in cursor.description], row)) for row in rows][0]
                data.update(new)
            else:
                data = [dict(zip([col[0] for col in cursor.description], row)) for row in rows][0]
                
                query =f"SELECT bl, docs, surrender, containers FROM {ShipmentStatus._meta.db_table} \
                WHERE book_no = '{data.get('book_no')}'"
                cursor.execute(query)
                rows = cursor.fetchall()
                data.update([dict(zip([col[0] for col in cursor.description], row)) for row in rows][0])

            cursor.execute(f"SELECT bl_containers, truck_no FROM {PortStatus._meta.db_table} WHERE bl='{data.get('bl')}';")
            rows = cursor.fetchall()
            data["containers"] = list()
            for bl_containers, truck_no in rows:
                tmp = {}
                tmp['bl_containers'] = bl_containers
                tmp["truck_no"] = truck_no
                
                cursor.execute(f"SELECT curent_location as location, date, truck_no, comment FROM {CityWiseTracker._meta.db_table} WHERE truck_no='{truck_no}';")
                rows = cursor.fetchall()
                tmp["location"] = [dict(zip([col[0] for col in cursor.description], row)) for row in rows]
                data["containers"].append(tmp)

            return JsonResponse({'track': data}, status=status.HTTP_200_OK)


class ChartView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get']

    def get(self, request):

        if request.query_params.get('get') == "month": 
            with connection.cursor() as cursor:
                query = f"SELECT strftime('%Y-%m', etd) AS month, COUNT(apis_clrmodel.etd) AS count FROM {CLRModel._meta.db_table} GROUP BY strftime('%m', etd);"
                if request.query_params.get('company_name') and request.query_params.get('company_name') != "Lachin":
                    query += f" WHERE clr.consignee='{request.query_params.get('company_name')}'"
                cursor.execute(query)
                rows = cursor.fetchall()
                serialized_data = [dict(zip([col[0] for col in cursor.description], row)) for row in rows]

                return JsonResponse({'monthly': serialized_data}, status=status.HTTP_200_OK)
        
        elif request.query_params.get('get') == "eachstatus":
            with connection.cursor() as cursor:

                li = [CLRModel._meta.db_table, ShipmentStatus._meta.db_table, PortStatus._meta.db_table, CityWiseTracker._meta.db_table]
                reponse = {}
                for tb in li:
                    query = f"SELECT COUNT(*) AS done_count FROM {tb} WHERE status = 'pending';"
                    cursor.execute(query)
                    pending = cursor.fetchall()

                    query = f"SELECT COUNT(*) AS done_count FROM {tb} WHERE status = 'inprogress';"
                    cursor.execute(query)
                    inprogress = cursor.fetchall()

                    query = f"SELECT COUNT(*) AS done_count FROM {tb} WHERE status = 'done';"
                    cursor.execute(query)
                    done = cursor.fetchall()
                    reponse[tb.split("_")[1]] = [pending[0][0],inprogress[0][0], done[0][0]]

                return JsonResponse(reponse, status=status.HTTP_200_OK)
