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

1. **Настройте переменные окружения**
    - Скопируйте в корне проекта файл `.env.example` в `.env`
    - Отредактируйте `.env` файл, заполнив необходимые значения

1. **Установить все зависимости проекта, указанные в файле package.json**
    ```bash
    npm run install:all
    ```

## Разработка

### Разработка фронтенд части

1. **Запустите бэкенд-сервер и базу данных в докере**

    ```bash
    docker-compose -f docker-compose.back.yml up --build -d
    ```

    <img width="300" height="71" alt="image" src="https://github.com/user-attachments/assets/363188da-8848-4549-b388-712fa90cd575" />

2. **Запустите сервер разработки фронтенда локально из корневого каталога проекта**

    ```bash
    npm run dev:front
    ```

    <img width="300" height="119" alt="image" src="https://github.com/user-attachments/assets/75a6b8dc-7ea2-4e33-99bd-5c72bf55d45e" />

### Разработка бэкенд части

1. **Запустите сервер разработки фронтенда и базу данных**

    ```bash
    docker-compose -f docker-compose.front.yml up --build -d
    ```

    <img width="300" height="67" alt="image" src="https://github.com/user-attachments/assets/e265f794-f60b-4afa-89c7-5b98932e0070" />

2. **Настройте базу данных (примените миграции)**

    ```bash
    cd apps/backend
    npx prisma migrate deploy
    ```

    <img width="300" height="154" alt="image" src="https://github.com/user-attachments/assets/b6ee6ecb-ba9a-43c2-b008-804220e0f6cf" />

3. **Запустите бэкенд-сервер локально в режиме разработки из корневого каталога проекта**
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
├── .env.example
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