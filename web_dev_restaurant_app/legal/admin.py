from django.contrib import admin
from .models import Legal

# Register your models here.
class LegalAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("title",)}
    list_display = ('title', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')

admin.site.register(Legal, LegalAdmin)