import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import { apiConfig } from './config';
import router from './router';
import { scheduleAllTasks } from './scheduler';
import env from './utils/env';
import Logger from './utils/logger';
import swaggerDocs from './utils/swagger';


const app: Express = express();

app.use(express.json());

//Security
app.use(cors({ origin: apiConfig.frontRootUrls }));

// Routery
app.use(router)

// Scheduled tasks
scheduleAllTasks();

const port = apiConfig.port;

if (env.requireEnv('NODE_ENV') !== 'test') {
    app.listen(port, () => {
        Logger.info(`Server is running at http://localhost:${port}`);
        const numberPort = parseInt(port as string)
        swaggerDocs(app, numberPort);
    });
}

export default app;