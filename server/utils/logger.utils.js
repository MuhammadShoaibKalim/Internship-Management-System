import { blue, green, yellow, red, cyan, magenta, bold } from 'colorette';

const logger = {
    info: (msg) => console.log(`${bold(cyan('ℹ'))} ${bold(blue('INFO:'))} ${msg}`),
    success: (msg) => console.log(`${bold(green('✔'))} ${bold(green('SUCCESS:'))} ${msg}`),
    warn: (msg) => console.log(`${bold(yellow('⚠'))} ${bold(yellow('WARN:'))} ${yellow(msg)}`),
    error: (msg) => console.error(`${bold(red('✖'))} ${bold(red('ERROR:'))} ${bold(red(msg))}`),
    debug: (msg) => console.log(`${bold(magenta('⚙'))} ${bold(magenta('DEBUG:'))} ${msg}`),
    server: (msg) => console.log(`${bold(green('⚡'))} ${bold(green('SERVER:'))} ${bold(green(msg))}`)
};

export default logger;
