/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
// tslint:disable:no-console
// tslint:disable:no-object-literal-type-assertion

import { expect, test } from '@oclif/test';
import * as fs from 'fs-extra'
import 'mocha'
import * as ppath from 'path'
import * as integ from '../../../src/library/integration'
import * as assert from 'assert';

describe('dialog:generate', async () => {
    let schemaName = 'sandwich'
    let oldPath= 'D:/merge/sandiwch1'
    let newPath = 'D:/merge/sandiwch2'
    let mergedPath = 'D:/merge/sandwich3'
    let locale = 'en-us'
    let verbose


    beforeEach(async () => {
        await fs.remove(mergedPath)
    })

    it('Generation with override', async () => {
        try {
            await integ.integrateAssets(schemaName, oldPath, newPath, mergedPath, locale, verbose)
            let lg = await fs.readFile(ppath.join(mergedPath, 'en-us', 'sandwich-Bread.en-us.lg'))
            assert.ok(lg.toString().includes('What kind of bread?'), 'Did not override locale generated file')
            let dialog = await fs.readFile(ppath.join(mergedPath, 'sandwich-Bread-missing.dialog'))
            assert.ok(!dialog.toString().includes('priority'), 'Did not override top-level file')
        } catch (e) {
            assert.fail(e.message)
        }
    })

    it('Generation', async () => {
        try {
            await integ.integrateAssets(schemaName, oldPath, newPath, mergedPath, locale, verbose)
        } catch (e) {
            assert.fail(e.message)
        }
    })


    test
        .stdout()
        .stderr()
        .command(['dialog:integrate', `${schemaName}`])
        .it('Detect bad schema', ctx => {
            expect(ctx.stderr)
                .to.contain('not a valid JSON Schema')
        })

    test
        .stdout()
        .stderr()
        .command(['dialog:integrate', `${schemaName}`, '-o', `${oldPath}`, '-n', `${newPath}`, '-m', `${mergedPath}`, '-l', `${locale}`,  '--verbose'])
        .it('Detect success', ctx => {
            expect(ctx.stderr)
                .to.contain('Generating')
        })
})
