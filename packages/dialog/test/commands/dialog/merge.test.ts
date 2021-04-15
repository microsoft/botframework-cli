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
import * as merger from '../../../src/library/schemaMerger'
const nock = require('nock')

const srcDir = ppath.resolve('test/commands/dialog/')
const tempDir = ppath.join(os.tmpdir(), 'test.out')

function countMatches(pattern: string | RegExp, lines: string[]): number {
    let count = 0
    for (const line of lines) {
        if (line.match(pattern)) {
            ++count
        }
    }
    return count
}

async function merge(patterns: string[], output?: string, verbose?: boolean, schemaPath?: string, checkOnly?: boolean): Promise<[merger.Imports | undefined, string[]]> {
    const lines: string[] = []
    const logger = (msg: string) => {
        console.log(msg)
        lines.push(msg)
    }
    const outputDir = output ? ppath.join(tempDir, output) : ''
    const mergeClass = new merger.SchemaMerger(patterns,
        outputDir,
        undefined,
        checkOnly === undefined ? false : checkOnly,
        verbose || false,
        logger, logger, logger,
        undefined,
        schemaPath ? ppath.join(tempDir, schemaPath) : undefined,
        false,
        ppath.join(srcDir, 'nuget'))
    const merged = await mergeClass.merge()
    return [merged, lines]
}

// NOTE: If you update dialog:merge functionality you need to execute the makeOracles.cmd to update them
async function compareToOracle(name: string, oraclePath?: string): Promise<object> {
    const generatedPath = ppath.join(tempDir, name)
    const generated = await fs.readJSON(generatedPath)
    oraclePath = oraclePath ? ppath.join(tempDir, oraclePath) : ppath.join('oracles', name)
    const oracle = await fs.readJSON(oraclePath)
    const oracles = JSON.stringify(oracle)
    const generateds = JSON.stringify(generated)
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
            `${ppath.resolve(generatedPath)} does not match oracle ${ppath.resolve(oraclePath)}`)
    }
    return generated
}

async function modifyFile(path: string, pattern: RegExp, replacement: string) {
    let contents = await fs.readFile(path, 'utf-8')
    contents = contents.replace(pattern, replacement)
    await fs.writeFile(path, contents)
}

function checkMerged(merged: merger.Imports | undefined, adds: number, conflicts: number, deletes: number, unchanged: number, msg: string, components?: any[]) {
    if (merged) {
        // NOTE: This is useful to help write tests.
        // console.log(`adds: ${merged.added.length}, conflicts: ${merged.conflicts.length}, deleted: ${merged.deleted.length}, unchanged: ${merged.unchanged.length}`)
        // console.log(JSON.stringify(merged.components))
        assert(merged.added.length === adds, `Wrong number of adds ${msg}`)
        assert(merged.conflicts.length === conflicts, `Wrong number of conflicts ${msg}`)
        assert(merged.deleted.length === deletes, `Wrong number of deletes ${msg}`)
        assert(merged.unchanged.length === unchanged, `Wrong number of unchanged ${msg}`)
        if (components) {
            assert(merged.components.length === components.length, `Wrong number of components ${msg}`)
            for (let i = 0; i < components.length; ++i) {
                const actual: any = merged.components[i]
                const expected: any = components[i]
                for (const key of Object.keys(expected)) {
                    let actualVal = actual[key]
                    let expectedVal = expected[key]
                    if (Array.isArray(expectedVal)) {
                        assert(actualVal.length === expectedVal.length, `${actual.name}.${key} length ${actualVal.length} != ${expectedVal.length} ${msg}`)
                        for (let e = 0; e < actualVal.length; ++e) {
                            assert(actualVal[e] === expectedVal[e], `${actual.name}.${key}[${e}] ${actualVal[e]} != ${expectedVal[e]} ${msg}`)
                        }
                    } else {
                        if (key === 'path') {
                            actualVal = actualVal.replace(/\\/g, '/')
                            expectedVal = expectedVal.replace(/\\/g, '/')
                            assert(actualVal.endsWith(expectedVal),
                                `${actual.name}.${key} ${actualVal} does not end with ${expectedVal} ${msg}`)
                        } else {
                            assert(actualVal === expectedVal, `${actual.name}.${key} ${actualVal} != ${expectedVal} ${msg}`)
                        }
                    }
                }
            }
        }
    }
}

