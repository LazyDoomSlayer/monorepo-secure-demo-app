FROM node:22-alpine

RUN npm install -g pnpm @nestjs/cli

WORKDIR /app/apps/backend

COPY apps/backend/package.json apps/backend/pnpm-lock.yaml apps/backend/tsconfig.json apps/backend/tsconfig.build.json  ./

RUN pnpm install --prod

COPY apps/backend .

RUN nest build

EXPOSE 3000

CMD ["node", "dist/main.js"]