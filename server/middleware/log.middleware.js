import morgan from 'morgan';
import chalk from 'chalk';

// ── Tokens ────────────────────────────────────────────────────────────────────

morgan.token('datetime', () => {
    const now = new Date();
    return chalk.gray(`[${now.toISOString().replace('T', ' ').substring(0, 19)}]`);
});

morgan.token('statusLabel', (req, res) => {
    const status = res.statusCode;
    if (status >= 500) return chalk.bold.red('✖ ERROR:');
    if (status >= 400) return chalk.bold.yellow('⚠ WARN:');
    if (status === 304) return chalk.bold.green('✔ SUCCESS:');
    if (status >= 300) return chalk.bold.cyan('ℹ INFO:');
    return chalk.bold.green('✔ SUCCESS:');
});

morgan.token('statusTag', (req, res) => {
    const status = res.statusCode;
    if (status >= 500) return chalk.red('[CRITICAL]');
    if (status >= 400) return chalk.yellow('[CLIENT ERROR]');
    if (status === 304) return chalk.green('[CLEAN-CACHE]');
    if (status >= 300) return chalk.cyan('[REDIRECT]');
    return chalk.green('[OK]');
});

morgan.token('methodColor', (req) => {
    const method = req.method;
    switch (method) {
        case 'GET': return chalk.green(method);
        case 'POST': return chalk.blue(method);
        case 'PUT': return chalk.yellow(method);
        case 'PATCH': return chalk.magenta(method);
        case 'DELETE': return chalk.red(method);
        case 'OPTIONS': return chalk.gray(method);
        default: return chalk.white(method);
    }
});

morgan.token('statusColor', (req, res) => {
    const status = res.statusCode;
    if (status >= 500) return chalk.bold.red(status);
    if (status >= 400) return chalk.bold.yellow(status);
    if (status >= 300) return chalk.bold.cyan(status);
    return chalk.bold.green(status);
});

morgan.token('urlColor', (req) => chalk.magenta(req.originalUrl));

morgan.token('responseTimeColor', (req, res) => {
    const time = morgan['response-time'](req, res, 0);
    const ms = parseFloat(time) || 0;
    const formatted = `${ms}ms`;
    if (ms > 1000) return chalk.red(formatted);
    if (ms > 500) return chalk.yellow(formatted);
    return chalk.white(formatted);
});

// ── Format ───────────────────────────────────────────────────────────────────

const logFormat = ':datetime :statusLabel :statusTag :methodColor :urlColor :statusColor - :response-time ms';

// ── Export ───────────────────────────────────────────────────────────────────

const requestLogger = morgan(logFormat);

export default requestLogger;
