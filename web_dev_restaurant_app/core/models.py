from django.db import models

class hero_banner(models.Model):
    hero_banner_image = models.ImageField(upload_to='hero_banner', verbose_name="Imagen principal del carrusel del home")
    hero_banner_image_alt = models.CharField(max_length=255, verbose_name='Descripcion ALT de la imagen')
    hero_banner_title = models.CharField(max_length=100, verbose_name='Titulo del banner principal')
    hero_banner_description = models.CharField(max_length=250, verbose_name="Descripción del banner principal", null=True, blank=True)
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
