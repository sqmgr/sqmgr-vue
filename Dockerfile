FROM node:22 AS build
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . /app/
ARG api_url
ARG version
ENV VUE_APP_VERSION=$version
RUN if [ -n "$api_url" ]; then export VUE_APP_API_URL=$api_url; fi; \
    npm run build

FROM nginx:latest
COPY --from=build /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
