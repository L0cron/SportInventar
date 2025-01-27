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
    current_holder = models.ForeignKey(User, verbose_name='текущий владелец',on_delete=models.CASCADE,null=True)
    photo_path = models.CharField(verbose_name='фото', max_length=255, null=True)
    qr_path = models.CharField(verbose_name='qr-код', max_length=255, null=True)

    def __str__(self) -> str:
        return self.name


class History(models.Model):
    item = models.ForeignKey(Item, verbose_name="Предмет", on_delete=models.CASCADE)
    timestamp = models.DateTimeField(verbose_name="Время", auto_now=True)
    current_holder = models.ForeignKey(User, verbose_name="Текущий владелец", blank=True, null=True, on_delete=models.SET_NULL)

# пасхалочка print("Привет, мир!")
