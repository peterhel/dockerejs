export class Args {
    hostname: string;
    templateFile: string;
    outFile: string;
    command: string;

    constructor(hostname, templateFile, outFile, command) {
        this.hostname = hostname;
        this.templateFile = templateFile;
        this.outFile = outFile;
        this.command = command;
    }
}