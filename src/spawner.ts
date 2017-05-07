import { spawn } from 'child_process';
import { EventEmitter } from 'events';

export class Spawner {
    command: string;

    constructor(command, eventEmitter: EventEmitter) {
        this.command = command;

        eventEmitter.on('run-command', () => {
            this.run(this.command);
        });
    }

    run(command: string) {
        try {
            const frags = command.split(' ');
            const exec = frags.splice(0, 1)[0];
            const args = frags;
            const cmd = spawn(exec, args);

            cmd.stdout.pipe(process.stdout);
            cmd.stderr.pipe(process.stderr);

            cmd.on('close', (code) => {
                console.log(`${command} exited with code ${code}`);
            });
        } catch (e) {
            console.error(e);
        }
    }
}