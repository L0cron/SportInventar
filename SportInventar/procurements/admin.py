from django.contrib import admin

# Register your models here.
from .models import *

@admin.register(Procurement)
class ProcurementAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'url', 'supplier', 'photoPath')