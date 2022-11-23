import express, { Express, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { NODE_ENV, PORT, LOG_FORMAT } from '@config';
import validateEnv from './utils/validateEnv';
import { logger, stream } from '@utils/logger';
import { v4 as uuidv4 } from 'uuid';
import mainRouter from './main.router';

validateEnv();

dotenv.config();
const app: Express = express();
const port = PORT || 5000;

app.use(morgan(LOG_FORMAT, { stream }));

app.all('*', (req: Request, res: Response, next: NextFunction) => {
    req.uuid = uuidv4();
    next();
});

app.use('/api', mainRouter);

app.listen(port, () => {
    console.log(`⚡️[NODE_ENV]: ${NODE_ENV}`);
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);

    logger.info(`=================================`);
    logger.info(`======= ENV: ${NODE_ENV} =======`);
    logger.info(`🚀 [server]: Server is running at https://localhost:${port}`);
    logger.info(`=================================`);
});
