FROM node:24 AS build 
WORKDIR /app


COPY package*.json ./
RUN npm ci --omit=dev
COPY . .


FROM node:24-slim AS production
WORKDIR /app
COPY --from=build /app ./
EXPOSE 3001
ENV NODE_ENV=production
CMD ["node", "dbServer.js"]
