import { Command, flags } from '@oclif/command';
import { Definition, DialogTracker, SchemaTracker } from '../../library/dialogTracker';
// import * as process from 'process';

export default class DialogVerify extends Command {
    static flags = {
        help: flags.help({ char: 'h' }),
        write: flags.string({ char: 'w', description: 'Write dialog lg information into .lg files where <write> is an .lg file with no locale.' }),
    }

    async run() {
        const { argv, flags } = this.parse(DialogVerify)


        const schema = new SchemaTracker();
        const tracker = new DialogTracker(schema);

        await tracker.addDialogFiles(argv);

        if (tracker.dialogs.length == 0) {
            this._help();
        } else {
            for (let dialog of tracker.dialogs) {
                if (dialog.errors.length == 0) {
                    this.log(`Processed ${dialog}`);
                } else {
                    this.error(`Errors processing ${dialog}`);
                    for (let error of dialog.errors) {
                        this.error(`  ${error.message}`);
                    }
                }
            }

            for (let defs of tracker.multipleDefinitions()) {
                let def = (<Definition[]>defs)[0];
                this.error(`Multiple definitions for ${def} ${def.usedByString()}`);
                for (let def of defs) {
                    this.error(`  ${def.pathString()}`);
                }
            }

            for (let def of tracker.missingDefinitions()) {
                this.error(`Missing definition for ${def} ${def.usedByString()}`);
            }

            for (let def of tracker.missingTypes) {
                this.error(`Missing $type for ${def}`);
            }

            for (let def of tracker.unusedIDs()) {
                this.warn(`Unused id ${def}`);
            }

            for (let [type, definitions] of tracker.typeToDef) {
                this.log(`Instances of ${type}`);
                for (let def of definitions) {
                    this.log(`  ${def.locatorString()}`);
                }
            }

            if (flags.write) {
                tracker.writeLG(flags.write, (msg) => this.log(msg));
            }
        }
    }

}

// interface IPackage {
//     version: string;
//     engines: { node: string };
// }

