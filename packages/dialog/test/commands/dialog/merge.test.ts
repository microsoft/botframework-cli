/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
// tslint:disable:no-console
// tslint:disable:no-object-literal-type-assertion

import { expect } from '@oclif/test';
import * as fs from 'fs-extra';
import glob from 'globby';
import 'mocha';
import * as os from 'os';
import * as ppath from 'path';
import DialogMerge from '../../../src/commands/dialog/merge';
import * as dt from '../../../src/library/dialogTracker';

// TODO(chrande): these aren't working because they bring in a bunch of dotnet dependency stuff
describe.skip('Test schema merge', async () => {
    let schemas = new dt.SchemaTracker();
    let tracker = new dt.DialogTracker(schemas);

    before(async () => {
        // If you want to regenerate the oracle *.schema files, run schemas/makeschemas.cmd
        let tempDir = ppath.join(os.tmpdir(), "test.out");
        // console.log(`Test dir ${tempDir}`);

        await fs.remove(tempDir);
        await fs.mkdirp(tempDir);
        
        for (let file of await glob(["test/commands/dialog/**/*.schema", "test/commands/dialog/**/*.lg", "test/commands/dialog/**/*.dialog", "test/commands/dialog/**/*.cmd", "test/commands/dialog/projects/*", "test/commands/dialog/packages/**"])) {
            let target = ppath.join(tempDir, file.substring(file.indexOf("/") + 1).replace("commands/dialog", ""));
            await fs.copy(file, target);
        }
        process.chdir(tempDir);

        await fs.writeJSON("package.json", {
            dependencies: {
                "Newtonsoft.Json": "^13.0.2"
            }
        });
        await fs.mkdirp("node_modules");
        await fs.move("packages/Newtonsoft.Json", "node_modules/Newtonsoft.Json");

        await fs.remove("examples/app.schema");

        await DialogMerge.run(["-b", "4.Future", "-o", "examples/app.schema", "schemas/*.schema"]);
        await DialogMerge.run(["-b", "4.Future", "-o", "examples/promptOnly.schema", "schemas/prompt.schema"]);
        await DialogMerge.run(["-b", "4.Future", "-o", "examples/packages.schema", "package.json", "projects/*"]);

        tracker.root = process.cwd();
        await tracker.addDialogFiles(["examples/*.dialog"]);
    });

    xit('packages', async () => {
        let json = await fs.readJSON("examples/packages.schema");
        expect(json.definitions.packages, "Failed reading packages.config");
        expect(json.definitions.CSProj, "Failed reading CSProj");
        expect(json.definitions.node, "Failed reading package.json");
    });

    it('index all', () => expect(tracker.dialogs.length).equal(8));

    it('errors', () => expect(tracker.dialogs.filter((f) => f.errors.length > 0).length).equal(3));

    it('definitions', () => expect(size(tracker.allDefinitions())).equal(21));

    it('missing', () => expect(size(tracker.missingDefinitions())).equal(2));

    it('multiple', () => expect(size(tracker.multipleDefinitions())).equal(1));

    it(`types`, () => expect(tracker.schema.typeToType.size).equal(5));

    it('clone', async () => {
        let foo = tracker.cloneDialog("foo");
        expect(foo, "Can't find dialog").to.equal(undefined);
        let original = tracker.findDialog("root");
        expect(original, "Can't find dialog").to.not.equal(undefined);
        let copy = tracker.cloneDialog("root");
        if (original && copy) {
            let len = original.body.recognizers.length;
            copy.body.recognizers.pop();
            expect(len === copy.body.recognizers.length + 1).is.true;
            await tracker.updateDialog(copy);
            let newDialog = tracker.findDialog("root");
            if (newDialog) {
                expect(copy, "Update should be object").is.equal(newDialog);
                expect(newDialog.save, "Saved should be true").is.true;
                verify(tracker);
            } else {
                expect.fail("Did not update");
            }
        } else {
            expect.fail("Can't clone");
        }
    });

    it('write', async () => {
        let savesBefore = size(tracker.dialogs.filter((c) => c.save));
        await tracker.writeDialogs("Dialogs");
        let savesAfter = size(tracker.dialogs.filter((c) => c.save));
        expect(savesAfter).equals(0);
        let saved = 0;
        for (let file of await glob("Dialogs/examples/*.dialog")) {
            let dialog = tracker.findDialogFile(file);
            expect(dialog, `${dialog} is not found as ${file}`).is.not.equal(undefined);
            ++saved;
        }
        expect(saved).equals(savesBefore);
    });

    it('remove', () => {
        for (let dialog of tracker.dialogs) {
            tracker.removeDialog(dialog);
            verifyRemoved(tracker, dialog);
        }
    });

    it('files', async () => {
        for (let file of await glob(["../test/examples/*", "../test/schemas/*"])) {
            let newFile = ppath.join(process.cwd(), file.substring("../test/".length));
            if (!await fs.pathExists(newFile)) {
                expect.fail(`${newFile} is missing`);
            }
            let contents = (await fs.readFile(file)).toString();
            let newContents = (await fs.readFile(newFile)).toString();
            expect(newContents === contents, `${newFile} has changed`).is.true;
        }
    });
});

function size<T>(iterable: Iterable<T>): number {
    let i = 0;
    let it = iterable[Symbol.iterator]();
    while (!it.next().done)++i;
    return i;
}

function verify(tracker: dt.DialogTracker) {
    for (let def of tracker.allDefinitions()) {
        checkDef(def, tracker);
    }
}

function checkDef(def: dt.Definition, tracker: dt.DialogTracker): void {
    if (def.id) {
        expect(findDefinition(tracker.idToDef.get(def.id), def), `${def} in idTo`).is.true;
    }
    if (def.type) {
        expect(findDefinition(tracker.typeToDef.get(def.type.name), def), `${def} in idType`).is.true;
    } else {
        expect(findDefinition(tracker.missingTypes, def), `${def} in missingTypes`).is.true;
    }
    for (let used of def.usedBy) {
        checkDef(used, tracker);
    }
}

function findDefinition(definitions: undefined | dt.Definition[], definition: dt.Definition): boolean {
    let ok = false;
    if (definitions) {
        ok = definitions.findIndex((d) => d.compare(definition) == 0) != -1;
    }
    return ok;
}

function verifyRemoved(tracker: dt.DialogTracker, dialog: dt.Dialog) {
    for (let def of tracker.allDefinitions()) {
        expect(def.dialog).not.equal(dialog);
        for (let used of def.usedBy) {
            expect(used.dialog).not.equal(dialog);
        }
    }
}


// describe('dialog:merge', () => {
//   test
//     .stdout()
//     .command(['dialog:merge'])
//     .it('runs hello', ctx => {
//       expect(ctx.stdout).to.contain('hello world')
//     })

//   test
//     .stdout()
//     .command(['dialog:merge', '--name', 'jeff'])
//     .it('runs hello --name jeff', ctx => {
//       expect(ctx.stdout).to.contain('hello jeff')
//     })
// })
