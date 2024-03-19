# Generated by Django 4.2.7 on 2024-03-03 04:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='slug',
            field=models.SlugField(help_text='Slug is a field in autocomplete mode', unique=True, verbose_name='URL'),
        ),
    ]