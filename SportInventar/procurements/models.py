from django.db import models
from user_handler.models import *

# Модель закупок
class Procurement(models.Model):
    url = models.CharField(verbose_name="Ссылка",max_length=255,null=True,blank=True,default='')
    name = models.CharField(verbose_name="Название", max_length=255,null=True,blank=True,default='')
    price = models.CharField(verbose_name="Цена", max_length=255,null=True,blank=True,default='')
    supplier = models.CharField(verbose_name="Поставщик", max_length=255,null=True,blank=True,default='starfitshop')
    photoPath = models.CharField(verbose_name="Путь к иконке",max_length=255,null=True,blank=True,default='')