/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
// tslint:disable:no-console
// tslint:disable:no-object-literal-type-assertion

import { expect, test } from '@oclif/test'
import * as path from 'path'

describe('dialog:verify', () => {
    test
        .stdout()
        .stderr()
        .command(["dialog:verify", `${path.join(__dirname, './**/badFile.dialog')}`])
        .it('verify badFile.dialog', ctx => {
            expect(ctx.stderr)
                .to.contain("Errors: 1 found.")
        })

    test
        .stdout()
        .stderr()
        .command(["dialog:verify", `${path.join(__dirname, './examples/*.dialog')}`, `!${path.join(__dirname, './examples/badFile.dialog')}`])
        .it('verify all', ctx => {
            expect(ctx.stderr)
                .to.contain("Errors: 8 found.") 
        })
})

