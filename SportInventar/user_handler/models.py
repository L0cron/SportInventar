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
