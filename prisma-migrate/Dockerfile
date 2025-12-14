# ./prisma-migrate/Dockerfile

# Используем легкий базовый образ Node.js
FROM node:22-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# УСТАНОВКА OPENSSL: Необходима для корректной работы Prisma
RUN apt-get update && apt-get install -y openssl

# Копируем только файлы, необходимые для установки зависимостей (из папки backend)
# Контекст сборки в docker-compose.yml установлен как корень проекта (.).
COPY backend/package.json backend/package-lock.json ./

# Устанавливаем зависимости (включая Prisma CLI)
RUN npm install --ignore-scripts

# Копируем схему и миграции (из папки backend)
# Они будут размещены в /app/prisma, где их ожидает найти Prisma.
COPY backend/prisma ./prisma
COPY backend/prisma.config.ts ./

# Команда запуска (npx prisma migrate deploy) задается в docker-compose.yml