FROM node:14-alpine3.12

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma migrate

RUN npx prisma generate

EXPOSE 5000

CMD [ "npm", "run", "start" ]