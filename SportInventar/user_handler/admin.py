from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class UserAdminView(admin.ModelAdmin):
    list_display = ('username', 'first_name','last_name', 'is_staff','avatar','status')
