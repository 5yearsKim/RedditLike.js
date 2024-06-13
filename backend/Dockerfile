
# Rebuild the source code only when needed
FROM node:21-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install -g pnpm && pnpm install --frozen-lockfile
RUN pnpm build


# Production image, copy all the files and run next
FROM node:21-alpine AS runner
WORKDIR /app


# Install pm2 globally
RUN npm install -g pm2
RUN npm install knex -g

ENV NODE_ENV production

# Copy necessary files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/scripts/ecosystem.config.js ./scripts/ecosystem.config.js


EXPOSE 3030 3031


# RUN chmod +x ./scripts/start.sh

# CMD ["./scripts/start.sh"]

CMD [ "sh", "-c", "echo 'running migrations..'; knex --knexfile ./dist/knexfile.js migrate:latest; echo 'running pm2..'; pm2-runtime start scripts/ecosystem.config.js" ]

