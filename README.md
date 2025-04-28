# budget-buddy
1. Клонировать репозиторий

git clone https://github.com/yffi4/budget-buddy.git
cd budget-buddy
2. Создать виртуальное окружение

python -m venv venv
source venv/bin/activate  # для Linux/Mac
venv\Scripts\activate     # для Windows
3. Установить зависимости

pip install -r requirements.txt
4. Применить миграции

python manage.py migrate

python manage.py runserver
6. Открыть приложение
Перейдите в браузере по адресу:
http://127.0.0.1:8000/

