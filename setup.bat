@echo off
chcp 65001
cls
title Project Setup
echo Спортивный инветарь 1.0.0
echo.
echo Установка зависимостей
python dependencies.py
echo.
echo Начало установки
echo Внимание: Установка проекта возможна только при отсутствии config.json файла в данной директории
python setup.py init
pause