# budget-buddy
## Запуск проекта

### 1. Клонировать репозиторий
```bash
git clone https://github.com/yffi4/budget-buddy.git
cd budget-buddy
cd backend
```

### 2. Создать виртуальное окружение
```bash
python -m venv venv
```
Активировать виртуальное окружение:

- Для Linux/Mac:
  ```bash
  source venv/bin/activate
  ```
- Для Windows:
  ```bash
  venv\Scripts\activate
  ```

### 3. Установить зависимости
```bash
pip install -r requirements.txt
```

### 4. Применить миграции базы данных
```bash
python manage.py migrate
```

### 5. Запустить сервер разработки
```bash
python manage.py runserver
```

### 6. Открыть приложение
Перейдите в браузере по адресу:  
[http://127.0.0.1:8000/](http://127.0.0.1:8000/)

### 7. Перейти в папку `frontend`
```bash
cd ../frontend
```

### 8. Установить зависимости
```bash
npm install
```

(Это чтобы фронтенд знал, куда отправлять запросы.)

### 9. Запустить сервер разработки
```bash
npm run dev
```

Доступ: [http://localhost:3000/](http://localhost:3000/)

