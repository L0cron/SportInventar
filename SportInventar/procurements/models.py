from django.db import models

class Procurement(models.Model):
    
    STATUS = (
        (0,'Создан'),
        (1,'В процессе'),
        (2,'Выполнен'),
        (3,'Ошибка')
    )

    url = models.CharField(verbose_name="Ссылка",max_length=255)
    name = models.CharField(verbose_name="Название", max_length=255)
    amo3unt = models.IntegerField(verbose_name="Количество")
    status = models.IntegerField(choices=STATUS, verbose_name='Статус запроса')
    supplier = models.CharField(verbose_name="Поставщик", max_length=255)