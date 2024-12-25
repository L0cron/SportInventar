from django.db import models
from django.urls import reverse
import uuid # Required for unique book instances

class Item(models.Model):
    # Поля
    name = models.CharField(max_length=30, help_text='Название предмета')
    price = models.IntegerField(help_text='Цена предмета')
    # Метаданные
    class Meta:
        ordering = ['-name']

    # Methods
    def get_absolute_url(self):
        return reverse('model-detail-view', args=[str(self.id)])

    def __str__(self):
        """Строка для представления объекта item"""
        return self.name

    def display_genre(self):
        """
        Creates a string for the Genre. This is required to display genre in Admin.
        """
        return ', '.join([ genre.name for genre in self.genre.all()[:3] ])
    display_genre.short_description = 'Genre'
    

class owner(models.Model):

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

    def get_absolute_url(self):
        return reverse('owner-detail', args=[str(self.id)])


    def __str__(self):
        return '{0}, {1}'.format(self.last_name, self.first_name)


class itemInstance(models.Model):
    """
    Model representing a specific copy
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, help_text="Unique ID for this particular book across whole library")
    item = models.ForeignKey(Item, on_delete=models.SET_NULL, null=True)
    owner = models.ForeignKey(owner, on_delete=models.SET_NULL, null=True)
    amount = models.IntegerField(help_text='Количество предметов')
    due_back = models.DateField(null=True, blank=True)

    LOAN_STATUS = (
        ('m', 'Maintenance'),
        ('o', 'On loan'),
        ('a', 'Available'),
        ('r', 'Reserved'),
    )

    status = models.CharField(max_length=1, choices=LOAN_STATUS, blank=True, default='m', help_text='Book availability')

    class Meta:
        ordering = ["due_back"]


    def __str__(self):
        return '{0} ({1})'.format(self.id,self.item.name)


