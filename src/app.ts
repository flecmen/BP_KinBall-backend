import express, { Express, Request, Response } from 'express';
import Logger from './utils/logger';
import router from './router';
import swaggerDocs from './utils/swagger';
import cors from 'cors'
import { apiConfig } from './config';
import env from './utils/env';
import { scheduleAllTasks } from './scheduler';

const app: Express = express();

app.use(express.json());

//Security
app.use(cors({ origin: apiConfig.frontRootUrl }));

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