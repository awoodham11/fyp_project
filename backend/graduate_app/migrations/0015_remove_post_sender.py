# Generated by Django 5.0.1 on 2024-02-15 16:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('graduate_app', '0014_place_comment_report'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='sender',
        ),
    ]
