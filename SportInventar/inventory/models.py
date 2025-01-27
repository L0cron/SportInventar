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
    current_holder = models.ForeignKey(User, verbose_name='текущий владелец',on_delete=models.CASCADE,null=True, blank=True)
    photo_path = models.ImageField(verbose_name='фото', upload_to='item_photos/', null=True, blank=True)
