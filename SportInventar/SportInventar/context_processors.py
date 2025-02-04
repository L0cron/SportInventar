import os
import json
def getConfig()->dict:
    if os.path.isfile('./config.json'):
        with open('./config.json', 'r', encoding='utf-8') as fp:
            cfg = json.load(fp)
            return cfg
    return {}

def getSettings()->dict:
    if os.path.isfile('./settings.json'):
        with open('./settings.json', 'r', encoding='utf-8') as fp:
            cfg = json.load(fp)
            return cfg
    return {}

def projectName(request):
    cfg = getConfig()
    settings = getSettings()
    data = {}
    
    data['projectName'] = '...'
    data['settings'] = {}
    if cfg != {}:
        data['projectName'] = cfg['projectName']
    if settings != {}:
        data['settings'] = settings
    if settings == {}:
        data['settings'] = {}
    return {
        'projectName': data['projectName'],
        'settings':data['settings']
    }