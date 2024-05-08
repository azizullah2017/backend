# Generated by Django 4.2.11 on 2024-03-29 11:01

import django.contrib.auth.models
from django.db import migrations, models
import django.utils.timezone
import uuid


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
    ]

    operations = [
        migrations.CreateModel(
            name="CityWiseTracker",
            fields=[
                (
                    "uid",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                        verbose_name="identifier",
                    ),
                ),
                ("bl_containers", models.CharField(max_length=300)),
                ("bl", models.CharField(max_length=100)),
                ("curent_location", models.CharField(max_length=100)),
                ("date", models.DateField()),
                ("status", models.CharField(blank=True, max_length=100, null=True)),
            ],
        ),
        migrations.CreateModel(
            name="CLRModel",
            fields=[
                (
                    "uid",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                        verbose_name="identifier",
                    ),
                ),
                ("shipper", models.CharField(max_length=100)),
                ("shipper_reference", models.CharField(max_length=100)),
                ("consignee", models.CharField(max_length=100)),
                ("book_no", models.CharField(max_length=100)),
                ("no_container", models.CharField(max_length=100)),
                ("size", models.CharField(max_length=100)),
                ("product", models.CharField(max_length=100)),
                ("port_of_loading", models.CharField(max_length=100)),
                ("port_of_departure", models.CharField(max_length=100)),
                ("final_port_of_destination", models.CharField(max_length=100)),
                ("eta", models.DateField(blank=True, null=True)),
                ("vessel", models.CharField(max_length=100)),
                ("status", models.CharField(blank=True, max_length=100, null=True)),
                ("eta_karachi", models.DateField()),
                (
                    "attachment",
                    models.FileField(
                        blank=True, null=True, upload_to="static/media/clr/"
                    ),
                ),
                ("filename", models.CharField(blank=True, max_length=255, null=True)),
            ],
        ),
        migrations.CreateModel(
            name="EmptyContainerStatus",
            fields=[
                (
                    "uid",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                        verbose_name="identifier",
                    ),
                ),
                ("bl_container", models.CharField(max_length=300)),
                ("date", models.DateField()),
                ("status", models.CharField(blank=True, max_length=100, null=True)),
            ],
        ),
        migrations.CreateModel(
            name="PortStatus",
            fields=[
                (
                    "uid",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                        verbose_name="identifier",
                    ),
                ),
                ("bl", models.CharField(max_length=100)),
                ("bl_containers", models.CharField(max_length=300)),
                ("delivery_at", models.CharField(max_length=100)),
                ("gd_no", models.CharField(max_length=100)),
                ("clearing_agent", models.CharField(max_length=100)),
                ("transporter", models.CharField(max_length=100)),
                ("truck_no", models.CharField(max_length=100)),
                ("driver_name", models.CharField(max_length=100)),
                ("driver_mobile_no", models.CharField(max_length=100)),
                ("truck_placement_date", models.DateField()),
                ("truck_out_date", models.DateField()),
                (
                    "attachment",
                    models.FileField(
                        blank=True, null=True, upload_to="static/media/port/"
                    ),
                ),
                ("filename", models.CharField(blank=True, max_length=255, null=True)),
                ("status", models.CharField(blank=True, max_length=100, null=True)),
            ],
        ),
        migrations.CreateModel(
            name="ShipmentStatus",
            fields=[
                (
                    "uid",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                        verbose_name="identifier",
                    ),
                ),
                ("book_no", models.CharField(max_length=100)),
                ("bl", models.CharField(max_length=100)),
                ("no_container", models.CharField(max_length=100)),
                ("eta_departure", models.DateField()),
                ("eta_arrival", models.DateField()),
                ("port", models.CharField(max_length=100)),
                ("docs", models.DateField()),
                ("surrender", models.DateField(blank=True, null=True)),
                ("containers", models.CharField(max_length=300)),
                ("status", models.CharField(blank=True, max_length=100, null=True)),
                (
                    "attachment",
                    models.FileField(
                        blank=True, null=True, upload_to="static/media/shipment/"
                    ),
                ),
                ("filename", models.CharField(blank=True, max_length=255, null=True)),
            ],
        ),
        migrations.CreateModel(
            name="User",
            fields=[
                ("password", models.CharField(max_length=128, verbose_name="password")),
                (
                    "last_login",
                    models.DateTimeField(
                        blank=True, null=True, verbose_name="last login"
                    ),
                ),
                (
                    "is_superuser",
                    models.BooleanField(
                        default=False,
                        help_text="Designates that this user has all permissions without explicitly assigning them.",
                        verbose_name="superuser status",
                    ),
                ),
                (
                    "first_name",
                    models.CharField(
                        blank=True, max_length=150, verbose_name="first name"
                    ),
                ),
                (
                    "last_name",
                    models.CharField(
                        blank=True, max_length=150, verbose_name="last name"
                    ),
                ),
                (
                    "is_staff",
                    models.BooleanField(
                        default=False,
                        help_text="Designates whether the user can log into this admin site.",
                        verbose_name="staff status",
                    ),
                ),
                (
                    "is_active",
                    models.BooleanField(
                        default=True,
                        help_text="Designates whether this user should be treated as active. Unselect this instead of deleting accounts.",
                        verbose_name="active",
                    ),
                ),
                (
                    "date_joined",
                    models.DateTimeField(
                        default=django.utils.timezone.now, verbose_name="date joined"
                    ),
                ),
                (
                    "uid",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                        verbose_name="identifier",
                    ),
                ),
                ("username", models.CharField(max_length=40, unique=True)),
                ("email", models.EmailField(max_length=254, unique=True)),
                (
                    "role",
                    models.CharField(
                        choices=[
                            ("admin", "Admin"),
                            ("customer", "Customer"),
                            ("staff", "Staff"),
                        ],
                        max_length=15,
                    ),
                ),
                (
                    "groups",
                    models.ManyToManyField(
                        blank=True,
                        help_text="The groups this user belongs to. A user will get all permissions granted to each of their groups.",
                        related_name="user_set",
                        related_query_name="user",
                        to="auth.group",
                        verbose_name="groups",
                    ),
                ),
                (
                    "user_permissions",
                    models.ManyToManyField(
                        blank=True,
                        help_text="Specific permissions for this user.",
                        related_name="user_set",
                        related_query_name="user",
                        to="auth.permission",
                        verbose_name="user permissions",
                    ),
                ),
            ],
            options={
                "verbose_name": "user",
                "verbose_name_plural": "users",
                "abstract": False,
            },
            managers=[
                ("objects", django.contrib.auth.models.UserManager()),
            ],
        ),
    ]