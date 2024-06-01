FROM node:21-alpine

WORKDIR /app

COPY pnpm-lock.yaml package.json ./

RUN npm install -g pnpm

RUN pnpm i

COPY . .

EXPOSE 5000 5500 5100

RUN pnpm build

RUN npm install -g pm2

CMD ["pm2-runtime", "start", "scripts/ecosystem.config.js"]