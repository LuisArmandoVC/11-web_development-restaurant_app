from django.db import models

# Create your models here.
class Category(models.Model):
    category_name = models.CharField(max_length=100, verbose_name='Categoria')
    slug = models.SlugField(default="", unique=True, help_text="La URL se completa de manera automatica, por favor modificalo solamente si deseas que este post de tu blog tenga una URL distinta a la creada", verbose_name="URL")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Fecha de última actualización")

    class Meta:
        verbose_name = 'Categoria'
        verbose_name_plural = 'Categorias'
        ordering = ["-created_at"]
    def __str__(self):
        return self.category_name
    


class dishes(models.Model):
    dish_id = models.BigAutoField(primary_key=True)
    dish_name = models.CharField(max_length=200, verbose_name='Nombre del plato (Obligatorio)')
    dish_category = models.ForeignKey(Category, on_delete=models.CASCADE, verbose_name="Categoria del plato")
    dish_slug = models.SlugField(unique=True, default="", help_text="La URL se completa de manera automatica, por favor modificalo solamente si deseas que este plato tenga una URL distinta a la creada", verbose_name="URL")
    dish_description = models.TextField(verbose_name='Descripcion del plato (Obligatorio)')
    dish_regular_price = models.IntegerField(verbose_name='Precio regular del plato (Obligatorio)')
    dish_discounted_price = models.IntegerField(default=0, verbose_name='Precio oferta del plato', help_text="Agregue valor solamente si el plato se encuentra en oferta.")
    dish_special = models.BooleanField(verbose_name='Es un plato especial?', help_text="Marque la casilla si desea que este plato aparezca en el carrusel de inicio del sitio web")
    dish_image_preview = models.ImageField(upload_to='dishes_preview', verbose_name='Imagen vista superior (Obligatorio)')
    dish_side_1 = models.CharField(max_length=25, verbose_name='Acompañante 1 (Obligatorio)')
    dish_side_2 = models.CharField(max_length=25, verbose_name='Acompañante 2 (Obligatorio)')
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


class discount_coupon(models.Model):
    discount_coupon_code = models.CharField(max_length=15, help_text="En este campo tienes que agregar el codigo que quieres que represente un cupon de descuento", verbose_name='Codigo de descuento (Obligatorio)')
    discount_coupon_enablement = models.BooleanField(verbose_name='El cupon de descuento esta activo?', help_text="Marque la casilla si desea habilitar este codigo de descuento")
    discout_value = models.IntegerField(default=0, verbose_name='Valor de descuento del cupon', help_text="Agregue el valor que desea descontar, tenga en cuenta que si elije la opcion de envio gratis como unidad, se aplicara descuento al 100 por ciento del valor del envio")
    discout_maximum = models.IntegerField(default=0, verbose_name='Maximo valor posible a descontar', help_text="Ajuste este como valor maximo que podra descontar del cupon, no valido para envio gratuito")
    OPTIONS = [
        ('', 'Selecciona una opcion'),
        ('pesos_colombianos', 'Pesos'),
        ('porcentaje', 'Porcentaje'),
        ('envio_gratuito', 'Envio gratis')
    ]
    discount_unit = models.CharField(
        max_length=50,        
        choices=OPTIONS,
        default=''
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Fecha de última actualización")
    class Meta:
        verbose_name = 'Cupon de descuento'
        verbose_name_plural = 'Cupones de descuento'
        ordering = ["-created_at"]
    def __str__(self):
        return self.discount_coupon_code