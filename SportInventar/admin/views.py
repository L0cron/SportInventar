from django.conf import settings
from django.http import HttpRequest, HttpResponse, JsonResponse, Http404
from django.shortcuts import render, redirect, reverse
from django.contrib.auth.decorators import login_required
import json
# Create your views here.
from user_handler.models import *
from django.db.models import Case, When, IntegerField
from inventory.models import Item, inventory_status

import time
import hashlib
import csv
import os


@login_required
def admin_view(request:HttpRequest)->HttpResponse:
    if request.user.is_staff:
        return render(request,'admin/general.html')
    return redirect('user:profile')

@login_required
def admin_view_i(request:HttpRequest)->HttpResponse:
    if request.user.is_staff:
        return render(request,'admin/inventory.html')
    return redirect('user:profile')

@login_required
def admin_view_p(request:HttpRequest)->HttpResponse:
    if request.user.is_staff:
        return render(request,'admin/procurs.html')
    return redirect('user:profile')

@login_required
def admin_view_r(request:HttpRequest)->HttpResponse:
    if request.user.is_staff:
        return render(request,'admin/requests.html')
    return redirect('user:profile')

@login_required
def admin_view_u(request:HttpRequest)->HttpResponse:
    if request.user.is_staff:

        users = User.objects.all().order_by(Case(
            When(status = 0, then=0),
            default=1,
            output_field=IntegerField()
        ))

        return render(request,'admin/users.html',context={"users":users})
    return redirect('user:profile')

@login_required
def get(request:HttpRequest)->JsonResponse:
    if not request.user.is_staff:
        return JsonResponse({'status':"Invalid user"})
    
    settings = json.load(open('./settings.json','r'))
    return JsonResponse({"settings":settings})

@login_required
def setview(request:HttpRequest)->JsonResponse:
    if not request.user.is_staff:
        return JsonResponse({'status':"Invalid user"})
    
    # Default Settgins
    settings_check = {
        "free_register": True,
        "free_view": True,
        "hide_real_names": True,
        "free_user_inventory_view": False
    }
    
    settings = settings_check.copy()
    for key in request.GET:
        if key in request.GET.dict():
            val = request.GET[key]
            if val == 'false':
                val = False
            elif val == 'true':
                val = True
            settings[key] = val
            
    if settings == '' or settings == None:
        return JsonResponse({'status':"Invalid settings"})
    json.dump(settings,open('./settings.json','w'),indent=4)
    return JsonResponse({'status':"Settings updated successfully"})


#Формирование отчетов
def calculate_file_hash():
    """Вычисляет SHA-256 хэш файла c использованием time."""
    
    hash = hashlib.sha256(str(int(time.time())).encode())

    return hash.hexdigest()


def export_to_csv(request):
    # Создаем временный файл для записи данных
    temp_file_path = 'SportInventar/reports_csv/temp_mymodel_data.csv'

    # Создаем CSV writer
    with open(temp_file_path, 'w', newline='', encoding='utf-8-sig') as file:
        writer = csv.writer(file)

        # Записываем заголовки
        writer.writerow(['Название', 'Статус', 'Текущий владелец', 'ID владельца'])

        # Записываем данные из модели
        for obj in Item.objects.all():
            writer.writerow([obj.name, inventory_status[obj.status][1], obj.current_holder,obj.id])

    # Вычисляем хэш файла
    file_hash = calculate_file_hash()
    print(f"Хэш файла: {file_hash}")

    # Путь к файлу с хэшем в качестве имени
    file_path = f"SportInventar/reports_csv/{file_hash}.csv"

    # Переименовываем временный файл
    os.rename(temp_file_path, file_path)

    # Получаем размер файла
    file_size = os.path.getsize(file_path)
    print(f"Размер файла: {file_size} байт")

    # Сохраняем информацию о файле в логах
    download_link = request.build_absolute_uri(reverse('adminp:download_file', kwargs={'file_name': file_hash}))
    FileLog.objects.create(file_path=file_path, download_link=download_link, file_name=file_hash)

    # Возвращаем файл в ответе
    with open(file_path, 'rb') as f:
        response = HttpResponse(f.read(), content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="{file_hash}"'
        response['name'] = FileLog.objects.get(file_name=file_hash).created_at
        return response


def download_file(request, file_name):
    # Полный путь к файлу
    # full_file_path = os.path.join(settings.BASE_DIR, file_name)
    full_file_path = 'SportInventar/reports_csv/' + file_name + '.csv'

    print(full_file_path)

    if os.path.exists(full_file_path):
        with open(full_file_path, 'rb') as f:
            response = HttpResponse(f.read(), content_type='text/csv')
            response['Content-Disposition'] = f'attachment; filename="{os.path.basename(full_file_path)}"'
            response['name'] = FileLog.objects.get(file_name=file_name).created_at
            print(FileLog.objects.get(file_name=file_name).created_at)
            return response
    else:
        raise Http404("File does not exist")


# Создание отчетов
@login_required
def admin_view_report(request:HttpRequest)->HttpResponse:
    if not request.user.is_staff: return redirect('user:profile')

    files = FileLog.objects.all()
    return render(request,'admin/report.html', context={"files":files})
