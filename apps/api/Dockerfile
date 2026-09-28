FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache openssl libc6-compat

# Copy package manifests
COPY package.json turbo.json package-lock.json* ./
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

# Install dependencies and build
RUN npm install
RUN npm run build --workspace=@studyead/shared-types
RUN npm run build --workspace=@studyead/validators
RUN npx prisma generate --schema=apps/api/src/database/prisma/schema.prisma
RUN npm run build --workspace=@studyead/api

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache openssl libc6-compat

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/src/database ./apps/api/src/database

EXPOSE 3001

CMD ["node", "apps/api/dist/main.js"]
