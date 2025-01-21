from django.db import models

class Procurement(models.Model):
    url = models.CharField(verbose_name="Ссылка",max_length=255,null=True,blank=True)
    name = models.CharField(verbose_name="Название", max_length=255,null=True,blank=True)
    price = models.CharField(verbose_name="Цена", max_length=255,null=True,blank=True)
    amount = models.IntegerField(verbose_name="Количество",null=True,blank=True)
    supplier = models.CharField(verbose_name="Поставщик", max_length=255,null=True,blank=True)
    photoPath = models.CharField(verbose_name="Путь к иконке",max_length=255,null=True,blank=True)

class Displayer(models.Model):
    url = models.CharField(verbose_name="Ссылка",max_length=255,null=True,blank=True)
    name = models.CharField(verbose_name="Название", max_length=255,null=True,blank=True)
    price = models.CharField(verbose_name="Цена", max_length=255,null=True,blank=True)
    amount = models.IntegerField(verbose_name="Количество",null=True,blank=True)
    supplier = models.CharField(verbose_name="Поставщик", max_length=255,null=True,blank=True)
    photoPath = models.CharField(verbose_name="Путь к иконке",max_length=255,null=True,blank=True)   