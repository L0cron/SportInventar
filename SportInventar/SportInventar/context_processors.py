import os
import json
def getConfig()->dict:
    if os.path.isfile('./config.json'):
        with open('./config.json', 'r', encoding='utf-8') as fp:
            cfg = json.load(fp)
            return cfg
    return {}

def projectName(request):
    cfg = getConfig()
    if cfg == {}:
        cfg['projectName'] = '...'
    return {
        'projectName': cfg['projectName'],
    }