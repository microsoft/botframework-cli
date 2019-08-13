/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
// tslint:disable:no-console
// tslint:disable:no-object-literal-type-assertion

import { expect } from 'fancy-test';
import 'mocha';
import DialogVerify from '../../../src/commands/dialog/verify';
import * as dt from '../../../src/library/dialogTracker';

describe('Test schema verify', async () => {
    let schemas = new dt.SchemaTracker();
    let tracker = new dt.DialogTracker(schemas);

    before(async () => {
        tracker.root = process.cwd();
        await tracker.addDialogFiles(["examples/*.dialog"]);
    });

    it('bad', async () => {
        try {
            let result = await DialogVerify.run(["test/**/badFile.dialog"]);
            expect(false, 'should have errored');
        } catch(error) {
            expect(error.message, "1 found.")
        }
    });

    it('all', async () => {
        try {
            let result = await DialogVerify.run(["test/**/*.dialog"]);
            expect(false, 'should have errored');
        } catch(error) {
            expect(error.message, "16 found.")
        }
    });

});

