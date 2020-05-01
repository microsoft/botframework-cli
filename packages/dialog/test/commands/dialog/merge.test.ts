/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
// tslint:disable:no-console
// tslint:disable:no-object-literal-type-assertion

import { assert } from 'chai'
import * as fs from 'fs-extra'
import glob from 'globby'
import 'mocha'
import * as os from 'os'
import * as ppath from 'path'
import SchemaMerger from '../../../src/library/schemaMerger'
import * as dt from '../../../src/library/dialogTracker'

function countMatches(pattern: string | RegExp, lines: string[]): number {
    let count = 0
    for (let line of lines) {
        if (line.match(pattern)) {
            ++count
        }
    }
    return count
}

async function merge(patterns: string[], output?: string, verbose?: boolean): Promise<[boolean, string[]]> {
    let lines: string[] = []
    let logger = (msg) => {
        console.log(msg)
        lines.push(msg)
    }
    let merger = new SchemaMerger(patterns, output || 'generated.schema', verbose || false, logger, logger, logger)
    let merged = await merger.mergeSchemas()
    return [merged, lines]
}

describe('dialog:merge', async () => {
    let schemas = new dt.SchemaTracker()
    let tracker = new dt.DialogTracker(schemas)

    before(async () => {
        // If you want to regenerate the oracle *.schema files, run schemas/makeschemas.cmd
        let tempDir = ppath.join(os.tmpdir(), 'test.out')
        // console.log(`Test dir ${tempDir}`)

        await fs.remove(tempDir)
        await fs.mkdirp(tempDir)

        for (let file of await glob(['test/commands/dialog/schemas/**', 'test/commands/dialog/examples/**', 'test/commands/dialog/projects/**', 'test/commands/dialog/packages/**'])) {
            let target = ppath.join(tempDir, file.substring(file.indexOf('/') + 1).replace('commands/dialog', ''))
            await fs.copy(file, target)
        }
        process.chdir(tempDir)

        await fs.writeJSON('package.json', {
            dependencies: {
                'Newtonsoft.Json': '^13.0.2'
            }
        }) 
        await fs.mkdirp('node_modules')
        await fs.move('packages/Newtonsoft.Json', 'node_modules/Newtonsoft.Json')
    })

    it('app.schema', async () => {
        console.log('Start app.schema')
        let [merged, lines] = await merge(['schemas/*.schema'])
        assert(merged, 'Could not merge schemas')
        assert(countMatches(/error|warning/i, lines) == 1, 'Error merging schemas')
        let oracle = await fs.readJSON('schemas/app.schema')
        let generated = await fs.readJSON('generated.schema')
        delete oracle.$id
        delete generated.$id
        let oracles = JSON.stringify(oracle)
        let generateds = JSON.stringify(generated)
        if (oracles !== generateds) {
            console.log(`Oracle   : ${oracles.length}`)
            console.log(`Generated: ${generateds.length}`)
            let max = oracles.length
            if (max > generateds.length) {
                max == generateds.length
            }
            let idx: number
            for (idx = 0; idx < max; ++idx) {
                if (oracles[idx] != generateds[idx]) {
                    break;
                }
            }
            let start = idx - 40
            if (start < 0) {
                start = 0
            }
            let end = idx + 40
            if (end > max) {
                end = max
            }
            console.log(`Oracle   : ${oracles.substring(start, end)}`)
            console.log(`Generated: ${generateds.substring(start, end)}`)
            assert(false, 
                `Schema ${ppath.resolve('generated.schema')} does not match ${ppath.resolve('schemas/app.schema')}`)
        }
    })

    it('bad json', async () => {
        console.log('\nStart bad json')
        let [merged, lines] = await merge(['schemas/*.schema', 'schemas/badSchemas/badJson.schema'])
        assert(!merged, 'Merging should have failed')
        assert(countMatches(/error|warning/i, lines) == 2, 'Extra errors or warnings')
        assert(countMatches('Unexpected token', lines) == 1, 'Did not detect bad JSON')
    })

    it('schema mismatch', async () => {
        console.log('\nStart schema mismatch')
        let [merged, lines] = await merge(['schemas/*.schema', 'schemas/badSchemas/schemaMismatch.schema'])
        assert(merged, 'Merging failed')
        assert(countMatches(/error|warning/i, lines) == 2, 'Extra errors or warnings')
        assert(countMatches('does not match', lines) == 1, 'Did not detect schema mismatch')
    })

    it('no allof', async () => {
        console.log('\nStart no allof')
        let [merged, lines] = await merge(['schemas/*.schema', 'schemas/badSchemas/allof.schema'])
        assert(!merged, 'Merging should have failed')
        assert(countMatches(/error|warning/i, lines) == 2, 'Extra errors or warnings')
        assert(countMatches('allOf', lines) == 1, 'Did not detect allOf in schema')
    })

    it('missing extends', async () => {
        console.log('\nStart missing extends')
        let [merged, lines] = await merge(['schemas/*.schema', 'schemas/badSchemas/missingExtends.schema'])
        assert(!merged, 'Merging should have failed')
        assert(countMatches(/error|warning/i, lines) == 2, 'Extra errors or warnings')
        assert(countMatches('it is not included', lines) == 1, 'Did not detect missing extends in schema')
    })

    it('missing schema reference', async () => {
        console.log('\nStart missing schema reference')
        let [merged, lines] = await merge(['schemas/*.schema', 'schemas/badSchemas/missingSchemaRef.schema'])
        assert(!merged, 'Merging should have failed')
        assert(countMatches(/error|warning/i, lines) == 2, 'Extra errors or warnings')
        assert(countMatches('does not exist', lines) == 1, 'Did not detect missing schema ref')
    })

    it('bad role', async () => {
        console.log('\nStart bad role')
        let [merged, lines] = await merge(['schemas/*.schema', 'schemas/badSchemas/badRole.schema'])
        assert(!merged, 'Merging should have failed')
        assert(countMatches(/error|warning/i, lines) == 3, 'Extra errors or warnings')
        assert(countMatches('is not valid for component', lines) == 1, 'Did not detect bad component $role')
        assert(countMatches('is not valid in properties/foo', lines) == 1, 'Did not detect bad property $role')
    })

    it('duplicate $kind', async () => {
        console.log('\nStart duplicate $kind')
        let [merged, lines] = await merge(['schemas/*.schema', 'schemas/badSchemas/prompt.schema'])
        assert(!merged, 'Merging should have failed')
        assert(countMatches(/error|warning/i, lines) == 2, 'Extra errors or warnings')
        assert(countMatches('Redefines prompt', lines) == 1, 'Did not detect duplicate $kind')
    })

    it('missing implementation', async () => {
        console.log('\nStart missing implementation')
        let [merged, lines] = await merge(['schemas/*.schema', 'schemas/badSchemas/missingImplementation.schema'])
        assert(!merged, 'Merging should have failed')
        assert(countMatches(/error|warning/i, lines) == 2, 'Extra errors or warnings')
        assert(countMatches('no implementations', lines) == 1, 'Did not detect missing implementations')
    })
    
    it('csproj', async () => {
        console.log('\nStart csproj')
        let [merged, lines] = await merge(['projects/project1/project1.csproj'], undefined, true)
        let dotnet = countMatches(/global nuget/, lines)
        let missing = countMatches(/does not exist/, lines)
        let found = countMatches(/Following nuget/, lines)
        let errors = countMatches(/error|warning/i, lines)
        if (errors == 0) {
            assert(merged, 'Could not merge schemas')
        } else {
            assert(!merged, 'Should not have merged schemas')
            assert(errors == dotnet + missing, 'Extra errors')
            assert(dotnet == 2 || missing == 2 || missing + found == 2, 'Wrong number of errors')
        }
        assert(countMatches(/Following.*project1/, lines) == 1, 'Did not follow project1')
        assert(countMatches(/Following.*project2/, lines) == 1, 'Did not follow project2')
        assert(countMatches(/Parsing.*node.schema/, lines) == 1, 'Did not find node.schema')
    })

    it('package.json', async () => {
        console.log('\nStart package.json')
        let [merged, lines] = await merge(['package.json'], undefined, true)
        assert(merged, 'Could not merge schemas')
        assert(countMatches(/error|warning/i, lines) == 0, 'Extra errors or warnings')
        assert(countMatches('node.schema', lines) == 1, 'Did not pick up package.json dependency')
    })
})

