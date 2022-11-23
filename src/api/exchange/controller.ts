import { logger } from '@/utils/logger';
import { NextFunction, Request, Response } from 'express';
import ExchangeRatesService from './service';

export const fetchExchangeRate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { query, uuid = '' } = req;
        const { from_currency_code, to_currency_code, amount } =
            query as unknown as RateRequest;

        const exchangeApiResult =
            await ExchangeRatesService.fetchExchangeApiData(
                from_currency_code,
                to_currency_code,
            );
        const frankFurterApiResult =
            await ExchangeRatesService.fetchFrankFurtData(
                from_currency_code,
                to_currency_code,
            );

        logger.info(
            JSON.stringify({ exchangeApiResult, frankFurterApiResult }),
        );

        const fRate = frankFurterApiResult || 0;
        const eRate = exchangeApiResult || 0;

        let bestRate = Math.max(fRate, eRate);
        let provider_name = fRate > eRate ? 'frankfurter' : 'exchangeRateApi';

        if (+amount > 1000 && fRate) {
            bestRate = fRate;
            provider_name = 'frankfurter';
        }
        const amountConverted = +amount * bestRate;

        res.send({
            exchangeApiResult,
            frankFurterApiResult,
            exchange_rate: bestRate,
            provider_name: provider_name,
            id: uuid,
            amount: amountConverted,
        });
    } catch (error) {
        next(error);
    }
};
