/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
// tslint:disable:no-console
// tslint:disable:no-object-literal-type-assertion

import {expect, test} from '@oclif/test'
import * as path from 'path'

// Debugging these is a pain.
// What helps is to comment out stdout/stderr and use a debugging statement where you want a breakpoint
describe('dialog:verify', () => {
    test
        .stdout()
        .stderr()
        .command(["dialog:verify", `${path.join(__dirname, './examples/badExamples/badFile.dialog')}`])
        .it('verify badFile.dialog', ctx => {
            expect(ctx.stderr)
                .to.contain("Errors: 1 found.")
        })

    test
        .stdout()
        .stderr()
        .command(["dialog:verify", `${path.join(__dirname, './examples/root/*.dialog')}`, '--verbose'])
        .it('verify all', ctx => {
            expect(ctx.stderr.match(/DLG001/)!.length == 7, 'Wrong number of schema errors')
            expect(ctx.stderr.match(/DLG002/)!.length == 3, 'Wrong number of multiple definitions')
            expect(ctx.stderr.match(/DLG003/)!.length == 1, 'Wrong number of mising definitions')
            expect(ctx.stderr.match(/DLG004/)!.length == 1, 'Wrong number of type mismatches')
            expect(ctx.stderr.match(/DLG005/)!.length == 6, 'Wrong number of unused ids')
            expect(ctx.stdout).to.contain('4 files')
            expect(ctx.stderr)
                .to.contain('Warnings: 2', 'Wrong number of warnings')
                .to.contain('Errors: 13', 'Wrong number of errors')
        })
})
