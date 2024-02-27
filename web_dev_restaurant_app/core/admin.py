from django.contrib import admin
from .models import sections, user_review, hero_banner, dishes


class SectionAdmin(admin.ModelAdmin):
    readonly_fields = ('created_at', 'updated_at')


class ReviewAdmin(admin.ModelAdmin):
    readonly_fields = ('created_at', 'updated_at')


class HeroBanner(admin.ModelAdmin):
    readonly_fields = ('created_at', 'updated_at')

class DishesAdmin(admin.ModelAdmin):
    exclude = ('dish_id',)
    readonly_fields = ('created_at', 'updated_at')

admin.site.register(hero_banner, HeroBanner)
admin.site.register(sections, SectionAdmin)
admin.site.register(user_review, ReviewAdmin)
admin.site.register(dishes, DishesAdmin)

