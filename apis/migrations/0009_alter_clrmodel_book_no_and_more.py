# Generated by Django 4.2.11 on 2024-05-14 03:45

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("apis", "0008_user_company_name_user_mobile_no"),
    ]

    operations = [
        migrations.AlterField(
            model_name="clrmodel",
            name="book_no",
            field=models.CharField(max_length=100, unique=True),
        ),
        migrations.AlterField(
            model_name="clrmodel",
            name="shipper_reference",
            field=models.CharField(max_length=100, unique=True),
        ),
        migrations.AlterField(
            model_name="shipmentstatus",
            name="bl",
            field=models.CharField(max_length=100, unique=True),
        ),
        migrations.AlterField(
            model_name="user",
            name="company_name",
            field=models.CharField(default=None, max_length=50),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="user",
            name="mobile_no",
            field=models.CharField(default=None, max_length=50),
            preserve_default=False,
        ),
    ]