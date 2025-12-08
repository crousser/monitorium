# Stage 1: build frontend
FROM node:20-alpine AS builder

WORKDIR /app

# 1. Копируем только корень + нужные workspace'ы
COPY package.json package-lock.json ./
COPY packages/types ./packages/types
COPY apps/frontend ./apps/frontend

# 2. Устанавливаем зависимости (workspace-aware)
RUN npm install

# 3. Собираем @monorepo/types
RUN npm run build --workspace=@monorepo/types

# 4. Собираем frontend
WORKDIR /app/apps/frontend
RUN npm run build

# Stage 2: nginx server
FROM nginx:stable-alpine

COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

COPY apps/frontend/nginx.template /etc/nginx/templates/default.conf.template

EXPOSE 80

CMD ["/bin/sh", "-c", \
    "envsubst '$VITE_BACKEND_HOST' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && \
    exec nginx -g 'daemon off;'"]
