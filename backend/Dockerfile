
# Rebuild the source code only when needed
FROM node:21-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install -g pnpm && pnpm install --frozen-lockfile
RUN pnpm build


# Production image, copy all the files and run next
FROM node:21-alpine AS runner
WORKDIR /app


# Install knex globally
RUN npm install knex -g

ENV NODE_ENV=production

# Copy necessary files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/migrations ./migrations
# COPY --from=builder /app/scripts/ecosystem.config.js ./scripts/ecosystem.config.js
COPY --from=builder /app/scripts  ./scripts

EXPOSE 3030 3031

CMD ["./scripts/start.sh"]
