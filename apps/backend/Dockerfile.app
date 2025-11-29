# --- STAGE 1: BUILDER (Сборка и Генерация) ---
FROM node:22-slim AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# УСТАНОВКА OPENSSL: Необходима для корректной работы Prisma Client при генерации и миграции.
RUN apt-get update && apt-get install -y openssl

# Копируем только файлы для установки зависимостей, чтобы кэшировать npm install
COPY package.json package-lock.json ./

# Устанавливаем зависимости, пропуская скрипт prepare (husky), который не нужен в Docker
RUN npm install --ignore-scripts

COPY prisma ./prisma

# Копируем остальной исходный код
# Мы делаем это здесь, чтобы не запускать npm install снова при изменении кода
COPY . .

# Получаем DATABASE_URL как аргумент сборки
ARG DATABASE_URL

# Генерация Prisma Client: Передаем DATABASE_URL, чтобы избежать ошибки Missing required environment variable.
RUN DATABASE_URL=$DATABASE_URL npx prisma generate

# Собираем NestJS
RUN npm run build

# --- STAGE 2: PRODUCTION (Финальный образ для запуска) ---
FROM node:22-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# УСТАНОВКА OPENSSL: Необходима для корректной работы Prisma Client при выполнении команд (migrate deploy и запуске).
RUN apt-get update && apt-get install -y openssl

# Копируем только необходимые файлы из стадии builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

#EXPOSE 3000

# Команда запуска приложения (используется как CMD по умолчанию, но может быть переопределена в docker-compose)
CMD ["node", "dist/main"]