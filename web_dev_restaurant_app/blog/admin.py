from django.contrib import admin
from .models import Post, Category

class BlogAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("title",)}
    list_display = ('title', 'published', 'post_categories')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('title',)
    search_fields = ('title', 'content', 'published', 'categories__category_name')
    date_hierarchy = 'published'
    list_filter = ('categories__category_name',)

    def post_categories(self, obj):
        return ", ".join([c.category_name for c in obj.categories.all()])
    post_categories.short_description = "Categorias del post"

class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("category_name",)}
    readonly_fields = ('created_at', 'updated_at')

admin.site.register(Post, BlogAdmin)
admin.site.register(Category, CategoryAdmin)
