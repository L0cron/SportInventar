from django.shortcuts import render, redirect
from django.template import TemplateDoesNotExist
from django.http import HttpRequest, HttpResponse, JsonResponse
from .models import *

from urllib.parse import parse_qs


def inventory_view(request:HttpRequest):
    if request.method == 'GET':
        items = Item.objects.all()
        context = {"items":items}
        return render(request, 'inventory.html',context=context)
    elif request.method == 'POST':
        status = 'ok'
        try:
            itemName = request.POST.get('itemName')
            itemStatus = request.POST.get('itemStatus')
            itemOwner = request.POST.get('itemOwner')

            if len(itemName) == 0 or len(itemStatus) == 0 or len(itemOwner) == 0:
                status = 'Присутствуют незаполненные поля'
            else:
                item = Item(name=itemName,status=int(itemStatus),current_holder=itemOwner)
                item.save()
                status = 'ok'
        except Exception as e:
            status = 'Ошибка записи данных в базу данных: ' + str(e)

        # print(f"itemName: {itemName}, itemStatus: {itemStatus}, itemOwner: {itemOwner}")
        return JsonResponse({"status":status})
    
def del_view(request:HttpRequest)->JsonResponse:
    if request.method == 'POST':
        status = {
            "item_deleted":0
        }
        
        c = 0
        ids = []
        for i in request.POST:
            if i == f'items[{c}]':
                ids.append(request.POST[f"items[{c}]"])
                c+=1
        deleted = 0 
        for i in ids:
            try:
                item = Item.objects.get(id=int(i))
                item.delete()
                deleted+=1
            except:
                pass
        status['item_deleted'] = deleted
        return JsonResponse(status)