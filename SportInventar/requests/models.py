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

    author = models.ForeignKey(User, verbose_name='Текущий владелец', on_delete=models.CASCADE)
    requested_item = models.ForeignKey(Item, verbose_name='Запрошенный инвентарь', on_delete=models.CASCADE)
    text = models.TextField(verbose_name='Описание запроса(причина запроса)',max_length=255)
    request_type = models.Choices(REQ_TYPE)
    status = models.Choices(STATUS)
