from django.contrib import admin

# Register your models here.
from .models import *

@admin.register(Request)
class RequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'author', 'text','status')