from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    statuses = {
        "0":"Зарегистрирован",
        "1":"Активен",
        "2":"Деактивирован",
    }
    status = models.CharField(max_length=1, choices=statuses.items(), default="0")
