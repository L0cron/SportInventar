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
echo Внимание: Установка проекта возможно только при отсутствии .env файла в директории SportInventar
python setup.py init
pause