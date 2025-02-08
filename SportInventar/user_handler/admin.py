from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, FileLog

@admin.register(User)
class UserAdminView(admin.ModelAdmin):
    list_display = ('username', 'first_name','last_name', 'is_staff','avatar','status')


@admin.register(FileLog)
class FileLogAdminView(admin.ModelAdmin):
    list_display = ('file_path','download_link','created_at')
