from django.db import models

# Create your models here.
from user_handler.models import *

inventory_status = (
        (0, 'сломано'),
        (1, 'в норме'),
        (2, 'новое'),
    )


class Item(models.Model):
    name = models.CharField(verbose_name='название инвентаря', max_length=255)
    status = models.IntegerField(verbose_name='статус', choices=inventory_status)
    current_holder = models.ForeignKey(User, verbose_name='текущий владелей',on_delete=models.CASCADE,null=True)