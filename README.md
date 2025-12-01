# Monitorium

## Предварительные требования

Перед началом работы убедитесь, что на вашем компьютере установлены:

- [Node.js](https://nodejs.org/) (версия 18 или выше)
- [Git](https://git-scm.com/downloads) Git (CKB)
- [Docker](https://docs.docker.com/get-docker/) Docker Compose
- [Postman](https://www.postman.com/downloads/) (для тестирования API)
- [DBeaver](https://dbeaver.io/download/) или другой SQL-клиент

## Начальная настройка

1. **Создайте локальную копию репозитория по указанному URL-адресу на GitHub.**
    ```bash
    git clone https://github.com/viksiko/monitorium.git
    ```
1. **Перейдите в каталог с именем monitorium.**

    ```bash
    cd monitorium
    ```

1. **Переключитесь на ветку dev в локальной копии репозитория.**

    ```bash
    git checkout dev
    ```

1. **Создайте от ветки "dev" новую ветку для разработки и перейдите в нее**

    ```bash
    git checkout -b new-branch
    ```    

1. **Настройте переменные окружения**
    - Скопируйте в корне проекта файл `.env.example` в `.env`
    - Отредактируйте `.env` файл, заполнив необходимые значения

1. **Установить все зависимости проекта, указанные в файле package.json**
    ```bash
    npm run install:all
    ```

## Разработка

### Инструкция для фронтенд разработчика

1. **Запустите бэкенд-сервер и базу данных в докере**

    - *При первом запуске или после изменений в коде используйте*

    ```bash
    docker-compose -f docker-compose.back.yml up --build -d
    ```
    <img width="300" height="121" alt="image" src="https://github.com/user-attachments/assets/19454f30-ffec-4ed4-9796-cf8e1ccf355d" /><br>

    - *Для последующих запусков (без изменений) используйте*
   
    ```bash
    docker-compose -f docker-compose.back.yml up -d
    ```
    <img width="300" height="55" alt="image" src="https://github.com/user-attachments/assets/f804fe23-86fe-4ed9-8001-a136128c39a7" />


3. **Запустите сервер разработки фронтенда локально из корневого каталога проекта**

    ```bash
    npm run dev:front
    ```

    <img width="300" height="119" alt="image" src="https://github.com/user-attachments/assets/75a6b8dc-7ea2-4e33-99bd-5c72bf55d45e" />

### Инструкция для бэкенд разработчика

1. **Запустите сервер разработки фронтенда и базу данных**

    - *При первом запуске или после изменений в коде используйте*

    ```bash
    docker-compose -f docker-compose.front_db.yml up --build -d
    ```
    <img width="300" height="119" alt="image" src="https://github.com/user-attachments/assets/739904a3-03cd-4543-ba38-2d869a6d625b" /><br>

    - *Для последующих запусков (без изменений) используйте*
   
    ```bash
    docker-compose -f docker-compose.front_db.yml up -d
    ```

    <img width="300" height="51" alt="image" src="https://github.com/user-attachments/assets/28b388da-a1b4-4391-b37a-ddba5cce5148" />


1. **Настройте базу данных (примените миграции)**

    ```bash
    cd apps/backend
    npx prisma migrate deploy
    ```

    <img width="300" height="154" alt="image" src="https://github.com/user-attachments/assets/b6ee6ecb-ba9a-43c2-b008-804220e0f6cf" />

2. **Запустите бэкенд-сервер локально в режиме разработки из корневого каталога проекта**
    ```bash
    npm run dev:back
    ```
    <img width="300" height="55" alt="image" src="https://github.com/user-attachments/assets/4b2d8da6-a37c-4cdc-a36c-1c74e9222bc8" />


 ## Документация API

После запуска бэкенд-сервера будет доступна документация API по адресу:
- **Swagger UI:** /api/v1/docs
- **OpenAPI спецификация:** /api/v1/docs-json

В документации вы найдете:
- Все доступные эндпоинты API
- Описание параметров запросов и ответов
- Возможность тестирования API прямо из браузера
- Примеры запросов и ответов   

## Docker Compose файлы

- `docker-compose.back.yml` - для разработки фронтенда (запускает бэкенд-сервер и БД)
- `docker-compose.front.yml` - для разработки бэкенда (запускает сервер разработки фронтенда и БД)
- `docker-compose.front.yml` - для запуска всех приложений в проекте

## Структура проекта

```
monitorium/
├── apps/backend
│   ├── backend/      # Бэкенд приложение
│   └── frontend/     # Фронтенд приложение
├── docker-compose.back.yml
├── docker-compose.front.yml
├── docker-compose.yml
├── .env
├── .env.example
├── node_modules
└── package.json
```

## Скрипты

- `npm run install:all` - установка зависимостей для всех частей проекта
- `npm run dev:front` - запуск сервера разработки фронтенда в режиме разработки
- `npm run dev:back` - запуск бэкенда-сервера в режиме разработки
- `npm install <пакет> --workspace=front` - установка пакетов на сервер разработки фронтенда
- `npm install <пакет> --workspace=back` - установка пакетов на бэкенд-сервер

## При возникновении проблем

1. Проверьте, что все предварительные требования установлены
2. Убедитесь, что Docker Compose запущен
3. Проверьте логи контейнеров: `docker-compose -f <файл> logs`
4. Убедитесь, что все переменные в `.env` файле корректно заполнены