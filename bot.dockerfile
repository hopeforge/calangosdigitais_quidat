FROM node
MAINTAINER quidat
COPY . /var/www
WORKDIR /var/www
RUN npm install
ENTRYPOINT node bot.js
