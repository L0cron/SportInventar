from django.contrib import admin
from .models import Item, itemInstance, owner

@admin.register(owner)
class ownerAdmin(admin.ModelAdmin):
    list_display = ('first_name','last_name')

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = tuple(['name'])

@admin.register(itemInstance)
class itemInstanceAdmin(admin.ModelAdmin):
    list_display = ('id','item','owner','amount','status','due_back')
