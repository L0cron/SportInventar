from django.shortcuts import render, redirect, get_object_or_404
from django.template import TemplateDoesNotExist
from django.http import HttpRequest, HttpResponse, JsonResponse
from .models import *
import socket
import requests
from bs4 import BeautifulSoup
from urllib.parse import parse_qs

def procurement_view(request:HttpRequest):
    if request.method == 'GET':
        procurements = Procurement.objects.all()
        context = {"procurements":procurements}
        return render(request, 'procurements.html',context=context)
    elif request.method == 'POST':
        status = 'ok'
        try:
            itemName = request.POST.get('itemName')
            itemOwner = request.POST.get('itemOwner')
            itemPhoto = request.POST.get('itemPhoto')

            if len(itemName) == 0 or len(itemOwner) == 0:
                status = 'Присутствуют незаполненные поля'
            else:
                proc = Procurement(name=itemName,current_holder=itemOwner, photoPath=itemPhoto)
                proc.save()
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
                proc = Procurement.objects.get(id=int(i))
                proc.delete()
                deleted+=1
            except:
                pass
        status['item_deleted'] = deleted
        return JsonResponse(status)

def edit_view(request:HttpRequest):
    print(request)
    print(request.method)
    print(request.POST)
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



            # Проверяем, что item_id передан
            if not item_id:
                status["message"] = "Item ID is required"
                return JsonResponse(status, status=400)

            # Ищем элемент в базе данных
            try:
                item = Procurement.objects.get(id=item_id)
            except Procurement.DoesNotExist:
                status["message"] = "Procurement not found"
                return JsonResponse(status, status=404)

            # Обновляем данные элемента
            if item_name:
                item.name = item_name
            if item_status:
                item.status = item_status
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

def item_view(request:HttpRequest, item_id:int):
    item = get_object_or_404(Procurement, id=item_id)
    return render(request, 'proc.html', context={'item': item})

def parce_view(request:HttpRequest, search:str):
    response = requests.get("https://starfitshop.ru/search/?query=" + str(bytes(search.encode("utf-8"))).replace('x','%').replace("\\","").strip("b'").upper(), sep="")
    soup = BeautifulSoup(response.text, 'html.parser')