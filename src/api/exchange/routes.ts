import { Router } from 'express';
const router = Router();
import { fetchExchangeRate } from './controller';

import { joiValidateMiddleware } from '@middlewares/exchangeValidate';

router.get(
    '/',
    joiValidateMiddleware('exchangeRequest', 'query'),
    fetchExchangeRate,
);

export default router;
