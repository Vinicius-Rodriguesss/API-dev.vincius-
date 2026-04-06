# syntax=docker/dockerfile:1

FROM node:22-alpine AS deps

WORKDIR /app

COPY package*.json ./
RUN npm ci

FROM deps AS builder

WORKDIR /app

COPY . .
RUN npm run build

FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci

COPY --from=builder /app/dist ./dist

EXPOSE 5001

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:5001/health || exit 1

CMD ["npm", "run", "start"]
