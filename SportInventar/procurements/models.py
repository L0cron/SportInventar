from django.db import models

class Procurement(models.Model):
    
    url = models.CharField(verbose_name="Ссылка",max_length=255)
    name = models.CharField(verbose_name="Название")
    amount = models.IntegerField(verbose_name="Количество")
