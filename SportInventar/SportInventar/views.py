from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
import ipaddress as ipaddr
import os
import psycopg2 as psy
import re
import json
from urllib.parse import parse_qs
import subprocess as sp
def index(request:HttpRequest)->HttpResponse:
    return render(request,'index.html')


basic_config = {
    "db_name": "",
    "db_ip": "127.0.0.1",
    "db_port": "5432",
    "db_user": "",
    "db_password": "",
    "super_username": "",
    "super_password": "",
    "super_name": "",
    "super_lastname": "",
    "projectName": "",
    "serverIP": "127.0.0.1",
    "serverPort": "8000"
}

def checkInit():
    if os.path.isfile(os.path.join(getMainPath(),'config.json')):
        with open(os.path.join(getMainPath(),'config.json'), 'r', encoding='utf-8') as fp:
            cfg = json.load(fp)
            if cfg['db_name'] != '':
                return True
            print(cfg)
    return False

def getMainPath():
    return os.path.dirname(os.path.abspath(__file__))


configuration = {}
def migrate():
    print(getMainPath())
    print(configuration)
    with open(os.path.join(getMainPath(),'../config.json'), 'w', encoding='utf-8') as fp:
        json.dump(configuration, fp,indent=4,ensure_ascii=False)
    

def setup(request:HttpRequest):
    if checkInit():
        return redirect('index')
    if request.method == 'POST':
        print(request.POST)
        status = '0'
        if 'db' in request.POST:
            db = parse_qs(request.POST['db'])
            try:
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
                    configuration['db_name'] = name
                    configuration['db_ip'] = ip
                    configuration['db_port'] = port
                    configuration['db_user'] = user
                    configuration['db_password'] = pwd
                except psy.OperationalError as e:
                    status = 'Ошибка во время подключения базы: '+str(e)
                except TimeoutError as e:
                    status = 'Ошибка, время отведённое на подключение истекло.'
                except:
                    status = 'Неверное имя пользователя и/или пароль.'
                finally:
                    if 'connection' in locals():
                        connection.close()
        if 'superuser' in request.POST:
            user = parse_qs(request.POST['superuser'])
            try:
                username = user['username'][0]
                pwd = user['password'][0]
                rpwd = user['rpassword'][0]
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
                                configuration["super_username"] = username
                                configuration["super_password"] = pwd
                                configuration["super_name"] = name
                                configuration["super_lastname"] = last_name
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
                            configuration["projectName"] = servername
                            configuration["serverIP"] = serverip
                            configuration["serverPort"] = serverport

                    else:
                        status = 'Некорректный порт сервера'
        if 'migrate' in request.POST:
            migrate()
            exit()
                    
        return JsonResponse({"status":status})
    else:
        return render(request,'setup.html') 

