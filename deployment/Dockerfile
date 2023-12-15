FROM node:16-alpine AS build

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY .. .
RUN npm run build --prod
RUN ls -alt

FROM nginx:1.17.1-alpine

COPY --from=build /usr/src/app/dist/ /usr/share/nginx/html
COPY --from=build /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/ssl /etc/nginx/ssl

EXPOSE  80 443
