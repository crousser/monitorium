# Stage 1: билд фронтенда
FROM node:20-alpine AS builder

WORKDIR /app

COPY packages/types ./packages/types
COPY apps/frontend/package*.json ./
COPY apps/frontend/. .
RUN npm install
RUN npm run build

# Stage 2: nginx для продакшена
FROM nginx:stable-alpine

# Копируем билд
COPY --from=builder /app/dist /usr/share/nginx/html

# Кастомный nginx конфиг (SPA + готовность к API)
COPY apps/frontend/nginx.template /etc/nginx/templates/default.conf.template

EXPOSE 80

CMD ["/bin/sh", "-c", "envsubst '$VITE_BACKEND_HOST' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
