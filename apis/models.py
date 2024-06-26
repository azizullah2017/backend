from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from rest_framework.authtoken.models import Token
import uuid
from django.utils import timezone

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('customer', 'Customer'),
        ('staff', 'Staff'),
    )
    uid = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4, verbose_name='identifier')
    username = models.CharField(max_length=40, unique=True)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=15, choices=ROLE_CHOICES)
    mobile_no = models.CharField(max_length=40)
    company_name = models.CharField(max_length=50,default='Lachin')


class ExpiringToken(Token):
    expiration = models.DateTimeField(auto_now_add=True)
    
    @property
    def is_expired(self):
        now = timezone.now()
        expiration_time = self.expiration + settings.TOKEN_EXPIRATION_TIME
        return now >= expiration_time
    
# class ExpiringToken(Token):
#     expiration = models.DateTimeField()

#     class Meta:
#         verbose_name = 'Expiring Token'
#         verbose_name_plural = 'Expiring Tokens'

class CLRModel(models.Model):
    uid = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4, verbose_name='identifier')
    shipper = models.CharField(max_length=100)
    shipper_reference = models.CharField(max_length=100)
    consignee = models.CharField(max_length=100)
    book_no = models.CharField(max_length=100)
    no_container = models.CharField(max_length=100)
    size = models.CharField(max_length=100)
    product = models.CharField(max_length=100)
    port_of_loading = models.CharField(max_length=100)
    port_of_departure = models.CharField(max_length=100)
    final_port_of_destination = models.CharField(max_length=100)
    etd  =  models.DateField(blank=True, null=True)
    vessel  = models.CharField(max_length=100)
    status  = models.CharField(max_length=100)
    eta_karachi  = models.DateField()
    shipment_comment = models.TextField(blank=True,null=True)
    bls = models.TextField(blank=True,null=True)
    attachment = models.TextField(blank=True,null=True)

    def __str__(self):
        return self.uid


class ShipmentStatus(models.Model):
    uid = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4, verbose_name='identifier')
    book_no = models.CharField(max_length=100)
    bl = models.CharField(max_length=100,unique=True)
    no_container = models.CharField(max_length=100)
    eta_departure = models.DateField(blank=True,null=True)
    eta_arrival = models.DateField(blank=True,null=True)
    port = models.CharField(max_length=100)
    docs = models.DateField(blank=True,null=True)
    surrender  = models.DateField(blank=True, null=True)
    containers  = models.CharField(max_length=300)
    status  = models.CharField(max_length=100)
    attachment = models.TextField(blank=True,null=True)

    def __str__(self):
        return self.uid


class PortStatus(models.Model):
    uid = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4, verbose_name='identifier')
    bl = models.CharField(max_length=100)
    bl_containers  = models.CharField(max_length=300)
    delivery_at = models.CharField(max_length=100)
    gd_no =  models.CharField(max_length=100)
    clearing_agent = models.CharField(max_length=100)
    transporter = models.CharField(max_length=100)
    truck_no = models.CharField(max_length=100)
    driver_name = models.CharField(max_length=100)
    driver_mobile_no = models.CharField(max_length=100)
    truck_placement_date = models.DateField()
    truck_out_date = models.DateField()
    attachment = models.TextField(blank=True,null=True)
    status  = models.CharField(max_length=100)
    

    def __str__(self):
        return self.uid


class CityWiseTracker(models.Model):
    uid = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4, verbose_name='identifier')
    bl = models.CharField(max_length=100)
    bl_containers  = models.CharField(max_length=300)
    truck_no = models.CharField(max_length=100,blank=True, null=True)
    curent_location = models.CharField(max_length=100)
    date = models.DateField()
    comment = models.TextField(blank=True, null=True)
    status  = models.CharField(max_length=100)

    def __str__(self):
        return self.uid

class Addcity(models.Model):
    uid = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4, verbose_name='identifier')
    bl  = models.CharField(max_length=300)
    truck = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    date = models.DateField()

    def __str__(self):
        return self.uid


class EmptyContainerStatus(models.Model):
    uid = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4, verbose_name='identifier')
    bl_container  = models.CharField(max_length=300)
    date = models.DateField()
    status  = models.CharField(max_length=100)

    def __str__(self):
        return self.uid



# class DataModel(models.Model):
#     name = models.CharField(max_length=100)
#     BL = models.CharField(max_length=100)
#     CL = models.CharField(max_length=100)