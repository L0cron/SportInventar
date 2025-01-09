from django.shortcuts import render, redirect
from django.template import TemplateDoesNotExist
from django.http import HttpRequest, HttpResponse, JsonResponse
from .models import *

def requests_view(request:HttpRequest):
    if request.method == 'GET':
        requests = Request.objects.all()
        context = {"requests":requests}
        return render(request, 'requests.html',context=context)
    elif request.method == 'POST':
        status = 'ok'
        try:
            requestType = request.POST.get('requestType')
            requestedItem = request.POST.get('requestedItem')
            requestDesc = request.POST.get('requestDesc')

            if  len(requestedItem) == 0 or len(requestDesc) == 0:
                status = 'Присутствуют незаполненные поля'
            else:
                request = Request(requested_item=requestedItem, 
                                  text=requestedItem,
                                  request_type=requestType,
                                  )
                request.save()
                status = 'ok'
        except Exception as e:
            status = 'Ошибка записи данных в базу данных: ' + str(e)
        return JsonResponse({"status":status})