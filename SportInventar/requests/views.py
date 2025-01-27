from django.shortcuts import render, redirect
from django.template import TemplateDoesNotExist
from django.http import HttpRequest, HttpResponse, JsonResponse
from .models import *

# если тип заявки приоберетение-> поиска не будет, текст; замена -> поиск

def requests_view(request:HttpRequest):
    if request.method == 'GET':
        requests = Request.objects.all()
        items = Item.objects.all()
        context = {"requests":requests, "items":items}
        return render(request, 'requests.html',context=context)
    elif request.method == 'POST':
        status = 'ok'
        try:
            requestType = request.POST.get('requestedType')
            requestedItem = request.POST.get('requestedItem')
            requestDesc = request.POST.get('requestDesc')

            if  len(requestedItem) == 0 or len(requestDesc) == 0:
                status = 'Присутствуют незаполненные поля'
            else:
                request = Request(requested_item=Item.objects.get(id=requestedItem), 
                                  text=requestDesc,
                                  request_type=requestType,
                                  author=User.objects.get(id=request.user.id),
                                  status=0
                                  )
                request.save()
                status = 'ok'
        except Exception as e:
            status = 'Ошибка записи данных в базу данных: ' + str(e)
        return JsonResponse({"status":status})

def change_request_view(request:HttpRequest):
    if request.method == 'POST':
        status = 'ok'
        try:
            print(request.POST)
            requestId = request.POST.get('request_id')
            requestItem = request.POST.get('request_type')
            _request = Request.objects.get(id=int(requestId))
            _request.save()
        except Exception as e:
            status = 'Ошибка записи данных в базу данных: ' + str(e)
        return JsonResponse({"status":status})

def accept_request_view(request:HttpRequest):
    if request.method == 'POST':
        status = 'ok'
        try:
            requestId = request.POST.get('request_id')
            _request = Request.objects.get(id=int(requestId))
            _request.status = 1
            _request.request_display_type = 1
            _request.save()
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
                request = Request.objects.get(id=int(i))
                request.delete()
                deleted+=1
            except:
                pass
        status['item_deleted'] = deleted
        return JsonResponse(status)
    
def archive_request_view(request:HttpRequest):
    if request.method == 'POST':
        status = 'ok'
        try:
            requestId = request.POST.get('request_id')
            requestStatus = request.POST.get('request_status')
            requestType = request.POST.get('disp_type')
            _request = Request.objects.get(id=int(requestId))
            _request.status = requestStatus
            _request.request_display_type = requestType 
            _request.save()
        except Exception as e:
            status = 'Ошибка записи данных в базу данных: ' + str(e)
        return JsonResponse({"status":status})

def complete_request_view(request:HttpRequest):
    if request.method == 'POST':
        status = 'ok'
        try:
            requestId = request.POST.get('request_id')
            _request = Request.objects.get(id=int(requestId))
            _request.status = 2
            _request.request_display_type = 2
            _request.completion = True
            _request.save()
        except Exception as e:
            status = 'Ошибка записи данных в базу данных: ' + str(e)
        return JsonResponse({"status":status})
    
def search_view(request:HttpRequest):
    if request.method == 'GET':
        items = list(Item.objects.values_list('name', flat=True))
        context = {"items":items}
        return JsonResponse(context)
