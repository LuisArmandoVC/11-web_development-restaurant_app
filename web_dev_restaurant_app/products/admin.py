from django.contrib import admin
from .models import dishes, Category, discount_coupon

# Register your models here.

class DishesAdmin(admin.ModelAdmin):
    exclude = ('dish_id',)
    prepopulated_fields = {"dish_slug": ("dish_name",)}
    list_display = ('dish_name', 'dish_special', 'dish_category', 'dish_regular_price', 'dish_discounted_price')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('dish_name',)
    search_fields = ('dish_name', 'dish_description', 'updated_at', 'dish_category__category_name')
    date_hierarchy = 'updated_at'
    list_filter = ('dish_category__category_name',)

    def dish_category(self, obj):
        return ", ".join([c.category_name for c in obj.categories.all()])
    dish_category.short_description = "Categorias del post"

class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("category_name",)}
    readonly_fields = ('created_at', 'updated_at')

class DiscountCuponAdmin(admin.ModelAdmin):
    list_display = ('discount_coupon_code', 'discount_coupon_enablement', 'discout_value', 'discount_unit', 'created_at')
    readonly_fields = ('created_at', 'updated_at')


admin.site.register(dishes, DishesAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(discount_coupon, DiscountCuponAdmin)


