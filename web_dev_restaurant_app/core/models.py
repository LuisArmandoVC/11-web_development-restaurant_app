from email.policy import default
from tabnanny import verbose
from django.db import models


class dishes(models.Model):
    dish_id = models.BigAutoField(primary_key=True)
    dish_name = models.CharField(max_length=25, verbose_name='Nombre del plato')
    OPTIONS = [
        ('', 'Selecciona una opcion'),
        ('especiales', 'Platos especiales'),
        ('corrientazos', 'Platos corrientazos'),
        ('postres', 'Postres'),
        ('bebidas', 'Bebidas')
    ]
    dish_category = models.CharField(
        verbose_name='Categoria del plato',
        max_length=50,
        choices=OPTIONS,
        default=''
    )
    dish_description = models.TextField(verbose_name='Descripcion del plato')
    dish_regular_price = models.IntegerField(verbose_name='Precio regular del plato')
    dish_discounted_price = models.IntegerField(verbose_name='Precio oferta del plato')
    dish_special = models.BooleanField(verbose_name='Es un plato especial?')
    dish_image_preview = models.ImageField(upload_to='dishes_preview', verbose_name='Imagen vista superior')
    dish_image_complete = models.ImageField(upload_to='dishes_complete', verbose_name='Imagen vista frontal')
    dish_side_1 = models.CharField(max_length=25, verbose_name='Acompañante 1')
    dish_side_2 = models.CharField(max_length=25, verbose_name='Acompañante 2')
    dish_side_3 = models.CharField(max_length=25, verbose_name='Acompañante 3', null=True, blank=True)
    dish_side_4 = models.CharField(max_length=25, verbose_name='Acompañante 4', null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Fecha de última actualización")
    class Meta:
        verbose_name = 'Plato'
        verbose_name_plural = 'Platos del menu'
        ordering = ["-created_at"]
    def __str__(self):
        return self.dish_name

def discount(self):
    if self.dish_discounted_price < self.dish_regular_price:
        discount_amount = self.dish_regular_price - self.dish_discounted_price
        discount_percentaje = discount_amount / self.dish_regular_price
        discount_final = discount_percentaje * 100
        return discount_final
    else:
        return 0
dishes.add_to_class('discount', property(discount))

class hero_banner(models.Model):
    hero_banner_image = models.ImageField(upload_to='hero_banner', verbose_name="Imagen principal del carrusel del home")
    hero_banner_image_alt = models.CharField(max_length=255, verbose_name='Descripcion ALT de la imagen')
    hero_banner_title = models.CharField(max_length=25, verbose_name='Titulo del banner principal')
    hero_banner_description = models.CharField(max_length=100, verbose_name="Descripción del banner principal", null=True, blank=True)
    hero_banner_cta = models.CharField(max_length=255, verbose_name='Link del CTA del banner principal')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Fecha de última actualización")
    class Meta:
        verbose_name = 'Elemento del swiper del hero banner'
        verbose_name_plural = 'Contenido del main banner swiper'
        ordering = ["-created_at"]
    def __str__(self):
        return self.hero_banner_title

class sections(models.Model):
    OPTIONS = [
        ('', 'Selecciona una opcion'),
        ('platos_destacados', 'Platos destacados'),
        ('nuestros_servicios', 'Nuestros servicios'),
        ('clientes_felices', 'Clientes felices')
    ]
    section_name = models.CharField(
        max_length=50,
        choices=OPTIONS,
        default=''
    )
    small_title = models.CharField(max_length=15, verbose_name="Titulo pequeño", null=True, blank=True)
    title = models.CharField(max_length=50, verbose_name="Titulo principal")
    description = models.CharField(max_length=200, verbose_name="Descripción", null=True, blank=True)
    custom_cta_1 = models.CharField(max_length=15, verbose_name="[OPCIONAL] call to action 1", null=True, blank=True)
    custom_cta_2 = models.CharField(max_length=15, verbose_name="[OPCIONAL] call to action 2", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Fecha de última actualización")
    class Meta:
        verbose_name = 'Contenido de bloques'
        verbose_name_plural = 'Contenidos de bloques'
        ordering = ["-created_at"]
    def __str__(self):
        return self.title

class user_review(models.Model):
    user_name = models.CharField(max_length=100, verbose_name="Nombre del usuario")
    user_image = models.ImageField(upload_to='client_reviews', null=True, blank=True, verbose_name="Imagen del usuario")
    comment = models.CharField(max_length=400, verbose_name="Comentarios del usuario")
    review = models.IntegerField(
        choices=[(1, 'Uno'), (2, 'Dos'), (3, 'Tres'),
                 (4, 'Cuatro'), (5, 'Cinco')], verbose_name="Puntuación"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Fecha de última actualización")
    class Meta:
        verbose_name = 'Comentario de clientes'
        verbose_name_plural = 'Comentarios de clientes'
        ordering = ["-created_at"]
    def __str__(self):
        return f"Comentario de {self.user_name} con rating { self.review }"
