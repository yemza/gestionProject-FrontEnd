FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install --force
COPY .. .
RUN npm build

# Stage 2: Serve the angular app with Nginx
FROM nginx:alpine
COPY --from=build-stage /app/dist/gestion-project /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
#COPY ./ssl /etc/nginx/ssl
