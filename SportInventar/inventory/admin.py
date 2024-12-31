from django.contrib import admin

# Register your models here.

from .models import *

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'name','img_path','current_holder')