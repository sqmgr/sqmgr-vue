FROM node:10 AS build
WORKDIR /app
COPY . /app
ARG api_url
ARG version
ENV VUE_APP_VERSION=$version
RUN if [ -n "$api_url" ]; then export VUE_APP_API_URL=$api_url; fi; \
    npm install \
    && npm run build

FROM nginx:latest
COPY --from=build /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
