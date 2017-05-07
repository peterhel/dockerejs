import * as http from 'http';
import * as readline from 'readline';
import * as querystring from 'querystring';
import * as init from './init-app'
import { EventEmitter } from 'events';
import { Spawner } from './spawner';
import { Handler } from './handler';
import { spawn } from 'child_process';

const args = init.getArgs()
const config = init.getConfig();
const events = new EventEmitter();

if (args.command) {
    new Spawner(args.command, events);
}

new Handler(args.hostname, args.outFile, args.templateFile, events);

async function inspect(containerId: string) {
    return await new Promise(resolve => {
        http.get({
            host: config.host,
            port: config.port,
            path: `/containers/${containerId}/json`
        }, response => {
            let content = '';

            response.on('data', chunk => {
                content += chunk;
            });

            response.on('end', () => {
                resolve(JSON.parse(content.toString()));
            })
        })
    })
}

const cmd = spawn('docker', ['-H', `${config.host}:${config.port}`, 'events', '--format', '{{json .}}']);
cmd.stderr.pipe(process.stderr);

const rl = readline.createInterface({
    input: cmd.stdout
});

rl.on('line', line => {
    (async () => {
        const data = JSON.parse(line);

        if (data.Type === 'container') {
            data.inspect = await inspect(data.id);
        }

        events.emit(`${data.Type}:${data.Action}`, data)
    })();;
});

cmd.on('close', (code) => {
    console.log(`docker events exited with code ${code}`);
});
