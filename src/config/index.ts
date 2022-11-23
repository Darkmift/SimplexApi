import { config } from 'dotenv';
import { currencyInitials as CI } from './currencyInitials';

config({
    path: `.env.${process.env.NODE_ENV || 'development'}.local`,
});

type ConfigVars = {
    [key: string]: string;
};
export const currencyInitials = CI;
export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
    NODE_ENV,
    PORT,
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_DATABASE,
    SECRET_KEY,
    LOG_FORMAT,
    LOG_DIR,
    ORIGIN,
} = process.env as ConfigVars;
