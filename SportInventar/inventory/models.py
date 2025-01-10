from django.db import models

# Create your models here.
from user_handler.models import *

inventory_status = (
        (0, 'Новый'),
        (1, 'Используемый'),
        (2, 'Сломанный'),
    )


class Item(models.Model):
    name = models.CharField(verbose_name='название инвентаря', max_length=255)
    status = models.IntegerField(verbose_name='статус', choices=inventory_status)
    current_holder = models.CharField(verbose_name='текущий владелец', max_length=255) # models.ForeignKey(User, verbose_name='текущий владелец',on_delete=models.CASCADE,null=True)