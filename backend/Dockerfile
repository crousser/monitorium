# ./backend/Dockerfile

# --- STAGE 1: BUILDER (Сборка, Генерация Prisma Client и Компиляция) ---
FROM node:22-slim AS builder

# Обновляем список пакетов и устанавливаем procps, который содержит 'ps'
RUN apt-get update && apt-get install -y procps \
    && rm -rf /var/lib/apt/lists/*

# Устанавливаем рабочую директорию
WORKDIR /app

# УСТАНОВКА OPENSSL: Необходима для корректной работы Prisma Client.
RUN apt-get update && apt-get install -y openssl

# Копируем только файлы для установки зависимостей
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm install --ignore-scripts

# Копируем остальной исходный код (включая prisma/schema.prisma)
COPY . .

# Получаем DATABASE_URL как аргумент сборки
ARG DATABASE_URL

# Генерация Prisma Client: ОБЯЗАТЕЛЬНА для создания кода, который использует приложение.
RUN DATABASE_URL=$DATABASE_URL npx prisma generate

# Собираем NestJS (компилируем TypeScript в JavaScript)
RUN npm run build

# --- STAGE 2: PRODUCTION (Финальный образ для запуска) ---
FROM node:22-slim

RUN apt-get update && apt-get install -y **procps** \
    && rm -rf /var/lib/apt/lists/*

# Устанавливаем рабочую директорию
WORKDIR /app

# УСТАНОВКА OPENSSL: Необходима для работы сгенерированного Prisma Client.
RUN apt-get update && apt-get install -y openssl

# Копируем только необходимые файлы из стадии builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# Копируем только СГЕНЕРИРОВАННЫЙ КЛИЕНТ. Файлы схемы и миграций не нужны.
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma 

# Открываем доступ к 3000 порту
EXPOSE 3000
EXPOSE 9229