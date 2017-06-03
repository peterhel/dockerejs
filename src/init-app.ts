import * as fs from 'fs';
import * as program from 'commander';
import { Args } from './args';

export function getArgs(): Args {
    program
        .arguments('<hostname>')
        .arguments('<templateFile>')
        .arguments('<outFile>')
        .option('-c, --cmd [value]', 'Command to execute when template has been updated.')
        .parse(process.argv);

    if (process.argv.length < 5) {
        program.outputHelp();
        process.exit(1);
    }

    const [hostname, templateFile, outFile] = program.args;

    return new Args(hostname, templateFile, outFile, program.cmd);
}

export function getConfig() {
    let config;

    const defaultConfig = {
        host: '127.0.0.1',
        port: 2375
    }

    if (!fs.existsSync('/etc/dockerejs/config.json')) {
        console.error(`No config file found at '/etc/dockerejs/config.json'`);
        console.error(`Defaulting to the following:`);
        console.error(JSON.stringify(defaultConfig, null, 2));
        config = defaultConfig;
    } else {
        console.log('Using /etc/dockerejs/config.json')
        const configContent = fs.readFileSync('/etc/dockerejs/config.json', 'utf8');
        config = JSON.parse(configContent);
    }

    return config;
}
