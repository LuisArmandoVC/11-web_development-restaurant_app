# Generated by Django 5.0.6 on 2024-06-10 07:42

import ckeditor_uploader.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Legal',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200, verbose_name='Titulo')),
                ('slug', models.SlugField(help_text='La URL se completa de manera automatica, por favor modificalo solamente si deseas que esta pagina tenga una URL distinta a la creada', unique=True, verbose_name='URL')),
                ('content', ckeditor_uploader.fields.RichTextUploadingField(verbose_name='Contenido')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Fecha de creación')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Fecha de última actualización')),
            ],
            options={
                'verbose_name': 'Publicación',
                'verbose_name_plural': 'Publicaciones',
                'ordering': ['-created_at'],
            },
        ),
    ]
