/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
// tslint:disable:no-console
// tslint:disable:no-object-literal-type-assertion

import { expect, test } from '@oclif/test';

describe('dialog', () => {
    test
        .stdout()
        .command(["dialog"])
        .it('verify dialog help', ctx => {
            expect(ctx.stdout)
                .to.contain("The dialog commands allow you to work with dialog schema and dialog files.");
        });
});

