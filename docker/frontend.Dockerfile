FROM node:20-alpine AS build

WORKDIR /app/frontend

ARG VITE_API_BASE_URL
ARG VITE_API_ASSET_URL
ARG VITE_SITE_URL

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_API_ASSET_URL=$VITE_API_ASSET_URL
ENV VITE_SITE_URL=$VITE_SITE_URL

COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install

COPY frontend /app/frontend
RUN npm run build

FROM nginx:1.27-alpine

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
