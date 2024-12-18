from django.contrib import admin
from .models import Item, itemInstance, owner

#class ownerAdmin(admin.ModelAdmin):
 #   pass

admin.site.register(Item)
admin.site.register(itemInstance)
admin.site.register(owner) 
