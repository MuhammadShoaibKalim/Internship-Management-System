import { blue, green, yellow, red, cyan, magenta } from 'colorette';

const logger = {
    info: (msg) => console.log(`${cyan('ℹ')} ${blue('INFO:')} ${msg}`),
    success: (msg) => console.log(`${green('✔')} ${green('SUCCESS:')} ${msg}`),
    warn: (msg) => console.log(`${yellow('⚠')} ${yellow('WARN:')} ${msg}`),
    error: (msg) => console.error(`${red('✖')} ${red('ERROR:')} ${msg}`),
    debug: (msg) => console.log(`${magenta('⚙')} ${magenta('DEBUG:')} ${msg}`),
    server: (msg) => console.log(`${green('⚡')} ${green('SERVER:')} ${msg}`)
};

export default logger;
