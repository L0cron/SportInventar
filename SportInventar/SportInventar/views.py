from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import render, redirect
import ipaddress as ipaddr
import os
import psycopg2 as psy
import re
from urllib.parse import parse_qs
def index(request:HttpRequest)->HttpResponse:
    return render(request,'index.html')


def checkInit():
    if os.path.isfile('./SportInven tar/.env'):
        return True
    return False

def setup(request:HttpRequest):
    if checkInit():
        return redirect('index')
    if request.method == 'POST':
        print(request.POST)
        status = '0'
        if 'db' in request.POST:
            db = parse_qs(request.POST['db'])
            try:
                # engine = db['db_engine'][0]
                name = db['dbname'][0]
                ip = db['ip'][0]
                port = db['port'][0]
                user = db['dbusername'][0]
                pwd = db['dbpassword'][0]
                connection_string = f"dbname='{name}' user='{user}' password='{pwd}' host='{ip}' port='{port}'"
            except:
                status = 'Присутствуют незаполненные поля'
            else:
                try:
                    connection = psy.connect(connection_string)
                    status = 'ok'
                except psy.OperationalError as e:
                    status = 'Ошибка во время подключения базы: '+str(e)
                except TimeoutError as e:
                    status = 'Ошибка, время отведённое на подключение истекло.'
                finally:
                    if 'connection' in locals():
                        connection.close()
        if 'superuser' in request.POST:
            user = parse_qs(request.POST['superuser'])
            try:
                username = user['username'][0]
                pwd = user['password'][0]
                rpwd = user['rpassword'][0]
                # email = user['email'][0]
                name = user['name'][0]
                last_name = user['lastname'][0]
            except:
                status = 'Присутствуют незаполненные поля'
            else:
                if pwd == rpwd:
                    if len(pwd) < 12:
                        status = 'Пароль должен состоять хотя бы из 12 символов'
                    else:
                        uname = username.lower()
                        if not bool(re.match("^[A-Za-z]+$", uname)):

                            status = 'Имя пользователя должно состоять только из букв латинского алфавита'
                        else:
                            if len(uname) < 4:
                                status = 'Имя пользователя должно состоять хотя бы из 4 символов'
                            else:
                                status = 'ok'
                else:
                    status = 'Пароли не совпадают!'
        if 'config' in request.POST:
            config = parse_qs(request.POST['config'])
            try:
                servername = config['servername'][0]
                serverip = config['serverip'][0]
                serverport = config['serverport'][0]
            except:
                status = 'Присутствуют незаполненные поля'
            else:
                try:
                    ipaddr.IPv4Address(serverip)
                except:
                    status = 'Некорректный IP адрес сервера'
                else:
                    if serverport.isdigit() and int(serverport) > 0 and int(serverport) < 65536:
                            status = 'ok'
                    else:
                        status = 'Некорректный порт сервера'
                    
                    
        return JsonResponse({"status":status})
    else:
        return render(request,'setup.html') 