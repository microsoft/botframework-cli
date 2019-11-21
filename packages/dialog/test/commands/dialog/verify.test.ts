/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
// tslint:disable:no-console
// tslint:disable:no-object-literal-type-assertion

import { expect, test } from '@oclif/test';
import * as path from 'path'

describe('dialog:verify', () => {
    test
        .stdout()
        .stderr()
        .command(["dialog:verify", `${path.join(__dirname, './**/badFile.dialog')}`])
        .it('verify badFile.dialog', ctx => {
            expect(ctx.stderr)
                .to.contain("Error: 1 found.");
        });

    test
        .stdout()
        .stderr()
        .command(["dialog:verify", `${path.join(__dirname, './examples/*.dialog')}`])
        .it('verify all', ctx => {
            expect(ctx.stderr)
                .to.contain("Error: 17 found.");
        });
});

