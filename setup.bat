@echo off
chcp 65001
cls
title Project Setup
@REM echo Спортивный инветарь 1.0.0
echo.
@REM echo Установка зависимостей
python dependencies.py
echo.
@REM echo Начало установки
@REM echo Внимание: Установка проекта возможна только при отсутствии config.json файла в данной директории
python setup.py init
pause