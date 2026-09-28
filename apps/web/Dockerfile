FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json turbo.json package-lock.json* ./
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

RUN npm install
RUN npm run build --workspace=@studyead/shared-types
RUN npm run build --workspace=@studyead/validators
RUN npm run build --workspace=@studyead/web

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/apps/web/.output ./

EXPOSE 3000

CMD ["node", "server/index.mjs"]
