# Generated by Django 4.2.7 on 2024-03-03 05:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0003_alter_post_content_alter_post_slug'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='slug',
            field=models.SlugField(default='', help_text='La URL se completa de manera automatica, por favor modificalo solamente si deseas que este post de tu blog tenga una URL distinta a la creada', unique=True, verbose_name='URL'),
        ),
    ]
