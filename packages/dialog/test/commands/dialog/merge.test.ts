/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
// tslint:disable:no-console
// tslint:disable:no-object-literal-type-assertion

import {assert} from 'chai'
import * as fs from 'fs-extra'
import 'mocha'
import * as os from 'os'
import * as ppath from 'path'
import SchemaMerger from '../../../src/library/schemaMerger'
let srcDir = ppath.resolve('test/commands/dialog/')
let tempDir = ppath.join(os.tmpdir(), 'test.out')

function countMatches(pattern: string | RegExp, lines: string[]): number {
    let count = 0
    for (let line of lines) {
        if (line.match(pattern)) {
            ++count
        }
    }
    return count
}

async function merge(patterns: string[], output?: string, verbose?: boolean, noName?: boolean): Promise<[boolean, string[]]> {
    let lines: string[] = []
    let logger = msg => {
        console.log(msg)
        lines.push(msg)
    }
    let merger = new SchemaMerger(patterns, noName ? output || '' : output || ppath.join(tempDir, 'generated.schema'), verbose || false, logger, logger, logger, undefined, false, ppath.join(srcDir, 'nuget'))
    let merged = await merger.merge()
    return [merged, lines]
}

function fixPaths(resources: any) {
    let fun = (path: string) => path.substring(path.lastIndexOf('dialog') + 7).replace(/\\/g, '/')
    resources.includes = resources.includes.map(fun)
    resources.excludes = resources.excludes.map(fun)
}

async function compareResources(path: string, expected: any): Promise<void> {
    assert(fs.existsSync(path), 'missing resources')
    let resources = await fs.readJSON(path)
    fixPaths(resources)
    fixPaths(expected)
    let compare = JSON.stringify(resources) === JSON.stringify(expected)
    if (!compare) {
        console.log(`${JSON.stringify(resources)}\n!=\n${JSON.stringify(expected)}`)
    }
    assert(compare, 'Resources did not match')
}

