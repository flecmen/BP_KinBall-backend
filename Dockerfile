FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5000

CMD npx prisma migrate deploy && npx prisma generate && npx prisma db seed && node dist/src/app.js
