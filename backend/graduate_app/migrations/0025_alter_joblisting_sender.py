# Generated by Django 5.0.1 on 2024-03-04 15:25

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('graduate_app', '0024_rename_posted_by_joblisting_user_joblisting_sender'),
    ]

    operations = [
        migrations.AlterField(
            model_name='joblisting',
            name='sender',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='job_sender', to='graduate_app.profile'),
        ),
    ]
