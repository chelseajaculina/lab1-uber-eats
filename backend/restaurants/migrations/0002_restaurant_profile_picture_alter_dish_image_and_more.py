# Generated by Django 5.1.1 on 2024-10-22 22:36

import restaurants.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restaurants', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='restaurant',
            name='profile_picture',
            field=models.ImageField(blank=True, null=True, upload_to=restaurants.models.upload_path),
        ),
        migrations.AlterField(
            model_name='dish',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to=restaurants.models.upload_path),
        ),
        migrations.AlterField(
            model_name='restaurant',
            name='images',
            field=models.ImageField(blank=True, null=True, upload_to=restaurants.models.upload_path),
        ),
    ]