from django.db import models

class Procurement(models.Model):
    url = models.CharField(verbose_name="Ссылка",max_length=255)
    name = models.CharField(verbose_name="Название", max_length=255)
    amount = models.IntegerField(verbose_name="Количество")
    #supplier = models.CharField(verbose_name="Поставщик", max_length=255)
    #photoPath = models.CharField(verbose_name="Путь к иконке",max_length=255)