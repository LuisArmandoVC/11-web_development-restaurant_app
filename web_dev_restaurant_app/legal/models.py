from django.db import models
from ckeditor_uploader.fields  import RichTextUploadingField


# Create your models here.
class Legal(models.Model):
    title = models.CharField(max_length=200, verbose_name='Titulo')
    slug = models.SlugField(unique=True, help_text="La URL se completa de manera automatica, por favor modificalo solamente si deseas que esta pagina tenga una URL distinta a la creada", verbose_name="URL")
    content = RichTextUploadingField(verbose_name='Contenido')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Fecha de última actualización")

    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name = 'Pagina legal'
        verbose_name_plural = 'Pagina legales'
        ordering = ["-created_at"]