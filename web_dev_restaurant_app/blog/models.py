from django.db import models
from django.utils.timezone import now
from ckeditor_uploader.fields  import RichTextUploadingField

class Category(models.Model):
    category_name = models.CharField(max_length=100, verbose_name='Categoria')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Fecha de última actualización")

    class Meta:
        verbose_name = 'Categoria'
        verbose_name_plural = 'Categorias'
        ordering = ["-created_at"]
    def __str__(self):
        return self.category_name
    
class Post(models.Model):
    title = models.CharField(max_length=200, verbose_name='Titulo')
    slug = models.SlugField(unique=True, help_text="La URL se completa de manera automatica, por favor modificalo solamente si deseas que este post de tu blog tenga una URL distinta a la creada", verbose_name="URL")
    content = RichTextUploadingField(verbose_name='Contenido')
    published = models.DateTimeField(verbose_name='Fecha de publicacion', default=now)
    image = models.ImageField(upload_to='blog', verbose_name='Imagen preview de la publicacion')
    categories = models.ManyToManyField(Category, verbose_name="Categorias")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Fecha de última actualización")

    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name = 'Publicación'
        verbose_name_plural = 'Publicaciones'
        ordering = ["-created_at"]