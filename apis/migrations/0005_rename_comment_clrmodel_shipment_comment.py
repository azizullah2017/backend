# Generated by Django 4.2.11 on 2024-05-21 12:12

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("apis", "0004_clrmodel_bls_clrmodel_comment"),
    ]

    operations = [
        migrations.RenameField(
            model_name="clrmodel",
            old_name="comment",
            new_name="shipment_comment",
        ),
    ]