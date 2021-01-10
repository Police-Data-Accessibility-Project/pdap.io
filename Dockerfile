FROM node:13.12.0-alpine AS build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
# ENV NODE_ENV=production

COPY package.json .

RUN apk update && apk add automake nasm autoconf libtool pkgconfig libpng libpng-dev g++ alpine-sdk

##Testing Mozjpeg code here to fix compile timeout on DO
RUN npm install mozjpeg

RUN npm install
RUN npm run build

FROM nginx:mainline-alpine

COPY --from=build /app/public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html

# Add bash
RUN apk add --no-cache bash

CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]

# FROM nginx:alpine
# COPY --from=build --chown=nginx:nginx /app/public /usr/share/nginx/html