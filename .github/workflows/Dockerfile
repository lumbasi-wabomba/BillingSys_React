# Build stage
FROM node:24 AS build
WORKDIR /app

ARG DOCKER_ENV_FILE=""
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN if [ -n "$DOCKER_ENV_FILE" ]; then printf '%s\n' "$DOCKER_ENV_FILE" > /app/docker.env; else : > /app/docker.env; fi
RUN npm run build

# Production stage
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/docker.env /app/docker.env
EXPOSE 80
CMD ["/bin/sh", "-c", "if [ -f /app/docker.env ]; then set -a; . /app/docker.env; set +a; fi; nginx -g 'daemon off;'"]
