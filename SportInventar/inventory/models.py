from django.db import models

# Create your models here.
from user_handler.models import *

class Item(models.Model):
    name = models.CharField(verbose_name='Имя', max_length=255)
    img_path = models.TextField(verbose_name='Путь до картинки',max_length=255)
    description = models.TextField(verbose_name='Описание',max_length=1024)
    current_holder = models.ForeignKey(User, verbose_name='Текущий владелец', on_delete=models.CASCADE)
