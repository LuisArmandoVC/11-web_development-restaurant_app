from django.contrib import admin
from .models import Post, Category

class BlogAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ('created_at', 'updated_at')

admin.site.register(Post, BlogAdmin)
admin.site.register(Category)
