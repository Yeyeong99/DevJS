# Generated by Django 4.2.20 on 2025-03-27 23:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('jds', '0001_initial'),
        ('feedback', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='feedback',
            name='job_description',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='jds.jobdescription'),
        ),
    ]
