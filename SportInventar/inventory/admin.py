from django.contrib import admin

# Register your models here.

from .models import *

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'status')


@admin.register(History)
class HistoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'item', 'timestamp', 'current_holder')
