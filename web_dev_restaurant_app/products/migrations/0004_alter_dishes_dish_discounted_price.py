# Generated by Django 4.2.7 on 2024-03-20 01:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0003_alter_dishes_dish_description_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dishes',
            name='dish_discounted_price',
            field=models.IntegerField(default=0, help_text='Agregue valor solamente si el plato se encuentra en oferta.', verbose_name='Precio oferta del plato'),
        ),
    ]
