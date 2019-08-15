/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
// tslint:disable:no-console
// tslint:disable:no-object-literal-type-assertion

import { expect, test } from '@oclif/test';

describe('dialog:verify', async () => {
    test
        .stdout()
        .stderr()
        .command(["dialog:verify", "test/**/badFile.dialog"])
        .it('verify badFile.dialog', ctx => {
            expect(ctx.stderr)
                .to.contain("Error: 1 found.");
        });

    test
        .stdout()
        .stderr()
        .command(["dialog:verify", "test/**/*.dialog"])
        .it('verify all', ctx => {
            expect(ctx.stderr)
                .to.contain("Warning: 6 found");
            expect(ctx.stderr)
                .to.contain("Error: 17 found.");
        });
});

