from django.db import models
from user_handler.models import *
from inventory.models import *

class Request(models.Model):

    STATUS = (
        (0,'Создана'),
        (1,'На рассмотрении'),
        (2,'Принята'),
        (3,'Отклонена')
    )
    REQ_TYPE = (
        (0,'Приобретение'),
        (1,'Замена'),
        (2,'Получение')
    )

    author = models.CharField(verbose_name='Создатель заявки', max_length=255) # models.ForeignKey(User, verbose_name='Текущий владелец', on_delete=models.CASCADE)
    requested_item = models.CharField(verbose_name='Запрошенный инвентарь', max_length=255) # models.ForeignKey(Item, verbose_name='Запрошенный инвентарь', on_delete=models.CASCADE)
    text = models.TextField(verbose_name='Описание запроса(причина запроса)',max_length=255)
    request_type = models.IntegerField(choices=REQ_TYPE, verbose_name='Тип запроса')
    status = models.IntegerField(choices=STATUS, verbose_name='Статус запроса')

    class Meta:
        ordering = ['id']