import { EventEmitter } from 'events';
import * as ejs from 'ejs';
import * as fs from 'fs';

export class Handler {
    template: string;
    events: EventEmitter

    constructor(hostname: string, outFile: string, templateFile: string, events: EventEmitter) {
        this.template = fs.readFileSync(templateFile, 'utf8');
        this.events = events;

        events.on('container:start', data => {
            let file;
            if (data.Config.Labels.hostname === hostname) {
                file = outFile;
            }
            else if ('*' === hostname) {
                file = outFile.replace(/\{(.+?)\}/, (match, x) => {
                    return data.Config.Labels[x];                    
                })
            } else {
                return;
            }

            try {
                console.log(JSON.stringify(data, null, 2))
                const content = this.render(data);
                this.write(file, content);
            } catch (e) {
                console.error(e);
            }
        })

    }

    render(data: object): string {
        return ejs.render(this.template, data);
    }

    write(outFile: string, content: string) {
        fs.writeFileSync(outFile, content, 'utf8');
        console.log(`${outFile} generated.`);
        this.events.emit('run-command');
    }
}
