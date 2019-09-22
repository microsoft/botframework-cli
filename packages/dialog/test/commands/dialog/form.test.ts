/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
// tslint:disable:no-console
// tslint:disable:no-object-literal-type-assertion

import { expect, test } from '@oclif/test';
import * as fs from 'fs-extra'
import 'mocha'
import * as os from 'os'
import * as ppath from 'path'
import * as ft from '../../../src/library/formSchema'
import * as gen from '../../../src/library/formGenerator'
import { fail } from 'assert';

describe('dialog:form', async () => {
    let output = ppath.join(os.tmpdir(), 'sandwich.out')
    let schemaPath = 'test/commands/dialog/forms/sandwich.form.dialog'
    let badSchema = 'test/commands/dialog/forms/bad-schema.form.dialog'
    let notObject = 'test/commands/dialog/forms/not-object.form.dialog'
    beforeEach(async () => {
        await fs.remove(output)
    })

    it('Not object type', async () => {
        try {
            await ft.FormSchema.readSchema(notObject)
            fail('Did not detect bad schema');
        } catch (e) {
            expect(e.message).to.contain('must be of type object')
        }
    })

    it('Illegal schema', async () => {
        try {
            await ft.FormSchema.readSchema(badSchema)
            fail('Did not detect bad schema');
        } catch (e) {
            expect(e.message).to.contain('is not a valid JSON Schema')
        }
    })

    it('Generation', async () => {
        try {
            let schema = await ft.FormSchema.readSchema(schemaPath)
            await gen.generate(schema, output, undefined, ['en-us'])
        } catch (e) {
            fail(e.message)
        }
    })

    test
        .stdout()
        .stderr()
        .command(['dialog:form', `${badSchema}`])
        .it('Detect bad schema', ctx => {
            expect(ctx.stderr)
                .to.contain('not a valid JSON Schema')
        })

    test
        .stdout()
        .stderr()
        .command(['dialog:form', `${schemaPath}`, '-o', `${output}`, '--verbose'])
        .it('Detect success', ctx => {
            expect(ctx.stderr)
                .to.contain('Generating')
        })
})
