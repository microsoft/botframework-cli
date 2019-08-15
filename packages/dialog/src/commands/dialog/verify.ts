import { Command, flags } from '@microsoft/bf-cli-command';
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

    static flags: flags.Input<any> = {
        help: flags.help({ char: 'h' }),
        verbose: flags.boolean({ description: 'Show verbose output', default: false }),
    }

    private currentFile: string;
    private files = 0;
    private errors = 0;
    private warnings = 0;

    async run() {
        const { argv, flags } = this.parse(DialogVerify);
        await this.execute(argv, flags.verbose);
    }

    async execute(dialogFiles: string[], verbose?: boolean): Promise<void> {
        const schema = new SchemaTracker();
        const tracker = new DialogTracker(schema);

        await tracker.addDialogFiles(dialogFiles);
        let hasError = false;

        if (tracker.dialogs.length == 0) {
            this.error('No  dialogs found!');
        } else {
            for (let dialog of tracker.dialogs) {
                this.files++;
                this.currentFile = dialog.file;
                if (dialog.errors.length == 0) {
                    if (verbose) {
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

            if (verbose) {
                for (let [type, definitions] of tracker.typeToDef) {
                    this.consoleMsg(`Instances of ${type}`);
                    for (let def of definitions) {
                        this.consoleMsg(`  ${def.locatorString()}`);
                    }
                }
            }

            this.log(`${this.files} files processed.`);
            this.error(`${this.warnings} found.`);
            if (this.errors > 0) {
                this.error(`Error: ${this.errors} found.`);
            }
        }
    }

    consoleMsg(msg: string): void {
        this.log(chalk.default(msg));
    }

    consoleLog(msg: string): void {
        this.log(chalk.default.gray(msg));
    }

    consoleWarn(msg: string): void {
        this.warnings++;
        this.error(chalk.default.yellowBright(`${this.currentFile}: warning: ${msg}`));
    }

    consoleError(msg: string): void {
        this.errors++;
        this.error(chalk.default.redBright(`${this.currentFile}: error: ${msg}`));
    }
}
