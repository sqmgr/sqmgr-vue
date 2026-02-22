FROM node:22 AS build
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . /app/
ARG api_url
ARG version
RUN if [ -n "$api_url" ]; then export VITE_API_URL=$api_url; fi; \
    APP_VERSION=$version npm run build

FROM node:22 AS prerender
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium && rm -rf /var/lib/apt/lists/*
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
WORKDIR /app
COPY --from=build /app /app
RUN npm run prerender

FROM nginx:latest
COPY --from=prerender /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
