from django.db import models
from user_handler.models import *
from inventory.models import *

# Модель запросов
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
        (2,'Назначение'),
        (3,'Ремонт')
    )
    DISPLAYS = (
        (0,'Новая'),
        (1,'Активная'),
        (2,'Архивная')
    )

    author = models.ForeignKey(User, verbose_name='Текущий владелец', on_delete=models.CASCADE)
    requested_item = models.ForeignKey(Item, verbose_name='Запрошенный инвентарь', on_delete=models.CASCADE)
    text = models.TextField(verbose_name='Описание заявки(причина заявки)',max_length=255)
    request_type = models.IntegerField(choices=REQ_TYPE, verbose_name='Тип заявки')
    status = models.IntegerField(choices=STATUS, verbose_name='Статус заявки')
    request_display_type = models.IntegerField(choices=DISPLAYS, verbose_name='Где отображать заявку',default=0)

    class Meta:
        ordering = ['id']