describe('dialog:merge', async () => {
    before(async () => {
        // If you want to regenerate the oracle *.schema files, run schemas/makeschemas.cmd
        await fs.remove(tempDir)
        await fs.mkdirp(tempDir)
        process.chdir(srcDir)
    })

    it('app.schema', async () => {
        console.log('Start app.schema')
        let [merged, lines] = await merge(['schemas/*.schema'])
        assert(merged, 'Could not merge')
        assert(countMatches(/error|warning/i, lines) === 1, 'Error merging schemas')
        let oracle = await fs.readJSON('schemas/app.schema')
        let generatedPath = ppath.join(tempDir, 'generated.schema')
        let generated = await fs.readJSON(generatedPath)
        let oracles = JSON.stringify(oracle)
        let generateds = JSON.stringify(generated)
        if (oracles !== generateds) {
            console.log(`Oracle   : ${oracles.length}`)
            console.log(`Generated: ${generateds.length}`)
            let max = oracles.length
            if (max > generateds.length) {
                max = generateds.length
            }
            let idx: number
            for (idx = 0; idx < max; ++idx) {
                if (oracles[idx] !== generateds[idx]) {
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
                `Schema ${ppath.resolve(generatedPath)} does not match ${ppath.resolve('schemas/app.schema')}`)
        }
    })

    it('bad json', async () => {
        console.log('\nStart bad json')
        let [merged, lines] = await merge(['schemas/*.schema', 'schemas/badSchemas/badJson.schema'])
        assert(!merged, 'Merging should have failed')
        assert(countMatches(/error|warning/i, lines) === 2, 'Extra errors or warnings')
        assert(countMatches('Unexpected token', lines) === 1, 'Did not detect bad JSON')
    })

    it('schema mismatch', async () => {
        console.log('\nStart schema mismatch')
        let [merged, lines] = await merge(['schemas/*.schema', 'schemas/badSchemas/schemaMismatch.schema'])
        assert(merged, 'Merging failed')
        assert(countMatches(/error|warning/i, lines) === 2, 'Extra errors or warnings')
        assert(countMatches('does not match', lines) === 1, 'Did not detect schema mismatch')
    })

    it('no allof', async () => {
        console.log('\nStart no allof')
        let [merged, lines] = await merge(['schemas/*.schema', 'schemas/badSchemas/allof.schema'])
        assert(!merged, 'Merging should have failed')
        assert(countMatches(/error|warning/i, lines) === 2, 'Extra errors or warnings')
        assert(countMatches('allOf', lines) === 1, 'Did not detect allOf in schema')
    })

    it('missing extends', async () => {
        console.log('\nStart missing extends')
        let [merged, lines] = await merge(['schemas/*.schema', 'schemas/badSchemas/missingExtends.schema'])
        assert(!merged, 'Merging should have failed')
        assert(countMatches(/error|warning/i, lines) === 2, 'Extra errors or warnings')
        assert(countMatches('it is not included', lines) === 1, 'Did not detect missing extends in schema')
    })

    it('missing schema reference', async () => {
        console.log('\nStart missing schema reference')
        let [merged, lines] = await merge(['schemas/*.schema', 'schemas/badSchemas/missingSchemaRef.schema'])
        assert(!merged, 'Merging should have failed')
        assert(countMatches(/error|warning/i, lines) === 2, 'Extra errors or warnings')
        assert(countMatches('does not exist', lines) === 1, 'Did not detect missing schema ref')
    })

    it('bad role', async () => {
        console.log('\nStart bad role')
        let [merged, lines] = await merge(['schemas/*.schema', 'schemas/badSchemas/badRole.schema'])
        assert(!merged, 'Merging should have failed')
        assert(countMatches(/error|warning/i, lines) === 3, 'Extra errors or warnings')
        assert(countMatches('is not valid for component', lines) === 1, 'Did not detect bad component $role')
        assert(countMatches('is not valid in properties/foo', lines) === 1, 'Did not detect bad property $role')
    })

    it('duplicate $kind', async () => {
        console.log('\nStart duplicate $kind')
        let [merged, lines] = await merge(['schemas/*.schema', 'schemas/badSchemas/prompt.schema'])
        assert(!merged, 'Merging should have failed')
        assert(countMatches(/error|warning/i, lines) === 2, 'Extra errors or warnings')
        assert(countMatches('prompt.schema', lines) === 3, 'Did not detect duplicate $kind')
    })

    it('missing implementation', async () => {
        console.log('\nStart missing implementation')
        let [merged, lines] = await merge(['schemas/*.schema', 'schemas/badSchemas/missingImplementation.schema'])
        assert(!merged, 'Merging should have failed')
        assert(countMatches(/error|warning/i, lines) === 2, 'Extra errors or warnings')
        assert(countMatches('no implementations', lines) === 1, 'Did not detect missing implementations')
    })

    it('csproj', async () => {
        console.log('\nStart csproj')
        let [merged, lines] = await merge(['projects/project3/project3.csproj'], undefined, true)
        let errors = countMatches(/error|warning/i, lines)
        assert(errors === 0, 'Should not have got errors')
        assert(merged, 'Could not merge')
        assert(countMatches(/Following.*project3/, lines) === 1, 'Did not follow project1')
        assert(countMatches(/Following nuget.*nuget3.*1.0.0/, lines) === 1, 'Did not follow nuget3')
        assert(countMatches(/Parsing.*nuget3.schema/, lines) === 1, 'Missing nuget3.schema')
        let schema = await fs.readJSON(ppath.join(tempDir, 'generated.schema'))
        let nuget3 = schema.definitions.nuget3?.$package
        assert(nuget3?.name === 'nuget3', 'Did not generate $package.name')
        assert(nuget3?.version === '1.0.0', 'Did not generate $package.version')
    })

    it('csproj-errors', async () => {
        console.log('\nStart csproj')
        let [merged, lines] = await merge(['projects/project1/project1.csproj'], undefined, true)
        let errors = countMatches(/error|warning/i, lines)
        if (errors === 0) {
            assert(merged, 'Could not merge')
        } else {
            assert(!merged, 'Should not have merged schemas')
        }
        assert(countMatches(/Following.*project1/, lines) === 1, 'Did not follow project1')
        assert(countMatches(/Following nuget.*nuget1.*10.0.1/, lines) === 1, 'Did not follow nuget1')
        assert(countMatches(/Following.*project2/, lines) === 1, 'Did not follow project2')
        assert(countMatches(/Following nuget.*nuget2.*1.0.1/, lines) === 1, 'Did not follow nuget2')
        assert(countMatches(/Following nuget.*nuget3.*1.0.0/, lines) === 1, 'Did not follow nuget3')
        assert(countMatches(/Parsing.*nuget1-10.schema/, lines) === 1, 'Missing project1.schema')
        assert(countMatches(/Parsing.*nuget2.schema/, lines) === 1, 'Missing nuget2.schema')
        assert(countMatches(/Parsing.*nuget3.schema/, lines) === 1, 'Missing nuget3.schema')
        assert(countMatches(/Parsing.*project2.schema/, lines) === 1, 'Missing project2.schema')
        assert(countMatches(/override.lu/, lines) === 6, 'Missing override trace')
        assert(countMatches(/conflicts.lg/, lines) === 3, 'Missing conflicts')
        assert(countMatches(/multiple.dialog/, lines) === 3, 'Missing multiple definitions')
    })

    it('package.json', async () => {
        console.log('\nStart package.json')
        let [merged, lines] = await merge(['npm/node_modules/root-package/package.json'], undefined, true)
        assert(merged, 'Could not merge')
        assert(countMatches(/error|warning/i, lines) === 0, 'Extra errors or warnings')
        assert(countMatches('root-package.schema', lines) === 1, 'Missing root-package.schema')
        assert(countMatches('dependent-package.schema', lines) === 1, 'Missing dependent-package.schema')
        assert(countMatches('parent-package.schema', lines) === 1, 'Missing parent-package.schema')
        assert(countMatches('no-package.schema', lines) === 0, 'Extra no-package.schema')

        let schema = await fs.readJSON(ppath.join(tempDir, 'generated.schema'))
        let dependent = schema.definitions['dependent-package']?.$package
        assert(dependent?.name === 'dependent-package', 'Incorrect dependent-package $package.name')
        assert(dependent?.version === '1.0.0', 'Incorrext dependent-package $package.version')
        let parent = schema.definitions['parent-package']?.$package
        assert(parent?.name === 'parent-package', 'Incorrect parent-package $package.name')
        assert(parent?.version === '1.0.0', 'Incorrext parent-package $package.version')

        let path = ppath.join(tempDir, 'generated.resources')
        await compareResources(path,
            {
                includes: [
                    '..\\..\\..\\..\\source\\repos\\botframework-cli\\packages\\dialog\\test\\commands\\dialog\\npm\\node_modules\\root-package',
                    '..\\..\\..\\..\\source\\repos\\botframework-cli\\packages\\dialog\\test\\commands\\dialog\\npm\\node_modules\\root-package\\node_modules\\dependent-package',
                    '..\\..\\..\\..\\source\\repos\\botframework-cli\\packages\\dialog\\test\\commands\\dialog\\npm\\node_modules\\parent-package'
                ],
                excludes: [
                    '..\\..\\..\\..\\source\\repos\\botframework-cli\\packages\\source\\repos\\botframework-cli\\packages\\dialog\\test\\commands\\dialog\\npm\\node_modules\\root-package\\node_modules',
                    '..\\..\\..\\..\\source\\repos\\botframework-cli\\packages\\source\\repos\\botframework-cli\\packages\\dialog\\test\\commands\\dialog\\npm\\node_modules\\root-package\\node_modules\\dependent-package\\node_modules',
                    '..\\..\\..\\..\\source\\repos\\botframework-cli\\packages\\source\\repos\\botframework-cli\\packages\\dialog\\test\\commands\\dialog\\npm\\node_modules\\parent-package\\node_modules'
                ],
                extensions: [
                    '.schema',
                    '.lu',
                    '.lg',
                    '.qna',
                    '.dialog'
                ]
            })
    })

    it('nuspec', async () => {
        console.log('\nStart nuspec')
        try {
            let [merged, lines] = await merge(['nuget\\nuget1\\10.0.1\\nuget1.nuspec'], undefined, true, true)
            assert(merged, 'Could not merge')
            assert(fs.existsSync('nuget1.schema'), 'Did not infer output')
            assert(countMatches(/error|warning/i, lines) === 0, 'Extra errors or warnings')
            assert(countMatches('nuget1.nuspec', lines) === 1, 'Missing nuget1.nuspec')
            assert(countMatches('Override', lines) === 1, 'Missing override')
            await compareResources('nuget1.resources',
                {
                    includes: [
                        'nuget\\nuget1\\10.0.1',
                        'nuget\\nuget2\\1.0.1'
                    ],
                    excludes: [],
                    extensions: [
                        '.schema',
                        '.lu',
                        '.lg',
                        '.qna',
                        '.dialog'
                    ]
                })
        } finally {
            await fs.remove('nuget1.schema')
            await fs.remove('nuget1.resources')
        }
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
    ok = definitions.findIndex((d) => d.compare(definition) === 0) != -1
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
