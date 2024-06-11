# FROM node:21-alpine

# WORKDIR /app

# COPY pnpm-lock.yaml package.json ./

# RUN npm install -g pnpm

# RUN pnpm i

# COPY . .

# EXPOSE 3030 3031

# RUN pnpm build

# RUN npm install -g pm2

# CMD ["pm2-runtime", "start", "scripts/ecosystem.config.js"]



# Rebuild the source code only when needed
FROM node:21-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install -g pnpm && pnpm install --frozen-lockfile
RUN pnpm build


# Production image, copy all the files and run next
FROM node:21-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/scripts/ecosystem.config.js ./scripts/ecosystem.config.js


EXPOSE 3030 3031

# Install pm2 globally
RUN npm install -g pm2

CMD ["pm2-runtime", "start", "scripts/ecosystem.config.js"]
