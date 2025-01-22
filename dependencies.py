import sys
import subprocess
import importlib.metadata

required = {
    'django',
    'colorama',
    'python-dotenv',
    'psycopg',
    'psycopg2',
    'requests',
    'beautifulsoup4'
}

installed = {pkg.metadata['Name'].lower() for pkg in importlib.metadata.distributions()}
missing = required - installed

for package in required:
    print("- Проверка " + str(package))
    if package.lower() in missing:
        print("-> Установка " + str(package))
        python = sys.executable
        print()
        subprocess.check_call([python, '-m', 'pip', 'install', package])
        print()
    else:
        print("* " + str(package) + " уже установлен")

print("Установка зависимостей завершена")