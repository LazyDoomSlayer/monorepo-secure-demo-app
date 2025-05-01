FROM node:18-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

RUN pnpm install --frozen-lockfile

COPY . .


FROM builder AS frontend
RUN pnpm turbo run build-only --filter=frontend...

FROM nginx:alpine AS nfc-frontend
COPY --from=frontend-build /app/apps/frontend/dist /usr/share/nginx/html
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
