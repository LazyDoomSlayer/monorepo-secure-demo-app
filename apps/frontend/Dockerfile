FROM node:22-alpine AS builder

WORKDIR /app/apps/frontend

RUN npm install -g pnpm

COPY apps/frontend/package.json apps/frontend/pnpm-lock.yaml ./

RUN pnpm install

COPY apps/frontend .

RUN pnpm run build

FROM nginx:alpine AS frontend
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
