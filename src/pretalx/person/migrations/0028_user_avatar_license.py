# Generated by Django 4.2.10 on 2024-03-05 12:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("person", "0027_created_updated_everywhere"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="avatar_license",
            field=models.CharField(max_length=32, null=True),
        ),
    ]