describe('dialog:merge', async () => {
    beforeEach(async () => {
        // If you want to regenerate the oracle *.schema files, run makeOracles.cmd
        await fs.remove(tempDir)
        await fs.mkdirp(tempDir)
        process.chdir(srcDir)
    })

    it('app.schema', async () => {
        console.log('Start app.schema')
        const [merged, lines] = await merge(['schemas/*.schema'], 'app.schema')
        assert(merged, 'Could not merge')
        assert(countMatches(/error|warning/i, lines) === 0, 'Error merging schemas')
        await compareToOracle('app.schema')
    })

    it('missing component schema', async () => {
        console.log('Start missing component schema')
        const [merged, lines] = await merge(['schemas/badSchemas/missingComponent.schema'], 'app.schema')
        assert(!merged, 'Merge should have failed')
        assert(countMatches(/status code 404/i, lines) === 1, 'No missing component schema')
    })

    it('mismatched component schema', async () => {
        console.log('Start missing component schema')
        const [merged, lines] = await merge(['schemas/*.schema', 'schemas/badSchemas/missingComponent.schema'], 'app.schema')
        assert(merged, 'Could not merge')
        assert(countMatches(/error|warning/i, lines) === 1, 'Too many errors or warnings')
        assert(countMatches(/does not match/i, lines) === 1, 'No mismatched component schema')
    })

    it('bad json', async () => {
        console.log('\nStart bad json')
        const [merged, lines] = await merge(['schemas/*.schema', 'schemas/badSchemas/badJson.schema'])
        assert(!merged, 'Merging should have failed')
        assert(countMatches(/error|warning/i, lines) === 1, 'Wrong number of errors or warnings')
        assert(countMatches('Unexpected token', lines) === 1, 'Did not detect bad JSON')
    })

    it('schema mismatch', async () => {
        console.log('\nStart schema mismatch')
        const [merged, lines] = await merge(['schemas/*.schema', 'schemas/badSchemas/schemaMismatch.schema'])
        assert(merged, 'Merging failed')
        assert(countMatches(/error|warning/i, lines) === 1, 'Wrong number of errors or warnings')
        assert(countMatches('does not match', lines) === 1, 'Did not detect schema mismatch')
    })

    it('no allof', async () => {
        console.log('\nStart no allof')
        const [merged, lines] = await merge(['schemas/*.schema', 'schemas/badSchemas/allof.schema'])
        assert(!merged, 'Merging should have failed')
        assert(countMatches(/error|warning/i, lines) === 1, 'Wrong number of errors or warnings')
        assert(countMatches('allOf', lines) === 1, 'Did not detect allOf in schema')
    })

    it('missing extends', async () => {
        console.log('\nStart missing extends')
        const [merged, lines] = await merge(['schemas/*.schema', 'schemas/badSchemas/missingExtends.schema'])
        assert(!merged, 'Merging should have failed')
        assert(countMatches(/error|warning/i, lines) === 1, 'Wrong number of errors or warnings')
        assert(countMatches('it is not included', lines) === 1, 'Did not detect missing extends in schema')
    })

    it('missing schema reference', async () => {
        console.log('\nStart missing schema reference')
        const [merged, lines] = await merge(['schemas/*.schema', 'schemas/badSchemas/missingSchemaRef.schema'])
        assert(!merged, 'Merging should have failed')
        assert(countMatches(/error|warning/i, lines) === 1, 'Wrong number of errors or warnings')
        assert(countMatches('does not exist', lines) === 1, 'Did not detect missing schema ref')
    })

    it('bad role', async () => {
        console.log('\nStart bad role')
        const [merged, lines] = await merge(['schemas/*.schema', 'schemas/badSchemas/badRole.schema'])
        assert(!merged, 'Merging should have failed')
        assert(countMatches(/error|warning/i, lines) === 2, 'Wrong number of errors or warnings')
        assert(countMatches('is not valid for component', lines) === 1, 'Did not detect bad component $role')
        assert(countMatches('is not valid in properties/foo', lines) === 1, 'Did not detect bad property $role')
    })

    it('duplicate $kind', async () => {
        console.log('\nStart duplicate $kind')
        const [merged, lines] = await merge(['schemas/*.schema', 'schemas/badSchemas/prompt.schema'])
        assert(!merged, 'Merging should have failed')
        assert(countMatches(/error|warning/i, lines) === 1, 'Wrong number of errors or warnings')
        assert(countMatches('prompt.schema', lines) === 3, 'Did not detect duplicate $kind')
    })

    it('missing implementation', async () => {
        console.log('\nStart missing implementation')
        const [merged, lines] = await merge(['schemas/*.schema', 'schemas/badSchemas/missingImplementation.schema'])
        assert(!merged, 'Merging should have failed')
        assert(countMatches(/error|warning/i, lines) === 1, 'Wrong number of errors or warnings')
        assert(countMatches('no implementations', lines) === 1, 'Did not detect missing implementations')
    })

    it('missing policy kind', async () => {
        console.log('\nStart missing policy kind')
        const [merged, lines] = await merge(['schemas/*.schema', 'schemas/badSchemas/missingPolicyKind.schema'])
        assert(!merged, 'Merging should have failed')
        assert(countMatches(/error|warning/i, lines) === 1, 'Wrong number of errors or warnings')
        assert(countMatches('non-existent', lines) === 1, 'Did not detect missing $kind')
    })

    it('csproj', async () => {
        console.log('\nStart csproj')
        const [merged, lines] = await merge(['projects/project3/project3.csproj'], 'project3.schema', true)
        assert(countMatches(/error|warning/i, lines) === 0, 'Should not have got errors')
        assert(merged, 'Could not merge')
        assert(countMatches(/Following.*project3/, lines) === 1, 'Did not follow project3')
        assert(countMatches(/Following nuget.*nuget3.*1.0.0/, lines) === 1, 'Did not follow nuget3')
        assert(countMatches(/Parsing.*nuget3.component1.schema/, lines) === 1, 'Missing nuget3.component1.schema')
        assert(countMatches(/Copying/i, lines) === 2, 'Wrong number of copies')
        assert(countMatches(/Copy /i, lines) === 6, 'Did not copy resources')
        assert(await fs.pathExists(ppath.join(tempDir, 'imported', 'nuget3', 'stuff', 'nuget3.qna')), 'Did not copy directory')
        await compareToOracle('project3.schema')
        await compareToOracle('project3.en-us.uischema')
        checkMerged(merged, 6, 0, 0, 0, '',
            [{
                name: 'nuget3',
                version: '1.0.0',
                path: 'nuget\\nuget3\\1.0.0\\nuget3.nuspec',
                description: 'Nuget 3',
                releaseNotes: 'Changed metatdata',
                authors: ['Chris Tom', 'John Mark'],
                keywords: ['a', 'good', 'thing'],
                icon: 'icon.png', repository: 'https://github.com',
                license: 'MIT',
                language: 'en-us', copyright: 'Mine only.', includesSchema: true, includesExports: true
            }])
    })

    it('csproj-errors', async () => {
        console.log('\nStart csproj-errors')
        const [merged, lines] = await merge(['projects/project1/project1.csproj'], undefined, true)
        assert(!merged, 'Merging should fail')
        assert(countMatches(/error|warning/i, lines) === 3, 'Wrong number of errors or warnings')
        assert(countMatches(/Following.*project1/, lines) === 1, 'Did not follow project1')
        assert(countMatches(/Following nuget.*nuget1.*10.0.1/, lines) === 1, 'Did not follow nuget1')
        assert(countMatches(/Following.*project2/, lines) === 1, 'Did not follow project2')
        assert(countMatches(/Following nuget.*nuget2.*1.0.1/, lines) === 1, 'Did not follow nuget2')
        assert(countMatches(/Following nuget.*nuget3.*1.0.0/, lines) === 1, 'Did not follow nuget3')
        assert(countMatches(/Parsing.*nuget1-10.schema/, lines) === 1, 'Missing project1.schema')
        assert(countMatches(/Parsing.*nuget2.schema/, lines) === 1, 'Missing nuget2.schema')
        assert(countMatches(/Parsing.*nuget3.component1.schema/, lines) === 1, 'Missing nuget3.component1.schema')
        assert(countMatches(/Parsing.*project2.schema/, lines) === 1, 'Missing project2.schema')
        assert(countMatches(/multiple.dialog/, lines) === 3, 'Missing multiple definitions')
    })

    it('csproj-uierrors', async () => {
        console.log('\nStart csproj-uierrors')
        const [merged, lines] = await merge(['projects/project4/project4.csproj'], 'project4.schema', true)
        assert(!merged, 'Merging should fail')
        assert(countMatches(/error|warning/i, lines) === 14, 'Wrong number of errors or warnings')
        assert(countMatches(/nokind does not exist/i, lines) === 1, 'Missing nokind')
        assert(countMatches(/nonExistentProperty/i, lines) === 8, 'Wrong number of non-existent properties')
        assert(countMatches(/order.nonExistentOrder/i, lines) === 4, 'Wrong number of non-existent orders')
        assert(countMatches(/missing \$schema/i, lines) === 1, 'Did not find missing schema')
    })

    it('csproj-config', async () => {
        console.log('\nStart csproj-config')
        const [merged, lines] = await merge(['projects/project5/project5.csproj'], 'project5.schema', true)
        assert(merged, 'Merging should succeed')
        assert(countMatches(/error|warning/i, lines) === 0, 'Wrong number of errors or warnings')
        assert(countMatches(/packages.config/i, lines) === 1, 'Missing packages.config')
        await compareToOracle('project5.schema')
        await compareToOracle('project5.en-us.uischema')
    })

    it('csproj-schema', async () => {
        console.log('\nStart csproj-schema')
        const [merged, lines] = await merge(['projects/project3/project3.csproj'], 'project3.schema', false)
        assert(countMatches(/error|warning/i, lines) === 0, 'Should not have got errors')
        assert(merged, 'Could not merge')
        const [merged2, lines2] = await merge(['projects/project3/project3.csproj'], 'project3-schema.schema', true, 'project3.schema')
        assert(countMatches(/error|warning/i, lines2) === 0, 'Should not have got errors')
        assert(countMatches(/using merged schema/i, lines2) === 1, 'Should use merged schema')
        assert(merged2, 'Could not merge')
        await compareToOracle('project3-schema.en-us.uischema', 'project3.en-us.uischema')
    })

    it('csproj-import', async () => {
        console.log('\nStart csproj-import')
        const project = ppath.join(tempDir, 'project3.csproj')
        await fs.emptyDir(tempDir)
        await fs.copyFile('projects/project3/project3.csproj', project)

        // First import
        console.log('\nFirst import')
        const [merged, lines] = await merge([project], 'project3.schema', false)
        assert(merged, 'Could not merge')
        assert(countMatches(/error|warning/i, lines) === 0, 'Error merging schemas')
        checkMerged(merged, 6, 0, 0, 0, 'initial')

        // Second import with no changes
        console.log('\nSecond import without changes')
        const [merged2, lines2] = await merge([project], 'project3.schema', false)
        assert(merged2, 'Could not merge 2nd')
        assert(countMatches(/error|warning/i, lines2) === 0, 'Error merging schemas 2nd')
        checkMerged(merged2, 1, 0, 0, 5, '2nd')

        // Third import with changes but check only
        console.log('\nThird import with check-only changes')
        const luPath = ppath.join(tempDir, 'imported/nuget3/nuget3.lu')
        const jpgPath = ppath.join(tempDir, 'imported/nuget3/nuget3.jpg')
        const deletedPath = ppath.join(tempDir, 'imported/nuget3/stuff/nuget3-deleted.dialog')
        await modifyFile(project, /1.0.0/, '1.0.1')
        await modifyFile(luPath, /intent/, 'intent modified')
        await modifyFile(ppath.join(tempDir, 'imported/nuget3/nuget3.lg'), /template/, 'template modified')
        await modifyFile(ppath.join(tempDir, 'imported/nuget3/stuff/nuget3.qna'), /question/, 'question modified')
        await modifyFile(ppath.join(tempDir, 'imported/nuget3/stuff/nuget3.dialog'), /dialog/, 'dialog modified')
        await modifyFile(jpgPath, /picture/, 'picture modified')
        const [merged3, lines3] = await merge([project], 'project3.schema', true, undefined, true)
        assert(merged3, 'Could not merge 3rd')
        assert(countMatches(/error/i, lines3) === 0, 'Error merging schemas 3rd')
        assert(countMatches(/warning/i, lines3) === 3, 'Wrong number of warnings 3rd')
        checkMerged(merged3, 1, 3, 1, 1, '3rd')
        assert(countMatches('modified', lines3) === 0, 'Missed deletion change 3rd')
        assert(countMatches('conflicting', lines3) === 3, 'Missed conflicts 3rd')
        assert((await fs.readFile(luPath, 'utf8')).includes('modified'), 'Wrote file in check-only')
        assert((await fs.readFile(jpgPath, 'utf8')).includes('modified'), 'Wrote file in check-only')
        assert(await fs.pathExists(deletedPath), 'Deleted file in check-only')

        // Fourth import with changes
        console.log('\nFourth import with changes')
        await modifyFile(deletedPath, /dialog/, 'dialog modified')
        const [merged4, lines4] = await merge([project], 'project3.schema', true, undefined, false)
        assert(merged4, 'Could not merge 4th')
        assert(countMatches(/error/i, lines4) === 0, 'Error merging schemas 4th')
        assert(countMatches(/warning/i, lines4) === 4, 'Wrong number of warnings 4th')
        assert(merged4?.added.length === 1, 'Wrong number added 4th')
        assert(merged4?.deleted.length === 0, 'Wrong number deleted 4th')
        assert(merged4?.unchanged.length === 1, 'Wrong number unchanged 4th')
        assert(merged4?.conflicts.length === 4, 'Wrong number of conflicts on 4th')
        assert(countMatches('modified', lines4) === 1, 'Missed deletion change 4th')
        assert(countMatches('conflicting', lines4) === 3, 'Missed conflicts 4th')
        assert(countMatches('Unchanged', lines4) === 1, 'Missed unchanged 4th')
        assert(countMatches('deleted', lines4) === 1, 'Missed delete 4th')
        assert((await fs.readFile(luPath, 'utf8')).includes('changed'), 'Did not write file')
        assert((await fs.readFile(jpgPath, 'utf8')).includes('changed'), 'Wrote file in check-only')
        assert(!await fs.pathExists(deletedPath), 'Did not delete file')

        // Fifth import with component removed
        console.log('\nFifth import removing reference')
        await modifyFile(project, /<PackageReference.*/, '')
        const [merged5, lines5] = await merge([project], 'project3.schema', true, undefined, false)
        assert(merged5, 'Could not merge 5th')
        assert(countMatches(/error/i, lines5) === 1, 'Error merging schemas 5th')
        assert(countMatches(/warning/i, lines5) === 1, 'Wrong number of warnings 5th')
        assert(merged5?.added.length === 0, 'Wrong number added 5th')
        assert(merged5?.deleted.length === 4, 'Wrong number deleted 5th')
        assert(merged5?.unchanged.length === 0, 'Wrong number unchanged 5th')
        assert(merged5?.conflicts.length === 1, 'Wrong number of conflicts on 5th')
        assert(!await fs.pathExists(ppath.join(tempDir, 'imported/nuget3')))
    })

    it('package.json', async () => {
        console.log('\nStart package.json')
        await fs.copy('npm/node_modules', ppath.join(tempDir, 'node_modules'))
        await fs.copy('schemas/packageBase.json', ppath.join(tempDir, 'packageBase.json'))
        const packageRoot = ppath.join(tempDir, 'node_modules/root-package/package.json')
        const [merged, lines] = await merge([packageRoot], 'root-package.schema', true)
        assert(merged, 'Could not merge')
        assert(countMatches(/error|warning/i, lines) === 0, 'Wrong number of errors or warnings')
        assert(countMatches('root-package.schema', lines) === 1, 'Missing root-package.schema')
        assert(countMatches('dependent-package.schema', lines) === 1, 'Missing dependent-package.schema')
        assert(countMatches('parent-package.schema', lines) === 1, 'Missing parent-package.schema')
        assert(countMatches('no-package.schema', lines) === 0, 'Extra no-package.schema')
        assert(countMatches('Copy ', lines) === 6, 'Wrong number of copies')
        assert(await fs.pathExists(ppath.join(tempDir, 'imported', 'dependent-package', 'assets', 'dependent-package.jpg')), 'Incomplete assets copy')
        assert(!await fs.pathExists(ppath.join(tempDir, 'imported', 'root-package')), 'Copied root')
        await compareToOracle('root-package.schema')
        await compareToOracle('root-package.uischema')
        checkMerged(merged, 6, 0, 0, 0, '',
            [{
                name: 'dependent-package',
                version: '1.0.0',
                path: 'node_modules\\root-package\\node_modules\\dependent-package\\package.json',
                description: 'A package',
                releaseNotes: 'A good time.',
                authors: ['Chris Tom'],
                keywords: ['somthing wicked', 'this way'],
                icon: 'icon.png',
                repository: 'https://github.com',
                license: 'MIT',
                language: 'en-us',
                copyright: 'mine',
                includesSchema: true,
                includesExports: true
            },
            {
                name: '@microsoft/scoped-package',
                version: '1.0.0',
                path: 'node_modules\\root-package\\node_modules\\@microsoft\\scoped-package\\package.json',
                description: '',
                releaseNotes: '',
                authors: ['Chris Tom, tom@botmail.com, https://christom.com'],
                keywords: [],
                icon: '',
                repository: 'https://github.com',
                license: '',
                language: '',
                copyright: '',
                includesSchema: false,
                includesExports: true
            },
            {
                name: 'parent-package',
                version: '1.0.0',
                path: 'node_modules\\parent-package\\package.json',
                description: '',
                releaseNotes: '',
                authors: ['Chris Tom, tom@botmail.com, https://christom.com'],
                keywords: [],
                icon: '',
                repository: 'https://github.com',
                license: '',
                language: '',
                copyright: '',
                includesSchema: true,
                includesExports: false
            }])

        // Remove scoped package
        console.log('Remove reference')
        await modifyFile(packageRoot, /.*@microsoft.*/, '')
        const [rmerged, rlines] = await merge([packageRoot], 'root-package.schema', true)
        assert(rmerged, 'Could not merge')
        assert(countMatches(/error|warning/i, rlines) === 0, 'Wrong number of errors or warnings')
        assert(countMatches(/unchanged/i, rlines) === 4, 'Wrong number of unchanged')
        assert(await fs.pathExists(ppath.join(tempDir, 'imported/dependent-package')), 'Dependent package imports missing')
        assert(!await fs.pathExists(ppath.join(tempDir, 'imported/@microsoft')), 'Scoped package not deleted')
    })

    it('nuspec', async () => {
        // This is more complicated because it is also testing the output name inference
        // which ends up in the directory where the command is run from
        console.log('\nStart nuspec')
        const path = ppath.join(tempDir, 'nuget1/')
        await fs.ensureDir(path)
        await fs.copy('nuget/nuget1/10.0.1/', path)
        await fs.copyFile('schemas/packageBase.json', ppath.join(path, 'packageBase.json'))
        await fs.copyFile(ppath.join(path, 'nuget1-10.schema.local'), ppath.join(path, 'nuget1-10.schema'))
        const cwd = process.cwd()
        try {
            process.chdir(path)
            const [merged, lines] = await merge(['nuget1.nuspec'], undefined, true)
            assert(merged, 'Could not merge')
            assert(fs.existsSync('nuget1.schema')
                && fs.existsSync('nuget1.en-us.uischema'),
                'Did not infer output')
            assert(countMatches(/error|warning/i, lines) === 0, 'Wrong number of errors or warnings')
            assert(countMatches('nuget1.nuspec', lines) === 1, 'Missing nuget1.nuspec')
        } finally {
            process.chdir(cwd)
        }
    })

    it('500 error', async () => {
        console.log('Start 500 error')
        const scope = nock('https://schemas.botframework.com')
            .get(/schemas/)
            .reply(500, 'Internal Server Error')
            .persist()
        const [merged, lines] = await merge(['schemas/*.schema'], 'app.schema')
        assert(!merged, 'Merging should fail')
        assert(countMatches(/status code 500/i, lines) === 1, 'Did not detect server error')
        scope.done()
        nock.cleanAll()
    })
})

