#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
import subprocess
import webbrowser
import time
from colorama import Fore as c
def checkInit():
    if os.path.isfile('./SportInventar/.env'):
        return True
    return False



def runapp():
    subprocess.Popen('python SportInventar\\manage.py runserver')

arguments = sys.argv
if len(arguments) > 1:
    if arguments[1] == 'init':
        if checkInit():
            print(c.RED+"ERROR: Project is already initialized. Delete "+c.CYAN+".env"+c.RED+" file from 'SportInventar' directory to re-setup project!"+c.RESET)
            exit()
        runapp()
        
        time.sleep(2)
        print(c.BLUE+"=============== INIT ===============")
        print(c.CYAN+"Follow instructions in the browser")
        print(c.BLUE+'===================================='+c.RESET)
        webbrowser.open('http://127.0.0.1:8000/setup')
    elif arguments[1] == 'run':
        runapp()
        webbrowser.open('http://127.0.0.1:8000')
else:
    print("Arguments are not specified.")
    print("To initialize server run 'python setup.py init'")