FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma migrate deploy

RUN npx prisma generate

EXPOSE 5000
