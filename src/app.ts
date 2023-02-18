import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import Logger from './lib/logger';
import morganMiddleware from './config/morganMiddleware'
import swaggerUi from 'swagger-ui-express'
import swaggerJsDoc from 'swagger-jsdoc';

//uložení .env proměnných do process.env
dotenv.config();

// Swagger settings
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Kin-ball API",
            version: "1.0.0",
            description: "Dokumentace API webové aplikace Kin-Ball Institutu v Brně"
        },
        servers: [
            {
                url: "http://localhost:3000"
            }
        ],
    },
    apis: ["./routes/*.ts"]
}
const specs = swaggerJsDoc(options)

const app: Express = express();

// Swagger endpoint
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))

app.use(morganMiddleware) // Logger
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.use('/user', () => import('./routes/user-router'))


const port = process.env.PORT;
app.listen(port, () => {
    Logger.info(`Server is running at http://localhost:${port}`);
});