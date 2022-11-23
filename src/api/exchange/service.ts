import { logger } from '@/utils/logger';
import axios from 'axios';
import zlib from 'zlib';

const apiUrl = {
    exchangeApi: 'https://api.exchangerate-api.com/v4/latest/',
    frankfurter: 'https://api.frankfurter.app/latest?from=',
};

const ExchangeRatesService = {
    fetchFrankFurtData: async (
        from_currency_code: CurrencyName,
        to_currency_code: CurrencyName,
    ): Promise<number | null> => {
        try {
            const response = await axios.get(
                apiUrl.frankfurter + from_currency_code,
            );
            return response.data.rates[to_currency_code];
        } catch (error) {
            logger.error(error);
            return null;
        }
    },
    fetchExchangeApiData: async (
        from_currency_code: CurrencyName,
        to_currency_code: CurrencyName,
    ): Promise<number | null> => {
        try {
            const response = await axios.get(
                apiUrl.exchangeApi + from_currency_code,
                { responseType: 'arraybuffer', decompress: true },
            );

            const { error: gError, data: gData } = await new Promise<{
                data?: string;
                error?: Error;
            }>((resolve, reject) => {
                zlib.gunzip(response.data, function (error, result) {
                    if (error) {
                        logger.error(error);
                        reject({ error });
                    }
                    resolve({ data: result.toString() });
                });
            });

            if (gError || !gData) {
                logger.error(gError);
                return null;
            }

            const data = JSON.parse(gData);
            return data.rates[to_currency_code];
        } catch (error) {
            logger.error(error);
            return null;
        }
    },
};

export default ExchangeRatesService;
