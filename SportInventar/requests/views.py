from django.shortcuts import render, redirect
from django.template import TemplateDoesNotExist
from django.http import HttpRequest, HttpResponse, JsonResponse
from .models import *

def requests_view(request:HttpRequest):
    if request.method == 'GET':
        requests = Request.objects.all()
        print(requests)
        context = {"requests":requests}
        print(context)
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
                request = Request(requested_item=requestedItem, 
                                  text=requestDesc,
                                  request_type=requestType,
                                  author='123',
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
            requestStatus = request.POST.get('new_status')
            _request = Request.objects.get(id=int(requestId))
            _request.status = int(requestStatus)
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