import { logger } from '@/utils/logger';
import { Request, Response, NextFunction } from 'express';
import Joi from 'Joi';
import { currencyInitials } from '@config';

const schemas: { [key: string]: Joi.ObjectSchema } = {
    exchangeRequest: Joi.object({
        from_currency_code: Joi.string()
            .valid(...currencyInitials)
            .required()
            .messages({
                'string.valid': `"a" must be of ${currencyInitials.join(
                    ' | ',
                )}`,
            }),
        amount: Joi.string().required(),
        to_currency_code: Joi.string()
            .valid(...currencyInitials)
            .required()
            .messages({
                'string.valid': `"a" must be of ${currencyInitials.join(
                    ' | ',
                )}`,
            }),
    }),
};

export const joiValidateMiddleware = (
    schemaName: string,
    bodyType: 'body' | 'query',
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error /*, value*/ } = schemas[schemaName].validate(
            req[bodyType],
        );
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(', ');
            logger.error(message);
            return res.status(400).send({ error: message });
        }
        next();
    };
};
