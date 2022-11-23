import { Router, Request, Response } from 'express';

import exchangeRatesRoutes from '@/api/exchange/routes';

const router = Router();

router.get('/', (req, res) => {
    res.send('api is running');
});

router.get('/health', async (req: Request, res: Response) => {
    const data: any = {
        uptime: process.uptime(),
        message: 'Ok',
        date: new Date(),
        sqlConnection: null,
    };
    res.status(200).send(data);
});

router.use('/quote', exchangeRatesRoutes);

export default router;
