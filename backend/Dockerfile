# syntax=docker/dockerfile:1
FROM node:18-alpine AS base
WORKDIR /app

# Install build tools for native dependencies
RUN apk add --no-cache python3 make g++ libstdc++

# Copy backend package definitions and install production dependencies
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci --omit=dev

# Final runtime image
FROM node:18-alpine
WORKDIR /app/server
RUN apk add --no-cache libstdc++

COPY --from=base /app/server/node_modules /app/server/node_modules
COPY server /app/server

ENV NODE_ENV=production
ENV PORT=4674
EXPOSE 4674

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD wget -qO- http://localhost:4674/test || exit 1

CMD ["npm", "run", "start"]
