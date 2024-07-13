# Generated by Django 5.0.1 on 2024-02-15 16:56

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('graduate_app', '0019_remove_post_sender'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='sender',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='post_sender', to='graduate_app.profile'),
            preserve_default=False,
        ),
    ]
