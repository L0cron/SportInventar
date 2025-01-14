#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
import subprocess
import webbrowser
import time
from colorama import Fore as c
import colorama
import json

def checkInit():
    if os.path.isfile('./config.json'):
        with open('./config.json', 'r', encoding='utf-8') as fp:
            cfg = json.load(fp)
            if cfg['db_name'] != '':
                return True
    return False

def getConfig()->dict:
    if os.path.isfile('./config.json'):
        with open('./config.json', 'r', encoding='utf-8') as fp:
            cfg = json.load(fp)
            return cfg
    return {}

def migrate():
    current_dir = os.getcwd()
    manage_py_path = os.path.join(current_dir, './SportInventar/manage.py')

    if not os.path.isfile(manage_py_path):
        print("manage.py not found in the ./SportInventar directory.")
    else:
        try:
            migrations = subprocess.run(['python', manage_py_path, 'makemigrations'], shell=True, check=True, capture_output=True, text=True)
            print(migrations.stdout)
            result = subprocess.run(['python', manage_py_path, 'migrate'], shell=True, check=True, capture_output=True, text=True)
            print(result.stdout)
            print("Migrations created successfully:")
            
        except subprocess.CalledProcessError as e:
            print("An error occurred while making migrations:")
            print(e.stderr)  

def createsuperuser():
    cfg = getConfig()
    current_dir = os.getcwd()
    manage_py_path = os.path.join(current_dir, './SportInventar/manage.py')

    os.environ['DJANGO_SUPERUSER_USERNAME'] = cfg['super_username']
    os.environ['DJANGO_SUPERUSER_PASSWORD'] = cfg['super_password']
    os.environ['DJANGO_SUPERUSER_FIRST_NAME'] = cfg['super_name']
    os.environ['DJANGO_SUPERUSER_LAST_NAME'] = cfg['super_lastname']

    try:
        result = subprocess.run(['python', manage_py_path, 'createsuperuser', '--email', '', '--noinput'], check=True, capture_output=True, text=True)
        print(result.stdout)  
        print("Супер пользователь создан.")
    except subprocess.CalledProcessError as e:
        if "username is already taken" in e.stderr:
            print("Супер пользователь уже создан.")
        else:
            print("An error occurred while creating the superuser:")
            print(e.stderr)

def runapp():
    subprocess.Popen(f'python SportInventar\\manage.py runserver {cfg["serverIP"]}:{cfg['serverPort']}')

arguments = sys.argv
if len(arguments) > 1:
    if arguments[1] == 'init':
        colorama.init()
        if checkInit():
            print(c.RED+"Project is already initialized. Delete config.json to re-setup." + c.RESET)
            exit()
        runapp()
        
        time.sleep(2)
        print(c.BLUE+"=============== INIT ===============")
        print(c.CYAN+"Follow instructions in the browser")
        print(c.BLUE+'===================================='+c.RESET)
        webbrowser.open('http://127.0.0.1:8000/setup')
    elif arguments[1] == 'run':
        if not checkInit():
            print(c.RED+"Проект не инициализирован. Запустите setup.bat")
        print("Подождите, происходит миграция базы данных!")
        
        migrate()

        print()
        print("Миграция прошла успешно!")
        print()
        print("Создание супер пользователя...")
        createsuperuser()
        print()
        print("Готово. Запуск...")
        cfg = getConfig()
        runapp()

        webbrowser.open(f'http://{cfg['serverIP']}:{cfg['serverPort']}')
else:
    print("Arguments are not specified.")
    print("To initialize server run 'setup.bat' or 'python setup.py init'")