# Build stage
FROM node:24 AS build
WORKDIR /app

ARG DOCKER_ENV_FILE=""
COPY package.json package-lock.json* ./
RUN npm install
COPY backend/package.json backend/package-lock.json* ./backend/
RUN npm install --prefix backend --omit=dev
COPY . .
RUN if [ -n "$DOCKER_ENV_FILE" ]; then printf '%s\n' "$DOCKER_ENV_FILE" > /app/docker.env; else : > /app/docker.env; fi
RUN npm run build

# Production stage
FROM node:24-slim
WORKDIR /app
COPY --from=build /app ./
COPY --from=build /app/docker.env /app/docker.env
ENV HOST=0.0.0.0
EXPOSE 3000 3001
CMD ["/bin/sh", "-c", "if [ -f /app/docker.env ]; then set -a; . /app/docker.env; set +a; fi; npm start"]
