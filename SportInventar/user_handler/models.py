from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    statuses = {
        0:"Ожидает подтверждения",
        1:"Активен",
        2:"Деактивирован",
    }
    status = models.IntegerField(choices=statuses.items(), default=1)
    avatar = models.ImageField(upload_to='avatars',blank=True,null=True)


# Таблица с файлами отчетов
class FileLog(models.Model):
    file_path = models.CharField(max_length=255)
    download_link = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)
    file_name = models.CharField(max_length=255, default='')

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
       return f"FileLog(id={self.id}, file_path={self.file_path})"
