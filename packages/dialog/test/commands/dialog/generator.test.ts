/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
// tslint:disable:no-console
// tslint:disable:no-object-literal-type-assertion

import { expect, test } from '@oclif/test';
import * as fs from 'fs-extra'
import 'mocha'
import * as os from 'os'
import * as ppath from 'path'
import * as ft from '../../../src/library/schema'
import * as gen from '../../../src/library/dialogGenerator'
import { fail } from 'assert';

describe('dialog:generate', async () => {
    let output = ppath.join(os.tmpdir(), 'sandwich.out')
    let schemaPath = 'test/commands/dialog/forms/sandwich.schema'
    let badSchema = 'test/commands/dialog/forms/bad-schema.schema'
    let notObject = 'test/commands/dialog/forms/not-object.schema'
    beforeEach(async () => {
        await fs.remove(output)
    })

    it('Generation', async () => {
        try {
            await gen.generate(schemaPath, output, undefined, ['en-us'], undefined, false, (type, msg) => {
                console.log(`${type}: ${msg}`)
            })
        } catch (e) {
            fail(e.message)
        }
    })

    it('Not object type', async () => {
        try {
            await ft.Schema.readSchema(notObject)
            fail('Did not detect bad schema');
        } catch (e) {
            expect(e.message).to.contain('must be of type object')
        }
    })

    it('Illegal schema', async () => {
        try {
            await ft.Schema.readSchema(badSchema)
            fail('Did not detect bad schema');
        } catch (e) {
            expect(e.message).to.contain('is not a valid JSON Schema')
        }
    })

    test
        .stdout()
        .stderr()
        .command(['dialog:generate', `${badSchema}`])
        .it('Detect bad schema', ctx => {
            expect(ctx.stderr)
                .to.contain('not a valid JSON Schema')
        })

    test
        .stdout()
        .stderr()
        .command(['dialog:generate', `${schemaPath}`, '-o', `${output}`, '--verbose'])
        .it('Detect success', ctx => {
            expect(ctx.stderr)
                .to.contain('Generating')
        })
})
