import logger from '../utils/logger.utils.js';

const requestLogger = (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const { method, originalUrl } = req;
        const { statusCode } = res;
        const logMsg = `${method} ${originalUrl} ${statusCode} - ${duration}ms`;

        if (statusCode >= 500) {
            logger.error(`[CRITICAL] ${method} ${originalUrl} ${statusCode} - ${duration}ms`);
        } else if (statusCode >= 400) {
            logger.warn(`[CLIENT ERROR] ${method} ${originalUrl} ${statusCode} - ${duration}ms`);
        } else if (statusCode >= 300) {
            logger.info(`[REDIRECT] ${method} ${originalUrl} ${statusCode} - ${duration}ms`);
        } else {
            logger.success(`[OK] ${method} ${originalUrl} ${statusCode} - ${duration}ms`);
        }
    });

    next();
};

export default requestLogger;