/* TODO: These tests are related to verify and need to be updated and moved there.
it('packages', async () => {
    let json = await fs.readJSON('examples/packages.schema')
    assert(json.definitions.packages, 'Failed reading packages.config')
    assert(json.definitions.CSProj, 'Failed reading CSProj')
    assert(json.definitions.node, 'Failed reading package.json')
})

it('index all', () => assert(tracker.dialogs.length).equal(8))

it('errors', () => assert(tracker.dialogs.filter((f) => f.errors.length > 0).length).equal(3))

it('definitions', () => assert(size(tracker.allDefinitions())).equal(21))

it('missing', () => assert(size(tracker.missingDefinitions())).equal(2))

it('multiple', () => assert(size(tracker.multipleDefinitions())).equal(1))

it(`types`, () => assert(tracker.schema.typeToType.size).equal(5))

it('clone', async () => {
    let foo = tracker.cloneDialog('foo')
    assert(foo, 'Can't find dialog').to.equal(undefined)
    let original = tracker.findDialog('root')
    assert(original, 'Can't find dialog').to.not.equal(undefined)
    let copy = tracker.cloneDialog('root')
    if (original && copy) {
        let len = original.body.recognizers.length
        copy.body.recognizers.pop()
        assert(len === copy.body.recognizers.length + 1).is.true
        await tracker.updateDialog(copy)
        let newDialog = tracker.findDialog('root')
        if (newDialog) {
            assert(copy, 'Update should be object').is.equal(newDialog)
            assert(newDialog.save, 'Saved should be true').is.true
            verify(tracker)
        } else {
            expect.fail('Did not update')
        }
    } else {
        expect.fail('Can't clone')
    }
})

it('write', async () => {
    let savesBefore = size(tracker.dialogs.filter((c) => c.save))
    await tracker.writeDialogs('Dialogs')
    let savesAfter = size(tracker.dialogs.filter((c) => c.save))
    assert(savesAfter).equals(0)
    let saved = 0
    for (let file of await glob('Dialogs/examples/*.dialog')) {
        let dialog = tracker.findDialogFile(file)
        assert(dialog, `${dialog} is not found as ${file}`).is.not.equal(undefined)
        ++saved
    }
    assert(saved).equals(savesBefore)
})

it('remove', () => {
    for (let dialog of tracker.dialogs) {
        tracker.removeDialog(dialog)
        verifyRemoved(tracker, dialog)
    }
})

it('files', async () => {
    for (let file of await glob(['../test/examples/*', '../test/schemas/*'])) {
        let newFile = ppath.join(process.cwd(), file.substring('../test/'.length))
        if (!await fs.pathExists(newFile)) {
            expect.fail(`${newFile} is missing`)
        }
        let contents = (await fs.readFile(file)).toString()
        let newContents = (await fs.readFile(newFile)).toString()
        assert(newContents === contents, `${newFile} has changed`).is.true
    }
})

function size<T>(iterable: Iterable<T>): number {
let i = 0
let it = iterable[Symbol.iterator]()
while (!it.next().done) ++i
return i
}

function verify(tracker: dt.DialogTracker) {
for (let def of tracker.allDefinitions()) {
    checkDef(def, tracker)
}
}

function checkDef(def: dt.Definition, tracker: dt.DialogTracker): void {
if (def.id) {
    assert(findDefinition(tracker.idToDef.get(def.id), def), `${def} in idTo`).is.true
}
if (def.type) {
    assert(findDefinition(tracker.typeToDef.get(def.type.name), def), `${def} in idType`).is.true
} else {
    assert(findDefinition(tracker.missingTypes, def), `${def} in missingTypes`).is.true
}
for (let used of def.usedBy) {
    checkDef(used, tracker)
}
}

function findDefinition(definitions: undefined | dt.Definition[], definition: dt.Definition): boolean {
let ok = false
if (definitions) {
    ok = definitions.findIndex((d) => d.compare(definition) == 0) != -1
}
return ok
}

function verifyRemoved(tracker: dt.DialogTracker, dialog: dt.Dialog) {
for (let def of tracker.allDefinitions()) {
    assert(def.dialog).not.equal(dialog)
    for (let used of def.usedBy) {
        assert(used.dialog).not.equal(dialog)
    }
}
}

*/
// describe('dialog:merge', () => {
//   test
//     .stdout()
//     .command(['dialog:merge'])
//     .it('runs hello', ctx => {
//       assert(ctx.stdout).to.contain('hello world')
//     })

//   test
//     .stdout()
//     .command(['dialog:merge', '--name', 'jeff'])
//     .it('runs hello --name jeff', ctx => {
//       assert(ctx.stdout).to.contain('hello jeff')
//     })
// })
