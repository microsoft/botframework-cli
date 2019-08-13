import { Command, flags } from '@oclif/command';
import * as chalk from 'chalk';
import { Definition, DialogTracker, SchemaTracker } from '../../library/dialogTracker';
// import * as process from 'process';

export default class DialogVerify extends Command {

    static args = [
        { name: 'glob1', required: true },
        { name: 'glob2', required: false },
        { name: 'glob3', required: false },
        { name: 'glob4', required: false },
        { name: 'glob5', required: false },
        { name: 'glob6', required: false },
        { name: 'glob7', required: false },
        { name: 'glob8', required: false },
        { name: 'glob9', required: false },
    ]

    static flags = {
        help: flags.help({ char: 'h' }),
        verbose: flags.boolean({ description: 'Show verbose output' }),
        write: flags.string({ char: 'w', description: 'Write dialog lg information into .lg files where <write> is an .lg file with no locale.' }),
    }

    private currentFile: string;
    private files = 0;
    private errors = 0;
    private warnings = 0;

    async run() {
        const { argv, flags } = this.parse(DialogVerify);
        await this.execute(argv, flags);
    }

    async execute(argv: string[], flags: any) {
        const schema = new SchemaTracker();
        const tracker = new DialogTracker(schema);

        await tracker.addDialogFiles(argv);
        let hasError = false;

        if (tracker.dialogs.length == 0) {
            this._help();
        } else {
            for (let dialog of tracker.dialogs) {
                this.files++;
                this.currentFile = dialog.file;
                if (dialog.errors.length == 0) {
                    if (flags.verbose) {
                        this.consoleLog(`${dialog}`);
                    }
                } else {
                    for (let error of dialog.errors) {
                        this.consoleError(`${error.message.trim()}`);
                    }
                }
            }

            for (let defs of tracker.multipleDefinitions()) {
                let def = (<Definition[]>defs)[0];
                this.consoleError(`Multiple definitions for ${def} ${def.usedByString()}`);
                for (let def of defs) {
                    this.consoleError(`  ${def.pathString()}`);
                }
                hasError = true;
            }

            for (let def of tracker.missingDefinitions()) {
                this.consoleError(`Missing definition for ${def} ${def.usedByString()}`);
                hasError = true;
            }

            for (let def of tracker.missingTypes) {
                this.consoleError(`Missing $type for ${def}`);
                hasError = true;
            }

            for (let def of tracker.unusedIDs()) {
                this.consoleWarn(`Unused id ${def}`);
            }

            if (flags.verbose) {
                for (let [type, definitions] of tracker.typeToDef) {
                    this.consoleMsg(`Instances of ${type}`);
                    for (let def of definitions) {
                        this.consoleMsg(`  ${def.locatorString()}`);
                    }
                }
            }

            if (flags.write) {
                tracker.writeLG(flags.write, (msg) => this.consoleLog(msg));
            }

            this.log(`${this.files} files processed.`);
            this.warn(`${this.warnings} found.`);
            if (this.errors > 0) {
                this.error(`${this.errors} found.`);
            }
            else {
                this.log(`${this.errors} found.`);
            }
        }
    }

    consoleMsg(msg: string): void {
        console.log(chalk.default(msg));
    }

    consoleLog(msg: string): void {
        console.log(chalk.default.gray(msg));
    }

    consoleWarn(msg: string): void {
        this.warnings++;
        console.warn(chalk.default.yellowBright(`${this.currentFile}: warning: ${msg}`));
    }

    consoleError(msg: string): void {
        this.errors++;
        console.error(chalk.default.redBright(`${this.currentFile}: error: ${msg}`));
    }
}


// interface IPackage {
//     version: string;
//     engines: { node: string };
// }

