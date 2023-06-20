# Kin-ball app - Backend
This is the REST API for my Bachelor thesis project.  


### Tech-stack
- Node.js
- Express.js
- Postgres
- Prisma
- Typescript
- Jest (integration testing)

# How to install and run

## Install the dependencies
```bash

npm install
```

## Start the database in docker
```bash

npm run dev
```

## Initialize the databse
```bash

npx prisma migrate dev
npx prisma db seed
```

## Start the server
```bash
npm run start
```

