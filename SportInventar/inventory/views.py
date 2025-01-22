from django.shortcuts import render, redirect, get_object_or_404
from django.template import TemplateDoesNotExist
from django.http import HttpRequest, HttpResponse, JsonResponse
from .models import *

from urllib.parse import parse_qs

def item_view(request:HttpRequest, item_id:int):
    item = get_object_or_404(Item, id=item_id)
    return render(request, 'item.html', context={'item': item})

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
            itemPhoto = request.POST.get('itemPhoto')
            itemQr = request.POST.get('itemQr')

            if len(itemName) == 0 or len(itemStatus) == 0 or len(itemOwner) == 0:
                status = 'Присутствуют незаполненные поля'
            elif not User.objects.filter(username=itemOwner).exists():
                status = 'Пользователь с таким именем не существует'
            else:
                item = Item(name=itemName,status=int(itemStatus),current_holder=User.objects.get(username=itemOwner), photo_path=itemPhoto, qr_path=itemQr)
                item.save()
                status = 'ok'
        except Exception as e:
            status = 'Ошибка записи данных в базу данных: ' + str(e)

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
    


def search_view(request:HttpRequest):
    if request.method == 'GET':
        users = list(User.objects.values_list('username', flat=True))
        context = {"users":users}
        # return render(request, 'inventory.html',context=context)
        return JsonResponse(context)



def edit_view(request:HttpRequest):
    status = {
        "item_edited": 0,
        "message": ""
    }

    if request.method == 'POST':
        try:
            # Получаем данные из POST-запроса
            item_id = request.POST.get('itemId')
            item_name = request.POST.get('itemName')
            item_status = request.POST.get('itemStatus')
            item_owner = request.POST.get('itemOwner')
            item_photo = request.POST.get('itemPhoto')
            item_qr = request.POST.get('itemQr')

            # Проверяем, что item_id передан
            if not item_id:
                status["message"] = "Item ID is required"
                return JsonResponse(status, status=400)

            # Ищем элемент в базе данных
            try:
                item = Item.objects.get(id=item_id)
            except Item.DoesNotExist:
                status["message"] = "Item not found"
                return JsonResponse(status, status=404)

            # Обновляем данные элемента
            if item_name:
                item.name = item_name
            if item_status:
                item.status = item_status
            if item_owner:
                item.current_holder = item_owner
            if item_photo:
                item.photo_path = item_photo
            if item_qr:
                item.qr_path = item_qr

            # Сохраняем изменения в базе данных
            item.save()

            # Устанавливаем статус успешного обновления
            status["item_edited"] = 1
            status["message"] = "Item updated successfully"
            return JsonResponse(status, status=200)

        except Exception as e:
            # Обработка ошибок
            status["message"] = f"An error occurred: {str(e)}"
            return JsonResponse(status, status=500)

    else:
        # Если метод не POST
        status["message"] = "Invalid request method"
        return JsonResponse(status, status=405)