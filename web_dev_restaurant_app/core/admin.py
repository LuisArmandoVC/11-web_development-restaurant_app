from django.contrib import admin
from .models import sections, user_review


class SectionAdmin(admin.ModelAdmin):
    readonly_fields = ('created_at', 'updated_at')


class ReviewAdmin(admin.ModelAdmin):
    readonly_fields = ('created_at', 'updated_at')


admin.site.register(sections, SectionAdmin)
admin.site.register(user_review, ReviewAdmin)
