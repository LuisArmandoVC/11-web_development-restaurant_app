# Generated by Django 4.2.7 on 2024-03-06 05:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0004_category_slug'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='description',
            field=models.TextField(blank=True, max_length=250, null=True, verbose_name='Descripcion corta'),
        ),
    ]
