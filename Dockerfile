FROM node:alpine
WORKDIR /usr/app/src
COPY package*.json ./

RUN npm i --production

COPY src .
EXPOSE 8888

CMD ["npm", "start"]