/* TODO: These tests are related to verify and need to be updated and moved there.
it('packages', async () => {
    const json = await fs.readJSON('examples/packages.schema')
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
    const foo = tracker.cloneDialog('foo')
    assert(foo, 'Can't find dialog').to.equal(undefined)
    const original = tracker.findDialog('root')
    assert(original, 'Can't find dialog').to.not.equal(undefined)
    const copy = tracker.cloneDialog('root')
    if (original && copy) {
        const len = original.body.recognizers.length
        copy.body.recognizers.pop()
        assert(len === copy.body.recognizers.length + 1).is.true
        await tracker.updateDialog(copy)
        const newDialog = tracker.findDialog('root')
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
    const savesBefore = size(tracker.dialogs.filter((c) => c.save))
    await tracker.writeDialogs('Dialogs')
    const savesAfter = size(tracker.dialogs.filter((c) => c.save))
    assert(savesAfter).equals(0)
    const saved = 0
    for (const file of await glob('Dialogs/examples/*.dialog')) {
        const dialog = tracker.findDialogFile(file)
        assert(dialog, `${dialog} is not found as ${file}`).is.not.equal(undefined)
        ++saved
    }
    assert(saved).equals(savesBefore)
})

it('remove', () => {
    for (const dialog of tracker.dialogs) {
        tracker.removeDialog(dialog)
        verifyRemoved(tracker, dialog)
    }
})

it('files', async () => {
    for (const file of await glob(['../test/examples/*', '../test/schemas/*'])) {
        const newFile = ppath.join(process.cwd(), file.substring('../test/'.length))
        if (!await fs.pathExists(newFile)) {
            expect.fail(`${newFile} is missing`)
        }
        const contents = (await fs.readFile(file)).toString()
        const newContents = (await fs.readFile(newFile)).toString()
        assert(newContents === contents, `${newFile} has changed`).is.true
    }
})

function size<T>(iterable: Iterable<T>): number {
const i = 0
const it = iterable[Symbol.iterator]()
while (!it.next().done) ++i
return i
}

function verify(tracker: dt.DialogTracker) {
for (const def of tracker.allDefinitions()) {
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
for (const used of def.usedBy) {
    checkDef(used, tracker)
}
}

function findDefinition(definitions: undefined | dt.Definition[], definition: dt.Definition): boolean {
const ok = false
if (definitions) {
    ok = definitions.findIndex((d) => d.compare(definition) === 0) != -1
}
return ok
}

function verifyRemoved(tracker: dt.DialogTracker, dialog: dt.Dialog) {
for (const def of tracker.allDefinitions()) {
    assert(def.dialog).not.equal(dialog)
    for (const used of def.usedBy) {
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
